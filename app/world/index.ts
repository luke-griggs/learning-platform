// World Module Exports
// This module provides the 2D world renderer and visualization layer

// ============================================
// World Renderer (Feature 01)
// ============================================

// Main renderer component
export { WorldRenderer } from './WorldRenderer'

// Hook for external systems to render on the canvas
export { useWorld } from './components/WorldCanvas'

// Store for world state (camera, entities)
export { useWorldStore } from './store/worldStore'

// World types
export type {
  WorldConfig,
  RenderableEntity,
  WorldContextValue,
  RenderLayer,
  CameraState,
  InputState,
} from './types'

// World constants
export { WORLD_CONFIG } from './constants'

// ============================================
// Trees & Trails (Feature 02)
// ============================================
// This section provides the visualization layer for topics (trees) and their relationships (trails)

// Components
export { Tree } from './components/trees/Tree'
export { TreeContainer } from './components/trees/TreeContainer'
export { Trail } from './components/trails/Trail'
export { TrailContainer } from './components/trails/TrailContainer'

// Hooks
export {
  useTreeInteraction,
  useTreeClickListener,
} from './hooks/useTreeInteraction'

// Utilities
export {
  SUBJECT_STYLE_MODIFIERS,
  getStyleForSubject,
  getThemeForSubject,
} from './lib/treeStyles'
export { GROWTH_STAGE_ASSETS, ASSET_CONFIGS } from './lib/assetPaths'
export { loadTreeAssets, getTextureForStage, areAssetsLoaded } from './lib/assetLoader'
export {
  drawTrail,
  calculateBezierControlPoints,
  calculateTrailStrength,
  getTrailLength,
} from './lib/trailGeometry'

// Types
export type {
  SubjectStyleModifiers,
  TrailConnection,
  TreeInteractionEvent,
} from './types/trees'
