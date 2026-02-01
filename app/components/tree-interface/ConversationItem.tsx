'use client'

import type { Conversation } from '@/app/lib/types'

type ConversationItemProps = {
  conversation: Conversation
  isActive: boolean
  onSelect: () => void
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
}: ConversationItemProps) {
  const lastMessage = conversation.messages[conversation.messages.length - 1]
  const preview = lastMessage
    ? truncate(lastMessage.content, 60)
    : 'No messages yet'

  return (
    <button
      onClick={onSelect}
      className={`
        w-full px-4 py-3 text-left transition-colors
        ${isActive
          ? 'bg-white/10 border-l-2 border-white/50'
          : 'hover:bg-white/5 border-l-2 border-transparent'
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-white/90 truncate flex-1">
          {conversation.title}
        </h3>
        <span className="text-[10px] text-white/40 shrink-0">
          {formatRelativeTime(conversation.updatedAt)}
        </span>
      </div>
      <p className="text-xs text-white/50 mt-1 line-clamp-2">
        {preview}
      </p>
    </button>
  )
}
