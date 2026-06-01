const Loader = ({ fullScreen = false, size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  }

  const spinner = (
    <div className={`${sizes[size]} rounded-full border-surface-border border-t-neon-cyan animate-spin`} />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-obsidian-950 z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-surface-border border-t-neon-cyan animate-spin" />
          <p className="text-obsidian-300 text-sm animate-pulse">Loading...</p>
        </div>
      </div>
    )
  }

  return spinner
}

export default Loader
