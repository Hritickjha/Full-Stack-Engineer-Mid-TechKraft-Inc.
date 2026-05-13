import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import CandidateList from './components/CandidateList'
import CandidateDetail from './components/CandidateDetail'
import { AuthProvider, useAuth } from './context/AuthContext'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) return <div className="loading">Loading...</div>
  
  return user ? children : <Navigate to="/login" />
}

function AppContent() {
  const { user, logout } = useAuth()
  
  return (
    <div>
      {user && (
        <div className="nav">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Candidate Scoring Dashboard</h2>
              <div>
                <span style={{ marginRight: '10px' }}>{user.email} ({user.role})</span>
                <button onClick={logout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute>
            <CandidateList />
          </PrivateRoute>
        } />
        <Route path="/candidate/:id" element={
          <PrivateRoute>
            <CandidateDetail />
          </PrivateRoute>
        } />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App