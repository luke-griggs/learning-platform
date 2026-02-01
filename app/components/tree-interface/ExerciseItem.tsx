'use client'

import type { Exercise } from '@/app/lib/types'

type ExerciseItemProps = {
  exercise: Exercise
}

function getTypeLabel(type: Exercise['type']): string {
  switch (type) {
    case 'problem':
      return 'Problem'
    case 'quiz':
      return 'Quiz'
    case 'reflection':
      return 'Reflection'
    default:
      return 'Exercise'
  }
}

function getTypeColor(type: Exercise['type']): string {
  switch (type) {
    case 'problem':
      return 'text-blue-400'
    case 'quiz':
      return 'text-purple-400'
    case 'reflection':
      return 'text-amber-400'
    default:
      return 'text-white/60'
  }
}

export function ExerciseItem({ exercise }: ExerciseItemProps) {
  return (
    <div className="px-4 py-2 hover:bg-white/5 transition-colors cursor-pointer">
      <div className="flex items-start gap-2">
        {/* Completion indicator */}
        <div className="mt-1 shrink-0">
          {exercise.completed ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-green-400">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4 7L6 9L10 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/30">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-medium ${getTypeColor(exercise.type)}`}>
              {getTypeLabel(exercise.type)}
            </span>
          </div>
          <p className="text-xs text-white/70 mt-0.5 line-clamp-2">
            {exercise.prompt}
          </p>
        </div>
      </div>
    </div>
  )
}
