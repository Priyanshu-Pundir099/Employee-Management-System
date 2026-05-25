import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { taskService } from '../../services/api'

const CreateTaskModal = ({ employees, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedToId: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Title is required')
    if (!form.assignedToId) return toast.error('Please select an employee')

    setLoading(true)
    try {
      await taskService.createTask({
        ...form,
        assignedToId: parseInt(form.assignedToId),
        dueDate: form.dueDate || null,
      })
      toast.success('Task created successfully!')
      onSuccess()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5, 5, 14, 0.8)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md animate-slide-up"
        style={{
          background: 'linear-gradient(180deg, #1a1a35 0%, #13132b 100%)',
          border: '1px solid rgba(42, 42, 74, 0.8)',
          borderRadius: '24px',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6)',
        }}>

        <div className="flex items-center justify-between p-6 border-b border-surface-border/50">
          <div>
            <h2 className="text-white font-bold text-lg">Create New Task</h2>
            <p className="text-obsidian-400 text-sm mt-0.5">Assign a task to an employee</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-obsidian-400 hover:text-white hover:bg-surface-hover transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Task Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
              className="input-field"
              placeholder="e.g. Design new landing page"
              required
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
              className="input-field resize-none"
              rows={3}
              placeholder="Task details and requirements..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm(p => ({ ...p, dueDate: e.target.value }))}
                className="input-field"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div>
              <label className="label">Assign To *</label>
              <select
                value={form.assignedToId}
                onChange={(e) => setForm(p => ({ ...p, assignedToId: e.target.value }))}
                className="input-field"
                style={{ colorScheme: 'dark' }}
                required
              >
                <option value="">Select employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-4 h-4 border-2 border-obsidian-950/30 border-t-obsidian-950 rounded-full animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTaskModal
