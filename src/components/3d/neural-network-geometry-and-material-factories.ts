import * as THREE from 'three'
import {
  nodeVertexShader,
  nodeFragmentShader,
  lineVertexShader,
  lineFragmentShader,
} from './shaders/neural-network-shaders'

// --- Geometry Generation ---

export function generateNodePositions(nodeCount: number) {
  const positions = new Float32Array(nodeCount * 3)
  const originalPositions = new Float32Array(nodeCount * 3)

  for (let i = 0; i < nodeCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 1.5 + Math.random() * 0.5
    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta)
    const z = r * Math.cos(phi)

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
    originalPositions[i * 3] = x
    originalPositions[i * 3 + 1] = y
    originalPositions[i * 3 + 2] = z
  }

  return { positions, originalPositions }
}

export function generateConnections(
  positions: Float32Array,
  nodeCount: number,
  connectionCount: number
) {
  const linePositions = new Float32Array(connectionCount * 6)
  const conns: [number, number][] = []

  for (let i = 0; i < nodeCount && conns.length < connectionCount; i++) {
    for (let j = i + 1; j < nodeCount && conns.length < connectionCount; j++) {
      const dx = positions[i * 3] - positions[j * 3]
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 0.8 && Math.random() > 0.5) {
        conns.push([i, j])
      }
    }
  }

  conns.forEach(([a, b], idx) => {
    linePositions[idx * 6] = positions[a * 3]
    linePositions[idx * 6 + 1] = positions[a * 3 + 1]
    linePositions[idx * 6 + 2] = positions[a * 3 + 2]
    linePositions[idx * 6 + 3] = positions[b * 3]
    linePositions[idx * 6 + 4] = positions[b * 3 + 1]
    linePositions[idx * 6 + 5] = positions[b * 3 + 2]
  })

  return linePositions
}

// --- Shader Material Factories ---

const EMPTY_ORIGINS = Array.from({ length: 5 }, () => new THREE.Vector3())

export function createNodeMaterial(color: string) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uGlowColor: { value: new THREE.Color('#FFFFFF') },
      uPulseOrigins: { value: EMPTY_ORIGINS.map((v) => v.clone()) },
      uPulseTimes: { value: new Float32Array(5) },
    },
    vertexShader: nodeVertexShader,
    fragmentShader: nodeFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}

export function createLineMaterial(color: string) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uGlowColor: { value: new THREE.Color('#FFFFFF') },
      uPulseOrigins: { value: EMPTY_ORIGINS.map((v) => v.clone()) },
      uPulseTimes: { value: new Float32Array(5) },
    },
    vertexShader: lineVertexShader,
    fragmentShader: lineFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}
