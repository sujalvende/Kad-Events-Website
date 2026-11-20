import { usePageMeta } from '../lib/meta'
import { CtaBand, Eyebrow, PageHeader } from '../components/ui'
import { src, type PhotoKey } from '../lib/img'
import Button from '../components/Button'
import { ArrowUpRight, Award, Globe2 } from 'lucide-react'

const formats: { title: string; desc: string; photo: PhotoKey; tag: string }[] = [
  {
    title: 'Global Tech Summits',
    desc: 'Multi-day keynote stages, breakout tracks, and immersive sponsor pavilions hosting thousands of global leaders.',
    photo: 'keynote',
    tag: 'Summits & Keynotes',
  },
  {
    title: 'Tier-1 Product Reveals',
    desc: 'Monumental reveal moments engineered around dramatic kinetic reveals, synchronized laser cues, and worldwide live streaming.',
    photo: 'productReveal',
    tag: 'Launches & Reveals',
  },
  {
    title: 'Presidential Award Galas',
    desc: 'Haute-couture culinary styling, bespoke orchestral pacing, and flawless red-carpet hospitality for industry vanguards.',
    photo: 'vipGala',
    tag: 'Luxury Galas',
  },
  {
    title: '3D Kinetic Scenography',
    desc: 'Custom architectural truss structures, curved ultra-HD LED displays, and volumetric light beam choreography.',
    photo: 'stadium',
    tag: 'Stage Architecture',
  },
]

const leadership = [
  {
    name: 'Alexander Sterling',
    role: 'Managing Director & Executive Producer',
    desc: 'Former lead director for tier-1 automotive reveals and international technology summits across 22 countries.',
    photo: 'speaker' as PhotoKey,
  },
  {
    name: 'Elena Rostova',
    role: 'VP of 3D Spatial Design & Scenography',
    desc: 'Master architect specializing in monumental arena stage environments, kinetic lighting, and holographic spatial projection.',
    photo: 'architect' as PhotoKey,
  },
  {
    name: 'Marcus Vance',
    role: 'Global Technical Show Director',
    desc: 'Pioneered zero-latency satellite broadcasting and multi-camera broadcast suites for Fortune 50 global keynote addresses.',
    photo: 'networking' as PhotoKey,
  },
]

const globalHubs = [
  { city: 'London', address: 'Mayfair // W1J', timezone: 'GMT // International HQ' },
  { city: 'New York', address: 'Manhattan // NY 10022', timezone: 'EST // Americas Operations' },
  { city: 'Dubai', address: 'DIFC Gate // UAE', timezone: 'GST // MENA Production Hub' },
  { city: 'Singapore', address: 'Marina Bay // SG 018981', timezone: 'SGT // APAC Division' },
]

