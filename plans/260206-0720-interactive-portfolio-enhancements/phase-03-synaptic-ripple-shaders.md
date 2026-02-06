# Phase 3: Synaptic Ripple Shaders

## Context Links

- **Plan Overview:** [plan.md](./plan.md)
- **Phase 1 (Dependency):** [phase-01-foundation-and-infrastructure.md](./phase-01-foundation-and-infrastructure.md)
- **Research - 3D/Shaders:** [research/researcher-01-3d-shaders-report.md](./research/researcher-01-3d-shaders-report.md)
- **Current NeuralNetwork:** `c:/workspace/porfolio_web/src/components/3d/NeuralNetwork.tsx`

## Overview

**Date:** 2026-02-06
**Description:** Replace existing materials with custom GLSL shaders for click-triggered shockwave pulses and hover node charge-up effects
**Priority:** P1
**Status:** Pending
**Effort:** 10-12 hours

## Key Insights

From research report:
- Shockwave uses sinc function `sin(dist * 10.0 - time * 5.0) * exp(-dist * decay)` for radial propagation
- Fragment shader glow via `smoothstep(0.8, 1.0, wave)` for pulse edge highlighting
- Max 5 simultaneous pulses to maintain performance (<2ms overhead per pulse)
- Vertex displacement on normal: `position + normal * wave * amplitude`
- LFO (Low-Frequency Oscillator) for breathing animation without keyframes
- ShaderMaterial replaces PointsMaterial (nodes) and LineBasicMaterial (connections)

## Requirements

### Functional Requirements

1. Custom GLSL vertex/fragment shaders for nodes and connections
2. Click event triggers shockwave pulse from click position (3D raycasting)
3. Up to 5 simultaneous active pulses with decay over 2-3 seconds
4. Hover detection on nodes triggers charge-up glow effect
5. Breathing animation continues (existing sine wave behavior)
6. Pulse system manages pulse lifecycle (add, update, remove expired)
7. Shader uniforms: pulseOrigins[], pulseTimes[], pulseDecay, time, mouse position

### Non-Functional Requirements

- Performance: <2ms per frame with 5 active pulses
- Shader compilation cached (useMemo for ShaderMaterial)
- Graceful degradation on WebGL1 devices (fallback to simple materials)
- Mobile: Reduce pulse count to 3 max, lower decay for faster completion
- TypeScript strict mode for shader uniform management
- No console shader compilation warnings

## Architecture

### Component Structure

```
NeuralNetwork (modified)
├── Nodes (Points with ShaderMaterial)
│   ├── vertexShader: neural-network-vertex.glsl
│   └── fragmentShader: neural-network-fragment.glsl
├── Connections (Line with ShaderMaterial)
│   └── fragmentShader: neural-network-line-fragment.glsl
└── PulseManager (state)
    ├── activePulses: Pulse[]
    ├── addPulse(origin: Vector3)
    └── updatePulses(deltaTime: number)
```

### Data Flow

```
Click Event
    ↓
Raycaster (find 3D position)
    ↓
addPulse(clickPos)
    ↓
activePulses array (max 5)
    ↓
useFrame → update uniforms
    ↓
Shader vertex displacement
    ↓
Shader fragment glow

Hover Node
    ↓
Set hoverNodeIndex state
    ↓
Shader uniform: uHoverNode
    ↓
Fragment shader charge-up glow
```

### Shader Uniform Interface

```typescript
interface NodeShaderUniforms {
  uTime: { value: number }
  uMousePos: { value: Vector3 }
  uHoverNode: { value: number } // -1 if none
  uPulseOrigins: { value: Vector3[] } // max 5
  uPulseTimes: { value: number[] }    // elapsed time per pulse
  uPulseDecay: { value: number }      // 0.5-1.0 (higher = faster decay)
  uColor: { value: Color }
  uGlowColor: { value: Color }
}
```

## Related Code Files

### Files to Create

1. `src/components/3d/shaders/neural-network-vertex.glsl` (50-70 lines)
2. `src/components/3d/shaders/neural-network-fragment.glsl` (40-50 lines)
3. `src/components/3d/shaders/neural-network-line-fragment.glsl` (30-40 lines)
4. `src/hooks/use-pulse-system.ts` (80-100 LOC)

