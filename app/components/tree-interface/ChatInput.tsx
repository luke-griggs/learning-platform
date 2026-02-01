'use client'

import { useState, useRef, useEffect, type KeyboardEvent } from 'react'

type ChatInputProps = {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSend, disabled = false, placeholder = 'Reply...' }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
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

  const canSend = value.trim() && !disabled

  return (
    <div className="px-4 pb-6 pt-2">
      {/* Floating input card */}
      <div
        className={`
          relative bg-[var(--surface)] rounded-2xl
          transition-shadow duration-200 ease-out
          ${isFocused ? 'shadow-[var(--shadow-lg)]' : 'shadow-[var(--shadow-input)]'}
        `}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className={`
            w-full bg-transparent
            px-4 pt-3.5 pb-12 text-[15px] text-[var(--foreground)]
            placeholder-[var(--foreground-muted)]
            resize-none focus:outline-none
            leading-relaxed
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />

        {/* Bottom toolbar */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          {/* Left actions */}
          <div className="flex items-center gap-1">
            {/* Attach button */}
            <button
              type="button"
              className="p-2 rounded-lg text-[var(--foreground-tertiary)] hover:text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] transition-all duration-150"
              aria-label="Attach file"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 3.75V14.25M3.75 9H14.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Emoji button */}
            <button
              type="button"
              className="p-2 rounded-lg text-[var(--foreground-tertiary)] hover:text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] transition-all duration-150"
              aria-label="Add emoji"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="6.5" cy="7.5" r="1" fill="currentColor"/>
                <circle cx="11.5" cy="7.5" r="1" fill="currentColor"/>
                <path
                  d="M6 11C6.5 12 7.5 12.5 9 12.5C10.5 12.5 11.5 12 12 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={!canSend}
            className={`
              p-2.5 rounded-xl
              flex items-center justify-center
              transition-all duration-200 ease-out
              ${canSend
                ? 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white hover:scale-105 hover:-translate-y-0.5 active:scale-95'
                : 'bg-[var(--background-tertiary)] text-[var(--foreground-muted)] cursor-not-allowed'
              }
            `}
            aria-label="Send message"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 12V4M8 4L4 8M8 4L12 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
