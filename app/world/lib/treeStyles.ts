import type { GrowthStage, SubjectTheme } from '@/app/lib/types'
import type { GrowthStageConfig, SubjectStyleModifiers } from '../types/trees'

// Growth stage configurations - defines visual characteristics for each stage
export const GROWTH_STAGE_CONFIGS: Record<GrowthStage, GrowthStageConfig> = {
  seedling: {
    stage: 'seedling',
    scale: 0.4,
    complexity: 1,
    hasGlow: false,
    trunkHeight: 12,
    crownRadius: 4,
  },
  sapling: {
    stage: 'sapling',
    scale: 0.6,
    complexity: 2,
    hasGlow: false,
    trunkHeight: 25,
    crownRadius: 10,
  },
  young: {
    stage: 'young',
    scale: 0.8,
    complexity: 4,
    hasGlow: false,
    trunkHeight: 40,
    crownRadius: 18,
  },
  mature: {
    stage: 'mature',
    scale: 1.0,
    complexity: 6,
    hasGlow: false,
    trunkHeight: 55,
    crownRadius: 25,
  },
  ancient: {
    stage: 'ancient',
    scale: 1.3,
    complexity: 8,
    hasGlow: true,
    trunkHeight: 70,
    crownRadius: 35,
  },
}

// Subject theme color palettes - each subject type has distinct visual identity
export const SUBJECT_STYLE_MODIFIERS: Record<SubjectTheme, SubjectStyleModifiers> =
  {
    crystalline: {
      theme: 'crystalline',
      primaryColor: 0x64b5f6, // Light blue
      secondaryColor: 0xe1bee7, // Light purple
      accentColor: 0xb2ebf2, // Cyan tint
      shapeStyle: 'sharp',
      strokeWidth: 1.5,
      fillOpacity: 0.7,
    },
    organic: {
      theme: 'organic',
      primaryColor: 0x81c784, // Green
      secondaryColor: 0xa5d6a7, // Light green
      accentColor: 0xc5e1a5, // Lime tint
      shapeStyle: 'curved',
      strokeWidth: 2,
      fillOpacity: 0.8,
    },
    angular: {
      theme: 'angular',
      primaryColor: 0xffcc80, // Amber
      secondaryColor: 0xbcaaa4, // Brown gray
      accentColor: 0xd7ccc8, // Warm gray
      shapeStyle: 'angular',
      strokeWidth: 1.5,
      fillOpacity: 0.75,
    },
  }

// Map subject names to their visual themes
const SUBJECT_THEME_MAP: Record<string, SubjectTheme> = {
  math: 'crystalline',
  mathematics: 'crystalline',
  physics: 'crystalline',
  biology: 'organic',
  chemistry: 'organic',
  ecology: 'organic',
  history: 'angular',
  literature: 'angular',
  philosophy: 'angular',
}

/**
 * Get style modifiers for a subject square.
 * Falls back to 'organic' theme for unknown subjects.
 */
export function getStyleForSubject(subjectName: string): SubjectStyleModifiers {
  const theme = SUBJECT_THEME_MAP[subjectName.toLowerCase()] ?? 'organic'
  return SUBJECT_STYLE_MODIFIERS[theme]
}

/**
 * Get the theme type for a subject name.
 */
export function getThemeForSubject(subjectName: string): SubjectTheme {
  return SUBJECT_THEME_MAP[subjectName.toLowerCase()] ?? 'organic'
}

/**
 * Get stage config with interpolation support for smooth animations.
 * Blends values between two stages based on progress (0-1).
 */
export function getInterpolatedStageConfig(
  fromStage: GrowthStage,
  toStage: GrowthStage,
  progress: number
): GrowthStageConfig {
  const from = GROWTH_STAGE_CONFIGS[fromStage]
  const to = GROWTH_STAGE_CONFIGS[toStage]

  return {
    stage: progress >= 0.5 ? toStage : fromStage,
    scale: from.scale + (to.scale - from.scale) * progress,
    complexity: Math.round(
      from.complexity + (to.complexity - from.complexity) * progress
    ),
    hasGlow: progress >= 0.9 ? to.hasGlow : from.hasGlow,
    trunkHeight:
      from.trunkHeight + (to.trunkHeight - from.trunkHeight) * progress,
    crownRadius:
      from.crownRadius + (to.crownRadius - from.crownRadius) * progress,
  }
}

// Growth stage order for determining transitions
const GROWTH_STAGE_ORDER: GrowthStage[] = [
  'seedling',
  'sapling',
  'young',
  'mature',
  'ancient',
]

/**
 * Get the next growth stage (for animations).
 */
export function getNextStage(stage: GrowthStage): GrowthStage | null {
  const index = GROWTH_STAGE_ORDER.indexOf(stage)
  if (index === -1 || index === GROWTH_STAGE_ORDER.length - 1) return null
  return GROWTH_STAGE_ORDER[index + 1]
}

/**
 * Get the previous growth stage (for reverse animations).
 */
export function getPreviousStage(stage: GrowthStage): GrowthStage | null {
  const index = GROWTH_STAGE_ORDER.indexOf(stage)
  if (index <= 0) return null
  return GROWTH_STAGE_ORDER[index - 1]
}
