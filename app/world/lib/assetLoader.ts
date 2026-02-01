import { Assets, Texture } from 'pixi.js'
import type { GrowthStage } from '@/app/lib/types'
import { GROWTH_STAGE_ASSETS } from './assetPaths'

// Singleton state for texture loading
let texturesLoaded = false
let loadingPromise: Promise<void> | null = null
const textureCache: Record<string, Texture> = {}

/**
 * Pre-load all tree assets. Call once at app initialization.
 * Uses PixiJS 8's Assets API for efficient loading and caching.
 * Safe to call multiple times - will only load once.
 */
export async function loadTreeAssets(): Promise<void> {
  // Return existing promise if already loading
  if (loadingPromise) return loadingPromise

  // Skip if already loaded
  if (texturesLoaded) return

  loadingPromise = (async () => {
    const assetPaths = Object.values(GROWTH_STAGE_ASSETS)
    const uniquePaths = [...new Set(assetPaths)] // Remove duplicates (bookshelf appears twice)

    // Add assets to PixiJS manifest
    for (const path of uniquePaths) {
      Assets.add({ alias: path, src: path })
    }

    // Load all textures in parallel
    const loaded = await Assets.load(uniquePaths)

    // Store in local cache for fast access
    for (const path of uniquePaths) {
      textureCache[path] = loaded[path]
    }

    texturesLoaded = true
  })()

  return loadingPromise
}

/**
 * Get texture for a growth stage.
 * Must call loadTreeAssets() first and wait for it to complete.
 */
export function getTextureForStage(stage: GrowthStage): Texture {
  const path = GROWTH_STAGE_ASSETS[stage]
  const texture = textureCache[path]

  if (!texture) {
    console.warn(`Texture not loaded for stage: ${stage}. Call loadTreeAssets() first.`)
    return Texture.EMPTY
  }

  return texture
}

/**
 * Check if all tree assets have been loaded.
 */
export function areAssetsLoaded(): boolean {
  return texturesLoaded
}
