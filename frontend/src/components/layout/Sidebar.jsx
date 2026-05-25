import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Users, ClipboardList, LogOut,
  User, Zap, ChevronRight, Settings
} from 'lucide-react'
import toast from 'react-hot-toast'

const adminLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/employees', icon: Users, label: 'Employees' },
  { to: '/admin/tasks', icon: ClipboardList, label: 'Tasks' },
  { to: '/admin/profile', icon: User, label: 'Profile' },
]

const employeeLinks = [
  { to: '/employee/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employee/tasks', icon: ClipboardList, label: 'My Tasks' },
  { to: '/employee/profile', icon: User, label: 'Profile' },
]

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const links = isAdmin() ? adminLinks : employeeLinks

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-40"
      style={{
        background: 'linear-gradient(180deg, #0d0d22 0%, #0a0a18 100%)',
        borderRight: '1px solid rgba(42, 42, 74, 0.6)',
      }}>

      {/* Logo */}
      <div className="p-6 border-b border-surface-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00f5ff, #9b5de5)' }}>
            <Zap size={18} className="text-obsidian-950 fill-current" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm tracking-wider">EmpMS</h1>
            <p className="text-obsidian-400 text-xs">Management System</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-surface-border/50">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-elevated/50">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-obsidian-950 font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #00f5ff, #4cc9f0)' }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-obsidian-400 text-xs">{user?.role}</p>
          </div>
          <ChevronRight size={14} className="text-obsidian-500 flex-shrink-0" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-obsidian-500 text-xs font-semibold tracking-widest uppercase px-4 mb-3">
          Navigation
        </p>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            <span className="text-sm">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-surface-border/50">
        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
