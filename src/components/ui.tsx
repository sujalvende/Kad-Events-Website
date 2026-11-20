import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { src, srcSet } from '../lib/img'
import type { Project, Service } from '../data/content'
import { TLink } from '../lib/transition'
import Button from './Button'
import Photo from './Photo'
import StageBeams from './StageBeams'
import type { PhotoKey } from '../lib/img'

export const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p data-reveal className="eyebrow mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4 text-gold text-[0.62rem] sm:text-[0.68rem]">
    <span data-line-reveal className="h-0.5 w-7 sm:w-10 bg-gradient-to-r from-gold to-amber-200 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
    <span className="gold-gradient-text tracking-[0.25em] sm:tracking-[0.3em]">{children}</span>
  </p>
)

/** Top of every internal page with volumetric ambient stage lighting. */
export function PageHeader({ eyebrow, title, lead }: { eyebrow: string; title: ReactNode; lead?: string }) {
  return (
    <header className="relative overflow-hidden pb-10 pt-28 sm:pb-16 sm:pt-36 md:pb-24 md:pt-52">
      {/* Theatrical Stage Beams for subtle ambient grandeur */}
      <StageBeams color="gold" intensity={0.45} direction="up" />

      {/* Soft ambient back-glow */}
      <div className="pointer-events-none absolute left-1/4 top-16 -z-10 h-64 w-64 rounded-full bg-gold/10 blur-[100px] sm:h-72 sm:w-72 sm:blur-[120px]" />

      <div className="container-x relative z-10">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 data-reveal className="display h-xl max-w-5xl tracking-tight">
          {title}
        </h1>
        {lead && <p data-reveal className="mt-5 sm:mt-8 max-w-xl text-base sm:text-lg leading-relaxed text-slate-300">{lead}</p>}
      </div>
    </header>
  )
}

export function ServiceCard({ s, i, className = '' }: { s: Service; i: number; className?: string }) {
  return (
    <TLink
      to={`/services/${s.slug}`}
      aria-label={s.title}
      className={`touch-feedback group relative block aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-card transition-all duration-300 active:scale-[0.98] hover:border-gold/60 hover:shadow-[0_10px_35px_-5px_rgba(212,175,55,0.25)] ${className}`}
    >
      <img
        src={src(s.photo, 800)}
        srcSet={srcSet(s.photo)}
        sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
        alt=""
        loading="lazy"
        decoding="async"
        width={800}
        height={1000}
        className="absolute inset-0 h-full w-full object-cover opacity-80 saturate-[1.1] transition-all duration-[800ms] ease-out group-hover:scale-[1.06] group-hover:opacity-100 group-hover:saturate-125"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-black/20 transition-opacity duration-500 group-hover:opacity-75" />

      {/* Floating Index Tag */}
      <span className="eyebrow absolute left-3.5 top-3.5 sm:left-5 sm:top-5 rounded-full border border-gold/40 bg-black/70 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[0.6rem] sm:text-[0.68rem] text-gold backdrop-blur-md">
        {String(i + 1).padStart(2, '0')}
      </span>

      {/* Arrow Button */}
      <span className="absolute right-3.5 top-3.5 sm:right-5 sm:top-5 grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-white/20 bg-black/50 backdrop-blur-md transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink group-hover:shadow-[0_0_20px_rgba(212,175,55,0.6)]">
        <ArrowUpRight
          size={15}
          aria-hidden
          className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 transition-transform duration-500 ease-out group-hover:-translate-y-1">
        <h3 className="display text-xl sm:text-2xl leading-tight text-white transition-colors duration-300 group-hover:text-gold md:text-[1.85rem]">
          {s.title}
        </h3>
        <p className="mt-1.5 sm:mt-2 text-xs text-slate-200 line-clamp-2 leading-relaxed">
          {s.short}
        </p>
      </div>
    </TLink>
  )
}

