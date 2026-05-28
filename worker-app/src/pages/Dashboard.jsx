import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import TaskCard from '../components/TaskCard'
import Calendar from '../components/Calendar'
import AnnouncementChat from '../components/AnnouncementChat'
import TaskModal from '../components/TaskModal'

const Dashboard = ({ searchQuery, setSearchQuery }) => {
  const [selectedTask, setSelectedTask] = useState(null)

  const tasks = [
    {
      id: 1,
      title: 'UI Kit Template',
      posted: 'Posted Today',
      new: true,
      reward: 25,
      workers: ['A', 'M', 'K', '+2'],
      tags: ['Design', 'Template', '3 days']
    },
    {
      id: 2,
      title: 'Social Media Guide',
      posted: 'Posted 2 days ago',
      new: false,
      reward: 15,
      workers: ['L', 'S'],
      tags: ['Guide', '5 days']
    },
    {
      id: 3,
      title: 'Notion Template Pack',
      posted: 'Posted 3 days ago',
      new: true,
      reward: 35,
      workers: ['J', 'R', 'T'],
      tags: ['Template', 'Productivity', '7 days']
    },
    {
      id: 4,
      title: 'Icon Set Design',
      posted: 'Posted 5 days ago',
      new: false,
      reward: 20,
      workers: ['D'],
      tags: ['Design', '4 days']
    },
    {
      id: 5,
      title: 'Mini Course: Figma Basics',
      posted: 'Posted 1 week ago',
      new: false,
      reward: 50,
      workers: ['P', 'N'],
      tags: ['Course', 'Video', '10 days']
    },
    {
      id: 6,
      title: 'Landing Page Copy',
      posted: 'Posted 1 week ago',
      new: true,
      reward: 12,
      workers: ['E', 'V'],
      tags: ['Copywriting', '3 days']
    }
  ]

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main className="main-content">
        <Topbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="content-scroll">
          <section className="tasks-cards-section">
            <div className="tasks-cards-header">
              <div className="tasks-cards-title-wrap">
                <h3>Available tasks</h3>
                <span className="tasks-cards-count">{filteredTasks.filter(t => t.new).length} new</span>
              </div>
              <p className="tasks-cards-sub">Pick a task and start earning</p>
            </div>

            <div className="tasks-grid">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
              ))}
              {filteredTasks.length === 0 && (
                <div style={{ padding: '20px', color: 'var(--text-3)' }}>No tasks found matching your search.</div>
              )}
            </div>
          </section>
        </div>
      </main>
      
      {/* Right Panel with Calendar and Announcement Chat */}
      <aside className="right-panel">
        <Calendar />
        <AnnouncementChat />
      </aside>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  )
}

export default Dashboard
