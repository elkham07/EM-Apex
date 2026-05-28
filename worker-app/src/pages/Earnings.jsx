import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

const Earnings = ({ searchQuery, setSearchQuery }) => {
  const payouts = [
    { id: 1, date: 'May 20, 2026', task: 'Mobile App Mockups', amount: 150 },
    { id: 2, date: 'May 15, 2026', task: 'Logo Design', amount: 75 },
    { id: 3, date: 'May 02, 2026', task: 'Blog Post Writing', amount: 30 }
  ]

  const filteredPayouts = payouts.filter(p => 
    p.task.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main className="main-content" style={{ flex: 1 }}>
        <Topbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="content-scroll">
          
          <div className="summary-hero" style={{ marginBottom: '20px' }}>
            <div className="hero-left">
              <div className="hero-logo">$</div>
              <div>
                <p className="hero-label">Total Earned</p>
                <h2 className="hero-count">$255.00</h2>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Pending Payouts:</span>
                <div style={{ fontWeight: 'bold' }}>$40.00</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Last Payment Date:</span>
                <div style={{ fontWeight: 'bold' }}>May 20, 2026</div>
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
                </tr>
              </thead>
              <tbody>
                {filteredPayouts.map(p => (
                  <tr key={p.id} className="sum-row">
                    <td><span style={{ fontSize: '13px', color: 'var(--text-2)' }}>{p.date}</span></td>
                    <td><span className="resource-title">{p.task}</span></td>
                    <td>
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--green)' }}>+${p.amount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPayouts.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-3)' }}>No payouts match your search.</div>
            )}
          </section>

        </div>
      </main>
    </div>
  )
}

export default Earnings
