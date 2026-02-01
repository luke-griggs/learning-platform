'use client'

import { useEffect, useCallback, useState } from 'react'
import { useNavigationStore, useUserStore, useTopicStore } from '@/app/lib/store'
import { MapSquare } from './MapSquare'
import { WORLD_CONFIG } from '@/app/world/constants'

interface MapOverlayProps {
  className?: string
}

export function MapOverlay({ className }: MapOverlayProps) {
  const [mounted, setMounted] = useState(false)

  const mapExpanded = useNavigationStore((s) => s.mapExpanded)
  const toggleMap = useNavigationStore((s) => s.toggleMap)
  const setMapExpanded = useNavigationStore((s) => s.setMapExpanded)

  const currentSubject = useUserStore((s) => s.currentSubjectSquare)
  const setCurrentSubject = useUserStore((s) => s.setCurrentSubjectSquare)
  const setPlayerPosition = useUserStore((s) => s.setPlayerPosition)
  const onboardingComplete = useUserStore((s) => s.onboardingComplete)

  const getAllSubjectSquares = useTopicStore((s) => s.getAllSubjectSquares)
  const getTopicsBySubject = useTopicStore((s) => s.getTopicsBySubject)

  const subjectSquares = getAllSubjectSquares()

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
                gridTemplateColumns: `repeat(${Math.min(4, Math.max(2, subjectSquares.length))}, 1fr)`,
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
            </div>

            {/* Close hint */}
            <p className="text-white/40 text-sm text-center">
              Click a world to teleport, or press Escape to close
            </p>
          </div>
        </div>
      )}
    </>
  )
}
