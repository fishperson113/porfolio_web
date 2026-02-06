# 3D & Shader Techniques Research Report
**Date:** 2026-02-06
**Topic:** Interactive Portfolio Enhancement Techniques
**Max Lines:** 150

---

## 1. Three.js Post-Processing with R3F (2025-2026)

### Setup & Configuration
```jsx
import { Bloom, DepthOfField, EffectComposer, Vignette } from '@react-three/postprocessing'

<Canvas>
  <EffectComposer>
    <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
    <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
    <Vignette offset={0.1} darkness={1.1} />
  </EffectComposer>
</Canvas>
```

**Version:** `@react-three/postprocessing@3.0` (recommended 2026)
**Key Practice:** ToneMapping must be kept at pipeline end; add SMAA/FXAA as final antialiasing pass.

### Selective Bloom Implementation
Use `SelectiveBloom` component with `selection` array for specific objects. Alternative approach: UnrealBloomPass with material-level control (more reliable with Three.js r135+).

**Performance Impact:** Bloom adds ~2-4ms per frame on mid-range GPUs; DepthOfField ~1-3ms. Combined post-processing stack: 5-8ms overhead.

**Mobile Fallback:** Use `PerformanceMonitor` from Drei to detect FPS drops and disable effects progressively (DepthOfField → Bloom → Vignette only).

---

## 2. GLSL Shader Ripple/Pulse Techniques

### Shockwave Propagation Pattern
```glsl
// Vertex Shader - Displacement
uniform vec3 uPulseOrigin;
uniform float uPulseTime;
uniform float uPulseDecay;

float dist = distance(position, uPulseOrigin);
float wave = sin(dist * 10.0 - uPulseTime * 5.0) * exp(-dist * uPulseDecay);
vec3 displaced = position + normal * wave * 0.5;
```

### Fragment Shader Glow
```glsl
float pulse = smoothstep(0.8, 1.0, wave);
vec3 glowColor = mix(baseColor, emissiveColor, pulse);
```

**Technique:** Use sinc function (sin cardinal) for ripple waves. LFO (Low-Frequency Oscillator) drives `dispScale` uniform for natural pulsing without keyframes.

**Node Charge-Up:** Combine vertex displacement with fragment glow; use `exp(-dist * decay)` for radial falloff from pulse origin.

---

## 3. Interactive 3D Skill Orbit Patterns

### Smooth Hover Easing
```jsx
// Use damping in OrbitControls or GSAP for smooth transitions
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Alternative: camera-controls library for advanced interpolation
cameraControls.setLookAt(x, y, z, targetX, targetY, targetZ, true); // smooth=true
```

**Pause Technique:** Don't stop rotation abruptly—reduce `rotationSpeed` to 0 using easing (quadratic or cubic ease-out). GSAP library recommended for fluid orbit animation control.

**Expandable Detail:** On hover, scale object with `gsap.to(mesh.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.3, ease: 'power2.out' })` and trigger info panel with CSS transitions.

**Category Highlighting:** Modify `emissive` and `emissiveIntensity` properties on materials; combine with SelectiveBloom for glow effect on hovered category.

---

## 4. Subtle Particle Environment Effects

### GPU Instancing Pattern
```jsx
// 10k+ particles with InstancedMesh
<instancedMesh ref={particlesRef} args={[geometry, material, 10000]}>
  <sphereGeometry args={[0.02, 8, 8]} />
  <meshBasicMaterial />
</instancedMesh>
```

**Performance:** WebGPU compute shaders enable 100k particles at <2ms/frame (vs 50k at 30ms on CPU). WebGL fallback with instancing handles 10-20k particles efficiently.

**Mouse Interaction:** Use raycaster with throttled checks (every 3-5 frames); apply repulsion force inversely proportional to distance. Calculate drift in vertex shader for GPU efficiency.

**Visual Effect:** Floating dust/sparks with low opacity (0.1-0.3), subtle noise-based movement, and occasional brightness pulses.

---

## 5. Performance Budgeting

### Frame Budget Breakdown (16ms @ 60fps)
- **JavaScript/React:** 3-5ms
- **Three.js Scene Update:** 2-4ms
- **Post-Processing:** 5-8ms (degradable)
- **Particles:** 1-3ms (instanced)
- **GPU Draw Calls:** 2-4ms
- **Buffer:** 1-2ms

**Target:** <100 draw calls total. Use instancing, merge static geometry, texture atlases.

### Mobile Detection Strategy
```jsx
import { PerformanceMonitor } from '@react-three/drei'

<PerformanceMonitor onDecline={() => degradeQuality()} flipflops={3} onFallback={() => setMinimalMode(true)}>
  {/* Scene */}
</PerformanceMonitor>
```

**Degradation Levels:**
1. Reduce particle count (10k → 2k)
2. Disable DepthOfField
3. Disable Bloom, keep Vignette
4. Reduce shader complexity (remove pulse effects)
5. Fallback to static scene

**WebGPU vs WebGL:** WebGPU provides 2-10x improvement in compute-heavy scenarios; Three.js auto-falls back to WebGL2 when unavailable.

---

## Unresolved Questions

1. Optimal `flipflops` threshold for PerformanceMonitor before triggering aggressive degradation?
2. Should ripple pulse effects use compute shaders on WebGPU-capable devices for better performance?
3. Best practice for combining SelectiveBloom with multiple effect layers (different bloom intensities per category)?
4. Mobile GPU detection thresholds—at what point to skip post-processing entirely vs. apply minimal effects?
5. Integration strategy for existing NeuralNetwork.tsx—replace entirely or wrap/enhance?

---

## Sources

- [React Postprocessing Documentation](https://docs.pmnd.rs/react-postprocessing)
- [R3F Scaling Performance Guide](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [Three.js Best Practices 2026](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- [GLSL Shader Library - Ripple Effects](https://www.geeks3d.com/20110316/shader-library-simple-2d-effects-sphere-and-ripple-in-glsl/)
- [Crafting Dreamy Particle Effects with GPGPU](https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/)
- [Camera Controls for Three.js](https://github.com/yomotsu/camera-controls)
- [SelectiveBloom R3F Documentation](https://docs.pmnd.rs/react-postprocessing/effects/selective-bloom)
- [Draw Calls: The Silent Killer](https://threejsroadmap.com/blog/draw-calls-the-silent-killer)
- [R3F useFrame Throttling Discussion](https://github.com/pmndrs/react-three-fiber/discussions/380)
