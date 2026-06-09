import { useState, useEffect, useRef } from 'react';

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'Yesterday';
  return new Date(dateStr).toLocaleDateString();
}

const AnnouncementChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);
  const bottomRef = useRef(null);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    pollRef.current = setInterval(fetchAnnouncements, 15000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  return (
    <div className="chat-card" style={{ maxHeight: 'none' }}>
      <div className="chat-header">
        <p className="chat-title">Announcements</p>
        <p className="chat-sub">Read-only channel</p>
      </div>
      <div className="chat-messages" id="chat-messages">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Loading...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            No announcements yet
          </div>
        ) : (
          messages.map((msg) => (
            <div className="chat-message" key={msg.id}>
              <div className="message-avatar" style={{ background: 'var(--danger)' }}>A</div>
              <div className="message-content">
                <p className="message-sender">{msg.sentBy}</p>
                <p className="message-text">{msg.text}</p>
                <p className="message-time">{timeAgo(msg.createdAt)}</p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default AnnouncementChat;
