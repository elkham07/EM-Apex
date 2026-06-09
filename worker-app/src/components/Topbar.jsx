import { useState, useRef, useEffect, useCallback } from 'react'

const SEEN_KEY = 'worker_seen_notif_ids'

function getSeenIds() {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')) }
  catch { return new Set() }
}

function saveSeenIds(ids) {
  localStorage.setItem(SEEN_KEY, JSON.stringify([...ids]))
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 172800) return 'Yesterday'
  return new Date(dateStr).toLocaleDateString()
}

const Topbar = ({ searchQuery, setSearchQuery }) => {
  const [showSettings, setShowSettings]         = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isDark, setIsDark]                     = useState(() => !document.body.classList.contains('light-theme'))
  const [notifications, setNotifications]       = useState([])
  const [seenIds, setSeenIds]                   = useState(getSeenIds)

  const settingsRef = useRef(null)
  const notifRef    = useRef(null)
  const pollRef     = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setShowSettings(false)
      if (notifRef.current   && !notifRef.current.contains(e.target))    setShowNotifications(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Fetch and build notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const [annRes, taskRes] = await Promise.all([
        fetch('/api/announcements'),
        fetch('/api/tasks'),
      ])

      const announcements = annRes.ok ? await annRes.json() : []
      const tasks         = taskRes.ok ? await taskRes.json() : []

      const items = [
        ...announcements.map(a => ({
          id:   `ann-${a.id}`,
          text: `📢 Admin: ${a.text}`,
          time: a.createdAt,
          type: 'announcement',
        })),
        ...tasks
          .filter(t => t.status === 'active')
          .map(t => ({
            id:   `task-${t.id}`,
            text: `🆕 New task available: "${t.title}" — $${parseFloat(t.reward).toFixed(2)}`,
            time: t.createdAt,
            type: 'task',
          })),
      ]

      // Sort newest first
      items.sort((a, b) => new Date(b.time) - new Date(a.time))
      setNotifications(items.slice(0, 20))
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    pollRef.current = setInterval(fetchNotifications, 20000)
    return () => clearInterval(pollRef.current)
  }, [fetchNotifications])

  const unreadCount = notifications.filter(n => !seenIds.has(n.id)).length

  const markAllRead = () => {
    const allIds = new Set(notifications.map(n => n.id))
    saveSeenIds(allIds)
    setSeenIds(allIds)
  }

  const markOneRead = (id) => {
    const next = new Set(seenIds)
    next.add(id)
    saveSeenIds(next)
    setSeenIds(next)
  }

  const handleOpenNotifications = () => {
    setShowNotifications(v => !v)
  }

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.body.classList.remove('light-theme')
    } else {
      document.body.classList.add('light-theme')
    }
    localStorage.setItem('worker_theme', next ? 'dark' : 'light')
  }

  // Restore theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('worker_theme')
    if (saved === 'light') {
      setIsDark(false)
      document.body.classList.add('light-theme')
    } else {
      setIsDark(true)
      document.body.classList.remove('light-theme')
    }
  }, [])

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
        {/* Theme toggle */}
        <button className="icon-btn theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {isDark ? (
            <svg id="theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
          ) : (
            <svg id="theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
          )}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className="icon-btn" onClick={handleOpenNotifications} title="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            {unreadCount > 0 && <span className="notif-dot" />}
          </button>

          {showNotifications && (
            <div style={popoverStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  🔔 Notifications {unreadCount > 0 && <span style={{ background: 'var(--accent)', color: '#fff', borderRadius: '20px', padding: '1px 7px', fontSize: '10px', marginLeft: '4px' }}>{unreadCount}</span>}
                </span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '700', cursor: 'pointer', background: 'none', border: 'none', textTransform: 'uppercase' }}>
                    Clear All
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-3)', fontSize: '13px' }}>
                    No notifications yet
                  </div>
                ) : notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markOneRead(n.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: seenIds.has(n.id) ? 'transparent' : 'rgba(91,106,255,0.07)',
                      borderLeft: seenIds.has(n.id) ? '3px solid transparent' : '3px solid var(--accent)',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                  >
                    <p style={{ fontSize: '12.5px', color: 'var(--text-1)', lineHeight: '1.45', margin: 0 }}>{n.text}</p>
                    <span style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '4px', display: 'block', fontFamily: 'monospace' }}>
                      {timeAgo(n.time)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div style={{ position: 'relative' }} ref={settingsRef}>
          <button className="icon-btn" onClick={() => setShowSettings(!showSettings)} title="Settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          </button>

          {showSettings && (
            <div className="popover" style={popoverStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div className="avatar" style={{ width: '40px', height: '40px' }}>W</div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Worker</div>
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

        <div className="avatar" onClick={() => setShowSettings(!showSettings)}>W</div>
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
  width: '300px',
  zIndex: 100,
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  animation: 'fadeUp 0.2s ease',
}

export default Topbar
