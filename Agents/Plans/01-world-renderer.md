# Feature: World Renderer

## Overview

The core game-like 2D environment where users move around as a dot in a forest of knowledge. This is the foundational rendering layer that everything else builds on.

## Responsibilities

- Initialize PixiJS canvas that fills the viewport
- Render the player as a small dot/circle
- Handle WASD keyboard input for movement
- Camera system that follows the player
- Render the "ground" of the current subject square
- Define the boundaries of the square world
- Expose hooks/events for other systems to add renderable objects (trees, trails, companion)

## Technical Requirements

### Stack
- **PixiJS** with `@pixi/react` for React integration
- Game loop running at 60fps
- Must coexist with React UI overlays (map, buttons, modals)

### Architecture
```
app/
  world/
    components/
      WorldCanvas.tsx    # Main PixiJS canvas component
      Player.tsx         # Player dot sprite + movement logic
      Camera.tsx         # Camera follow logic
    hooks/
      useKeyboard.ts     # WASD input handling
      useGameLoop.ts     # requestAnimationFrame loop
    store/
      worldStore.ts      # Player position, camera position, world bounds
```

### Key Interfaces

```typescript
type Position = { x: number; y: number }

type WorldState = {
  player: Position
  camera: Position
  bounds: { width: number; height: number }
  subjectSquare: string // e.g., "math", "biology"
}
```

### Visual Style
- Minimal, geometric, abstract
- Subject-specific themes:
  - **Math**: crystalline, geometric patterns
  - **Biology**: organic curves
  - **History**: angular, architectural
- The ground/background should subtly reflect the current subject's theme

## Integration Points

- **Trees & Trails**: Will render on top of this canvas
- **Companion**: Will render as a sprite following the player
- **Navigation**: Needs to know player position for edge-of-world transitions
- **Data Layer**: Player position may persist; subject square comes from app state

## Out of Scope

- Tree rendering (separate feature)
- Trail rendering (separate feature)
- UI overlays (handled by React outside the canvas)
- Companion sprite (separate feature)

## Open Questions for Agent

- Exact player movement speed?
- World size in pixels?
- How should edge-of-world feel? Soft boundary or hard stop?
- Should there be any particle effects or ambient movement in the background?
