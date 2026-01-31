import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Conversation, Message } from '@/app/lib/types'

type ConversationState = {
  conversations: Map<string, Conversation>

  // Conversation CRUD
  createConversation: (topicId: string, title?: string) => string
  deleteConversation: (id: string) => void
  getConversation: (id: string) => Conversation | undefined
  getConversationsByTopic: (topicId: string) => Conversation[]

  // Message operations
  addMessage: (conversationId: string, role: 'user' | 'assistant', content: string) => void
  updateConversationTitle: (id: string, title: string) => void
}

function generateId(): string {
  return crypto.randomUUID()
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: new Map(),

      createConversation: (topicId, title) => {
        const id = generateId()
        const now = new Date()
        const conversation: Conversation = {
          id,
          topicId,
          title: title || 'New Conversation',
          messages: [],
          createdAt: now,
          updatedAt: now,
        }

        set((state) => {
          const newConversations = new Map(state.conversations)
          newConversations.set(id, conversation)
          return { conversations: newConversations }
        })

        return id
      },

      deleteConversation: (id) => {
        set((state) => {
          const newConversations = new Map(state.conversations)
          newConversations.delete(id)
          return { conversations: newConversations }
        })
      },

      getConversation: (id) => get().conversations.get(id),

      getConversationsByTopic: (topicId) => {
        const conversations: Conversation[] = []
        get().conversations.forEach((conv) => {
          if (conv.topicId === topicId) {
            conversations.push(conv)
          }
        })
        // Sort by most recent first
        return conversations.sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
        )
      },

      addMessage: (conversationId, role, content) => {
        set((state) => {
          const conversation = state.conversations.get(conversationId)
          if (!conversation) return state

          const message: Message = {
            id: generateId(),
            role,
            content,
            timestamp: new Date(),
          }

          const newConversations = new Map(state.conversations)
          newConversations.set(conversationId, {
            ...conversation,
            messages: [...conversation.messages, message],
            updatedAt: new Date(),
          })

          return { conversations: newConversations }
        })
      },

      updateConversationTitle: (id, title) => {
        set((state) => {
          const conversation = state.conversations.get(id)
          if (!conversation) return state

          const newConversations = new Map(state.conversations)
          newConversations.set(id, {
            ...conversation,
            title,
            updatedAt: new Date(),
          })

          return { conversations: newConversations }
        })
      },
    }),
    {
      name: 'conversation-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null

          const parsed = JSON.parse(str)
          return {
            ...parsed,
            state: {
              ...parsed.state,
              conversations: new Map(
                parsed.state.conversations.map(
                  ([k, v]: [string, Conversation]) => [
                    k,
                    {
                      ...v,
                      createdAt: new Date(v.createdAt),
                      updatedAt: new Date(v.updatedAt),
                      messages: v.messages.map((m: Message) => ({
                        ...m,
                        timestamp: new Date(m.timestamp),
                      })),
                    },
                  ]
                )
              ),
            },
          }
        },
        setItem: (name, value) => {
          const serialized = {
            ...value,
            state: {
              ...value.state,
              conversations: Array.from(value.state.conversations.entries()),
            },
          }
          localStorage.setItem(name, JSON.stringify(serialized))
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)
