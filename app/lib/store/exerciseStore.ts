import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Exercise } from '@/app/lib/types'

type ExerciseState = {
  exercises: Map<string, Exercise>

  // Exercise CRUD
  createExercise: (
    topicId: string,
    type: Exercise['type'],
    prompt: string
  ) => string
  deleteExercise: (id: string) => void
  getExercise: (id: string) => Exercise | undefined
  getExercisesByTopic: (topicId: string) => Exercise[]

  // Completion tracking
  submitAnswer: (id: string, answer: string) => void
  markComplete: (id: string) => void
  resetExercise: (id: string) => void

  // Stats
  getCompletionRate: (topicId: string) => number
}

function generateId(): string {
  return crypto.randomUUID()
}

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, get) => ({
      exercises: new Map(),

      createExercise: (topicId, type, prompt) => {
        const id = generateId()
        const exercise: Exercise = {
          id,
          topicId,
          type,
          prompt,
          userAnswer: undefined,
          completed: false,
          createdAt: new Date(),
        }

        set((state) => {
          const newExercises = new Map(state.exercises)
          newExercises.set(id, exercise)
          return { exercises: newExercises }
        })

        return id
      },

      deleteExercise: (id) => {
        set((state) => {
          const newExercises = new Map(state.exercises)
          newExercises.delete(id)
          return { exercises: newExercises }
        })
      },

      getExercise: (id) => get().exercises.get(id),

      getExercisesByTopic: (topicId) => {
        const exercises: Exercise[] = []
        get().exercises.forEach((ex) => {
          if (ex.topicId === topicId) {
            exercises.push(ex)
          }
        })
        // Sort by creation date, oldest first
        return exercises.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        )
      },

      submitAnswer: (id, answer) => {
        set((state) => {
          const exercise = state.exercises.get(id)
          if (!exercise) return state

          const newExercises = new Map(state.exercises)
          newExercises.set(id, {
            ...exercise,
            userAnswer: answer,
          })

          return { exercises: newExercises }
        })
      },

      markComplete: (id) => {
        set((state) => {
          const exercise = state.exercises.get(id)
          if (!exercise) return state

          const newExercises = new Map(state.exercises)
          newExercises.set(id, {
            ...exercise,
            completed: true,
          })

          return { exercises: newExercises }
        })
      },

      resetExercise: (id) => {
        set((state) => {
          const exercise = state.exercises.get(id)
          if (!exercise) return state

          const newExercises = new Map(state.exercises)
          newExercises.set(id, {
            ...exercise,
            userAnswer: undefined,
            completed: false,
          })

          return { exercises: newExercises }
        })
      },

      getCompletionRate: (topicId) => {
        const exercises = get().getExercisesByTopic(topicId)
        if (exercises.length === 0) return 0

        const completed = exercises.filter((ex) => ex.completed).length
        return (completed / exercises.length) * 100
      },
    }),
    {
      name: 'exercise-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null

          const parsed = JSON.parse(str)
          return {
            ...parsed,
            state: {
              ...parsed.state,
              exercises: new Map(
                parsed.state.exercises.map(([k, v]: [string, Exercise]) => [
                  k,
                  { ...v, createdAt: new Date(v.createdAt) },
                ])
              ),
            },
          }
        },
        setItem: (name, value) => {
          const serialized = {
            ...value,
            state: {
              ...value.state,
              exercises: Array.from(value.state.exercises.entries()),
            },
          }
          localStorage.setItem(name, JSON.stringify(serialized))
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)
