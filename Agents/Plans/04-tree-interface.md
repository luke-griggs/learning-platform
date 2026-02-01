# Feature: Tree Interface

## Overview

The full-screen interface that appears when you click into a tree. Contains the list of past conversations, ability to start new chats, exercises, and links to related topics.

## Responsibilities

- Full-screen takeover when a tree is clicked (world fades out)
- Display list of past conversations for that topic
- "New Chat" button to start a new conversation
- Chat interface for conversing with the AI
- Exercises section for that topic
- Links/doorways to related topics
- Smooth fade transitions in/out

## Technical Requirements

### Stack
- **React** components (standard Next.js)
- **Framer Motion** for fade transitions
- **AI SDK** (Vercel AI SDK) for chat streaming
- Styling with **Tailwind CSS**

### Architecture
```
app/
  components/
    tree-interface/
      TreeInterface.tsx      # Main container, handles fade in/out
      ConversationList.tsx   # List of past conversations
      ConversationItem.tsx   # Single conversation preview
      ChatView.tsx           # Active chat interface
      ChatMessage.tsx        # Individual message bubble
      ChatInput.tsx          # Message input with send
      ExerciseList.tsx       # Exercises for this topic
      ExerciseItem.tsx       # Single exercise
      RelatedTopics.tsx      # Doorways to related trees
      NewChatButton.tsx      # Creates new conversation
```

### Layout

```
┌─────────────────────────────────────────────────────┐
│  ← Back to Forest            [Topic Name]           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐  ┌───────────────────────────────┐ │
│  │ Conversations│  │                               │ │
│  │             │  │     Active Chat Area          │ │
│  │ • Chat 1    │  │                               │ │
│  │ • Chat 2    │  │                               │ │
│  │ • Chat 3    │  │                               │ │
│  │             │  │                               │ │
│  │ [+ New Chat]│  │                               │ │
│  ├─────────────┤  │                               │ │
│  │ Exercises   │  │                               │ │
│  │ • Ex 1      │  ├───────────────────────────────┤ │
│  │ • Ex 2      │  │ [Type a message...]     Send  │ │
│  ├─────────────┤  └───────────────────────────────┘ │
│  │ Related     │                                    │
│  │ → Vectors   │                                    │
│  │ → Matrices  │                                    │
│  └─────────────┘                                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Key Interfaces

```typescript
type TreeInterfaceProps = {
  topicId: string
  onClose: () => void           // Returns to forest
  onNavigateToTopic: (id: string) => void  // Jump to related topic
}

type ChatViewProps = {
  conversation: Conversation
  onSendMessage: (content: string) => void
}
```

### Transitions

```typescript
// Fade sequence
1. User clicks tree in world
2. World canvas opacity fades to 0 (300ms)
3. TreeInterface fades in from opacity 0 to 1 (300ms)
4. On close: reverse

// Use Framer Motion AnimatePresence
```

### Chat Integration

```typescript
// Using Vercel AI SDK pattern
const { messages, input, handleSubmit, isLoading } = useChat({
  api: '/api/chat',
  body: {
    topicId: topic.id,
    topicName: topic.name,
    relatedTopics: topic.relatedTopicIds
  }
})
```

## Integration Points

- **World Renderer**: Triggers this interface; this interface triggers return
- **Data Layer**: Reads/writes conversations, exercises; reads related topics
- **Trees & Trails**: Click event on tree triggers opening this interface
- **Companion**: The chat here is different from companion (companion is quick questions; this is deep topic exploration)

## Visual Style

- Clean, minimal interface
- Match the geometric aesthetic of the world
- Subtle animations
- Dark mode support (follows system/user preference)

## Out of Scope

- The world rendering (that's behind this, faded out)
- Companion sidebar (separate feature)
- AI model integration details (API route handles that)

## Open Questions for Agent

- Should conversations have editable titles or auto-generated?
- Exercise creation flow—where does that live?
- Should there be a search/filter for conversations?
- How many related topics to show?
- Should clicking a related topic close current interface and open new one, or stack?
