import { usePageMeta } from '../lib/meta'
import Button from '../components/Button'

export default function NotFound() {
  usePageMeta('Page not found', 'The page you are looking for does not exist.')
  return (
    <section className="container-x grid min-h-[80svh] place-content-center py-40 text-center">
      <p className="eyebrow text-gold">404</p>
      <h1 className="display h-xl mt-4">Page not found</h1>
      <div className="mt-10"><Button to="/">Back home</Button></div>
    </section>
  )
}
