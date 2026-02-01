'use client'

import { useCallback, useRef, useMemo } from 'react'
import { useTick } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { WORLD_CONFIG, THEME_CONFIGS, DEFAULT_THEME } from '../constants'
import type { SubjectTheme } from '../types'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  alphaDir: number
}

interface ParticlesProps {
  theme?: SubjectTheme
}

/**
 * Renders ambient floating particles that drift through the world.
 * Particles pulse in opacity and wrap around world boundaries.
 */
export function Particles({ theme }: ParticlesProps) {
  const themeConfig = theme ? THEME_CONFIGS[theme] : DEFAULT_THEME
  const graphicsRef = useRef<Graphics | null>(null)

  // Initialize particles with seeded random for consistency
  const particles = useMemo(() => {
    const p: Particle[] = []
    // Use a simple seeded approach for deterministic initial state
    const seed = (n: number) => ((n * 9301 + 49297) % 233280) / 233280

    for (let i = 0; i < themeConfig.particleCount; i++) {
      p.push({
        x: seed(i * 7) * WORLD_CONFIG.width,
        y: seed(i * 13) * WORLD_CONFIG.height,
        vx: (seed(i * 17) - 0.5) * 20,
        vy: (seed(i * 23) - 0.5) * 20,
        size: seed(i * 29) * 3 + 1,
        alpha: seed(i * 31) * 0.5 + 0.2,
        alphaDir: seed(i * 37) > 0.5 ? 1 : -1,
      })
    }
    return p
  }, [themeConfig.particleCount])

  // Update particles each frame
  useTick((ticker) => {
    const g = graphicsRef.current
    if (!g) return

    const delta = ticker.deltaTime

    g.clear()
    g.setFillStyle({ color: themeConfig.particleColor, alpha: 0.6 })

    for (const p of particles) {
      // Update position with gentle floating motion
      p.x += p.vx * delta * 0.016
      p.y += p.vy * delta * 0.016

      // Wrap around world bounds
      if (p.x < 0) p.x = WORLD_CONFIG.width
      if (p.x > WORLD_CONFIG.width) p.x = 0
      if (p.y < 0) p.y = WORLD_CONFIG.height
      if (p.y > WORLD_CONFIG.height) p.y = 0

      // Pulse alpha
      p.alpha += p.alphaDir * 0.005 * delta
      if (p.alpha > 0.7) p.alphaDir = -1
      if (p.alpha < 0.2) p.alphaDir = 1

      // Draw particle with individual alpha
      g.circle(p.x, p.y, p.size)
    }
    g.fill()
  })

  const setRef = useCallback((g: Graphics) => {
    graphicsRef.current = g
  }, [])

  // Initial draw (empty - we update via useTick for animation)
  const initialDraw = useCallback((g: Graphics) => {
    // Particles are drawn dynamically in useTick
  }, [])

  return <pixiGraphics ref={setRef} draw={initialDraw} />
}
