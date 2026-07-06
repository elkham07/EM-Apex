import React, { useState } from 'react';
import { apiUrl } from '../lib/api';

interface RegisterProps {
  onRegisterSuccess: () => void;
  onShowLogin: () => void;
}

export default function Register({ onRegisterSuccess, onShowLogin }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'admin' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(onRegisterSuccess, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Server error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#08090a] text-neutral-100 font-sans">
      <div className="w-full max-w-md p-8 bg-[#121315] border border-neutral-800 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-wz-sage/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-wz-sage-deep/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-neutral-50 mb-1 flex items-center justify-center gap-1.5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 inline-block">
              <rect width="24" height="24" rx="6" fill="#6fa98f" />
              <path d="M6 18L18 6M10 18L18 10M6 14L14 6" stroke="#26332f" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Work<span className="italic font-normal text-wz-sage">zounds</span> <span className="font-sans text-xs bg-wz-sage-tint text-wz-sage-deep px-2 py-0.5 rounded-md uppercase tracking-wider font-semibold scale-90">Admin</span>
          </h1>
          <p className="text-xs text-neutral-500">Create an admin account</p>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-left">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center">
            Account created. Redirecting to sign in...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2 text-left">
            <label className="text-3xs font-bold text-neutral-400 uppercase tracking-widest block font-mono">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-neutral-100 focus:outline-none focus:border-wz-sage focus:ring-1 focus:ring-wz-sage transition-all placeholder-neutral-700 font-sans"
              placeholder="admin@workzounds.com"
              required
              disabled={success}
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-3xs font-bold text-neutral-400 uppercase tracking-widest block font-mono">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-neutral-100 focus:outline-none focus:border-wz-sage focus:ring-1 focus:ring-wz-sage transition-all placeholder-neutral-700 font-sans"
              placeholder="Min. 6 characters"
              required
              disabled={success}
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3 px-4 rounded-xl bg-wz-ink hover:bg-wz-sage-deep text-[#f4faf7] shadow-lg shadow-wz-sage-deep/15 transition-all transform active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none text-sm font-bold"
          >
            {loading ? 'Creating account...' : 'Create Admin Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400 relative z-10">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onShowLogin}
            className="text-wz-sage font-semibold hover:text-wz-sage/80"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
