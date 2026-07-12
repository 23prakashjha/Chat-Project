const Message = require('../models/Message');

const getMessages = async (req, res) => {
  try {
    const { room = 'general', limit = 50, before } = req.query;
    
    const query = { room };
    
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }
    
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();
    
    res.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { username, content, room = 'general' } = req.body;
    
    if (!username || !content) {
      return res.status(400).json({ error: 'Username and content are required' });
    }
    
    const message = new Message({
      username,
      content,
      room
    });
    
    await message.save();
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    if (!message.readBy.includes(username)) {
      message.readBy.push(username);
      await message.save();
    }
    
    res.json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  markAsRead
};
