'use client'

import { useCallback } from 'react'
import { Graphics } from 'pixi.js'
import { WORLD_CONFIG } from '../constants'

/**
 * Renders the world boundary as a soft, subtle border.
 */
export function Ground() {
  const draw = useCallback((g: Graphics) => {
    g.clear()

    const { width, height } = WORLD_CONFIG
    const cornerRadius = 24
    const borderColor = 0xd4d4d4 // Light gray (stone-300)

    // Draw rounded world boundary with soft border
    g.setStrokeStyle({ width: 1.5, color: borderColor, alpha: 0.6 })
    g.roundRect(0, 0, width, height, cornerRadius)
    g.stroke()
  }, [])

  return <pixiGraphics draw={draw} />
}
