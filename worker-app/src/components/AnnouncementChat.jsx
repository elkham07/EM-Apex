const AnnouncementChat = () => {
  return (
    <div className="chat-card" style={{ maxHeight: 'none' }}>
      <div className="chat-header">
        <p className="chat-title">Announcements</p>
        <p className="chat-sub">Read-only channel</p>
      </div>
      <div className="chat-messages" id="chat-messages">
        <div className="chat-message">
          <div className="message-avatar" style={{ background: 'var(--danger)' }}>A</div>
          <div className="message-content">
            <p className="message-sender">Admin</p>
            <p className="message-text">New high-paying tasks will be dropped at 5PM EST today! Get ready. 🔥</p>
            <p className="message-time">1 hour ago</p>
          </div>
        </div>
        <div className="chat-message">
          <div className="message-avatar" style={{ background: 'var(--danger)' }}>A</div>
          <div className="message-content">
            <p className="message-sender">Admin</p>
            <p className="message-text">All payouts for last week have been processed.</p>
            <p className="message-time">Yesterday</p>
          </div>
        </div>
        <div className="chat-message">
          <div className="message-avatar" style={{ background: 'var(--danger)' }}>A</div>
          <div className="message-content">
            <p className="message-sender">Admin</p>
            <p className="message-text">Welcome to all new members! Please read the guidelines before applying to your first task.</p>
            <p className="message-time">May 24</p>
          </div>
        </div>
      </div>
      {/* Removed input field and send button as requested */}
    </div>
  )
}

export default AnnouncementChat
