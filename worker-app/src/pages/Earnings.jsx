import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const Earnings = ({ searchQuery, setSearchQuery }) => {
  const [payments, setPayments] = useState([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [pendingEarned, setPendingEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const token = localStorage.getItem('em_worker_token');
        const workerId = localStorage.getItem('em_worker_id');
        if (!token || !workerId) {
          navigate('/login');
          return;
        }

        // Fetch payments
        const payRes = await fetch(`http://localhost:3000/api/payments/worker/${workerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!payRes.ok) {
          if (payRes.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to load payments');
        }
        const payData = await payRes.json();

        // Fetch submissions
        const subRes = await fetch(`http://localhost:3000/api/submissions/worker/${workerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const subData = subRes.ok ? await subRes.json() : [];
        const subMap = {};
        subData.forEach(s => {
          subMap[s.id] = s;
        });

        // Fetch tasks
        const tasksRes = await fetch('http://localhost:3000/api/tasks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const tasksData = tasksRes.ok ? await tasksRes.json() : [];
        const tasksMap = {};
        tasksData.forEach(t => {
          tasksMap[t.id] = t;
        });

        let total = 0;
        let pending = 0;
        const mapped = payData.map(p => {
          const sub = subMap[p.submissionId] || {};
          const task = tasksMap[sub.taskId] || { title: 'Platform Task Payout' };
          const amountNum = parseFloat(p.amount);
          
          if (p.status === 'completed') {
            total += amountNum;
          } else {
            pending += amountNum;
          }

          return {
            id: p.id,
            date: new Date(p.createdAt).toLocaleDateString(),
            task: task.title,
            amount: amountNum,
            status: p.status
          };
        });

        setPayments(mapped);
        setTotalEarned(total);
        setPendingEarned(pending);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [navigate]);

  const filteredPayouts = payments.filter(p => 
    p.task.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main className="main-content" style={{ flex: 1 }}>
        <Topbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="content-scroll">
          
          {loading ? (
            <div style={{ padding: '20px', color: 'var(--text-2)' }}>Calculating earnings...</div>
          ) : error ? (
            <div style={{ padding: '20px', color: 'var(--danger)' }}>Error: {error}</div>
          ) : (
            <>
              <div className="summary-hero" style={{ marginBottom: '20px' }}>
                <div className="hero-left">
                  <div className="hero-logo">$</div>
                  <div>
                    <p className="hero-label">Total Earned</p>
                    <h2 className="hero-count">${totalEarned.toFixed(2)}</h2>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Pending Payouts:</span>
                    <div style={{ fontWeight: 'bold' }}>${pendingEarned.toFixed(2)}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Last Payment Date:</span>
                    <div style={{ fontWeight: 'bold' }}>
                      {payments.length > 0 ? payments[0].date : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              <section className="summaries-section">
                <div className="summaries-header">
                  <div className="summaries-title-wrap">
                    <h3>Payout History</h3>
                  </div>
                </div>

                <table className="summaries-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Task Name</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayouts.map(p => (
                      <tr key={p.id} className="sum-row">
                        <td><span style={{ fontSize: '13px', color: 'var(--text-2)' }}>{p.date}</span></td>
                        <td><span className="resource-title">{p.task}</span></td>
                        <td>
                          <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--green)' }}>+${p.amount.toFixed(2)}</span>
                        </td>
                        <td>
                          <span style={{ 
                            padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                            background: p.status === 'completed' ? 'rgba(34,197,94,0.1)' : 'rgba(255,140,0,0.1)',
                            color: p.status === 'completed' ? 'var(--green)' : '#ff8c00'
                          }}>
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredPayouts.length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-3)' }}>No payouts match your search.</div>
                )}
              </section>
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default Earnings;
