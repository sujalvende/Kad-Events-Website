import { memo } from 'react'
import { reducedMotion } from '../lib/animations'

interface StageBeamsProps {
  className?: string
  color?: 'gold' | 'cyan' | 'neutral'
  intensity?: number
  direction?: 'up' | 'down'
}

/**
 * Theatrical Volumetric Stage Spotlight Beams.
 * Mimics real-world arena and gala searchlights fanning across the stage with dynamic,
 * atmospheric angular swaying and soft luminescence.
 * Hardware-accelerated with CSS transforms and GPU-composited SVG layers.
 */
function StageBeamsComponent({
  className = '',
  color = 'gold',
  intensity = 1,
  direction = 'up',
}: StageBeamsProps) {
  const isReduced = reducedMotion()

  const beamColor =
    color === 'gold'
      ? {
          primary: 'rgba(212, 175, 55, 0.35)',
          glow: 'rgba(246, 216, 120, 0.55)',
          ambient: 'rgba(212, 175, 55, 0.16)',
        }
      : color === 'cyan'
      ? {
          primary: 'rgba(56, 189, 248, 0.35)',
          glow: 'rgba(125, 211, 252, 0.55)',
          ambient: 'rgba(56, 189, 248, 0.16)',
        }
      : {
          primary: 'rgba(248, 250, 252, 0.28)',
          glow: 'rgba(255, 255, 255, 0.45)',
          ambient: 'rgba(255, 255, 255, 0.1)',
        }

  // Multi-tier energetic searchlight beams with fast, rhythmic sweeps
  const beams = [
    { id: 'b1', originX: 200, topX1: 30,  topX2: 240, duration: 4.2, delay: 0 },
    { id: 'b2', originX: 360, topX1: 230, topX2: 430, duration: 3.6, delay: -1.2 },
    { id: 'b3', originX: 500, topX1: 420, topX2: 580, duration: 4.8, delay: -2.4 },
    { id: 'b4', originX: 640, topX1: 570, topX2: 770, duration: 3.4, delay: -0.8 },
    { id: 'b5', originX: 800, topX1: 760, topX2: 970, duration: 4.4, delay: -1.6 },
  ]

  const isUp = direction === 'up'
  const originY = isUp ? 600 : 0
  const topY = isUp ? 0 : 600

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden will-change-transform ${className}`}
      style={{ opacity: intensity }}
    >
      <style>{`
        @keyframes stageBeamSway1 { 0%, 100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
        @keyframes stageBeamSway2 { 0%, 100% { transform: rotate(-5.5deg); } 50% { transform: rotate(5.5deg); } }
        @keyframes stageBeamSway3 { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
        @keyframes stageBeamSway4 { 0%, 100% { transform: rotate(5.5deg); } 50% { transform: rotate(-5.5deg); } }
        @keyframes stageBeamSway5 { 0%, 100% { transform: rotate(7deg); } 50% { transform: rotate(-7deg); } }
        @keyframes beamLuminescence { 0%, 100% { opacity: 0.65; } 50% { opacity: 1; } }

        /* Tighter, focused sway arcs for portrait mobile screens (<640px) */
        @media (max-width: 640px) {
          @keyframes stageBeamSway1 { 0%, 100% { transform: rotate(-3.5deg); } 50% { transform: rotate(3.5deg); } }
          @keyframes stageBeamSway2 { 0%, 100% { transform: rotate(-2.8deg); } 50% { transform: rotate(2.8deg); } }
          @keyframes stageBeamSway3 { 0%, 100% { transform: rotate(-2.2deg); } 50% { transform: rotate(2.2deg); } }
          @keyframes stageBeamSway4 { 0%, 100% { transform: rotate(2.8deg); } 50% { transform: rotate(-2.8deg); } }
          @keyframes stageBeamSway5 { 0%, 100% { transform: rotate(3.5deg); } 50% { transform: rotate(-3.5deg); } }
        }
      `}</style>

      {/* Atmospheric bottom stage source glow */}
      <div
        className="absolute inset-x-0 h-44 sm:h-52 blur-[80px] transition-all"
        style={{
          bottom: isUp ? '-30px' : 'auto',
          top: isUp ? 'auto' : '-30px',
          background: `radial-gradient(ellipse 70% 50% at 50% ${isUp ? '100%' : '0%'}, ${beamColor.glow} 0%, ${beamColor.ambient} 45%, transparent 75%)`,
        }}
      />

      {/* Mobile-specific focused spotlight corona */}
      <div
        className="block sm:hidden absolute inset-x-0 h-32 blur-[40px] pointer-events-none opacity-80"
        style={{
          bottom: isUp ? '0px' : 'auto',
          top: isUp ? 'auto' : '0px',
          background: `radial-gradient(ellipse 50% 40% at 50% ${isUp ? '100%' : '0%'}, ${beamColor.glow} 0%, transparent 70%)`,
        }}
      />

      {/* SVG Volumetric Light Beams */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`beamGrad-${color}`} x1="0%" y1={isUp ? '100%' : '0%'} x2="0%" y2={isUp ? '0%' : '100%'}>
            <stop offset="0%" stopColor={beamColor.primary} stopOpacity="0.95" />
            <stop offset="25%" stopColor={beamColor.primary} stopOpacity="0.75" />
            <stop offset="65%" stopColor={beamColor.ambient} stopOpacity="0.3" />
            <stop offset="100%" stopColor={beamColor.ambient} stopOpacity="0" />
          </linearGradient>

          <filter id="beamBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        {beams.map((b, idx) => {
          const swayAnim = isReduced
            ? 'none'
            : `stageBeamSway${(idx % 5) + 1} ${b.duration}s ease-in-out infinite alternate, beamLuminescence ${b.duration * 0.7}s ease-in-out infinite alternate`

          return (
            <g
              key={b.id}
              style={{
                transformOrigin: `${b.originX}px ${originY}px`,
                animation: swayAnim,
                animationDelay: `${b.delay}s`,
                mixBlendMode: 'screen',
                willChange: 'transform, opacity',
              }}
            >
              <polygon
                points={`${b.originX - 16},${originY} ${b.originX + 16},${originY} ${b.topX2},${topY} ${b.topX1},${topY}`}
                fill={`url(#beamGrad-${color})`}
                filter="url(#beamBlur)"
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export const StageBeams = memo(StageBeamsComponent)
export default StageBeams
