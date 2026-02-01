'use client'

import { useEffect, useState, useRef } from 'react'
import { useNavigationStore, useUserStore, useTopicStore } from '@/app/lib/store'
import { WORLD_CONFIG } from '@/app/world/constants'
import { THEME_CONFIGS } from '@/app/world/constants'
import type { SubjectTheme } from '@/app/lib/types'

const TRANSITION_DURATION = 500 // Total duration in ms

// Convert hex color to CSS rgb string
function hexToRgb(hex: number): string {
  const r = (hex >> 16) & 255
  const g = (hex >> 8) & 255
  const b = hex & 255
  return `rgb(${r}, ${g}, ${b})`
}

export function SubjectTransition() {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const [opacity, setOpacity] = useState(0)
  const transitionRef = useRef<NodeJS.Timeout | null>(null)

  const isTransitioning = useNavigationStore((s) => s.isTransitioning)
  const transitionTargetSquare = useNavigationStore((s) => s.transitionTargetSquare)
  const endTransition = useNavigationStore((s) => s.endTransition)

  const setCurrentSubject = useUserStore((s) => s.setCurrentSubjectSquare)
  const setPlayerPosition = useUserStore((s) => s.setPlayerPosition)

  const getSubjectSquare = useTopicStore((s) => s.getSubjectSquare)

  // Get target square theme for transition color
  const targetSquare = transitionTargetSquare
    ? getSubjectSquare(transitionTargetSquare)
    : null
  const targetTheme: SubjectTheme = targetSquare?.theme ?? 'crystalline'
  const transitionColor = hexToRgb(THEME_CONFIGS[targetTheme].backgroundColor)

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
    return () => {
      if (transitionRef.current) {
        clearTimeout(transitionRef.current)
      }
    }
  }, [])

  // Handle transition animation
  useEffect(() => {
    if (!isTransitioning || !transitionTargetSquare) {
      setPhase('idle')
      setOpacity(0)
      return
    }

    // Phase 1: Fade out (0 to 1 opacity)
    setPhase('out')
    setOpacity(0)

    // Start fade out
    requestAnimationFrame(() => {
      setOpacity(1)
    })

    // At midpoint: switch the subject and reset position
    transitionRef.current = setTimeout(() => {
      // Update to new subject square
      setCurrentSubject(transitionTargetSquare)

      // Reset player to center of new square
      setPlayerPosition({
        x: WORLD_CONFIG.width / 2,
        y: WORLD_CONFIG.height / 2,
      })

      // Phase 2: Fade in (1 to 0 opacity)
      setPhase('in')
    }, TRANSITION_DURATION / 2)

    // After full transition: cleanup
    const endTimeout = setTimeout(() => {
      setOpacity(0)
      setPhase('idle')
      endTransition()
    }, TRANSITION_DURATION)

    return () => {
      if (transitionRef.current) {
        clearTimeout(transitionRef.current)
      }
      clearTimeout(endTimeout)
    }
  }, [
    isTransitioning,
    transitionTargetSquare,
    setCurrentSubject,
    setPlayerPosition,
    endTransition,
  ])

  // Don't render until mounted
  if (!mounted) return null

  // Don't render when not transitioning
  if (!isTransitioning && phase === 'idle') return null

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{
        backgroundColor: transitionColor,
        opacity: opacity,
        transition: `opacity ${TRANSITION_DURATION / 2}ms ease-in-out`,
      }}
    />
  )
}
