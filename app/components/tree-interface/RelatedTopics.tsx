'use client'

import { useTopicStore } from '@/app/lib/store'
import { useTreeInterface } from './TreeInterfaceProvider'

type RelatedTopicsProps = {
  relatedTopicIds: string[]
}

export function RelatedTopics({ relatedTopicIds }: RelatedTopicsProps) {
  const { navigateToRelated } = useTreeInterface()
  const getTopic = useTopicStore((state) => state.getTopic)

  if (relatedTopicIds.length === 0) {
    return (
      <div className="border-t border-white/5">
        <div className="px-4 py-3">
          <h2 className="text-sm font-medium text-white/80">Related</h2>
          <p className="text-xs text-white/40 mt-1">No related topics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-white/5">
      <div className="px-4 py-3">
        <h2 className="text-sm font-medium text-white/80">Related</h2>
      </div>

      <div className="pb-3">
        {relatedTopicIds.map((topicId) => {
          const topic = getTopic(topicId)
          if (!topic) return null

          return (
            <button
              key={topicId}
              onClick={() => navigateToRelated(topicId)}
              className="w-full px-4 py-2 flex items-center gap-2 text-left hover:bg-white/5 transition-colors group"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="text-white/30 group-hover:text-white/50 transition-colors shrink-0"
              >
                <path
                  d="M5.25 3.5L8.75 7L5.25 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors truncate">
                {topic.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
