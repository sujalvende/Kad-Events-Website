import { AtSign, BriefcaseBusiness, Users, Play, Lock } from 'lucide-react'
import { contact, nav, services } from '../data/content'
import { TLink } from '../lib/transition'
import { Logo } from './Navbar'

const socials = [
  { l: 'Instagram', I: AtSign },
  { l: 'LinkedIn', I: BriefcaseBusiness },
  { l: 'Facebook', I: Users },
  { l: 'YouTube', I: Play },
]
const link = 'inline-block text-sm text-muted transition-all duration-300 hover:translate-x-1 hover:text-gold py-0.5'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="container-x py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-12 lg:gap-14">
          {/* Brand info */}
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Corporate event management, turnkey 3D stage scenography, and immersive brand experience production.
            </p>
            <ul className="mt-6 flex gap-2.5">
              {socials.map(({ l, I }) => (
                <li key={l}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    aria-label={`${l} (link to be added)`}
                    className="grid h-10 w-10 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-gold hover:text-gold hover:bg-gold/5"
                  >
                    <I size={16} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links grid — 2 columns on mobile, 3 columns on tablet/desktop */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8 lg:gap-10">
            <nav aria-label="Footer Navigation">
              <h3 className="eyebrow mb-4 text-gold text-[0.62rem] sm:text-[0.68rem]">Explore</h3>
              <ul className="space-y-2.5">
                {nav.map((n) => (
                  <li key={n.to}>
                    <TLink to={n.to} className={link}>
                      {n.label}
                    </TLink>
                  </li>
                ))}
                <li>
                  <TLink to="/admin" className="inline-flex items-center gap-1.5 text-xs text-gold/80 transition-colors hover:text-gold pt-1">
                    <Lock size={12} className="text-gold" />
                    <span>Admin Dashboard</span>
                  </TLink>
                </li>
              </ul>
            </nav>

            <div>
              <h3 className="eyebrow mb-4 text-gold text-[0.62rem] sm:text-[0.68rem]">Key Formats</h3>
              <ul className="space-y-2.5">
                {services.slice(0, 5).map((s) => (
                  <li key={s.slug}>
                    <TLink to={`/services/${s.slug}`} className={link}>
                      {s.title}
                    </TLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="eyebrow mb-4 text-gold text-[0.62rem] sm:text-[0.68rem]">Headquarters</h3>
              <ul className="space-y-2.5 text-sm text-muted">
                <li>
                  <a href={`mailto:${contact.email}`} className="hover:text-gold transition-colors break-all">
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-gold transition-colors">
                    {contact.phone}
                  </a>
                </li>
                <li className="text-slate-400">{contact.location}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright & executive admin portal access */}
        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} KAD Events Pvt. Ltd. Corporate Event Management Division.</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[0.7rem]">
            <span>International Experiential Production</span>
            <span className="text-line hidden sm:inline">·</span>
            <TLink
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-gold hover:bg-gold hover:text-ink transition-colors font-semibold"
            >
              <Lock size={11} />
              <span>Admin Portal</span>
            </TLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
