import { createContext, useCallback, useContext, useRef, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { gsap } from 'gsap'
import { reducedMotion } from './animations'
import { scrollToTop } from './lenis'

const Ctx = createContext<(to: string) => void>(() => {})
export const usePageNav = () => useContext(Ctx)

/** Fast, luxury curtain wipe between routes. Navigation happens mid-wipe in < 0.25s */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const veil = useRef<HTMLDivElement>(null)
  const busy = useRef(false)

  const go = useCallback(
    (to: string) => {
      if (busy.current) return
      if (to === pathname || reducedMotion() || !veil.current) {
        if (to !== pathname) navigate(to)
        scrollToTop()
        return
      }

      busy.current = true
      const v = veil.current

      gsap
        .timeline({
          onComplete: () => {
            busy.current = false
          },
        })
        .set(v, { yPercent: 100, display: 'block' })
        .to(v, { yPercent: 0, duration: 0.28, ease: 'power2.inOut' })
        .add(() => {
          navigate(to)
          scrollToTop()
        })
        .to(v, { yPercent: -100, duration: 0.32, ease: 'power2.inOut', delay: 0.05 })
        .set(v, { display: 'none' })
    },
    [navigate, pathname]
  )

  return (
    <Ctx.Provider value={go}>
      {children}
      <div ref={veil} aria-hidden className="pointer-events-none fixed inset-0 z-[90] hidden bg-panel">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
      </div>
    </Ctx.Provider>
  )
}

type LinkProps = Omit<React.ComponentProps<typeof Link>, 'className' | 'to'> & {
  to: string
  className?: string | ((active: boolean) => string)
  end?: boolean
}

/** Router link that plays the page transition; keeps normal modified-click behaviour. */
export function TLink({ to, className, end = true, onClick, ...rest }: LinkProps) {
  const go = usePageNav()
  const { pathname } = useLocation()
  const active = end ? pathname === to : pathname === to || pathname.startsWith(to + '/')
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={typeof className === 'function' ? className(active) : className}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        go(to)
      }}
      {...rest}
    />
  )
}
