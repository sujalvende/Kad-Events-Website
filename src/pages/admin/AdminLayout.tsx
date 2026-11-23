import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router'
import { 
  LayoutDashboard, 
  Inbox, 
  Layers, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  ExternalLink,
  Menu,
  X
} from 'lucide-react'
import { isAdminAuthenticated, logoutAdmin, getEnquiries } from '../../lib/admin-store'
import { Logo } from '../../components/Navbar'

const links = [
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/enquiries', label: 'Inquiries', icon: Inbox, hasBadge: true },
  { to: '/admin/services', label: 'Event Services', icon: Layers },
  { to: '/admin/projects', label: 'Portfolio', icon: Briefcase },
  { to: '/admin/clients', label: 'Client Sectors', icon: Users },
  { to: '/admin/settings', label: 'Configuration', icon: Settings },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [unresolvedCount, setUnresolvedCount] = useState(0)

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login')
    } else {
      const enqs = getEnquiries()
      setUnresolvedCount(enqs.filter((e) => e.status === 'new').length)
    }
  }, [navigate])

  const handleLogout = () => {
    logoutAdmin()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-ink text-white flex flex-col md:flex-row">
      {/* Top Mobile Bar */}
      <header className="md:hidden flex items-center justify-between border-b border-white/10 bg-card px-4 py-3 sticky top-0 z-40">
        <Logo />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-300 hover:text-white"
          aria-label="Toggle admin navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-card/95 backdrop-blur-xl p-5 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div>
              <Logo />
              <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.25em] text-gold">
                Management Portal
              </p>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5" aria-label="Admin Navigation">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'bg-gold text-ink font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                        : 'text-slate-300 hover:bg-white/[0.04] hover:text-gold'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{link.label}</span>
                  </div>
                  {link.hasBadge && unresolvedCount > 0 && (
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[0.62rem] font-bold text-white">
                      {unresolvedCount}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ExternalLink size={14} />
            <span>View Public Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
          >
            <LogOut size={14} />
            <span>End Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-ink p-4 sm:p-6 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
