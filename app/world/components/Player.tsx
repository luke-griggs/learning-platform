'use client'

import { useRef, useState } from 'react'
import { extend } from '@pixi/react'
import { Container, Sprite } from 'pixi.js'
import { useTick } from '@pixi/react'
import { useUserStore } from '@/app/lib/store'
import {
  type Direction,
  DEFAULT_DIRECTION,
  FRAME_DURATION_MS,
  getCharacterFrames,
  getDirectionFromInput,
  areCharacterAssetsLoaded,
} from '../lib/characterAssetLoader'
import type { InputState } from '../types'

// Register PixiJS components for React (v8 pattern)
extend({ Container, Sprite })

// Character sprite scale (these sprites are fairly large)
const CHARACTER_SCALE = 0.06

interface PlayerProps {
  input: InputState
}

/**
 * Renders the player as an animated sprite that changes direction based on movement.
 * Animation cycles through frames at ~0.5s per frame when moving.
 */
export function Player({ input }: PlayerProps) {
  const playerPosition = useUserStore((state) => state.playerPosition)

  // All animation state in refs to avoid async React state issues
  const directionRef = useRef<Direction>(DEFAULT_DIRECTION)
  const currentFrameRef = useRef(0)
  const animationTimeRef = useRef(0)
  const isMovingRef = useRef(false)

  // Force re-render when animation state changes
  const [renderKey, setRenderKey] = useState(0)

  useTick((ticker) => {
    if (!areCharacterAssetsLoaded()) return

    const deltaMS = ticker.deltaMS

    // Determine direction directly from input (synchronous, no batching issues)
    const newDirection = getDirectionFromInput(input)

    let needsRender = false

    if (newDirection) {
      // Moving - update direction and animate
      if (newDirection !== directionRef.current) {
        directionRef.current = newDirection
        currentFrameRef.current = 0
        animationTimeRef.current = 0
        needsRender = true
      }

      // Advance animation timer
      animationTimeRef.current += deltaMS

      // Check if we should advance to next frame
      if (animationTimeRef.current >= FRAME_DURATION_MS) {
        // Use subtraction to preserve timing accuracy
        animationTimeRef.current -= FRAME_DURATION_MS
        const frames = getCharacterFrames(directionRef.current)
        currentFrameRef.current = (currentFrameRef.current + 1) % frames.length
        needsRender = true
      }

      isMovingRef.current = true
    } else {
      // Not moving - reset to first frame if we were moving
      if (isMovingRef.current) {
        currentFrameRef.current = 0
        animationTimeRef.current = 0
        needsRender = true
      }
      isMovingRef.current = false
    }

    // Only trigger React re-render when texture actually changes
    if (needsRender) {
      setRenderKey((k) => k + 1)
    }
  })

  // Get current texture from refs
  const frames = getCharacterFrames(directionRef.current)
  const texture = frames[currentFrameRef.current] ?? frames[0]

  if (!areCharacterAssetsLoaded()) {
    return null
  }

  return (
    <pixiSprite
      key={renderKey}
      texture={texture}
      x={playerPosition.x}
      y={playerPosition.y}
      anchor={{ x: 0.5, y: 0.5 }}
      scale={CHARACTER_SCALE}
    />
  )
}
