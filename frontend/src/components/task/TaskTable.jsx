import { Trash2, CheckCircle, XCircle, Edit } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'
import { format } from 'date-fns'

const TaskTable = ({ tasks, onStatusUpdate, onDelete, isAdmin }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy')
    } catch {
      return dateStr
    }
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-16 text-obsidian-400">
        <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={24} className="text-obsidian-500" />
        </div>
        <p className="font-medium">No tasks found</p>
        <p className="text-sm text-obsidian-500 mt-1">Tasks will appear here once created</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(42, 42, 74, 0.5)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'rgba(17, 17, 40, 0.8)', borderBottom: '1px solid rgba(42, 42, 74, 0.5)' }}>
            <th className="text-left px-5 py-3.5 text-obsidian-400 font-semibold text-xs tracking-wider uppercase">Task</th>
            <th className="text-left px-5 py-3.5 text-obsidian-400 font-semibold text-xs tracking-wider uppercase">Assigned To</th>
            <th className="text-left px-5 py-3.5 text-obsidian-400 font-semibold text-xs tracking-wider uppercase">Status</th>
            <th className="text-left px-5 py-3.5 text-obsidian-400 font-semibold text-xs tracking-wider uppercase">Due Date</th>
            <th className="text-left px-5 py-3.5 text-obsidian-400 font-semibold text-xs tracking-wider uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, i) => (
            <tr key={task.id}
              className="transition-colors hover:bg-surface-hover/50"
              style={{
                borderBottom: i < tasks.length - 1 ? '1px solid rgba(42, 42, 74, 0.3)' : 'none',
              }}>
              <td className="px-5 py-4">
                <div>
                  <p className="text-white font-medium">{task.title}</p>
                  {task.description && (
                    <p className="text-obsidian-400 text-xs mt-0.5 line-clamp-1">{task.description}</p>
                  )}
                </div>
              </td>
              <td className="px-5 py-4">
                {task.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-obsidian-950"
                      style={{ background: 'linear-gradient(135deg, #00f5ff, #4cc9f0)' }}>
                      {task.assignedTo.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-obsidian-200">{task.assignedTo.name}</span>
                  </div>
                ) : (
                  <span className="text-obsidian-500">Unassigned</span>
                )}
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={task.status} />
              </td>
              <td className="px-5 py-4 text-obsidian-300">
                {formatDate(task.dueDate)}
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  {!isAdmin && task.status === 'NEW' && (
                    <>
                      <button
                        onClick={() => onStatusUpdate(task.id, 'ACCEPTED')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                        title="Accept"
                      >
                        <CheckCircle size={13} /> Accept
                      </button>
                      <button
                        onClick={() => onStatusUpdate(task.id, 'REJECTED')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-300 hover:bg-red-500/10 transition-colors"
                        title="Reject"
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </>
                  )}
                  {!isAdmin && task.status === 'ACCEPTED' && (
                    <button
                      onClick={() => onStatusUpdate(task.id, 'COMPLETED')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-green-300 hover:bg-green-500/10 transition-colors"
                    >
                      <CheckCircle size={13} /> Complete
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => onDelete(task.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TaskTable
