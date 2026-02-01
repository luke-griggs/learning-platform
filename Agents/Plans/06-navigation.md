# Feature: Navigation & UI Chrome

## Overview

All the UI elements that overlay the world: the map, "New Topic" button, subject square transitions, and the orb planting mechanic.

## Responsibilities

- Map overlay in top-left corner (click to enlarge, shows all subject squares)
- Teleport to subject square by clicking on map
- Edge-of-world detection and transition button
- "New Topic" button that spawns an orb
- Orb follows player until placed
- Place orb to create new seedling tree
- Subject square selector for onboarding
- General UI chrome (settings, help, etc.)

## Technical Requirements

### Stack
- **React** components overlaying the PixiJS canvas
- **Framer Motion** for animations (map expand, transitions)
- **Zustand** for navigation state
- Coordination with World Renderer for position data

### Architecture
```
app/
  components/
    navigation/
      MapOverlay.tsx        # Mini-map + expanded map
      MapSquare.tsx         # Single subject square on map
      SubjectTransition.tsx # Full-screen transition effect
      EdgeDetector.tsx      # Shows button when near edge
      NewTopicButton.tsx    # Spawns orb
      OrbIndicator.tsx      # Shows orb attached to player
      PlaceOrbPrompt.tsx    # "Press E to plant"
    onboarding/
      SubjectSelector.tsx   # Initial subject selection
      OnboardingFlow.tsx    # First-time user experience
  world/
    components/
      Orb.tsx              # PixiJS sprite for carried orb
```

### Map Overlay

```
Default (collapsed):          Expanded (on click):
┌──────┐                      ┌─────────────────────┐
│ ▪ ▫ ▫│                      │  ┌─────┐ ┌─────┐   │
│ ▫ ▫ ▫│  →  click  →         │  │MATH │ │HIST │   │
└──────┘                      │  │  ●  │ │     │   │
                              │  └─────┘ └─────┘   │
● = current location          │  ┌─────┐ ┌─────┐   │
▪ = has content               │  │BIO  │ │PHYS │   │
▫ = empty                     │  │     │ │     │   │
                              │  └─────┘ └─────┘   │
                              └─────────────────────┘
```

### Map State

```typescript
type MapState = {
  isExpanded: boolean
  subjectSquares: SubjectSquare[]
  currentSquare: string
  playerPositionInSquare: Position
}

type SubjectSquare = {
  id: string
  name: string
  theme: string
  hasContent: boolean  // Has at least one tree
  position: { row: number; col: number }  // Grid position on map
}
```

### Edge Detection & Transition

```typescript
// When player approaches edge of world bounds
function checkEdgeProximity(playerPos: Position, bounds: WorldBounds): EdgeState {
  const threshold = 50  // pixels from edge

  return {
    nearTop: playerPos.y < threshold,
    nearBottom: playerPos.y > bounds.height - threshold,
    nearLeft: playerPos.x < threshold,
    nearRight: playerPos.x > bounds.width - threshold,
    adjacentSquare: getAdjacentSquare(...)  // Which square is in that direction
  }
}

// Show button: "Enter Biology →" when near relevant edge
```

### Orb Planting Flow

```typescript
// State machine for orb
type OrbState =
  | { status: 'none' }
  | { status: 'carrying'; position: Position }
  | { status: 'placing'; position: Position }  // Showing placement preview

// Flow:
// 1. Click "New Topic" button
// 2. Modal: "What topic?" → user enters name
// 3. Orb appears attached to player
// 4. Player walks around
// 5. Press E (or click) to place
// 6. Orb becomes seedling tree at that position
// 7. Data layer creates new Topic
```

### Transition Animation

```typescript
// When teleporting between subject squares
1. Screen fades to theme color of destination
2. World state updates (new square, reset player position)
3. Fade in new square
// Duration: ~500ms total
```

### Onboarding Flow

```typescript
// First-time user
1. Welcome screen: "Choose your first subject"
2. Grid of subject options (Math, Biology, History, etc.)
3. Click one → create that SubjectSquare
4. Transition into empty forest
5. Prompt: "This is your [Subject] forest. Plant your first topic!"
6. Guide through orb placement
```

## UI Positioning

```
┌─────────────────────────────────────────────────────┐
│ ┌──────┐                              [+ New Topic] │
│ │ Map  │                                            │
│ └──────┘                                            │
│                                                     │
│                    World Canvas                     │
│                                                     │
│                                                     │
│                                    ┌──────────────┐ │
│                                    │ Press E to   │ │
│                                    │ enter Biology│ │  ← Edge prompt
│                                    └──────────────┘ │
└─────────────────────────────────────────────────────┘
```

## Integration Points

- **World Renderer**: Needs player position for edge detection; orb renders on canvas
- **Data Layer**: Creates new Topics when orb is placed; provides subject squares
- **Trees & Trails**: New seedling appears when orb is planted
- **Companion**: Could prompt "Try creating a new topic!" as suggestion

## Out of Scope

- The world rendering itself (World Renderer)
- Tree interactions (Trees & Trails)
- Chat functionality (Tree Interface, Companion)

## Open Questions for Agent

- Should there be a limit on subject squares?
- Can users create custom subject squares or only predefined ones?
- What happens if user cancels orb placement?
- Should map show tree positions within each square?
- Keyboard shortcut for map toggle?
- What's the maximum reasonable number of subject squares to display?
