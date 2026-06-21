import { useEffect, useState } from "react";
import type { AuthInstance } from "@/types/domain";

export type SplashRole = AuthInstance | "admin";

const splashDurationMs = 1400;
const reducedMotionSplashDurationMs = 450;

export function useRoleSplash(role: SplashRole) {
  const sessionKey = `splash-seen-${role}`;
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem(sessionKey));

  useEffect(() => {
    if (!showSplash) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(
      () => {
        sessionStorage.setItem(sessionKey, "true");
        setShowSplash(false);
      },
      prefersReducedMotion ? reducedMotionSplashDurationMs : splashDurationMs
    );

    return () => window.clearTimeout(timeout);
  }, [sessionKey, showSplash]);

  return showSplash;
}
