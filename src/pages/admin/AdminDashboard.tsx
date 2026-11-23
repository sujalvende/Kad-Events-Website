import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { 
  Inbox, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Download 
} from 'lucide-react'
import { getEnquiries, exportEnquiriesCSV, type EnquiryRecord } from '../../lib/admin-store'
import { services } from '../../data/content'

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([])

  useEffect(() => {
    setEnquiries(getEnquiries())
  }, [])

  const newCount = enquiries.filter((e) => e.status === 'new').length
  const proposalCount = enquiries.filter((e) => e.status === 'proposal').length
  const confirmedCount = enquiries.filter((e) => e.status === 'confirmed').length

  return (
    <div className="max-w-6xl space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-gold">
            Executive Command
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Corporate Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Live pipeline monitoring for KAD Events corporate summits, reveals, and galas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportEnquiriesCSV}
            className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-200 transition-colors hover:border-gold hover:text-gold"
          >
            <Download size={14} />
            <span>Export Inquiries CSV</span>
          </button>
          <Link
            to="/admin/enquiries"
            className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition-transform hover:scale-105 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
          >
            <span>Triage Inquiries</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-bold uppercase tracking-wider text-muted">
              Unreviewed Leads
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-400">
              <Clock size={16} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-white">{newCount}</p>
          <p className="mt-1 text-[0.7rem] text-slate-400">Requires 24h executive triage</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-bold uppercase tracking-wider text-muted">
              Active Proposals
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/10 text-blue-400">
              <Inbox size={16} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-white">{proposalCount}</p>
          <p className="mt-1 text-[0.7rem] text-slate-400">3D spatial & budget decks sent</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-bold uppercase tracking-wider text-muted">
              Confirmed Shows
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={16} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-white">{confirmedCount}</p>
          <p className="mt-1 text-[0.7rem] text-slate-400">Turnkey production locked</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-bold uppercase tracking-wider text-muted">
              Corporate Formats
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold/10 text-gold">
              <Layers size={16} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-white">{services.length}</p>
          <p className="mt-1 text-[0.7rem] text-slate-400">Exclusively corporate categories</p>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="rounded-xl border border-white/10 bg-card p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Enterprise Inquiries</h2>
            <p className="text-xs text-muted">Submitted via public corporate briefing form</p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-semibold text-gold hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[0.65rem]">
                <th className="pb-3 font-semibold">Client / Company</th>
                <th className="pb-3 font-semibold">Event Format</th>
                <th className="pb-3 font-semibold">Target Date</th>
                <th className="pb-3 font-semibold">Attendees</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {enquiries.slice(0, 5).map((e) => (
                <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 pr-4">
                    <p className="font-semibold text-white">{e.name}</p>
                    <p className="text-muted text-[0.7rem]">{e.company || e.email}</p>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-300">{e.type}</td>
                  <td className="py-3.5 pr-4 text-slate-400">{e.date || 'TBD'}</td>
                  <td className="py-3.5 pr-4 text-slate-400">{e.attendees ? `${e.attendees} pax` : '—'}</td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[0.62rem] font-bold uppercase tracking-wider ${
                        e.status === 'new'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : e.status === 'contacted'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : e.status === 'proposal'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          : e.status === 'confirmed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      to="/admin/enquiries"
                      className="text-gold hover:underline text-[0.72rem] font-semibold"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
