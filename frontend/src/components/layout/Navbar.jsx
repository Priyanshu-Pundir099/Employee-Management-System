import { Bell, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Navbar = ({ title }) => {
  const { user } = useAuth()

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-surface-border/50"
      style={{ background: 'rgba(10, 10, 24, 0.9)', backdropFilter: 'blur(12px)' }}>

      <div>
        <h2 className="text-white font-semibold text-lg">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search size={14} className="absolute left-3 text-obsidian-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm rounded-lg text-obsidian-300 placeholder-obsidian-500 outline-none w-48 focus:w-64 transition-all duration-200"
            style={{
              background: 'rgba(26, 26, 53, 0.6)',
              border: '1px solid rgba(42, 42, 74, 0.6)',
            }}
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-obsidian-300 hover:text-white hover:bg-surface-hover transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neon-cyan" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-obsidian-950 font-bold text-sm cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #00f5ff, #4cc9f0)' }}>
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
      </div>
    </header>
  )
}

export default Navbar
