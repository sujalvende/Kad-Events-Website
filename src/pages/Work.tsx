import { useState } from 'react'
import { projects } from '../data/content'
import { usePageMeta } from '../lib/meta'
import { CtaBand, PageHeader, ProjectCard } from '../components/ui'

const cats = ['All', ...Array.from(new Set(projects.map((p) => p.category)))]

export default function Work() {
  usePageMeta('Our Work', 'A selection of events by KAD Events.')
  const [cat, setCat] = useState('All')
  const list = cat === 'All' ? projects : projects.filter((p) => p.category === cat)

  return (
    <>
      <PageHeader
        eyebrow="Our Work"
        title={
          <>
            Selected{' '}
            <span className="italic gold-gradient-text font-serif">productions.</span>
          </>
        }
        lead="A curated portfolio of global summits, monumental reveals, and private leadership galas architected and produced by KAD Events."
      />

      <section className="container-x pb-16 sm:pb-24 lg:pb-32">
        {/* Category filters — horizontally scrollable swipe row on mobile */}
        <div
          role="group"
          aria-label="Filter projects by category"
          className="mb-8 sm:mb-12 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`shrink-0 rounded-full border px-4 sm:px-5 py-2 sm:py-2.5 text-[0.65rem] sm:text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                cat === c
                  ? 'border-gold bg-gold text-ink shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                  : 'border-white/10 bg-white/[0.03] text-muted hover:border-gold hover:text-gold'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Staggered Portfolio Grid */}
        <div data-stagger className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {list.map((p, i) => (
            <ProjectCard
              key={p.slug}
              p={p}
              ratio="aspect-[4/3]"
              className={i % 3 === 0 && list.length > 2 ? 'md:col-span-2' : ''}
            />
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  )
}
