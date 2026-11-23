import { Shield, Cpu, Landmark, Car, HeartPulse, Zap, ShoppingBag } from 'lucide-react'

const sectors = [
  { icon: Cpu, name: 'Technology & Enterprise IT', status: 'Active Engagements', tier: 'Tier-1 Global' },
  { icon: Landmark, name: 'Financial Services & BFSI', status: 'Active Engagements', tier: 'Private Banking & PE' },
  { icon: Car, name: 'Automotive & Mobility', status: 'Active Engagements', tier: 'Global OEM' },
  { icon: HeartPulse, name: 'Healthcare & Life Sciences', status: 'Active Engagements', tier: 'International Congresses' },
  { icon: Zap, name: 'Energy & Infrastructure', status: 'Active Engagements', tier: 'Ministerial & State' },
  { icon: ShoppingBag, name: 'Consumer Brands & Retail', status: 'Active Engagements', tier: 'National Sales' },
]

export default function AdminClients() {
  return (
    <div className="max-w-6xl space-y-6">
      <div className="pb-6 border-b border-white/10">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-gold">
          Client Sectors
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
          Enterprise Client Sectors & Governance
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Industry verticals serviced exclusively under corporate event management protocols.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sectors.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.name} className="rounded-xl border border-white/10 bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
                  <Icon size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">{s.name}</h2>
                  <p className="text-[0.68rem] text-gold font-medium">{s.tier}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[0.68rem] text-slate-400">
                <span className="flex items-center gap-1">
                  <Shield size={11} className="text-emerald-400" /> Non-Disclosure Standard
                </span>
                <span className="text-emerald-400 font-semibold">{s.status}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
