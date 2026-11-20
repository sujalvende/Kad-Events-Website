import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useParams } from 'react-router'
import { projects } from '../data/content'
import { usePageMeta } from '../lib/meta'
import { TLink } from '../lib/transition'
import { CtaBand, Eyebrow } from '../components/ui'
import { src } from '../lib/img'
import NotFound from './NotFound'

export default function ProjectDetail() {
  const { slug } = useParams()
  const idx = projects.findIndex((p) => p.slug === slug)
  const p = projects[idx]
  usePageMeta(p?.title ?? 'Not found', p?.overview ?? '')
  if (!p) return <NotFound />
  const next = projects[(idx + 1) % projects.length]
  const meta = [
    ['Category', p.category],
    ['Production Scope', 'Turnkey 3D Scenography & AV'],
    ['Engineering', 'Multi-Tier Truss & Rigging'],
    ['Broadcast Standard', '4K Multi-Camera Live Stream'],
  ]

  return (
    <>
      {/* Page header */}
      <header className="container-x pb-8 pt-28 sm:pt-36 md:pt-48">
        <TLink
          to="/work"
          className="eyebrow mb-6 sm:mb-10 inline-flex items-center gap-3 text-muted transition-colors hover:text-gold"
        >
          <ArrowLeft size={14} aria-hidden /> All work
        </TLink>
        <Eyebrow>{p.category}</Eyebrow>
        <h1 data-reveal className="display h-xl">
          {p.title}
        </h1>
      </header>

      {/* Hero image */}
      <div className="container-x">
        <div className="img-mask" data-img-reveal>
          <img
            src={src(p.photo, 1800)}
            alt={`${p.title} sample imagery`}
            loading="eager"
            className="aspect-[4/3] sm:aspect-[16/10] w-full object-cover md:aspect-[21/9]"
          />
        </div>
      </div>

      {/* Overview + meta */}
      <section className="container-x grid gap-8 sm:gap-12 py-10 sm:py-16 md:py-24 lg:grid-cols-12">
        <p data-reveal className="display text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight lg:col-span-7">
          {p.overview}
        </p>
        <dl data-stagger className="lg:col-span-5">
          {meta.map(([k, v]) => (
            <div
              key={k}
              className="grid grid-cols-2 border-t border-line py-4 last:border-b text-sm"
            >
              <dt className="eyebrow text-gold">{k}</dt>
              <dd className="text-muted">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Gallery */}
      <section className="container-x grid gap-3 pb-16 sm:pb-24 md:grid-cols-2">
        {p.gallery.map((g, i) => (
          <div
            key={g + i}
            className={`img-mask ${i % 3 === 0 ? 'md:col-span-2' : ''}`}
            data-img-reveal
          >
            <img
              src={src(g, 1400)}
              alt=""
              loading="lazy"
              className={`w-full object-cover ${
                i % 3 === 0 ? 'aspect-[4/3] md:aspect-[16/8]' : 'aspect-[4/3]'
              }`}
            />
          </div>
        ))}
      </section>

      {/* Next project */}
      <TLink
        to={`/work/${next.slug}`}
        data-cursor="view"
        className="group block border-t border-line bg-panel"
      >
        <div className="container-x section-y flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-gold">Next project</p>
            <p className="display h-lg mt-4 transition-transform duration-700 group-hover:translate-x-3">
              {next.title}
            </p>
          </div>
          <ArrowRight
            size={44}
            className="shrink-0 text-gold transition-transform duration-500 group-hover:translate-x-2"
            aria-hidden
          />
        </div>
      </TLink>

      <CtaBand photo="blue" />
    </>
  )
}
