import { Graphics } from 'pixi.js'
import type { Position } from '@/app/lib/types'
import type { SubjectStyleModifiers } from '../types/trees'

type BezierPoint = {
  x: number
  y: number
}

/**
 * Calculate control points for a smooth bezier curve between two positions.
 * The curve bows outward perpendicular to the direct line, creating a
 * natural-looking path between trees.
 *
 * @param from - Starting position
 * @param to - Ending position
 * @param curvature - How much the curve bows (0 = straight, 1 = very curved)
 */
export function calculateBezierControlPoints(
  from: Position,
  to: Position,
  curvature: number = 0.25
): [BezierPoint, BezierPoint] {
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2

  // Calculate vector from start to end
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.sqrt(dx * dx + dy * dy)

  // Avoid division by zero for overlapping points
  if (length === 0) {
    return [
      { x: midX, y: midY },
      { x: midX, y: midY },
    ]
  }

  // Perpendicular unit vector (rotated 90 degrees)
  const perpX = -dy / length
  const perpY = dx / length

  // Offset based on curvature and distance between points
  const offset = length * curvature

  // Control points offset perpendicular to midpoint
  // Using quadratic bezier style (both control points at same location)
  // for smoother, more predictable curves
  const cp1: BezierPoint = {
    x: midX + perpX * offset,
    y: midY + perpY * offset,
  }
  const cp2: BezierPoint = {
    x: midX + perpX * offset,
    y: midY + perpY * offset,
  }

  return [cp1, cp2]
}

/**
 * Sample points along a cubic bezier curve.
 * Used for creating dashed line effects.
 */
function getBezierPoints(
  from: Position,
  to: Position,
  cp1: BezierPoint,
  cp2: BezierPoint,
  segments: number
): BezierPoint[] {
  const points: BezierPoint[] = []

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const x = cubicBezier(from.x, cp1.x, cp2.x, to.x, t)
    const y = cubicBezier(from.y, cp1.y, cp2.y, to.y, t)
    points.push({ x, y })
  }

  return points
}

/**
 * Cubic bezier interpolation for a single axis.
 * B(t) = (1-t)^3 * P0 + 3(1-t)^2 * t * P1 + 3(1-t) * t^2 * P2 + t^3 * P3
 */
function cubicBezier(
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  t: number
): number {
  const t2 = t * t
  const t3 = t2 * t
  const mt = 1 - t
  const mt2 = mt * mt
  const mt3 = mt2 * mt

  return mt3 * p0 + 3 * mt2 * t * p1 + 3 * mt * t2 * p2 + t3 * p3
}

/**
 * Draw a dashed bezier curve trail between two points.
 * Creates a subtle path connecting related topics.
 *
 * @param g - PixiJS Graphics object to draw on
 * @param from - Starting position
 * @param to - Ending position
 * @param style - Subject style modifiers for colors
 * @param strength - 0-1, affects opacity and line thickness
 * @param dashLength - Length of each dash segment
 * @param gapLength - Length of each gap between dashes
 */
export function drawTrail(
  g: Graphics,
  from: Position,
  to: Position,
  style: SubjectStyleModifiers,
  strength: number = 1,
  dashLength: number = 8,
  gapLength: number = 5
): void {
  g.clear()

  const [cp1, cp2] = calculateBezierControlPoints(from, to)

  // Sample many points along the curve for smooth dashes
  const numSegments = 60
  const points = getBezierPoints(from, to, cp1, cp2, numSegments)

  // Calculate the base color with adjusted alpha
  const baseAlpha = 0.35 * strength
  const lineWidth = 1.5 + strength * 0.5

  // Track dash/gap state
  let isDash = true
  let segmentLength = 0
  let dashStartIndex = 0

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const dist = Math.sqrt((curr.x - prev.x) ** 2 + (curr.y - prev.y) ** 2)
    segmentLength += dist

    const targetLength = isDash ? dashLength : gapLength

    if (segmentLength >= targetLength) {
      if (isDash) {
        // Draw the dash segment
        g.moveTo(points[dashStartIndex].x, points[dashStartIndex].y)
        for (let j = dashStartIndex + 1; j <= i; j++) {
          g.lineTo(points[j].x, points[j].y)
        }
        g.stroke({
          color: style.secondaryColor,
          width: lineWidth,
          alpha: baseAlpha,
        })
      }

      // Switch dash/gap state
      isDash = !isDash
      segmentLength = 0
      dashStartIndex = i
    }
  }

  // Draw any remaining dash at the end
  if (isDash && dashStartIndex < points.length - 1) {
    g.moveTo(points[dashStartIndex].x, points[dashStartIndex].y)
    for (let j = dashStartIndex + 1; j < points.length; j++) {
      g.lineTo(points[j].x, points[j].y)
    }
    g.stroke({
      color: style.secondaryColor,
      width: lineWidth,
      alpha: baseAlpha,
    })
  }
}

/**
 * Calculate trail strength based on the engagement of connected topics.
 * Higher engagement = more prominent trail.
 *
 * @param topicAEngagement - Engagement score of first topic (0-100)
 * @param topicBEngagement - Engagement score of second topic (0-100)
 * @returns Strength value between 0.3 and 1.0 (always somewhat visible)
 */
export function calculateTrailStrength(
  topicAEngagement: number,
  topicBEngagement: number
): number {
  // Use average engagement of both connected topics
  const avgEngagement = (topicAEngagement + topicBEngagement) / 2

  // Map to 0.3-1.0 range so trails are always somewhat visible
  // Even low-engagement topics show their connections
  return 0.3 + (avgEngagement / 100) * 0.7
}

/**
 * Calculate the approximate length of a bezier curve.
 * Useful for determining dash patterns or culling distant trails.
 */
export function getTrailLength(from: Position, to: Position): number {
  const [cp1, cp2] = calculateBezierControlPoints(from, to)
  const points = getBezierPoints(from, to, cp1, cp2, 20)

  let length = 0
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    length += Math.sqrt(dx * dx + dy * dy)
  }

  return length
}
