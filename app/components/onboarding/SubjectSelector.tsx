'use client'

import { useState } from 'react'
import { useNavigationStore, useUserStore, useTopicStore } from '@/app/lib/store'
import { PREDEFINED_SUBJECTS } from '@/app/lib/types'
import { WORLD_CONFIG } from '@/app/world/constants'
import type { SubjectTheme } from '@/app/lib/types'

// Theme visual preview colors
const THEME_PREVIEW: Record<SubjectTheme, { bg: string; text: string; border: string }> = {
  crystalline: {
    bg: 'bg-blue-950',
    text: 'text-blue-300',
    border: 'border-blue-500/50 hover:border-blue-400',
  },
  organic: {
    bg: 'bg-green-950',
    text: 'text-green-300',
    border: 'border-green-500/50 hover:border-green-400',
  },
  angular: {
    bg: 'bg-orange-950',
    text: 'text-orange-300',
    border: 'border-orange-500/50 hover:border-orange-400',
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
      <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center">
        <div className="max-w-md w-full px-8">
          <button
            onClick={() => setShowCustom(false)}
            className="text-white/50 hover:text-white mb-6 flex items-center gap-2"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-light text-white mb-2">
            Create your own subject
          </h2>
          <p className="text-white/50 mb-8">
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
                bg-white/5 border border-white/20
                rounded-lg text-white
                placeholder:text-white/30
                focus:outline-none focus:border-white/40
              "
              autoFocus
            />

            {/* Theme selector */}
            <div className="mb-8">
              <p className="text-white/70 text-sm mb-3">Choose a theme:</p>
              <div className="flex gap-3">
                {(['crystalline', 'organic', 'angular'] as SubjectTheme[]).map(
                  (theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => setCustomTheme(theme)}
                      className={`
                        flex-1 py-4 rounded-lg border-2 transition-all
                        ${THEME_PREVIEW[theme].bg}
                        ${
                          customTheme === theme
                            ? 'border-white scale-105'
                            : THEME_PREVIEW[theme].border
                        }
                      `}
                    >
                      <span className={`text-sm ${THEME_PREVIEW[theme].text}`}>
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
                bg-white/20 hover:bg-white/30
                disabled:bg-white/5 disabled:text-white/30
                border border-white/20
                rounded-lg text-white
                transition-colors
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
    <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center overflow-y-auto py-12">
      <div className="max-w-2xl w-full px-8">
        <h2 className="text-3xl font-light text-white text-center mb-2">
          Choose your first subject
        </h2>
        <p className="text-white/50 text-center mb-10">
          Each subject is a world waiting to be explored
        </p>

        {/* Predefined subjects grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {PREDEFINED_SUBJECTS.map((subject) => (
            <button
              key={subject.name}
              onClick={() => handleSelect(subject.name, subject.theme)}
              className={`
                p-6 rounded-xl border-2 transition-all hover:scale-105
                ${THEME_PREVIEW[subject.theme].bg}
                ${THEME_PREVIEW[subject.theme].border}
              `}
            >
              <span className={`text-lg ${THEME_PREVIEW[subject.theme].text}`}>
                {subject.name}
              </span>
              <p className="text-white/40 text-xs mt-1 capitalize">
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
              bg-white/5 hover:bg-white/10
              border border-dashed border-white/30
              rounded-xl
              text-white/70 hover:text-white
              transition-all
            "
          >
            + Create Custom Subject
          </button>
        </div>
      </div>
    </div>
  )
}
