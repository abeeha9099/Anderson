import { useEffect, useState } from 'react';

/**
 * Media-query state. Returns `serverDefault` during pre-rendering and the first client render
 * (so hydration matches), then the real value after mount.
 */
export function useMediaQuery(query: string, serverDefault = true) {
  const [matches, setMatches] = useState(serverDefault);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);
  return matches;
}

/** Tailwind `md` breakpoint (768px). */
export const MD_UP = '(min-width: 48rem)';
