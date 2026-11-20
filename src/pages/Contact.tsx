import { Mail, MapPin, Phone, ArrowUpRight, HelpCircle } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { contact, serviceEventType } from '../data/content'
import { usePageMeta } from '../lib/meta'
import ContactForm from '../components/ContactForm'
import StageBeams from '../components/StageBeams'
import { Eyebrow } from '../components/ui'
import { src, type PhotoKey } from '../lib/img'

const hubs = [
  {
    city: 'London',
    district: 'Mayfair // W1J',
    phone: '+44 20 7946 0912',
    email: 'london@kadevents.com',
    photo: 'architect' as PhotoKey,
  },
  {
    city: 'New York',
    district: 'Manhattan // NY 10022',
    phone: '+1 212 555 0194',
    email: 'newyork@kadevents.com',
    photo: 'networking' as PhotoKey,
  },
  {
    city: 'Dubai',
    district: 'DIFC Gate // UAE',
    phone: '+971 4 312 8900',
    email: 'dubai@kadevents.com',
    photo: 'vipGala' as PhotoKey,
  },
]

const protocol = [
  {
    step: '01',
    title: 'Confidential Brief Review',
    desc: 'Within 24 hours of submission, our senior executive producers review your venue parameters, technical scope, and creative goals under non-disclosure.',
  },
  {
    step: '02',
    title: '3D Spatial & Concept Deck',
    desc: 'We present an interactive 3D stage simulation, lighting choreographies, acoustic mapping, and a minute-by-minute run-of-show schedule.',
  },
  {
    step: '03',
    title: 'Turnkey Show Production',
    desc: 'Full on-site technical deployment, broadcast crew, show callers, and dual-redundancy systems — operating as one synchronized unit.',
  },
]

const faqs = [
  {
    q: 'What is your typical production lead time?',
    a: 'For major global summits and tier-1 product reveals, we typically engage 3 to 9 months prior to show day. For rapid-response corporate keynotes or VIP galas, our agile spatial design and technical crew can deploy within 4 to 6 weeks.',
  },
  {
    q: 'Do you manage international venues and permits?',
    a: 'Yes. KAD operates internationally across the UK, Europe, North America, the Middle East, and Asia-Pacific. We manage all local authority permits, structural truss certifications, customs logistics, and venue liaison end to end.',
  },
  {
    q: 'Can we test our stage scenography in 3D prior to build?',
    a: 'Every KAD production is modeled in high-fidelity real-time 3D environments prior to fabrication. Clients can inspect sightlines, LED pixel mapping, and lighting sweeps in simulation before physical construction begins.',
  },
]

