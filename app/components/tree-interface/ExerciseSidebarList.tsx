'use client'

import { useExerciseStore } from '@/app/lib/store'
import type { Exercise } from '@/app/lib/types'

type ExerciseSidebarListProps = {
  topicId: string
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

function getTypeStyles(type: Exercise['type']): { bg: string; text: string } {
  switch (type) {
    case 'problem':
      return { bg: 'bg-blue-50', text: 'text-blue-600' }
    case 'quiz':
      return { bg: 'bg-purple-50', text: 'text-purple-600' }
    case 'reflection':
      return { bg: 'bg-amber-50', text: 'text-amber-600' }
    default:
      return { bg: 'bg-[var(--background-secondary)]', text: 'text-[var(--foreground-secondary)]' }
  }
}

function ExerciseListItem({ exercise }: { exercise: Exercise }) {
  const typeStyles = getTypeStyles(exercise.type)

  return (
    <button
      className="
        w-full px-3 py-3 text-left
        hover:bg-[var(--background-secondary)]
        transition-colors duration-150
        group
      "
    >
      <div className="flex items-start gap-3">
        {/* Completion indicator */}
        <div className="mt-0.5 shrink-0">
          {exercise.completed ? (
            <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-green-600">
                <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-[var(--border)] group-hover:border-[var(--foreground-muted)] transition-colors" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Type badge */}
          <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded ${typeStyles.bg} ${typeStyles.text}`}>
            {getTypeLabel(exercise.type)}
          </span>

          {/* Prompt */}
          <p className="text-[13px] text-[var(--foreground-secondary)] mt-1 line-clamp-2 leading-snug">
            {exercise.prompt}
          </p>
        </div>
      </div>
    </button>
  )
}

export function ExerciseSidebarList({ topicId }: ExerciseSidebarListProps) {
  const getExercisesByTopic = useExerciseStore((state) => state.getExercisesByTopic)
  const getCompletionRate = useExerciseStore((state) => state.getCompletionRate)

  const exercises = getExercisesByTopic(topicId)
  const completionRate = getCompletionRate(topicId)

  if (exercises.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-[14px] text-[var(--foreground-muted)]">
          No exercises yet
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Progress indicator */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] text-[var(--foreground-secondary)] font-medium">
            Progress
          </span>
          <span className="text-[12px] text-[var(--foreground-tertiary)]">
            {Math.round(completionRate)}% complete
          </span>
        </div>
        <div className="h-1.5 bg-[var(--background-secondary)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Exercise list */}
      <div>
        {exercises.map((exercise) => (
          <ExerciseListItem key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  )
}
