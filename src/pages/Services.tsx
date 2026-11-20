import { services } from '../data/content'
import { usePageMeta } from '../lib/meta'
import { CtaBand, PageHeader, ServiceCard } from '../components/ui'
import { src } from '../lib/img'
import { Eyebrow } from '../components/ui'
import Button from '../components/Button'

export default function Services() {
  usePageMeta(
    'Services',
    'Comprehensive corporate events, conferences, product reveals, exhibitions, celebrations, award ceremonies, and brand activations.',
  )
  return (
    <>
      <PageHeader
        eyebrow="Capabilities & Formats"
        title={
          <>
            Comprehensive Production,{' '}
            <span className="italic gold-gradient-text font-serif">End to End.</span>
          </>
        }
        lead="Select any format below to inspect our turnkey responsibilities, production deliverables, and technical show management."
      />

      {/* Service grid */}
      <section className="container-x pb-24 lg:pb-32">
        <div data-stagger className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <ServiceCard key={s.slug} s={s} i={i} />
          ))}
        </div>
      </section>

      {/* Editorial band */}
      <section className="section-y border-t border-white/10 bg-panel relative overflow-hidden">
        <div className="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 rounded-full bg-gold/10 blur-[130px]" />
        <div className="container-x grid items-center gap-8 sm:gap-12 lg:gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow>Turnkey Ownership</Eyebrow>
            <h2 data-reveal className="display h-lg text-white">
              One Partner.{' '}
              <span className="italic gold-gradient-text font-serif">Every Single Detail.</span>
            </h2>
            <p data-reveal className="mt-4 sm:mt-6 text-base text-slate-300 leading-relaxed">
              We manage spatial design, permit approvals, multi-tier lighting and AV rigs,
              broadcast streaming, stage choreography, catering curation, and VIP handling —
              operating as a single cohesive unit with clear accountability.
            </p>
            <div className="mt-6 sm:mt-8">
              <Button to="/contact">Discuss Your Production</Button>
            </div>
          </div>
          <div className="img-mask overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] lg:col-span-7" data-img-reveal>
            <img
              src={src('conference', 1200)}
              alt="Conference stage production"
              loading="lazy"
              className="aspect-[16/9] w-full object-cover saturate-[1.1]"
            />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
