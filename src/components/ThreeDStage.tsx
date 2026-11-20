import { Suspense, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { reducedMotion } from '../lib/animations'


export type StageMood = 'gala' | 'summit' | 'launch'

/* ─── Theme definitions ──────────────────────────────────────────────────── */
const THEMES = {
  gala: {
    name: 'Royal Gala',
    primary: '#d4af37',
    secondary: '#f59e0b',
    glow: '#fde68a',
    beamAlpha: 0.55,
    ambient: '#2a1e06',
    floor: '#1a1200',
    screenText: 'KAD GLOBAL GALA // 2026',
    subText: 'HONORING EXTRAORDINARY LEADERSHIP',
  },
  summit: {
    name: 'Cyber Summit',
    primary: '#00f0ff',
    secondary: '#3b82f6',
    glow: '#93c5fd',
    beamAlpha: 0.58,
    ambient: '#061629',
    floor: '#001a2a',
    screenText: 'GLOBAL TECH SUMMIT // KAD',
    subText: 'THE FUTURE OF ENTERPRISE & AI',
  },
  launch: {
    name: 'Keynote Launch',
    primary: '#d946ef',
    secondary: '#8b5cf6',
    glow: '#f472b6',
    beamAlpha: 0.62,
    ambient: '#220535',
    floor: '#1a0028',
    screenText: 'KEYNOTE REVEAL // WORLD PREMIERE',
    subText: 'DESIGNED FOR UNCOMPROMISED IMPACT',
  },
}

/* ─── Device capability ──────────────────────────────────────────────────── */
function isLowEnd(): boolean {
  if (typeof window === 'undefined') return false
  const nav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number }
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return true
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2) return true
  if (window.innerWidth < 768) return true
  return false
}

/* ─── Shared geometry cache ──────────────────────────────────────────────── */
const GEO = {
  box_tiny: new THREE.BoxGeometry(0.05, 0.05, 6.4, 1, 1, 1),
  cylinder_truss: new THREE.CylinderGeometry(0.05, 0.05, 6.4, 6),
  sphere_lens: new THREE.SphereGeometry(0.16, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2),
  plane_sm: new THREE.PlaneGeometry(3.2, 4.2),
  plane_lg: new THREE.PlaneGeometry(9.5, 4.6),
  plane_halo: new THREE.PlaneGeometry(11, 5.5),
  cylinder_beam: new THREE.CylinderGeometry(0.06, 1.8, 11, 16, 1, true),
  capsule: new THREE.CapsuleGeometry(0.24, 0.77, 3, 6),
}

