'use client'

import { useCallback, useState, useMemo } from 'react'
import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import { useTopicStore } from '@/app/lib/store'
import type { Topic } from '@/app/lib/types'

// Register PixiJS components for React (v8 pattern)
extend({ Container })
import { Tree } from './Tree'
import type { TreeInteractionEvent } from '../../types/trees'

type TreeContainerProps = {
  subjectSquare: string
  onTreeClick: (topicId: string) => void
}

/**
 * Container component that manages all trees in the current subject square.
 * Handles hover state and routes interaction events.
 */
export function TreeContainer({
  subjectSquare,
  onTreeClick,
}: TreeContainerProps) {
  const [hoveredTopicId, setHoveredTopicId] = useState<string | null>(null)

  // Get topics for current subject square from store
  // Subscribe to the topics Map directly for reactivity
  const allTopics = useTopicStore((state) => state.topics)
  const getSubjectSquare = useTopicStore((state) => state.getSubjectSquare)

  // Filter topics by subject square - recomputes when topics Map changes
  const topics = useMemo(() => {
    const result: Topic[] = []
    allTopics.forEach((topic) => {
      if (topic.subjectSquare === subjectSquare) {
        result.push(topic)
      }
    })
    return result
  }, [allTopics, subjectSquare])

  const subjectData = getSubjectSquare(subjectSquare)
  const subjectName = subjectData?.name ?? 'default'

  const handleInteraction = useCallback(
    (event: TreeInteractionEvent) => {
      switch (event.type) {
        case 'click':
          onTreeClick(event.topicId)
          break
        case 'hover_start':
          setHoveredTopicId(event.topicId)
          break
        case 'hover_end':
          setHoveredTopicId(null)
          break
      }
    },
    [onTreeClick]
  )

  return (
    <pixiContainer sortableChildren>
      {topics.map((topic) => (
        <Tree
          key={topic.id}
          topic={topic}
          subjectName={subjectName}
          isHovered={hoveredTopicId === topic.id}
          onInteraction={handleInteraction}
        />
      ))}
    </pixiContainer>
  )
}
