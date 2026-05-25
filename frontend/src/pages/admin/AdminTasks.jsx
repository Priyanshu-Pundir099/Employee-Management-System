import { useState, useEffect } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import TaskTable from '../../components/task/TaskTable'
import CreateTaskModal from '../../components/task/CreateTaskModal'
import Loader from '../../components/common/Loader'
import { taskService, userService } from '../../services/api'
import toast from 'react-hot-toast'

const AdminTasks = () => {
  const [tasks, setTasks] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const loadData = async () => {
    try {
      const [tasksRes, empRes] = await Promise.all([
        taskService.getAllTasks(),
        userService.getAllEmployees(),
      ])
      setTasks(tasksRes.data)
      setEmployees(empRes.data)
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await taskService.deleteTask(id)
      toast.success('Task deleted')
      loadData()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedTo?.name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'ALL' || t.status === filterStatus
    return matchSearch && matchStatus
  })

  const statusOptions = ['ALL', 'NEW', 'ACCEPTED', 'COMPLETED', 'REJECTED']

  return (
    <DashboardLayout title="Task Management">
      <div className="space-y-6 animate-fade-in">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title">All Tasks</h1>
            <p className="text-obsidian-400 text-sm mt-1">{tasks.length} total tasks across all employees</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} /> New Task
          </button>
        </div>

        {/* Filters */}
        <div className="card flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400" />
            <input
              type="text"
              placeholder="Search by title or employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-obsidian-400" />
            {statusOptions.map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  filterStatus === s
                    ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30'
                    : 'text-obsidian-400 hover:text-white hover:bg-surface-hover border border-transparent'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader size="lg" /></div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <TaskTable
              tasks={filtered}
              onDelete={handleDelete}
              onStatusUpdate={() => {}}
              isAdmin={true}
            />
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateTaskModal
          employees={employees}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => { setShowCreateModal(false); loadData() }}
        />
      )}
    </DashboardLayout>
  )
}

export default AdminTasks