### Files to Modify

1. `src/components/3d/NeuralNetwork.tsx` - Replace materials with ShaderMaterial, add click handling

## Implementation Steps

### Step 1: Create Vertex Shader for Nodes (60 min)

Create `src/components/3d/shaders/neural-network-vertex.glsl`:

```glsl
uniform float uTime;
uniform vec3 uMousePos;
uniform int uHoverNode;
uniform vec3 uPulseOrigins[5];
uniform float uPulseTimes[5];
uniform float uPulseDecay;

attribute float nodeIndex;
attribute vec3 basePosition;

varying float vWave;
varying float vHover;
varying float vDistance;

void main() {
  vec3 pos = basePosition;

  // Breathing animation (existing behavior)
  float breathe = sin(uTime * 0.5 + pos.x * 2.0 + pos.y * 2.0) * 0.05;
  pos += normal * breathe;

  // Mouse attraction (existing behavior)
  vec3 toMouse = uMousePos - pos;
  float distToMouse = length(toMouse);
  if (distToMouse < 1.5) {
    float force = (1.5 - distToMouse) / 1.5;
    pos += normalize(toMouse) * force * 0.4;
  }

  // Pulse shockwave displacement
  float totalWave = 0.0;
  for (int i = 0; i < 5; i++) {
    if (uPulseTimes[i] > 0.0) {
      vec3 toPulse = pos - uPulseOrigins[i];
      float dist = length(toPulse);
      float wave = sin(dist * 10.0 - uPulseTimes[i] * 5.0) * exp(-dist * uPulseDecay);
      totalWave += wave;

      // Vertex displacement along normal
      pos += normal * wave * 0.3;
    }
  }
  vWave = totalWave;

  // Hover charge-up (detect if this node is hovered)
  vHover = (int(nodeIndex) == uHoverNode) ? 1.0 : 0.0;

  // Distance from origin (for falloff effects)
  vDistance = length(pos);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 4.0 * (1.0 + vHover * 0.5); // Larger when hovered
}
```

### Step 2: Create Fragment Shader for Nodes (45 min)

Create `src/components/3d/shaders/neural-network-fragment.glsl`:

```glsl
uniform vec3 uColor;
uniform vec3 uGlowColor;
uniform float uTime;

varying float vWave;
varying float vHover;
varying float vDistance;

void main() {
  // Circular point shape
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  float r = dot(cxy, cxy);
  if (r > 1.0) discard;

  // Base color
  vec3 color = uColor;

  // Pulse glow (edge highlighting)
  float pulseGlow = smoothstep(0.6, 1.0, abs(vWave));
  color = mix(color, uGlowColor, pulseGlow * 0.8);

  // Hover charge-up glow
  float hoverGlow = vHover * (0.5 + 0.5 * sin(uTime * 3.0)); // Pulsing effect
  color = mix(color, uGlowColor, hoverGlow);

  // Fade with distance (subtle vignette)
  float distanceFade = 1.0 - smoothstep(5.0, 10.0, vDistance);

  // Final alpha (soft edges)
  float alpha = (1.0 - r) * distanceFade;

  gl_FragColor = vec4(color, alpha);
}
```

### Step 3: Create Fragment Shader for Connections (30 min)

Create `src/components/3d/shaders/neural-network-line-fragment.glsl`:

```glsl
uniform vec3 uColor;
uniform vec3 uGlowColor;
uniform vec3 uPulseOrigins[5];
uniform float uPulseTimes[5];
uniform float uPulseDecay;

varying vec3 vPosition;

void main() {
  vec3 color = uColor;
  float totalGlow = 0.0;

  // Pulse propagation along line
  for (int i = 0; i < 5; i++) {
    if (uPulseTimes[i] > 0.0) {
      float dist = length(vPosition - uPulseOrigins[i]);
      float wave = sin(dist * 10.0 - uPulseTimes[i] * 5.0) * exp(-dist * uPulseDecay);
      totalGlow += smoothstep(0.6, 1.0, abs(wave));
    }
  }

  // Apply glow to line color
  color = mix(color, uGlowColor, totalGlow * 0.6);

  gl_FragColor = vec4(color, 0.15 + totalGlow * 0.3);
}
```

