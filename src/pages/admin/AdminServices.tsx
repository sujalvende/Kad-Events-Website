import { useState } from 'react'
import { Layers, CheckCircle2, Eye, ShieldCheck, Tag } from 'lucide-react'
import { services as initialServices, type Service } from '../../data/content'

export default function AdminServices() {
  const [servicesList] = useState<Service[]>(initialServices)

  return (
    <div className="max-w-6xl space-y-6">
      <div className="pb-6 border-b border-white/10">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-gold">
          Service Catalogue
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
          Corporate Event Services
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Exclusively corporate categories confirmed by KAD Events Pvt. Ltd. (strictly non-wedding).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {servicesList.map((service, i) => (
          <div
            key={service.slug}
            className="flex flex-col justify-between rounded-xl border border-white/10 bg-card p-5 transition-all hover:border-gold/30"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[0.62rem] font-bold uppercase tracking-wider text-gold">
                  Format #{String(i + 1).padStart(2, '0')}
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[0.62rem] font-bold uppercase text-emerald-400">
                  <CheckCircle2 size={11} /> Published
                </span>
              </div>

              <h2 className="text-base font-bold text-white mt-3">{service.title}</h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{service.short}</p>

              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-muted mb-2">
                  Offerings Included:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {service.offerings.map((o) => (
                    <span
                      key={o}
                      className="rounded bg-white/[0.04] px-2 py-0.5 text-[0.62rem] text-slate-300"
                    >
                      {o}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-muted">
              <span className="font-mono text-[0.68rem]">/services/{service.slug}</span>
              <span className="flex items-center gap-1 text-[0.65rem] text-gold font-semibold">
                <ShieldCheck size={12} /> Corporate Division
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
