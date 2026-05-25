import { useState, useEffect } from 'react'
import { CheckCircle, Clock, XCircle, ClipboardList, TrendingUp, ArrowRight } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import TaskCard from '../../components/task/TaskCard'
import StatCard from '../../components/common/StatCard'
import Loader from '../../components/common/Loader'
import { taskService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const EmployeeDashboard = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const loadTasks = async () => {
    try {
      const res = await taskService.getTasksByEmployee(user.id)
      setTasks(res.data)
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTasks() }, [])

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await taskService.updateTaskStatus(taskId, status)
      toast.success(`Task marked as ${status.toLowerCase()}`)
      loadTasks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task')
    }
  }

  const stats = {
    total: tasks.length,
    new: tasks.filter(t => t.status === 'NEW').length,
    accepted: tasks.filter(t => t.status === 'ACCEPTED').length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    rejected: tasks.filter(t => t.status === 'REJECTED').length,
  }

  const recentTasks = tasks.slice(0, 3)
  const pendingTasks = tasks.filter(t => t.status === 'NEW' || t.status === 'ACCEPTED')

  if (loading) return <DashboardLayout title="My Dashboard"><div className="flex justify-center mt-20"><Loader size="lg" /></div></DashboardLayout>

  return (
    <DashboardLayout title="My Dashboard">
      <div className="space-y-8 animate-fade-in">

        {/* Welcome */}
        <div className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(155, 93, 229, 0.1) 0%, rgba(0, 245, 255, 0.06) 100%)',
            border: '1px solid rgba(155, 93, 229, 0.2)',
          }}>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
            <ClipboardList size={80} className="text-neon-purple" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Welcome, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="text-obsidian-300 text-sm">
            You have <span className="text-neon-cyan font-semibold">{stats.new} new task{stats.new !== 1 ? 's' : ''}</span> awaiting your response
            {stats.accepted > 0 && <> and <span className="text-yellow-300 font-semibold">{stats.accepted} in progress</span></>}.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Assigned" value={stats.total} icon={ClipboardList} color="cyan" />
          <StatCard title="In Progress" value={stats.accepted} icon={Clock} color="yellow" />
          <StatCard title="Completed" value={stats.completed} icon={CheckCircle} color="green" />
          <StatCard title="Rejected" value={stats.rejected} icon={XCircle} color="red" />
        </div>

        {/* Pending tasks needing action */}
        {pendingTasks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">🔔 Needs Your Attention</h3>
              <span className="text-xs text-obsidian-400">{pendingTasks.length} tasks</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingTasks.slice(0, 3).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusUpdate={handleStatusUpdate}
                  onDelete={() => {}}
                  isAdmin={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Task flow explanation */}
        <div className="card">
          <h3 className="section-title mb-5">Task Lifecycle</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: 'New', color: '#4cc9f0', bg: 'rgba(76, 201, 240, 0.1)', desc: 'Task assigned to you' },
              { label: '→', color: '#3d3d70', bg: 'transparent', desc: '' },
              { label: 'Accepted', color: '#00f5ff', bg: 'rgba(0, 245, 255, 0.1)', desc: 'You accepted the task' },
              { label: '→', color: '#3d3d70', bg: 'transparent', desc: '' },
              { label: 'Completed', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', desc: 'Work finished' },
            ].map((s, i) => (
              s.label === '→' ? (
                <ArrowRight key={i} size={16} className="text-obsidian-500" />
              ) : (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="px-4 py-2 rounded-xl font-semibold text-sm"
                    style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}30` }}>
                    {s.label}
                  </div>
                  <p className="text-obsidian-500 text-xs text-center max-w-[80px]">{s.desc}</p>
                </div>
              )
            ))}
            <ArrowRight size={16} className="text-obsidian-500" />
            <div className="flex flex-col items-center gap-1">
              <div className="px-4 py-2 rounded-xl font-semibold text-sm"
                style={{ background: 'rgba(247, 37, 133, 0.1)', color: '#f72585', border: '1px solid rgba(247, 37, 133, 0.2)' }}>
                Rejected
              </div>
              <p className="text-obsidian-500 text-xs text-center max-w-[80px]">You rejected it</p>
            </div>
          </div>
        </div>

        {/* Recent tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Recent Tasks</h3>
            <Link to="/employee/tasks" className="text-neon-cyan text-sm hover:text-white transition-colors flex items-center gap-1">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          {tasks.length === 0 ? (
            <div className="card text-center py-12">
              <ClipboardList size={32} className="text-obsidian-500 mx-auto mb-3" />
              <p className="text-obsidian-300 font-medium">No tasks assigned yet</p>
              <p className="text-obsidian-500 text-sm mt-1">Your admin will assign tasks shortly</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusUpdate={handleStatusUpdate}
                  onDelete={() => {}}
                  isAdmin={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EmployeeDashboard
