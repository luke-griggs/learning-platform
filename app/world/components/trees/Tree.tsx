'use client'

import { useCallback, useEffect, useRef } from 'react'
import { extend } from '@pixi/react'
import { Container, Graphics, Text, FederatedPointerEvent, TextStyle } from 'pixi.js'

// Register PixiJS components for React (v8 pattern)
extend({ Container, Graphics, Text })
import type { Topic } from '@/app/lib/types'
import { getGrowthStage } from '@/app/lib/types'
import {
  drawTree,
  drawHoverHighlight,
  drawGlowEffect,
} from '../../lib/treeGeometry'
import { GROWTH_STAGE_CONFIGS, getStyleForSubject } from '../../lib/treeStyles'
import { useGrowthAnimation } from '../../hooks/useGrowthAnimation'
import type { TreeInteractionEvent } from '../../types/trees'

type TreeProps = {
  topic: Topic
  subjectName: string
  isHovered: boolean
  onInteraction: (event: TreeInteractionEvent) => void
}

// Text style for tree labels (always visible below trees)
const labelStyle = new TextStyle({
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: 11,
  fill: 0xcccccc,
  align: 'center',
})

// Text style for hover tooltip (topic name on hover)
const tooltipStyle = new TextStyle({
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: 13,
  fill: 0xffffff,
  align: 'center',
  fontWeight: 'bold',
})

export function Tree({
  topic,
  subjectName,
  isHovered,
  onInteraction,
}: TreeProps) {
  const graphicsRef = useRef<Graphics>(null)

  const currentStage = getGrowthStage(topic.engagementScore)
  const stageConfig = GROWTH_STAGE_CONFIGS[currentStage]
  const styleModifiers = getStyleForSubject(subjectName)

  // Animation hook for smooth growth transitions
  const { animProgress } = useGrowthAnimation(topic.id, topic.engagementScore)

  // Draw the tree whenever state changes
  const draw = useCallback(
    (g: Graphics) => {
      g.clear()

      // Draw glow effect for ancient trees (behind tree)
      if (stageConfig.hasGlow) {
        drawGlowEffect(
          g,
          stageConfig.crownRadius,
          stageConfig.trunkHeight,
          styleModifiers.accentColor
        )
      }

      // Draw the tree itself
      drawTree(g, currentStage, styleModifiers, animProgress)

      // Add hover highlight
      if (isHovered) {
        drawHoverHighlight(g, stageConfig.crownRadius, stageConfig.trunkHeight)
      }
    },
    [currentStage, styleModifiers, animProgress, isHovered, stageConfig]
  )

  // Set up hit area for click detection
  useEffect(() => {
    if (graphicsRef.current) {
      const g = graphicsRef.current
      g.eventMode = 'static'
      g.cursor = 'pointer'

      // Create circular hit area slightly larger than visual bounds
      const hitRadius = stageConfig.crownRadius * stageConfig.scale + 15
      const centerY = (-stageConfig.trunkHeight * stageConfig.scale) / 2

      g.hitArea = {
        contains: (x: number, y: number) => {
          return Math.sqrt(x * x + (y - centerY) ** 2) <= hitRadius
        },
      }
    }
  }, [stageConfig])

  const handleClick = useCallback(
    (e: FederatedPointerEvent) => {
      e.stopPropagation()
      onInteraction({
        type: 'click',
        topicId: topic.id,
        position: topic.position,
        worldPosition: { x: e.global.x, y: e.global.y },
      })
    },
    [topic, onInteraction]
  )

  const handlePointerOver = useCallback(() => {
    onInteraction({
      type: 'hover_start',
      topicId: topic.id,
      position: topic.position,
      worldPosition: topic.position,
    })
  }, [topic, onInteraction])

  const handlePointerOut = useCallback(() => {
    onInteraction({
      type: 'hover_end',
      topicId: topic.id,
      position: topic.position,
      worldPosition: topic.position,
    })
  }, [topic, onInteraction])

  // Calculate label position (below the tree)
  const labelY = 10 // Below trunk base

  // Truncate long topic names for the label
  const truncatedName =
    topic.name.length > 16 ? topic.name.slice(0, 14) + '...' : topic.name

  return (
    <pixiContainer
      x={topic.position.x}
      y={topic.position.y}
      scale={stageConfig.scale}
    >
      {/* Tree graphics */}
      <pixiGraphics
        ref={graphicsRef}
        draw={draw}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />

      {/* Always-visible label below tree */}
      <pixiText
        text={truncatedName}
        style={labelStyle}
        anchor={{ x: 0.5, y: 0 }}
        y={labelY}
        alpha={0.8}
      />

      {/* Hover tooltip showing full name */}
      {isHovered && topic.name.length > 16 && (
        <pixiText
          text={topic.name}
          style={tooltipStyle}
          anchor={{ x: 0.5, y: 1 }}
          y={-stageConfig.trunkHeight - 20}
          alpha={1}
        />
      )}
    </pixiContainer>
  )
}
