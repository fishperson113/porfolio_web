'use client'

import { useState, useEffect } from 'react'

export type PerformanceTier = 'high' | 'mid' | 'low'

export interface DevicePerformance {
  isMobile: boolean
  isLowEnd: boolean
  tier: PerformanceTier
  cpuCores: number
}

const DEFAULT_PERFORMANCE: DevicePerformance = {
  isMobile: false,
  isLowEnd: false,
  tier: 'high',
  cpuCores: 4,
}

/**
 * Detects device capabilities (mobile, CPU cores, GPU tier).
 * Runs once on mount. Conservative: defaults to mid-tier on uncertain detection.
 */
export function useDevicePerformance(): DevicePerformance {
  const [performance, setPerformance] = useState<DevicePerformance>(DEFAULT_PERFORMANCE)

  useEffect(() => {
    const isMobile = /mobile|tablet|android|iphone|ipad/i.test(navigator.userAgent)
    const cpuCores = navigator.hardwareConcurrency || 4

    // GPU tier detection via WebGL debug extension
    let isLowEndGPU = false
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (gl && gl instanceof WebGLRenderingContext) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string
          isLowEndGPU = /intel hd|intel\(r\) hd|mali-4/i.test(renderer)
        }
      }
    } catch {
      // WebGL unavailable — assume low-end
      isLowEndGPU = true
    }

    let tier: PerformanceTier = 'high'
    if (isMobile && cpuCores < 4) tier = 'low'
    else if (isMobile || cpuCores < 6 || isLowEndGPU) tier = 'mid'

    setPerformance({ isMobile, isLowEnd: tier === 'low', tier, cpuCores })
  }, [])

  return performance
}
