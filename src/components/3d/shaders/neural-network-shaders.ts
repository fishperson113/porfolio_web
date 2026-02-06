/**
 * GLSL shaders for the NeuralNetwork synaptic ripple effect.
 * Nodes: vertex displacement + fragment glow from click-triggered pulses.
 * Lines: fragment-only pulse propagation along connections.
 */

export const nodeVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uPulseOrigins[5];
  uniform float uPulseTimes[5];

  varying float vWave;
  varying float vDist;

  void main() {
    vec3 pos = position;

    // Breathing animation
    float breathe = sin(uTime * 0.5 + pos.x * 2.0 + pos.y * 2.0) * 0.03;
    pos.y += breathe;
    pos.x += sin(uTime * 0.3 + pos.z * 2.0) * 0.02;

    // Pulse shockwave displacement
    float totalWave = 0.0;
    for (int i = 0; i < 5; i++) {
      if (uPulseTimes[i] > 0.0) {
        float dist = length(pos - uPulseOrigins[i]);
        float wave = sin(dist * 10.0 - uPulseTimes[i] * 5.0)
                   * exp(-dist * 0.8)
                   * exp(-uPulseTimes[i] * 1.2);
        totalWave += wave;
      }
    }
    vWave = totalWave;
    pos += normalize(pos) * totalWave * 0.15;

    vDist = length(pos);
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = max(2.0 * (1.0 + totalWave * 0.5) * (80.0 / -mvPos.z), 1.0);
  }
`

export const nodeFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uGlowColor;
  uniform float uTime;

  varying float vWave;
  varying float vDist;

  void main() {
    // Circular point
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    if (r > 1.0) discard;

    vec3 color = uColor;

    // Idle shimmer — subtle brightness variation per-node over time
    float shimmer = 0.15 * sin(uTime * 1.5 + vDist * 3.0);
    color += shimmer;

    // Pulse glow (click-triggered)
    float pulseGlow = smoothstep(0.3, 1.0, abs(vWave));
    color = mix(color, uGlowColor, pulseGlow * 0.8);

    // Soft edges + distance fade
    float alpha = (1.0 - r * 0.7) * (1.0 - smoothstep(5.0, 10.0, vDist));
    alpha *= 0.9;

    gl_FragColor = vec4(color, alpha);
  }
`

export const lineFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uGlowColor;
  uniform vec3 uPulseOrigins[5];
  uniform float uPulseTimes[5];

  varying vec3 vWorldPos;

  void main() {
    vec3 color = uColor;
    float totalGlow = 0.0;

    for (int i = 0; i < 5; i++) {
      if (uPulseTimes[i] > 0.0) {
        float dist = length(vWorldPos - uPulseOrigins[i]);
        float wave = sin(dist * 10.0 - uPulseTimes[i] * 5.0)
                   * exp(-dist * 0.8)
                   * exp(-uPulseTimes[i] * 1.2);
        totalGlow += smoothstep(0.3, 1.0, abs(wave));
      }
    }

    color = mix(color, uGlowColor, totalGlow * 0.6);
    gl_FragColor = vec4(color, 0.35 + totalGlow * 0.4);
  }
`

export const lineVertexShader = /* glsl */ `
  varying vec3 vWorldPos;

  void main() {
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
