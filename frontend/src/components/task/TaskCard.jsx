import { Calendar, User, MoreVertical, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useState } from 'react'
import StatusBadge from '../common/StatusBadge'
import { format } from 'date-fns'

const TaskCard = ({ task, onStatusUpdate, onDelete, isAdmin }) => {
  const [showMenu, setShowMenu] = useState(false)

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date'
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy')
    } catch {
      return dateStr
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED'

  return (
    <div className="card glass-hover relative group animate-slide-up">
      {/* Overdue indicator */}
      {isOverdue && (
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
          style={{ background: 'linear-gradient(90deg, #f72585, transparent)' }} />
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-2">
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">{task.title}</h3>
        </div>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-obsidian-400 hover:text-white hover:bg-surface-hover transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={14} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 z-50 py-1 min-w-[140px] rounded-xl shadow-elevated animate-fade-in"
              style={{
                background: '#1a1a35',
                border: '1px solid rgba(42, 42, 74, 0.8)',
              }}>
              {!isAdmin && task.status === 'NEW' && (
                <>
                  <button
                    onClick={() => { onStatusUpdate(task.id, 'ACCEPTED'); setShowMenu(false) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-cyan-300 hover:bg-surface-hover transition-colors"
                  >
                    <CheckCircle size={12} /> Accept
                  </button>
                  <button
                    onClick={() => { onStatusUpdate(task.id, 'REJECTED'); setShowMenu(false) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-300 hover:bg-surface-hover transition-colors"
                  >
                    <XCircle size={12} /> Reject
                  </button>
                </>
              )}
              {!isAdmin && task.status === 'ACCEPTED' && (
                <button
                  onClick={() => { onStatusUpdate(task.id, 'COMPLETED'); setShowMenu(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-green-300 hover:bg-surface-hover transition-colors"
                >
                  <CheckCircle size={12} /> Mark Complete
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => { onDelete(task.id); setShowMenu(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-300 hover:bg-surface-hover transition-colors"
                >
                  <Trash2 size={12} /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-obsidian-400 text-xs leading-relaxed mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        <StatusBadge status={task.status} />
        <div className="flex items-center gap-3">
          {task.assignedTo && (
            <div className="flex items-center gap-1.5 text-obsidian-400 text-xs">
              <User size={11} />
              <span className="truncate max-w-[80px]">{task.assignedTo.name}</span>
            </div>
          )}
          <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? 'text-red-400' : 'text-obsidian-400'}`}>
            {isOverdue ? <Clock size={11} /> : <Calendar size={11} />}
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
