'use client'

import { useState, useRef, useEffect, type KeyboardEvent } from 'react'

type ChatInputProps = {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [value])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (trimmed && !disabled) {
      onSend(trimmed)
      setValue('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-white/10 p-4 bg-white/[0.02]">
      <div className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type a message..."
          rows={1}
          className={`
            flex-1 bg-white/5 border border-white/10 rounded-xl
            px-4 py-3 text-sm text-white placeholder-white/40
            resize-none focus:outline-none focus:border-white/20
            transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className={`
            shrink-0 w-10 h-10 rounded-xl
            flex items-center justify-center
            transition-all
            ${value.trim() && !disabled
              ? 'bg-white/15 hover:bg-white/20 text-white'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
            }
          `}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M16 2L8 10M16 2L11 16L8 10L2 7L16 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <p className="text-[10px] text-white/30 mt-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}
