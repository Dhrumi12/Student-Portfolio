import './App.css'
import { lazy, Suspense } from 'react'
import { useState } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Home from './components/Home.jsx'
import NotFound from './components/NotFound.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'

const Projects = lazy(() => import('./components/Projects.jsx'))
const Contact = lazy(() => import('./components/Contact.jsx'))

function ProtectedRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />
}

function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <main className={`app-shell ${darkMode ? 'dark-mode' : ''}`}>
      <NavBar darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)} />
      <Suspense fallback={<div className="page-loading" role="status">Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
  )
}

export default App