export function ProjectCard({ p, className = '', ratio = 'aspect-[4/3]' }: { p: Project; className?: string; ratio?: string }) {
  return (
    <TLink
      to={`/work/${p.slug}`}
      data-cursor="view"
      aria-label={`View project: ${p.title}`}
      className={`touch-feedback group relative block overflow-hidden rounded-xl border border-white/10 transition-all duration-300 active:scale-[0.98] hover:border-gold/60 hover:shadow-[0_12px_40px_-5px_rgba(212,175,55,0.25)] ${className}`}
    >
      <div data-img-reveal className={`img-mask relative bg-card ${ratio}`}>
        <img
          src={src(p.photo, 1400)}
          srcSet={srcSet(p.photo)}
          sizes="(min-width:768px) 55vw, 100vw"
          alt={`${p.category} sample imagery`}
          loading="lazy"
          decoding="async"
          width={1400}
          height={1000}
          className="h-full w-full object-cover opacity-85 saturate-[.9] transition-transform duration-[1600ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.08] group-hover:opacity-100 group-hover:saturate-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-black/30 transition-colors duration-700 group-hover:from-ink group-hover:via-ink/40 group-hover:to-ink/30" />

        {/* Luminous Category Tag */}
        <span className="absolute left-3.5 top-3.5 sm:left-5 sm:top-5 rounded-full border border-gold/40 bg-black/70 px-3 py-0.5 sm:px-3.5 sm:py-1 text-[0.58rem] sm:text-[0.62rem] font-bold uppercase tracking-[0.2em] text-gold shadow-[0_0_15px_rgba(212,175,55,0.2)] backdrop-blur-md">
          {p.category}
        </span>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6 md:p-8">
          <div className="transition-transform duration-700 ease-out group-hover:-translate-y-1">
            <p className="eyebrow !text-[0.58rem] sm:!text-[0.62rem] text-gold/80">{p.category}</p>
            <h3 className="display mt-1 sm:mt-2 text-2xl sm:text-3xl text-white transition-colors duration-500 group-hover:text-gold md:text-4xl">
              {p.title}
            </h3>
          </div>
          <span className="grid h-10 w-10 sm:h-12 sm:w-12 shrink-0 translate-y-1 place-items-center rounded-full border border-gold/70 bg-black/60 text-gold shadow-[0_0_15px_rgba(212,175,55,0.3)] backdrop-blur-md transition-all duration-500 group-hover:-translate-y-0 group-hover:bg-gold group-hover:text-ink group-hover:shadow-[0_0_25px_rgba(212,175,55,0.7)]">
            <ArrowUpRight
              size={18}
              aria-hidden
              className="-translate-x-0.5 translate-y-0.5 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0"
            />
          </span>
        </div>
      </div>
    </TLink>
  )
}

/** Closing call to action with dramatic theatrical stage spotlight beams. */
export function CtaBand({ photo = 'lights' as PhotoKey }) {
  return (
    <section className="relative overflow-hidden border-t border-line">
      {/* Background imagery with dramatic lighting */}
      <img
        src={src(photo, 1400)}
        alt=""
        loading="lazy"
        decoding="async"
        width={1400}
        height={800}
        className="absolute inset-0 h-full w-full object-cover opacity-20 saturate-125"
        style={{ objectPosition: '50% 40%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/60" />

      {/* Theatrical Volumetric Stage Spotlight Beams — sweeping upward */}
      <StageBeams color="gold" intensity={0.85} direction="up" />

      {/* Atmospheric center spotlight glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-gold/15 blur-[100px] sm:blur-[140px]" />

      <div className="container-x py-14 sm:py-20 md:py-32 relative z-10 text-center">
        <p className="eyebrow mb-4 sm:mb-6 inline-flex items-center gap-2.5 sm:gap-3 text-gold">
          <span data-line-reveal className="h-0.5 w-6 sm:w-8 bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
          <span className="gold-gradient-text tracking-[0.25em] sm:tracking-[0.3em]">Ready to begin</span>
          <span data-line-reveal className="h-0.5 w-6 sm:w-8 bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
        </p>
        <h2 data-reveal className="display h-lg mx-auto max-w-4xl text-white">
          Let's create something{' '}
          <span className="italic gold-gradient-text font-serif">extraordinary.</span>
        </h2>
        <p data-reveal className="mx-auto mt-4 sm:mt-6 max-w-md text-sm sm:text-base text-slate-300 px-4">
          Partner with KAD Events to design and deliver experiences that elevate your brand globally.
        </p>
        <div data-reveal className="mt-8 sm:mt-10 flex justify-center">
          <Button to="/contact" className="w-full sm:w-auto shadow-[0_0_30px_rgba(212,175,55,0.35)]">
            Let's Talk
          </Button>
        </div>
      </div>
    </section>
  )
}

export { Photo }
