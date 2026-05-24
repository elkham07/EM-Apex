import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import RightPanel from '../components/RightPanel'

const Dashboard = () => {
  const stats = [
    { label: 'Total Members', value: '524', change: '+12' },
    { label: 'Active Tasks', value: '48', change: '+5' },
    { label: 'Pending Reviews', value: '23', change: '+3' },
    { label: 'Monthly Revenue', value: '$12,450', change: '+$1,200' },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main className="main-content">
        <Topbar />
        <div className="content-scroll">
          <section className="welcome-card">
            <div className="welcome-text">
              <h1>Admin Dashboard</h1>
              <p>Welcome back! Here's what's happening on your platform today.</p>
            </div>

            <div className="stat-cards">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-header">
                    <span>{stat.label}</span>
                    <span style={{ color: 'var(--green)', fontSize: '12px' }}>{stat.change}</span>
                  </div>
                  <div className="stat-number">{stat.value}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <RightPanel />
    </div>
  )
}

export default Dashboard
