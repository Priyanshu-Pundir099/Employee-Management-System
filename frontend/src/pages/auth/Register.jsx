import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Zap, ArrowRight, Shield, User } from 'lucide-react'
import toast from 'react-hot-toast'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const user = await register(form.name, form.email, form.password, form.role)
      toast.success('Account created successfully!')
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0a0a18' }}>
      <div className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%, rgba(0, 245, 255, 0.06) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(155, 93, 229, 0.06) 0%, transparent 60%)',
        }} />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00f5ff, #9b5de5)' }}>
            <Zap size={18} className="text-obsidian-950 fill-current" />
          </div>
          <h1 className="text-xl font-bold text-white">EmpMS</h1>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1.5">Create Account</h2>
            <p className="text-obsidian-400 text-sm">Join your team's workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-field"
                placeholder="john@company.com"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input-field pr-12"
                  placeholder="Min. 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="label">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'EMPLOYEE', label: 'Employee', icon: User, desc: 'Manage your tasks' },
                  { value: 'ADMIN', label: 'Admin', icon: Shield, desc: 'Full access' },
                ].map(({ value, label, icon: Icon, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, role: value }))}
                    className={`p-3.5 rounded-xl text-left transition-all duration-200 ${
                      form.role === value ? 'neon-border' : ''
                    }`}
                    style={{
                      background: form.role === value ? 'rgba(0, 245, 255, 0.06)' : 'rgba(17, 17, 40, 0.8)',
                      border: form.role === value ? '1px solid rgba(0, 245, 255, 0.3)' : '1px solid rgba(42, 42, 74, 0.8)',
                    }}
                  >
                    <Icon size={16} className={form.role === value ? 'text-neon-cyan mb-2' : 'text-obsidian-400 mb-2'} />
                    <p className={`font-semibold text-sm ${form.role === value ? 'text-neon-cyan' : 'text-white'}`}>{label}</p>
                    <p className="text-obsidian-400 text-xs mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-obsidian-950/30 border-t-obsidian-950 rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-obsidian-400 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-neon-cyan hover:text-white transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
