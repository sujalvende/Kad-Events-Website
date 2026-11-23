import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { reducedMotion } from '../lib/animations'

type Props<T> = {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  speedSeconds?: number
  gapRem?: number
  className?: string
  edgeColor?: string // Tailwind color class, e.g. 'from-ink' or 'from-panel'
  ariaLabel?: string
  direction?: 'left' | 'right'
}

/**
 * Adaptive Luxury Cards Carousel:
 * - Desktop (lg:): Silky-smooth infinite GPU marquee loop with automated pause on hover.
 * - Mobile (< lg): Touch-native snap carousel with architectural left-alignment,
 *   subtle peeking affordance, gentle auto-advance with touch-pause, active gold pill indicator,
 *   and haptic-feel tactile arrows.
 */
export default function LoopingCards<T>({
  items,
  renderItem,
  speedSeconds = 38,
  gapRem = 1.25,
  className = '',
  edgeColor = 'from-ink',
  ariaLabel = 'Cards carousel',
  direction = 'left',
}: Props<T>) {
  // Desktop marquee state
  const [isPaused, setIsPaused] = useState(false)

  // Mobile snap carousel state
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isInteracting, setIsInteracting] = useState(false)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Pause mobile auto-advance on user touch or drag
  const pauseAutoAdvance = useCallback(() => {
    setIsInteracting(true)
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => {
      setIsInteracting(false)
    }, 6000)
  }, [])

  // Duplicate items for seamless continuous desktop wrap
  const repeatCount = items.length < 6 ? 4 : 2
  const duplicated: { item: T; key: string; origIndex: number }[] = []
  for (let r = 0; r < repeatCount; r++) {
    items.forEach((item, i) => {
      duplicated.push({ item, key: `loop-${r}-${i}`, origIndex: i })
    })
  }

  // Mobile scroll tracking with snap alignment
  const onMobileScroll = useCallback(() => {
    const el = mobileScrollRef.current
    if (!el || !el.firstElementChild) return
    const card = el.firstElementChild as HTMLElement
    const step = card.offsetWidth + 14 // card width + gap (gap-3.5 = 14px)
    const idx = Math.round(el.scrollLeft / step)
    const clamped = Math.min(items.length - 1, Math.max(0, idx))
    setActiveIndex(clamped)
  }, [items.length])

  // Scroll to a specific card index
  const scrollToIndex = useCallback(
    (index: number) => {
      pauseAutoAdvance()
      const targetIdx = Math.min(items.length - 1, Math.max(0, index))
      if (!mobileScrollRef.current) return
      const el = mobileScrollRef.current
      const children = el.children
      if (children[targetIdx]) {
        const card = children[targetIdx] as HTMLElement
        // Scroll so the card aligns with the left padding (16px / px-4)
        el.scrollTo({
          left: card.offsetLeft - 16,
          behavior: 'smooth',
        })
        setActiveIndex(targetIdx)
      }
    },
    [items.length, pauseAutoAdvance]
  )

  const scrollPrev = () => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1)
    } else {
      // Loop to end
      scrollToIndex(items.length - 1)
    }
  }

  const scrollNext = () => {
    if (activeIndex < items.length - 1) {
      scrollToIndex(activeIndex + 1)
    } else {
      // Loop to start
      scrollToIndex(0)
    }
  }

  // Mobile gentle auto-advance: smoothly glides to next card every 4.5s
  useEffect(() => {
    if (reducedMotion() || isInteracting || items.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % items.length
        if (mobileScrollRef.current) {
          const children = mobileScrollRef.current.children
          if (children[next]) {
            const card = children[next] as HTMLElement
            mobileScrollRef.current.scrollTo({
              left: card.offsetLeft - 16,
              behavior: 'smooth',
            })
          }
        }
        return next
      })
    }, 4500)

    return () => clearInterval(interval)
  }, [isInteracting, items.length])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }
  }, [])

  if (items.length === 0) return null

  return (
    <div role="region" aria-label={ariaLabel} className={`w-full ${className}`}>
      {/* ─── 1. Mobile Touch-Native Snap Carousel (< lg) ─── */}
      <div className="block lg:hidden w-full overflow-hidden">
        <div
          ref={mobileScrollRef}
          onScroll={onMobileScroll}
          onTouchStart={pauseAutoAdvance}
          onPointerDown={pauseAutoAdvance}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3.5 px-4 pb-2 pt-1 -mx-4 scroll-pl-4 items-stretch"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="w-[82vw] xs:w-[78vw] sm:w-[340px] max-w-[340px] shrink-0 snap-start flex flex-col"
            >
              {renderItem(item, idx)}
            </div>
          ))}
        </div>

        {/* Mobile Status Bar: Active Card Counter, Dots & Haptic Arrow Controls */}
        <div className="mt-3.5 flex items-center justify-between px-1 text-xs">
          {/* Active Card Counter & Progressive Indicators */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-gold text-[0.68rem] font-bold tracking-widest tabular-nums">
              {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1.5" aria-hidden>
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Jump to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'w-5 bg-gold shadow-[0_0_8px_rgba(212,175,55,0.7)]'
                      : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Touch-Friendly Arrow Controls (Minimum 38x38 hit areas with active haptic press scale) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous card"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition-colors hover:border-gold hover:text-gold active:scale-90"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next card"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition-colors hover:border-gold hover:text-gold active:scale-90"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. Desktop Continuous Marquee Loop (lg:) ─── */}
      <div
        className="hidden lg:block group/loop relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left gradient fade mask */}
        <div
          aria-hidden
          className={`pointer-events-none absolute left-0 inset-y-0 z-20 w-16 md:w-24 bg-gradient-to-r ${edgeColor} to-transparent`}
        />

        {/* Right gradient fade mask */}
        <div
          aria-hidden
          className={`pointer-events-none absolute right-0 inset-y-0 z-20 w-16 md:w-24 bg-gradient-to-l ${edgeColor} to-transparent`}
        />

        {/* Looping Track */}
        <div
          className="flex w-max will-change-transform py-4"
          style={{
            animationName: direction === 'right' ? 'marqueeCardsLoopRight' : 'marqueeCardsLoop',
            animationDuration: `${speedSeconds}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationPlayState: isPaused ? 'paused' : 'running',
            gap: `${gapRem}rem`,
          }}
        >
          {duplicated.map(({ item, key, origIndex }) => (
            <div key={key} className="shrink-0">
              {renderItem(item, origIndex)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