export default function Contact() {
  usePageMeta('Contact', 'Initiate a confidential production inquiry with KAD Events.')
  const [params] = useSearchParams()
  const preset = serviceEventType[params.get('service') ?? ''] ?? ''

  return (
    <>
      {/* 1. Header with Theatrical Volumetric Stage Spotlight Beams */}
      <header className="relative overflow-hidden pb-10 pt-28 sm:pb-16 sm:pt-36 md:pb-20 md:pt-52">
        <StageBeams color="gold" intensity={0.65} direction="up" />
        <div className="pointer-events-none absolute left-1/4 top-16 -z-10 h-64 w-64 rounded-full bg-gold/10 blur-[100px] sm:h-72 sm:w-72 sm:blur-[130px]" />

        <div className="container-x relative z-10">
          <Eyebrow>Direct Inquiries</Eyebrow>
          <h1 data-reveal className="display h-xl max-w-4xl text-white">
            Let's discuss your next{' '}
            <span className="italic gold-gradient-text font-serif">global production.</span>
          </h1>
          <p data-reveal className="mt-5 sm:mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
            Whether planning an international keynote summit, a tier-1 product reveal,
            or a milestone leadership gala, our executive production directors are at your disposal.
          </p>

          {/* Mobile Quick Tap Action Bar */}
          <div className="mt-6 flex flex-col xs:flex-row gap-2.5 sm:hidden" data-reveal>
            <a
              href={`tel:${contact.phone.replace(/\s/g, '')}`}
              className="flex items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]"
            >
              <Phone size={13} />
              <span>Call Executive Line</span>
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-gold hover:text-gold"
            >
              <Mail size={13} className="text-gold" />
              <span>Direct Email</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. Main Engagement Grid */}
      <section className="container-x pb-16 sm:pb-24 lg:pb-32">
        <div className="grid gap-10 sm:gap-16 lg:grid-cols-12">
          {/* Left Column: Direct Production Channels */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8 sm:gap-12">
            <div>
              <h2 className="eyebrow text-gold font-bold">Executive Office</h2>
              <div className="mt-4 sm:mt-6 space-y-6 sm:space-y-8">
                <div>
                  <span className="text-[0.62rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted block mb-1">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="display text-2xl sm:text-3xl text-white transition-colors hover:text-gold break-all"
                  >
                    {contact.email}
                  </a>
                </div>

                <div>
                  <span className="text-[0.62rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted block mb-1">
                    Executive Line
                  </span>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, '')}`}
                    className="display text-2xl sm:text-3xl text-white transition-colors hover:text-gold"
                  >
                    {contact.phone}
                  </a>
                </div>

                <div>
                  <span className="text-[0.62rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted block mb-1">
                    Global Coordination Hub
                  </span>
                  <p className="text-sm sm:text-base text-slate-300">
                    London · New York · Dubai · Singapore
                  </p>
                </div>
              </div>
            </div>

            {/* Architectural Studio Photo Card */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-card">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={src('controlRoom', 800)}
                  alt="KAD Events technical production control room"
                  loading="lazy"
                  className="h-full w-full object-cover saturate-[1.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>
              <div className="p-4 sm:p-6">
                <p className="eyebrow !text-[0.58rem] sm:!text-[0.6rem] text-gold">Technical Production Suites</p>
                <p className="display mt-1 text-xl sm:text-2xl text-white">Live Show Direction</p>
                <p className="mt-2 text-xs text-muted leading-relaxed">
                  Real-time 3D stage simulation, multicam broadcast switching, and show calling under one roof.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Form Container */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-card p-5 sm:p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-sm">
              <div className="mb-6 sm:mb-8 border-b border-white/10 pb-4 sm:pb-6 flex items-baseline justify-between">
                <div>
                  <span className="eyebrow text-gold font-bold">Confidential Briefing</span>
                  <h3 className="display mt-1 text-xl sm:text-2xl text-white">Event Parameters</h3>
                </div>
                <span className="text-[0.68rem] sm:text-xs text-muted">24h Response Window</span>
              </div>
              <ContactForm key={preset} presetType={preset} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Global Operation Hubs */}
      <section className="section-y border-t border-white/10 bg-panel">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow>Presence</Eyebrow>
              <h2 data-reveal className="display h-lg text-white">International Production Hubs.</h2>
            </div>
            <p className="max-w-md text-sm text-slate-300 leading-relaxed">
              Operating with permanent leadership hubs in the world's commercial capitals.
            </p>
          </div>

          <div data-stagger className="mt-10 sm:mt-16 grid gap-4 sm:gap-6 md:grid-cols-3">
            {hubs.map((h) => (
              <div
                key={h.city}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-card transition-all duration-500 hover:border-gold/40 hover:shadow-[0_10px_35px_-5px_rgba(212,175,55,0.15)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={src(h.photo, 800)}
                    alt={`${h.city} skyline & office`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  <span className="absolute bottom-3 left-4 eyebrow text-gold font-bold">
                    {h.district}
                  </span>
                </div>
                <div className="p-5 sm:p-7">
                  <h3 className="display text-2xl sm:text-3xl text-white group-hover:text-gold transition-colors">{h.city}</h3>
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5 text-xs text-slate-300">
                    <p className="flex items-center gap-2">
                      <Phone size={13} className="text-gold shrink-0" />
                      <span>{h.phone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail size={13} className="text-gold shrink-0" />
                      <span>{h.email}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The KAD Production Protocol */}
      <section className="section-y border-t border-white/10 bg-ink relative overflow-hidden">
        <StageBeams color="gold" intensity={0.25} direction="up" />
        <div className="container-x relative z-10">
          <div className="max-w-2xl">
            <Eyebrow>Methodology</Eyebrow>
            <h2 data-reveal className="display h-lg text-white">
              The 3-Stage <span className="italic gold-gradient-text font-serif">Delivery Protocol.</span>
            </h2>
          </div>

          <div data-stagger className="mt-10 sm:mt-16 grid gap-6 md:grid-cols-3">
            {protocol.map((p) => (
              <div
                key={p.step}
                className="relative rounded-xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-sm"
              >
                <span className="eyebrow text-gold font-bold text-sm">{p.step}</span>
                <h3 className="display mt-3 text-xl sm:text-2xl text-white">{p.title}</h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Production FAQs */}
      <section className="section-y border-t border-white/10 bg-panel">
        <div className="container-x max-w-4xl">
          <div className="text-center">
            <Eyebrow>Inquiry Intelligence</Eyebrow>
            <h2 data-reveal className="display h-lg text-white">Frequently Addressed Inquiries.</h2>
          </div>

          <div className="mt-10 sm:mt-14 space-y-4">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="group rounded-xl border border-white/10 bg-card p-5 sm:p-7 transition-all [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between text-base sm:text-lg font-medium text-white hover:text-gold transition-colors">
                  <span className="pr-4">{f.q}</span>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-gold transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 pt-4 border-t border-white/10 text-xs sm:text-sm leading-relaxed text-slate-300">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
