'use client'

import { useMemo } from 'react'
import type { SubjectSquare, Topic, SubjectTheme } from '@/app/lib/types'

// Theme colors for map squares (CSS hex values)
const THEME_COLORS: Record<SubjectTheme, { bg: string; border: string; dot: string }> = {
  crystalline: {
    bg: 'bg-blue-950/60',
    border: 'border-blue-500/50',
    dot: 'bg-blue-400',
  },
  organic: {
    bg: 'bg-green-950/60',
    border: 'border-green-500/50',
    dot: 'bg-green-400',
  },
  angular: {
    bg: 'bg-orange-950/60',
    border: 'border-orange-500/50',
    dot: 'bg-orange-400',
  },
}

interface MapSquareProps {
  square: SubjectSquare
  topics: Topic[]
  isCurrent: boolean
  isExpanded: boolean
  onClick?: (squareId: string) => void
}

export function MapSquare({
  square,
  topics,
  isCurrent,
  isExpanded,
  onClick,
}: MapSquareProps) {
  const colors = THEME_COLORS[square.theme]

  // Scale topic positions to fit in the square
  // World is 2000x2000, we need to map to the square size
  const scaledTopics = useMemo(() => {
    const worldSize = 2000
    return topics.map((topic) => ({
      id: topic.id,
      // Convert to percentage (0-100)
      x: (topic.position.x / worldSize) * 100,
      y: (topic.position.y / worldSize) * 100,
    }))
  }, [topics])

  const squareSize = isExpanded ? 'w-24 h-24' : 'w-8 h-8'
  const dotSize = isExpanded ? 'w-1.5 h-1.5' : 'w-1 h-1'

  return (
    <button
      onClick={() => onClick?.(square.id)}
      className={`
        ${squareSize}
        ${colors.bg}
        border ${isCurrent ? 'border-white/80 border-2' : colors.border}
        rounded-sm
        relative
        overflow-hidden
        transition-all duration-200
        hover:brightness-125
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
      `}
      title={square.name}
    >
      {/* Tree dots */}
      {scaledTopics.map((topic) => (
        <div
          key={topic.id}
          className={`
            absolute
            ${dotSize}
            ${colors.dot}
            rounded-full
            opacity-80
          `}
          style={{
            left: `${topic.x}%`,
            top: `${topic.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Current location indicator */}
      {isCurrent && (
        <div
          className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {/* Label in expanded mode */}
      {isExpanded && (
        <span className="absolute bottom-0 left-0 right-0 text-[8px] text-white/70 text-center truncate px-0.5">
          {square.name}
        </span>
      )}
    </button>
  )
}
