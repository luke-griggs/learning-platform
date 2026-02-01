'use client'

import { useCallback } from 'react'
import { extend } from '@pixi/react'
import { Graphics } from 'pixi.js'

// Register PixiJS components for React (v8 pattern)
extend({ Graphics })

import type { TrailConnection, SubjectStyleModifiers } from '../../types/trees'
import { drawTrail } from '../../lib/trailGeometry'

type TrailProps = {
  connection: TrailConnection
  styleModifiers: SubjectStyleModifiers
}

/**
 * Single trail component that renders a dashed bezier curve
 * connecting two related topics.
 */
export function Trail({ connection, styleModifiers }: TrailProps) {
  const draw = useCallback(
    (g: Graphics) => {
      drawTrail(
        g,
        connection.fromPosition,
        connection.toPosition,
        styleModifiers,
        connection.strength
      )
    },
    [connection, styleModifiers]
  )

  return <pixiGraphics draw={draw} />
}
