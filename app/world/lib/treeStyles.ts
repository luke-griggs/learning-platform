import type { SubjectTheme } from '@/app/lib/types'
import type { SubjectStyleModifiers } from '../types/trees'

/**
 * Subject theme color palettes.
 * Used for trail colors between topics.
 */
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
