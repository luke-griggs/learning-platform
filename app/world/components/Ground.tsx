'use client'

import { useCallback } from 'react'
import { Graphics } from 'pixi.js'
import { WORLD_CONFIG, THEME_CONFIGS, DEFAULT_THEME } from '../constants'
import type { SubjectTheme } from '../types'

interface GroundProps {
  theme?: SubjectTheme
}

/**
 * Renders the ground/background pattern for the world.
 * Pattern style varies based on subject theme:
 * - crystalline: geometric grid
 * - organic: scattered dots
 * - angular: diagonal lines
 */
export function Ground({ theme }: GroundProps) {
  const themeConfig = theme ? THEME_CONFIGS[theme] : DEFAULT_THEME

  const draw = useCallback(
    (g: Graphics) => {
      g.clear()

      const { width, height } = WORLD_CONFIG
      const gridSpacing = 100

      switch (themeConfig.groundPattern) {
        case 'grid':
          // Crystalline theme: geometric grid
          g.setStrokeStyle({ width: 1, color: themeConfig.groundColor, alpha: 0.3 })
          for (let x = 0; x <= width; x += gridSpacing) {
            g.moveTo(x, 0)
            g.lineTo(x, height)
          }
          for (let y = 0; y <= height; y += gridSpacing) {
            g.moveTo(0, y)
            g.lineTo(width, y)
          }
          g.stroke()
          break

        case 'dots':
          // Organic theme: scattered dots with slight variation
          g.setFillStyle({ color: themeConfig.groundColor, alpha: 0.4 })
          for (let x = gridSpacing / 2; x < width; x += gridSpacing) {
            for (let y = gridSpacing / 2; y < height; y += gridSpacing) {
              // Add deterministic offset for organic feel (not random so it's consistent)
              const offsetX = Math.sin(x * 0.1 + y * 0.05) * 10
              const offsetY = Math.cos(y * 0.1 + x * 0.05) * 10
              g.circle(x + offsetX, y + offsetY, 3)
            }
          }
          g.fill()
          break

        case 'lines':
          // Angular theme: diagonal lines
          g.setStrokeStyle({ width: 1, color: themeConfig.groundColor, alpha: 0.25 })
          for (let i = -height; i < width + height; i += gridSpacing) {
            g.moveTo(i, 0)
            g.lineTo(i + height, height)
          }
          g.stroke()
          break
      }

      // Draw world boundary
      g.setStrokeStyle({ width: 3, color: themeConfig.particleColor, alpha: 0.5 })
      g.rect(0, 0, width, height)
      g.stroke()
    },
    [themeConfig]
  )

  return <pixiGraphics draw={draw} />
}
