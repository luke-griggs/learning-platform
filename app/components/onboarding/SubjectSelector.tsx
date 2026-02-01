'use client'

import { useState } from 'react'
import { useNavigationStore, useUserStore, useTopicStore } from '@/app/lib/store'
import { PREDEFINED_SUBJECTS } from '@/app/lib/types'
import { WORLD_CONFIG } from '@/app/world/constants'
import type { SubjectTheme } from '@/app/lib/types'

// Theme visual preview colors - light theme compatible
const THEME_PREVIEW: Record<SubjectTheme, { bg: string; text: string; border: string; activeBorder: string }> = {
  crystalline: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200 hover:border-blue-300',
    activeBorder: 'border-blue-500',
  },
  organic: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200 hover:border-green-300',
    activeBorder: 'border-green-500',
  },
  angular: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200 hover:border-orange-300',
    activeBorder: 'border-orange-500',
  },
}

export function SubjectSelector() {
  const [showCustom, setShowCustom] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customTheme, setCustomTheme] = useState<SubjectTheme>('crystalline')

  const advanceOnboarding = useNavigationStore((s) => s.advanceOnboarding)
  const setCurrentSubject = useUserStore((s) => s.setCurrentSubjectSquare)
  const setPlayerPosition = useUserStore((s) => s.setPlayerPosition)
  const addSubjectSquare = useTopicStore((s) => s.addSubjectSquare)

  // Handle selecting a subject
  const handleSelect = (name: string, theme: SubjectTheme) => {
    // Create the subject square
    const squareId = addSubjectSquare({ name, theme })

    // Set it as current
    setCurrentSubject(squareId)

    // Position player at center
    setPlayerPosition({
      x: WORLD_CONFIG.width / 2,
      y: WORLD_CONFIG.height / 2,
    })

    // Advance to entering_forest step
    advanceOnboarding()
  }

  // Handle custom subject creation
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = customName.trim()
    if (trimmedName) {
      handleSelect(trimmedName, customTheme)
    }
  }

  if (showCustom) {
    return (
      <div className="fixed inset-0 z-[60] bg-[var(--background)] flex items-center justify-center">
        <div className="max-w-md w-full px-8">
          <button
            onClick={() => setShowCustom(false)}
            className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] mb-6 flex items-center gap-2 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>

          <h2 className="text-2xl font-medium text-[var(--foreground)] mb-2">
            Create your own subject
          </h2>
          <p className="text-[var(--foreground-secondary)] mb-8">
            Name your subject and choose a visual theme
          </p>

          <form onSubmit={handleCustomSubmit}>
            {/* Name input */}
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Subject name..."
              className="
                w-full px-4 py-3 mb-6
                bg-[var(--surface)] border border-[var(--border)]
                rounded-xl text-[var(--foreground)]
                placeholder:text-[var(--foreground-muted)]
                focus:outline-none focus:border-[var(--foreground-tertiary)]
                shadow-[var(--shadow-sm)]
                transition-colors
              "
              autoFocus
            />

            {/* Theme selector */}
            <div className="mb-8">
              <p className="text-[var(--foreground-secondary)] text-sm mb-3">Choose a theme:</p>
              <div className="flex gap-3">
                {(['crystalline', 'organic', 'angular'] as SubjectTheme[]).map(
                  (theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => setCustomTheme(theme)}
                      className={`
                        flex-1 py-4 rounded-xl border-2 transition-all duration-200
                        ${THEME_PREVIEW[theme].bg}
                        ${
                          customTheme === theme
                            ? `${THEME_PREVIEW[theme].activeBorder} scale-105 shadow-md`
                            : THEME_PREVIEW[theme].border
                        }
                      `}
                    >
                      <span className={`text-sm font-medium ${THEME_PREVIEW[theme].text}`}>
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!customName.trim()}
              className="
                w-full py-3
                bg-[var(--accent)] hover:bg-[var(--accent-hover)]
                disabled:bg-[var(--background-tertiary)] disabled:text-[var(--foreground-muted)]
                rounded-xl text-white font-medium
                transition-all duration-200
              "
            >
              Create Subject
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] bg-[var(--background)] flex items-center justify-center overflow-y-auto py-12">
      <div className="max-w-2xl w-full px-8">
        <h2 className="text-3xl font-medium text-[var(--foreground)] text-center mb-2">
          Choose your first subject
        </h2>
        <p className="text-[var(--foreground-secondary)] text-center mb-10">
          Each subject is a world waiting to be explored
        </p>

        {/* Predefined subjects grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {PREDEFINED_SUBJECTS.map((subject) => (
            <button
              key={subject.name}
              onClick={() => handleSelect(subject.name, subject.theme)}
              className={`
                p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-md
                ${THEME_PREVIEW[subject.theme].bg}
                ${THEME_PREVIEW[subject.theme].border}
              `}
            >
              <span className={`text-lg font-medium ${THEME_PREVIEW[subject.theme].text}`}>
                {subject.name}
              </span>
              <p className="text-[var(--foreground-muted)] text-xs mt-1 capitalize">
                {subject.theme}
              </p>
            </button>
          ))}
        </div>

        {/* Custom option */}
        <div className="text-center">
          <button
            onClick={() => setShowCustom(true)}
            className="
              px-6 py-3
              bg-[var(--surface)] hover:bg-[var(--background-secondary)]
              border-2 border-dashed border-[var(--border)]
              hover:border-[var(--foreground-muted)]
              rounded-xl
              text-[var(--foreground-secondary)] hover:text-[var(--foreground)]
              transition-all duration-200
              shadow-[var(--shadow-sm)]
            "
          >
            + Create Custom Subject
          </button>
        </div>
      </div>
    </div>
  )
}
