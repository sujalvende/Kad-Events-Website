// Hand-curated high-resolution Unsplash photo IDs for luxury corporate event production
export const photos = {
  crowd: '1540575467063-178a50c2df87',
  conference: '1531058020387-3be344556be6',
  lights: '1550305080-4e029753abcf',
  speaker: '1762968274962-20c12e6e8ecd',
  dinner: '1536392706976-e486e2ba97af',
  expo: '1761195689615-9469b65dac01',
  tent: '1778402566957-c21d77a67d0d',
  trade: '1762028892701-692dc360db08',
  blue: '1678655978189-c1145706996f',
  seated: '1571645163064-77faa9676a46',
  keynote: '1505373877841-8d25f7d46678',
  stageDesign: '1475721027785-f74eccf877e2',
  controlRoom: '1598488035139-bdbb2231ce04',
  vipGala: '1519671482749-fd09be7ccebf',
  productReveal: '1511578314322-379afb476865',
  soundboard: '1470225620780-dba8ba36b745',
  stadium: '1514525253161-7a46d19cd819',
  architect: '1497366216548-37526070297c',
  networking: '1528605248644-14dd04022da1',
  broadcast: '1516450360452-9312f5e86fc7',
} as const

export type PhotoKey = keyof typeof photos

// Use WebP format + quality 75 for smaller payloads while maintaining visual quality
export const src = (k: PhotoKey, w: number) =>
  `https://images.unsplash.com/photo-${photos[k]}?auto=format&fm=webp&fit=crop&q=75&w=${w}`

// Provide 2× for retina but cap at 1800px to avoid oversized downloads
export const srcSet = (k: PhotoKey) =>
  [480, 800, 1200, 1800].map((w) => `${src(k, w)} ${w}w`).join(', ')
