import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // In real app, this would call the API with admin role check
    console.log('Admin Login:', formData)
    navigate('/dashboard')
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg-base)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '18px',
        padding: '32px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'var(--accent)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '24px',
            fontWeight: '800',
            color: '#fff',
            boxShadow: '0 0 16px rgba(91,106,255,0.4)'
          }}>E</div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '800',
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>Admin Portal</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-2)' }}>
            Secure access for platform administrators
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px',
              color: 'var(--text-1)'
            }}>Admin Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="admin@emapex.com"
              required
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                color: 'var(--text-1)',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px',
              color: 'var(--text-1)'
            }}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                color: 'var(--text-1)',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, var(--accent) 0%, #7c87ff 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 16px rgba(91,106,255,0.35)'
            }}
          >
            Access Admin Panel
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          padding: '12px',
          background: 'rgba(91,106,255,0.1)',
          border: '1px solid ' + 'rgba(91,106,255,0.2)',
          borderRadius: '8px'
        }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-2)',
            textAlign: 'center',
            lineHeight: '1.5'
          }}>
            <span style={{ color: 'var(--accent)', fontWeight: '600' }}>⚠️ Restricted Access</span><br/>
            This portal is for authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
