const avatarColors = [
  'from-blue-400 to-cyan-400',
  'from-purple-400 to-pink-400',
  'from-emerald-400 to-teal-400',
  'from-amber-400 to-orange-400',
  'from-rose-400 to-pink-400',
  'from-indigo-400 to-blue-400',
  'from-cyan-400 to-sky-400',
  'from-fuchsia-400 to-purple-400',
];

const getAvatarColor = (name) => {
  const idx = name ? name.charCodeAt(0) % avatarColors.length : 0;
  return avatarColors[idx];
};

const ChatHeader = ({ username, isConnected, onlineUsers, onToggleSidebar, viewingUser, onBackToChat }) => {
  return (
    <div className="relative flex items-center justify-between px-4 md:px-6 py-3.5 glass-strong border-b border-white/[0.04] z-20">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />

      <div className="flex items-center gap-3 md:gap-4">
        {viewingUser && (
          <button
            onClick={onBackToChat}
            className="group p-2 -ml-2 text-brand-400 hover:text-white hover:bg-brand-500/10 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/10"
          >
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
        )}

        {!viewingUser && (
          <button
            onClick={onToggleSidebar}
            className="group lg:hidden p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
          >
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        )}

        <div className="relative flex-shrink-0">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${
            viewingUser ? getAvatarColor(viewingUser) : 'from-brand-500 to-accent-purple'
          } flex items-center justify-center shadow-lg transition-all duration-300 ${
            viewingUser ? 'shadow-brand-500/30' : 'shadow-brand-500/20'
          }`}>
            {viewingUser ? (
              <span className="text-white font-bold text-sm drop-shadow-lg">
                {viewingUser.charAt(0).toUpperCase()}
              </span>
            ) : (
              <svg className="w-5.5 h-5.5 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            )}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[2.5px] border-surface-2 transition-colors duration-300 ${
            isConnected ? 'bg-accent-green status-pulse' : 'bg-accent-red'
          }`} />
        </div>

        <div className="min-w-0">
          {viewingUser ? (
            <>
              <h1 className="text-base font-bold text-white tracking-tight">{viewingUser}</h1>
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <p className="text-xs text-accent-purple/80">Viewing chat history</p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-base font-bold tracking-tight">
                <span className="text-gradient">ChatFlow</span>
              </h1>
              <div className="flex items-center gap-1.5">
                {isConnected ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                    <span className="text-xs text-slate-400">Connected</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
                    <span className="text-xs text-accent-red/80">Reconnecting...</span>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2.5 pl-3 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-all duration-300">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-accent-green status-pulse' : 'bg-accent-red'}`} />
          <span className="text-sm font-medium text-slate-300">{username}</span>
        </div>

        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
