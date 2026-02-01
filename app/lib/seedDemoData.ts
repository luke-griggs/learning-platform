import { useTopicStore } from './store/topicStore'

// Engagement scores for each mastery level
const MASTERY_SCORES = {
  seedling: 5,    // notes.png
  sapling: 20,    // notebook.png
  young: 45,      // book.png
  mature: 75,     // bookshelf.png
  ancient: 92,    // bookshelf.png (same image, higher score)
}

/**
 * Update existing topics in a subject to showcase all mastery levels.
 * Assigns different engagement scores to each topic sequentially.
 */
export function levelUpExistingTopics(subjectSquareId: string): void {
  const store = useTopicStore.getState()
  const topics = store.getTopicsBySubject(subjectSquareId)

  const levels = Object.values(MASTERY_SCORES)

  topics.forEach((topic, index) => {
    // Cycle through mastery levels
    const score = levels[index % levels.length]
    store.updateEngagement(topic.id, score)
    console.log(`[Dev] Set "${topic.name}" to engagement ${score}`)
  })

  console.log(`[Dev] Updated ${topics.length} topics with varied mastery levels`)
}

/**
 * Demo topics at various engagement levels to showcase all 4 mastery images:
 * - notes.png (seedling): 0-9
 * - notebook.png (sapling): 10-29
 * - book.png (young): 30-59
 * - bookshelf.png (mature/ancient): 60-100
 */
const DEMO_TOPICS = [
  // Seedling (notes) - scores < 10
  { name: 'Getting Started', engagementScore: 5 },
  { name: 'First Concepts', engagementScore: 3 },

  // Sapling (notebook) - scores 10-29
  { name: 'Basic Principles', engagementScore: 15 },
  { name: 'Key Definitions', engagementScore: 22 },

  // Young (book) - scores 30-59
  { name: 'Core Theory', engagementScore: 40 },
  { name: 'Applied Methods', engagementScore: 52 },

  // Mature (bookshelf) - scores 60-84
  { name: 'Advanced Topics', engagementScore: 70 },
  { name: 'Deep Analysis', engagementScore: 78 },

  // Ancient (bookshelf) - scores >= 85
  { name: 'Mastery Level', engagementScore: 90 },
  { name: 'Expert Knowledge', engagementScore: 95 },
]

/**
 * Seed the topic store with demo data at varied engagement levels.
 * Places topics in a grid pattern within the world.
 *
 * @param subjectSquareId - The ID of the subject square to seed topics into
 */
export function seedDemoTopics(subjectSquareId: string): void {
  const store = useTopicStore.getState()

  // World dimensions
  const worldWidth = 2000
  const worldHeight = 2000

  // Grid layout: 5 columns x 2 rows, centered in world
  const cols = 5
  const rows = 2
  const paddingX = 300
  const paddingY = 400

  const availableWidth = worldWidth - paddingX * 2
  const availableHeight = worldHeight - paddingY * 2

  const spacingX = availableWidth / (cols - 1)
  const spacingY = availableHeight / (rows - 1)

  DEMO_TOPICS.forEach((demo, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)

    const position = {
      x: paddingX + col * spacingX,
      y: paddingY + row * spacingY,
    }

    // Create topic
    const id = store.addTopic({
      name: demo.name,
      subjectSquare: subjectSquareId,
      position,
    })

    // Set the engagement score to achieve desired mastery level
    store.updateEngagement(id, demo.engagementScore)
  })
}

/**
 * Clear all topics from a subject square.
 * Useful for resetting demo data.
 */
export function clearSubjectTopics(subjectSquareId: string): void {
  const store = useTopicStore.getState()
  const topics = store.getTopicsBySubject(subjectSquareId)

  for (const topic of topics) {
    store.deleteTopic(topic.id)
  }
}
