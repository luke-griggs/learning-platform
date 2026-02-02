import { Assets, Texture } from 'pixi.js'

// All 8 directions the character can face
export type Direction =
  | 'north'
  | 'north-east'
  | 'east'
  | 'south-east'
  | 'south'
  | 'south-west'
  | 'west'
  | 'north-west'

// Frame counts for each direction (some have more animation frames than others)
const DIRECTION_FRAME_COUNTS: Record<Direction, number> = {
  north: 3,
  'north-east': 3,
  east: 4,
  'south-east': 2,
  south: 2,
  'south-west': 2,
  west: 4,
  'north-west': 3,
}

// Default direction when standing still
export const DEFAULT_DIRECTION: Direction = 'south'

// Animation timing
export const FRAME_DURATION_MS = 500 // Half second per frame

// Singleton state for texture loading
let texturesLoaded = false
let loadingPromise: Promise<void> | null = null
const textureCache: Map<Direction, Texture[]> = new Map()

/**
 * Generate all asset paths for character sprites.
 */
function getAllCharacterAssetPaths(): { direction: Direction; frame: number; path: string }[] {
  const paths: { direction: Direction; frame: number; path: string }[] = []

  for (const [direction, frameCount] of Object.entries(DIRECTION_FRAME_COUNTS)) {
    for (let frame = 1; frame <= frameCount; frame++) {
      paths.push({
        direction: direction as Direction,
        frame,
        path: `/assets/character/${direction}/${frame}.png`,
      })
    }
  }

  return paths
}

/**
 * Pre-load all character sprites. Call once at app initialization.
 * Uses PixiJS 8's Assets API for efficient loading and caching.
 * Safe to call multiple times - will only load once.
 */
export async function loadCharacterAssets(): Promise<void> {
  // Return existing promise if already loading
  if (loadingPromise) return loadingPromise

  // Skip if already loaded
  if (texturesLoaded) return

  loadingPromise = (async () => {
    const assetInfos = getAllCharacterAssetPaths()
    const paths = assetInfos.map((info) => info.path)

    // Add assets to PixiJS manifest
    for (const path of paths) {
      Assets.add({ alias: path, src: path })
    }

    // Load all textures in parallel
    const loaded = await Assets.load(paths)

    // Organize into cache by direction
    for (const direction of Object.keys(DIRECTION_FRAME_COUNTS) as Direction[]) {
      const frameCount = DIRECTION_FRAME_COUNTS[direction]
      const frames: Texture[] = []

      for (let frame = 1; frame <= frameCount; frame++) {
        const path = `/assets/character/${direction}/${frame}.png`
        frames.push(loaded[path])
      }

      textureCache.set(direction, frames)
    }

    texturesLoaded = true
  })()

  return loadingPromise
}

/**
 * Get all animation frames for a direction.
 * Must call loadCharacterAssets() first and wait for it to complete.
 */
export function getCharacterFrames(direction: Direction): Texture[] {
  const frames = textureCache.get(direction)

  if (!frames || frames.length === 0) {
    console.warn(`Character textures not loaded for direction: ${direction}. Call loadCharacterAssets() first.`)
    return [Texture.EMPTY]
  }

  return frames
}

/**
 * Get the number of frames for a direction.
 */
export function getFrameCount(direction: Direction): number {
  return DIRECTION_FRAME_COUNTS[direction]
}

/**
 * Check if all character assets have been loaded.
 */
export function areCharacterAssetsLoaded(): boolean {
  return texturesLoaded
}

/**
 * Determine direction from input keys.
 * Returns null if not moving.
 */
export function getDirectionFromInput(input: {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}): Direction | null {
  const { up, down, left, right } = input

  // No movement
  if (!up && !down && !left && !right) return null

  // Cardinal directions
  if (up && !down && !left && !right) return 'north'
  if (down && !up && !left && !right) return 'south'
  if (left && !right && !up && !down) return 'west'
  if (right && !left && !up && !down) return 'east'

  // Diagonal directions
  if (up && right && !down && !left) return 'north-east'
  if (up && left && !down && !right) return 'north-west'
  if (down && right && !up && !left) return 'south-east'
  if (down && left && !up && !right) return 'south-west'

  // Conflicting inputs (up+down or left+right) - use whatever is possible
  if (up && !down && right) return 'north-east'
  if (up && !down && left) return 'north-west'
  if (down && !up && right) return 'south-east'
  if (down && !up && left) return 'south-west'
  if (right && !left) return 'east'
  if (left && !right) return 'west'
  if (up && !down) return 'north'
  if (down && !up) return 'south'

  return null
}
