'use client'

import { useEffect, useCallback, useState } from 'react'
import { useNavigationStore, useUserStore, useTopicStore } from '@/app/lib/store'

export function OrbCarryingUI() {
  const [mounted, setMounted] = useState(false)

  const orbMode = useNavigationStore((s) => s.orbMode)
  const pendingTopicName = useNavigationStore((s) => s.pendingTopicName)
  const cancelOrbCarrying = useNavigationStore((s) => s.cancelOrbCarrying)
  const confirmOrbPlacement = useNavigationStore((s) => s.confirmOrbPlacement)
  const onboardingStep = useNavigationStore((s) => s.onboardingStep)
  const advanceOnboarding = useNavigationStore((s) => s.advanceOnboarding)

  const playerPosition = useUserStore((s) => s.playerPosition)
  const currentSubject = useUserStore((s) => s.currentSubjectSquare)
  const onboardingComplete = useUserStore((s) => s.onboardingComplete)
  const completeOnboarding = useUserStore((s) => s.completeOnboarding)

  const addTopic = useTopicStore((s) => s.addTopic)

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Place the orb and create a topic
  const handlePlace = useCallback(() => {
    if (!pendingTopicName || !currentSubject) return

    // Create the topic at current player position
    addTopic({
      name: pendingTopicName,
      subjectSquare: currentSubject,
      position: { ...playerPosition },
    })

    // Clear the orb state
    confirmOrbPlacement()

    // Advance onboarding if placing first topic
    if (!onboardingComplete && onboardingStep === 'placing_first_topic') {
      advanceOnboarding() // Goes to 'completed'
      completeOnboarding()
    }
  }, [
    pendingTopicName,
    currentSubject,
    playerPosition,
    addTopic,
    confirmOrbPlacement,
    onboardingComplete,
    onboardingStep,
    advanceOnboarding,
    completeOnboarding,
  ])

  // Keyboard handlers
  useEffect(() => {
    if (orbMode !== 'carrying') return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // E to place orb
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault()
        handlePlace()
      }

      // Escape to cancel
      if (e.key === 'Escape') {
        e.preventDefault()
        cancelOrbCarrying()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [orbMode, handlePlace, cancelOrbCarrying])

  // Don't render until mounted
  if (!mounted) return null

  // Only show when carrying an orb
  if (orbMode !== 'carrying') return null

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
      <div
        className="
          bg-black/70 backdrop-blur-md
          border border-white/20
          rounded-xl
          px-6 py-4
          text-center
          animate-fade-in
        "
      >
        {/* Topic name */}
        <p className="text-white/90 mb-2">
          Planting: <span className="font-medium text-green-400">{pendingTopicName}</span>
        </p>

        {/* Instructions */}
        <p className="text-white/50 text-sm mb-3">
          Move to choose a location, then press{' '}
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/80 text-xs">
            E
          </kbd>{' '}
          to plant
        </p>

        {/* Action buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handlePlace}
            className="
              px-4 py-2
              bg-green-600/80 hover:bg-green-600
              rounded-lg
              text-white text-sm
              transition-colors
            "
          >
            Plant Here
          </button>
          <button
            onClick={cancelOrbCarrying}
            className="
              px-4 py-2
              bg-white/10 hover:bg-white/20
              rounded-lg
              text-white/70 text-sm
              transition-colors
            "
          >
            Cancel
          </button>
        </div>

        {/* Keyboard hints */}
        <p className="text-white/30 text-xs mt-3">
          <kbd className="px-1 py-0.5 bg-white/5 rounded">E</kbd> to plant,{' '}
          <kbd className="px-1 py-0.5 bg-white/5 rounded">Esc</kbd> to cancel
        </p>
      </div>
    </div>
  )
}
