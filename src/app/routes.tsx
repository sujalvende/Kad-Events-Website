import { lazy, Suspense } from 'react'
import { createBrowserRouter, useRouteError, Link, Navigate } from 'react-router'
import Layout from '../components/Layout'

// Public website pages lazy-loaded for route-level code splitting
const Home = lazy(() => import('../pages/Home'))
const About = lazy(() => import('../pages/About'))
const Services = lazy(() => import('../pages/Services'))
const ServiceDetail = lazy(() => import('../pages/ServiceDetail'))
const Work = lazy(() => import('../pages/Work'))
const ProjectDetail = lazy(() => import('../pages/ProjectDetail'))
const Process = lazy(() => import('../pages/Process'))
const Clients = lazy(() => import('../pages/Clients'))
const Contact = lazy(() => import('../pages/Contact'))
const NotFound = lazy(() => import('../pages/NotFound'))

// Admin Dashboard lazy-loaded suite
const AdminLayout = lazy(() => import('../pages/admin/AdminLayout'))
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'))
const AdminEnquiries = lazy(() => import('../pages/admin/AdminEnquiries'))
const AdminServices = lazy(() => import('../pages/admin/AdminServices'))
const AdminProjects = lazy(() => import('../pages/admin/AdminProjects'))
const AdminClients = lazy(() => import('../pages/admin/AdminClients'))
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'))

/** Minimal page loader — a thin dark scrim so transitions feel instant */
function PageLoader() {
  return (
    <div className="min-h-screen bg-ink" aria-hidden>
      <div className="fixed inset-x-0 top-0 z-[200] h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent animate-pulse" />
    </div>
  )
}

function RouteErrorBoundary() {
  const error = useRouteError()
  console.error('Route Error:', error)
  return (
    <div className="min-h-screen bg-ink text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-gold/10 blur-[140px]" />
      <div className="relative z-10 max-w-lg text-center">
        <p className="eyebrow mb-4 text-gold">Production Notice</p>
        <h1 className="display text-4xl md:text-5xl mb-6">
          System <span className="italic text-gold">Recovery.</span>
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed mb-8">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-gold px-6 py-3 text-xs font-bold uppercase tracking-widest text-ink transition-transform hover:scale-105"
          >
            Refresh
          </button>
          <Link
            to="/"
            className="rounded-full border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:border-gold hover:text-gold"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}

/** Wraps every lazy page in a Suspense boundary with the page loader */
function withSuspense(Component: React.ComponentType) {
  return function SuspenseWrapper() {
    return (
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    )
  }
}

// Prefetch heavy chunks after initial render settles
if (typeof window !== 'undefined') {
  setTimeout(() => {
    import('../components/InteractiveStage').catch(() => {})
    import('../components/ThreeDStage').catch(() => {})
  }, 1500)
}

export const router = createBrowserRouter([
  // Public Corporate Website Routes
  {
    path: '/',
    Component: Layout,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      { index: true, Component: withSuspense(Home) },
      { path: 'about', Component: withSuspense(About) },
      { path: 'services', Component: withSuspense(Services) },
      // Direct category path shortcuts matching user architecture specification
      { path: 'services/conferences', Component: withSuspense(ServiceDetail) },
      { path: 'services/product-launches', Component: withSuspense(ServiceDetail) },
      { path: 'services/corporate-events', Component: withSuspense(ServiceDetail) },
      { path: 'services/exhibitions', Component: withSuspense(ServiceDetail) },
      { path: 'services/annual-celebrations', Component: withSuspense(ServiceDetail) },
      { path: 'services/award-ceremonies', Component: withSuspense(ServiceDetail) },
      { path: 'services/brand-activations', Component: withSuspense(ServiceDetail) },
      { path: 'services/corporate-meetings', Component: withSuspense(ServiceDetail) },
      // Dynamic service detail route
      { path: 'services/:slug', Component: withSuspense(ServiceDetail) },
      { path: 'work', Component: withSuspense(Work) },
      { path: 'work/:slug', Component: withSuspense(ProjectDetail) },
      { path: 'process', Component: withSuspense(Process) },
      { path: 'clients', Component: withSuspense(Clients) },
      { path: 'contact', Component: withSuspense(Contact) },
      { path: '*', Component: withSuspense(NotFound) },
    ],
  },

  // Executive Administration Suite Routes
  {
    path: '/admin/login',
    Component: withSuspense(AdminLogin),
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: '/admin',
    Component: withSuspense(AdminLayout),
    ErrorBoundary: RouteErrorBoundary,
    children: [
      { index: true, Component: withSuspense(AdminDashboard) },
      { path: 'dashboard', Component: withSuspense(AdminDashboard) },
      { path: 'enquiries', Component: withSuspense(AdminEnquiries) },
      { path: 'services', Component: withSuspense(AdminServices) },
      { path: 'projects', Component: withSuspense(AdminProjects) },
      { path: 'clients', Component: withSuspense(AdminClients) },
      { path: 'settings', Component: withSuspense(AdminSettings) },
    ],
  },
])
