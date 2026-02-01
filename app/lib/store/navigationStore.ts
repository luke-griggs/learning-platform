import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OrbMode, OnboardingStep, EdgeDirection } from '@/app/lib/types'
import { ONBOARDING_SEQUENCE } from '@/app/lib/types'

type NavigationState = {
  // Map overlay state
  mapExpanded: boolean

  // Orb/topic creation state
  orbMode: OrbMode
  pendingTopicName: string | null

  // Edge detection state
  nearEdge: EdgeDirection | null
  adjacentSubjectId: string | null

  // Transition state
  isTransitioning: boolean
  transitionTargetSquare: string | null

  // Onboarding state
  onboardingStep: OnboardingStep

  // Map actions
  setMapExpanded: (expanded: boolean) => void
  toggleMap: () => void

  // Orb actions
  startOrbCarrying: (topicName: string) => void
  cancelOrbCarrying: () => void
  confirmOrbPlacement: () => void

  // Edge actions
  setNearEdge: (edge: EdgeDirection | null, subjectId: string | null) => void

  // Transition actions
  startTransition: (targetSquareId: string) => void
  endTransition: () => void

  // Onboarding actions
  setOnboardingStep: (step: OnboardingStep) => void
  advanceOnboarding: () => void
  resetNavigation: () => void
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      // Initial state
      mapExpanded: false,
      orbMode: 'idle',
      pendingTopicName: null,
      nearEdge: null,
      adjacentSubjectId: null,
      isTransitioning: false,
      transitionTargetSquare: null,
      onboardingStep: 'welcome',

      // Map actions
      setMapExpanded: (expanded) => {
        set({ mapExpanded: expanded })
      },

      toggleMap: () => {
        set((state) => ({ mapExpanded: !state.mapExpanded }))
      },

      // Orb actions
      startOrbCarrying: (topicName) => {
        set({
          orbMode: 'carrying',
          pendingTopicName: topicName,
        })
      },

      cancelOrbCarrying: () => {
        set({
          orbMode: 'idle',
          pendingTopicName: null,
        })
      },

      confirmOrbPlacement: () => {
        set({
          orbMode: 'idle',
          pendingTopicName: null,
        })
      },

      // Edge actions
      setNearEdge: (edge, subjectId) => {
        set({
          nearEdge: edge,
          adjacentSubjectId: subjectId,
        })
      },

      // Transition actions
      startTransition: (targetSquareId) => {
        set({
          isTransitioning: true,
          transitionTargetSquare: targetSquareId,
        })
      },

      endTransition: () => {
        set({
          isTransitioning: false,
          transitionTargetSquare: null,
        })
      },

      // Onboarding actions
      setOnboardingStep: (step) => {
        set({ onboardingStep: step })
      },

      advanceOnboarding: () => {
        const current = get().onboardingStep
        const currentIndex = ONBOARDING_SEQUENCE.indexOf(current)
        if (currentIndex < ONBOARDING_SEQUENCE.length - 1) {
          set({ onboardingStep: ONBOARDING_SEQUENCE[currentIndex + 1] })
        }
      },

      resetNavigation: () => {
        set({
          mapExpanded: false,
          orbMode: 'idle',
          pendingTopicName: null,
          nearEdge: null,
          adjacentSubjectId: null,
          isTransitioning: false,
          transitionTargetSquare: null,
          onboardingStep: 'welcome',
        })
      },
    }),
    {
      name: 'navigation-storage',
    }
  )
)
