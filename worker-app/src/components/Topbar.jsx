import { useState, useRef, useEffect } from 'react'

const Topbar = ({ searchQuery, setSearchQuery }) => {
  const [showSettings, setShowSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isDark, setIsDark] = useState(true)

  const settingsRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.body.classList.toggle('light-theme')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <header className="topbar">
      <div className="search-wrap">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search for task, submission or member" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="topbar-actions">
        <button className="icon-btn theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {isDark ? (
            <svg id="theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
          ) : (
            <svg id="theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
          )}
        </button>

        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)} title="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            <span className="notif-dot"></span>
          </button>
          
          {showNotifications && (
            <div className="popover" style={popoverStyle}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Notifications</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12.5px', color: 'var(--text-2)' }}>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <strong style={{ color: 'var(--text-1)' }}>Admin</strong> posted a new announcement
                </li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  Payout of <strong style={{ color: 'var(--green)' }}>$25</strong> approved!
                </li>
                <li style={{ padding: '8px 0' }}>
                  New task "UI Kit Template" is available
                </li>
              </ul>
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }} ref={settingsRef}>
          <button className="icon-btn" onClick={() => setShowSettings(!showSettings)} title="Settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          </button>

          {showSettings && (
            <div className="popover" style={popoverStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div className="avatar" style={{ width: '40px', height: '40px' }}>J</div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>John Doe</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>worker@emapex.com</div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                style={{ 
                  width: '100%', padding: '10px', background: 'var(--danger)', color: '#fff', 
                  border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' 
                }}
              >
                Log Out
              </button>
            </div>
          )}
        </div>

        <div className="avatar" onClick={() => setShowSettings(!showSettings)}>J</div>
      </div>
    </header>
  )
}

const popoverStyle = {
  position: 'absolute',
  top: '50px',
  right: '0',
  background: 'var(--bg-card2)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  padding: '16px',
  width: '260px',
  zIndex: 100,
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  animation: 'fadeUp 0.2s ease'
}

export default Topbar
