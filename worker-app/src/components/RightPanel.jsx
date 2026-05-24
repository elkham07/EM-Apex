import { useState, useEffect, useRef } from 'react'

const RightPanel = () => {
  const [messages, setMessages] = useState([
    { sender: 'Alex', text: 'Just submitted the UI kit task! 💎', time: '5 min ago', avatar: 'A' },
    { sender: 'Maria', text: 'Nice! How was the reward?', time: '3 min ago', avatar: 'M' },
    { sender: 'Alex', text: '$25 for that one. Working on the next one now 🚀', time: '2 min ago', avatar: 'A' }
  ])
  const [inputValue, setInputValue] = useState('')
  const canvasRef = useRef(null)

  useEffect(() => {
    // Draw gauge
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const centerX = canvas.width / 2
    const centerY = canvas.height - 10
    const radius = 90
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Background arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, 0)
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 12
    ctx.stroke()
    
    // Progress arc (68%)
    const progress = 0.68
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + (Math.PI * progress))
    ctx.strokeStyle = '#5b6aff'
    ctx.lineWidth = 12
    ctx.lineCap = 'round'
    ctx.stroke()
  }, [])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    
    const newMessage = {
      sender: 'You',
      text: inputValue,
      time: 'Just now',
      avatar: 'J'
    }
    
    setMessages([...messages, newMessage])
    setInputValue('')
  }

  return (
    <aside className="right-panel">
      {/* PROGRESS GAUGE */}
      <div className="usage-card">
        <div className="usage-card-header">
          <div>
            <p className="usage-title">Your progress</p>
            <p className="usage-plan">Level: Beginner</p>
          </div>
          <button className="dots-btn">⋯</button>
        </div>

        <div className="gauge-wrap">
          <canvas ref={canvasRef} width="220" height="130"></canvas>
          <div className="gauge-center">
            <span className="gauge-pct">68%</span>
          </div>
        </div>
        <p className="gauge-sub">68% to next level</p>

        <div className="usage-actions">
          <button className="btn-pricing">View achievements</button>
          <button className="btn-upgrade-main">Level up</button>
        </div>
      </div>

      {/* CHAT */}
      <div className="chat-card">
        <div className="chat-header">
          <p className="chat-title">Community Chat</p>
          <p className="chat-sub">20 members online</p>
        </div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className="chat-message">
              <div className="message-avatar">{msg.avatar}</div>
              <div className="message-content">
                <p className="message-sender">{msg.sender}</p>
                <p className="message-text">{msg.text}</p>
                <p className="message-time">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input-wrap">
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Type a message..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="chat-send-btn" onClick={handleSendMessage}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default RightPanel
