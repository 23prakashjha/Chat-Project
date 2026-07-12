import { useState, useCallback } from 'react';
import { useChat } from '../context/ChatContext';
import { useSocket } from '../hooks/useSocket';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import UserList from './UserList';

const ChatWindow = () => {
  const { username, logout } = useChat();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const {
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
    fetchUserMessages,
    clearViewingUser,
  } = useSocket(username);

  const toggleSidebar = useCallback(() => {
    setShowMobileSidebar((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setShowMobileSidebar(false);
  }, []);

  const handleViewUser = useCallback((targetUsername) => {
    fetchUserMessages(targetUsername);
    closeSidebar();
  }, [fetchUserMessages, closeSidebar]);

  const displayMessages = viewingUser ? viewingMessages : messages;
  const displaySystemMessages = viewingUser ? [] : systemMessages;

  return (
    <div className="h-screen flex bg-surface-0 overflow-hidden">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="absolute inset-0 mesh-bg pointer-events-none" />

        <div className="relative flex flex-col h-full z-10">
          <ChatHeader
            username={username}
            isConnected={isConnected}
            onlineUsers={onlineUsers}
            onToggleSidebar={toggleSidebar}
            viewingUser={viewingUser}
            onBackToChat={clearViewingUser}
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            {viewingUser ? (
              <>
                <MessageList
                  messages={displayMessages}
                  systemMessages={displaySystemMessages}
                  username={username}
                />

                <TypingIndicator typingUsers={typingUsers} currentUsername={username} />
                <MessageInput
                  onSendMessage={sendMessage}
                  onTypingStart={startTyping}
                  onTypingStop={stopTyping}
                  disabled={!isConnected}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="max-w-2xl text-center animate-fade-in">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-accent-purple rounded-3xl blur-3xl opacity-20 animate-pulse" />
                    <div className="relative w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-accent-purple flex items-center justify-center shadow-2xl">
                      <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                      </svg>
                    </div>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    Welcome to <span className="text-gradient">ChatFlow</span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-400 mb-8 leading-relaxed">
                    A modern real-time chat application built with React, Socket.io, and Node.js. 
                    Connect with friends instantly, send private messages, and enjoy seamless communication.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-all duration-300">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-purple/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.75a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1-.75-.75v-3.75a.75.75 0 0 1 .75-.75Zm7.5 0h3.75a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v-3.75a.75.75 0 0 1 .75-.75Zm7.5 0h3.75a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-.75.75h-3.75a.75.75 0 0 1-.75-.75v-3.75a.75.75 0 0 1 .75-.75Z" />
                        </svg>
                      </div>
                      <h3 className="text-white font-semibold mb-2">Real-time</h3>
                      <p className="text-sm text-slate-500">Instant messaging with WebSocket technology</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-all duration-300">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                      </div>
                      <h3 className="text-white font-semibold mb-2">Private Chats</h3>
                      <p className="text-sm text-slate-500">Secure one-on-one conversations</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-all duration-300">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-cyan/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                        </svg>
                      </div>
                      <h3 className="text-white font-semibold mb-2">User Presence</h3>
                      <p className="text-sm text-slate-500">See who's online in real-time</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                    <svg className="w-4 h-4 text-brand-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                    </svg>
                    <span>Select a user from the sidebar to start chatting</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <UserList
          users={onlineUsers}
          currentUsername={username}
          onLogout={logout}
          onViewUser={handleViewUser}
          viewingUser={viewingUser}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={closeSidebar}
          />
          <div className="absolute right-0 top-0 bottom-0 animate-slide-left">
            <UserList
              users={onlineUsers}
              currentUsername={username}
              onLogout={() => {
                closeSidebar();
                logout();
              }}
              onViewUser={handleViewUser}
              viewingUser={viewingUser}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