### Step 4: Create usePulseSystem Hook (90 min)

Create `src/hooks/use-pulse-system.ts`:

```typescript
'use client'

import { useState, useCallback } from 'react'
import { Vector3 } from 'three'
import { useDevicePerformance } from './use-device-performance'

interface Pulse {
  id: number
  origin: Vector3
  startTime: number
  duration: number
}

export function usePulseSystem() {
  const { isMobile } = useDevicePerformance()
  const maxPulses = isMobile ? 3 : 5
  const pulseDuration = isMobile ? 2000 : 3000 // milliseconds

  const [pulses, setPulses] = useState<Pulse[]>([])

  const addPulse = useCallback((origin: Vector3) => {
    const newPulse: Pulse = {
      id: Date.now(),
      origin: origin.clone(),
      startTime: Date.now(),
      duration: pulseDuration
    }

    setPulses((prev) => {
      // Remove oldest if at max capacity
      const updated = prev.length >= maxPulses ? prev.slice(1) : prev
      return [...updated, newPulse]
    })
  }, [maxPulses, pulseDuration])

  const updatePulses = useCallback((currentTime: number) => {
    setPulses((prev) =>
      prev.filter((pulse) => currentTime - pulse.startTime < pulse.duration)
    )
  }, [])

  // Convert to shader uniform format
  const getShaderUniforms = useCallback(() => {
    const origins: Vector3[] = []
    const times: number[] = []

    for (let i = 0; i < maxPulses; i++) {
      if (i < pulses.length) {
        origins.push(pulses[i].origin)
        times.push((Date.now() - pulses[i].startTime) / 1000) // Convert to seconds
      } else {
        origins.push(new Vector3(0, 0, 0))
        times.push(0)
      }
    }

    return { origins, times }
  }, [pulses, maxPulses])

  return {
    addPulse,
    updatePulses,
    getShaderUniforms,
    activePulseCount: pulses.length
  }
}
```

### Step 5: Modify NeuralNetwork Component (120 min)

Modify `src/components/3d/NeuralNetwork.tsx`:

Key changes:
1. Import shader files as strings (use webpack raw-loader or inline)
2. Replace `PointsMaterial` with `ShaderMaterial` for nodes
3. Replace `LineBasicMaterial` with `ShaderMaterial` for connections
4. Add click handling with Raycaster
5. Add hover detection for nodes
6. Integrate usePulseSystem hook
7. Update uniforms in useFrame

```typescript
// Add imports
import { usePulseSystem } from '@/hooks/use-pulse-system'
import { Raycaster, Vector2, ShaderMaterial, Color } from 'three'

// Import shaders (inline for simplicity)
const nodeVertexShader = `/* paste vertex shader here */`
const nodeFragmentShader = `/* paste fragment shader here */`
const lineFragmentShader = `/* paste line fragment shader here */`

export default function NeuralNetwork() {
  // Existing hooks...
  const { addPulse, updatePulses, getShaderUniforms } = usePulseSystem()
  const [hoverNodeIndex, setHoverNodeIndex] = useState(-1)

  // Create shader materials
  const nodeShaderMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMousePos: { value: new Vector3() },
        uHoverNode: { value: -1 },
        uPulseOrigins: { value: [] },
        uPulseTimes: { value: [] },
        uPulseDecay: { value: 0.8 },
        uColor: { value: new Color('#FAFAFA') },
        uGlowColor: { value: new Color('#ADFF2F') }
      },
      vertexShader: nodeVertexShader,
      fragmentShader: nodeFragmentShader,
      transparent: true,
      depthWrite: false
    })
  }, [])

  // Click handler
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    const raycaster = new Raycaster()
    const mouse = new Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    )
    raycaster.setFromCamera(mouse, event.camera)

    // Intersect with a plane at z=0 to get 3D click position
    const plane = new Plane(new Vector3(0, 0, 1), 0)
    const clickPos = new Vector3()
    raycaster.ray.intersectPlane(plane, clickPos)

    addPulse(clickPos)
  }

  // Update uniforms in useFrame
  useFrame((state, delta) => {
    updatePulses(Date.now())

    const { origins, times } = getShaderUniforms()
    nodeShaderMaterial.uniforms.uTime.value = state.clock.elapsedTime
    nodeShaderMaterial.uniforms.uPulseOrigins.value = origins
    nodeShaderMaterial.uniforms.uPulseTimes.value = times
    nodeShaderMaterial.uniforms.uHoverNode.value = hoverNodeIndex
    // ... existing mouse position update
  })

  return (
    <group onClick={handleClick}>
      <points geometry={nodeGeometry} material={nodeShaderMaterial} />
      <lineSegments geometry={connectionGeometry} material={lineShaderMaterial} />
    </group>
  )
}
```

