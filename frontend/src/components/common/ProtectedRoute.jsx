import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loader from './Loader'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  // 1. Show a loading spinner while checking JWT token validation
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-950">
        <Loader />
      </div>
    )
  }

  // 2. If no user session exists, kick them back to the login gateway
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 3. If role boundaries are violated (e.g. Employee tries to access /admin dashboard)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  // 4. Everything matches perfectly—render the core view component layout safely
  return children
}

export default ProtectedRoute