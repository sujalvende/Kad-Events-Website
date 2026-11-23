import { useState } from 'react'
import { Settings, Save, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react'
import { contact } from '../../data/content'

export default function AdminSettings() {
  const [email, setEmail] = useState(contact.email)
  const [phone, setPhone] = useState(contact.phone)
  const [location, setLocation] = useState(contact.location)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="pb-6 border-b border-white/10">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-gold">
          System Configuration
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
          Corporate Settings & Contact Hubs
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Configure executive communication lines, notification routing, and corporate division details.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/10">
          <div className="grid h-10 w-10 place-items-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
            <Settings size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">General Business Identity</h2>
            <p className="text-xs text-muted">KAD Events Pvt. Ltd. (Corporate Event Management Division)</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-xs">
          <div>
            <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Executive Briefing Email
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-white focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Direct Executive Phone Line
            </label>
            <div className="relative">
              <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-white focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Headquarters / International Coordination
            </label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-white focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck size={14} className="text-gold" /> Encrypted Client Data Storage
            </span>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-none bg-gold px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-ink transition-transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            >
              <Save size={14} />
              <span>{saved ? 'Saved Changes' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
