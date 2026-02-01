'use client'

import { useState } from 'react'
import type { Topic } from '@/app/lib/types'
import { useConversationStore } from '@/app/lib/store'
import { useTreeInterface } from './TreeInterfaceProvider'
import { ConversationList } from './ConversationList'
import { ExerciseSidebarList } from './ExerciseSidebarList'
import { TabBar, type TabId } from './TabBar'

type SidebarProps = {
  topic: Topic
}

export function Sidebar({ topic }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabId>('chat')
  const { selectConversation, activeConversationId } = useTreeInterface()
  const createConversation = useConversationStore((state) => state.createConversation)

  const handleNewChat = () => {
    const conversationId = createConversation(topic.id)
    selectConversation(conversationId)
  }

  return (
    <aside className="w-72 h-full flex flex-col bg-[var(--surface)] shadow-[var(--shadow-md)]">
      {/* Tab Bar */}
      <div className="px-4 py-4">
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* New Chat Button */}
      {activeTab === 'chat' && (
        <div className="px-3">
          <button
            onClick={handleNewChat}
            className="
              w-full flex items-center gap-2 px-3 py-2.5 rounded-lg
              text-[14px] text-[var(--foreground-secondary)]
              hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]
              transition-all duration-150
              group
            "
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-[var(--foreground-tertiary)] group-hover:text-[var(--foreground-secondary)] transition-colors"
            >
              <path
                d="M8 3V13M3 8H13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            New chat
          </button>
        </div>
      )}

      {/* Content based on active tab */}
      <div className="flex-1 overflow-y-auto custom-scrollbar mt-1">
        {activeTab === 'chat' ? (
          <ConversationList
            topicId={topic.id}
            activeId={activeConversationId}
            onSelect={selectConversation}
          />
        ) : (
          <ExerciseSidebarList topicId={topic.id} />
        )}
      </div>
    </aside>
  )
}
