import { useEffect, useState, useRef } from 'react'
import { Sparkles, Mail, Phone, ArrowUpRight } from 'lucide-react'
import { useLocation } from 'react-router'
import { nav, contact, services } from '../data/content'
import { TLink } from '../lib/transition'
import Button from './Button'
import LetsTalkButton from './LetsTalkButton'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 sm:gap-2.5 ${className}`}>
      <span className="display text-2xl sm:text-3xl tracking-tight text-white font-medium">KAD</span>
      <span className="eyebrow !tracking-[0.4em] sm:!tracking-[0.45em] gold-gradient-text text-[0.6rem] sm:text-[0.68rem]">Events</span>
    </span>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  const home = pathname === '/'
  const scrolledRef = useRef(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  // High-performance scroll listener: GPU-accelerated hairline, state flips only on boundary
  useEffect(() => {
    let ticking = false
    const on = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const isPast = scrollY > 40
        if (isPast !== scrolledRef.current) {
          scrolledRef.current = isPast
          setScrolled(isPast)
        }

        if (progressRef.current) {
          const total = document.documentElement.scrollHeight - window.innerHeight
          const p = total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0
          progressRef.current.style.transform = `scaleX(${p})`
        }
        ticking = false
      })
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // Auto-close sidebar on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock scroll & handle Escape key when sidebar is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  const solid = !home || scrolled || open

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 text-snow transition-all duration-500 ${
          solid
            ? 'border-b border-white/10 bg-[#06070a]/92 py-3 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'border-b border-transparent py-4 sm:py-6'
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-14 flex items-center justify-between gap-3 w-full max-w-[90rem] mx-auto">
          {/* Logo */}
          <TLink to="/" aria-label="KAD Events home" className="relative z-50 group flex items-center gap-2 sm:gap-3 shrink-0">
            <Logo />
          </TLink>

          {/* Desktop Primary Nav */}
          <nav aria-label="Primary" className="hidden items-center gap-7 xl:gap-9 lg:flex">
            {nav.map((n) => (
              <TLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={(a) =>
                  `group relative py-1 text-[0.68rem] xl:text-[0.7rem] font-semibold uppercase tracking-[0.22em] transition-all duration-300 hover:text-gold ${
                    a ? 'text-gold' : 'text-slate-300'
                  }`
                }
              >
                {n.label}
                <span
                  aria-hidden
                  className={`absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-gold to-amber-200 transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] ${
                    pathname === n.to || (n.to !== '/' && pathname.startsWith(n.to + '/'))
                      ? 'origin-left scale-x-100 shadow-[0_0_10px_rgba(212,175,55,0.8)]'
                      : 'origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100'
                  }`}
                />
              </TLink>
            ))}
          </nav>

          {/* Right Action: Let's Talk Button for Desktop, Hamburger Drawer for Mobile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Desktop Direct CTA: Faithful replica of architectural LET'S TALK ↗ gold button */}
            <div className="hidden lg:inline-flex items-center">
              <LetsTalkButton to="/contact" />
            </div>

            {/* Mobile / Tablet: Hamburger Menu Button (hidden on desktop) */}
            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="agency-sidebar"
              aria-label={open ? 'Close navigation sidebar' : 'Open navigation sidebar'}
              className={`lg:hidden group relative flex items-center gap-1.5 sm:gap-2 rounded-full border px-3 py-1.5 sm:px-4 sm:py-2 text-[0.62rem] sm:text-[0.68rem] font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] backdrop-blur-md transition-all duration-300 min-h-[36px] ${
                open
                  ? 'border-gold bg-gold/15 text-gold shadow-[0_0_25px_rgba(212,175,55,0.3)]'
                  : 'border-white/15 bg-white/[0.04] text-white hover:border-gold/60 hover:bg-gold/10 hover:text-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]'
              }`}
            >
              <span className="font-sans tracking-[0.2em]">
                {open ? 'CLOSE' : 'MENU'}
              </span>

              {/* Animated 3-line morphing hamburger */}
              <div className="relative flex h-2.5 w-3 sm:h-3 sm:w-3.5 flex-col justify-between shrink-0" aria-hidden>
                <span
                  className={`h-0.5 w-full rounded-full bg-current transition-all duration-300 ease-out ${
                    open ? 'translate-y-[4px] sm:translate-y-[5px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`h-0.5 w-2/3 self-end rounded-full bg-current transition-all duration-300 ease-out group-hover:w-full ${
                    open ? 'opacity-0 scale-0' : ''
                  }`}
                />
                <span
                  className={`h-0.5 w-full rounded-full bg-current transition-all duration-300 ease-out ${
                    open ? '-translate-y-[4px] sm:-translate-y-[5px] -rotate-45' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Minimal luxury scroll progress hairline */}
        <div
          ref={progressRef}
          aria-hidden
          className="absolute bottom-0 left-0 h-[1.5px] w-full origin-left bg-gradient-to-r from-gold via-amber-300 to-gold transition-opacity duration-300 ease-out shadow-[0_0_8px_rgba(212,175,55,0.8)] pointer-events-none will-change-transform"
          style={{
            transform: 'scaleX(0)',
            opacity: scrolled ? 1 : 0,
          }}
        />
      </header>

      {/* Luxury Slide-in Sidebar Drawer Overlay System (Mobile / Tablet) */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition-all duration-500 lg:hidden ${
          open ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        {/* Backdrop Overlay */}
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500 ${
            open ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Luxury Slide-in Sidebar Drawer */}
        <aside
          id="agency-sidebar"
          role="dialog"
          aria-label="Navigation Sidebar"
          aria-modal={open}
          className={`absolute inset-y-0 right-0 flex w-full max-w-full flex-col justify-between overflow-y-auto overflow-x-hidden border-l border-white/10 bg-[#07080c]/98 p-5 sm:p-8 md:p-12 pb-8 shadow-[-25px_0_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:max-w-md md:max-w-lg lg:max-w-xl ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Ambient atmospheric radial glows - clipped inside drawer */}
          <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-gold/10 blur-[130px]" />
          <div className="pointer-events-none absolute right-0 bottom-1/4 h-72 w-72 rounded-full bg-amber-500/5 blur-[120px]" />

          {/* Top Header Row of Sidebar */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-5 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <Logo />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
              className="touch-feedback flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-widest text-slate-300 transition-colors hover:border-gold hover:text-gold active:scale-95"
            >
              <span>ESC</span>
              <span className="text-gold text-sm leading-none">✕</span>
            </button>
          </div>

          {/* Middle Navigation Links */}
          <div className="relative z-10 my-auto py-6">
            <p className="eyebrow mb-5 text-gold text-[0.58rem] sm:text-[0.6rem] tracking-[0.3em]">
              Navigation Directory
            </p>
            <ul className="space-y-1">
              {nav.map((n, i) => {
                const active = pathname === n.to || (n.to !== '/' && pathname.startsWith(n.to + '/'))
                return (
                  <li
                    key={n.to}
                    className={`overflow-hidden border-b border-white/5 ${
                      open ? `drawer-stagger-${Math.min(5, i + 1)}` : ''
                    }`}
                  >
                    <TLink
                      to={n.to}
                      className={`display group flex items-baseline justify-between py-3.5 sm:py-4 text-2xl sm:text-3xl md:text-4xl transition-all duration-300 hover:translate-x-2 touch-feedback ${
                        active ? 'gold-gradient-text' : 'text-slate-200 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xs font-sans font-mono tracking-widest text-gold/60 group-hover:text-gold transition-colors">
                          0{i + 1}
                        </span>
                        <span className="text-balance">{n.label}</span>
                      </span>
                      <ArrowUpRight
                        size={18}
                        className={`transition-transform duration-300 ${
                          active ? 'text-gold opacity-100' : 'text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-gold'
                        }`}
                      />
                    </TLink>
                  </li>
                )
              })}
            </ul>

            {/* Featured Formats Quick Access */}
            <div className="mt-6 pt-5 border-t border-white/10 hidden sm:block">
              <p className="eyebrow mb-3 text-slate-400 text-[0.58rem] tracking-[0.25em]">
                Key Formats
              </p>
              <div className="flex flex-wrap gap-2">
                {services.slice(0, 4).map((s) => (
                  <TLink
                    key={s.slug}
                    to={`/services/${s.slug}`}
                    className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.62rem] font-medium text-slate-300 transition-colors hover:border-gold/50 hover:text-gold"
                  >
                    {s.title}
                  </TLink>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Contact & Agency Credentials */}
          <div className="relative z-10 border-t border-white/10 pt-5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <div className="grid gap-3 sm:grid-cols-2 mb-5">
              <div>
                <span className="eyebrow block text-[0.55rem] sm:text-[0.58rem] text-slate-400 mb-0.5">
                  Executive Desk
                </span>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-xs sm:text-sm text-slate-200 hover:text-gold transition-colors block break-all font-medium"
                >
                  {contact.email}
                </a>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="text-xs sm:text-sm text-slate-200 hover:text-gold transition-colors block mt-0.5"
                >
                  {contact.phone}
                </a>
              </div>

              <div>
                <span className="eyebrow block text-[0.55rem] sm:text-[0.58rem] text-slate-400 mb-0.5">
                  Global Operations
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  London · New York · Dubai · Singapore
                </p>
                <span className="inline-flex items-center gap-1.5 text-[0.58rem] sm:text-[0.62rem] text-gold mt-1 font-semibold uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Booking 2026 / 2027
                </span>
              </div>
            </div>

            {/* Quick Direct Actions for Mobile */}
            <div className={`grid grid-cols-2 gap-2 mb-4 sm:hidden ${open ? 'drawer-stagger-6' : ''}`}>
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className="touch-feedback flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-gold/40 bg-gold/15 py-3 px-3 text-xs font-bold uppercase tracking-wider text-gold shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-colors hover:bg-gold/25"
              >
                <Phone size={14} className="shrink-0" />
                <span>Call Desk</span>
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="touch-feedback flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-200 transition-colors hover:border-gold hover:text-gold hover:bg-white/10"
              >
                <Mail size={14} className="shrink-0 text-gold" />
                <span>Email Desk</span>
              </a>
            </div>

            <div className={open ? 'drawer-stagger-6' : ''}>
              <Button to="/contact" className="w-full shadow-[0_0_30px_rgba(212,175,55,0.35)] touch-feedback">
                <Sparkles size={14} className="mr-1.5 text-ink" />
                Start A Conversation
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
