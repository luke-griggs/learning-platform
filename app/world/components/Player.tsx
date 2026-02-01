'use client'

import { useCallback, useRef } from 'react'
import { Graphics } from 'pixi.js'
import { useTick } from '@pixi/react'
import { useUserStore } from '@/app/lib/store'
import { WORLD_CONFIG } from '../constants'

// Trail config: size ratio and color (black to gray gradient)
const TRAIL_CONFIG = [
  { sizeRatio: 0.75, color: 0x333333 },
  { sizeRatio: 0.60, color: 0x666666 },
  { sizeRatio: 0.45, color: 0x999999 },
]

// How many frames of history to keep
const HISTORY_LENGTH = 60
// Which history frames to sample for each trail circle (evenly spaced)
const TRAIL_SAMPLE_FRAMES = [8, 18, 30]

interface Position {
  x: number
  y: number
}

/**
 * Renders the player as a black circle with a trailing effect.
 * Uses position history for perfectly smooth, stable trail movement.
 */
export function Player() {
  const playerPosition = useUserStore((state) => state.playerPosition)
  const historyRef = useRef<Position[]>([])
  const graphicsRef = useRef<Graphics | null>(null)

  useTick(() => {
    const history = historyRef.current

    // Add current position to history
    history.unshift({ x: playerPosition.x, y: playerPosition.y })

    // Trim history to max length
    if (history.length > HISTORY_LENGTH) {
      history.pop()
    }

    // Redraw
    const g = graphicsRef.current
    if (g) {
      g.clear()
      const radius = WORLD_CONFIG.playerRadius

      // Draw trail circles (back to front) by sampling history
      for (let i = TRAIL_CONFIG.length - 1; i >= 0; i--) {
        const config = TRAIL_CONFIG[i]
        const frameIndex = TRAIL_SAMPLE_FRAMES[i]

        // Use historical position if available, otherwise current
        const pos = history[frameIndex] ?? playerPosition

        g.setFillStyle({ color: config.color, alpha: 1 })
        g.circle(pos.x, pos.y, radius * config.sizeRatio)
        g.fill()
      }

      // Draw main player circle
      g.setFillStyle({ color: 0x000000, alpha: 1 })
      g.circle(playerPosition.x, playerPosition.y, radius)
      g.fill()
    }
  })

  const draw = useCallback((g: Graphics) => {
    graphicsRef.current = g
  }, [])

  return <pixiGraphics draw={draw} />
}
