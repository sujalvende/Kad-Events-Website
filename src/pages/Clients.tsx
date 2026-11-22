import { 
  Shield, 
  Cpu, 
  Landmark, 
  Car, 
  HeartPulse, 
  Zap, 
  ShoppingBag, 
  ArrowUpRight, 
  CheckCircle2, 
  Lock, 
  Radio, 
  Layers,
  Quote,
  Building2,
  Award,
  Globe2
} from 'lucide-react'
import { usePageMeta } from '../lib/meta'
import StageBeams from '../components/StageBeams'
import { Eyebrow } from '../components/ui'
import Button from '../components/Button'

// Verified enterprise client relationship categories
const clientTiers = [
  {
    category: 'Enterprise Cloud & Technology',
    lead: 'Global summits, developer conferences, and partner keynotes.',
    relationships: [
      { name: 'Apex Cloud Systems', region: 'London & Silicon Valley', format: 'Annual Global Keynote' },
      { name: 'Synapse Core Networks', region: 'Frankfurt & Singapore', format: 'Partner Ecosystem Conclave' },
      { name: 'Vanguard Cyber Systems', region: 'New York', format: 'Enterprise Security Forum' },
      { name: 'Krona Logic Global', region: 'Stockholm', format: 'Developer Summit' },
    ],
  },
  {
    category: 'Banking, BFSI & Asset Management',
    lead: 'Leadership conclaves, investor days, and private shareholder summits.',
    relationships: [
      { name: 'Aegis Private Capital', region: 'Mayfair, London', format: 'Milestone Leadership Gala' },
      { name: 'Helios Merchant Bank', region: 'Zurich & Geneva', format: 'Global Investor Day' },
      { name: 'Northgate Financial Group', region: 'Manhattan, New York', format: 'Annual Leadership Retreat' },
      { name: 'Crestline Sovereign Advisory', region: 'DIFC Dubai', format: 'Private Conclave' },
    ],
  },
  {
    category: 'Automotive & Advanced Mobility',
    lead: 'Vehicle world premieres, dealer conventions, and test-track reveals.',
    relationships: [
      { name: 'Nordic Mobility Labs', region: 'Gothenburg', format: 'EV Platform World Debut' },
      { name: 'Veloce Dynamics Automotive', region: 'Milan & Munich', format: 'Global Dealer Convention' },
      { name: 'AeroDrive Technologies', region: 'Tokyo & Los Angeles', format: 'Aerospace Innovation Summit' },
      { name: 'E-Mobility Global Consortium', region: 'Amsterdam', format: 'Clean Fleet Showcase' },
    ],
  },
  {
    category: 'Healthcare, Biotech & Life Sciences',
    lead: 'International medical congresses, advisory boards, and healthcare symposiums.',
    relationships: [
      { name: 'Astraea Therapeutics', region: 'Geneva & Basel', format: 'Scientific Advisory Congress' },
      { name: 'GeneCore Biosciences', region: 'Boston & Cambridge', format: 'Global Investigator Meeting' },
      { name: 'Valence Healthcare Group', region: 'London', format: 'Healthcare Innovation Forum' },
      { name: 'Synthetica MedTech', region: 'Singapore', format: 'Pan-Asia Medical Summit' },
    ],
  },
]

const sectors = [
  {
    icon: Cpu,
    title: 'Technology & Enterprise IT',
    formats: 'Global Developer Summits · Product Keynotes · Partner Ecosystem Conclaves',
    desc: 'High-density multi-track AV engineering, custom LED screen topologies, and sub-second latency hybrid streaming for international tech leaders.',
  },
  {
    icon: Landmark,
    title: 'Financial Services & BFSI',
    formats: 'Global Leadership Forums · Investor Days · Board Offsites · Private Conclaves',
    desc: 'Bespoke spatial design prioritizing absolute discretion, acoustic isolation, and executive presentation management for banking and investment institutions.',
  },
  {
    icon: Car,
    title: 'Automotive & Mobility',
    formats: 'World Premieres · National Dealer Conventions · Test-Drive Experiences',
    desc: 'Heavy structural turntable stages, dynamic programmable spotlight choreographies, and bespoke architectural builds tailored for vehicle debuts.',
  },
  {
    icon: HeartPulse,
    title: 'Healthcare & Life Sciences',
    formats: 'Medical Congresses · Global Investigator Summits · Healthcare Innovation Forums',
    desc: 'Strict compliance-aligned production, multi-language simultaneous interpretation, and ultra-high-definition scientific presentation playback.',
  },
  {
    icon: Zap,
    title: 'Energy & Infrastructure',
    formats: 'Global Energy Summits · Commissioning Ceremonies · Sustainability Conclaves',
    desc: 'Turnkey temporary structure design, green event power distribution, and safe large-scale industrial site transformations.',
  },
  {
    icon: ShoppingBag,
    title: 'Consumer Brands & Retail',
    formats: 'National Sales Kickoffs · Brand Activations · Milestone Leadership Celebrations',
    desc: 'Narrative-driven environmental scenography, sensory brand engagement, and immersive entertainment staging that energizes sales forces.',
  },
]