export default function About() {
  usePageMeta('About', 'KAD Events is an international corporate event management and experience creation company.')

  return (
    <>
      <PageHeader
        eyebrow="The Agency"
        title={
          <>
            Where Ambition Meets{' '}
            <span className="italic gold-gradient-text font-serif">Impeccable Execution.</span>
          </>
        }
        lead="KAD Events is an international experiential production firm built on architectural stagecraft, technological precision, and calm, authoritative execution."
      />

      {/* 1. Who We Are — 2-Column High-Impact Editorial */}
      <section className="container-x relative pb-16 sm:pb-24 lg:pb-32">
        <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-gold/10 blur-[120px]" />
        <div className="grid items-center gap-10 sm:gap-16 lg:grid-cols-12">
          <div className="img-mask relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] lg:col-span-7" data-img-reveal>
            <img
              src={src('stageDesign', 1400)}
              alt="Live stage design and audience"
              loading="eager"
              className="aspect-[16/10] w-full object-cover saturate-[1.15]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between gap-2 border-t border-white/10 pt-3 sm:pt-4 text-xs text-slate-300">
              <span>Main Stage Architecture // 2026</span>
              <span className="text-gold">Turnkey Production</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Eyebrow>Our Legacy & Purpose</Eyebrow>
            <h2 data-reveal className="display h-lg text-white">
              Built for moments that{' '}
              <span className="italic gold-gradient-text font-serif">cannot fail.</span>
            </h2>
            <p data-reveal className="mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed text-slate-300">
              Headquartered for international agility, KAD Events unifies master scenographers,
              technical show callers, 3D spatial artists, and logistics directors with decades of combined
              global experience.
            </p>
            <p data-reveal className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
              We operate exclusively where brand reputation is on the line — market-defining keynotes,
              presidential galas, and global partner summits where flawless execution is non-negotiable.
            </p>
            <div data-reveal className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button to="/services" className="w-full sm:w-auto">Explore Services</Button>
              <Button to="/contact" variant="outline" className="w-full sm:w-auto">Enquire Directly</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Specialised Formats */}
      <section className="section-y border-t border-white/10 bg-panel relative overflow-hidden">
        <div className="pointer-events-none absolute right-10 top-1/3 h-96 w-96 rounded-full bg-gold/5 blur-[140px]" />
        <div className="container-x">
          <div className="flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-end mb-10 sm:mb-16">
            <div>
              <Eyebrow>Domain Expertise</Eyebrow>
              <h2 data-reveal className="display h-lg text-white">
                Specialised <span className="italic gold-gradient-text font-serif">formats.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-300 leading-relaxed">
              Every production format requires distinct technical rigor. Here is how we engineer each category to guarantee maximum brand prestige.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            {formats.map((f) => (
              <div
                key={f.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-card transition-all duration-500 hover:border-gold/60 hover:shadow-[0_15px_40px_-10px_rgba(212,175,55,0.25)]"
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={src(f.photo, 900)}
                    alt={f.title}
                    loading="lazy"
                    className="h-full w-full object-cover saturate-[1.1] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  <span className="absolute left-3.5 top-3.5 sm:left-4 sm:top-4 rounded-full border border-gold/40 bg-black/70 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[0.58rem] sm:text-[0.6rem] font-bold uppercase tracking-wider text-gold backdrop-blur-md">
                    {f.tag}
                  </span>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="display text-xl sm:text-2xl text-white group-hover:text-gold transition-colors">
                    {f.title}
                  </h3>
                  <p className="mt-2.5 sm:mt-3 text-xs leading-relaxed text-slate-300">
                    {f.desc}
                  </p>
                  <div className="mt-5 sm:mt-6 border-t border-white/10 pt-3 sm:pt-4 flex items-center justify-between text-[0.65rem] sm:text-[0.68rem] font-bold uppercase tracking-widest text-gold">
                    <span>Full Production</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Executive Production Leadership */}
      <section className="section-y bg-ink border-t border-white/10 relative">
        <div className="container-x">
          <div className="mb-10 sm:mb-16">
            <Eyebrow>Executive Direction</Eyebrow>
            <h2 data-reveal className="display h-lg text-white max-w-2xl">
              Led by seasoned <span className="italic gold-gradient-text font-serif">industry authorities.</span>
            </h2>
            <p className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base text-slate-300">
              Our directors have helmed some of the most complex corporate staging environments in the world.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-3">
            {leadership.map((l) => (
              <div
                key={l.name}
                data-reveal
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 backdrop-blur-sm transition-all duration-500 hover:border-gold/50 hover:bg-white/[0.04] hover:shadow-[0_10px_35px_-5px_rgba(212,175,55,0.2)]"
              >
                <div>
                  <div className="img-mask relative mb-5 sm:mb-6 aspect-square overflow-hidden rounded-xl border border-white/10">
                    <img
                      src={src(l.photo, 800)}
                      alt={l.name}
                      loading="lazy"
                      className="h-full w-full object-cover saturate-[1.1] transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="display text-xl sm:text-2xl text-white group-hover:text-gold transition-colors">
                    {l.name}
                  </h3>
                  <p className="eyebrow mt-1 !text-[0.6rem] sm:!text-[0.62rem] text-gold">{l.role}</p>
                  <p className="mt-3 sm:mt-4 text-xs leading-relaxed text-muted">{l.desc}</p>
                </div>
                <div className="mt-6 sm:mt-8 border-t border-white/10 pt-3 sm:pt-4 text-xs text-slate-400 flex items-center justify-between">
                  <span>Verified Credentials</span>
                  <Award size={14} className="text-gold" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Global Production Hubs */}
      <section className="section-y border-t border-white/10 bg-panel relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/3 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-gold/5 blur-[140px]" />
        <div className="container-x">
          <div className="mb-10 sm:mb-14">
            <Eyebrow>Worldwide Agility</Eyebrow>
            <h2 data-reveal className="display h-lg text-white">
              Global production <span className="italic gold-gradient-text font-serif">presence.</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            {globalHubs.map((h) => (
              <div
                key={h.city}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-6 lg:p-8 backdrop-blur-sm transition-all hover:border-gold/40"
              >
                <div className="flex items-center justify-between text-gold mb-3 sm:mb-6">
                  <span className="display text-xl sm:text-2xl md:text-3xl text-white">{h.city}</span>
                  <Globe2 size={18} className="shrink-0" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-300">{h.address}</p>
                <p className="mt-2 sm:mt-3 text-[0.68rem] sm:text-xs text-muted">{h.timezone}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Full-Bleed Atmosphere */}
      <div className="relative h-[35vh] sm:h-[55vh] min-h-[260px] sm:min-h-[380px] overflow-hidden" aria-hidden>
        <img
          src={src('broadcast', 1800)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover opacity-40 saturate-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-transparent to-ink" />
      </div>

      <CtaBand photo="crowd" />
    </>
  )
}
