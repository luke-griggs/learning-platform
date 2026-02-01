# Feature: Data Layer

## Overview

The underlying data model and state management for the entire platform. This includes the graph structure connecting topics, conversation storage, and engagement tracking.

## Responsibilities

- Define the data schema for topics, conversations, exercises, relationships
- Manage the graph structure connecting all topics (even across subject squares)
- Track engagement scores that drive tree growth
- Persist data (local storage initially, backend later)
- Provide reactive state that UI and world components can subscribe to
- Handle CRUD operations for topics, conversations, exercises

## Technical Requirements

### Stack
- **Zustand** for client-side state management (simple, works great with React)
- **Local Storage** for persistence (MVP)
- Future: API routes + database (Postgres, Prisma)

### Architecture
```
app/
  lib/
    store/
      topicStore.ts       # Topics, positions, relationships
      conversationStore.ts # Chat histories per topic
      exerciseStore.ts    # Exercises per topic
      userStore.ts        # User preferences, companion settings
    types/
      index.ts            # All TypeScript interfaces
    graph/
      relationshipGraph.ts # Graph operations, finding related topics
```

### Core Data Types

```typescript
type Topic = {
  id: string
  name: string
  subjectSquare: string      // "math", "biology", etc.
  position: Position         // x, y in the world
  createdAt: Date
  engagementScore: number    // Drives tree growth
  relatedTopicIds: string[]  // Edges in the graph
}

type Conversation = {
  id: string
  topicId: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type Exercise = {
  id: string
  topicId: string
  type: 'problem' | 'quiz' | 'reflection'
  prompt: string
  userAnswer?: string
  completed: boolean
  createdAt: Date
}

type SubjectSquare = {
  id: string
  name: string              // "Math", "Biology", etc.
  theme: 'crystalline' | 'organic' | 'angular'
  topicIds: string[]
}

type UserState = {
  currentSubjectSquare: string
  playerPosition: Position
  companionStyle: string
  onboardingComplete: boolean
}
```

### Graph Structure

The relationship graph connects topics regardless of subject square:

```typescript
type TopicGraph = {
  nodes: Map<string, Topic>
  edges: Map<string, string[]>  // topicId -> related topicIds

  addRelationship(topicA: string, topicB: string): void
  getRelated(topicId: string, depth?: number): Topic[]
  findPath(from: string, to: string): Topic[]
}
```

### Engagement Calculation

```typescript
function calculateEngagement(topic: Topic, conversations: Conversation[], exercises: Exercise[]): number {
  // Factors:
  // - Number of conversations
  // - Total messages exchanged
  // - Recency of activity
  // - Exercises completed
  // Returns 0-100 score that maps to growth stages
}
```

## Integration Points

- **World Renderer**: Provides player position, current subject square
- **Trees & Trails**: Provides topic positions, relationships, engagement scores
- **Tree Interface**: Provides conversations, exercises for selected topic
- **Companion**: May query for related topics, suggestions
- **Navigation**: Provides subject square list, handles square transitions

## Persistence Strategy

**Phase 1 (MVP):**
- Zustand with `persist` middleware
- Data stored in localStorage
- Simple JSON serialization

**Phase 2:**
- API routes in Next.js (`app/api/`)
- Database (Postgres + Prisma recommended)
- User authentication

## Out of Scope

- AI/LLM integration (Companion feature handles that)
- Rendering (other features handle that)
- Actual UI components

## Open Questions for Agent

- Should relationships be weighted (strength of connection)?
- How should engagement decay over time (if at all)?
- What triggers a relationship being created between topics?
- Should we support manual relationship creation or only AI-inferred?
