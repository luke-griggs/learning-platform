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

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white/5 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onNewChat }: { onNewChat: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white/40">
          <path
            d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-white/80 mb-2">
        Start a conversation
      </h3>
      <p className="text-sm text-white/50 max-w-sm mb-6">
        Select a conversation from the sidebar or start a new one to begin exploring this topic.
      </p>
      <button
        onClick={onNewChat}
        className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm rounded-lg transition-colors"
      >
        New Conversation
      </button>
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

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col bg-[var(--background)]">
        <EmptyState onNewChat={handleNewChat} />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--background)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {conversation.messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-white/40">
                Start the conversation by typing a message below
              </p>
            </div>
          ) : (
            conversation.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}

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
