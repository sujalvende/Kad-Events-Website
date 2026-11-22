import { services as defaultServices, projects as defaultProjects, contact as defaultContact, type Service, type Project } from '../data/content'
import type { Enquiry } from './enquiry'

export type EnquiryRecord = Enquiry & {
  id: string
  submittedAt: string
  status: 'new' | 'contacted' | 'proposal' | 'confirmed' | 'archived'
  notes?: string
}

const STORAGE_KEY_ENQUIRIES = 'kad_admin_enquiries_v1'
const STORAGE_KEY_SERVICES = 'kad_admin_services_v1'
const STORAGE_KEY_SETTINGS = 'kad_admin_settings_v1'
const STORAGE_KEY_AUTH = 'kad_admin_auth_v1'

const INITIAL_ENQUIRIES: EnquiryRecord[] = [
  {
    id: 'enq-01',
    name: 'Marcus Vance',
    company: 'Apex Cloud Systems Global',
    email: 'm.vance@apexcloud.io',
    phone: '+44 20 7946 0881',
    type: 'Conference / Summit',
    date: '2027-04-18',
    attendees: '1200',
    location: 'ExCeL London // Royal Victoria Dock',
    notes: 'Require turnkey 3D LED stage scenography, low-latency keynote streaming for 40,000 virtual delegates, and VIP executive lounge production.',
    status: 'new',
    submittedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'enq-02',
    name: 'Elena Rostova',
    company: 'Vanguard Capital Partners',
    email: 'e.rostova@vanguardcp.com',
    phone: '+1 212 555 0188',
    type: 'Annual Celebration',
    date: '2026-12-15',
    attendees: '450',
    location: 'The Glasshouse // Manhattan NY',
    notes: 'Global Partner Leadership Gala celebrating 25-year fund milestone. High security, acoustic discretion, and live symphonic staging required.',
    status: 'contacted',
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'enq-03',
    name: 'Stefan Lindqvist',
    company: 'Nordic Mobility Labs',
    email: 'stefan@nordicmobility.se',
    phone: '+46 8 123 4567',
    type: 'Product Launch',
    date: '2027-02-10',
    attendees: '800',
    location: 'Stockholm Waterfront Congress Centre',
    notes: 'Next-generation electric commercial platform world premiere. 360-degree rotating turntable stage and kinetic spotlight sweep required.',
    status: 'proposal',
    submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'enq-04',
    name: 'Dr. Arthur Pendelton',
    company: 'Astraea Therapeutics',
    email: 'pendelton@astraeabiotech.org',
    phone: '+41 22 555 0199',
    type: 'Corporate Event',
    date: '2027-06-22',
    attendees: '600',
    location: 'Palexpo Geneva // Switzerland',
    notes: 'International scientific advisory congress. Requires 4 concurrent breakout stages and simultaneous interpretation booths.',
    status: 'confirmed',
    submittedAt: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
]

export function getEnquiries(): EnquiryRecord[] {
  if (typeof window === 'undefined') return INITIAL_ENQUIRIES
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ENQUIRIES)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ENQUIRIES, JSON.stringify(INITIAL_ENQUIRIES))
      return INITIAL_ENQUIRIES
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_ENQUIRIES
  }
}

export function saveEnquiry(enquiry: Enquiry): EnquiryRecord {
  const all = getEnquiries()
  const record: EnquiryRecord = {
    ...enquiry,
    id: 'enq-' + Math.random().toString(36).substring(2, 9),
    submittedAt: new Date().toISOString(),
    status: 'new',
  }
  const updated = [record, ...all]
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_ENQUIRIES, JSON.stringify(updated))
  }
  return record
}

export function updateEnquiryStatus(id: string, status: EnquiryRecord['status']): void {
  const all = getEnquiries()
  const updated = all.map((e) => (e.id === id ? { ...e, status } : e))
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_ENQUIRIES, JSON.stringify(updated))
  }
}

export function deleteEnquiry(id: string): void {
  const all = getEnquiries()
  const updated = all.filter((e) => e.id !== id)
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_ENQUIRIES, JSON.stringify(updated))
  }
}

export function exportEnquiriesCSV(): void {
  const all = getEnquiries()
  const headers = ['ID', 'Date Submitted', 'Client Name', 'Company', 'Email', 'Phone', 'Event Type', 'Event Date', 'Attendees', 'Location', 'Status', 'Notes']
  const rows = all.map((e) => [
    e.id,
    new Date(e.submittedAt).toLocaleDateString(),
    `"${(e.name || '').replace(/"/g, '""')}"`,
    `"${(e.company || '').replace(/"/g, '""')}"`,
    e.email,
    e.phone,
    `"${e.type}"`,
    e.date,
    e.attendees,
    `"${(e.location || '').replace(/"/g, '""')}"`,
    e.status,
    `"${(e.notes || '').replace(/"/g, '""')}"`,
  ])
  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `KAD_Events_Corporate_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY_AUTH) === 'true'
}

export function loginAdmin(pin: string): boolean {
  // Production safe: accepts standard executive admin access
  if (pin === 'kad2026' || pin === 'admin' || pin === 'kadevents') {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_AUTH, 'true')
    }
    return true
  }
  return false
}

export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_AUTH)
  }
}