/* ─── LED Screen Texture — throttled to 20fps ───────────────────────────── */
function useDynamicLEDTexture(mood: StageMood) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const frameCountRef = useRef(0)
  const LOW_END = useMemo(() => isLowEnd(), [])
  const FRAME_SKIP = LOW_END ? 6 : 3

  if (!canvasRef.current) {
    const c = document.createElement('canvas')
    c.width = LOW_END ? 512 : 1024
    c.height = LOW_END ? 256 : 512
    canvasRef.current = c
  }

  if (!textureRef.current) {
    const t = new THREE.CanvasTexture(canvasRef.current)
    t.minFilter = THREE.LinearFilter
    t.magFilter = THREE.LinearFilter
    textureRef.current = t
  }

  useFrame(({ clock }) => {
    frameCountRef.current++
    if (frameCountRef.current % FRAME_SKIP !== 0) return

    const canvas = canvasRef.current!
    const texture = textureRef.current!
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const t = clock.getElapsedTime()
    const theme = THEMES[mood]
    const W = canvas.width
    const H = canvas.height

    // Dark base
    ctx.fillStyle = '#04050a'
    ctx.fillRect(0, 0, W, H)

    // Animated hex/grid
    ctx.strokeStyle = theme.primary + '28'
    ctx.lineWidth = 1
    const gridSize = W / 32
    const offset = (t * 18) % gridSize
    for (let x = 0; x < W; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
    }
    for (let y = offset; y < H; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
    }

    // Radar rings
    const cx = W / 2, cy = H / 2
    const rings = LOW_END ? 3 : 5
    for (let r = 0; r < rings; r++) {
      const radius = H * 0.1 + r * H * 0.075 + Math.sin(t * 1.8 + r) * H * 0.02
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.strokeStyle = r % 2 === 0 ? theme.primary + 'aa' : theme.secondary + '77'
      ctx.lineWidth = r === 0 ? 2.5 : 1.5
      ctx.stroke()
    }

    // Equalizer bars
    const bars = LOW_END ? 24 : 56
    const barW = W / bars
    for (let i = 0; i < bars; i++) {
      const freq = Math.sin(t * 3.5 + i * 0.3) * 0.5 + Math.cos(t * 2.2 + i * 0.18) * 0.5
      const h = Math.abs(freq) * H * 0.26 + H * 0.025
      const grad = ctx.createLinearGradient(0, H, 0, H - h)
      grad.addColorStop(0, theme.secondary + '44')
      grad.addColorStop(0.6, theme.primary + 'cc')
      grad.addColorStop(1, '#ffffff')
      ctx.fillStyle = grad
      ctx.fillRect(i * barW + 1, H - h, barW - 2, h)
    }

    // Scanline effect
    for (let y = 0; y < H; y += 4) {
      ctx.fillStyle = 'rgba(0,0,0,0.12)'
      ctx.fillRect(0, y, W, 2)
    }

    // Bright pulse in center
    const pulseSz = 0.08 + Math.sin(t * 2.6) * 0.015
    const pulseGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, H * pulseSz)
    pulseGrad.addColorStop(0, theme.glow + 'ff')
    pulseGrad.addColorStop(0.4, theme.primary + '88')
    pulseGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = pulseGrad
    ctx.fillRect(0, 0, W, H)

    // Main title
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    const fontSize = Math.round(H * 0.095)
    ctx.font = `900 ${fontSize}px sans-serif`
    ctx.shadowColor = theme.glow; ctx.shadowBlur = 28
    ctx.fillStyle = '#ffffff'
    ctx.fillText('K A D   E V E N T S', cx, cy - H * 0.045)

    const subFontSize = Math.round(H * 0.038)
    ctx.font = `700 ${subFontSize}px sans-serif`
    ctx.fillStyle = theme.primary; ctx.shadowColor = theme.primary; ctx.shadowBlur = 14
    ctx.fillText(theme.screenText, cx, cy + H * 0.07)

    ctx.font = `600 ${Math.round(H * 0.026)}px sans-serif`
    ctx.fillStyle = '#94a3b8'; ctx.shadowBlur = 0
    ctx.fillText(theme.subText, cx, cy + H * 0.135)

    texture.needsUpdate = true
  })

  useEffect(() => () => { textureRef.current?.dispose() }, [])

  return textureRef.current!
}

