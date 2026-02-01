'use client'

import { useNavigationStore } from '@/app/lib/store'

export function WelcomeScreen() {
  const advanceOnboarding = useNavigationStore((s) => s.advanceOnboarding)

  return (
    <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center">
      <div className="text-center max-w-lg px-8">
        {/* Title */}
        <h1 className="text-4xl font-light text-white mb-4 animate-fade-in">
          Welcome to your learning forest
        </h1>

        {/* Description */}
        <p className="text-white/60 text-lg mb-8 animate-fade-in animation-delay-200">
          A place where your ideas grow into trees, connected by trails of
          knowledge. Each subject is its own world to explore.
        </p>

        {/* Get Started Button */}
        <button
          onClick={advanceOnboarding}
          className="
            px-8 py-4
            bg-white/10 hover:bg-white/20
            border border-white/30
            rounded-xl
            text-white text-lg
            transition-all
            hover:scale-105
            animate-fade-in animation-delay-400
          "
        >
          Get Started
        </button>

        {/* Subtle hint */}
        <p className="text-white/30 text-sm mt-8 animate-fade-in animation-delay-600">
          Your knowledge journey begins with a single seed
        </p>
      </div>
    </div>
  )
}
