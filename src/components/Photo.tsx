import { src, srcSet, type PhotoKey } from '../lib/img'

type Props = { k: PhotoKey; alt?: string; sizes?: string; className?: string; imgClass?: string; eager?: boolean; ratio?: string; noReveal?: boolean }

/** Responsive, lazy image inside a mask wrapper (reveal animated via data-img-reveal). */
export default function Photo({ k, alt = '', sizes = '(min-width:1024px) 50vw, 100vw', className = '', imgClass = '', eager, ratio = '', noReveal }: Props) {
  return (
    <div {...(noReveal ? {} : { 'data-img-reveal': true })} className={`img-mask bg-card ${ratio} ${className}`}>
      <img src={src(k, 1200)} srcSet={srcSet(k)} sizes={sizes} alt={alt}
        loading={eager ? 'eager' : 'lazy'} decoding="async" width={1200} height={800}
        className={`h-full w-full object-cover ${imgClass}`} />
    </div>
  )
}
