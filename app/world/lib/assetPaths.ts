import type { GrowthStage } from '@/app/lib/types'

/**
 * Map growth stages to paper-based asset file paths.
 * Visual progression: notes → notebook → book → bookshelf
 */
export const GROWTH_STAGE_ASSETS: Record<GrowthStage, string> = {
  seedling: '/assets/notes.png',
  sapling: '/assets/notebook.png',
  young: '/assets/book.png',
  mature: '/assets/bookshelf.png',
  ancient: '/assets/bookshelf.png', // Same as mature (full mastery)
}

/**
 * Visual configuration for each growth stage.
 * Controls how sprites are sized and positioned.
 */
export const ASSET_CONFIGS: Record<
  GrowthStage,
  {
    scale: number // Base scale multiplier for the sprite
    anchorY: number // Vertical anchor (0 = top, 1 = bottom)
    hitRadius: number // Click detection radius in pixels
    labelOffset: number // Y offset for the label below the sprite
  }
> = {
  seedling: {
    scale: 0.35,
    anchorY: 1,
    hitRadius: 40,
    labelOffset: 12,
  },
  sapling: {
    scale: 0.42,
    anchorY: 1,
    hitRadius: 50,
    labelOffset: 16,
  },
  young: {
    scale: 0.5,
    anchorY: 1,
    hitRadius: 60,
    labelOffset: 20,
  },
  mature: {
    scale: 0.6,
    anchorY: 1,
    hitRadius: 75,
    labelOffset: 24,
  },
  ancient: {
    scale: 0.7,
    anchorY: 1,
    hitRadius: 85,
    labelOffset: 28,
  },
}
