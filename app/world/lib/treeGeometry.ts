import { Graphics } from 'pixi.js'
import type { GrowthStage } from '@/app/lib/types'
import type { SubjectStyleModifiers } from '../types/trees'

/**
 * Procedural tree drawing using PixiJS Graphics API.
 * Trees are geometric and minimal, with style varying by subject theme.
 *
 * Coordinate system: (0,0) is at the base of the tree trunk.
 * Y-axis points down in PixiJS, so negative Y is "up" visually.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Seedling: Simple vertical line with tiny shape at top
// ─────────────────────────────────────────────────────────────────────────────
export function drawSeedling(
  g: Graphics,
  style: SubjectStyleModifiers,
  animProgress: number = 1
): void {
  const height = 12 * animProgress
  const { primaryColor, strokeWidth, fillOpacity, shapeStyle } = style

  // Stem
  g.moveTo(0, 0)
  g.lineTo(0, -height)
  g.stroke({ color: primaryColor, width: strokeWidth })

  // Tiny shape at top based on theme
  if (shapeStyle === 'sharp') {
    // Triangle for crystalline
    g.poly([0, -height - 6, -4, -height, 4, -height])
    g.fill({ color: primaryColor, alpha: fillOpacity })
  } else if (shapeStyle === 'curved') {
    // Circle for organic
    g.circle(0, -height - 3, 4)
    g.fill({ color: primaryColor, alpha: fillOpacity })
  } else {
    // Square for angular
    g.rect(-3, -height - 6, 6, 6)
    g.fill({ color: primaryColor, alpha: fillOpacity })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sapling: 2-3 shapes, slightly taller
// ─────────────────────────────────────────────────────────────────────────────
export function drawSapling(
  g: Graphics,
  style: SubjectStyleModifiers,
  animProgress: number = 1
): void {
  const height = 25 * animProgress
  const { primaryColor, secondaryColor, strokeWidth, fillOpacity, shapeStyle } =
    style

  // Trunk
  g.moveTo(0, 0)
  g.lineTo(0, -height)
  g.stroke({ color: primaryColor, width: strokeWidth + 0.5 })

  if (shapeStyle === 'sharp') {
    // Crystalline: stacked triangles
    g.poly([-10, -height + 8, 10, -height + 8, 0, -height - 12])
    g.fill({ color: primaryColor, alpha: fillOpacity })
    g.poly([-6, -height + 14, 6, -height + 14, 0, -height + 2])
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.8 })
  } else if (shapeStyle === 'curved') {
    // Organic: overlapping ellipses
    g.ellipse(-5, -height + 4, 8, 10)
    g.fill({ color: primaryColor, alpha: fillOpacity })
    g.ellipse(5, -height + 6, 7, 9)
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.8 })
  } else {
    // Angular: stacked rectangles (monument style)
    g.rect(-8, -height - 4, 16, 12)
    g.fill({ color: primaryColor, alpha: fillOpacity })
    g.rect(-5, -height + 8, 10, 8)
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.8 })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Young: 4 shapes, medium height
// ─────────────────────────────────────────────────────────────────────────────
export function drawYoungTree(
  g: Graphics,
  style: SubjectStyleModifiers,
  animProgress: number = 1
): void {
  const height = 40 * animProgress
  const {
    primaryColor,
    secondaryColor,
    accentColor,
    strokeWidth,
    fillOpacity,
    shapeStyle,
  } = style

  // Trunk (thicker)
  g.moveTo(0, 0)
  g.lineTo(0, -height)
  g.stroke({ color: primaryColor, width: strokeWidth + 1 })

  // Small branches
  g.moveTo(0, -height * 0.4)
  g.lineTo(-8, -height * 0.5)
  g.stroke({ color: primaryColor, width: strokeWidth * 0.7 })

  g.moveTo(0, -height * 0.5)
  g.lineTo(7, -height * 0.6)
  g.stroke({ color: primaryColor, width: strokeWidth * 0.7 })

  if (shapeStyle === 'sharp') {
    // Crystalline: multi-layered crystal formation
    g.poly([-14, -height + 12, 14, -height + 12, 0, -height - 16])
    g.fill({ color: primaryColor, alpha: fillOpacity })
    g.poly([-10, -height + 18, 10, -height + 18, 0, -height])
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.8 })
    g.poly([-6, -height + 22, 6, -height + 22, 0, -height + 8])
    g.fill({ color: accentColor, alpha: fillOpacity * 0.6 })
  } else if (shapeStyle === 'curved') {
    // Organic: cluster of circles/ellipses
    g.ellipse(0, -height, 14, 18)
    g.fill({ color: primaryColor, alpha: fillOpacity })
    g.ellipse(-8, -height + 6, 10, 12)
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.8 })
    g.ellipse(8, -height + 8, 9, 11)
    g.fill({ color: accentColor, alpha: fillOpacity * 0.7 })
  } else {
    // Angular: tiered monument
    g.rect(-12, -height - 8, 24, 16)
    g.fill({ color: primaryColor, alpha: fillOpacity })
    g.rect(-9, -height + 8, 18, 12)
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.8 })
    g.rect(-6, -height + 20, 12, 8)
    g.fill({ color: accentColor, alpha: fillOpacity * 0.6 })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Mature: 6 shapes, full height
// ─────────────────────────────────────────────────────────────────────────────
export function drawMatureTree(
  g: Graphics,
  style: SubjectStyleModifiers,
  animProgress: number = 1
): void {
  const height = 55 * animProgress
  const {
    primaryColor,
    secondaryColor,
    accentColor,
    strokeWidth,
    fillOpacity,
    shapeStyle,
  } = style

  // Thick trunk
  g.rect(-2, 0, 4, -height * 0.5)
  g.fill({ color: primaryColor, alpha: fillOpacity * 0.9 })

  // Multiple branches
  g.moveTo(0, -height * 0.35)
  g.lineTo(-14, -height * 0.5)
  g.stroke({ color: primaryColor, width: strokeWidth })

  g.moveTo(0, -height * 0.45)
  g.lineTo(12, -height * 0.6)
  g.stroke({ color: primaryColor, width: strokeWidth })

  g.moveTo(0, -height * 0.55)
  g.lineTo(-10, -height * 0.7)
  g.stroke({ color: primaryColor, width: strokeWidth * 0.8 })

  if (shapeStyle === 'sharp') {
    // Crystalline: complex crystal cluster
    g.poly([-20, -height + 16, 20, -height + 16, 0, -height - 22])
    g.fill({ color: primaryColor, alpha: fillOpacity })
    g.poly([-16, -height + 22, 16, -height + 22, 0, -height - 6])
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.85 })
    g.poly([-12, -height + 26, 12, -height + 26, 0, -height + 6])
    g.fill({ color: accentColor, alpha: fillOpacity * 0.7 })
    // Side crystals
    g.poly([-22, -height + 12, -14, -height + 12, -18, -height - 4])
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.6 })
    g.poly([14, -height + 14, 22, -height + 14, 18, -height - 2])
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.6 })
  } else if (shapeStyle === 'curved') {
    // Organic: full canopy with depth
    g.ellipse(0, -height + 2, 22, 26)
    g.fill({ color: primaryColor, alpha: fillOpacity })
    g.ellipse(-10, -height + 8, 14, 18)
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.85 })
    g.ellipse(10, -height + 10, 13, 16)
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.8 })
    g.ellipse(0, -height - 4, 12, 14)
    g.fill({ color: accentColor, alpha: fillOpacity * 0.7 })
    g.ellipse(-14, -height + 14, 8, 10)
    g.fill({ color: accentColor, alpha: fillOpacity * 0.6 })
  } else {
    // Angular: grand monument structure
    g.rect(-18, -height - 10, 36, 22)
    g.fill({ color: primaryColor, alpha: fillOpacity })
    g.rect(-14, -height + 12, 28, 16)
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.85 })
    g.rect(-10, -height + 28, 20, 12)
    g.fill({ color: accentColor, alpha: fillOpacity * 0.7 })
    // Side columns
    g.rect(-22, -height + 4, 6, 20)
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.6 })
    g.rect(16, -height + 6, 6, 18)
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.6 })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Ancient: 8 shapes with glow effect, tallest
// ─────────────────────────────────────────────────────────────────────────────
export function drawAncientTree(
  g: Graphics,
  style: SubjectStyleModifiers,
  animProgress: number = 1
): void {
  const height = 70 * animProgress
  const {
    primaryColor,
    secondaryColor,
    accentColor,
    strokeWidth,
    fillOpacity,
    shapeStyle,
  } = style

  // Thick gnarled trunk
  g.rect(-3, 0, 6, -height * 0.45)
  g.fill({ color: primaryColor, alpha: fillOpacity * 0.95 })

  // Many branches
  const branchPositions = [0.3, 0.4, 0.5, 0.6, 0.7]
  branchPositions.forEach((pos, i) => {
    const dir = i % 2 === 0 ? -1 : 1
    g.moveTo(0, -height * pos)
    g.lineTo(dir * (12 + i * 2), -height * (pos + 0.12))
    g.stroke({ color: primaryColor, width: strokeWidth * (1 - i * 0.1) })
  })

  if (shapeStyle === 'sharp') {
    // Crystalline: grand crystal cathedral
    g.poly([-28, -height + 20, 28, -height + 20, 0, -height - 30])
    g.fill({ color: primaryColor, alpha: fillOpacity })
    g.poly([-22, -height + 26, 22, -height + 26, 0, -height - 12])
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.85 })
    g.poly([-16, -height + 32, 16, -height + 32, 0, -height + 4])
    g.fill({ color: accentColor, alpha: fillOpacity * 0.75 })
    // Outer crystals
    g.poly([-32, -height + 16, -22, -height + 16, -27, -height - 10])
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.65 })
    g.poly([22, -height + 18, 32, -height + 18, 27, -height - 8])
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.65 })
    // Inner detail crystals
    g.poly([-10, -height + 34, 10, -height + 34, 0, -height + 16])
    g.fill({ color: accentColor, alpha: fillOpacity * 0.6 })
    g.poly([-18, -height + 8, -8, -height + 8, -13, -height - 6])
    g.fill({ color: accentColor, alpha: fillOpacity * 0.5 })
    g.poly([8, -height + 10, 18, -height + 10, 13, -height - 4])
    g.fill({ color: accentColor, alpha: fillOpacity * 0.5 })
  } else if (shapeStyle === 'curved') {
    // Organic: massive ancient canopy
    g.ellipse(0, -height + 4, 32, 36)
    g.fill({ color: primaryColor, alpha: fillOpacity })
    g.ellipse(-14, -height + 10, 18, 24)
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.85 })
    g.ellipse(14, -height + 12, 17, 22)
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.8 })
    g.ellipse(0, -height - 8, 18, 20)
    g.fill({ color: accentColor, alpha: fillOpacity * 0.75 })
    g.ellipse(-20, -height + 18, 12, 14)
    g.fill({ color: accentColor, alpha: fillOpacity * 0.65 })
    g.ellipse(20, -height + 20, 11, 13)
    g.fill({ color: accentColor, alpha: fillOpacity * 0.6 })
    // Smaller detail foliage
    g.ellipse(-8, -height - 14, 10, 12)
    g.fill({ color: accentColor, alpha: fillOpacity * 0.55 })
    g.ellipse(8, -height - 12, 9, 11)
    g.fill({ color: accentColor, alpha: fillOpacity * 0.5 })
  } else {
    // Angular: ancient temple/ziggurat
    g.rect(-26, -height - 14, 52, 28)
    g.fill({ color: primaryColor, alpha: fillOpacity })
    g.rect(-22, -height + 14, 44, 22)
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.85 })
    g.rect(-18, -height + 36, 36, 18)
    g.fill({ color: accentColor, alpha: fillOpacity * 0.75 })
    // Side towers
    g.rect(-32, -height, 8, 30)
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.7 })
    g.rect(24, -height + 2, 8, 28)
    g.fill({ color: secondaryColor, alpha: fillOpacity * 0.7 })
    // Top decorations
    g.rect(-12, -height - 22, 24, 10)
    g.fill({ color: accentColor, alpha: fillOpacity * 0.65 })
    g.rect(-6, -height - 28, 12, 8)
    g.fill({ color: accentColor, alpha: fillOpacity * 0.55 })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main dispatcher - draws tree based on growth stage
// ─────────────────────────────────────────────────────────────────────────────
export function drawTree(
  g: Graphics,
  stage: GrowthStage,
  style: SubjectStyleModifiers,
  animProgress: number = 1
): void {
  g.clear()

  switch (stage) {
    case 'seedling':
      return drawSeedling(g, style, animProgress)
    case 'sapling':
      return drawSapling(g, style, animProgress)
    case 'young':
      return drawYoungTree(g, style, animProgress)
    case 'mature':
      return drawMatureTree(g, style, animProgress)
    case 'ancient':
      return drawAncientTree(g, style, animProgress)
  }
}

/**
 * Draw a hover highlight ring around a tree.
 */
export function drawHoverHighlight(
  g: Graphics,
  crownRadius: number,
  trunkHeight: number
): void {
  const centerY = -trunkHeight / 2
  g.circle(0, centerY, crownRadius + 8)
  g.stroke({ color: 0xffffff, width: 1.5, alpha: 0.35 })
}

/**
 * Draw a glow effect for ancient trees.
 */
export function drawGlowEffect(
  g: Graphics,
  crownRadius: number,
  trunkHeight: number,
  accentColor: number
): void {
  const centerY = -trunkHeight / 2
  // Outer glow
  g.circle(0, centerY, crownRadius + 15)
  g.fill({ color: accentColor, alpha: 0.1 })
  // Inner glow
  g.circle(0, centerY, crownRadius + 8)
  g.fill({ color: accentColor, alpha: 0.15 })
}
