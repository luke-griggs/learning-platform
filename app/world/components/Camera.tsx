'use client'

import { ReactNode } from 'react'
import { useApplication } from '@pixi/react'
import { useUserStore } from '@/app/lib/store'
import { useWorldStore } from '../store/worldStore'

interface CameraProps {
  children: ReactNode
}

/**
 * Camera container that follows the player.
 * Children are rendered inside a container that's offset to keep the player centered.
 */
export function Camera({ children }: CameraProps) {
  const { app, isInitialised } = useApplication()
  const playerPosition = useUserStore((state) => state.playerPosition)
  const camera = useWorldStore((state) => state.camera)

  // Wait for PixiJS application to be fully initialized (including screen dimensions)
  if (!isInitialised || !app || !app.screen) {
    return (
      <pixiContainer x={0} y={0} scale={1}>
        {children}
      </pixiContainer>
    )
  }

  // Calculate camera offset to center player on screen
  const screenWidth = app.screen.width
  const screenHeight = app.screen.height

  const offsetX = -(playerPosition.x - screenWidth / 2)
  const offsetY = -(playerPosition.y - screenHeight / 2)

  return (
    <pixiContainer x={offsetX} y={offsetY} scale={camera.zoom}>
      {children}
    </pixiContainer>
  )
}
