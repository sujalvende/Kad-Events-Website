import { Shield, Cpu, Landmark, Car, HeartPulse, Zap, ShoppingBag, ArrowUpRight, CheckCircle2, Lock, Radio, Layers } from 'lucide-react'
import { usePageMeta } from '../lib/meta'
import StageBeams from '../components/StageBeams'
import { Eyebrow } from '../components/ui'
import Button from '../components/Button'
import { src, type PhotoKey } from '../lib/img'

const sectors = [
  {
    icon: Cpu,
    title: 'Technology & Enterprise IT',
    formats: 'Global Developer Summits · Product Keynotes · Partner Ecosystem Conclaves',
    desc: 'High-density multi-track AV engineering, custom LED screen topologies, and sub-second latency hybrid streaming for international tech leaders.',
    photo: 'blue' as PhotoKey,
  },
  {
    icon: Landmark,
    title: 'Financial Services & BFSI',
    formats: 'Global Leadership Forums · Investor Days · Board Offsites · Private Conclaves',
    desc: 'Bespoke spatial design prioritizing absolute discretion, acoustic isolation, and executive presentation management for banking and investment institutions.',
    photo: 'seated' as PhotoKey,
  },
  {
    icon: Car,
    title: 'Automotive & Mobility',
    formats: 'World Premieres · National Dealer Conventions · Test-Drive Experiences',
    desc: 'Heavy structural turntable stages, dynamic programmable spotlight choreographies, and bespoke architectural builds tailored for vehicle debuts.',
    photo: 'lights' as PhotoKey,
  },
  {
    icon: HeartPulse,
    title: 'Healthcare & Life Sciences',
    formats: 'Medical Congresses · Global Investigator Summits · Healthcare Innovation Forums',
    desc: 'Strict compliance-aligned production, multi-language simultaneous interpretation, and ultra-high-definition scientific presentation playback.',
    photo: 'speaker' as PhotoKey,
  },
  {
    icon: Zap,
    title: 'Energy & Infrastructure',
    formats: 'Global Energy Summits · Commissioning Ceremonies · Sustainability Conclaves',
    desc: 'Turnkey temporary structure design, green event power distribution, and safe large-scale industrial site transformations.',
    photo: 'tent' as PhotoKey,
  },
  {
    icon: ShoppingBag,
    title: 'Consumer Brands & Retail',
    formats: 'National Sales Kickoffs · Brand Activations · Milestone Leadership Celebrations',
    desc: 'Narrative-driven environmental scenography, sensory brand engagement, and immersive entertainment staging that energizes sales forces.',
    photo: 'dinner' as PhotoKey,
  },
]

const governance = [
  {
    icon: Lock,
    title: 'Strict Non-Disclosure & Confidentiality',
    desc: 'Every corporate event is executed under rigorous confidentiality protocols. We safeguard unannounced products, proprietary financial data, and executive briefings with sealed production crews.',
  },
  {
    icon: Radio,
    title: 'Dual-Redundant Technical Infrastructure',
    desc: 'Zero-fail broadcast delivery. From twin main/backup video playback servers and isolated audio matrices to dual uninterruptible power supplies (UPS), our failover architecture is instantaneous.',
  },
  {
    icon: Layers,
    title: 'Certified Rigging & Structural Engineering',
    desc: 'All aerial lighting rigs, custom ground supports, and heavy LED spans carry certified structural engineer sign-offs, load calculations, and complete compliance documentation.',
  },
  {
    icon: Shield,
    title: 'Single-Point Executive Ownership',
    desc: 'A dedicated Senior Executive Producer serves as your single point of accountability from initial spatial brief and budget approval to on-site show calling and final wrap-up.',
  },
]

