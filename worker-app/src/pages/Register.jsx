const Register = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#121212', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div className="auth-box" style={{ background: '#1e1e1e', padding: '40px', borderRadius: '12px', width: '400px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="logo-text" style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', display: 'inline-block' }}>EM<sup>Apex</sup></div>
        <h2 style={{ marginBottom: '20px' }}>Create Account</h2>
        <input type="email" id="email" className="search-input" style={{ width: '100%', marginBottom: '15px' }} placeholder="Enter your email" />
        <input type="password" id="password" className="search-input" style={{ width: '100%', marginBottom: '15px' }} placeholder="Choose a password" />
        <button id="register-btn" className="btn-upgrade-main" style={{ width: '100%', background: 'var(--green)', color: '#fff', padding: '14px' }} onClick={() => window.location.href = '/login'}>Register</button>
      </div>
    </div>
  )
}

export default Register
