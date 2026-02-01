'use client'

import { useEffect, useRef, useState } from 'react'
import { getGrowthStage, type GrowthStage } from '@/app/lib/types'

const ANIMATION_DURATION = 1500 // ms

type GrowthAnimationState = {
  /** 0-1 current animation progress */
  animProgress: number
  /** The stage we're animating from */
  previousStage: GrowthStage
  /** The current target stage */
  currentStage: GrowthStage
  /** Whether an animation is currently running */
  isAnimating: boolean
}

/**
 * Hook to manage smooth growth transitions when engagement score changes.
 * Returns animation progress for interpolating between growth stages.
 *
 * Uses requestAnimationFrame for smooth 60fps animations and applies
 * an ease-out cubic curve for a natural "growth" feeling.
 */
export function useGrowthAnimation(
  topicId: string,
  engagementScore: number
): GrowthAnimationState {
  const currentStage = getGrowthStage(engagementScore)
  const previousStageRef = useRef<GrowthStage>(currentStage)
  const previousScoreRef = useRef<number>(engagementScore)
  const [animProgress, setAnimProgress] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const newStage = getGrowthStage(engagementScore)

    // Only animate if stage actually changed
    if (newStage !== previousStageRef.current) {
      const startTime = performance.now()
      setIsAnimating(true)
      setAnimProgress(0)

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / ANIMATION_DURATION, 1)

        // Ease out cubic for natural "growth" feel
        // Starts fast, slows down at the end
        const easedProgress = 1 - Math.pow(1 - progress, 3)
        setAnimProgress(easedProgress)

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
          previousStageRef.current = newStage
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    previousScoreRef.current = engagementScore

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [engagementScore])

  // Reset animation when topic changes
  useEffect(() => {
    setAnimProgress(1)
    setIsAnimating(false)
    previousStageRef.current = getGrowthStage(engagementScore)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [topicId, engagementScore])

  return {
    animProgress,
    previousStage: previousStageRef.current,
    currentStage,
    isAnimating,
  }
}

/**
 * Simplified hook that just returns whether the growth animation has completed.
 * Useful for triggering side effects after growth finishes.
 */
export function useGrowthComplete(
  topicId: string,
  engagementScore: number
): boolean {
  const { isAnimating } = useGrowthAnimation(topicId, engagementScore)
  return !isAnimating
}
