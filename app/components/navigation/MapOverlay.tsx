'use client'

import { useEffect, useCallback, useState } from 'react'
import { useNavigationStore, useUserStore, useTopicStore } from '@/app/lib/store'
import { MapSquare } from './MapSquare'
import { WORLD_CONFIG } from '@/app/world/constants'
import type { SubjectTheme } from '@/app/lib/types'

interface MapOverlayProps {
  className?: string
}

const THEME_OPTIONS: { value: SubjectTheme; label: string; color: string }[] = [
  { value: 'crystalline', label: 'Crystalline', color: '#4488ff' },
  { value: 'organic', label: 'Organic', color: '#44ff88' },
  { value: 'angular', label: 'Angular', color: '#ff8844' },
]

export function MapOverlay({ className }: MapOverlayProps) {
  const [mounted, setMounted] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSquareName, setNewSquareName] = useState('')
  const [newSquareTheme, setNewSquareTheme] = useState<SubjectTheme>('crystalline')

  const mapExpanded = useNavigationStore((s) => s.mapExpanded)
  const toggleMap = useNavigationStore((s) => s.toggleMap)
  const setMapExpanded = useNavigationStore((s) => s.setMapExpanded)

  const currentSubject = useUserStore((s) => s.currentSubjectSquare)
  const setCurrentSubject = useUserStore((s) => s.setCurrentSubjectSquare)
  const setPlayerPosition = useUserStore((s) => s.setPlayerPosition)
  const onboardingComplete = useUserStore((s) => s.onboardingComplete)

  const getAllSubjectSquares = useTopicStore((s) => s.getAllSubjectSquares)
  const getTopicsBySubject = useTopicStore((s) => s.getTopicsBySubject)
  const addSubjectSquare = useTopicStore((s) => s.addSubjectSquare)

  const subjectSquares = getAllSubjectSquares()

  // Handle creating a new subject square
  const handleCreateSquare = useCallback(() => {
    if (!newSquareName.trim()) return

    const newId = addSubjectSquare({
      name: newSquareName.trim(),
      theme: newSquareTheme,
    })

    // Reset form and close modal
    setNewSquareName('')
    setNewSquareTheme('crystalline')
    setShowAddModal(false)

    // Optionally teleport to the new square
    setCurrentSubject(newId)
    setPlayerPosition({
      x: WORLD_CONFIG.width / 2,
      y: WORLD_CONFIG.height / 2,
    })
    setMapExpanded(false)
  }, [newSquareName, newSquareTheme, addSubjectSquare, setCurrentSubject, setPlayerPosition, setMapExpanded])

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Keyboard shortcut: M to toggle map
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.key === 'm' || e.key === 'M') {
        toggleMap()
      }

      // Escape to close expanded map
      if (e.key === 'Escape' && mapExpanded) {
        setMapExpanded(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleMap, mapExpanded, setMapExpanded])

  // Teleport to a subject square
  const handleTeleport = useCallback(
    (squareId: string) => {
      if (squareId === currentSubject) {
        // Already here, just close the map
        setMapExpanded(false)
        return
      }

      // Teleport to center of the new square
      setCurrentSubject(squareId)
      setPlayerPosition({
        x: WORLD_CONFIG.width / 2,
        y: WORLD_CONFIG.height / 2,
      })
      setMapExpanded(false)
    },
    [currentSubject, setCurrentSubject, setPlayerPosition, setMapExpanded]
  )

  // Don't render until mounted (avoid hydration issues)
  if (!mounted) return null

  // Don't show map during onboarding (until subject is selected)
  if (!onboardingComplete && !currentSubject) return null

  // Don't show map if no subjects exist
  if (subjectSquares.length === 0) return null

  return (
    <>
      {/* Mini-map (always visible) */}
      <div
        className={`fixed top-4 left-4 z-40 ${className}`}
        onClick={() => setMapExpanded(true)}
      >
        <div
          className="
            w-24 h-24
            bg-black/50 backdrop-blur-sm
            rounded-lg
            border border-white/20
            p-2
            cursor-pointer
            hover:bg-black/60
            transition-colors
            grid gap-1
          "
          style={{
            gridTemplateColumns: `repeat(${Math.min(3, subjectSquares.length)}, 1fr)`,
          }}
          title="Click to expand map (M)"
        >
          {subjectSquares.slice(0, 9).map((square) => (
            <MapSquare
              key={square.id}
              square={square}
              topics={getTopicsBySubject(square.id)}
              isCurrent={square.id === currentSubject}
              isExpanded={false}
            />
          ))}
        </div>

        {/* Keyboard hint */}
        <div className="text-[10px] text-white/40 text-center mt-1">
          Press M
        </div>
      </div>

      {/* Expanded map overlay */}
      {mapExpanded && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center"
          onClick={(e) => {
            // Close when clicking backdrop
            if (e.target === e.currentTarget) {
              setMapExpanded(false)
            }
          }}
        >
          <div className="bg-black/60 rounded-2xl border border-white/20 p-8 max-w-2xl">
            <h2 className="text-white text-xl font-light mb-6 text-center">
              Your Worlds
            </h2>

            {/* Subject squares grid */}
            <div
              className="grid gap-4 mb-6"
              style={{
                gridTemplateColumns: `repeat(${Math.min(4, Math.max(2, subjectSquares.length + 1))}, 1fr)`,
              }}
            >
              {subjectSquares.map((square) => (
                <div key={square.id} className="flex flex-col items-center gap-2">
                  <MapSquare
                    square={square}
                    topics={getTopicsBySubject(square.id)}
                    isCurrent={square.id === currentSubject}
                    isExpanded={true}
                    onClick={handleTeleport}
                  />
                  <span className="text-white/70 text-sm">{square.name}</span>
                  <span className="text-white/40 text-xs">
                    {getTopicsBySubject(square.id).length} topics
                  </span>
                </div>
              ))}

              {/* Add new square button */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="
                    w-24 h-24
                    rounded-lg
                    border-2 border-dashed border-white/30
                    bg-white/5
                    hover:bg-white/10 hover:border-white/50
                    transition-all
                    flex items-center justify-center
                    group
                  "
                >
                  <svg
                    className="w-8 h-8 text-white/40 group-hover:text-white/70 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
                <span className="text-white/50 text-sm">New World</span>
              </div>
            </div>

            {/* Close hint */}
            <p className="text-white/40 text-sm text-center">
              Click a world to teleport, or press Escape to close
            </p>
          </div>
        </div>
      )}

      {/* Add new square modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false)
            }
          }}
        >
          <div className="bg-black/80 rounded-2xl border border-white/20 p-6 w-80">
            <h3 className="text-white text-lg font-light mb-4">Create New World</h3>

            {/* Name input */}
            <div className="mb-4">
              <label className="block text-white/60 text-sm mb-2">World Name</label>
              <input
                type="text"
                value={newSquareName}
                onChange={(e) => setNewSquareName(e.target.value)}
                placeholder="e.g., Mathematics"
                className="
                  w-full px-3 py-2
                  bg-white/10 border border-white/20
                  rounded-lg
                  text-white placeholder-white/40
                  focus:outline-none focus:border-white/40
                "
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newSquareName.trim()) {
                    handleCreateSquare()
                  }
                  if (e.key === 'Escape') {
                    setShowAddModal(false)
                  }
                }}
              />
            </div>

            {/* Theme selection */}
            <div className="mb-6">
              <label className="block text-white/60 text-sm mb-2">Theme</label>
              <div className="flex gap-2">
                {THEME_OPTIONS.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => setNewSquareTheme(theme.value)}
                    className={`
                      flex-1 py-2 px-3
                      rounded-lg
                      border transition-all
                      ${
                        newSquareTheme === theme.value
                          ? 'border-white/60 bg-white/10'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }
                    `}
                  >
                    <div
                      className="w-4 h-4 rounded-full mx-auto mb-1"
                      style={{ backgroundColor: theme.color }}
                    />
                    <span className="text-white/70 text-xs">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="
                  flex-1 py-2
                  rounded-lg
                  border border-white/20
                  text-white/60
                  hover:bg-white/10
                  transition-colors
                "
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSquare}
                disabled={!newSquareName.trim()}
                className="
                  flex-1 py-2
                  rounded-lg
                  bg-white/20
                  text-white
                  hover:bg-white/30
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-colors
                "
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
