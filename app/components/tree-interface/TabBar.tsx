'use client'

import { motion } from 'framer-motion'

export type TabId = 'chat' | 'exercises'

type Tab = {
  id: TabId
  label: string
}

const tabs: Tab[] = [
  { id: 'chat', label: 'Chat' },
  { id: 'exercises', label: 'Exercises' },
]

type TabBarProps = {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="inline-flex p-1 rounded-xl bg-[var(--background-secondary)]">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative px-4 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200"
          >
            {/* Active background indicator */}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[var(--surface)] rounded-lg shadow-[var(--shadow-sm)]"
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 35,
                }}
              />
            )}

            {/* Label */}
            <span
              className={`
                relative z-10 transition-colors duration-200
                ${isActive
                  ? 'text-[var(--foreground)]'
                  : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)]'
                }
              `}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
