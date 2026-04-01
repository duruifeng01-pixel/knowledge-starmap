import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Content from './pages/Content'
import Discussion from './pages/Discussion'
import MindMap from './pages/MindMap'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          user ? <Navigate to="/home" /> : <Onboarding onComplete={(userData) => {
            setUser(userData)
            localStorage.setItem('user', JSON.stringify(userData))
          }} />
        } />
        <Route element={<Layout user={user} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/content/:taskId" element={<Content />} />
          <Route path="/discussion/:taskId" element={<Discussion />} />
          <Route path="/mindmap" element={<MindMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
