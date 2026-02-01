'use client'

import dynamic from 'next/dynamic'

// Dynamic import with SSR disabled - PixiJS requires window/document
const WorldCanvas = dynamic(
  () => import('./components/WorldCanvas').then((mod) => mod.WorldCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-white/50 text-sm">Loading world...</div>
      </div>
    ),
  }
)

interface WorldRendererProps {
  className?: string
}

/**
 * Client-side wrapper for the PixiJS world canvas.
 * Uses dynamic import to avoid SSR issues with PixiJS.
 */
export function WorldRenderer({ className }: WorldRendererProps) {
  return (
    <div className={`fixed inset-0 ${className ?? ''}`}>
      <WorldCanvas />
    </div>
  )
}
