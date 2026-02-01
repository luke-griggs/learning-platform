// Navigation-specific types for map, orb, transitions, and onboarding

// Orb carrying states
export type OrbMode = 'idle' | 'carrying' | 'placing'

// Edge directions for world boundaries
export type EdgeDirection = 'north' | 'south' | 'east' | 'west'

// Onboarding flow steps
export type OnboardingStep =
  | 'welcome'
  | 'subject_selection'
  | 'entering_forest'
  | 'plant_prompt'
  | 'placing_first_topic'
  | 'completed'

// Grid position for subject square adjacency
export type GridPosition = {
  row: number
  col: number
}

// Predefined subjects for onboarding
export const PREDEFINED_SUBJECTS = [
  { name: 'Mathematics', theme: 'crystalline' as const },
  { name: 'Physics', theme: 'crystalline' as const },
  { name: 'Biology', theme: 'organic' as const },
  { name: 'Chemistry', theme: 'organic' as const },
  { name: 'History', theme: 'angular' as const },
  { name: 'Literature', theme: 'angular' as const },
  { name: 'Philosophy', theme: 'angular' as const },
] as const

// Onboarding step sequence for state machine
export const ONBOARDING_SEQUENCE: OnboardingStep[] = [
  'welcome',
  'subject_selection',
  'entering_forest',
  'plant_prompt',
  'placing_first_topic',
  'completed',
]
