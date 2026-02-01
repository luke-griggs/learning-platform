"use client";

import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { useNavigationStore, useUserStore } from "@/app/lib/store";
import { WORLD_CONFIG } from "@/app/world/constants";

const TRANSITION_DURATION = 500; // Total duration in ms

// Hydration-safe mounting check without synchronous setState in effect
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function SubjectTransition() {
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const [opacity, setOpacity] = useState(0);
  const transitionRef = useRef<NodeJS.Timeout | null>(null);

  const isTransitioning = useNavigationStore((s) => s.isTransitioning);
  const transitionTargetSquare = useNavigationStore(
    (s) => s.transitionTargetSquare,
  );
  const endTransition = useNavigationStore((s) => s.endTransition);

  const setCurrentSubject = useUserStore((s) => s.setCurrentSubjectSquare);
  const setPlayerPosition = useUserStore((s) => s.setPlayerPosition);

  // White transition color to match minimal world style
  const transitionColor = "white";

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (transitionRef.current) {
        clearTimeout(transitionRef.current);
      }
    };
  }, []);

  // Handle transition animation
  useEffect(() => {
    if (!isTransitioning || !transitionTargetSquare) {
      // Defer state reset to avoid synchronous setState in effect
      const frameId = requestAnimationFrame(() => {
        setPhase("idle");
        setOpacity(0);
      });
      return () => cancelAnimationFrame(frameId);
    }

    // Phase 1: Fade out (0 to 1 opacity)
    // Defer initial state setup to next frame to avoid synchronous setState
    const initFrameId = requestAnimationFrame(() => {
      setPhase("out");
      setOpacity(0);
      // Start fade out on the following frame
      requestAnimationFrame(() => {
        setOpacity(1);
      });
    });

    // At midpoint: switch the subject and reset position
    transitionRef.current = setTimeout(() => {
      // Update to new subject square
      setCurrentSubject(transitionTargetSquare);

      // Reset player to center of new square
      setPlayerPosition({
        x: WORLD_CONFIG.width / 2,
        y: WORLD_CONFIG.height / 2,
      });

      // Phase 2: Fade in (1 to 0 opacity)
      setPhase("in");
    }, TRANSITION_DURATION / 2);

    // After full transition: cleanup
    const endTimeout = setTimeout(() => {
      setOpacity(0);
      setPhase("idle");
      endTransition();
    }, TRANSITION_DURATION);

    return () => {
      cancelAnimationFrame(initFrameId);
      if (transitionRef.current) {
        clearTimeout(transitionRef.current);
      }
      clearTimeout(endTimeout);
    };
  }, [
    isTransitioning,
    transitionTargetSquare,
    setCurrentSubject,
    setPlayerPosition,
    endTransition,
  ]);

  // Don't render until mounted
  if (!mounted) return null;

  // Don't render when not transitioning
  if (!isTransitioning && phase === "idle") return null;

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{
        backgroundColor: transitionColor,
        opacity: opacity,
        transition: `opacity ${TRANSITION_DURATION / 2}ms ease-in-out`,
      }}
    />
  );
}
