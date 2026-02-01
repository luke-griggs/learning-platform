# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
bun run dev      # Start development server at http://localhost:3000
bun run build    # Create production build
bun start        # Run production server
bun run lint     # Run ESLint
```

## Tech Stack

- **Next.js 16** with App Router (not Pages Router)
- **React 19** with Server Components by default
- **TypeScript** in strict mode
- **Tailwind CSS v4** using `@import "tailwindcss"` syntax
- **bun** as package manager

## Code Architecture

### Directory Structure
All application code lives in `app/` following Next.js App Router conventions:
- `app/layout.tsx` - Root layout with Geist fonts and metadata
- `app/page.tsx` - Home page
- `app/globals.css` - Tailwind imports and CSS variables for theming

### Path Aliases
Use `@/` prefix for imports from project root (configured in tsconfig.json).

### Styling
- Dark mode supported via CSS variables (`--background`, `--foreground`)
- Theme automatically responds to `prefers-color-scheme: dark`
- Geist Sans and Geist Mono fonts pre-configured

## Project Context

This is an early-stage interactive learning platform. The vision (documented in `notes.md`) includes:
- Canvas-based central hub for learning materials
- AI-powered conversation with deep thinking questions
- Multi-modal learning (verbal, visual, written explanations)
- Progress tracking and material uploads
- UI mockups are in `inspo/` directory
