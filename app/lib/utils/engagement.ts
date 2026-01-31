import type { Conversation, Exercise } from '@/app/lib/types'

// Weights for engagement calculation
const WEIGHTS = {
  conversationCount: 0.2, // 20% - number of conversations
  messageCount: 0.3, // 30% - total messages exchanged
  recency: 0.2, // 20% - how recently active
  exerciseCompletion: 0.3, // 30% - exercises completed
}

// Thresholds for normalization
const THRESHOLDS = {
  maxConversations: 10, // 10+ conversations = full score for this component
  maxMessages: 50, // 50+ messages = full score for this component
  recencyDays: 30, // Activity within 30 days = full recency score
  maxExercises: 10, // 10+ completed exercises = full score
}

/**
 * Calculate engagement score for a topic based on conversations and exercises.
 * Returns a score from 0-100.
 */
export function calculateEngagement(
  conversations: Conversation[],
  exercises: Exercise[]
): number {
  const conversationScore = calculateConversationScore(conversations)
  const messageScore = calculateMessageScore(conversations)
  const recencyScore = calculateRecencyScore(conversations)
  const exerciseScore = calculateExerciseScore(exercises)

  const totalScore =
    conversationScore * WEIGHTS.conversationCount +
    messageScore * WEIGHTS.messageCount +
    recencyScore * WEIGHTS.recency +
    exerciseScore * WEIGHTS.exerciseCompletion

  // Return score clamped to 0-100
  return Math.round(Math.max(0, Math.min(100, totalScore * 100)))
}

/**
 * Score based on number of conversations (0-1).
 */
function calculateConversationScore(conversations: Conversation[]): number {
  const count = conversations.length
  return Math.min(count / THRESHOLDS.maxConversations, 1)
}

/**
 * Score based on total messages across all conversations (0-1).
 */
function calculateMessageScore(conversations: Conversation[]): number {
  const totalMessages = conversations.reduce(
    (sum, conv) => sum + conv.messages.length,
    0
  )
  return Math.min(totalMessages / THRESHOLDS.maxMessages, 1)
}

/**
 * Score based on how recently the topic was engaged with (0-1).
 * More recent activity = higher score.
 */
function calculateRecencyScore(conversations: Conversation[]): number {
  if (conversations.length === 0) return 0

  // Find most recent activity
  const mostRecentUpdate = Math.max(
    ...conversations.map((conv) => conv.updatedAt.getTime())
  )

  const now = Date.now()
  const daysSinceActivity = (now - mostRecentUpdate) / (1000 * 60 * 60 * 24)

  // Linear decay: full score at 0 days, 0 score at threshold days
  if (daysSinceActivity >= THRESHOLDS.recencyDays) return 0
  return 1 - daysSinceActivity / THRESHOLDS.recencyDays
}

/**
 * Score based on completed exercises (0-1).
 */
function calculateExerciseScore(exercises: Exercise[]): number {
  const completedCount = exercises.filter((ex) => ex.completed).length
  return Math.min(completedCount / THRESHOLDS.maxExercises, 1)
}

/**
 * Get a breakdown of engagement factors for display/debugging.
 */
export function getEngagementBreakdown(
  conversations: Conversation[],
  exercises: Exercise[]
): {
  conversationScore: number
  messageScore: number
  recencyScore: number
  exerciseScore: number
  totalScore: number
  details: {
    conversationCount: number
    messageCount: number
    daysSinceLastActivity: number | null
    exercisesCompleted: number
    exercisesTotal: number
  }
} {
  const conversationScore = calculateConversationScore(conversations)
  const messageScore = calculateMessageScore(conversations)
  const recencyScore = calculateRecencyScore(conversations)
  const exerciseScore = calculateExerciseScore(exercises)

  const mostRecentUpdate =
    conversations.length > 0
      ? Math.max(...conversations.map((conv) => conv.updatedAt.getTime()))
      : null

  return {
    conversationScore: Math.round(conversationScore * 100),
    messageScore: Math.round(messageScore * 100),
    recencyScore: Math.round(recencyScore * 100),
    exerciseScore: Math.round(exerciseScore * 100),
    totalScore: calculateEngagement(conversations, exercises),
    details: {
      conversationCount: conversations.length,
      messageCount: conversations.reduce(
        (sum, conv) => sum + conv.messages.length,
        0
      ),
      daysSinceLastActivity: mostRecentUpdate
        ? Math.round((Date.now() - mostRecentUpdate) / (1000 * 60 * 60 * 24))
        : null,
      exercisesCompleted: exercises.filter((ex) => ex.completed).length,
      exercisesTotal: exercises.length,
    },
  }
}
