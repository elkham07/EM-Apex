const RightPanel = () => {
  const pendingApprovals = [
    { id: 1, name: 'Alex Johnson', task: 'UI Kit Template', avatar: 'AJ' },
    { id: 2, name: 'Maria Garcia', task: 'Social Media Guide', avatar: 'MG' },
    { id: 3, name: 'Emma Wilson', task: 'Notion Template Pack', avatar: 'EW' },
  ]

  const handleApprove = (id) => {
    console.log('Approve:', id)
  }

  const handleReject = (id) => {
    console.log('Reject:', id)
  }

  return (
    <aside className="right-panel">
      {/* PENDING APPROVALS */}
      <div className="pending-card">
        <div className="pending-header">
          <div>
            <p className="pending-title">Pending Approvals</p>
            <p className="pending-sub">3 submissions waiting for review</p>
          </div>
          <button className="dots-btn">⋯</button>
        </div>

        <div className="pending-list">
          {pendingApprovals.map(item => (
            <div key={item.id} className="pending-item">
              <div className="pending-avatar">{item.avatar}</div>
              <div className="pending-info">
                <p className="pending-name">{item.name}</p>
                <p className="pending-task">{item.task}</p>
              </div>
              <div className="pending-actions">
                <button 
                  className="pending-btn approve" 
                  onClick={() => handleApprove(item.id)}
                  title="Approve"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </button>
                <button 
                  className="pending-btn reject" 
                  onClick={() => handleReject(item.id)}
                  title="Reject"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default RightPanel
