const TypingIndicator = ({ typingUsers, currentUsername }) => {
  const others = typingUsers.filter((u) => u !== currentUsername);

  if (others.length === 0) return null;

  const getText = () => {
    if (others.length === 1) return `${others[0]} is typing`;
    if (others.length === 2) return `${others[0]} and ${others[1]} are typing`;
    return `${others[0]} and ${others.length - 1} others are typing`;
  };

  return (
    <div className="flex items-center gap-2 px-4 md:px-6 py-1.5 animate-slide-up">
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
        <div className="flex items-center gap-[3px] h-4">
          <span className="typing-dot w-[3px] h-3 bg-brand-400 rounded-full" />
          <span className="typing-dot w-[3px] h-3 bg-brand-400 rounded-full" />
          <span className="typing-dot w-[3px] h-3 bg-brand-400 rounded-full" />
        </div>
        <span className="text-xs text-slate-500">{getText()}</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
