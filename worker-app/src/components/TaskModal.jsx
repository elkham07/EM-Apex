import React, { useState } from 'react';
import { apiUrl } from '../lib/api';

const TaskModal = ({ task, onClose }) => {
  const [fileUrl, setFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileUrl) {
      setError('Please provide a file URL or description');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem('em_worker_token');
      const workerId = localStorage.getItem('em_worker_id');
      
      if (!token || !workerId) {
        throw new Error('Not authenticated, please login again.');
      }

      const response = await fetch(apiUrl('/api/submissions'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          taskId: task.id,
          workerId: workerId,
          fileUrl: fileUrl
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px' }}>{task.title}</h2>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>
        
        <div style={contentStyle}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {task.tags.map(t => <span key={t} className="task-tag">{t}</span>)}
            <span style={{ color: 'var(--green)', fontWeight: '800', marginLeft: 'auto', fontSize: '20px' }}>${task.reward}</span>
          </div>
          
          <h4 style={{ marginBottom: '8px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-2)' }}>Task Description</h4>
          <p style={{ color: 'var(--text-2)', fontSize: '13.5px', lineHeight: '1.5', marginBottom: '20px' }}>
            {task.description || `This is a detailed description of the ${task.title} task. Please make sure to follow the guidelines provided in the attached documents.`}
          </p>

          <h4 style={{ marginBottom: '8px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-2)' }}>Guidelines & Attachments</h4>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <div style={attachmentStyle}>
              <span style={{ fontSize: '18px' }}>📄</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Brief.pdf</div>
                <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>1.2 MB</div>
              </div>
            </div>
            <div style={attachmentStyle}>
              <span style={{ fontSize: '18px' }}>📝</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Requirements.doc</div>
                <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>450 KB</div>
              </div>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(255,92,92,0.1)', border: '1px solid rgba(255,92,92,0.15)', color: '#ff5c5c', padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {success ? (
            <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.15)', color: '#22c55e', padding: '10px', borderRadius: '8px', fontSize: '12px', textAlign: 'center', fontWeight: '600' }}>
              Submitted successfully!
            </div>
          ) : showForm ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-2)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Work Link / File URL</label>
                <input 
                  type="text" 
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input, #0b0c10)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none' }}
                  placeholder="https://figma.com/file/... or Google Drive link"
                  required
                  disabled={submitting}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-pricing" onClick={() => setShowForm(false)} style={{ flex: 1 }} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn-upgrade-main" style={{ flex: 1, background: 'var(--accent)', color: '#fff' }} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Work'}
                </button>
              </div>
            </form>
          ) : (
            <button 
              style={applyBtnStyle} 
              onClick={() => setShowForm(true)}
            >
              Submit Work for Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)'
};

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
};

const headerStyle = {
  padding: '20px',
  borderBottom: '1px solid var(--border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const closeBtnStyle = {
  background: 'none', border: 'none', color: 'var(--text-2)', fontSize: '18px', cursor: 'pointer'
};

const contentStyle = {
  padding: '20px'
};

const attachmentStyle = {
  display: 'flex', alignItems: 'center', gap: '10px',
  background: 'var(--bg-card2)', border: '1px solid var(--border)',
  padding: '10px 14px', borderRadius: 'var(--radius-sm)',
  cursor: 'pointer'
};

const applyBtnStyle = {
  width: '100%', padding: '12px',
  background: 'var(--accent)', color: '#fff',
  border: 'none', borderRadius: 'var(--radius-sm)',
  fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
  transition: 'background 0.2s',
  textAlign: 'center'
};

export default TaskModal;
