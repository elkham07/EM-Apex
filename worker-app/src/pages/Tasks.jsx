import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import { apiUrl } from '../lib/api'

const Tasks = ({ searchQuery, setSearchQuery }) => {
  const [selectedTask, setSelectedTask] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('em_worker_token')
        if (!token) {
          navigate('/login')
          return
        }

        const response = await fetch(apiUrl('/api/tasks'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login')
            return
          }
          throw new Error('Failed to load tasks')
        }
        const data = await response.json()
        
        // Map backend tasks to frontend expectations
        const mapped = data.map((t, idx) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          posted: new Date(t.createdAt).toLocaleDateString(),
          new: idx < 3,
          reward: parseFloat(t.reward),
          workers: ['A', 'M', '+2'],
          tags: ['Development', 'Task']
        }))
        setTasks(mapped)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [navigate])

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main className="main-content" style={{ flex: 1 }}>
        <Topbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="content-scroll">
          <section className="tasks-cards-section">
            <div className="tasks-cards-header">
              <div className="tasks-cards-title-wrap">
                <h3>All Tasks</h3>
                <span className="tasks-cards-count">{filteredTasks.length} total</span>
              </div>
              <p className="tasks-cards-sub">Browse and find the perfect task for your skills</p>
            </div>

            {loading ? (
              <div style={{ padding: '20px', color: 'var(--text-2)' }}>Loading tasks from server...</div>
            ) : error ? (
              <div style={{ padding: '20px', color: 'var(--danger)' }}>Error: {error}</div>
            ) : (
              <div className="tasks-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {filteredTasks.map(task => (
                  <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                ))}
                {filteredTasks.length === 0 && (
                  <div style={{ padding: '20px', color: 'var(--text-3)' }}>No tasks found matching your search.</div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  )
}

export default Tasks
