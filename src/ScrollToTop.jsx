import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Remembers each route's scroll position so that returning to a list
// (e.g. via a "Back" / "Main Menu" button) reopens where the
// child was left, instead of jumping to the top. Fresh visits and
// detail pages (no remembered position) still open at the top.
const scrollPositions = new Map();

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const pathRef = useRef(pathname);

  // Keep a live reference to the current route so the scroll listener
  // always records the position under the right key.
  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  // Continuously record the scroll position of whatever route we're on.
  useEffect(() => {
    const onScroll = () => {
      scrollPositions.set(pathRef.current, window.scrollY);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // On route change: restore the saved position if we have one, else top.
  useEffect(() => {
    const saved = scrollPositions.get(pathname);
    // Wait one frame so the new route's layout is committed before
    // we restore, avoiding a clamp against not-yet-rendered height.
    const raf = requestAnimationFrame(() => {
      window.scrollTo({ top: saved ?? 0, left: 0, behavior: 'auto' });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
