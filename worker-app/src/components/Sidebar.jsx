import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const workerEmail = localStorage.getItem('em_worker_email') || 'worker@emapex.com';

  const handleLogout = () => {
    localStorage.removeItem('em_worker_token');
    localStorage.removeItem('em_worker_id');
    localStorage.removeItem('em_worker_email');
    navigate('/login');
  };

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '8px' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" style={{ display: 'block' }}>
          <rect width="24" height="24" rx="6" fill="#26332f" />
          <path d="M6 18L18 6M10 18L18 10M6 14L14 6" stroke="#6fa98f" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <span className="logo-text" style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--text-1)' }}>
          Work<span style={{ fontStyle: 'italic', fontWeight: 'normal', color: 'var(--text-3)' }}>zounds</span>
        </span>
      </div>

      <nav className="nav-section">
        <p className="nav-label">WORKZOUNDS</p>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
          Dashboard
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
          Tasks
        </NavLink>
        <NavLink to="/submissions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
          Submissions
        </NavLink>
        <NavLink to="/earnings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          Earnings
        </NavLink>
      </nav>

      <nav className="nav-section">
        <p className="nav-label">OTHER</p>
        <NavLink to="/learn-more" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
          Learn more
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          Contact us
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="avatar" style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--accent), #a78bfa)', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
              {workerEmail.substring(0, 1).toUpperCase()}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '12px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{workerEmail}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)' }}></div>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--green)', letterSpacing: '0.5px' }}>CONNECTED</span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            style={{ 
              width: '100%', 
              background: 'rgba(255,92,92,0.1)', 
              color: '#ff5c5c', 
              padding: '6px 10px', 
              borderRadius: '6px', 
              fontSize: '11px', 
              fontWeight: '600',
              textAlign: 'center',
              border: '1px solid rgba(255,92,92,0.15)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,92,92,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,92,92,0.1)';
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
