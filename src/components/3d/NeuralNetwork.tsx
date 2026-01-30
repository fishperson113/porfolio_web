'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface NeuralNetworkProps {
  nodeCount?: number
  connectionCount?: number
  color?: string
  responsive?: boolean
}

// Detect if device is low-performance (mobile or low hardware)
function useDevicePerformance() {
  const [isLowPerf, setIsLowPerf] = useState(false)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const hasLowCores = navigator.hardwareConcurrency < 4
      setIsLowPerf(isMobile || hasLowCores)
    }
  }, [])
  
  return isLowPerf
}

export default function NeuralNetwork({
  nodeCount = 400,
  connectionCount = 600,
  color = '#ADFF2F',
  responsive = true
}: NeuralNetworkProps) {
  const isLowPerf = useDevicePerformance()
  const groupRef = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()
  
  // Reduce complexity on mobile
  const actualNodeCount = responsive && isLowPerf ? Math.floor(nodeCount * 0.4) : nodeCount
  const actualConnectionCount = responsive && isLowPerf ? Math.floor(connectionCount * 0.3) : connectionCount
  
  // Generate node positions in a spherical distribution
  const { positions, originalPositions } = useMemo(() => {
    const positions = new Float32Array(actualNodeCount * 3)
    const originalPositions = new Float32Array(actualNodeCount * 3)
    
    for (let i = 0; i < actualNodeCount; i++) {
      // Spherical distribution with some randomness
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 1.5 + Math.random() * 0.5
      
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)
      
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      
      originalPositions[i * 3] = x
      originalPositions[i * 3 + 1] = y
      originalPositions[i * 3 + 2] = z
    }
    
    return { positions, originalPositions }
  }, [actualNodeCount])
  
  // Generate connections between nearby nodes
  const linePositions = useMemo(() => {
    const linePositions = new Float32Array(actualConnectionCount * 6)
    const connections: [number, number][] = []
    
    // Create connections between nearby nodes
    for (let i = 0; i < actualNodeCount && connections.length < actualConnectionCount; i++) {
      for (let j = i + 1; j < actualNodeCount && connections.length < actualConnectionCount; j++) {
        const dx = positions[i * 3] - positions[j * 3]
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
        
        // Connect nodes that are close enough
        if (distance < 0.8 && Math.random() > 0.5) {
          connections.push([i, j])
        }
      }
    }
    
    connections.forEach(([a, b], idx) => {
      linePositions[idx * 6] = positions[a * 3]
      linePositions[idx * 6 + 1] = positions[a * 3 + 1]
      linePositions[idx * 6 + 2] = positions[a * 3 + 2]
      linePositions[idx * 6 + 3] = positions[b * 3]
      linePositions[idx * 6 + 4] = positions[b * 3 + 1]
      linePositions[idx * 6 + 5] = positions[b * 3 + 2]
    })
    
    return linePositions
  }, [positions, actualNodeCount, actualConnectionCount])
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  // Animation loop
  useFrame((state, delta) => {
    if (!groupRef.current || !pointsRef.current) return
    
    const time = state.clock.elapsedTime
    
    // Rotate the entire group slowly
    groupRef.current.rotation.y += delta * 0.05
    
    // Animate node positions with mouse attraction effect
    const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    
    // Convert mouse position to 3D world coordinates
    const mouseX = mouseRef.current.x * 2
    const mouseY = mouseRef.current.y * 2
    
    // Attraction parameters
    const attractionRadius = 1.5  // How far the effect reaches
    const attractionStrength = 0.4 // How strong the pull is
    const returnSpeed = 0.08 // How fast nodes return to original position
    
    for (let i = 0; i < actualNodeCount; i++) {
      const ox = originalPositions[i * 3]
      const oy = originalPositions[i * 3 + 1]
      const oz = originalPositions[i * 3 + 2]
      
      // Current position
      const cx = positionAttr.getX(i)
      const cy = positionAttr.getY(i)
      const cz = positionAttr.getZ(i)
      
      // Calculate distance from mouse in 2D (projected)
      const dx = mouseX - ox
      const dy = mouseY - oy
      const distanceToMouse = Math.sqrt(dx * dx + dy * dy)
      
      // Target position (with attraction effect)
      let targetX = ox
      let targetY = oy
      let targetZ = oz
      
      if (distanceToMouse < attractionRadius) {
        // Nodes within radius get attracted towards mouse
        const attractionFactor = (1 - distanceToMouse / attractionRadius) * attractionStrength
        targetX = ox + dx * attractionFactor
        targetY = oy + dy * attractionFactor
        // Z-axis: nodes push forward (towards camera) when attracted
        targetZ = oz + attractionFactor * 0.3
      }
      
      // Add subtle breathing animation
      const breathe = Math.sin(time + i * 0.1) * 0.015
      targetX += breathe
      targetY += Math.sin(time * 0.5 + i * 0.2) * 0.015
      
      // Smoothly interpolate to target position
      const newX = cx + (targetX - cx) * returnSpeed
      const newY = cy + (targetY - cy) * returnSpeed
      const newZ = cz + (targetZ - cz) * returnSpeed
      
      positionAttr.setXYZ(i, newX, newY, newZ)
    }
    
    positionAttr.needsUpdate = true
    
    // Also update line positions to follow nodes
    if (linesRef.current) {
      const lineAttr = linesRef.current.geometry.attributes.position as THREE.BufferAttribute
      lineAttr.needsUpdate = true
    }
  })
  
  const scale = Math.min(viewport.width, viewport.height) * 0.4
  
  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isLowPerf ? 0.04 : 0.03}
          color={color}
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Connections */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={isLowPerf ? 0.15 : 0.2}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      
      {/* Central glow sphere */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Ambient light for glow effect */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} color={color} intensity={0.5} />
    </group>
  )
}
