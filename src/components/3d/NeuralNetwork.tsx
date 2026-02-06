'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { useDevicePerformance } from '@/hooks'
import { usePulseSystem } from '@/hooks/use-pulse-system'
import {
  generateNodePositions,
  generateConnections,
  createNodeMaterial,
  createLineMaterial,
} from './neural-network-geometry-and-material-factories'

interface NeuralNetworkProps {
  nodeCount?: number
  connectionCount?: number
  color?: string
}

export default function NeuralNetwork({
  nodeCount = 400,
  connectionCount = 600,
  color = '#ADFF2F',
}: NeuralNetworkProps) {
  const { isMobile } = useDevicePerformance()
  const groupRef = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()
  const { addPulse, getUniforms } = usePulseSystem()

  const actualNodes = isMobile ? Math.floor(nodeCount * 0.4) : nodeCount
  const actualConns = isMobile ? Math.floor(connectionCount * 0.3) : connectionCount

  const { positions, originalPositions } = useMemo(
    () => generateNodePositions(actualNodes),
    [actualNodes]
  )

  const linePositions = useMemo(
    () => generateConnections(positions, actualNodes, actualConns),
    [positions, actualNodes, actualConns]
  )

  const nodeMaterial = useMemo(() => createNodeMaterial(color), [color])
  const lineMaterial = useMemo(() => createLineMaterial(color), [color])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (event.point) {
      addPulse(event.point)
    }
  }

  useFrame((state) => {
    if (!groupRef.current || !pointsRef.current) return

    const time = state.clock.elapsedTime
    groupRef.current.rotation.y += 0.0008

    // Mouse attraction: nodes drift toward cursor position
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const mouseX = mouseRef.current.x * 2
    const mouseY = mouseRef.current.y * 2

    for (let i = 0; i < actualNodes; i++) {
      const ox = originalPositions[i * 3]
      const oy = originalPositions[i * 3 + 1]
      const oz = originalPositions[i * 3 + 2]
      const cx = posAttr.getX(i)
      const cy = posAttr.getY(i)
      const cz = posAttr.getZ(i)

      let tx = ox
      let ty = oy
      let tz = oz
      const dx = mouseX - ox
      const dy = mouseY - oy
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 1.5) {
        const f = (1 - dist / 1.5) * 0.4
        tx += dx * f
        ty += dy * f
        tz += f * 0.3
      }

      posAttr.setXYZ(i, cx + (tx - cx) * 0.08, cy + (ty - cy) * 0.08, cz + (tz - cz) * 0.08)
    }
    posAttr.needsUpdate = true

    // Sync pulse uniforms across both materials
    const now = performance.now() / 1000
    const { origins, times } = getUniforms(now)

    nodeMaterial.uniforms.uTime.value = time
    nodeMaterial.uniforms.uPulseOrigins.value = origins
    nodeMaterial.uniforms.uPulseTimes.value = times

    lineMaterial.uniforms.uPulseOrigins.value = origins
    lineMaterial.uniforms.uPulseTimes.value = times

    if (linesRef.current) {
      const lineAttr = linesRef.current.geometry.attributes.position as THREE.BufferAttribute
      lineAttr.needsUpdate = true
    }
  })

  const scale = Math.min(viewport.width, viewport.height) * 0.4

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} onClick={handleClick}>
      <points ref={pointsRef} material={nodeMaterial}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
      </points>

      <lineSegments ref={linesRef} material={lineMaterial}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
      </lineSegments>

      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>

      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} color={color} intensity={0.5} />
    </group>
  )
}