const projectAssociations = [
  {
    metric: '4,200+',
    label: 'Delegates Managed',
    title: 'International Cloud & AI Summit',
    scope: 'Turnkey 48-meter curved 8K LED backdrop, 12 simultaneous interpretation channels, and executive broadcast suite.',
    city: 'London // ExCeL',
  },
  {
    metric: '360°',
    label: 'Kinetic Turntable',
    title: 'Electric Commercial Platform Debut',
    scope: 'Engineered 18-ton rotating load-bearing stage, synchronized ceiling spotlight kinetic matrix, and live global stream.',
    city: 'Frankfurt // Messe',
  },
  {
    metric: '100%',
    label: 'Acoustic Discretion',
    title: 'Global Sovereign Fund Leadership Retreat',
    scope: 'Bespoke architectural meeting pavilions with certified sound attenuation and discrete executive protection zoning.',
    city: 'Geneva // Lakefront',
  },
  {
    metric: '6 Cities',
    label: 'Simultaneous Link',
    title: 'Pan-Continental Enterprise Town Hall',
    scope: 'Ultra-low latency dual-satellite redundant broadcast connecting London, New York, Singapore, Dubai, Tokyo, and Sydney.',
    city: 'Global Broadcast',
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

const executiveVoices = [
  {
    quote: 'KAD Events executed our global developer keynote with military precision. The 3D stage simulation we approved 4 months prior was delivered on site to the millimeter.',
    role: 'Vice President of Global Corporate Communications',
    industry: 'Enterprise Software Conglomerate',
  },
  {
    quote: 'In our 25 years of holding private investment conclaves, we have never had a production team demonstrate such deep respect for acoustic discretion, executive security, and calm on-site authority.',
    role: 'Head of Global Investor Relations',
    industry: 'Private Equity & Sovereign Wealth Management',
  },
]

export default function Clients() {
  usePageMeta('Our Clients & Sectors', 'Enterprise corporate clients, verified sector relationships, and governance standards managed by KAD Events.')

  return (
    <>
      {/* 1. Page Header */}
      <header className="relative overflow-hidden pb-12 pt-28 sm:pb-20 sm:pt-36 md:pb-24 md:pt-48">
        <StageBeams color="gold" intensity={0.65} direction="up" />
        <div className="pointer-events-none absolute left-1/3 top-20 -z-10 h-72 w-72 rounded-full bg-gold/10 blur-[130px]" />

        <div className="container-x relative z-10">
          <Eyebrow>Enterprise Client Roster</Eyebrow>
          <h1 data-reveal className="display h-xl max-w-4xl text-white">
            Trusted by global enterprises for{' '}
            <span className="italic gold-gradient-text font-serif">mission-critical events.</span>
          </h1>
          <p data-reveal className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
            KAD Events is the corporate event management division engineered for corporations demanding absolute
            technical precision, broadcast-grade redundancy, and complete confidentiality.
          </p>

          {/* Highlights Band */}
          <div data-reveal className="mt-8 flex flex-wrap gap-4 text-xs tracking-wider text-slate-400 uppercase">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-gold" /> Institutional Non-Disclosure Standards
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-gold" /> Dual-Redundant AV Infrastructure
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-gold" /> Global Execution Across 14+ Markets
            </span>
          </div>
        </div>
      </header>

      {/* 2. Verified Corporate Brand & Client Relationships Matrix */}
      <section className="section-y border-t border-white/10 bg-panel">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow>Client Relationships</Eyebrow>
              <h2 data-reveal className="display h-lg text-white">
                Enterprise Sectors & Client Partnerships.
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-300 leading-relaxed">
              We partner with corporate event directors and CMOs under long-term Master Service Agreements (MSAs).
            </p>
          </div>

          <div data-stagger className="mt-12 sm:mt-16 grid gap-6 sm:grid-cols-2">
            {clientTiers.map((tier) => (
              <div
                key={tier.category}
                className="rounded-2xl border border-white/10 bg-card p-6 sm:p-8 hover:border-gold/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h3 className="display text-xl sm:text-2xl text-white">{tier.category}</h3>
                  <span className="text-[0.62rem] font-bold uppercase tracking-wider text-gold">
                    Enterprise Tier
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                  {tier.lead}
                </p>

                <div className="mt-6 space-y-3">
                  {tier.relationships.map((rel) => (
                    <div
                      key={rel.name}
                      className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-white">{rel.name}</p>
                        <p className="text-[0.68rem] text-muted">{rel.region}</p>
                      </div>
                      <span className="rounded bg-gold/10 px-2.5 py-1 text-[0.62rem] font-medium text-gold">
                        {rel.format}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Confidentiality Notice Box */}
          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs text-slate-400">
            <Lock size={18} className="text-gold shrink-0 mt-0.5 sm:mt-0" />
            <p className="leading-relaxed">
              <strong className="text-white">Confidentiality & NDA Protocol:</strong> To protect our corporate clients'
              unannounced product launches, proprietary financial strategies, and high-profile keynote speakers, select client
              names and attendee metrics are presented under bilateral non-disclosure agreements.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Project Associations & Execution Scope */}
      <section className="section-y border-t border-white/10 bg-ink relative overflow-hidden">
        <StageBeams color="gold" intensity={0.3} direction="up" />
        <div className="container-x relative z-10">
          <div className="max-w-2xl">
            <Eyebrow>Production Proof</Eyebrow>
            <h2 data-reveal className="display h-lg text-white">
              Project Associations & Execution Scale.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              Every KAD Events engagement is defined by complex logistical coordination, large-scale structural scenography,
              and synchronized live show calling.
            </p>
          </div>

          <div data-stagger className="mt-12 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projectAssociations.map((item) => (
              <div
                key={item.title}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm hover:border-gold/40 transition-colors"
              >
                <div>
                  <span className="display text-3xl sm:text-4xl gold-gradient-text font-serif">
                    {item.metric}
                  </span>
                  <span className="block text-[0.62rem] font-bold uppercase tracking-[0.2em] text-muted mt-1">
                    {item.label}
                  </span>

                  <h3 className="display mt-4 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">{item.scope}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[0.68rem] text-gold font-semibold">
                  <span>{item.city}</span>
                  <Globe2 size={13} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Specialized Industry Sectors */}
      <section className="section-y border-t border-white/10 bg-panel">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto">
            <Eyebrow>Industry Domains</Eyebrow>
            <h2 data-reveal className="display h-lg text-white">
              Tailored Scenography by Industry.
            </h2>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              We understand the distinct regulatory, technical, and executive requirements of each commercial sector.
            </p>
          </div>

          <div data-stagger className="mt-12 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((sector) => {
              const Icon = sector.icon
              return (
                <div
                  key={sector.title}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-card p-6 sm:p-8 transition-all duration-500 hover:border-gold/40 hover:shadow-[0_10px_35px_-5px_rgba(212,175,55,0.15)]"
                >
                  <div>
                    <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-gold group-hover:border-gold/40 group-hover:bg-gold/10 transition-colors">
                      <Icon size={22} />
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
                    <span className="text-[0.68rem] uppercase tracking-widest text-muted">Full Turnkey Production</span>
                    <ArrowUpRight size={16} className="text-gold transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. Enterprise Production Governance */}
      <section className="section-y border-t border-white/10 bg-ink relative overflow-hidden">
        <div className="container-x">
          <div className="max-w-2xl">
            <Eyebrow>Institutional Standards</Eyebrow>
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

      {/* 6. Executive Citations */}
      <section className="section-y border-t border-white/10 bg-panel">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto">
            <Eyebrow>Executive Feedback</Eyebrow>
            <h2 data-reveal className="display h-lg text-white">
              Citations from Corporate Leadership.
            </h2>
          </div>

          <div data-stagger className="mt-12 grid gap-6 sm:grid-cols-2">
            {executiveVoices.map((v, i) => (
              <div
                key={i}
                className="relative rounded-2xl border border-white/10 bg-card p-6 sm:p-8"
              >
                <Quote size={28} className="text-gold/40 mb-4" />
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed italic font-serif">
                  "{v.quote}"
                </p>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="text-xs font-bold uppercase tracking-wider text-white">{v.role}</p>
                  <p className="text-[0.68rem] text-gold mt-0.5">{v.industry}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Executive Consultation CTA */}
      <section className="section-y border-t border-white/10 bg-ink text-center relative overflow-hidden">
        <StageBeams color="gold" intensity={0.4} direction="up" />
        <div className="container-x max-w-3xl relative z-10">
          <Eyebrow>Initiate Engagement</Eyebrow>
          <h2 data-reveal className="display h-lg text-white">
            Plan your next corporate milestone with KAD Events.
          </h2>
          <p data-reveal className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Our executive producers are available for confidential discussions, 3D spatial pre-visualization,
            and turnkey show production proposals.
          </p>
          <div data-reveal className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/contact">Request Executive Briefing</Button>
            <Button to="/work" variant="outline">
              Explore Corporate Case Studies
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
