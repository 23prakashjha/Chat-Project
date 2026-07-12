import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

export const useSocket = (username) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [systemMessages, setSystemMessages] = useState([]);
  const [viewingUser, setViewingUser] = useState(null);
  const [viewingMessages, setViewingMessages] = useState([]);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const viewingUserRef = useRef(null);

  useEffect(() => {
    viewingUserRef.current = viewingUser;
  }, [viewingUser]);

  useEffect(() => {
    if (!username) return;

    let cancelled = false;
    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['polling', 'websocket']
    });

    newSocket.on('connect', () => {
      if (cancelled) return;
      setIsConnected(true);
      newSocket.emit('user:join', username);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('messages:history', (history) => {
      setMessages(history);
    });

    newSocket.on('system:history', (history) => {
      setSystemMessages(history.map((msg) => ({
        ...msg,
        type: msg.type,
        key: msg._id
      })));
    });

    newSocket.on('message:new', (message) => {
      if (message.room === 'general') {
        setMessages((prev) => [...prev, message]);
      }
      const currentViewingUser = viewingUserRef.current;
      if (currentViewingUser && message.room === [username, currentViewingUser].sort().join('_')) {
        setViewingMessages((prev) => [...prev, message]);
      }
    });

    newSocket.on('system:message', (message) => {
      setSystemMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) {
          return prev;
        }
        return [...prev, { ...message, type: message.type, key: message._id }];
      });
    });

    newSocket.on('users:update', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('typing:update', ({ username: user, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          if (!prev.includes(user)) {
            return [...prev, user];
          }
          return prev;
        } else {
          return prev.filter((u) => u !== user);
        }
      });
    });

    newSocket.on('user:connected', (data) => {
    });

    newSocket.on('user:disconnected', (data) => {
    });

    newSocket.on('message:readUpdate', ({ messageId, readBy }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, readBy } : msg
        )
      );
    });

    newSocket.on('messages:user-history', ({ username: targetUser, messages: userMessages }) => {
      setViewingUser(targetUser);
      setViewingMessages(userMessages);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    return () => {
      cancelled = true;
      newSocket.close();
    };
  }, [username]);

  const sendMessage = useCallback((content) => {
    if (socket && username && content.trim()) {
      socket.emit('message:send', {
        username,
        to: viewingUser || null,
        content: content.trim(),
        room: viewingUser ? null : 'general'
      });
    }
  }, [socket, username, viewingUser]);

  const startTyping = useCallback(() => {
    if (socket && !isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit('typing:start', username);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (socket) {
        isTypingRef.current = false;
        socket.emit('typing:stop', username);
      }
    }, 2000);
  }, [socket, username]);

  const stopTyping = useCallback(() => {
    if (socket && isTypingRef.current) {
      isTypingRef.current = false;
      socket.emit('typing:stop', username);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [socket, username]);

  const markAsRead = useCallback((messageId) => {
    if (socket && username) {
      socket.emit('message:read', { messageId, username });
    }
  }, [socket, username]);

  const fetchUserMessages = useCallback((targetUsername) => {
    if (socket) {
      socket.emit('messages:fetch-user', targetUsername);
    }
  }, [socket]);

  const clearViewingUser = useCallback(() => {
    setViewingUser(null);
    setViewingMessages([]);
    if (socket) {
      socket.emit('messages:fetch-general');
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    onlineUsers,
    typingUsers,
    messages,
    systemMessages,
    viewingUser,
    viewingMessages,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    fetchUserMessages,
    clearViewingUser
  };
};
