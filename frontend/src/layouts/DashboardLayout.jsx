import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'

const DashboardLayout = ({ children, title }) => {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0a18' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-6"
          style={{
            background: 'radial-gradient(ellipse at top right, rgba(0, 245, 255, 0.03) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(155, 93, 229, 0.03) 0%, transparent 60%)',
          }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
