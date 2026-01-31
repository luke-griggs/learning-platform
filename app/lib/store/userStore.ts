import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Position } from '@/app/lib/types'

type UserState = {
  // Current navigation state
  currentSubjectSquare: string | null
  playerPosition: Position

  // Preferences
  companionStyle: string
  onboardingComplete: boolean

  // Actions
  setCurrentSubjectSquare: (id: string | null) => void
  setPlayerPosition: (position: Position) => void
  movePlayer: (dx: number, dy: number) => void
  setCompanionStyle: (style: string) => void
  completeOnboarding: () => void
  resetOnboarding: () => void
}

const DEFAULT_POSITION: Position = { x: 0, y: 0 }
const DEFAULT_COMPANION_STYLE = 'wisp'

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentSubjectSquare: null,
      playerPosition: DEFAULT_POSITION,
      companionStyle: DEFAULT_COMPANION_STYLE,
      onboardingComplete: false,

      setCurrentSubjectSquare: (id) => {
        set({ currentSubjectSquare: id })
      },

      setPlayerPosition: (position) => {
        set({ playerPosition: position })
      },

      movePlayer: (dx, dy) => {
        set((state) => ({
          playerPosition: {
            x: state.playerPosition.x + dx,
            y: state.playerPosition.y + dy,
          },
        }))
      },

      setCompanionStyle: (style) => {
        set({ companionStyle: style })
      },

      completeOnboarding: () => {
        set({ onboardingComplete: true })
      },

      resetOnboarding: () => {
        set({
          onboardingComplete: false,
          currentSubjectSquare: null,
          playerPosition: DEFAULT_POSITION,
        })
      },
    }),
    {
      name: 'user-storage',
    }
  )
)
