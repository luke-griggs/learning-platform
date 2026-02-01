'use client'

import { useConversationStore } from '@/app/lib/store'
import { ConversationItem } from './ConversationItem'

type ConversationListProps = {
  topicId: string
  activeId: string | null
  onSelect: (id: string) => void
}

export function ConversationList({ topicId, activeId, onSelect }: ConversationListProps) {
  const getConversationsByTopic = useConversationStore(
    (state) => state.getConversationsByTopic
  )

  const conversations = getConversationsByTopic(topicId)

  if (conversations.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-[14px] text-[var(--foreground-muted)]">No conversations yet</p>
        <p className="text-[12px] text-[var(--foreground-muted)] mt-1">
          Start a new chat to begin learning
        </p>
      </div>
    )
  }

  return (
    <div className="py-1">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeId}
          onSelect={() => onSelect(conversation.id)}
        />
      ))}
    </div>
  )
}
