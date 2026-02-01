'use client'

import { useRef } from 'react'
import { useTick } from '@pixi/react'
import { useUserStore } from '@/app/lib/store'
import { useWorldStore } from '../store/worldStore'
import { WORLD_CONFIG } from '../constants'
import type { InputState } from '../types'

interface UseGameLoopOptions {
  input: InputState
}

/**
 * Hook that runs the game loop at 60fps.
 * Handles player movement based on input and updates camera position.
 */
export function useGameLoop({ input }: UseGameLoopOptions) {
  const setPlayerPosition = useUserStore((state) => state.setPlayerPosition)
  const playerPosition = useUserStore((state) => state.playerPosition)
  const setCameraPosition = useWorldStore((state) => state.setCameraPosition)
  const isPaused = useWorldStore((state) => state.isPaused)

  // Use ref to avoid stale closures in useTick
  const positionRef = useRef(playerPosition)
  positionRef.current = playerPosition

  useTick((ticker) => {
    if (isPaused) return

    // deltaMS is milliseconds since last frame
    const deltaSeconds = ticker.deltaMS / 1000
    const speed = WORLD_CONFIG.playerSpeed * deltaSeconds

    let dx = 0
    let dy = 0

    if (input.up) dy -= speed
    if (input.down) dy += speed
    if (input.left) dx -= speed
    if (input.right) dx += speed

    // Normalize diagonal movement so it's not faster
    if (dx !== 0 && dy !== 0) {
      const factor = 1 / Math.sqrt(2)
      dx *= factor
      dy *= factor
    }

    if (dx !== 0 || dy !== 0) {
      // Calculate new position with world bounds clamping (hard stop)
      const newX = Math.max(0, Math.min(WORLD_CONFIG.width, positionRef.current.x + dx))
      const newY = Math.max(0, Math.min(WORLD_CONFIG.height, positionRef.current.y + dy))

      setPlayerPosition({ x: newX, y: newY })
      setCameraPosition(newX, newY)
    }
  })
}
