'use client'

import { useCallback, useEffect, useRef } from 'react'
import { extend } from '@pixi/react'
import { Container, Sprite, Text, FederatedPointerEvent, TextStyle } from 'pixi.js'

// Register PixiJS components for React (v8 pattern)
extend({ Container, Sprite, Text })

import type { Topic } from '@/app/lib/types'
import { getGrowthStage } from '@/app/lib/types'
import { getTextureForStage } from '../../lib/assetLoader'
import { ASSET_CONFIGS } from '../../lib/assetPaths'
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
  fill: 0x666666,
  align: 'center',
})

// Text style for hover tooltip (topic name on hover)
const tooltipStyle = new TextStyle({
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: 13,
  fill: 0x333333,
  align: 'center',
  fontWeight: 'bold',
})

export function Tree({
  topic,
  subjectName,
  isHovered,
  onInteraction,
}: TreeProps) {
  const spriteRef = useRef<Sprite>(null)

  const currentStage = getGrowthStage(topic.engagementScore)
  const assetConfig = ASSET_CONFIGS[currentStage]
  const texture = getTextureForStage(currentStage)

  // Set up hit area for click detection
  useEffect(() => {
    if (spriteRef.current) {
      const sprite = spriteRef.current
      sprite.eventMode = 'static'
      sprite.cursor = 'pointer'

      // Create circular hit area based on config
      const hitRadius = assetConfig.hitRadius

      sprite.hitArea = {
        contains: (x: number, y: number) => {
          // Hit area centered on sprite
          const centerY = -sprite.height * assetConfig.anchorY / 2
          return Math.sqrt(x * x + (y - centerY) ** 2) <= hitRadius
        },
      }
    }
  }, [assetConfig])

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

  // Truncate long topic names for the label
  const truncatedName =
    topic.name.length > 16 ? topic.name.slice(0, 14) + '...' : topic.name

  // Calculate sprite height for tooltip positioning (estimate based on scale)
  const estimatedHeight = 150 * assetConfig.scale

  return (
    <pixiContainer x={topic.position.x} y={topic.position.y}>
      {/* Sprite-based image */}
      <pixiSprite
        ref={spriteRef}
        texture={texture}
        anchor={{ x: 0.5, y: assetConfig.anchorY }}
        scale={assetConfig.scale}
        alpha={isHovered ? 1.0 : 0.9}
        tint={isHovered ? 0xffffff : 0xfafafa}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />

      {/* Always-visible label below tree */}
      <pixiText
        text={truncatedName}
        style={labelStyle}
        anchor={{ x: 0.5, y: 0 }}
        y={assetConfig.labelOffset}
        alpha={0.8}
      />

      {/* Hover tooltip showing full name */}
      {isHovered && topic.name.length > 16 && (
        <pixiText
          text={topic.name}
          style={tooltipStyle}
          anchor={{ x: 0.5, y: 1 }}
          y={-estimatedHeight - 10}
          alpha={1}
        />
      )}
    </pixiContainer>
  )
}
