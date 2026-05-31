import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const Submissions = ({ searchQuery, setSearchQuery }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('em_worker_token');
        const workerId = localStorage.getItem('em_worker_id');
        if (!token || !workerId) {
          navigate('/login');
          return;
        }

        // Fetch submissions
        const subResponse = await fetch(`http://localhost:3000/api/submissions/worker/${workerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!subResponse.ok) {
          if (subResponse.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to load submissions');
        }
        const subData = await subResponse.json();

        // Fetch tasks to map titles and rewards
        const tasksResponse = await fetch('http://localhost:3000/api/tasks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const tasksData = await tasksResponse.ok ? await tasksResponse.json() : [];
        const tasksMap = {};
        tasksData.forEach(t => {
          tasksMap[t.id] = t;
        });

        const mapped = subData.map(sub => {
          const task = tasksMap[sub.taskId] || { title: 'Unknown Task', reward: 0.00 };
          return {
            id: sub.id,
            taskTitle: task.title,
            reward: parseFloat(task.reward),
            status: sub.status === 'pending' ? 'Pending Review' : (sub.status === 'approved' ? 'Approved' : 'Rejected'),
            date: new Date(sub.createdAt).toLocaleDateString(),
            fileUrl: sub.fileUrl
          };
        });

        setSubmissions(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [navigate]);

  const filteredSubmissions = submissions.filter(sub => 
    sub.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending Review': return '#ff8c00';
      case 'Approved': return 'var(--teal)';
      case 'Rejected': return 'var(--danger)';
      default: return 'var(--text-2)';
    }
  };

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
                <span className="summaries-count-badge">{filteredSubmissions.length} total</span>
              </div>
              <p className="summaries-sub">Manage your active and completed work</p>
            </div>

            {loading ? (
              <div style={{ padding: '20px', color: 'var(--text-2)' }}>Loading submissions...</div>
            ) : error ? (
              <div style={{ padding: '20px', color: 'var(--danger)' }}>Error: {error}</div>
            ) : (
              <table className="summaries-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Date Submitted</th>
                    <th>Reward</th>
                    <th>Status</th>
                    <th>File/Link</th>
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
                            <div className="resource-meta">ID: #{sub.id.substring(0, 8)}</div>
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
                        <a 
                          href={sub.fileUrl.startsWith('http') ? sub.fileUrl : `http://${sub.fileUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ fontSize: '12px', color: '#7c87ff', textDecoration: 'underline' }}
                        >
                          View Work
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && filteredSubmissions.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-3)' }}>No submissions found.</div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
};

export default Submissions;
