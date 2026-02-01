'use client'

import { useMemo, createContext, useContext, useRef } from 'react'
import { Application, extend } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'
import { useUserStore, useTopicStore } from '@/app/lib/store'
import { useWorldStore } from '../store/worldStore'
import { useKeyboard } from '../hooks/useKeyboard'
import { useGameLoop } from '../hooks/useGameLoop'
import { Camera } from './Camera'
import { Ground } from './Ground'
import { Player } from './Player'
import { Orb } from './Orb'
import { TreeContainer } from './trees/TreeContainer'
import { TrailContainer } from './trails/TrailContainer'
import { WORLD_CONFIG } from '../constants'
import type { WorldContextValue, RenderableEntity } from '../types'

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
  const topics = useTopicStore((state) => state.topics)

  // Handle tree click - dispatches event for tree interface
  const handleTreeClick = (topicId: string) => {
    window.dispatchEvent(
      new CustomEvent('tree:click', { detail: { topicId } })
    )
  }

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
      {/* Layer 1: Ground border */}
      <Ground />
      {entityLayers.ground.map((entity) => (
        <pixiGraphics
          key={entity.id}
          draw={entity.render}
          x={entity.position.x}
          y={entity.position.y}
        />
      ))}

      {/* Layer 2: Trees and trails */}
      {currentSubjectSquare && (
        <>
          <TrailContainer subjectSquare={currentSubjectSquare} />
          <TreeContainer
            subjectSquare={currentSubjectSquare}
            onTreeClick={handleTreeClick}
            key={topics.size} // Force re-render when topics change
          />
        </>
      )}

      {/* Layer 2b: Registered entities */}
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

      {/* Layer 3.5: Orb (when carrying) */}
      <Orb />

      {/* Layer 4: Effects */}
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
  const containerRef = useRef<HTMLDivElement>(null)

  const contextValue: WorldContextValue = useMemo(
    () => ({
      registerEntity,
      unregisterEntity,
      worldConfig: WORLD_CONFIG,
    }),
    [registerEntity, unregisterEntity]
  )

  return (
    <WorldContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={className}
        style={{ width: '100%', height: '100%', position: 'relative', background: '#FAF9F7' }}
      >
        <Application
          resizeTo={containerRef}
          backgroundAlpha={0}
          antialias={true}
          resolution={typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1}
          autoDensity={true}
        >
          <WorldContent />
        </Application>
      </div>
    </WorldContext.Provider>
  )
}