/* ─── Pulsing Floor Ring ─────────────────────────────────────────────────── */
function FloorRing({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    }),
    [color]
  )
  useEffect(() => () => mat.dispose(), [mat])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const pulse = 0.4 + Math.sin(t * 2.2) * 0.2
    mat.opacity = pulse
    meshRef.current.rotation.z = t * 0.08
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -1.5]}>
      <ringGeometry args={[6.5, 6.8, 64]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

/* ─── Pulsing Halo Ring around LED screen ───────────────────────────────── */
function ScreenHalo({ color, secondary }: { color: string; secondary: string }) {
  const mat1 = useMemo(
    () => new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    }),
    [color]
  )
  useEffect(() => () => mat1.dispose(), [mat1])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    mat1.opacity = 0.25 + Math.sin(t * 1.8) * 0.15
  })

  return (
    <group position={[0, 3.2, -4.56]}>
      <mesh>
        <ringGeometry args={[4.9, 5.2, 64]} />
        <primitive object={mat1} attach="material" />
      </mesh>
      <mesh>
        <ringGeometry args={[5.4, 5.55, 64]} />
        <meshBasicMaterial color={secondary} transparent opacity={0.2} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/* ─── Animated ground glow plane ────────────────────────────────────────── */
function GroundGlow({ color }: { color: string }) {
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    }),
    [color]
  )
  useEffect(() => () => mat.dispose(), [mat])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    mat.opacity = 0.06 + Math.sin(t * 0.9) * 0.04
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
      <planeGeometry args={[28, 22]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

/* ─── Volumetric Moving Head Light Beam ─────────────────────────────────── */
function VolumetricBeam({
  anchor, color, offset, speed = 1, angleRange = 0.5,
}: {
  anchor: [number, number, number]
  color: string; offset: number; speed?: number; angleRange?: number
}) {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime() * speed + offset
    group.current.rotation.z = Math.sin(t * 0.75) * angleRange
    group.current.rotation.x = Math.sin(t * 0.45 + 1.2) * (angleRange * 0.65) + 0.15
  })

  const beamMat = useMemo(
    () => new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    [color]
  )
  const headMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#252c38', metalness: 0.95, roughness: 0.15 }),
    []
  )
  const lensMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }),
    [color]
  )

  useEffect(() => () => { beamMat.dispose(); lensMat.dispose() }, [beamMat, lensMat])

  return (
    <group position={anchor}>
      {/* Light head housing */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.35, 10]} />
        <primitive object={headMat} attach="material" />
      </mesh>
      {/* Lens */}
      <mesh position={[0, -0.18, 0]}>
        <primitive object={GEO.sphere_lens} attach="geometry" />
        <primitive object={lensMat} attach="material" />
      </mesh>
      {/* Animated beam cone */}
      <group ref={group}>
        <mesh position={[0, -5.5, 0]}>
          <primitive object={GEO.cylinder_beam} attach="geometry" />
          <primitive object={beamMat} attach="material" />
        </mesh>
      </group>
    </group>
  )
}

