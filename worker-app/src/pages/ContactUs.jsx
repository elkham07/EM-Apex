import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

const ContactUs = ({ searchQuery, setSearchQuery }) => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main className="main-content" style={{ flex: 1 }}>
        <Topbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="content-scroll">
          
            {/* Contact Form */}
            <div className="welcome-card" style={{ flex: 1 }}>
              <h2 style={{ marginBottom: '5px' }}>Contact Support</h2>
              <p style={{ color: 'var(--text-2)', fontSize: '13px', marginBottom: '20px' }}>
                Have a question or need help? Send us a message.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-2)', marginBottom: '5px' }}>Name</label>
                  <input type="text" className="search-input" style={{ width: '100%', borderRadius: '8px' }} placeholder="Your Name" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-2)', marginBottom: '5px' }}>Email</label>
                  <input type="email" className="search-input" style={{ width: '100%', borderRadius: '8px' }} placeholder="you@example.com" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-2)', marginBottom: '5px' }}>Subject</label>
                  <input type="text" className="search-input" style={{ width: '100%', borderRadius: '8px' }} placeholder="How can we help?" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-2)', marginBottom: '5px' }}>Message</label>
                  <textarea className="search-input" style={{ width: '100%', borderRadius: '8px', minHeight: '120px', padding: '12px 16px', resize: 'vertical' }} placeholder="Describe your issue..."></textarea>
                </div>
                
                <button className="btn-upgrade-main" style={{ width: '100%', background: 'var(--accent)', color: '#fff', padding: '12px', marginTop: '10px' }}>
                  Send Message
                </button>
              </div>
            </div>

        </div>
      </main>
    </div>
  )
}

export default ContactUs
