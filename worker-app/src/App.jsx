import { lazy, Suspense, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Tasks = lazy(() => import('./pages/Tasks'))
const Submissions = lazy(() => import('./pages/Submissions'))
const Earnings = lazy(() => import('./pages/Earnings'))
const LearnMore = lazy(() => import('./pages/LearnMore'))
const ContactUs = lazy(() => import('./pages/ContactUs'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))

function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#090a0f',
      color: '#6a6a6a',
      fontFamily: 'Inter, sans-serif',
      fontSize: 14,
    }}>
      Loading…
    </div>
  )
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  )
}

export default App
