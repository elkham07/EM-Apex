const TaskCard = ({ task }) => {
  return (
    <div className="task-card">
      <div className="task-card-header">
        <span className="task-date">{task.posted}</span>
        {task.new && <span className="task-new-badge">New</span>}
      </div>
      <h4 className="task-title">{task.title}</h4>
      <div className="task-tags">
        {task.tags.map((tag, index) => (
          <span key={index} className="task-tag">{tag}</span>
        ))}
      </div>
      <div className="task-card-footer">
        <div className="task-members">
          {task.workers.slice(0, 3).map((worker, index) => (
            <div key={index} className="task-avatar">{worker}</div>
          ))}
          {task.workers.length > 3 && (
            <span className="task-avatar-more">+{task.workers.length - 3}</span>
          )}
        </div>
        <span className="task-reward">${task.reward}</span>
      </div>
    </div>
  )
}

export default TaskCard
