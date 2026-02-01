'use client'

import { useMemo } from 'react'
import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import { useTopicStore } from '@/app/lib/store'

// Register PixiJS components for React (v8 pattern)
extend({ Container })
import { Trail } from './Trail'
import { getStyleForSubject, getThemeForSubject } from '../../lib/treeStyles'
import { calculateTrailStrength } from '../../lib/trailGeometry'
import type { TrailConnection } from '../../types/trees'

type TrailContainerProps = {
  subjectSquare: string
}

/**
 * Container component that manages all trails in the current subject square.
 * Builds connections from topic relationships, avoiding duplicate trails.
 */
export function TrailContainer({ subjectSquare }: TrailContainerProps) {
  const getTopicsBySubject = useTopicStore((state) => state.getTopicsBySubject)
  const getTopic = useTopicStore((state) => state.getTopic)
  const getSubjectSquare = useTopicStore((state) => state.getSubjectSquare)

  const topics = useMemo(
    () => getTopicsBySubject(subjectSquare),
    [getTopicsBySubject, subjectSquare]
  )

  const subjectData = getSubjectSquare(subjectSquare)
  const styleModifiers = getStyleForSubject(subjectData?.name ?? 'default')

  // Build trail connections from topic relationships
  // Avoids duplicates by sorting topic IDs to create consistent pair IDs
  const connections = useMemo(() => {
    const trails: TrailConnection[] = []
    const seen = new Set<string>()

    for (const topic of topics) {
      for (const relatedId of topic.relatedTopicIds) {
        // Create consistent ID regardless of which direction we encounter the pair
        const pairId = [topic.id, relatedId].sort().join('-')

        // Skip if we've already processed this pair
        if (seen.has(pairId)) continue
        seen.add(pairId)

        const relatedTopic = getTopic(relatedId)
        if (!relatedTopic) continue

        // Only show trails within same subject square
        // Cross-subject trails could be added later as a feature
        if (relatedTopic.subjectSquare !== subjectSquare) continue

        trails.push({
          id: pairId,
          fromTopicId: topic.id,
          toTopicId: relatedId,
          fromPosition: topic.position,
          toPosition: relatedTopic.position,
          strength: calculateTrailStrength(
            topic.engagementScore,
            relatedTopic.engagementScore
          ),
          subjectTheme: getThemeForSubject(subjectData?.name ?? 'default'),
        })
      }
    }

    return trails
  }, [topics, getTopic, subjectSquare, subjectData?.name])

  return (
    <pixiContainer>
      {connections.map((connection) => (
        <Trail
          key={connection.id}
          connection={connection}
          styleModifiers={styleModifiers}
        />
      ))}
    </pixiContainer>
  )
}
