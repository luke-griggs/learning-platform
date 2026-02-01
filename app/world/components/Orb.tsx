'use client'

import { useCallback, useRef } from 'react'
import { Graphics } from 'pixi.js'
import { useTick } from '@pixi/react'
import { useUserStore, useNavigationStore } from '@/app/lib/store'

const ORB_RADIUS = 10
const ORB_OFFSET_Y = -35 // Float above player
const ORB_COLOR = 0x88ff88 // Green glow

/**
 * Renders a glowing orb that follows the player when in 'carrying' mode.
 * The orb floats above the player and has a pulsing animation.
 */
export function Orb() {
  const playerPosition = useUserStore((state) => state.playerPosition)
  const orbMode = useNavigationStore((state) => state.orbMode)

  // Animation state for pulsing effect
  const pulseRef = useRef(0)

  // Animate the pulse
  useTick((ticker) => {
    pulseRef.current += (ticker.deltaMS / 1000) * 3
  })

  const draw = useCallback(
    (g: Graphics) => {
      g.clear()

      // Pulsing scale factor (oscillates between 0.9 and 1.1)
      const pulse = 1 + Math.sin(pulseRef.current) * 0.1

      // Outer glow ring (largest)
      g.setFillStyle({ color: ORB_COLOR, alpha: 0.15 })
      g.circle(0, 0, ORB_RADIUS * 2.5 * pulse)
      g.fill()

      // Middle glow
      g.setFillStyle({ color: ORB_COLOR, alpha: 0.3 })
      g.circle(0, 0, ORB_RADIUS * 1.5 * pulse)
      g.fill()

      // Main orb
      g.setFillStyle({ color: ORB_COLOR, alpha: 0.7 })
      g.circle(0, 0, ORB_RADIUS * pulse)
      g.fill()

      // Inner bright core
      g.setFillStyle({ color: 0xffffff, alpha: 0.9 })
      g.circle(0, 0, ORB_RADIUS * 0.4 * pulse)
      g.fill()
    },
    [] // No dependencies - animation handled via ref
  )

  // Only render when carrying an orb
  if (orbMode !== 'carrying') {
    return null
  }

  return (
    <pixiGraphics
      draw={draw}
      x={playerPosition.x}
      y={playerPosition.y + ORB_OFFSET_Y}
    />
  )
}
