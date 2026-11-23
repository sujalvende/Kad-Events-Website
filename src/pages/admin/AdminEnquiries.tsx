import { useState, useEffect } from 'react'
import { 
  Search, 
  Download, 
  Trash2, 
  X 
} from 'lucide-react'
import { 
  getEnquiries, 
  updateEnquiryStatus, 
  deleteEnquiry, 
  exportEnquiriesCSV, 
  type EnquiryRecord 
} from '../../lib/admin-store'

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState<string>('')
  const [activeModal, setActiveModal] = useState<EnquiryRecord | null>(null)

  const reload = () => setEnquiries(getEnquiries())

  useEffect(() => {
    reload()
  }, [])

  const handleStatusChange = (id: string, status: EnquiryRecord['status']) => {
    updateEnquiryStatus(id, status)
    reload()
    if (activeModal && activeModal.id === id) {
      setActiveModal({ ...activeModal, status })
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this inquiry record permanently?')) {
      deleteEnquiry(id)
      reload()
      if (activeModal?.id === id) setActiveModal(null)
    }
  }

  const filtered = enquiries.filter((e) => {
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      (e.company || '').toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.type.toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  })

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-gold">
            Pipeline Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Corporate Inquiries & Briefs
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Review inbound briefs from global corporate leaders and update delivery statuses.
          </p>
        </div>

        <button
          onClick={exportEnquiriesCSV}
          className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200 transition-colors hover:border-gold hover:text-gold self-start sm:self-auto"
        >
          <Download size={14} />
          <span>Export All CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl border border-white/10 bg-card">
          {(['all', 'new', 'contacted', 'proposal', 'confirmed', 'archived'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                statusFilter === tab
                  ? 'bg-gold text-ink font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, client, email..."
            className="w-full rounded-xl border border-white/10 bg-card py-2 pl-9 pr-4 text-xs text-white placeholder:text-muted/40 focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="rounded-xl border border-white/10 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[0.65rem]">
                <th className="py-3.5 px-4 font-semibold">Client / Company</th>
                <th className="py-3.5 px-4 font-semibold">Event Format</th>
                <th className="py-3.5 px-4 font-semibold">Date & Location</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    No inquiries matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-semibold text-white">{e.name}</p>
                      <p className="text-muted text-[0.7rem]">{e.company || 'Private Enterprise'}</p>
                      <p className="text-slate-400 text-[0.68rem]">{e.email}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-slate-200">{e.type}</span>
                      {e.attendees && (
                        <p className="text-[0.68rem] text-muted">{e.attendees} attendees</p>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      <p className="font-medium">{e.date || 'TBD'}</p>
                      <p className="text-[0.68rem] text-muted truncate max-w-[180px]">
                        {e.location || 'Location Pending'}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={e.status}
                        onChange={(ev) =>
                          handleStatusChange(e.id, ev.target.value as EnquiryRecord['status'])
                        }
                        className={`rounded px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider border focus:outline-none bg-card ${
                          e.status === 'new'
                            ? 'border-amber-500/40 text-amber-400'
                            : e.status === 'contacted'
                            ? 'border-blue-500/40 text-blue-400'
                            : e.status === 'proposal'
                            ? 'border-purple-500/40 text-purple-400'
                            : e.status === 'confirmed'
                            ? 'border-emerald-500/40 text-emerald-400'
                            : 'border-slate-500/40 text-slate-400'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="proposal">Proposal</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => setActiveModal(e)}
                        className="rounded border border-white/10 px-2.5 py-1 text-[0.68rem] font-semibold text-gold hover:border-gold transition-colors"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="rounded border border-white/10 p-1 text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Inspection Drawer / Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-2xl border border-white/15 bg-card p-6 sm:p-8 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[0.62rem] font-bold uppercase tracking-wider text-gold">
                  Inquiry Inspection
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{activeModal.name}</h3>
                <p className="text-xs text-muted">{activeModal.company || 'Enterprise Client'}</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <span className="text-muted block text-[0.65rem] uppercase font-bold">Direct Email</span>
                  <a href={`mailto:${activeModal.email}`} className="text-gold font-medium hover:underline break-all">
                    {activeModal.email}
                  </a>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <span className="text-muted block text-[0.65rem] uppercase font-bold">Direct Phone</span>
                  <a href={`tel:${activeModal.phone}`} className="text-white font-medium hover:underline">
                    {activeModal.phone || 'Not provided'}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <span className="text-muted block text-[0.65rem] uppercase font-bold">Event Format</span>
                  <p className="text-white font-semibold mt-0.5">{activeModal.type}</p>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <span className="text-muted block text-[0.65rem] uppercase font-bold">Target Date</span>
                  <p className="text-white font-semibold mt-0.5">{activeModal.date || 'Flexible'}</p>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <span className="text-muted block text-[0.65rem] uppercase font-bold">Delegates / Pax</span>
                  <p className="text-white font-semibold mt-0.5">{activeModal.attendees || 'TBD'}</p>
                </div>
              </div>

              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <span className="text-muted block text-[0.65rem] uppercase font-bold">Preferred Location / Venue</span>
                <p className="text-white font-medium mt-0.5">{activeModal.location || 'Open to recommendation'}</p>
              </div>

              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <span className="text-muted block text-[0.65rem] uppercase font-bold">Confidential Brief & Scope Notes</span>
                <p className="text-slate-200 mt-1 whitespace-pre-wrap leading-relaxed">
                  {activeModal.notes || 'No specific notes entered.'}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[0.65rem] text-muted">
                  Submitted: {new Date(activeModal.submittedAt).toLocaleString()}
                </span>
                <div className="flex gap-2">
                  <a
                    href={`mailto:${activeModal.email}?subject=KAD Events // Executive Follow-up: ${encodeURIComponent(activeModal.type)}`}
                    className="rounded-lg bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-transform hover:scale-105"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
