import type { WorldConfig, ThemeConfig, SubjectTheme } from './types'

export const WORLD_CONFIG: WorldConfig = {
  width: 2000,
  height: 2000,
  playerSpeed: 200, // pixels per second
  playerRadius: 8,
}

export const THEME_CONFIGS: Record<SubjectTheme, ThemeConfig> = {
  crystalline: {
    backgroundColor: 0x0a0a1a,
    groundPattern: 'grid',
    groundColor: 0x1a1a3a,
    particleColor: 0x4488ff,
    particleCount: 30,
  },
  organic: {
    backgroundColor: 0x0a1a0a,
    groundPattern: 'dots',
    groundColor: 0x1a3a1a,
    particleColor: 0x44ff88,
    particleCount: 40,
  },
  angular: {
    backgroundColor: 0x1a0a0a,
    groundPattern: 'lines',
    groundColor: 0x3a1a1a,
    particleColor: 0xff8844,
    particleCount: 25,
  },
}

// Default theme when no subject square is active
export const DEFAULT_THEME: ThemeConfig = THEME_CONFIGS.crystalline
