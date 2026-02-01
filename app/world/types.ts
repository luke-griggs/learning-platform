import type { Position, SubjectTheme } from '@/app/lib/types'
import type { Graphics } from 'pixi.js'

// World configuration
export interface WorldConfig {
  width: number
  height: number
  playerSpeed: number // pixels per second
  playerRadius: number
}

// Camera state managed in worldStore
export interface CameraState {
  x: number
  y: number
  zoom: number
}

// Input state from keyboard hook
export interface InputState {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}

// Theme configuration for visual styling
export interface ThemeConfig {
  backgroundColor: number
  groundPattern: 'grid' | 'dots' | 'lines'
  groundColor: number
  particleColor: number
  particleCount: number
}

// Render layers for ordering
export type RenderLayer = 'ground' | 'entities' | 'effects'

// Registry for external systems (trees, trails, companion) to render
export interface RenderableEntity {
  id: string
  render: (graphics: Graphics) => void
  position: Position
  layer: RenderLayer
}

// Context for child components to register renderables
export interface WorldContextValue {
  registerEntity: (entity: RenderableEntity) => void
  unregisterEntity: (id: string) => void
  worldConfig: WorldConfig
}

// Re-export for convenience
export type { SubjectTheme }
