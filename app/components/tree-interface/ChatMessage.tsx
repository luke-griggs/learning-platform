'use client'

import type { Message } from '@/app/lib/types'

type ChatMessageProps = {
  message: Message
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
    >
      <div
        className={`
          max-w-[80%] px-4 py-3 rounded-2xl
          ${isUser
            ? 'bg-white/15 text-white rounded-br-sm'
            : 'bg-white/5 text-white/90 rounded-bl-sm'
          }
        `}
      >
        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
        </p>
        <span
          className={`
            text-[10px] mt-2 block
            opacity-0 group-hover:opacity-100 transition-opacity
            ${isUser ? 'text-white/40 text-right' : 'text-white/30'}
          `}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  )
}