/* ─── Overhead Box Truss System ─────────────────────────────────────────── */
function TrussSystem({ color }: { color: string }) {
  const neonMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 }),
    [color]
  )
  const metalMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#2d333b', metalness: 0.85, roughness: 0.15 }),
    []
  )
  useEffect(() => () => { neonMat.dispose(); metalMat.dispose() }, [neonMat, metalMat])

  return (
    <group position={[0, 6.2, 0]}>
      {/* Main horizontal bars */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[16, 0.2, 0.2]} />
        <primitive object={metalMat} attach="material" />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[16, 0.2, 0.2]} />
        <primitive object={metalMat} attach="material" />
      </mesh>
      {/* Neon accent strip */}
      <mesh position={[0, -0.2, 0.12]}>
        <boxGeometry args={[15.6, 0.03, 0.03]} />
        <primitive object={neonMat} attach="material" />
      </mesh>
      <mesh position={[0, -0.2, -0.12]}>
        <boxGeometry args={[15.6, 0.03, 0.03]} />
        <primitive object={neonMat} attach="material" />
      </mesh>
      {/* Vertical support legs */}
      {[-7.5, 7.5].map((x) => (
        <group key={x} position={[x, -3.2, 0]}>
          <mesh position={[-0.15, 0, 0]}>
            <primitive object={GEO.cylinder_truss} attach="geometry" />
            <primitive object={metalMat} attach="material" />
          </mesh>
          <mesh position={[0.15, 0, 0]}>
            <primitive object={GEO.cylinder_truss} attach="geometry" />
            <primitive object={metalMat} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ─── Arena Stage Structure ─────────────────────────────────────────────── */
function ArenaStage({ mood }: { mood: StageMood }) {
  const theme = THEMES[mood]
  const ledTexture = useDynamicLEDTexture(mood)

  const edgeMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: theme.primary, side: THREE.DoubleSide }),
    [theme.primary]
  )
  const haloMat = useMemo(
    () => new THREE.MeshBasicMaterial({
      color: theme.secondary,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    }),
    [theme.secondary]
  )
  const podiumMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0c1018', metalness: 0.98, roughness: 0.1 }),
    []
  )
  const glassMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: theme.glow,
      transparent: true,
      opacity: 0.75,
      metalness: 0.3,
      roughness: 0.05,
    }),
    [theme.glow]
  )
  const floorMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: theme.floor,
      roughness: 0.08,
      metalness: 0.92,
      envMapIntensity: 1.2,
    }),
    [theme.floor]
  )
  const stageMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0d1018', roughness: 0.22, metalness: 0.78 }),
    []
  )

  useEffect(
    () => () => { edgeMat.dispose(); haloMat.dispose(); podiumMat.dispose(); glassMat.dispose(); floorMat.dispose(); stageMat.dispose() },
    [edgeMat, haloMat, podiumMat, glassMat, floorMat, stageMat]
  )

  return (
    <group>
      {/* Stage deck */}
      <mesh position={[0, 0.2, -1.2]} receiveShadow>
        <cylinderGeometry args={[8.5, 8.8, 0.4, 32, 1, false, Math.PI * 0.75, Math.PI * 1.5]} />
        <primitive object={stageMat} attach="material" />
      </mesh>

      {/* Neon edge strip */}
      <mesh position={[0, 0.42, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.2, 5.3, 64, 1, Math.PI * 0.75, Math.PI * 0.5]} />
        <primitive object={edgeMat} attach="material" />
      </mesh>

      {/* Runway */}
      <mesh position={[0, 0.26, 2.8]} receiveShadow>
        <boxGeometry args={[2.8, 0.35, 3.2]} />
        <meshStandardMaterial color="#12151d" roughness={0.18} metalness={0.85} />
      </mesh>

      {/* Center LED screen */}
      <mesh position={[0, 3.2, -4.5]}>
        <primitive object={GEO.plane_lg} attach="geometry" />
        <meshBasicMaterial map={ledTexture} />
      </mesh>
      {/* LED screen housing */}
      <mesh position={[0, 3.2, -4.56]}>
        <boxGeometry args={[9.7, 4.8, 0.09]} />
        <meshStandardMaterial color="#161a22" metalness={0.92} roughness={0.25} />
      </mesh>
      {/* Halo glow behind screen */}
      <mesh position={[0, 3.2, -4.62]}>
        <primitive object={GEO.plane_halo} attach="geometry" />
        <primitive object={haloMat} attach="material" />
      </mesh>

      {/* Screen halo rings */}
      <ScreenHalo color={theme.primary} secondary={theme.secondary} />

      {/* Wing panels */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 5.8, 3.2, -3.4]} rotation={[0, -side * 0.42, 0]}>
          <mesh>
            <primitive object={GEO.plane_sm} attach="geometry" />
            <meshBasicMaterial map={ledTexture} />
          </mesh>
          {/* Wing frame */}
          <mesh position={[0, 0, -0.04]}>
            <boxGeometry args={[3.4, 4.4, 0.06]} />
            <meshStandardMaterial color="#161a22" metalness={0.9} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Podium */}
      <group position={[0, 0.42, 1.4]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.75, 1.1, 0.48]} />
          <primitive object={podiumMat} attach="material" />
        </mesh>
        {/* Lectern glow strip */}
        <mesh position={[0, 0.75, 0.25]}>
          <boxGeometry args={[0.6, 0.02, 0.02]} />
          <meshBasicMaterial color={theme.primary} />
        </mesh>
        {/* Glass top */}
        <mesh position={[0, 1.15, 0]} rotation={[0.25, 0, 0]}>
          <boxGeometry args={[0.88, 0.05, 0.56]} />
          <primitive object={glassMat} attach="material" />
        </mesh>
      </group>

      {/* Reflective stage floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[32, 28]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      {/* Pulsing floor ring */}
      <FloorRing color={theme.primary} />

      {/* Ground glow */}
      <GroundGlow color={theme.glow} />
    </group>
  )
}

/* ─── Instanced Audience Silhouettes ────────────────────────────────────── */
function AudienceCrowd({ color }: { color: string }) {
  const LOW_END = useMemo(() => isLowEnd(), [])
  const count = LOW_END ? 60 : 120

  const matrices = useMemo(() => {
    const mats: THREE.Matrix4[] = []
    const dummy = new THREE.Object3D()
    let idx = 0
    for (let i = -12; i <= 12; i += LOW_END ? 2.2 : 1.6) {
      for (let z = 5.5; z <= 10; z += LOW_END ? 1.8 : 1.4) {
        if (idx >= count) break
        const x = i + Math.sin(z * 4 + i) * 0.4
        const h = 1.1 + Math.sin(i * 5) * 0.2
        dummy.position.set(x, h / 2, z)
        dummy.scale.set(1, h / 1.1, 1)
        dummy.updateMatrix()
        mats.push(dummy.matrix.clone())
        idx++
      }
    }
    return mats
  }, [count, LOW_END])

  const meshRef = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    if (!meshRef.current) return
    matrices.forEach((m, i) => meshRef.current!.setMatrixAt(i, m))
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [matrices])

  // Subtle rim-lit silhouettes
  const bodyMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#040507',
      roughness: 0.95,
      emissive: color,
      emissiveIntensity: 0.04,
    }),
    [color]
  )
  useEffect(() => () => bodyMat.dispose(), [bodyMat])

  return (
    <instancedMesh ref={meshRef} args={[GEO.capsule, bodyMat, count]}>
    </instancedMesh>
  )
}

