// ============================================
// SEO CONFIG — Single source of truth for BASE_URL
// ============================================
// The site is deployed to a GitHub Pages SUBPATH (e.g. /gaming-land-kids-2/),
// so every canonical/OG/sitemap/manifest URL must be derived from Vite's
// BASE_URL at build time — NOT hardcoded to a domain. This keeps URLs correct
// under the subpath without knowing the repository or username ahead of time.
export const BASE_URL = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

// Absolute site origin (no trailing slash). import.meta.env.BASE_URL is the
// deployed path prefix; we cannot know the full origin at build time for GH
// Pages subpaths, so we resolve it at runtime from the document location and
// fall back to the configured base path for static generation contexts.
export const SITE_ORIGIN = (() => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin + BASE_URL;
  }
  // Static/SSR fallback: relative URLs resolve against the current origin on GH Pages.
  return BASE_URL;
})();

export const joinUrl = (...parts) =>
  parts
    .map((p) => String(p).replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');
