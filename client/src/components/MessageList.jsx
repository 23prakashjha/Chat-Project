import { useRef, useEffect, useMemo } from 'react';
import MessageItem from './MessageItem';
import SystemMessage from './SystemMessage';

const MessageList = ({ messages, systemMessages, username }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, systemMessages]);

  const allItems = useMemo(() => {
    return [
      ...systemMessages.map((msg, i) => ({ ...msg, id: `system-${i}`, type: 'system' })),
      ...messages.map((msg) => ({ ...msg, type: 'message' }))
    ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [messages, systemMessages]);

  const shouldShowAvatar = (item, index) => {
    if (index === 0) return true;
    const prev = allItems[index - 1];
    if (!prev || prev.type === 'system') return true;
    if (item.type === 'system') return true;
    if (item.username !== prev.username) return true;
    const diff = new Date(item.createdAt) - new Date(prev.createdAt);
    return diff > 60000;
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-0.5"
    >
      {allItems.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in">
          <div className="relative mb-8">
            <div className="absolute -inset-8 bg-gradient-to-r from-brand-500/10 via-accent-purple/10 to-accent-pink/10 rounded-full blur-3xl animate-pulse" />

            <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-accent-purple flex items-center justify-center shadow-[0_0_60px_rgba(76,110,245,0.3)] animate-float">
              <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </div>

            <div className="absolute -top-2 -right-3 w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-emerald-400 flex items-center justify-center shadow-lg animate-float-delayed opacity-80">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>

            <div className="absolute -bottom-1 -left-4 w-9 h-9 rounded-xl bg-gradient-to-br from-accent-purple to-pink-400 flex items-center justify-center shadow-lg animate-float-slow opacity-80">
              <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
            Welcome to <span className="text-gradient">ChatFlow</span>
          </h2>
          <p className="text-sm text-slate-400 max-w-[300px] mb-8 leading-relaxed">
            Your personal space for real-time conversations. Break the ice and start chatting!
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-xs text-slate-400 font-medium">Real-time messaging</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <svg className="w-3.5 h-3.5 text-accent-purple" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-slate-400 font-medium">Private & secure</span>
            </div>
          </div>
        </div>
      )}

      {allItems.map((item, index) => {
        if (item.type === 'system') {
          return <SystemMessage key={item.id} message={item} />;
        }

        const showAvatar = shouldShowAvatar(item, index);

        return (
          <MessageItem
            key={item._id}
            message={item}
            isOwn={item.username === username}
            showAvatar={showAvatar}
            isFirstInGroup={showAvatar}
          />
        );
      })}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
