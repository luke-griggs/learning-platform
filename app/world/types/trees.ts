import type { Position, GrowthStage, SubjectTheme } from '@/app/lib/types'

// Visual configuration for a growth stage
export type GrowthStageConfig = {
  stage: GrowthStage
  scale: number // Base scale multiplier (0.3 - 1.5)
  complexity: number // Number of geometric shapes (1-8)
  hasGlow: boolean // Ancient trees have subtle glow
  trunkHeight: number // Height of main trunk (pixels)
  crownRadius: number // Radius of foliage/crown area
}

// Subject-specific visual modifiers
export type SubjectStyleModifiers = {
  theme: SubjectTheme
  primaryColor: number // Hex color
  secondaryColor: number // Hex color
  accentColor: number // Hex color
  shapeStyle: 'sharp' | 'curved' | 'angular'
  strokeWidth: number
  fillOpacity: number
}

// Complete tree visual state
export type TreeVisualState = {
  topicId: string
  position: Position
  growthStage: GrowthStage
  stageConfig: GrowthStageConfig
  styleModifiers: SubjectStyleModifiers
  isHovered: boolean
  isSelected: boolean
  animationProgress: number // 0-1 for growth transitions
}

// Trail connection definition
export type TrailConnection = {
  id: string // Combined from topic IDs
  fromTopicId: string
  toTopicId: string
  fromPosition: Position
  toPosition: Position
  strength: number // 0-1, affects opacity/thickness
  subjectTheme: SubjectTheme
}

// Events emitted by tree interaction
export type TreeInteractionEvent = {
  type: 'click' | 'hover_start' | 'hover_end'
  topicId: string
  position: Position
  worldPosition: Position // Actual click position in world coords
}

// Type for external event listeners
declare global {
  interface WindowEventMap {
    'tree:click': CustomEvent<{ topicId: string; position: Position }>
  }
}
