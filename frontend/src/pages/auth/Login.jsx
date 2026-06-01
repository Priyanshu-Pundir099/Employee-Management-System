import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}!`)
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#0a0a18' }}>

      {/* Left panel - decorative */}
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(0, 245, 255, 0.08) 0%, transparent 70%), radial-gradient(ellipse at 70% 20%, rgba(155, 93, 229, 0.08) 0%, transparent 60%)',
          }} />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, rgba(0, 245, 255, 0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full animate-float"
          style={{ animationDelay: '2s', background: 'radial-gradient(circle, rgba(155, 93, 229, 0.06) 0%, transparent 70%)' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 245, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00f5ff, #9b5de5)' }}>
              <Zap size={22} className="text-obsidian-950 fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">EmpMS</h1>
              <p className="text-obsidian-400 text-xs">Employee Management System</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Manage your<br />
            <span className="text-gradient-cyan">team efficiently</span>
          </h2>
          <p className="text-obsidian-300 leading-relaxed mb-8">
            A unified platform for task management, team collaboration, and productivity tracking for modern organizations.
          </p>

          {/* Features */}
          {['Role-based access control', 'Real-time task tracking', 'JWT secured APIs', 'Analytics dashboard'].map((feat) => (
            <div key={feat} className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0, 245, 255, 0.15)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
              </div>
              <span className="text-obsidian-300 text-sm">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00f5ff, #9b5de5)' }}>
              <Zap size={18} className="text-obsidian-950 fill-current" />
            </div>
            <h1 className="text-xl font-bold text-white">EmpMS</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Sign in</h2>
            <p className="text-obsidian-400">Welcome back — enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-field"
                placeholder="you@company.com"
                required
                autoComplete="email"
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
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
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

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-obsidian-950/30 border-t-obsidian-950 rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-obsidian-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-neon-cyan hover:text-white transition-colors font-medium">
              Create account
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl text-xs space-y-1.5"
            style={{ background: 'rgba(0, 245, 255, 0.04)', border: '1px solid rgba(0, 245, 255, 0.1)' }}>
            <p className="text-neon-cyan font-semibold mb-2">Demo Credentials</p>
            <p className="text-obsidian-300">Admin: <span className="text-obsidian-200 font-mono">admin@empms.com / admin123</span></p>
            <p className="text-obsidian-300">Employee: <span className="text-obsidian-200 font-mono">emp@empms.com / emp123</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
