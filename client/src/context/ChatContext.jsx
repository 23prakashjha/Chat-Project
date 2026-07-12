import { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('chatUsername') || '';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('chatUsername');
  });

  const login = (name) => {
    if (name.trim()) {
      setUsername(name.trim());
      localStorage.setItem('chatUsername', name.trim());
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    setUsername('');
    localStorage.removeItem('chatUsername');
    setIsLoggedIn(false);
  };

  const value = {
    username,
    isLoggedIn,
    login,
    logout
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
