import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'
import { User, Mail, Shield, Calendar, Lock, Info } from 'lucide-react'
import { format } from 'date-fns'

const Profile = () => {
  const { user } = useAuth()

  const isAdmin = user?.role === 'ADMIN'

  const infoItems = [
    { icon: User, label: 'Full Name', value: user?.name || 'Loading...' },
    { icon: Mail, label: 'Email Address', value: user?.email || 'Loading...' },
    { icon: Shield, label: 'Role', value: user?.role || 'Loading...' },
    { icon: Lock, label: 'Authentication', value: 'JWT / Spring Security' },
  ]

  return (
    <DashboardLayout title="Profile">
      <div className="space-y-6 animate-fade-in max-w-2xl">

        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="text-obsidian-400 text-sm mt-1">Your account details and preferences</p>
        </div>

        {/* Profile card */}
        <div className="card">
          <div className="flex items-center gap-5 pb-6 border-b border-surface-border/50">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-obsidian-950 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #00f5ff, #9b5de5)' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.name || 'User'}</h2>
              <p className="text-obsidian-400 text-sm mt-0.5">{user?.email || 'Fetching account details...'}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isAdmin
                    ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                    : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                }`}>
                  <Shield size={11} />
                  {user?.role || 'USER'}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-300 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Active
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-4">
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0, 245, 255, 0.1)' }}>
                  <Icon size={15} className="text-neon-cyan" />
                </div>
                <div>
                  <p className="text-obsidian-400 text-xs">{label}</p>
                  <p className="text-white text-sm font-medium mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security info */}
        <div className="card">
          <h3 className="section-title mb-4 flex items-center gap-2"><Lock size={16} /> Security</h3>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Password Storage', value: 'BCrypt hashed (one-way encryption)' },
              { label: 'Session Type', value: 'Stateless JWT — no server-side sessions' },
              { label: 'Token Type', value: 'Bearer JWT (expires in 24 hours)' },
              { label: 'Access Control', value: isAdmin ? 'Full admin access (all endpoints)' : 'Employee access (own tasks only)' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-surface-border/40 last:border-0">
                <span className="text-obsidian-400">{label}</span>
                <span className="text-obsidian-200 font-medium text-right max-w-[60%]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interview info panel */}
        <div className="rounded-xl p-5"
          style={{
            background: 'rgba(155, 93, 229, 0.06)',
            border: '1px solid rgba(155, 93, 229, 0.2)',
          }}>
          <div className="flex items-start gap-3">
            <Info size={16} className="text-neon-purple mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-neon-purple font-semibold text-sm mb-1">System Architecture</p>
              <p className="text-obsidian-300 text-xs leading-relaxed">
                This system uses <strong className="text-obsidian-100">Spring Boot (Controller → Service → Repository)</strong> layered
                architecture. Authentication via <strong className="text-obsidian-100">Spring Security + JWT</strong>.
                Passwords hashed with <strong className="text-obsidian-100">BCrypt</strong>.
                Frontend uses <strong className="text-obsidian-100">React + Axios</strong> with role-based route protection.
              </p>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default Profile