import type { Position, SubjectTheme } from '@/app/lib/types'

// Subject-specific visual modifiers (used for trails)
export type SubjectStyleModifiers = {
  theme: SubjectTheme
  primaryColor: number // Hex color
  secondaryColor: number // Hex color
  accentColor: number // Hex color
  shapeStyle: 'sharp' | 'curved' | 'angular'
  strokeWidth: number
  fillOpacity: number
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
