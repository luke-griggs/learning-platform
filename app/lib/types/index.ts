// Core position type for world coordinates
export type Position = {
  x: number
  y: number
}

// A topic is represented as a tree in the world
export type Topic = {
  id: string
  name: string
  subjectSquare: string // "math", "biology", etc.
  position: Position // Location in the world
  createdAt: Date
  engagementScore: number // 0-100, drives tree growth
  relatedTopicIds: string[] // Edges in the topic graph
}

// A conversation belongs to a topic
export type Conversation = {
  id: string
  topicId: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

// Individual message in a conversation
export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Exercises for practicing topic knowledge
export type Exercise = {
  id: string
  topicId: string
  type: 'problem' | 'quiz' | 'reflection'
  prompt: string
  userAnswer?: string
  completed: boolean
  createdAt: Date
}

// Visual themes for subject squares
export type SubjectTheme = 'crystalline' | 'organic' | 'angular'

// A subject square is a distinct world area
export type SubjectSquare = {
  id: string
  name: string // "Math", "Biology", etc.
  theme: SubjectTheme
  topicIds: string[]
}

// User state and preferences
export type UserState = {
  currentSubjectSquare: string | null
  playerPosition: Position
  companionStyle: string
  onboardingComplete: boolean
}

// Growth stages based on engagement score
export type GrowthStage = 'seedling' | 'sapling' | 'young' | 'mature' | 'ancient'

// Helper to determine growth stage from engagement score
export function getGrowthStage(engagementScore: number): GrowthStage {
  if (engagementScore < 10) return 'seedling'
  if (engagementScore < 30) return 'sapling'
  if (engagementScore < 60) return 'young'
  if (engagementScore < 85) return 'mature'
  return 'ancient'
}