export default function Clients() {
  usePageMeta('Our Clients & Sectors', 'Enterprise corporate clients, industry sectors, and governance standards managed by KAD Events.')

  return (
    <>
      {/* 1. Page Header */}
      <header className="relative overflow-hidden pb-12 pt-28 sm:pb-20 sm:pt-36 md:pb-24 md:pt-48">
        <StageBeams color="gold" intensity={0.65} direction="up" />
        <div className="pointer-events-none absolute left-1/3 top-20 -z-10 h-72 w-72 rounded-full bg-gold/10 blur-[130px]" />

        <div className="container-x relative z-10">
          <Eyebrow>Enterprise Sector Partnerships</Eyebrow>
          <h1 data-reveal className="display h-xl max-w-4xl text-white">
            Delivering excellence for{' '}
            <span className="italic gold-gradient-text font-serif">industry leaders.</span>
          </h1>
          <p data-reveal className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
            KAD Events is the corporate event management division trusted across technology, finance, automotive,
            and healthcare to execute flawless summits, reveals, and corporate milestones.
          </p>

          {/* Quick Pillar Highlights */}
          <div data-reveal className="mt-8 flex flex-wrap gap-4 text-xs tracking-wider text-slate-400 uppercase">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-gold" /> Confidential Corporate Production
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-gold" /> SLA-Backed AV Engineering
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-gold" /> Global Venue Footprint
            </span>
          </div>
        </div>
      </header>

      {/* 2. Industry Sectors Grid */}
      <section className="section-y border-t border-white/10 bg-panel">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow>Sectors</Eyebrow>
              <h2 data-reveal className="display h-lg text-white">
                Specialized Corporate Event Domains.
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-300 leading-relaxed">
              Every industry sector has distinct cadence, technical requirements, and stakeholder expectations.
              We tailor each production format to meet enterprise benchmarks.
            </p>
          </div>

          <div data-stagger className="mt-12 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((sector) => {
              const Icon = sector.icon
              return (
                <div
                  key={sector.title}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-card p-6 sm:p-8 transition-all duration-500 hover:border-gold/40 hover:shadow-[0_10px_35px_-5px_rgba(212,175,55,0.15)]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-gold transition-colors duration-300 group-hover:border-gold/40 group-hover:bg-gold/10">
                        <Icon size={22} />
                      </div>
                      <span className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted">
                        Enterprise
                      </span>
                    </div>

                    <h3 className="display mt-6 text-xl sm:text-2xl text-white group-hover:text-gold transition-colors">
                      {sector.title}
                    </h3>

                    <p className="mt-2 text-xs font-medium text-amber-200/80 tracking-wide">
                      {sector.formats}
                    </p>

                    <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {sector.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[0.68rem] uppercase tracking-widest text-muted">Turnkey Execution</span>
                    <ArrowUpRight size={16} className="text-gold transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. Enterprise Production Governance & Standards */}
      <section className="section-y border-t border-white/10 bg-ink relative overflow-hidden">
        <StageBeams color="gold" intensity={0.3} direction="up" />
        <div className="container-x relative z-10">
          <div className="max-w-2xl">
            <Eyebrow>Institutional Rigor</Eyebrow>
            <h2 data-reveal className="display h-lg text-white">
              Enterprise Governance & Execution Standards.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              Global businesses operate under rigorous operational risk criteria. KAD Events is structured
              to integrate directly with enterprise procurement, compliance, and executive security teams.
            </p>
          </div>

          <div data-stagger className="mt-12 sm:mt-16 grid gap-6 sm:grid-cols-2">
            {governance.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
                      <Icon size={18} />
                    </div>
                    <h3 className="display text-lg sm:text-xl text-white">{item.title}</h3>
                  </div>
                  <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. Consultation & Briefing CTA */}
      <section className="section-y border-t border-white/10 bg-panel text-center">
        <div className="container-x max-w-3xl">
          <Eyebrow>Executive Collaboration</Eyebrow>
          <h2 data-reveal className="display h-lg text-white">
            Plan your next corporate milestone with KAD Events.
          </h2>
          <p data-reveal className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Our executive producers are ready to review your parameters, conduct 3D spatial venue feasibility,
            and structure an end-to-end production proposal.
          </p>
          <div data-reveal className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/contact">Request Executive Briefing</Button>
            <Button to="/services" variant="outline">
              Review Services Catalogue
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
