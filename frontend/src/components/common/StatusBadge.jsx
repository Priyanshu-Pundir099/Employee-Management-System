const StatusBadge = ({ status }) => {
  const statusConfig = {
    NEW: { class: 'status-new', dot: 'bg-blue-400', label: 'New' },
    ACCEPTED: { class: 'status-accepted', dot: 'bg-cyan-400', label: 'Accepted' },
    COMPLETED: { class: 'status-completed', dot: 'bg-green-400', label: 'Completed' },
    REJECTED: { class: 'status-rejected', dot: 'bg-red-400', label: 'Rejected' },
  }

  const config = statusConfig[status] || statusConfig.NEW

  return (
    <span className={config.class}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} inline-block`} />
      {config.label}
    </span>
  )
}

export default StatusBadge
