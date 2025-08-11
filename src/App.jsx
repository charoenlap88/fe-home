import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LoadingOverlay } from '@mantine/core'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useActivityTracker } from './hooks/useActivityTracker'
import Login from './components/Login'
import Layout from './components/Layout'
import PageWrapper from './components/PageWrapper'
import Dashboard from './pages/Dashboard'
import DatabaseManager from './pages/DatabaseManager'
import Files from './pages/Files'
import SystemMonitor from './pages/SystemMonitor'
import './App.css'

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()
  
  // Track user activity
  useActivityTracker()

  if (isLoading) {
    return <LoadingOverlay visible />
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/files" element={<Files />} />
          <Route path="/system" element={<SystemMonitor />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/db-manager" element={<PageWrapper><DatabaseManager /></PageWrapper>} />
        </Routes>
      </Layout>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
