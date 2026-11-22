import { saveEnquiry } from './admin-store'

export type Enquiry = Record<'name' | 'company' | 'email' | 'phone' | 'type' | 'date' | 'attendees' | 'location' | 'notes', string>

/**
 * Submission hook point. Persists into KAD Events executive admin store,
 * and simulates network request or connects to real API endpoint.
 */
export async function submitEnquiry(data: Enquiry): Promise<void> {
  await new Promise((r) => setTimeout(r, 1200))
  saveEnquiry(data)
}

export function validate(d: Enquiry): Partial<Record<keyof Enquiry, string>> {
  const e: Partial<Record<keyof Enquiry, string>> = {}
  if (d.name.trim().length < 2) e.name = 'Please enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = 'Enter a valid email address.'
  if (d.phone && !/^[+\d][\d\s()-]{6,}$/.test(d.phone)) e.phone = 'Enter a valid phone number.'
  if (!d.type) e.type = 'Select an event type.'
  if (d.date && new Date(d.date) < new Date(new Date().toDateString())) e.date = 'Choose a date in the future.'
  if (d.attendees && (!/^\d+$/.test(d.attendees) || +d.attendees < 1)) e.attendees = 'Enter a whole number.'
  return e
}
