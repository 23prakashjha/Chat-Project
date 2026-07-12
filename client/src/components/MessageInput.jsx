import { useState, useRef, useEffect } from 'react';

const MessageInput = ({ onSendMessage, onTypingStart, onTypingStop, disabled }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      onTypingStop();
      if (textareaRef.current) {
        textareaRef.current.style.height = '44px';
      }
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (e.target.value.trim()) {
      onTypingStart();
    } else {
      onTypingStop();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e) => {
    const el = e.target;
    el.style.height = '44px';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  };

  return (
    <div className="relative px-3 md:px-6 py-3 md:py-4">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <form onSubmit={handleSubmit} className="flex items-end gap-2.5">
        <div className={`flex-1 relative transition-all duration-300 ${isFocused ? 'scale-[1.005]' : ''}`}>
          <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
            isFocused
              ? 'bg-gradient-to-r from-brand-500/10 via-accent-purple/10 to-accent-pink/10 blur-sm opacity-100'
              : 'opacity-0'
          }`} />

          <div className="relative flex items-end rounded-2xl bg-white/[0.03] border border-white/[0.06] transition-all duration-300 focus-within:border-brand-500/30 focus-within:bg-white/[0.05] shadow-sm focus-within:shadow-brand-500/5">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              placeholder={disabled ? 'Connecting to chat...' : 'Type a message...'}
              className="flex-1 bg-transparent text-white text-sm placeholder-slate-600 px-4 py-3 outline-none resize-none leading-relaxed disabled:opacity-40 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '140px' }}
              onInput={handleInput}
            />

            <div className="flex items-center gap-1.5 pr-2 pb-2">
              <button
                type="submit"
                disabled={!message.trim() || disabled}
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed group"
                style={{
                  background: message.trim() && !disabled
                    ? 'linear-gradient(135deg, #4c6ef5, #7950f2)'
                    : 'rgba(255,255,255,0.04)',
                  boxShadow: message.trim() && !disabled
                    ? '0 4px 15px rgba(76, 110, 245, 0.3)'
                    : 'none',
                  transform: message.trim() && !disabled ? 'scale(1)' : 'scale(0.9)',
                }}
              >
                <svg
                  className={`w-4 h-4 transition-all duration-300 ${
                    message.trim() && !disabled
                      ? 'text-white translate-x-0.5'
                      : 'text-slate-600'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
