
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Default to false (desktop) for SSR and initial client render before mount.
  // This ensures server and client initial renders are consistent.
  const [isMobile, setIsMobile] = React.useState(false)
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true) // Signal that client-side mount has occurred

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(mql.matches)
    }

    onChange(); // Set the correct state on client mount

    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, []) // Empty dependency array, runs once on client mount

  // During SSR or before client mount, return the initial default (false).
  // After mount, return the actual dynamic value.
  return hasMounted ? isMobile : false;
}

