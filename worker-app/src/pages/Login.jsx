import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiUrl } from '../lib/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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
      if (data.user.role !== 'worker') {
        throw new Error('Access denied: You must be a worker to access this app');
      }

      // Save token & user details
      localStorage.setItem('em_worker_token', data.token);
      localStorage.setItem('em_worker_id', data.user.id);
      localStorage.setItem('em_worker_email', data.user.email);
      localStorage.setItem('em_worker_status', data.user.status || 'active');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Server error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-base)', color: 'var(--text-1)', fontFamily: 'var(--font-sans)' }}>
      <div className="auth-box" style={{ 
        background: 'var(--bg-card)', 
        padding: '40px', 
        borderRadius: 'var(--radius-lg)', 
        width: '420px', 
        textAlign: 'center', 
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)'
      }}>
        <div className="logo-text" style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <rect width="24" height="24" rx="6" fill="#26332f" />
            <path d="M6 18L18 6M10 18L18 10M6 14L14 6" stroke="#6fa98f" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-1)' }}>Work<span style={{ fontStyle: 'italic', fontWeight: 'normal', color: 'var(--text-3)' }}>zounds</span></span>
        </div>
        <p style={{ color: 'var(--text-2)', fontSize: '13px', marginBottom: '30px' }}>Coder Portal</p>
        
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', letterSpacing: '-0.3px', fontFamily: 'var(--font-serif)' }}>Welcome Back</h2>
        
        {error && (
          <div style={{ 
            background: 'rgba(255, 92, 92, 0.1)', 
            border: '1px solid rgba(255, 92, 92, 0.2)', 
            color: '#ff5c5c', 
            padding: '12px', 
            borderRadius: '8px', 
            fontSize: '12px', 
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'left', marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="search-input" 
              style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-1)', fontSize: '14px', outline: 'none' }} 
              placeholder="name@workzounds.com" 
              required
            />
          </div>

          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="search-input" 
              style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-1)', fontSize: '14px', outline: 'none' }} 
              placeholder="••••••••" 
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '13px', 
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: 'var(--radius-md)', 
              background: 'var(--accent)', 
              color: '#f4faf7', 
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
              border: 'none',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--text-2)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--text-3)', fontWeight: '600', textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
