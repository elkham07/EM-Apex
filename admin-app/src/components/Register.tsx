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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-50 mb-1">
            EM<span className="text-indigo-500">Apex</span> Admin
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
            <label className="text-3xs font-bold text-neutral-400 uppercase tracking-widest block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-neutral-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-neutral-700"
              placeholder="admin@emapex.com"
              required
              disabled={success}
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-3xs font-bold text-neutral-400 uppercase tracking-widest block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-neutral-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-neutral-700"
              placeholder="Min. 6 characters"
              required
              disabled={success}
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-75 disabled:pointer-events-none"
          >
            {loading ? 'Creating account...' : 'Create Admin Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400 relative z-10">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onShowLogin}
            className="text-indigo-400 font-semibold hover:text-indigo-300"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
