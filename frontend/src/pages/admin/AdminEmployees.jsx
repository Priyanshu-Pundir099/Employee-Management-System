import { useState, useEffect } from 'react'
import { Users, Mail, Calendar, ClipboardList } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { userService, taskService } from '../../services/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const loadData = async () => {
    try {
      const [empRes, taskRes] = await Promise.all([
        userService.getAllEmployees(),
        taskService.getAllTasks(),
      ])
      setEmployees(empRes.data)
      setTasks(taskRes.data)
      if (empRes.data.length > 0) setSelected(empRes.data[0])
    } catch {
      toast.error('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const getEmpTasks = (empId) => tasks.filter(t => t.assignedTo?.id === empId)

  const getTaskCountByStatus = (empId, status) =>
    tasks.filter(t => t.assignedTo?.id === empId && t.status === status).length

  const formatDate = (d) => {
    if (!d) return '—'
    try { return format(new Date(d), 'MMM dd, yyyy') } catch { return d }
  }

  if (loading) return <DashboardLayout title="Employees"><div className="flex justify-center mt-20"><Loader size="lg" /></div></DashboardLayout>

  return (
    <DashboardLayout title="Employees">
      <div className="space-y-6 animate-fade-in">

        <div>
          <h1 className="page-title">Team Members</h1>
          <p className="text-obsidian-400 text-sm mt-1">{employees.length} employees in your organization</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Employee list */}
          <div className="card space-y-2 max-h-[600px] overflow-y-auto">
            <h3 className="section-title mb-4 flex items-center gap-2">
              <Users size={16} /> All Employees
            </h3>
            {employees.length === 0 ? (
              <p className="text-obsidian-400 text-sm text-center py-8">No employees registered yet</p>
            ) : (
              employees.map(emp => {
                const empTaskCount = getEmpTasks(emp.id).length
                const isSelected = selected?.id === emp.id
                return (
                  <button
                    key={emp.id}
                    onClick={() => setSelected(emp)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                      isSelected ? 'bg-neon-cyan/10 border border-neon-cyan/20' : 'hover:bg-surface-hover border border-transparent'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-obsidian-950 font-bold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #00f5ff, #4cc9f0)' }}>
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${isSelected ? 'text-neon-cyan' : 'text-white'}`}>{emp.name}</p>
                      <p className="text-obsidian-400 text-xs truncate">{emp.email}</p>
                    </div>
                    <span className="text-xs text-obsidian-400 flex-shrink-0">{empTaskCount} tasks</span>
                  </button>
                )
              })
            )}
          </div>

          {/* Employee detail */}
          <div className="lg:col-span-2 space-y-4">
            {selected ? (
              <>
                {/* Profile card */}
                <div className="card">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-obsidian-950 text-2xl font-bold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #00f5ff, #9b5de5)' }}>
                      {selected.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-obsidian-300 text-sm">
                          <Mail size={13} /> {selected.email}
                        </span>
                        <span className="flex items-center gap-1.5 text-obsidian-300 text-sm">
                          <Calendar size={13} /> Joined {formatDate(selected.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(0, 245, 255, 0.1)', color: '#00f5ff', border: '1px solid rgba(0, 245, 255, 0.2)' }}>
                      {selected.role}
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-4 gap-3 mt-5 pt-5 border-t border-surface-border/50">
                    {[
                      { label: 'Total', count: getEmpTasks(selected.id).length, color: '#00f5ff' },
                      { label: 'New', count: getTaskCountByStatus(selected.id, 'NEW'), color: '#4cc9f0' },
                      { label: 'Completed', count: getTaskCountByStatus(selected.id, 'COMPLETED'), color: '#22c55e' },
                      { label: 'Rejected', count: getTaskCountByStatus(selected.id, 'REJECTED'), color: '#f72585' },
                    ].map(s => (
                      <div key={s.label} className="text-center p-3 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <p className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</p>
                        <p className="text-obsidian-400 text-xs mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks list */}
                <div className="card">
                  <h3 className="section-title mb-4 flex items-center gap-2">
                    <ClipboardList size={16} /> Assigned Tasks
                  </h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {getEmpTasks(selected.id).length === 0 ? (
                      <p className="text-obsidian-400 text-sm text-center py-8">No tasks assigned yet</p>
                    ) : (
                      getEmpTasks(selected.id).map(task => (
                        <div key={task.id} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors"
                          style={{ border: '1px solid rgba(42, 42, 74, 0.4)' }}>
                          <div className="flex-1 min-w-0 pr-3">
                            <p className="text-white text-sm font-medium truncate">{task.title}</p>
                            {task.dueDate && (
                              <p className="text-obsidian-400 text-xs mt-0.5">Due {formatDate(task.dueDate)}</p>
                            )}
                          </div>
                          <StatusBadge status={task.status} />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="card flex items-center justify-center py-20">
                <p className="text-obsidian-400">Select an employee to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminEmployees
