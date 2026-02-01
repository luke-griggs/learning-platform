# Feature: AI Companion

## Overview

A wisp or small companion that physically follows you through the world. Clicking it opens a side-panel chat for quick questions. It also proactively suggests what to explore next.

## Responsibilities

- Render companion sprite that follows the player in the world
- Side-panel chat UI (doesn't block the full screen)
- Handle quick Q&A with AI
- Provide contextual suggestions based on:
  - Current location in the world
  - Topics you've explored
  - Related topics you haven't visited
- Customizable companion appearance
- Guide/tutorial hints for new users

## Technical Requirements

### Stack
- **PixiJS** sprite for world rendering (companion follows player)
- **React** for side-panel UI
- **AI SDK** for chat functionality
- **Zustand** for companion state

### Architecture
```
app/
  world/
    components/
      Companion.tsx         # PixiJS sprite that follows player
  components/
    companion/
      CompanionPanel.tsx    # Side-panel chat UI
      CompanionChat.tsx     # Chat messages and input
      CompanionSuggestions.tsx  # "You might want to explore..."
      CompanionCustomizer.tsx   # Appearance settings
  lib/
    companion/
      suggestions.ts        # Logic for generating suggestions
      companionStyles.ts    # Available visual styles
```

### Companion Movement

```typescript
// Companion follows player with slight delay/smoothing
type CompanionState = {
  position: Position        // Slightly behind/beside player
  targetPosition: Position  // Where it's moving toward
  style: CompanionStyle     // Visual appearance
  isPanelOpen: boolean
}

// Movement: lerp toward player position with offset
function updateCompanionPosition(playerPos: Position, companionPos: Position): Position {
  const offset = { x: -30, y: -20 }  // Float near player
  const target = { x: playerPos.x + offset.x, y: playerPos.y + offset.y }
  return lerp(companionPos, target, 0.1)  // Smooth follow
}
```

### Side Panel Layout

```
┌────────────────────────────────┬─────────────────┐
│                                │  Companion      │
│                                │  ───────────    │
│      World Canvas              │  Hey! I noticed │
│      (still visible)           │  you've been    │
│                                │  exploring      │
│                                │  eigenvalues... │
│                                │                 │
│                                │  → Try vectors? │
│                                │  → Review quiz  │
│                                │                 │
│                                │  ───────────    │
│                                │  Ask anything:  │
│                                │  [          ]   │
└────────────────────────────────┴─────────────────┘
```

### Suggestion System

```typescript
type Suggestion = {
  type: 'explore' | 'review' | 'exercise' | 'connection'
  topicId?: string
  message: string
}

function generateSuggestions(
  currentSquare: SubjectSquare,
  playerPosition: Position,
  recentTopics: Topic[],
  graph: TopicGraph
): Suggestion[] {
  // Consider:
  // - Nearby trees not yet visited
  // - Topics related to recent conversations
  // - Exercises not yet completed
  // - Cross-subject connections
}
```

### Companion Styles

```typescript
type CompanionStyle = {
  id: string
  name: string
  sprite: string           // Path to sprite asset
  glowColor: string
  floatAnimation: 'bounce' | 'drift' | 'orbit'
}

// Example styles:
// - 'wisp': glowing orb that drifts
// - 'spark': small star that bounces
// - 'guide': geometric shape that orbits
```

### Chat Context

The companion chat should be aware of:
- Current subject square
- Nearby topics
- Recent conversations
- The knowledge graph

```typescript
// API call includes context
const response = await fetch('/api/companion', {
  body: JSON.stringify({
    message: userMessage,
    context: {
      currentSquare: 'math',
      nearbyTopics: ['eigenvalues', 'matrices'],
      recentTopicIds: [...],
      playerPosition: { x, y }
    }
  })
})
```

## Integration Points

- **World Renderer**: Companion sprite renders on PixiJS canvas, follows player
- **Data Layer**: Reads topic graph, engagement, recent activity for suggestions
- **Navigation**: Suggestions may include "go explore X" actions
- **Tree Interface**: Companion panel closes when entering a tree (or stays? TBD)

## Interaction Flow

1. Player moves around world
2. Companion follows with smooth animation
3. Player clicks companion
4. Side panel slides in from right
5. Shows suggestions + chat input
6. Player can type quick question
7. AI responds in panel
8. Player can click suggestion to navigate
9. Click outside or X to close panel

## Out of Scope

- Deep topic conversations (that's in Tree Interface)
- The actual AI model selection (API route handles)
- World rendering (World Renderer feature)

## Open Questions for Agent

- Should companion speak unprompted (proactive messages)?
- How often to show suggestions?
- Should companion have a "personality"?
- Panel width—how much of screen?
- Can you chat with companion while inside a Tree Interface?
- Mobile: how does this work on touch devices?
