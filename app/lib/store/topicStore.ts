import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Topic, Position, SubjectSquare } from '@/app/lib/types'

type TopicState = {
  topics: Map<string, Topic>
  subjectSquares: Map<string, SubjectSquare>

  // Topic CRUD
  addTopic: (topic: Omit<Topic, 'id' | 'createdAt' | 'engagementScore' | 'relatedTopicIds'>) => string
  updateTopic: (id: string, updates: Partial<Topic>) => void
  deleteTopic: (id: string) => void
  getTopic: (id: string) => Topic | undefined
  getTopicsBySubject: (subjectSquare: string) => Topic[]

  // Position management
  updateTopicPosition: (id: string, position: Position) => void

  // Engagement
  updateEngagement: (id: string, score: number) => void

  // Relationships
  addRelationship: (topicA: string, topicB: string) => void
  removeRelationship: (topicA: string, topicB: string) => void

  // Subject squares
  addSubjectSquare: (square: Omit<SubjectSquare, 'id' | 'topicIds'>) => string
  getSubjectSquare: (id: string) => SubjectSquare | undefined
  getAllSubjectSquares: () => SubjectSquare[]
}

function generateId(): string {
  return crypto.randomUUID()
}

export const useTopicStore = create<TopicState>()(
  persist(
    (set, get) => ({
      topics: new Map(),
      subjectSquares: new Map(),

      addTopic: (topicData) => {
        const id = generateId()
        const topic: Topic = {
          ...topicData,
          id,
          createdAt: new Date(),
          engagementScore: 0,
          relatedTopicIds: [],
        }

        set((state) => {
          const newTopics = new Map(state.topics)
          newTopics.set(id, topic)

          // Also add to subject square
          const newSquares = new Map(state.subjectSquares)
          const square = newSquares.get(topic.subjectSquare)
          if (square) {
            newSquares.set(topic.subjectSquare, {
              ...square,
              topicIds: [...square.topicIds, id],
            })
          }

          return { topics: newTopics, subjectSquares: newSquares }
        })

        return id
      },

      updateTopic: (id, updates) => {
        set((state) => {
          const topic = state.topics.get(id)
          if (!topic) return state

          const newTopics = new Map(state.topics)
          newTopics.set(id, { ...topic, ...updates })
          return { topics: newTopics }
        })
      },

      deleteTopic: (id) => {
        set((state) => {
          const topic = state.topics.get(id)
          if (!topic) return state

          const newTopics = new Map(state.topics)
          newTopics.delete(id)

          // Remove from subject square
          const newSquares = new Map(state.subjectSquares)
          const square = newSquares.get(topic.subjectSquare)
          if (square) {
            newSquares.set(topic.subjectSquare, {
              ...square,
              topicIds: square.topicIds.filter((tid) => tid !== id),
            })
          }

          // Remove this topic from all related topics
          newTopics.forEach((t, tid) => {
            if (t.relatedTopicIds.includes(id)) {
              newTopics.set(tid, {
                ...t,
                relatedTopicIds: t.relatedTopicIds.filter((rid) => rid !== id),
              })
            }
          })

          return { topics: newTopics, subjectSquares: newSquares }
        })
      },

      getTopic: (id) => get().topics.get(id),

      getTopicsBySubject: (subjectSquare) => {
        const topics: Topic[] = []
        get().topics.forEach((topic) => {
          if (topic.subjectSquare === subjectSquare) {
            topics.push(topic)
          }
        })
        return topics
      },

      updateTopicPosition: (id, position) => {
        set((state) => {
          const topic = state.topics.get(id)
          if (!topic) return state

          const newTopics = new Map(state.topics)
          newTopics.set(id, { ...topic, position })
          return { topics: newTopics }
        })
      },

      updateEngagement: (id, score) => {
        set((state) => {
          const topic = state.topics.get(id)
          if (!topic) return state

          const newTopics = new Map(state.topics)
          // Clamp score between 0-100
          const clampedScore = Math.max(0, Math.min(100, score))
          newTopics.set(id, { ...topic, engagementScore: clampedScore })
          return { topics: newTopics }
        })
      },

      addRelationship: (topicA, topicB) => {
        if (topicA === topicB) return

        set((state) => {
          const a = state.topics.get(topicA)
          const b = state.topics.get(topicB)
          if (!a || !b) return state

          const newTopics = new Map(state.topics)

          // Add bidirectional relationship if not already present
          if (!a.relatedTopicIds.includes(topicB)) {
            newTopics.set(topicA, {
              ...a,
              relatedTopicIds: [...a.relatedTopicIds, topicB],
            })
          }
          if (!b.relatedTopicIds.includes(topicA)) {
            newTopics.set(topicB, {
              ...b,
              relatedTopicIds: [...b.relatedTopicIds, topicA],
            })
          }

          return { topics: newTopics }
        })
      },

      removeRelationship: (topicA, topicB) => {
        set((state) => {
          const a = state.topics.get(topicA)
          const b = state.topics.get(topicB)
          if (!a || !b) return state

          const newTopics = new Map(state.topics)

          newTopics.set(topicA, {
            ...a,
            relatedTopicIds: a.relatedTopicIds.filter((id) => id !== topicB),
          })
          newTopics.set(topicB, {
            ...b,
            relatedTopicIds: b.relatedTopicIds.filter((id) => id !== topicA),
          })

          return { topics: newTopics }
        })
      },

      addSubjectSquare: (squareData) => {
        const id = squareData.name.toLowerCase().replace(/\s+/g, '-')
        const square: SubjectSquare = {
          ...squareData,
          id,
          topicIds: [],
        }

        set((state) => {
          const newSquares = new Map(state.subjectSquares)
          newSquares.set(id, square)
          return { subjectSquares: newSquares }
        })

        return id
      },

      getSubjectSquare: (id) => get().subjectSquares.get(id),

      getAllSubjectSquares: () => Array.from(get().subjectSquares.values()),
    }),
    {
      name: 'topic-storage',
      // Custom serialization for Map and Date
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null

          const parsed = JSON.parse(str)
          return {
            ...parsed,
            state: {
              ...parsed.state,
              topics: new Map(
                parsed.state.topics.map(([k, v]: [string, Topic]) => [
                  k,
                  { ...v, createdAt: new Date(v.createdAt) },
                ])
              ),
              subjectSquares: new Map(parsed.state.subjectSquares),
            },
          }
        },
        setItem: (name, value) => {
          const serialized = {
            ...value,
            state: {
              ...value.state,
              topics: Array.from(value.state.topics.entries()),
              subjectSquares: Array.from(value.state.subjectSquares.entries()),
            },
          }
          localStorage.setItem(name, JSON.stringify(serialized))
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)
