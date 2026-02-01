'use client'

import { useEffect, useState } from 'react'
import { useNavigationStore, useUserStore } from '@/app/lib/store'
import { WelcomeScreen } from './WelcomeScreen'
import { SubjectSelector } from './SubjectSelector'

/**
 * Orchestrates the onboarding flow for first-time users.
 * Renders appropriate screens based on the current onboarding step.
 */
export function OnboardingFlow() {
  const [mounted, setMounted] = useState(false)

  const onboardingComplete = useUserStore((s) => s.onboardingComplete)
  const onboardingStep = useNavigationStore((s) => s.onboardingStep)
  const advanceOnboarding = useNavigationStore((s) => s.advanceOnboarding)
  const startOrbCarrying = useNavigationStore((s) => s.startOrbCarrying)

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-advance from entering_forest to plant_prompt after a delay
  useEffect(() => {
    if (onboardingStep === 'entering_forest') {
      const timer = setTimeout(() => {
        advanceOnboarding()
      }, 1500) // Brief pause to show the forest
      return () => clearTimeout(timer)
    }
  }, [onboardingStep, advanceOnboarding])

  // Don't render until mounted
  if (!mounted) return null

  // Don't render if onboarding is complete
  if (onboardingComplete) return null

  // Render based on current step
  switch (onboardingStep) {
    case 'welcome':
      return <WelcomeScreen />

    case 'subject_selection':
      return <SubjectSelector />

    case 'entering_forest':
      return (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center pointer-events-none">
          <p className="text-white text-xl animate-pulse">
            Entering your forest...
          </p>
        </div>
      )

    case 'plant_prompt':
      return (
        <div className="fixed inset-0 z-[55] flex items-center justify-center pointer-events-none">
          <div className="bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md text-center pointer-events-auto">
            <h2 className="text-white text-xl mb-3">
              Your forest awaits
            </h2>
            <p className="text-white/60 mb-6">
              This is your learning world. Each topic you explore becomes a tree
              that grows with your knowledge.
            </p>
            <p className="text-white/60 mb-6">
              Let&apos;s plant your first topic to get started!
            </p>
            <button
              onClick={() => {
                advanceOnboarding() // Move to placing_first_topic
                startOrbCarrying('My First Topic')
              }}
              className="
                px-6 py-3
                bg-green-600/80 hover:bg-green-600
                rounded-lg
                text-white
                transition-colors
              "
            >
              Plant First Topic
            </button>
          </div>
        </div>
      )

    case 'placing_first_topic':
      // OrbCarryingUI handles the UI during placement
      // Just show a subtle guide overlay
      return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
          <div className="bg-black/60 backdrop-blur px-4 py-2 rounded-lg">
            <p className="text-white/80 text-sm">
              Use <kbd className="px-1 bg-white/10 rounded">WASD</kbd> to move,
              then press <kbd className="px-1 bg-white/10 rounded">E</kbd> to plant
            </p>
          </div>
        </div>
      )

    case 'completed':
      // This state is handled by OrbCarryingUI triggering completeOnboarding
      return null

    default:
      return null
  }
}
