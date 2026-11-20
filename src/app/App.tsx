import { useState } from 'react'
import { RouterProvider } from 'react-router'
import { router } from './routes'
import LoadingScreen from '../components/LoadingScreen'

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {/* Cinematic intro loader — shown until video metadata + min time elapsed */}
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      {/* Site mounts immediately underneath so assets pre-warm during the intro */}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: loaded ? 'opacity 0.5s ease-in' : 'none',
          pointerEvents: loaded ? 'auto' : 'none',
        }}
      >
        <RouterProvider router={router} />
      </div>
    </>
  )
}
