'use client'

import type { Topic } from '@/app/lib/types'
import { useConversationStore } from '@/app/lib/store'
import { useTreeInterface } from './TreeInterfaceProvider'
import { ConversationList } from './ConversationList'
import { ExerciseSection } from './ExerciseSection'
import { RelatedTopics } from './RelatedTopics'

type SidebarProps = {
  topic: Topic
}

export function Sidebar({ topic }: SidebarProps) {
  const { selectConversation, activeConversationId } = useTreeInterface()
  const createConversation = useConversationStore((state) => state.createConversation)

  const handleNewChat = () => {
    const conversationId = createConversation(topic.id)
    selectConversation(conversationId)
  }

  return (
    <aside className="w-72 h-full border-r border-white/10 flex flex-col bg-white/[0.02]">
      {/* Conversations Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-white/80">Conversations</h2>
            <button
              onClick={handleNewChat}
              className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 2V10M2 6H10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              New
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ConversationList
            topicId={topic.id}
            activeId={activeConversationId}
            onSelect={selectConversation}
          />
        </div>
      </div>

      {/* Exercises Section */}
      <ExerciseSection topicId={topic.id} />

      {/* Related Topics Section */}
      <RelatedTopics relatedTopicIds={topic.relatedTopicIds} />
    </aside>
  )
}
