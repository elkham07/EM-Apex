const TaskCard = ({ task, onClick }) => {
  return (
    <div className="task-card" onClick={onClick}>
      <div className="task-card-header">
        <span className="task-date">{task.posted}</span>
        {task.new && <span className="task-new-badge">New</span>}
      </div>
      <h4 className="task-title">{task.title}</h4>
      <div className="task-tags">
        {task.tags.map((tag, i) => (
          <span key={i} className="task-tag">{tag}</span>
        ))}
      </div>
      <div className="task-card-footer">
        <div className="task-members">
          {task.workers.map((w, i) => (
            <div key={i} className={w.startsWith('+') ? 'task-avatar-more' : 'task-avatar'}>
              {w}
            </div>
          ))}
        </div>
        <span className="task-reward">${task.reward}</span>
      </div>
    </div>
  )
}

export default TaskCard
