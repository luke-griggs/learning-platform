'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useTreeInterface } from './TreeInterfaceProvider'
import { useTopicStore } from '@/app/lib/store'
import { Sidebar } from './Sidebar'
import { ChatView } from './ChatView'

function Header({ topicName, onClose }: { topicName: string; onClose: () => void }) {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-white/10">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="rotate-180"
        >
          <path
            d="M6 3L11 8L6 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to Forest
      </button>

      <h1 className="text-lg font-medium text-white">{topicName}</h1>

      <div className="w-24" /> {/* Spacer for centering */}
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
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-[var(--background)]"
        >
          <Header topicName={topic.name} onClose={closeTopic} />

          <div className="flex h-[calc(100vh-64px)]">
            <Sidebar topic={topic} />
            <ChatView />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
