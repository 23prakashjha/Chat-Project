const UserList = ({ users, currentUsername, onLogout, onViewUser, viewingUser }) => {
  const getInitial = (name) => name?.charAt(0).toUpperCase() || '?';

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

  const otherUsers = users.filter((u) => u.username !== currentUsername);

  return (
    <div className="w-72 lg:w-64 h-full flex flex-col bg-surface-2 border-l border-white/[0.04]">
      <div className="relative px-5 py-4 border-b border-white/[0.04]">
        <div className="absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Users</h2>
          <span className="flex items-center justify-center min-w-[24px] h-6 px-2 rounded-lg bg-brand-500/10 border border-brand-500/20 text-[11px] font-bold text-brand-400">
            {otherUsers.length + 1}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        <div className="relative p-3 rounded-xl bg-brand-500/[0.06] border border-brand-500/[0.08] group">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarColor(currentUsername)} flex items-center justify-center text-white font-bold text-xs shadow-lg`}>
                {getInitial(currentUsername)}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent-green border-2 border-surface-2 status-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{currentUsername}</p>
              <p className="text-[10px] font-medium text-brand-400/70 uppercase tracking-wider">You</p>
            </div>
          </div>
        </div>

        {otherUsers.length > 0 && (
          <div className="px-2 pt-2 pb-1">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
              All Members ({otherUsers.length})
            </p>
          </div>
        )}

        {otherUsers.map((user, i) => (
          <div
            key={user.username}
            onClick={() => onViewUser(user.username)}
            className={`group p-3 rounded-xl transition-all duration-200 cursor-pointer ${
              viewingUser === user.username
                ? 'bg-brand-500/10 border border-brand-500/20'
                : 'hover:bg-white/[0.03] border border-transparent'
            }`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarColor(user.username)} flex items-center justify-center text-white font-bold text-xs shadow-md transition-transform duration-300 group-hover:scale-105`}>
                  {getInitial(user.username)}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-2 transition-colors duration-300 ${
                  user.status === 'online' ? 'bg-accent-green status-pulse' : 'bg-slate-600'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors duration-200">{user.username}</p>
                <p className={`text-[10px] capitalize ${user.status === 'online' ? 'text-accent-green/70' : 'text-slate-500'}`}>
                  {user.status === 'online' ? 'online' : 'offline'}
                </p>
              </div>
            </div>
          </div>
        ))}

        {otherUsers.length === 0 && (
          <div className="flex flex-col items-center py-12 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <p className="text-xs text-slate-600 font-medium">No other users yet</p>
            <p className="text-[11px] text-slate-700 mt-1">Invite friends to join!</p>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/[0.04]">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-white/[0.08] rounded-xl transition-all duration-300 group"
        >
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserList;
