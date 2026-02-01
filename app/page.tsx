import { WorldRenderer } from '@/app/world'
import { TreeInterfaceProvider, TreeInterface } from '@/app/components/tree-interface'
import {
  MapOverlay,
  NewTopicButton,
  OrbCarryingUI,
  EdgeDetector,
  SubjectTransition,
} from '@/app/components/navigation'
import { OnboardingFlow } from '@/app/components/onboarding'

export default function Home() {
  return (
    <TreeInterfaceProvider>
      {/* World canvas (PixiJS) */}
      <WorldRenderer />

      {/* Tree interface (full-screen when active) */}
      <TreeInterface />

      {/* Navigation UI overlays */}
      <MapOverlay />
      <NewTopicButton />
      <OrbCarryingUI />
      <EdgeDetector />
      <SubjectTransition />

      {/* Onboarding flow (renders on top when active) */}
      <OnboardingFlow />
    </TreeInterfaceProvider>
  )
}
