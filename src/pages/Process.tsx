import { usePageMeta } from '../lib/meta'
import { CtaBand, Eyebrow, PageHeader } from '../components/ui'
import { src, type PhotoKey } from '../lib/img'
import { Check, Cpu, Sliders, Radio } from 'lucide-react'

const detailedSteps = [
  {
    n: '01',
    title: 'Strategic Discovery & Site Auditing',
    lead: 'We align on strategic goals, stakeholder priorities, and physical venue parameters.',
    text: 'Every world-class production begins with deep architectural analysis. We assess structural load capacities, power distribution feeds, acoustic reflections, and ingress/egress sightlines before drafting a single design cue.',
    deliverables: ['Spatial Venue Survey & CAD Load Plans', 'Audience Psychology & Flow Blueprint', 'Permit, Safety & Authority Clearance Matrix'],
    photo: 'networking' as PhotoKey,
    timeline: 'Weeks 1 – 3',
  },
  {
    n: '02',
    title: '3D Spatial Scenography & Pre-Vis',
    lead: 'We construct full-scale real-time 3D virtual simulations of your event environment.',
    text: 'Using high-fidelity 3D modeling and lighting simulation engines, we test curved panoramic LED screen ratios, beam throw distances, and sightlines from every seat in the house. You walk through the virtual venue before fabrication begins.',
    deliverables: ['Real-Time 3D Spatial Walkthroughs', 'LED Pixel Mapping & Resolution Grids', 'Lighting & Atmospheric Cue Pre-Visualisation'],
    photo: 'stageDesign' as PhotoKey,
    timeline: 'Weeks 4 – 7',
  },
  {
    n: '03',
    title: 'Technical Engineering & Infrastructure',
    lead: 'We coordinate sound, lighting, multi-camera broadcast, and redundancy rigs.',
    text: 'From box truss rigging and motorized line-array audio distributions to zero-latency broadcast switchers, our master engineers assemble an unshakeable technical backbone with built-in dual-redundancy.',
    deliverables: ['Complete Truss & Rigging Engineering Specs', 'Dual-Redundant Power & UPS Architecture', 'Multicam Broadcast & Satellite Routing Matrix'],
    photo: 'soundboard' as PhotoKey,
    timeline: 'Weeks 8 – 11',
  },
  {
    n: '04',
    title: 'Technical Rehearsals & Show Direction',
    lead: 'Master show callers direct full-scale technical rehearsals to ensure zero margin for error.',
    text: 'Forty-eight hours prior to doors opening, our crew conducts complete dry runs. Every cue, video transition, lighting state, and speaker podium transition is timed down to the second in the master run-of-show document.',
    deliverables: ['Minute-by-Minute Run-of-Show Master Cue Sheet', 'Executive Teleprompter & Presentation Briefing', 'VIP Red-Carpet & Security Protocol Execution'],
    photo: 'controlRoom' as PhotoKey,
    timeline: '48h Prior to Show',
  },
  {
    n: '05',
    title: 'Live Showtime & Global Broadcast',
    lead: 'Calm, authoritative execution while your brand commands international attention.',
    text: 'While your executive leaders step onto the stage, our production team orchestrates lighting sweeps, audio balancing, and worldwide satellite live streaming with effortless precision, followed by seamless teardown and debrief.',
    deliverables: ['Flawless Main Stage Show Calling', 'Broadcast-Grade 4K Satellite Streaming', 'Complete Analytics, Attendance & Media Handover'],
    photo: 'broadcast' as PhotoKey,
    timeline: 'Showtime & Beyond',
  },
]

const redundancyPillars = [
  {
    icon: Cpu,
    title: 'Dual-Redundant Power',
    desc: 'Dedicated on-site backup generators and synchronized UPS units eliminate any possibility of power disruption.',
  },
  {
    icon: Radio,
    title: 'Satellite Uplink Redundancy',
    desc: 'Primary dedicated fiber optic feeds paired with active satellite uplinks ensure worldwide hybrid broadcast stability.',
  },
  {
    icon: Sliders,
    title: 'Mirror Audio Consoles',
    desc: 'A and B mirrored digital mixing consoles running in parallel guarantee uninterrupted acoustics and microphone feeds.',
  },
]

