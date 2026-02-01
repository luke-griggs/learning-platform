import type { Topic } from '@/app/lib/types'

/**
 * Get all topics related to a given topic, up to a specified depth.
 * Depth 1 = direct connections only
 * Depth 2 = connections of connections, etc.
 */
export function getRelatedTopics(
  topicId: string,
  topics: Map<string, Topic>,
  depth: number = 1
): Topic[] {
  const visited = new Set<string>()
  const result: Topic[] = []

  function traverse(currentId: string, currentDepth: number) {
    if (currentDepth > depth) return
    if (visited.has(currentId)) return

    visited.add(currentId)

    const topic = topics.get(currentId)
    if (!topic) return

    // Don't add the starting topic to results
    if (currentId !== topicId) {
      result.push(topic)
    }

    // Continue traversing to related topics
    for (const relatedId of topic.relatedTopicIds) {
      traverse(relatedId, currentDepth + 1)
    }
  }

  traverse(topicId, 0)
  return result
}

/**
 * Find the shortest path between two topics using BFS.
 * Returns the array of topics forming the path (including start and end).
 * Returns empty array if no path exists.
 */
export function findPath(
  fromId: string,
  toId: string,
  topics: Map<string, Topic>
): Topic[] {
  if (fromId === toId) {
    const topic = topics.get(fromId)
    return topic ? [topic] : []
  }

  const visited = new Set<string>()
  const queue: { id: string; path: string[] }[] = [{ id: fromId, path: [fromId] }]

  while (queue.length > 0) {
    const current = queue.shift()!
    if (visited.has(current.id)) continue

    visited.add(current.id)

    const topic = topics.get(current.id)
    if (!topic) continue

    for (const relatedId of topic.relatedTopicIds) {
      if (relatedId === toId) {
        // Found the destination
        const fullPath = [...current.path, toId]
        const resolvedPath: Topic[] = []

        // Validate all topics in path exist - return empty if any are missing
        for (const id of fullPath) {
          const pathTopic = topics.get(id)
          if (!pathTopic) {
            // Missing intermediate topic - path is broken
            return []
          }
          resolvedPath.push(pathTopic)
        }

        return resolvedPath
      }

      if (!visited.has(relatedId)) {
        queue.push({ id: relatedId, path: [...current.path, relatedId] })
      }
    }
  }

  // No path found
  return []
}

/**
 * Get all topics that are "islands" (not connected to any other topic).
 */
export function getIsolatedTopics(topics: Map<string, Topic>): Topic[] {
  const isolated: Topic[] = []
  topics.forEach((topic) => {
    if (topic.relatedTopicIds.length === 0) {
      isolated.push(topic)
    }
  })
  return isolated
}

/**
 * Get the topic with the most connections (highest "hub" score).
 */
export function getMostConnectedTopic(
  topics: Map<string, Topic>
): Topic | undefined {
  let maxConnections = -1
  let mostConnected: Topic | undefined

  topics.forEach((topic) => {
    if (topic.relatedTopicIds.length > maxConnections) {
      maxConnections = topic.relatedTopicIds.length
      mostConnected = topic
    }
  })

  return mostConnected
}

/**
 * Get suggested topics to explore based on current topic.
 * Prioritizes directly related topics, then topics connected to related topics.
 */
export function getSuggestedTopics(
  currentTopicId: string,
  topics: Map<string, Topic>,
  limit: number = 5
): Topic[] {
  const related = getRelatedTopics(currentTopicId, topics, 2)

  // Sort by engagement score (lower first - suggest topics user hasn't explored much)
  return related
    .sort((a, b) => a.engagementScore - b.engagementScore)
    .slice(0, limit)
}

/**
 * Find topics that bridge two different subject squares.
 * These are "cross-disciplinary" topics that connect knowledge areas.
 */
export function getCrossDisciplinaryTopics(
  topics: Map<string, Topic>
): Topic[] {
  const bridging: Topic[] = []

  topics.forEach((topic) => {
    const relatedSquares = new Set<string>()
    relatedSquares.add(topic.subjectSquare)

    for (const relatedId of topic.relatedTopicIds) {
      const related = topics.get(relatedId)
      if (related) {
        relatedSquares.add(related.subjectSquare)
      }
    }

    // Topic connects multiple subject squares
    if (relatedSquares.size > 1) {
      bridging.push(topic)
    }
  })

  return bridging
}