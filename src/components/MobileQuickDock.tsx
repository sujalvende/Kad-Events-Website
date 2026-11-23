import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Phone, ArrowUpRight } from 'lucide-react'
import { contact } from '../data/content'
import { TLink } from '../lib/transition'

function WhatsAppIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 18.06c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.29c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.35-.77-1.85c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.17-.48-.29z" />
    </svg>
  )
}

/**
 * Mobile floating quick actions dock.
 * - Symmetrical luxury floating capsule with Call on left, WhatsApp on right, Let's Talk CTA in center
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

  const phoneDigits = contact.phone.replace(/\D/g, '')
  const whatsappUrl = phoneDigits ? `https://wa.me/${phoneDigits}` : `https://wa.me/?text=Hello%20KAD%20Events`

  return (
    <aside
      aria-label="Mobile quick actions"
      className="fixed bottom-[max(1.1rem,env(safe-area-inset-bottom))] inset-x-0 z-40 flex justify-center px-4 pointer-events-none lg:hidden transition-all duration-500 ease-out animate-fade-in"
    >
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-gold/40 bg-[#07080c]/90 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(212,175,55,0.22)] backdrop-blur-2xl">
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

        {/* Direct WhatsApp Chat */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp with KAD Events"
          className="touch-feedback flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-gold/15 text-gold transition-colors hover:bg-gold/25"
        >
          <WhatsAppIcon size={15} />
        </a>
      </div>
    </aside>
  )
}
