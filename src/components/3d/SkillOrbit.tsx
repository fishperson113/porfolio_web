'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import * as THREE from 'three'
import { skillCategories } from '@/data/skills'

interface SkillOrbitProps {
  autoRotate?: boolean
  rotationSpeed?: number
}

interface OrbitRingProps {
  radius: number
  color: string
  items: { name: string; level: number }[]
  rotationSpeed: number
  rotationOffset: number
}

function OrbitRing({ radius, color, items, rotationSpeed, rotationOffset }: OrbitRingProps) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed + rotationOffset
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* Orbit ring line */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.01, radius + 0.01, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Skill nodes on the orbit */}
      {items.map((skill, idx) => {
        const angle = (idx / items.length) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        return (
          <Float key={skill.name} speed={2} floatIntensity={0.3}>
            <group position={[x, 0, z]}>
              {/* Node sphere */}
              <mesh>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial 
                  color={color} 
                  transparent 
                  opacity={0.8 + (skill.level / 500)}
                />
              </mesh>
              
              {/* Skill label */}
              <Text
                position={[0, 0.15, 0]}
                fontSize={0.08}
                color="#FAFAFA"
                anchorX="center"
                anchorY="bottom"
                outlineWidth={0.01}
                outlineColor="#0A0A0F"
              >
                {skill.name}
              </Text>
            </group>
          </Float>
        )
      })}
    </group>
  )
}

export default function SkillOrbit({ 
  autoRotate = true, 
  rotationSpeed = 0.1 
}: SkillOrbitProps) {
  const groupRef = useRef<THREE.Group>(null)
  
  // Map skill categories to orbit rings
  const orbits = useMemo(() => {
    return skillCategories.map((category, idx) => ({
      id: category.id,
      name: category.name,
      color: category.color,
      radius: 0.8 + idx * 0.5,
      items: category.skills.slice(0, 5).map(s => ({ name: s.name, level: s.level })),
      speed: (0.15 - idx * 0.02) * (idx % 2 === 0 ? 1 : -1),
      offset: (idx * Math.PI) / skillCategories.length
    }))
  }, [])
  
  return (
    <group ref={groupRef} scale={[1.5, 1.5, 1.5]}>
      {/* Center - AI Engineering label */}
      <Float speed={1} floatIntensity={0.5}>
        <mesh>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshBasicMaterial color="#ADFF2F" transparent opacity={0.3} />
        </mesh>
        <Text
          position={[0, 0.35, 0]}
          fontSize={0.12}
          color="#ADFF2F"
          anchorX="center"
          fontWeight={700}
        >
          AI Core
        </Text>
      </Float>
      
      {/* Orbit rings */}
      {orbits.map((orbit) => (
        <OrbitRing
          key={orbit.id}
          radius={orbit.radius}
          color={orbit.color}
          items={orbit.items}
          rotationSpeed={autoRotate ? orbit.speed : 0}
          rotationOffset={orbit.offset}
        />
      ))}
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 0]} color="#ADFF2F" intensity={0.3} />
    </group>
  )
}
