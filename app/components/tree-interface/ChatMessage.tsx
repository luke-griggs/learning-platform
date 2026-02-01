'use client'

import { useState } from 'react'
import type { Message } from '@/app/lib/types'

type ChatMessageProps = {
  message: Message
}

/** Claude-style spark/asterisk icon */
function SparkIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M10 2C10 2 10.5 6 10 8C12 8 16 8 16 8C16 8 12 8.5 10 9C10 11 10 16 10 16C10 16 9.5 11 10 9C8 9 4 9 4 9C4 9 8 8.5 10 8C10 6 10 2 10 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Copy icon */
function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="4" y="4" width="7" height="8" rx="1" stroke="currentColor" strokeWidth="1.25"/>
      <path d="M3 10V3C3 2.44772 3.44772 2 4 2H9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  )
}

/** Thumbs up icon */
function ThumbsUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M4 6.5V12M7 6.5L8 2.5C8.5 2 9.5 2 10 2.5C10.5 3 10.5 3.5 10.5 4V5.5H12.5C13 5.5 13.5 6 13.5 6.5V8L12 12H7C5.5 12 4 12 4 12V6.5H7Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/** Thumbs down icon */
function ThumbsDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M4 7.5V2M7 7.5L8 11.5C8.5 12 9.5 12 10 11.5C10.5 11 10.5 10.5 10.5 10V8.5H12.5C13 8.5 13.5 8 13.5 7.5V6L12 2H7C5.5 2 4 2 4 2V7.5H7Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/** Retry icon */
function RetryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M11 7C11 9.20914 9.20914 11 7 11C4.79086 11 3 9.20914 3 7C3 4.79086 4.79086 3 7 3C8.5 3 9.8 3.8 10.5 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
      <path d="M10 2V5H13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function FeedbackButton({
  icon,
  label,
  onClick,
  isActive,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  isActive?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`
        p-1.5 rounded-md transition-all duration-150
        ${isActive
          ? 'text-[var(--foreground-secondary)] bg-[var(--background-tertiary)]'
          : 'text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]'
        }
      `}
      aria-label={label}
    >
      {icon}
    </button>
  )
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-md bg-[var(--user-message-bg)]">
          <p className="text-[15px] text-[var(--foreground)] whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="group animate-fade-in">
      <div className="flex items-start gap-3">
        {/* AI Icon */}
        <div className="shrink-0 mt-0.5">
          <SparkIcon className="text-[var(--accent)]" />
        </div>

        {/* Message content */}
        <div className="flex-1 min-w-0">
          <p className="text-[15px] text-[var(--foreground)] whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>

          {/* Feedback actions */}
          <div className="flex items-center gap-0.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <FeedbackButton
              icon={<CopyIcon />}
              label={copied ? 'Copied!' : 'Copy'}
              onClick={handleCopy}
              isActive={copied}
            />
            <FeedbackButton icon={<ThumbsUpIcon />} label="Good response" />
            <FeedbackButton icon={<ThumbsDownIcon />} label="Bad response" />
            <FeedbackButton icon={<RetryIcon />} label="Retry" />
          </div>
        </div>
      </div>
    </div>
  )
}
