import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Search } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import TaskTable from '../../components/task/TaskTable'
import TaskCard from '../../components/task/TaskCard'
import Loader from '../../components/common/Loader'
import { taskService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const EmployeeTasks = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [view, setView] = useState('table') // 'table' | 'cards'

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
      const labels = { ACCEPTED: 'accepted', REJECTED: 'rejected', COMPLETED: 'completed' }
      toast.success(`Task ${labels[status] || 'updated'}`)
      loadTasks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task')
    }
  }

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'ALL' || t.status === filterStatus
    return matchSearch && matchStatus
  })

  const counts = {
    ALL: tasks.length,
    NEW: tasks.filter(t => t.status === 'NEW').length,
    ACCEPTED: tasks.filter(t => t.status === 'ACCEPTED').length,
    COMPLETED: tasks.filter(t => t.status === 'COMPLETED').length,
    REJECTED: tasks.filter(t => t.status === 'REJECTED').length,
  }

  const statusOptions = [
    { key: 'ALL', label: 'All', color: 'text-obsidian-300' },
    { key: 'NEW', label: 'New', color: 'text-blue-300' },
    { key: 'ACCEPTED', label: 'Accepted', color: 'text-cyan-300' },
    { key: 'COMPLETED', label: 'Completed', color: 'text-green-300' },
    { key: 'REJECTED', label: 'Rejected', color: 'text-red-300' },
  ]

  return (
    <DashboardLayout title="My Tasks">
      <div className="space-y-6 animate-fade-in">

        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="text-obsidian-400 text-sm mt-1">
            {tasks.filter(t => t.status === 'NEW').length} new tasks awaiting response
          </p>
        </div>

        {/* Quick action summary */}
        {tasks.filter(t => t.status === 'NEW').length > 0 && (
          <div className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: 'rgba(0, 245, 255, 0.06)', border: '1px solid rgba(0, 245, 255, 0.15)' }}>
            <Clock size={16} className="text-neon-cyan flex-shrink-0" />
            <p className="text-obsidian-200 text-sm">
              You have <span className="text-neon-cyan font-semibold">{tasks.filter(t => t.status === 'NEW').length} new task(s)</span> that need
              your accept/reject response. Use the action buttons to respond.
            </p>
          </div>
        )}

        {/* Filter bar */}
        <div className="card flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {statusOptions.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterStatus === key
                    ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30'
                    : 'text-obsidian-400 hover:text-white hover:bg-surface-hover border border-transparent'
                }`}
              >
                {label} ({counts[key]})
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 border border-surface-border rounded-lg overflow-hidden">
            {['table', 'cards'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
                  view === v ? 'bg-surface-elevated text-white' : 'text-obsidian-400 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader size="lg" /></div>
        ) : view === 'table' ? (
          <div className="card p-0 overflow-hidden">
            <TaskTable
              tasks={filtered}
              onStatusUpdate={handleStatusUpdate}
              onDelete={() => {}}
              isAdmin={false}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-3 text-center py-16 text-obsidian-400">No tasks found</div>
            ) : (
              filtered.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusUpdate={handleStatusUpdate}
                  onDelete={() => {}}
                  isAdmin={false}
                />
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default EmployeeTasks
