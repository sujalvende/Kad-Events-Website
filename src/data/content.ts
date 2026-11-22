import type { PhotoKey } from '../lib/img'

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Our Work', to: '/work' },
  { label: 'Our Process', to: '/process' },
  { label: 'Clients', to: '/clients' },
  { label: 'Contact', to: '/contact' },
]

export type Service = { slug: string; title: string; short: string; intro: string; offerings: string[]; photo: PhotoKey; gallery: PhotoKey[] }

// Editable placeholders: confirm the final service list and offerings with KAD Events.
export const services: Service[] = [
  { slug: 'corporate-events', title: 'Corporate Events', short: 'Gatherings that bring teams and leaders together.', intro: 'Company gatherings, planned and produced so they feel considered from the first invitation to the last goodbye.', offerings: ['Concept and theming', 'Venue sourcing', 'Production and staging', 'On-site management'], photo: 'seated', gallery: ['crowd', 'dinner', 'lights'] },
  { slug: 'conferences-summits', title: 'Conferences & Summits', short: 'Stages and flow designed for focus.', intro: 'Multi-session events where content, space and technology work together to hold attention.', offerings: ['Programme flow', 'Stage and AV design', 'Speaker coordination', 'Registration and guest flow'], photo: 'conference', gallery: ['speaker', 'seated', 'blue'] },
  { slug: 'product-launches', title: 'Product Launches', short: 'Reveals staged for impact.', intro: 'Launch moments built around the product, with lighting, sound and pacing that give it presence.', offerings: ['Launch concept', 'Lighting and visuals', 'Media and guest experience', 'Rehearsal and run of show'], photo: 'lights', gallery: ['blue', 'conference', 'crowd'] },
  { slug: 'exhibitions-trade-shows', title: 'Exhibitions & Trade Shows', short: 'Spaces that draw people in.', intro: 'Booths and exhibition spaces designed to attract visitors and make every conversation easier.', offerings: ['Stand design', 'Fabrication and build', 'Visitor engagement', 'Logistics and dismantle'], photo: 'expo', gallery: ['tent', 'trade', 'crowd'] },
  { slug: 'annual-celebrations', title: 'Annual Celebrations', short: 'Milestones worth gathering for.', intro: 'Annual dinners and celebrations that recognise people and mark the moments that matter.', offerings: ['Theme and styling', 'Entertainment planning', 'Catering coordination', 'Guest experience'], photo: 'dinner', gallery: ['seated', 'lights', 'crowd'] },
  { slug: 'award-ceremonies', title: 'Award Ceremonies', short: 'Recognition with ceremony.', intro: 'Ceremonies staged so every winner has their moment and every guest feels part of it.', offerings: ['Ceremony format', 'Stage and show design', 'Run of show', 'Trophy and award logistics'], photo: 'speaker', gallery: ['conference', 'blue', 'seated'] },
  { slug: 'brand-activations', title: 'Brand Activations', short: 'Let audiences step inside a brand.', intro: 'Interactive experiences that put your brand in front of people in a way they remember.', offerings: ['Experience concept', 'Interactive installations', 'Pop-ups and roadshows', 'Content capture'], photo: 'blue', gallery: ['lights', 'expo', 'tent'] },
  { slug: 'corporate-meetings', title: 'Corporate Meetings', short: 'Well-run rooms for important talks.', intro: 'Board meetings, offsites and training days handled end to end, so you can focus on the agenda.', offerings: ['Venue and setup', 'AV and hybrid support', 'Travel and hospitality', 'Day-of coordination'], photo: 'crowd', gallery: ['seated', 'conference', 'speaker'] },
]

export type Project = { slug: string; title: string; category: string; overview: string; photo: PhotoKey; gallery: PhotoKey[] }

// No real projects supplied yet. Every entry is a placeholder to be replaced.
export const projects: Project[] = [
  { slug: 'project-01', title: 'Project Title 01', category: 'Conferences', overview: 'A short overview of the brief, the setting and what KAD Events delivered.', photo: 'conference', gallery: ['speaker', 'seated', 'blue', 'crowd'] },
  { slug: 'project-02', title: 'Project Title 02', category: 'Launches', overview: 'A short overview of the brief, the setting and what KAD Events delivered.', photo: 'lights', gallery: ['blue', 'conference', 'crowd', 'speaker'] },
  { slug: 'project-03', title: 'Project Title 03', category: 'Celebrations', overview: 'A short overview of the brief, the setting and what KAD Events delivered.', photo: 'dinner', gallery: ['seated', 'lights', 'crowd', 'tent'] },
  { slug: 'project-04', title: 'Project Title 04', category: 'Exhibitions', overview: 'A short overview of the brief, the setting and what KAD Events delivered.', photo: 'tent', gallery: ['expo', 'trade', 'crowd', 'lights'] },
  { slug: 'project-05', title: 'Project Title 05', category: 'Conferences', overview: 'A short overview of the brief, the setting and what KAD Events delivered.', photo: 'speaker', gallery: ['conference', 'seated', 'crowd', 'blue'] },
  { slug: 'project-06', title: 'Project Title 06', category: 'Exhibitions', overview: 'A short overview of the brief, the setting and what KAD Events delivered.', photo: 'expo', gallery: ['trade', 'tent', 'crowd', 'lights'] },
]

export const steps: { n: string; title: string; text: string; photo: PhotoKey }[] = [
  { n: '01', title: 'Discover', text: 'We listen. Your goals, audience and constraints shape everything that follows.', photo: 'seated' },
  { n: '02', title: 'Create', text: 'Concepts, themes and experience ideas, presented clearly so you can choose with confidence.', photo: 'blue' },
  { n: '03', title: 'Plan', text: 'Logistics, vendors, timelines and production, coordinated in one place.', photo: 'conference' },
  { n: '04', title: 'Execute', text: 'Our team on site, running the event so everything feels effortless.', photo: 'lights' },
  { n: '05', title: 'Deliver', text: 'A smooth event, a clean wrap-up and a clear review afterwards.', photo: 'dinner' },
]

export const reasons = [
  { title: 'Creative concepts', text: 'Ideas built around your message.' },
  { title: 'Professional execution', text: 'Clear ownership, calm delivery.' },
  { title: 'Attention to detail', text: 'Small things planned as carefully as big ones.' },
  { title: 'End-to-end coordination', text: 'One team from brief to handover.' },
  { title: 'Client-focused', text: 'We stay accountable to your goals.' },
]

export const eventTypes = [
  'Corporate Event', 'Conference / Summit', 'Product Launch', 'Exhibition / Trade Show',
  'Annual Celebration', 'Award Ceremony', 'Brand Activation', 'Corporate Meeting', 'Other',
]

// Placeholder business details: replace with real ones.
export const contact = { email: 'hello@your-domain.com', phone: '+00 000 000 0000', location: 'City, Country' }

// Maps a service slug to the matching enquiry form option.
export const serviceEventType: Record<string, string> = {
  'corporate-events': 'Corporate Event', 'conferences-summits': 'Conference / Summit', 'product-launches': 'Product Launch',
  'exhibitions-trade-shows': 'Exhibition / Trade Show', 'annual-celebrations': 'Annual Celebration', 'award-ceremonies': 'Award Ceremony',
  'brand-activations': 'Brand Activation', 'corporate-meetings': 'Corporate Meeting',
}