### Step 6: Add Node Attributes for Shader (30 min)

In NeuralNetwork.tsx, add custom attributes to geometry:

```typescript
// After creating nodeGeometry
const nodeIndices = new Float32Array(nodeCount)
const basePositions = new Float32Array(nodeCount * 3)

for (let i = 0; i < nodeCount; i++) {
  nodeIndices[i] = i
  basePositions[i * 3] = positions[i * 3]
  basePositions[i * 3 + 1] = positions[i * 3 + 1]
  basePositions[i * 3 + 2] = positions[i * 3 + 2]
}

nodeGeometry.setAttribute('nodeIndex', new BufferAttribute(nodeIndices, 1))
nodeGeometry.setAttribute('basePosition', new BufferAttribute(basePositions, 3))
```

### Step 7: Test Shader Effects (60 min)

Test checklist:
- [ ] Click canvas triggers pulse shockwave
- [ ] Pulse propagates outward radially
- [ ] Up to 5 pulses active simultaneously
- [ ] Pulses decay and disappear after 2-3 seconds
- [ ] Nodes displace along normals during pulse
- [ ] Glow effect visible on pulse wavefront
- [ ] Mobile limits to 3 pulses max
- [ ] No shader compilation errors in console
- [ ] Performance: <2ms per frame with 5 pulses

## Todo List

- [ ] Create neural-network-vertex.glsl shader
- [ ] Create neural-network-fragment.glsl shader
- [ ] Create neural-network-line-fragment.glsl shader
- [ ] Create use-pulse-system.ts hook
- [ ] Modify NeuralNetwork.tsx with ShaderMaterial
- [ ] Add click handler with Raycaster
- [ ] Add node hover detection
- [ ] Add custom geometry attributes (nodeIndex, basePosition)
- [ ] Test click-triggered pulses
- [ ] Test pulse propagation visuals
- [ ] Test max pulse limit (5 desktop, 3 mobile)
- [ ] Test shader performance (<2ms overhead)
- [ ] Verify no console warnings
- [ ] Commit changes

## Success Criteria

- [ ] Click triggers visible shockwave pulse from click position
- [ ] Pulse propagates radially with sinc wave pattern
- [ ] Glow effect visible on wavefront edges
- [ ] Max 5 simultaneous pulses (3 on mobile)
- [ ] Pulses auto-expire after duration
- [ ] Node hover triggers charge-up glow
- [ ] Performance: <2ms per frame with 5 active pulses (Chrome DevTools)
- [ ] No shader compilation errors
- [ ] Graceful WebGL1 fallback (test with flags)
- [ ] Bundle size increase ≤20KB gzipped

## Risk Assessment

**Risk:** Shader compilation fails on older GPUs
**Mitigation:** Test on WebGL1 devices, provide fallback to original PointsMaterial

**Risk:** Raycaster click detection inaccurate (doesn't match visual click)
**Mitigation:** Use plane intersection at z=0 for 2D-like interaction, tune plane position

**Risk:** Too many pulses cause performance degradation
**Mitigation:** Hard limit to 5 pulses, mobile limit to 3, pulse duration kept short (2-3s)

**Risk:** Shader uniforms array syntax incompatible with WebGL1
**Mitigation:** Test array uniforms, consider fallback to single pulse on WebGL1

## Security Considerations

- GLSL shaders run in GPU sandbox (no security risk)
- No external shader loading (inline strings only)
- No user-controlled shader code injection

## Next Steps

**Dependencies:** Phase 1 (useDevicePerformance for mobile detection)
**Unblocks:** Phase 4 (Post-processing needs shader-based materials for selective bloom)
**Follow-up:** In Phase 4, configure SelectiveBloom to target nodes/connections by material
