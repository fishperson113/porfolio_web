'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePerformanceDegradation } from '@/hooks/use-performance-degradation'

export default function FloatingParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { perfLevel } = usePerformanceDegradation()
  const count = perfLevel.particleCount

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      pos: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10] as [number, number, number],
      vel: [(Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.005] as [number, number, number],
      phase: Math.random() * Math.PI * 2,
    }))
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      p.pos[0] += p.vel[0]
      p.pos[1] += p.vel[1]
      p.pos[2] += p.vel[2]

      // Wrap around
      if (Math.abs(p.pos[0]) > 10) p.pos[0] *= -0.9
      if (Math.abs(p.pos[1]) > 10) p.pos[1] *= -0.9
      if (Math.abs(p.pos[2]) > 5) p.pos[2] *= -0.9

      dummy.position.set(p.pos[0], p.pos[1], p.pos[2])
      const pulse = 1 + 0.2 * Math.sin(t * 2 + p.phase)
      dummy.scale.setScalar(pulse * 0.02)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#FAFAFA" transparent opacity={0.12} />
    </instancedMesh>
  )
}
