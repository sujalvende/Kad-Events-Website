import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react'
import { loginAdmin } from '../../lib/admin-store'
import { Logo } from '../../components/Navbar'

export default function AdminLogin() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginAdmin(pin.trim())) {
      navigate('/admin/dashboard')
    } else {
      setError(true)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background bloom */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-gold/10 blur-[140px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Logo />
          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Executive Production Portal
          </p>
          <p className="mt-1 text-xs text-muted">
            Internal event management & corporate enquiry triage
          </p>
        </div>

        {/* Login box */}
        <div className="rounded-2xl border border-white/10 bg-card p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="grid h-9 w-9 place-items-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
              <Lock size={16} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide">Executive Access</h2>
              <p className="text-[0.7rem] text-muted">Confidential administrative portal</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-pin" className="block text-[0.68rem] uppercase tracking-wider text-slate-300 font-semibold mb-2">
                Access Passcode
              </label>
              <input
                id="admin-pin"
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value)
                  if (error) setError(false)
                }}
                placeholder="Enter access code (e.g. kad2026)"
                className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-snow placeholder:text-muted/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                autoFocus
              />
            </div>

            {error && (
              <p className="flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle size={14} />
                <span>Invalid passcode. (Demo default: kad2026)</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-none bg-gold py-3 text-xs font-bold uppercase tracking-[0.22em] text-ink transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(212,175,55,0.35)]"
            >
              <span>Authenticate Session</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[0.7rem] text-muted">
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-gold" /> Encrypted Session
            </span>
            <span className="font-mono text-slate-500">Default: kad2026</span>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-gold transition-colors">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  )
}
