'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useTreeInterface } from './TreeInterfaceProvider'
import { useTopicStore } from '@/app/lib/store'
import { Sidebar } from './Sidebar'
import { ChatView } from './ChatView'

function Header({ topicName, onClose }: { topicName: string; onClose: () => void }) {
  return (
    <header className="flex items-center justify-between h-14 px-4 bg-[var(--surface)]">
      <button
        onClick={onClose}
        className="
          flex items-center gap-2 px-3 py-2 -ml-3 rounded-lg
          text-[14px] text-[var(--foreground-secondary)]
          hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)]
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
            d="M10 3L5 8L10 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </button>

      <h1 className="text-[15px] font-medium text-[var(--foreground)]">
        {topicName}
      </h1>

      {/* Spacer for centering */}
      <div className="w-20" />
    </header>
  )
}

export function TreeInterface() {
  const { isOpen, selectedTopicId, closeTopic } = useTreeInterface()
  const getTopic = useTopicStore((state) => state.getTopic)

  const topic = selectedTopicId ? getTopic(selectedTopicId) : null

  return (
    <AnimatePresence>
      {isOpen && topic && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-[var(--background)]"
        >
          <Header topicName={topic.name} onClose={closeTopic} />

          <div className="flex h-[calc(100vh-56px)]">
            <Sidebar topic={topic} />
            <ChatView />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
