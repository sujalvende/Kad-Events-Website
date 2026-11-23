import { Check } from 'lucide-react'
import { useParams } from 'react-router'
import { services } from '../data/content'
import { usePageMeta } from '../lib/meta'
import Button from '../components/Button'
import LoopingCards from '../components/LoopingCards'
import { ServiceCard, Eyebrow } from '../components/ui'
import { src } from '../lib/img'
import NotFound from './NotFound'

const slugAliases: Record<string, string> = {
  conferences: 'conferences-summits',
  exhibitions: 'exhibitions-trade-shows',
}

export default function ServiceDetail() {
  const { slug } = useParams()
  const resolvedSlug = (slug && slugAliases[slug]) || slug
  const idx = services.findIndex((s) => s.slug === resolvedSlug)
  const s = services[idx]
  usePageMeta(s?.title ?? 'Not found', s?.intro ?? '')
  if (!s) return <NotFound />

  return (
    <>
      {/* Full-bleed hero */}
      <header className="relative flex min-h-[75svh] items-end overflow-hidden">
        <img
          src={src(s.photo, 1800)}
          alt=""
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <div className="container-x relative pb-12 pt-28 sm:pt-36 md:pt-44">
          <Eyebrow>Service</Eyebrow>
          <h1 data-reveal className="display h-xl max-w-5xl">
            {s.title}
          </h1>
        </div>
      </header>

      {/* Intro + offerings */}
      <section className="section-y container-x grid gap-8 sm:gap-12 lg:gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p data-reveal className="display text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
            {s.intro}
          </p>
          <div data-reveal className="mt-6 sm:mt-10">
            <Button to={`/contact?service=${s.slug}`}>Enquire about this</Button>
          </div>
        </div>
        <div className="lg:col-span-5">
          <h2 className="eyebrow mb-6 text-gold">Key offerings</h2>
          <ul data-stagger>
            {s.offerings.map((o) => (
              <li
                key={o}
                className="flex items-center gap-4 border-t border-line py-5 last:border-b text-sm"
              >
                <Check size={16} className="shrink-0 text-gold" aria-hidden />
                {o}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery */}
      <section className="container-x grid gap-3 pb-16 sm:pb-24 md:grid-cols-3">
        {s.gallery.map((g, i) => (
          <div key={g + i} className="img-mask" data-img-reveal>
            <img
              src={src(g, 900)}
              alt=""
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        ))}
      </section>

      {/* More services — Continuous Smooth Looping */}
      <section className="section-y border-t border-line bg-panel relative overflow-hidden">
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <Eyebrow>Related Formats</Eyebrow>
              <h2 data-reveal className="display h-lg text-white">
                More <span className="italic gold-gradient-text font-serif">services.</span>
              </h2>
            </div>
          </div>

          <LoopingCards
            items={services.filter((item) => item.slug !== resolvedSlug)}
            speedSeconds={36}
            gapRem={1.25}
            edgeColor="from-panel"
            ariaLabel="More services continuous loop"
            renderItem={(o) => (
              <ServiceCard
                key={o.slug}
                s={o}
                i={services.indexOf(o)}
                className="w-full lg:w-[310px] xl:w-[330px] aspect-[3/4]"
              />
            )}
          />
        </div>
      </section>
    </>
  )
}
