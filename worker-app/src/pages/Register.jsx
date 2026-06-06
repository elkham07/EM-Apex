import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiUrl } from '../lib/api';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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
        body: JSON.stringify({ 
          email, 
          password, 
          role: 'worker' // Workers default to worker role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
        
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', letterSpacing: '-0.3px' }}>Create Account</h2>
        
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

        {success && (
          <div style={{ 
            background: 'rgba(34, 197, 94, 0.1)', 
            border: '1px solid rgba(34, 197, 94, 0.2)', 
            color: '#22c55e', 
            padding: '12px', 
            borderRadius: '8px', 
            fontSize: '12px', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Registered successfully! Redirecting to login...
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
              disabled={success}
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
              placeholder="Min. 6 characters" 
              required
              disabled={success}
            />
          </div>

          <button 
            type="submit" 
            className="btn-summarize" 
            disabled={loading || success}
            style={{ 
              width: '100%', 
              padding: '13px', 
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)', 
              color: '#fff', 
              cursor: 'pointer',
              opacity: (loading || success) ? 0.7 : 1,
              border: 'none',
              boxShadow: '0 4px 15px rgba(34, 197, 148, 0.3)'
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--text-2, #b0b0b0)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#7c87ff', fontWeight: '600', textDecoration: 'none' }}>
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
