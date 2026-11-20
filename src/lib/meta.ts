import { useEffect } from 'react'

/** Per-page title, description and OG tags. */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const full = title ? `${title} | KAD Events` : 'KAD Events | Corporate Event Management & Brand Experiences'
    document.title = full
    const set = (sel: string, v: string) => document.head.querySelector(sel)?.setAttribute('content', v)
    set('meta[name="description"]', description)
    set('meta[property="og:title"]', full)
    set('meta[property="og:description"]', description)
  }, [title, description])
}
