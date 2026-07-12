import { format, isToday, isYesterday, isSameDay } from 'date-fns';

const MessageItem = ({ message, isOwn, showAvatar, isFirstInGroup }) => {
  const formatTimestamp = (date) => {
    const d = new Date(date);
    if (isToday(d)) return format(d, 'h:mm a');
    if (isYesterday(d)) return `Yesterday · ${format(d, 'h:mm a')}`;
    return format(d, 'MMM d · h:mm a');
  };

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
    'from-lime-400 to-emerald-400',
    'from-red-400 to-rose-400',
  ];

  const getAvatarColor = (name) => {
    const idx = name ? name.charCodeAt(0) % avatarColors.length : 0;
    return avatarColors[idx];
  };

  const readCount = message.readBy ? message.readBy.length : 0;

  return (
    <div className={`flex gap-2.5 md:gap-3 group ${isOwn ? 'flex-row-reverse' : 'flex-row'} ${isFirstInGroup ? 'mt-4' : 'mt-1'} animate-fade-in-up`}>
      <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10">
        {showAvatar && (
          <div className={`w-full h-full rounded-xl bg-gradient-to-br ${getAvatarColor(message.username)} flex items-center justify-center text-white font-bold text-xs shadow-lg`}>
            {getInitial(message.username)}
          </div>
        )}
      </div>

      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[75%] md:max-w-[65%] min-w-0`}>
        {showAvatar && !isOwn && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="text-xs font-semibold text-slate-300">{message.username}</span>
            <span className="text-[10px] text-slate-600">·</span>
            <span className="text-[10px] text-slate-600">{formatTimestamp(message.createdAt)}</span>
          </div>
        )}

        <div className={`relative group/msg ${isOwn ? 'message-bubble-own' : 'message-bubble-other'} px-4 py-2.5 shadow-sm transition-all duration-200 hover:shadow-md ${isOwn ? 'hover:shadow-brand-500/10' : 'hover:shadow-black/10'}`}>
          <p className="text-[13.5px] leading-relaxed text-white/95 break-words">{message.content}</p>

          {isOwn && (
            <div className="flex items-center justify-end gap-1 mt-0.5">
              <span className="text-[10px] text-white/50">{formatTimestamp(message.createdAt)}</span>
              {readCount > 1 ? (
                <span className="flex items-center gap-0.5 text-[10px] text-accent-cyan/80">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <svg className="w-3 h-3 -ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
              ) : (
                <span className="text-[10px] text-white/40">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
              )}
            </div>
          )}

          {!isOwn && showAvatar && (
            <div className="absolute top-0 right-0 translate-x-1 -translate-y-1 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200">
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-surface-4/90 border border-white/[0.06] text-[10px] text-slate-500 shadow-lg">
                {formatTimestamp(message.createdAt)}
              </div>
            </div>
          )}
        </div>

        {!isOwn && !showAvatar && (
          <div className="px-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-[10px] text-slate-600">{formatTimestamp(message.createdAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
