const SystemMessage = ({ message }) => {
  const isJoin = message.type === 'join';

  return (
    <div className="flex items-center justify-center gap-2 py-3 animate-fade-in">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.03]" />
      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-colors duration-300 ${
        isJoin
          ? 'bg-accent-green/[0.03] border-accent-green/[0.08]'
          : 'bg-accent-orange/[0.03] border-accent-orange/[0.08]'
      }`}>
        {isJoin ? (
          <svg className="w-3 h-3 text-accent-green/70" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-accent-orange/70" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.5 10a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7Z" />
          </svg>
        )}
        <span className={`text-[11px] font-medium ${isJoin ? 'text-accent-green/60' : 'text-accent-orange/60'}`}>
          {message.message}
        </span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.03]" />
    </div>
  );
};

export default SystemMessage;
