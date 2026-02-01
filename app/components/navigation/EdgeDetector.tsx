'use client'

import { useEffect, useState, useMemo } from 'react'
import { useNavigationStore, useUserStore, useTopicStore } from '@/app/lib/store'
import { WORLD_CONFIG } from '@/app/world/constants'
import type { EdgeDirection, SubjectSquare } from '@/app/lib/types'

const EDGE_THRESHOLD = 100 // Pixels from edge to show prompt

// Button positioning based on edge direction
const EDGE_BUTTON_STYLES: Record<EdgeDirection, string> = {
  north: 'top-20 left-1/2 -translate-x-1/2',
  south: 'bottom-20 left-1/2 -translate-x-1/2',
  west: 'left-20 top-1/2 -translate-y-1/2',
  east: 'right-20 top-1/2 -translate-y-1/2',
}

// Arrow direction for each edge
const EDGE_ARROWS: Record<EdgeDirection, string> = {
  north: '↑',
  south: '↓',
  west: '←',
  east: '→',
}

interface EdgeDetectorProps {
  className?: string
}

export function EdgeDetector({ className }: EdgeDetectorProps) {
  const [mounted, setMounted] = useState(false)

  const playerPosition = useUserStore((s) => s.playerPosition)
  const currentSubject = useUserStore((s) => s.currentSubjectSquare)
  const onboardingComplete = useUserStore((s) => s.onboardingComplete)

  const startTransition = useNavigationStore((s) => s.startTransition)
  const isTransitioning = useNavigationStore((s) => s.isTransitioning)

  const getAllSubjectSquares = useTopicStore((s) => s.getAllSubjectSquares)
  const subjectSquares = getAllSubjectSquares()

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Detect which edge (if any) the player is near
  const nearEdge = useMemo((): EdgeDirection | null => {
    const { x, y } = playerPosition
    const { width, height } = WORLD_CONFIG

    if (y < EDGE_THRESHOLD) return 'north'
    if (y > height - EDGE_THRESHOLD) return 'south'
    if (x < EDGE_THRESHOLD) return 'west'
    if (x > width - EDGE_THRESHOLD) return 'east'
    return null
  }, [playerPosition])

  // Find the adjacent subject square in that direction
  // For now, we cycle through available squares (simple implementation)
  const adjacentSquare = useMemo((): SubjectSquare | null => {
    if (!nearEdge || !currentSubject || subjectSquares.length <= 1) return null

    // Find current index
    const currentIndex = subjectSquares.findIndex((s) => s.id === currentSubject)
    if (currentIndex === -1) return null

    // Get next square in the direction (cycling through list)
    // This is a simple implementation - could be enhanced with grid-based adjacency
    let nextIndex: number
    switch (nearEdge) {
      case 'east':
      case 'south':
        nextIndex = (currentIndex + 1) % subjectSquares.length
        break
      case 'west':
      case 'north':
        nextIndex = (currentIndex - 1 + subjectSquares.length) % subjectSquares.length
        break
      default:
        return null
    }

    return subjectSquares[nextIndex]
  }, [nearEdge, currentSubject, subjectSquares])

  // Handle transition to adjacent square
  const handleTransition = () => {
    if (adjacentSquare && !isTransitioning) {
      startTransition(adjacentSquare.id)
    }
  }

  // Don't render until mounted
  if (!mounted) return null

  // Don't show during onboarding
  if (!onboardingComplete) return null

  // Don't show if not near an edge or no adjacent square
  if (!nearEdge || !adjacentSquare) return null

  // Don't show during transition
  if (isTransitioning) return null

  return (
    <button
      onClick={handleTransition}
      className={`
        fixed z-40
        ${EDGE_BUTTON_STYLES[nearEdge]}
        px-4 py-3
        bg-black/60 hover:bg-black/80
        backdrop-blur-md
        border border-white/30
        rounded-xl
        text-white
        transition-all
        hover:scale-105
        animate-fade-in
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        {nearEdge === 'west' && <span>{EDGE_ARROWS[nearEdge]}</span>}
        {nearEdge === 'north' && (
          <span className="mr-1">{EDGE_ARROWS[nearEdge]}</span>
        )}
        <span>
          Enter <span className="font-medium">{adjacentSquare.name}</span>
        </span>
        {nearEdge === 'east' && <span>{EDGE_ARROWS[nearEdge]}</span>}
        {nearEdge === 'south' && (
          <span className="ml-1">{EDGE_ARROWS[nearEdge]}</span>
        )}
      </div>
      <p className="text-white/50 text-xs mt-1">
        Click or keep moving
      </p>
    </button>
  )
}
