import React, { useState } from 'react';
import { apiUrl } from '../lib/api';

interface LoginProps {
  onLoginSuccess: (token: string, email: string, userId: string) => void;
  onShowRegister?: () => void;
}

export default function Login({ onLoginSuccess, onShowRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Check role
      if (data.user.role !== 'admin') {
        throw new Error('Access denied: Admin role required');
      }

      onLoginSuccess(data.token, data.user.email, data.user.id);
    } catch (err: any) {
      setError(err.message || 'Server error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#08090a] text-neutral-100 font-sans">
      <div className="w-full max-w-md p-8 bg-[#121315] border border-neutral-800 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-wz-sage/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-wz-sage-deep/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-wz-sage-tint/10 border border-wz-sage/20 text-xs font-semibold text-wz-sage">
            Private Portal — Invite Only
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-neutral-50 mb-1 flex items-center justify-center gap-1.5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 inline-block">
              <rect width="24" height="24" rx="6" fill="#6fa98f" />
              <path d="M6 18L18 6M10 18L18 10M6 14L14 6" stroke="#26332f" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Work<span className="italic font-normal text-wz-sage">zounds</span> <span className="font-sans text-xs bg-wz-sage-tint text-wz-sage-deep px-2 py-0.5 rounded-md uppercase tracking-wider font-semibold scale-90">Admin</span>
          </h1>
          <p className="text-xs text-neutral-500">Sign in to manage and review platform assets</p>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2 text-left">
            <label className="text-3xs font-bold text-neutral-400 uppercase tracking-widest block font-mono">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-neutral-100 focus:outline-none focus:border-wz-sage focus:ring-1 focus:ring-wz-sage transition-all placeholder-neutral-700 font-sans" 
              placeholder="admin@workzounds.com" 
              required
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-3xs font-bold text-neutral-400 uppercase tracking-widest block font-mono">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-neutral-100 focus:outline-none focus:border-wz-sage focus:ring-1 focus:ring-wz-sage transition-all placeholder-neutral-700 font-sans" 
              placeholder="••••••••" 
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-wz-ink hover:bg-wz-sage-deep text-[#f4faf7] shadow-lg shadow-wz-sage-deep/15 transition-all transform active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none text-sm font-bold"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {onShowRegister && (
          <p className="mt-6 text-center text-sm text-neutral-400 relative z-10">
            Need an admin account?{' '}
            <button
              type="button"
              onClick={onShowRegister}
              className="text-wz-sage font-semibold hover:text-wz-sage/80"
            >
              Create one
            </button>
          </p>
        )}

        <p className="mt-4 text-center text-4xs text-neutral-600 relative z-10 font-mono">
          Dev default: admin@workzounds.com / adminpassword
        </p>

        <div className="mt-6 text-center text-4xs font-mono text-neutral-600 uppercase tracking-widest">
          SECURE PIPELINE PROTECTION ACTIVE
        </div>
      </div>
    </div>
  );
}