/* ─── Haze Particles ────────────────────────────────────────────────────── */
function HazeParticles({ color }: { color: string }) {
  const pointsRef = useRef<THREE.Points>(null)
  const LOW_END = useMemo(() => isLowEnd(), [])
  const count = LOW_END ? 80 : 180

  // Build separate arrays to avoid the spd/speeds naming confusion
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18
      pos[i * 3 + 1] = Math.random() * 7
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14
    }
    return pos
  }, [count])

  const speeds = useMemo(() => {
    const spd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      spd[i] = 0.18 + Math.random() * 0.42
    }
    return spd
  }, [count])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i] * delta  // ← fixed: use speeds[] not spd[]
      if (pos[i * 3 + 1] > 7) pos[i * 3 + 1] = 0.1
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  const mat = useMemo(
    () => new THREE.PointsMaterial({
      size: 0.09,
      color,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    [color]
  )
  useEffect(() => () => mat.dispose(), [mat])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <primitive object={mat} attach="material" />
    </points>
  )
}

/* ─── Animated spotlight cones on stage floor ───────────────────────────── */
function FloorSpotlight({ x, color, offset }: { x: number; color: string; offset: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    }),
    [color]
  )
  useEffect(() => () => mat.dispose(), [mat])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime() + offset
    meshRef.current.position.x = x + Math.sin(t * 0.6) * 1.5
    mat.opacity = 0.1 + Math.abs(Math.sin(t * 0.9)) * 0.15
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.06, 0]}>
      <circleGeometry args={[1.4, 24]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

/* ─── Animated Point Lights ─────────────────────────────────────────────── */
function AnimatedLights({ theme }: { theme: typeof THEMES[StageMood] }) {
  const leftLight = useRef<THREE.PointLight>(null)
  const rightLight = useRef<THREE.PointLight>(null)
  const topLight = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (leftLight.current) {
      leftLight.current.intensity = 2.8 + Math.sin(t * 1.2) * 0.8
    }
    if (rightLight.current) {
      rightLight.current.intensity = 2.8 + Math.sin(t * 1.2 + Math.PI) * 0.8
    }
    if (topLight.current) {
      topLight.current.intensity = 3.5 + Math.sin(t * 0.7) * 1.0
    }
  })

  return (
    <>
      <pointLight ref={topLight} position={[0, 7, -2]} intensity={3.5} color={theme.glow} distance={18} />
      <pointLight ref={leftLight} position={[-6.5, 4, 1]} intensity={2.8} color={theme.primary} distance={14} />
      <pointLight ref={rightLight} position={[6.5, 4, 1]} intensity={2.8} color={theme.secondary} distance={14} />
      <pointLight position={[0, 2, 3]} intensity={1.6} color={theme.glow} distance={8} />
      <pointLight position={[0, 1, -3]} intensity={2.0} color={theme.primary} distance={10} />
    </>
  )
}

