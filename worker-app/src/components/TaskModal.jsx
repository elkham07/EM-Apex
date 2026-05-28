import { useState } from 'react'

const TaskModal = ({ task, onClose }) => {
  const [applied, setApplied] = useState(false)

  if (!task) return null

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2>{task.title}</h2>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>
        
        <div style={contentStyle}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {task.tags.map(t => <span key={t} className="task-tag">{t}</span>)}
            <span style={{ color: 'var(--green)', fontWeight: 'bold', marginLeft: 'auto', fontSize: '18px' }}>${task.reward}</span>
          </div>
          
          <h4 style={{ marginBottom: '10px' }}>Task Description</h4>
          <p style={{ color: 'var(--text-2)', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
            This is a detailed description of the {task.title} task. Please make sure to follow the guidelines provided in the attached documents. The expected delivery time is {task.tags[task.tags.length - 1]}. Your work will be reviewed by our admins before the payout is processed.
          </p>

          <h4 style={{ marginBottom: '10px' }}>Attachments</h4>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <div style={attachmentStyle}>
              <span style={{ fontSize: '20px' }}>📄</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Brief.pdf</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>1.2 MB</div>
              </div>
            </div>
            <div style={attachmentStyle}>
              <span style={{ fontSize: '20px' }}>📝</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Requirements.doc</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>450 KB</div>
              </div>
            </div>
          </div>

          <button 
            style={applied ? appliedBtnStyle : applyBtnStyle} 
            onClick={() => setApplied(true)}
            disabled={applied}
          >
            {applied ? 'Applied' : 'Apply for task'}
          </button>
        </div>
      </div>
    </div>
  )
}

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)'
}

const modalStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  width: '500px',
  maxWidth: '90%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
  animation: 'fadeUp 0.3s ease'
}

const headerStyle = {
  padding: '20px',
  borderBottom: '1px solid var(--border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const closeBtnStyle = {
  background: 'none', border: 'none', color: 'var(--text-2)', fontSize: '18px', cursor: 'pointer'
}

const contentStyle = {
  padding: '20px'
}

const attachmentStyle = {
  display: 'flex', alignItems: 'center', gap: '10px',
  background: 'var(--bg-card2)', border: '1px solid var(--border)',
  padding: '10px 14px', borderRadius: 'var(--radius-sm)',
  cursor: 'pointer'
}

const applyBtnStyle = {
  width: '100%', padding: '12px',
  background: 'var(--accent)', color: '#fff',
  border: 'none', borderRadius: 'var(--radius-sm)',
  fontSize: '15px', fontWeight: 'bold', cursor: 'pointer',
  transition: 'background 0.2s'
}

const appliedBtnStyle = {
  ...applyBtnStyle,
  background: 'var(--bg-hover)',
  color: 'var(--text-2)',
  cursor: 'not-allowed'
}

export default TaskModal
