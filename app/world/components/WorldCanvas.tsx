'use client'

import { useMemo, createContext, useContext, useEffect, useState } from 'react'
import { Application, extend } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'
import { useUserStore, useTopicStore } from '@/app/lib/store'
import { useWorldStore } from '../store/worldStore'
import { useKeyboard } from '../hooks/useKeyboard'
import { useGameLoop } from '../hooks/useGameLoop'
import { Camera } from './Camera'
import { Ground } from './Ground'
import { Particles } from './Particles'
import { Player } from './Player'
import { WORLD_CONFIG, THEME_CONFIGS, DEFAULT_THEME } from '../constants'
import type { WorldContextValue, RenderableEntity, SubjectTheme } from '../types'

// Extend PixiJS components for React
extend({ Container, Graphics })

// Context for external systems to register renderables
const WorldContext = createContext<WorldContextValue | null>(null)

/**
 * Hook for external systems (trees, trails, companion) to register entities on the canvas.
 */
export function useWorld(): WorldContextValue {
  const context = useContext(WorldContext)
  if (!context) {
    throw new Error('useWorld must be used within a WorldCanvas')
  }
  return context
}

/**
 * Inner component that has access to PixiJS application context.
 * Handles the game loop and renders all world elements.
 */
function WorldContent() {
  const input = useKeyboard()
  useGameLoop({ input })

  const currentSubjectSquare = useUserStore((state) => state.currentSubjectSquare)
  const subjectSquares = useTopicStore((state) => state.subjectSquares)

  // Determine current theme from subject square
  const theme: SubjectTheme | undefined = useMemo(() => {
    if (!currentSubjectSquare) return undefined
    const square = subjectSquares.get(currentSubjectSquare)
    return square?.theme
  }, [currentSubjectSquare, subjectSquares])

  // Get registered entities from store, grouped by layer
  const entities = useWorldStore((state) => state.entities)

  const entityLayers = useMemo(() => {
    const ground: RenderableEntity[] = []
    const main: RenderableEntity[] = []
    const effects: RenderableEntity[] = []

    entities.forEach((entity) => {
      switch (entity.layer) {
        case 'ground':
          ground.push(entity)
          break
        case 'entities':
          main.push(entity)
          break
        case 'effects':
          effects.push(entity)
          break
      }
    })

    return { ground, main, effects }
  }, [entities])

  return (
    <Camera>
      {/* Layer 1: Ground and background patterns */}
      <Ground theme={theme} />
      {entityLayers.ground.map((entity) => (
        <pixiGraphics
          key={entity.id}
          draw={entity.render}
          x={entity.position.x}
          y={entity.position.y}
        />
      ))}

      {/* Layer 2: Main entities (trees, trails) */}
      {entityLayers.main.map((entity) => (
        <pixiGraphics
          key={entity.id}
          draw={entity.render}
          x={entity.position.x}
          y={entity.position.y}
        />
      ))}

      {/* Layer 3: Player */}
      <Player />

      {/* Layer 4: Effects (particles, companion) */}
      <Particles theme={theme} />
      {entityLayers.effects.map((entity) => (
        <pixiGraphics
          key={entity.id}
          draw={entity.render}
          x={entity.position.x}
          y={entity.position.y}
        />
      ))}
    </Camera>
  )
}

interface WorldCanvasProps {
  className?: string
}

/**
 * Main PixiJS canvas component for the world.
 * Provides context for entity registration and orchestrates all rendering.
 */
export function WorldCanvas({ className }: WorldCanvasProps) {
  const registerEntity = useWorldStore((state) => state.registerEntity)
  const unregisterEntity = useWorldStore((state) => state.unregisterEntity)
  const [mounted, setMounted] = useState(false)

  // Ensure we only render on client
  useEffect(() => {
    setMounted(true)
  }, [])

  const contextValue: WorldContextValue = useMemo(
    () => ({
      registerEntity,
      unregisterEntity,
      worldConfig: WORLD_CONFIG,
    }),
    [registerEntity, unregisterEntity]
  )

  // Get theme for background color
  const currentSubjectSquare = useUserStore((state) => state.currentSubjectSquare)
  const subjectSquares = useTopicStore((state) => state.subjectSquares)

  const backgroundColor = useMemo(() => {
    if (!currentSubjectSquare) return DEFAULT_THEME.backgroundColor
    const square = subjectSquares.get(currentSubjectSquare)
    if (!square) return DEFAULT_THEME.backgroundColor
    return THEME_CONFIGS[square.theme].backgroundColor
  }, [currentSubjectSquare, subjectSquares])

  if (!mounted) {
    return null
  }

  return (
    <WorldContext.Provider value={contextValue}>
      <div className={className} style={{ width: '100%', height: '100%' }}>
        <Application
          resizeTo={window}
          background={backgroundColor}
          antialias={true}
          resolution={window.devicePixelRatio || 1}
          autoDensity={true}
        >
          <WorldContent />
        </Application>
      </div>
    </WorldContext.Provider>
  )
}
