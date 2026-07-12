import { useState } from 'react';
import { useChat } from '../context/ChatContext';

const LoginModal = () => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const { login } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      setError('Please enter a username');
      return;
    }
    if (trimmedValue.length < 2) {
      setError('At least 2 characters required');
      return;
    }
    if (trimmedValue.length > 20) {
      setError('Maximum 20 characters allowed');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedValue)) {
      setError('Letters, numbers & underscores only');
      return;
    }

    login(trimmedValue);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-surface-0">
      <div className="absolute inset-0 mesh-bg"></div>

      <div className="orb w-[500px] h-[500px] bg-brand-600/10 top-[-10%] left-[-5%] animate-float" />
      <div className="orb w-[400px] h-[400px] bg-accent-purple/8 bottom-[-5%] right-[-5%] animate-float-delayed" />
      <div className="orb w-[300px] h-[300px] bg-accent-pink/5 top-[40%] right-[20%] animate-float-slow" />

      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="glass-strong rounded-3xl p-8 md:p-10 shadow-float">
          <div className="text-center mb-10">
            <div className="relative inline-flex mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-accent-purple rounded-2xl blur-xl opacity-40 animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-accent-purple flex items-center justify-center shadow-elevated">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Welcome to <span className="text-gradient">ChatFlow</span>
            </h1>
            <p className="text-slate-400 text-sm">Enter a username to join the conversation</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500/20 to-accent-purple/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm" />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="relative w-full pl-12 pr-4 py-4 rounded-xl text-white placeholder-slate-600 transition-all duration-300 outline-none bg-white/[0.03] border border-white/[0.06] focus:border-brand-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(76,110,245,0.1)]"
                  placeholder="e.g. john_doe"
                  autoFocus
                  maxLength={20}
                />
              </div>
              <div className="h-5 ml-1">
                {error && (
                  <p className="text-xs text-accent-red flex items-center gap-1.5 animate-slide-down">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 group overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #4c6ef5, #7950f2)',
                boxShadow: isHovered
                  ? '0 8px 30px rgba(76, 110, 245, 0.4)'
                  : '0 4px 15px rgba(76, 110, 245, 0.2)',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <span className="relative flex items-center justify-center gap-2">
                Join Chat
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/[0.05]">
            <div className="flex items-center justify-center gap-6 text-[11px] text-slate-600">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-accent-green/60" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
                No registration
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-accent-cyan/60" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 1a6 6 0 0 0-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.644a.75.75 0 0 0 .75.75h2.5a.75.75 0 0 0 .75-.75v-.644c0-1.013.762-1.957 1.815-2.825A6 6 0 0 0 10 1ZM8.863 17.414a.75.75 0 0 0-.226 1.483 9.066 9.066 0 0 0 2.726 0 .75.75 0 0 0-.226-1.483 7.553 7.553 0 0 1-2.274 0Z" />
                </svg>
                Real-time
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-accent-purple/60" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                </svg>
                Secure
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
