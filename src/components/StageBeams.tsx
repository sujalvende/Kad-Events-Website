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
 * Mimics real-world arena and gala searchlights fanning across the stage with slow,
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
          primary: 'rgba(212, 175, 55, 0.28)',
          glow: 'rgba(246, 216, 120, 0.45)',
          ambient: 'rgba(212, 175, 55, 0.12)',
        }
      : color === 'cyan'
      ? {
          primary: 'rgba(56, 189, 248, 0.28)',
          glow: 'rgba(125, 211, 252, 0.45)',
          ambient: 'rgba(56, 189, 248, 0.12)',
        }
      : {
          primary: 'rgba(248, 250, 252, 0.22)',
          glow: 'rgba(255, 255, 255, 0.35)',
          ambient: 'rgba(255, 255, 255, 0.08)',
        }

  // Multi-tier searchlight beams with staggered angles and animation phases
  const beams = [
    { id: 'b1', originX: 200, topX1: 40,  topX2: 240, duration: 11, delay: 0,   maxRotate: 4 },
    { id: 'b2', originX: 360, topX1: 260, topX2: 440, duration: 8.5, delay: -2, maxRotate: 3.5 },
    { id: 'b3', originX: 500, topX1: 430, topX2: 570, duration: 13, delay: -4, maxRotate: 2 },
    { id: 'b4', originX: 640, topX1: 560, topX2: 740, duration: 9.5, delay: -1, maxRotate: 3.5 },
    { id: 'b5', originX: 800, topX1: 760, topX2: 960, duration: 12, delay: -3, maxRotate: 4.5 },
  ]

  const isUp = direction === 'up'
  const originY = isUp ? 600 : 0
  const topY = isUp ? 0 : 600

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity: intensity }}
    >
      <style>{`
        @keyframes stageBeamSway1 { 0%, 100% { transform: rotate(-3.5deg); } 50% { transform: rotate(3.5deg); } }
        @keyframes stageBeamSway2 { 0%, 100% { transform: rotate(-2.8deg); } 50% { transform: rotate(2.8deg); } }
        @keyframes stageBeamSway3 { 0%, 100% { transform: rotate(-1.8deg); } 50% { transform: rotate(1.8deg); } }
        @keyframes stageBeamSway4 { 0%, 100% { transform: rotate(2.8deg); } 50% { transform: rotate(-2.8deg); } }
        @keyframes stageBeamSway5 { 0%, 100% { transform: rotate(3.5deg); } 50% { transform: rotate(-3.5deg); } }
        @keyframes beamLuminescence { 0%, 100% { opacity: 0.75; } 50% { opacity: 1; } }
      `}</style>

      {/* Atmospheric bottom stage source glow */}
      <div
        className="absolute inset-x-0 h-40 blur-[90px] transition-all"
        style={{
          bottom: isUp ? '-40px' : 'auto',
          top: isUp ? 'auto' : '-40px',
          background: `radial-gradient(ellipse 70% 50% at 50% ${isUp ? '100%' : '0%'}, ${beamColor.glow} 0%, ${beamColor.ambient} 45%, transparent 75%)`,
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
            <stop offset="0%" stopColor={beamColor.primary} stopOpacity="0.9" />
            <stop offset="25%" stopColor={beamColor.primary} stopOpacity="0.65" />
            <stop offset="65%" stopColor={beamColor.ambient} stopOpacity="0.25" />
            <stop offset="100%" stopColor={beamColor.ambient} stopOpacity="0" />
          </linearGradient>

          <filter id="beamBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" />
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
              }}
            >
              <polygon
                points={`${b.originX - 15},${originY} ${b.originX + 15},${originY} ${b.topX2},${topY} ${b.topX1},${topY}`}
                fill={`url(#beamGrad-${color})`}
                filter="url(#beamBlur)"
              />
            </g>
          );
        })}
      </svg>
    </div>
  )
}

export const StageBeams = memo(StageBeamsComponent)
export default StageBeams
