import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Phone, ArrowUpRight } from 'lucide-react'
import { contact } from '../data/content'
import { TLink } from '../lib/transition'

/**
 * Mobile floating quick actions dock.
 * - Throttled scroll listener using RAF to prevent main-thread lag
 * - Automatically hidden on desktop (lg:hidden) and on the contact page
 */
export default function MobileQuickDock() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)
  const isContact = pathname === '/contact'

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const isPast = window.scrollY > 280
        setVisible((prev) => (prev !== isPast ? isPast : prev))
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (isContact || !visible) return null

  return (
    <aside
      aria-label="Mobile quick actions"
      className="fixed bottom-[max(1.1rem,env(safe-area-inset-bottom))] inset-x-0 z-40 flex justify-center px-4 pointer-events-none lg:hidden transition-all duration-500 ease-out animate-fade-in"
    >
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-gold/40 bg-[#07080c]/90 p-1.5 pl-2.5 pr-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(212,175,55,0.22)] backdrop-blur-2xl">
        {/* Direct Phone Call */}
        <a
          href={`tel:${contact.phone.replace(/\s/g, '')}`}
          aria-label="Call KAD Events Desk"
          className="touch-feedback flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-gold/15 text-gold transition-colors hover:bg-gold/25"
        >
          <Phone size={14} />
        </a>

        {/* Primary Let's Talk CTA */}
        <TLink
          to="/contact"
          className="touch-feedback flex h-9 items-center gap-1.5 rounded-full bg-gold px-4 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-ink shadow-[0_0_15px_rgba(212,175,55,0.35)] transition-transform active:scale-95"
        >
          <span>Let's Talk</span>
          <ArrowUpRight size={13} aria-hidden />
        </TLink>
      </div>
    </aside>
  )
}
