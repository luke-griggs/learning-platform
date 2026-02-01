'use client'

import { useNavigationStore } from '@/app/lib/store'

/** Spark icon for branding */
function SparkIcon({ className }: { className?: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 2C10 2 10.5 6 10 8C12 8 16 8 16 8C16 8 12 8.5 10 9C10 11 10 16 10 16C10 16 9.5 11 10 9C8 9 4 9 4 9C4 9 8 8.5 10 8C10 6 10 2 10 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function WelcomeScreen() {
  const advanceOnboarding = useNavigationStore((s) => s.advanceOnboarding)

  return (
    <div className="fixed inset-0 z-[60] bg-[var(--background)] flex items-center justify-center">
      <div className="text-center max-w-lg px-8">
        {/* Icon */}
        <div className="mb-6 animate-fade-in">
          <SparkIcon className="mx-auto text-[var(--accent)]" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-medium text-[var(--foreground)] mb-4 animate-fade-in animation-delay-75">
          Welcome to your learning forest
        </h1>

        {/* Description */}
        <p className="text-[var(--foreground-secondary)] text-lg mb-8 animate-fade-in animation-delay-200 leading-relaxed">
          A place where your ideas grow into trees, connected by trails of
          knowledge. Each subject is its own world to explore.
        </p>

        {/* Get Started Button */}
        <button
          onClick={advanceOnboarding}
          className="
            px-8 py-4
            bg-[var(--accent)] hover:bg-[var(--accent-hover)]
            rounded-xl
            text-white text-lg font-medium
            transition-all duration-200
            hover:scale-105 hover:-translate-y-0.5
            animate-fade-in animation-delay-300
            shadow-[var(--shadow-md)]
          "
        >
          Get Started
        </button>

        {/* Subtle hint */}
        <p className="text-[var(--foreground-muted)] text-sm mt-8 animate-fade-in animation-delay-400">
          Your knowledge journey begins with a single seed
        </p>
      </div>
    </div>
  )
}