export default function Process() {
  usePageMeta(
    'Our Process',
    'How KAD Events engineers world-class corporate summits and events from discovery to final curtain.',
  )

  return (
    <>
      <PageHeader
        eyebrow="Our Execution Blueprint"
        title={
          <>
            Five Disciplined Phases.{' '}
            <span className="italic gold-gradient-text font-serif">Zero Room for Error.</span>
          </>
        }
        lead="From initial acoustic venue audits and 3D spatial simulation to live show direction and post-event debrief — here is how we execute world-class corporate events."
      />

      {/* 1. Visual Process Roadmap */}
      <section className="container-x pb-16 sm:pb-24 lg:pb-32">
        <ol className="space-y-10 sm:space-y-16 md:space-y-24">
          {detailedSteps.map((s, i) => (
            <li
              key={s.n}
              className="group relative grid items-center gap-8 sm:gap-12 border-t border-white/10 pt-8 sm:pt-14 md:grid-cols-12 md:pt-20"
            >
              {/* Number and Header Column */}
              <div className={`md:col-span-6 ${i % 2 ? 'md:order-2' : ''}`}>
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <span className="process-num display text-5xl sm:text-7xl md:text-8xl text-gold/60 font-serif leading-none">
                    {s.n}
                  </span>
                  <div className="flex flex-col">
                    <span className="eyebrow !text-[0.6rem] sm:!text-[0.62rem] text-gold">{s.timeline}</span>
                    <span className="text-[0.65rem] sm:text-xs text-muted">Execution Window</span>
                  </div>
                </div>

                <h2 data-reveal className="display text-2xl sm:text-3xl text-white transition-colors duration-300 group-hover:text-gold md:text-4xl">
                  {s.title}
                </h2>

                <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm font-semibold text-slate-200">
                  {s.lead}
                </p>

                <p className="mt-3 sm:mt-4 text-xs leading-relaxed text-muted">
                  {s.text}
                </p>

                {/* Key Deliverables Checklist */}
                <div className="mt-5 sm:mt-6 space-y-2 sm:space-y-2.5 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 backdrop-blur-sm">
                  <span className="eyebrow !text-[0.58rem] sm:!text-[0.6rem] text-gold block mb-1">Phase Deliverables</span>
                  {s.deliverables.map((d) => (
                    <div key={d} className="flex items-center gap-2 sm:gap-2.5 text-xs text-slate-300">
                      <Check size={13} className="text-gold shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rich Imagery Column */}
              <div
                className={`img-mask relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] md:col-span-6 ${
                  i % 2 ? 'md:order-1' : ''
                }`}
                data-img-reveal
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={src(s.photo, 1200)}
                    alt={s.title}
                    loading="lazy"
                    className="h-full w-full object-cover saturate-[1.15] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 rounded-full border border-gold/40 bg-black/70 px-3 py-0.5 sm:px-3.5 sm:py-1 text-[0.58rem] sm:text-[0.62rem] font-bold uppercase tracking-wider text-gold backdrop-blur-md">
                    Phase {s.n} In Action
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 2. On-Site Production Redundancy Standard */}
      <section className="section-y border-t border-white/10 bg-panel relative overflow-hidden">
        <div className="container-x">
          <div className="mb-10 sm:mb-14">
            <Eyebrow>Fail-Safe Operations</Eyebrow>
            <h2 data-reveal className="display h-lg text-white">
              Zero tolerance for{' '}
              <span className="italic gold-gradient-text font-serif">downtime.</span>
            </h2>
            <p className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base text-slate-300">
              When international audiences and industry leaders gather, every single technical path must have an active, parallel backup.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3">
            {redundancyPillars.map((p) => {
              const Icon = p.icon
              return (
                <div
                  key={p.title}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-7 backdrop-blur-sm transition-all hover:border-gold/40"
                >
                  <div className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-lg border border-gold/40 bg-gold/10 text-gold mb-4 sm:mb-6">
                    <Icon size={20} />
                  </div>
                  <h3 className="display text-xl sm:text-2xl text-white">{p.title}</h3>
                  <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted">{p.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <CtaBand photo="conference" />
    </>
  )
}