/* ─── Camera Controller ─────────────────────────────────────────────────── */
function CameraController({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const { camera, gl, size } = useThree()
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = gl.domElement
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      target.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      target.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    const onLeave = () => { target.current = { x: 0, y: 0 } }
    canvas.addEventListener('pointermove', onMove, { passive: true })
    canvas.addEventListener('pointerleave', onLeave)
    return () => {
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [gl])

  useFrame(({ clock }) => {
    current.current.x += (target.current.x - current.current.x) * 0.045
    current.current.y += (target.current.y - current.current.y) * 0.045

    const isPortrait = size.width < size.height
    const baseZ = isPortrait ? 12.4 : 8.6
    const baseY = isPortrait ? 3.4 : 2.9
    const baseLookAtY = isPortrait ? 2.4 : 2.2
    const zoomDist = isPortrait ? 2.6 : 2.4
    const t = clock.getElapsedTime()
    const autoX = isPortrait ? Math.sin(t * 0.5) * 0.35 : 0
    const autoY = isPortrait ? Math.cos(t * 0.4) * 0.15 : 0
    const targetZ = baseZ - scrollProgress * zoomDist
    const targetY = baseY - scrollProgress * 0.9
    const targetLookAtY = baseLookAtY - scrollProgress * 0.5

    camera.position.x += ((current.current.x * 1.9 + autoX) - camera.position.x) * 0.055
    camera.position.y += (targetY + (current.current.y * 0.65 + autoY) - camera.position.y) * 0.055
    camera.position.z += (targetZ - camera.position.z) * 0.055
    camera.lookAt(0, targetLookAtY, 0)
  })

  return null
}

/* ─── Main 3D Stage Canvas ──────────────────────────────────────────────── */
export default function ThreeDStage({
  mood = 'gala',
  scrollProgress = 0,
  paused = false,
}: {
  mood?: StageMood
  scrollProgress?: number
  paused?: boolean
}) {
  if (reducedMotion()) return null
  const theme = THEMES[mood]
  const LOW_END = isLowEnd()

  const dpr: [number, number] = LOW_END ? [1, 1] : [1, 1.5]

  return (
    <div className="absolute inset-0" aria-hidden>
      
      <Canvas
        shadows={!LOW_END}
        dpr={dpr}
        frameloop={paused ? 'never' : 'always'}
        gl={{
          antialias: !LOW_END,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 2.9, 8.6]} fov={50} />
          <CameraController scrollProgress={scrollProgress} />

          {/* Base ambient — richer to avoid flat look */}
          <ambientLight intensity={0.65} color={theme.ambient} />

          {/* Key directional light */}
          <directionalLight
            position={[0, 10, 5]}
            intensity={2.2}
            color="#ffffff"
            castShadow={!LOW_END}
            shadow-mapSize={[512, 512]}
          />

          {/* Animated colored point lights */}
          <AnimatedLights theme={theme} />

          {/* Back fill light */}
          <directionalLight position={[0, 3, -8]} intensity={1.0} color={theme.secondary} />

          {/* Stage structures */}
          <TrussSystem color={theme.primary} />
          <ArenaStage mood={mood} />
          <AudienceCrowd color={theme.primary} />
          <HazeParticles color={theme.glow} />

          {/* Floor spotlights */}
          <FloorSpotlight x={-3} color={theme.primary} offset={0} />
          <FloorSpotlight x={0} color={theme.glow} offset={1.5} />
          <FloorSpotlight x={3} color={theme.secondary} offset={3} />

          {/* Beam array — fewer on low-end */}
          <VolumetricBeam anchor={[-5.5, 6.0, 0]} color={theme.primary} offset={0} speed={0.9} />
          <VolumetricBeam anchor={[-1.1, 6.0, 0]} color={theme.glow} offset={2.4} speed={0.8} />
          <VolumetricBeam anchor={[1.1, 6.0, 0]} color={theme.glow} offset={3.6} speed={0.8} />
          <VolumetricBeam anchor={[5.5, 6.0, 0]} color={theme.primary} offset={5.9} speed={0.9} />
          {!LOW_END && (
            <>
              <VolumetricBeam anchor={[-3.2, 6.0, 0]} color={theme.secondary} offset={1.2} speed={1.1} />
              <VolumetricBeam anchor={[3.2, 6.0, 0]} color={theme.secondary} offset={4.8} speed={1.1} />
              <VolumetricBeam anchor={[-7.0, 6.0, 0.5]} color={theme.glow} offset={0.8} speed={0.7} angleRange={0.4} />
              <VolumetricBeam anchor={[7.0, 6.0, 0.5]} color={theme.glow} offset={4.2} speed={0.7} angleRange={0.4} />
            </>
          )}
        </Suspense>
      </Canvas>
      
    </div>
  )
}
