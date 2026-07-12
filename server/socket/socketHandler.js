const Message = require('../models/Message');
const User = require('../models/User');

const connectedUsers = new Map();
const typingUsers = new Map();
const lastNotification = new Map();

const emitAllUsers = async (io) => {
  try {
    const allUsers = await User.find().sort({ status: 1, username: 1 }).lean();
    const enriched = allUsers.map((u) => ({
      id: u.username,
      username: u.username,
      status: u.status,
      lastSeen: u.lastSeen
    }));
    io.emit('users:update', enriched);
  } catch (error) {
    console.error('Error emitting all users:', error);
    const online = [...connectedUsers.values()].map((u) => ({
      id: u.username,
      username: u.username,
      status: 'online',
      lastSeen: u.lastSeen
    }));
    io.emit('users:update', online);
  }
};

const getPrivateRoom = (user1, user2) => {
  return [user1, user2].sort().join('_');
};

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    
    socket.on('user:join', async (username) => {
      try {
        connectedUsers.set(socket.id, {
          id: socket.id,
          username,
          status: 'online',
          lastSeen: new Date()
        });

        const existingUser = await User.findOne({ username }).lean();

        await User.findOneAndUpdate(
          { username },
          { status: 'online', lastSeen: new Date() },
          { upsert: true, new: true }
        );

        socket.join('general');
        
        await emitAllUsers(io);

        const recentMessages = await Message.find({ room: 'general', type: 'message' })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();

        const recentSystemMessages = await Message.find({ room: 'general', type: { $in: ['join', 'leave'] } })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();

        socket.emit('messages:history', recentMessages.reverse());
        socket.emit('system:history', recentSystemMessages.reverse());
        
        if (!existingUser) {
          const now = Date.now();
          const lastSeen = lastNotification.get(`join-${username}`) || 0;
          
          if (now - lastSeen > 5000) {
            lastNotification.set(`join-${username}`, now);

            const joinMsg = new Message({
              username,
              content: `${username} has joined the chat`,
              room: 'general',
              type: 'join'
            });
            await joinMsg.save();

            io.emit('system:message', joinMsg.toObject());
          }
        }
      } catch (error) {
        console.error('Error in user:join:', error);
        const online = [...connectedUsers.values()].map((u) => ({
          id: u.username,
          username: u.username,
          status: 'online',
          lastSeen: u.lastSeen
        }));
        socket.emit('users:update', online);
        socket.emit('messages:history', []);
      }
    });
    
    socket.on('message:send', async (data) => {
      try {
        const { username, content, to, room = 'general' } = data;
        
        if (!username || !content) {
          return socket.emit('error', { message: 'Username and content are required' });
        }
        
        let targetRoom = room;
        if (to) {
          targetRoom = getPrivateRoom(username, to);
        }
        
        const message = new Message({
          username,
          to: to || null,
          content,
          room: targetRoom
        });
        
        await message.save();
        
        if (to) {
          io.to(targetRoom).emit('message:new', message.toObject());
        } else {
          io.emit('message:new', message.toObject());
        }
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
    
    socket.on('typing:start', (username) => {
      typingUsers.set(socket.id, username);
      socket.broadcast.emit('typing:update', {
        username,
        isTyping: true
      });
    });
    
    socket.on('typing:stop', (username) => {
      typingUsers.delete(socket.id);
      socket.broadcast.emit('typing:update', {
        username,
        isTyping: false
      });
    });
    
    socket.on('message:read', async (data) => {
      try {
        const { messageId, username } = data;
        
        const message = await Message.findById(messageId);
        
        if (message && !message.readBy.includes(username)) {
          message.readBy.push(username);
          await message.save();
          
          io.emit('message:readUpdate', {
            messageId,
            readBy: message.readBy
          });
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    socket.on('messages:fetch-user', async (targetUsername) => {
      try {
        const currentUser = connectedUsers.get(socket.id)?.username;
        if (!currentUser) {
          return socket.emit('messages:user-history', { username: targetUsername, messages: [] });
        }
        
        const privateRoom = getPrivateRoom(currentUser, targetUsername);
        socket.join(privateRoom);
        
        const privateMessages = await Message.find({ room: privateRoom, type: 'message' })
          .sort({ createdAt: 1 })
          .lean();

        const generalMessages = await Message.find({ room: 'general', username: targetUsername, type: 'message' })
          .sort({ createdAt: 1 })
          .lean();

        const allUserMessages = [...privateMessages, ...generalMessages]
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        socket.emit('messages:user-history', {
          username: targetUsername,
          messages: allUserMessages
        });
      } catch (error) {
        console.error('Error fetching user messages:', error);
        socket.emit('messages:user-history', { username: targetUsername, messages: [] });
      }
    });

    socket.on('messages:fetch-general', async () => {
      try {
        const recentMessages = await Message.find({ room: 'general', type: 'message' })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();

        const recentSystemMessages = await Message.find({ room: 'general', type: { $in: ['join', 'leave'] } })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();

        socket.emit('messages:history', recentMessages.reverse());
        socket.emit('system:history', recentSystemMessages.reverse());
      } catch (error) {
        console.error('Error fetching general messages:', error);
        socket.emit('messages:history', []);
        socket.emit('system:history', []);
      }
    });
    
    socket.on('disconnect', async () => {
      try {
        const user = connectedUsers.get(socket.id);
        
        if (user) {
          connectedUsers.delete(socket.id);
          typingUsers.delete(socket.id);
          
          const stillConnected = [...connectedUsers.values()].some(
            (u) => u.username === user.username
          );
          
          if (!stillConnected) {
            await User.findOneAndUpdate(
              { username: user.username },
              { status: 'offline', lastSeen: new Date() }
            );
          }

          await emitAllUsers(io);
          
          if (!stillConnected) {
            const now = Date.now();
            const lastSeen = lastNotification.get(`leave-${user.username}`) || 0;
            
            if (now - lastSeen > 5000) {
              lastNotification.set(`leave-${user.username}`, now);

              const leaveMsg = new Message({
                username: user.username,
                content: `${user.username} has left the chat`,
                room: 'general',
                type: 'leave'
              });
              await leaveMsg.save();

              io.emit('system:message', leaveMsg.toObject());
            }
          }
        }
      } catch (error) {
        console.error('Error in disconnect:', error);
        await emitAllUsers(io);
      }
      
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
