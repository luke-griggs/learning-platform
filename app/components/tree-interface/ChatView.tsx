'use client'

import { useEffect, useRef } from 'react'
import { useConversationStore, useTopicStore } from '@/app/lib/store'
import { useTreeInterface } from './TreeInterfaceProvider'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'

/** Mock response generator - simulates AI response */
async function getMockResponse(message: string, topicName: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 700))

  const responses = [
    `That's a great question about ${topicName}! Let me think about this...

The key insight here is that understanding the fundamentals helps you build a stronger mental model. Would you like me to explain any specific aspect in more detail?`,
    `Interesting perspective! In the context of ${topicName}, there are a few things to consider:

1. The underlying principles
2. How this connects to related concepts
3. Practical applications

What aspect would you like to explore further?`,
    `I can help you understand this better. When learning about ${topicName}, it's useful to break down the concept into smaller parts.

What specific area would you like to focus on?`,
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

/** Generate a title from the first message */
function generateTitle(message: string): string {
  const cleaned = message.replace(/\s+/g, ' ').trim()
  if (cleaned.length <= 50) return cleaned
  return cleaned.slice(0, 47).trim() + '...'
}

/** Spark icon for typing indicator */
function SparkIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 2C10 2 10.5 6 10 8C12 8 16 8 16 8C16 8 12 8.5 10 9C10 11 10 16 10 16C10 16 9.5 11 10 9C8 9 4 9 4 9C4 9 8 8.5 10 8C10 6 10 2 10 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="shrink-0 mt-0.5">
        <SparkIcon className="text-[var(--accent)]" />
      </div>
      <div className="flex gap-1.5 py-2">
        <span className="w-2 h-2 bg-[var(--foreground-muted)] rounded-full typing-dot" />
        <span className="w-2 h-2 bg-[var(--foreground-muted)] rounded-full typing-dot" />
        <span className="w-2 h-2 bg-[var(--foreground-muted)] rounded-full typing-dot" />
      </div>
    </div>
  )
}

/** No conversation selected - prompt to select or create */
function NoConversationState({ onNewChat }: { onNewChat: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
      {/* Spark icon */}
      <div className="mb-6">
        <SparkIcon className="w-10 h-10 text-[var(--accent)]" />
      </div>

      <h3 className="text-xl font-medium text-[var(--foreground)] mb-2">
        Start a conversation
      </h3>
      <p className="text-[15px] text-[var(--foreground-secondary)] max-w-sm mb-8 leading-relaxed">
        Select a conversation from the sidebar or start a new one to begin exploring this topic.
      </p>
      <button
        onClick={onNewChat}
        className="
          px-5 py-2.5 rounded-xl text-[15px] font-medium
          bg-[var(--accent)] text-white
          hover:bg-[var(--accent-hover)]
          transition-all duration-200 ease-out
          hover:scale-105 hover:-translate-y-0.5
          active:scale-95
        "
      >
        New Conversation
      </button>
    </div>
  )
}

/** Get greeting based on time of day */
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/** Fresh chat state - centered input like Claude */
function FreshChatState({
  topicName,
  onSend,
  disabled,
}: {
  topicName: string
  onSend: (message: string) => void
  disabled: boolean
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      {/* Greeting */}
      <div className="flex items-center gap-3 mb-8">
        <SparkIcon className="w-8 h-8 text-[var(--accent)]" />
        <h1 className="text-3xl font-medium text-[var(--foreground)]">
          {getGreeting()}
        </h1>
      </div>

      {/* Topic context */}
      <p className="text-[15px] text-[var(--foreground-secondary)] mb-8">
        Let&apos;s explore <span className="font-medium text-[var(--foreground)]">{topicName}</span>
      </p>

      {/* Centered input */}
      <div className="w-full max-w-2xl">
        <ChatInput onSend={onSend} disabled={disabled} placeholder="How can I help you today?" />
      </div>
    </div>
  )
}

export function ChatView() {
  const { selectedTopicId, activeConversationId, selectConversation, isLoading, setIsLoading } = useTreeInterface()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const getConversation = useConversationStore((state) => state.getConversation)
  const addMessage = useConversationStore((state) => state.addMessage)
  const updateConversationTitle = useConversationStore((state) => state.updateConversationTitle)
  const createConversation = useConversationStore((state) => state.createConversation)

  const getTopic = useTopicStore((state) => state.getTopic)
  const updateEngagement = useTopicStore((state) => state.updateEngagement)

  const conversation = activeConversationId
    ? getConversation(activeConversationId)
    : null

  const topic = selectedTopicId ? getTopic(selectedTopicId) : null

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages.length, isLoading])

  const handleNewChat = () => {
    if (!selectedTopicId) return
    const id = createConversation(selectedTopicId)
    selectConversation(id)
  }

  const handleSend = async (content: string) => {
    if (!activeConversationId || !topic) return

    // Add user message
    addMessage(activeConversationId, 'user', content)

    // Auto-generate title if this is the first message
    const currentConv = getConversation(activeConversationId)
    if (currentConv && currentConv.messages.length === 0) {
      updateConversationTitle(activeConversationId, generateTitle(content))
    }

    // Update engagement score (trees grow as you interact)
    if (selectedTopicId) {
      const currentTopic = getTopic(selectedTopicId)
      if (currentTopic) {
        updateEngagement(selectedTopicId, Math.min(100, currentTopic.engagementScore + 2))
      }
    }

    // Show typing indicator
    setIsLoading(true)

    try {
      // Get mock response
      const response = await getMockResponse(content, topic.name)
      addMessage(activeConversationId, 'assistant', response)
    } finally {
      setIsLoading(false)
    }
  }

  // No conversation selected
  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col bg-[var(--background)]">
        <NoConversationState onNewChat={handleNewChat} />
      </div>
    )
  }

  // Fresh conversation with no messages - centered layout like Claude
  if (conversation.messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-[var(--background)]">
        <FreshChatState
          topicName={topic?.name || 'this topic'}
          onSend={handleSend}
          disabled={isLoading}
        />
      </div>
    )
  }

  // Conversation with messages - traditional layout
  return (
    <div className="flex-1 flex flex-col bg-[var(--background)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
          {conversation.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="max-w-2xl mx-auto w-full">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  )
}
