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

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Server error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#090a0f', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div className="auth-box" style={{ 
        background: '#13141c', 
        padding: '40px', 
        borderRadius: '20px', 
        width: '420px', 
        textAlign: 'center', 
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <div className="logo-text" style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', display: 'inline-block', letterSpacing: '-0.5px' }}>
          EM<span style={{ color: 'var(--accent, #5b6aff)' }}>Apex</span>
        </div>
        <p style={{ color: 'var(--text-3, #6a6a6a)', fontSize: '13px', marginBottom: '30px' }}>Worker Portal</p>
        
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', letterSpacing: '-0.3px' }}>Welcome Back</h2>
        
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
            <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-2, #b0b0b0)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="search-input" 
              style={{ width: '100%', padding: '12px 16px', background: '#0b0c10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }} 
              placeholder="name@example.com" 
              required
            />
          </div>

          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-2, #b0b0b0)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="search-input" 
              style={{ width: '100%', padding: '12px 16px', background: '#0b0c10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }} 
              placeholder="••••••••" 
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-summarize" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '13px', 
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, #5b6aff 0%, #7c87ff 100%)', 
              color: '#fff', 
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
              border: 'none',
              boxShadow: '0 4px 15px rgba(91, 106, 255, 0.3)'
            }}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--text-2, #b0b0b0)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#7c87ff', fontWeight: '600', textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
