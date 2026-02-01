'use client'

import { useEffect, useRef } from 'react'
import type { InputState } from '../types'

/**
 * Hook for handling WASD and arrow key input for player movement.
 * Returns a ref to the current input state that updates in real-time.
 */
export function useKeyboard(): InputState {
  const inputRef = useRef<InputState>({
    up: false,
    down: false,
    left: false,
    right: false,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          inputRef.current.up = true
          e.preventDefault()
          break
        case 's':
        case 'arrowdown':
          inputRef.current.down = true
          e.preventDefault()
          break
        case 'a':
        case 'arrowleft':
          inputRef.current.left = true
          e.preventDefault()
          break
        case 'd':
        case 'arrowright':
          inputRef.current.right = true
          e.preventDefault()
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          inputRef.current.up = false
          break
        case 's':
        case 'arrowdown':
          inputRef.current.down = false
          break
        case 'a':
        case 'arrowleft':
          inputRef.current.left = false
          break
        case 'd':
        case 'arrowright':
          inputRef.current.right = false
          break
      }
    }

    // Reset on blur (when user tabs away)
    const handleBlur = () => {
      inputRef.current.up = false
      inputRef.current.down = false
      inputRef.current.left = false
      inputRef.current.right = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  // Return the ref's current value - components using useTick will read latest
  return inputRef.current
}
