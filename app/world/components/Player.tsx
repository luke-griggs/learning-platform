'use client'

import { useCallback } from 'react'
import { Graphics } from 'pixi.js'
import { useUserStore } from '@/app/lib/store'
import { WORLD_CONFIG } from '../constants'

/**
 * Renders the player as a glowing dot.
 * Position is read from userStore so it persists across sessions.
 */
export function Player() {
  const playerPosition = useUserStore((state) => state.playerPosition)

  const draw = useCallback((g: Graphics) => {
    g.clear()

    const radius = WORLD_CONFIG.playerRadius

    // Outer glow ring
    g.setFillStyle({ color: 0xffffff, alpha: 0.15 })
    g.circle(0, 0, radius * 2.5)
    g.fill()

    // Middle glow
    g.setFillStyle({ color: 0xffffff, alpha: 0.3 })
    g.circle(0, 0, radius * 1.5)
    g.fill()

    // Main player dot
    g.setFillStyle({ color: 0xffffff, alpha: 0.9 })
    g.circle(0, 0, radius)
    g.fill()

    // Inner bright core
    g.setFillStyle({ color: 0xffffff, alpha: 1 })
    g.circle(0, 0, radius * 0.4)
    g.fill()
  }, [])

  return <pixiGraphics draw={draw} x={playerPosition.x} y={playerPosition.y} />
}
