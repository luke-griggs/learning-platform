# Feature: Trees & Trails

## Overview

Topics are represented as trees in the forest. Related topics are connected by visible trails. Trees grow and change appearance based on engagement level.

## Responsibilities

- Render trees at positions within the world
- Tree appearance reflects engagement level (seedling → sapling → full tree)
- Animate tree growth over time
- Render trails/paths connecting related trees
- Handle click/interaction detection on trees
- Emit events when a tree is clicked (triggers full-screen interface)

## Technical Requirements

### Stack
- **PixiJS** sprites/graphics for tree rendering
- Integrates with the World Renderer canvas
- Needs access to the data layer for topic positions and relationships

### Architecture
```
app/
  world/
    components/
      Tree.tsx           # Individual tree sprite
      TreeContainer.tsx  # Manages all trees in current square
      Trail.tsx          # Single trail between two trees
      TrailContainer.tsx # Manages all trails
    lib/
      treeStyles.ts      # Growth stages, subject-themed variants
      trailGeometry.ts   # Path calculation between points
```

### Tree Growth Stages

```typescript
type GrowthStage = 'seedling' | 'sapling' | 'young' | 'mature' | 'ancient'

type TreeData = {
  id: string
  topicName: string
  position: Position
  growthStage: GrowthStage
  engagementScore: number  // Determines growth
  subjectSquare: string
  relatedTopicIds: string[]
}
```

### Visual Style

Trees should be **geometric and minimal**, not realistic:
- Seedling: small triangle or simple vertical line
- Sapling: slightly larger, maybe 2-3 geometric shapes
- Mature: fuller geometric composition (triangles, circles, lines)
- Ancient: most complex, perhaps with subtle glow or distinction

**Subject-specific styling:**
- Math trees: sharp angles, crystalline shapes
- Biology trees: softer curves, organic forms
- History trees: angular, monument-like

### Trail Rendering

- Trails are visible lines/paths on the ground connecting related trees
- Style: dotted or dashed line, subtle color
- Should curve slightly rather than straight lines (bezier curves)
- Opacity or thickness could indicate strength of relationship

## Integration Points

- **World Renderer**: Trees render on the PixiJS canvas
- **Data Layer**: Subscribes to topic data for positions, relationships, engagement
- **Tree Interface**: Clicking a tree emits event that triggers the full-screen UI
- **Orb System**: When a new orb is planted, a seedling tree appears

## Interaction

```typescript
// When tree is clicked
onTreeClick(treeId: string) => void
// Triggers: world fades out, tree interface fades in
```

## Out of Scope

- The full-screen interface when clicking into a tree (separate feature)
- Creating new topics (orb system is part of Navigation)
- The actual data storage (Data Layer feature)

## Open Questions for Agent

- Exact geometric designs for each growth stage?
- Should trees have hover states?
- Trail animation (flowing dots, static line)?
- How many growth stages?
- Should trees have labels visible in the world or only on hover?
