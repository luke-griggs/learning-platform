'use client'

import { useState, useEffect, useRef } from 'react'
import { useNavigationStore, useUserStore } from '@/app/lib/store'

interface NewTopicButtonProps {
  className?: string
}

export function NewTopicButton({ className }: NewTopicButtonProps) {
  const [mounted, setMounted] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [topicName, setTopicName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const orbMode = useNavigationStore((s) => s.orbMode)
  const startOrbCarrying = useNavigationStore((s) => s.startOrbCarrying)

  const currentSubject = useUserStore((s) => s.currentSubjectSquare)
  const onboardingComplete = useUserStore((s) => s.onboardingComplete)

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (showModal && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showModal])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = topicName.trim()
    if (trimmedName) {
      startOrbCarrying(trimmedName)
      setTopicName('')
      setShowModal(false)
    }
  }

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false)
        setTopicName('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showModal])

  // Don't render until mounted (avoid hydration issues)
  if (!mounted) return null

  // Don't show if no subject is selected
  if (!currentSubject) return null

  // Don't show during onboarding (handled by onboarding flow)
  if (!onboardingComplete) return null

  // Don't show if already carrying an orb
  if (orbMode === 'carrying') return null

  return (
    <>
      {/* New Topic Button */}
      <button
        onClick={() => setShowModal(true)}
        className={`
          fixed top-4 right-4 z-40
          px-4 py-2
          bg-white/10 hover:bg-white/20
          backdrop-blur-sm
          border border-white/20
          rounded-lg
          text-white text-sm font-medium
          transition-colors
          flex items-center gap-2
          ${className}
        `}
      >
        <span className="text-lg leading-none">+</span>
        New Topic
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false)
              setTopicName('')
            }
          }}
        >
          <div className="bg-black/80 border border-white/20 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-white text-xl font-light mb-2">
              Create New Topic
            </h2>
            <p className="text-white/50 text-sm mb-6">
              What would you like to learn about?
            </p>

            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                placeholder="e.g., Calculus, World War II, Photosynthesis..."
                className="
                  w-full
                  px-4 py-3
                  bg-white/5
                  border border-white/20
                  rounded-lg
                  text-white
                  placeholder:text-white/30
                  focus:outline-none focus:border-white/40
                  transition-colors
                "
                autoComplete="off"
              />

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setTopicName('')
                  }}
                  className="
                    flex-1
                    px-4 py-2
                    bg-white/5 hover:bg-white/10
                    border border-white/20
                    rounded-lg
                    text-white/70
                    transition-colors
                  "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!topicName.trim()}
                  className="
                    flex-1
                    px-4 py-2
                    bg-white/20 hover:bg-white/30
                    disabled:bg-white/5 disabled:text-white/30
                    border border-white/20
                    rounded-lg
                    text-white
                    transition-colors
                  "
                >
                  Create
                </button>
              </div>
            </form>

            <p className="text-white/30 text-xs text-center mt-4">
              Press Escape to cancel
            </p>
          </div>
        </div>
      )}
    </>
  )
}
