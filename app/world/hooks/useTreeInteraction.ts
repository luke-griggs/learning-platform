'use client'

import { useCallback } from 'react'
import type { TreeInteractionEvent } from '../types/trees'

type UseTreeInteractionOptions = {
  /** Callback when a tree is clicked */
  onTreeClick?: (topicId: string) => void
  /** Callback when hover state changes (null = no tree hovered) */
  onTreeHover?: (topicId: string | null) => void
}

/**
 * Hook to handle tree interaction events and connect to external systems.
 * Emits custom DOM events for non-React listeners and calls provided callbacks.
 *
 * The custom DOM events allow other parts of the application (like the tree
 * interface overlay) to listen for tree clicks without tight React coupling.
 *
 * @example
 * ```tsx
 * const { handleInteraction } = useTreeInteraction({
 *   onTreeClick: (topicId) => setSelectedTopic(topicId),
 *   onTreeHover: (topicId) => setHoveredTopic(topicId)
 * })
 *
 * return <TreeContainer onInteraction={handleInteraction} />
 * ```
 */
export function useTreeInteraction(options: UseTreeInteractionOptions = {}) {
  const { onTreeClick, onTreeHover } = options

  const handleInteraction = useCallback(
    (event: TreeInteractionEvent) => {
      switch (event.type) {
        case 'click':
          // Emit custom DOM event for non-React listeners
          // This allows the tree interface overlay to respond
          window.dispatchEvent(
            new CustomEvent('tree:click', {
              detail: {
                topicId: event.topicId,
                position: event.position,
              },
            })
          )
          onTreeClick?.(event.topicId)
          break

        case 'hover_start':
          onTreeHover?.(event.topicId)
          break

        case 'hover_end':
          onTreeHover?.(null)
          break
      }
    },
    [onTreeClick, onTreeHover]
  )

  return { handleInteraction }
}

/**
 * Hook to listen for tree click events from anywhere in the app.
 * Useful for components outside the PixiJS canvas that need to respond
 * to tree interactions.
 *
 * @example
 * ```tsx
 * useTreeClickListener((topicId, position) => {
 *   setSelectedTopic(topicId)
 *   setShowInterface(true)
 * })
 * ```
 */
export function useTreeClickListener(
  callback: (topicId: string, position: { x: number; y: number }) => void
) {
  // Note: This would typically use useEffect to add/remove the listener
  // Keeping it simple here - the component using this should manage the effect

  const listener = useCallback(
    (e: CustomEvent<{ topicId: string; position: { x: number; y: number } }>) => {
      callback(e.detail.topicId, e.detail.position)
    },
    [callback]
  )

  return {
    /**
     * Add the listener - call this in useEffect
     */
    subscribe: () => {
      window.addEventListener('tree:click', listener as EventListener)
    },
    /**
     * Remove the listener - call this in useEffect cleanup
     */
    unsubscribe: () => {
      window.removeEventListener('tree:click', listener as EventListener)
    },
  }
}
