import { useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import { useScrollAnimations } from '../lib/animations'
import { PageTransitionProvider } from '../lib/transition'
import { useLenis, scrollToTop } from '../lib/lenis'
import Navbar from './Navbar'
import Footer from './Footer'
import Cursor from './Cursor'
import MobileQuickDock from './MobileQuickDock'

/**
 * Inner handles per-route concerns: scroll-to-top and reveal animations.
 * It re-renders on route change, so Lenis must NOT live here.
 */
function Inner() {
  const root = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  // Jump to top before the new route paints (Lenis-aware)
  useLayoutEffect(() => {
    scrollToTop()
  }, [pathname])

  useScrollAnimations(root, pathname)

  return (
    <div ref={root} className="min-h-screen bg-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar />
      <MobileQuickDock />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

/**
 * Layout is the stable shell — it never unmounts across navigations.
 * Lenis lives here so it is created once and persists for the entire session.
 */
export default function Layout() {
  // Smooth scroll for the whole site — mounted once, never destroyed on nav
  useLenis()

  return (
    <PageTransitionProvider>
      <Inner />
      <Cursor />
    </PageTransitionProvider>
  )
}
