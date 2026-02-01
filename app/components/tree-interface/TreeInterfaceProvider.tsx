'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { useTreeClickListener } from '@/app/world/hooks/useTreeInteraction'

type TreeInterfaceContextValue = {
  /** ID of the currently open topic (null if interface is closed) */
  selectedTopicId: string | null
  /** ID of the active conversation within the topic */
  activeConversationId: string | null
  /** Whether the interface is visible */
  isOpen: boolean
  /** Whether a message is being sent/processed */
  isLoading: boolean
  /** Open the interface for a specific topic */
  openTopic: (topicId: string) => void
  /** Close the interface and return to the world */
  closeTopic: () => void
  /** Select a conversation to view/continue */
  selectConversation: (conversationId: string | null) => void
  /** Navigate directly to a related topic */
  navigateToRelated: (topicId: string) => void
  /** Set loading state */
  setIsLoading: (loading: boolean) => void
}

const TreeInterfaceContext = createContext<TreeInterfaceContextValue | null>(null)

export function useTreeInterface() {
  const context = useContext(TreeInterfaceContext)
  if (!context) {
    throw new Error('useTreeInterface must be used within TreeInterfaceProvider')
  }
  return context
}

type TreeInterfaceProviderProps = {
  children: ReactNode
}

export function TreeInterfaceProvider({ children }: TreeInterfaceProviderProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isOpen = selectedTopicId !== null

  const openTopic = useCallback((topicId: string) => {
    setSelectedTopicId(topicId)
    setActiveConversationId(null) // Reset conversation when opening new topic
    setIsLoading(false)
  }, [])

  const closeTopic = useCallback(() => {
    setSelectedTopicId(null)
    setActiveConversationId(null)
    setIsLoading(false)
  }, [])

  const selectConversation = useCallback((conversationId: string | null) => {
    setActiveConversationId(conversationId)
  }, [])

  const navigateToRelated = useCallback((topicId: string) => {
    // Direct navigation: close current and open new topic
    setActiveConversationId(null)
    setSelectedTopicId(topicId)
    setIsLoading(false)
  }, [])

  // Listen for tree click events from the world
  const { subscribe, unsubscribe } = useTreeClickListener(
    useCallback((topicId: string) => {
      openTopic(topicId)
    }, [openTopic])
  )

  useEffect(() => {
    subscribe()
    return () => unsubscribe()
  }, [subscribe, unsubscribe])

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeTopic()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeTopic])

  const value: TreeInterfaceContextValue = {
    selectedTopicId,
    activeConversationId,
    isOpen,
    isLoading,
    openTopic,
    closeTopic,
    selectConversation,
    navigateToRelated,
    setIsLoading,
  }

  return (
    <TreeInterfaceContext.Provider value={value}>
      {children}
    </TreeInterfaceContext.Provider>
  )
}
