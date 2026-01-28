import { useRef } from "react";

export function useRateLimit(delayMs: number) {
  const lastCall = useRef(0);

  return () => {
    const now = Date.now();
    if (now - lastCall.current < delayMs) {
      return false;
    }
    lastCall.current = now;
    return true;
  };
}
