import { useState, useEffect } from 'react'
import { Users, ClipboardList, CheckCircle, Clock, Plus, TrendingUp, AlertTriangle } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatCard from '../../components/common/StatCard'
import TaskTable from '../../components/task/TaskTable'
import CreateTaskModal from '../../components/task/CreateTaskModal'
import Loader from '../../components/common/Loader'
import { taskService, userService } from '../../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [employees, setEmployees] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const loadData = async () => {
    try {
      const [tasksRes, employeesRes, statsRes] = await Promise.all([
        taskService.getAllTasks(),
        userService.getAllEmployees(),
        taskService.getTaskStats(),
      ])
      setTasks(tasksRes.data)
      setEmployees(employeesRes.data)
      setStats(statsRes.data)
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await taskService.deleteTask(id)
      toast.success('Task deleted')
      loadData()
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const pieData = [
    { name: 'New', value: stats.new || 0, color: '#4cc9f0' },
    { name: 'Accepted', value: stats.accepted || 0, color: '#00f5ff' },
    { name: 'Completed', value: stats.completed || 0, color: '#22c55e' },
    { name: 'Rejected', value: stats.rejected || 0, color: '#f72585' },
  ].filter(d => d.value > 0)

  if (loading) return <DashboardLayout title="Dashboard"><div className="flex justify-center mt-20"><Loader size="lg" /></div></DashboardLayout>

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-8 animate-fade-in">

        {/* Welcome banner */}
        <div className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.08) 0%, rgba(155, 93, 229, 0.08) 100%)',
            border: '1px solid rgba(0, 245, 255, 0.15)',
          }}>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
            <TrendingUp size={80} className="text-neon-cyan" />
          </div>
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-1">
              Good day, {user?.name?.split(' ')[0]} 👋
            </h2>
            <p className="text-obsidian-300 text-sm">
              You have <span className="text-neon-cyan font-semibold">{stats.new || 0} new tasks</span> and{' '}
              <span className="text-neon-cyan font-semibold">{employees.length} employees</span> on your team.
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Tasks" value={stats.total || 0} icon={ClipboardList} color="cyan" />
          <StatCard title="Employees" value={employees.length} icon={Users} color="purple" />
          <StatCard title="Completed" value={stats.completed || 0} icon={CheckCircle} color="green" />
          <StatCard title="Pending" value={(stats.new || 0) + (stats.accepted || 0)} icon={Clock} color="yellow" />
        </div>

        {/* Charts + Recent Tasks row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Pie chart */}
          <div className="card">
            <h3 className="section-title mb-4">Task Distribution</h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#1a1a35',
                        border: '1px solid rgba(42,42,74,0.8)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#e0e0eb',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {pieData.map(item => (
                    <div key={item.name} className="flex items-center gap-2 text-xs text-obsidian-300">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      <span>{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-40 text-obsidian-400 text-sm">No task data yet</div>
            )}
          </div>

          {/* Employee list */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">Team Members</h3>
              <span className="text-xs text-obsidian-400">{employees.length} total</span>
            </div>
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {employees.length === 0 ? (
                <p className="text-obsidian-400 text-sm text-center py-8">No employees yet</p>
              ) : (
                employees.map(emp => {
                  const empTasks = tasks.filter(t => t.assignedTo?.id === emp.id)
                  const completed = empTasks.filter(t => t.status === 'COMPLETED').length
                  return (
                    <div key={emp.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-hover transition-colors">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-obsidian-950 text-sm font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #00f5ff, #4cc9f0)' }}>
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{emp.name}</p>
                        <p className="text-obsidian-400 text-xs truncate">{emp.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-obsidian-300">{empTasks.length} tasks</p>
                        <p className="text-xs text-green-400">{completed} done</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Tasks table */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="section-title">All Tasks</h3>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2 py-2.5 px-4 text-sm"
            >
              <Plus size={15} />
              New Task
            </button>
          </div>
          <TaskTable
            tasks={tasks}
            onDelete={handleDeleteTask}
            onStatusUpdate={() => {}}
            isAdmin={true}
          />
        </div>

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

export default AdminDashboard
