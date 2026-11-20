import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Phone, Sparkles, MessageSquare } from 'lucide-react'
import { contact } from '../data/content'
import { TLink } from '../lib/transition'

/**
 * Mobile-only floating quick dock.
 * Appears dynamically after user scrolls past the hero section.
 * Provides instant access to call, chat/inquire, and view services on mobile devices.
 * Automatically hidden on desktop (lg:hidden) and on the contact page.
 */
export default function MobileQuickDock() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)
  const isContact = pathname === '/contact'

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 280)
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
          className="touch-feedback flex h-9 items-center gap-2 rounded-full bg-gradient-to-r from-gold via-amber-300 to-gold px-4 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink shadow-[0_0_15px_rgba(212,175,55,0.4)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ink" />
          </span>
          <span>Let's Talk</span>
          <Sparkles size={12} className="text-ink" />
        </TLink>

        {/* Explore Formats */}
        <TLink
          to="/services"
          aria-label="Explore Capabilities"
          className="touch-feedback flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition-colors hover:border-gold hover:text-gold"
        >
          <MessageSquare size={14} />
        </TLink>
      </div>
    </aside>
  )
}
