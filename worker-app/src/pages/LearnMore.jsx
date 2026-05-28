import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

const LearnMore = ({ searchQuery, setSearchQuery }) => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main className="main-content" style={{ flex: 1 }}>
        <Topbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="content-scroll">
          
          <div className="welcome-card">
            <div className="welcome-text">
              <h1>About EM Apex</h1>
              <p>Welcome to the exclusive community for digital creators.</p>
            </div>
            
            <div style={{ color: 'var(--text-2)', lineHeight: '1.6', fontSize: '14px', marginTop: '10px' }}>
              <p style={{ marginBottom: '15px' }}>
                EM Apex is a closed community platform where participants (workers) complete digital tasks and get paid, while administrators create tasks and manage the platform. 
              </p>
              <p style={{ marginBottom: '15px' }}>
                Our goal is to provide a seamless, secure, and rewarding environment for freelancers and digital professionals to thrive. By maintaining a closed ecosystem, we ensure high-quality tasks and reliable payouts for all our members.
              </p>
              <p>
                <strong>How it works:</strong>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
                  <li style={{ marginBottom: '8px' }}>Browse available tasks in your Dashboard.</li>
                  <li style={{ marginBottom: '8px' }}>Apply for tasks that match your skills.</li>
                  <li style={{ marginBottom: '8px' }}>Submit your completed work for review.</li>
                  <li>Get paid directly to your account once approved.</li>
                </ul>
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default LearnMore
