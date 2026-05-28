import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

const Submissions = ({ searchQuery, setSearchQuery }) => {
  const [submissions, setSubmissions] = useState([
    { id: 1, taskTitle: 'UI Kit Template', status: 'In Progress', reward: 25, date: 'Today' },
    { id: 2, taskTitle: 'Social Media Guide', status: 'Pending Review', reward: 15, date: '2 days ago' },
    { id: 3, taskTitle: 'Icon Set Design', status: 'Approved', reward: 20, date: '1 week ago' },
    { id: 4, taskTitle: 'Landing Page Copy', status: 'Paid', reward: 12, date: '2 weeks ago' }
  ])

  const [uploadingId, setUploadingId] = useState(null)
  const [fileText, setFileText] = useState('')

  const filteredSubmissions = submissions.filter(sub => 
    sub.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmitWork = (id) => {
    setSubmissions(submissions.map(sub => 
      sub.id === id ? { ...sub, status: 'Pending Review' } : sub
    ))
    setUploadingId(null)
    setFileText('')
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'In Progress': return 'var(--accent2)'
      case 'Pending Review': return '#ff8c00'
      case 'Approved': return 'var(--teal)'
      case 'Paid': return 'var(--green)'
      default: return 'var(--text-2)'
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main className="main-content" style={{ flex: 1 }}>
        <Topbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="content-scroll">
          
          <section className="summaries-section">
            <div className="summaries-header">
              <div className="summaries-title-wrap">
                <h3>My Submissions</h3>
                <span className="summaries-count-badge">{filteredSubmissions.length} tasks</span>
              </div>
              <p className="summaries-sub">Manage your active and completed work</p>
            </div>

            <table className="summaries-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Date Applied</th>
                  <th>Reward</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map(sub => (
                  <tr key={sub.id} className="sum-row">
                    <td>
                      <div className="resource-cell">
                        <div className="resource-thumb">📁</div>
                        <div>
                          <div className="resource-title">{sub.taskTitle}</div>
                          <div className="resource-meta">ID: #{sub.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize: '13px', color: 'var(--text-2)' }}>{sub.date}</span></td>
                    <td>
                      <span style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--green)' }}>${sub.reward}</span>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
                        background: 'var(--bg-hover)', color: getStatusColor(sub.status), border: `1px solid ${getStatusColor(sub.status)}40`
                      }}>
                        {sub.status}
                      </span>
                    </td>
                    <td>
                      {sub.status === 'In Progress' && (
                        <button 
                          className="btn-pricing" 
                          onClick={() => setUploadingId(sub.id)}
                          style={{ padding: '6px 12px', fontSize: '11px' }}
                        >
                          Upload Work
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSubmissions.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-3)' }}>No submissions found.</div>
            )}
          </section>

        </div>
      </main>

      {/* Upload Modal */}
      {uploadingId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="welcome-card" style={{ width: '400px', animation: 'fadeUp 0.2s ease' }}>
            <h3 style={{ marginBottom: '10px' }}>Submit Work</h3>
            <p style={{ color: 'var(--text-2)', fontSize: '13px', marginBottom: '15px' }}>Upload your final files or provide a link to your work.</p>
            
            <input type="file" style={{ marginBottom: '15px', color: 'var(--text-1)' }} />
            
            <textarea 
              className="search-input" 
              style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '8px', marginBottom: '20px' }} 
              placeholder="Or paste a link to Figma/Google Docs..."
              value={fileText}
              onChange={(e) => setFileText(e.target.value)}
            />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-pricing" onClick={() => setUploadingId(null)} style={{ flex: 1 }}>Cancel</button>
              <button className="btn-upgrade-main" onClick={() => handleSubmitWork(uploadingId)} style={{ flex: 1, background: 'var(--accent)', color: '#fff' }}>Submit for Review</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Submissions
