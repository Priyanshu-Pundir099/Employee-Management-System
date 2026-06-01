const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => {
  const colorMap = {
    cyan: {
      bg: 'rgba(0, 245, 255, 0.08)',
      border: 'rgba(0, 245, 255, 0.2)',
      icon: 'rgba(0, 245, 255, 0.15)',
      iconColor: '#00f5ff',
      text: '#00f5ff',
    },
    purple: {
      bg: 'rgba(155, 93, 229, 0.08)',
      border: 'rgba(155, 93, 229, 0.2)',
      icon: 'rgba(155, 93, 229, 0.15)',
      iconColor: '#9b5de5',
      text: '#9b5de5',
    },
    green: {
      bg: 'rgba(76, 201, 240, 0.08)',
      border: 'rgba(76, 201, 240, 0.2)',
      icon: 'rgba(76, 201, 240, 0.15)',
      iconColor: '#4cc9f0',
      text: '#4cc9f0',
    },
    red: {
      bg: 'rgba(247, 37, 133, 0.08)',
      border: 'rgba(247, 37, 133, 0.2)',
      icon: 'rgba(247, 37, 133, 0.15)',
      iconColor: '#f72585',
      text: '#f72585',
    },
    yellow: {
      bg: 'rgba(255, 230, 109, 0.08)',
      border: 'rgba(255, 230, 109, 0.2)',
      icon: 'rgba(255, 230, 109, 0.15)',
      iconColor: '#ffe66d',
      text: '#ffe66d',
    },
  }

  const c = colorMap[color] || colorMap.cyan

  return (
    <div className="rounded-2xl p-5 transition-all duration-300 hover:translate-y-[-2px]"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
      }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: c.icon }}>
          <Icon size={18} style={{ color: c.iconColor }} />
        </div>
        {trend !== undefined && (
          <span className="text-xs font-medium px-2 py-1 rounded-full"
            style={{
              background: trend >= 0 ? 'rgba(76, 201, 240, 0.1)' : 'rgba(247, 37, 133, 0.1)',
              color: trend >= 0 ? '#4cc9f0' : '#f72585',
            }}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold mb-1" style={{ color: c.text }}>{value}</p>
        <p className="text-obsidian-300 text-sm font-medium">{title}</p>
        {subtitle && <p className="text-obsidian-500 text-xs mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}

export default StatCard
