'use client'

import { useState } from 'react'
import { useExerciseStore } from '@/app/lib/store'
import { ExerciseItem } from './ExerciseItem'

type ExerciseSectionProps = {
  topicId: string
}

export function ExerciseSection({ topicId }: ExerciseSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getExercisesByTopic = useExerciseStore((state) => state.getExercisesByTopic)
  const getCompletionRate = useExerciseStore((state) => state.getCompletionRate)

  const exercises = getExercisesByTopic(topicId)
  const completionRate = getCompletionRate(topicId)

  if (exercises.length === 0) {
    return (
      <div className="border-t border-white/5">
        <div className="px-4 py-3">
          <h2 className="text-sm font-medium text-white/80">Exercises</h2>
          <p className="text-xs text-white/40 mt-1">No exercises yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-white/5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-white/80">Exercises</h2>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
            {Math.round(completionRate)}%
          </span>
        </div>

        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`text-white/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="pb-2">
          {exercises.map((exercise) => (
            <ExerciseItem key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  )
}
