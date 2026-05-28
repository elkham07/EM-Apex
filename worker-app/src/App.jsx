import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Submissions from './pages/Submissions'
import Earnings from './pages/Earnings'
import LearnMore from './pages/LearnMore'
import ContactUs from './pages/ContactUs'
import Login from './pages/Login'
import Register from './pages/Register'
import { useState } from 'react'

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/dashboard" element={<Dashboard searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
      <Route path="/tasks" element={<Tasks searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
      <Route path="/submissions" element={<Submissions searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
      <Route path="/earnings" element={<Earnings searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
      <Route path="/learn-more" element={<LearnMore searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
      <Route path="/contact" element={<ContactUs searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
    </Routes>
  )
}

export default App
