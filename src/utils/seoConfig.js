// ============================================
// SEO CONFIGURATION — Centralized site-wide SEO constants
// ============================================
// Derives all URLs from import.meta.env.BASE_URL so they work on GitHub Pages
// subpath (/gaming-land-kids-2/) without hardcoding a domain.

// Base URL for the deployed site (includes trailing slash, e.g. "/gaming-land-kids-2/")
export const BASE_URL = import.meta.env.BASE_URL || '/';

// Full origin for absolute URLs (used in JSON-LD @id, canonical, etc.)
// On GitHub Pages we don't know the username at build time, so we derive it from BASE_URL.
// In production you may want to set VITE_SITE_ORIGIN via GitHub Actions env.
export const SITE_ORIGIN = import.meta.env.VITE_SITE_ORIGIN || 'https://abhi3588.github.io';

export const SITE_NAME = 'Gaming Land Kids';
export const SITE_DESCRIPTION =
  '30+ free educational games, bedtime stories, nursery rhymes, science activities, moral education, and fun activities for children ages 3-10. Learn math, science, values, reading, counting, and more through play!';

// Join path segments safely with BASE_URL
export const joinUrl = (...parts) => {
  const clean = parts
    .map((p) => String(p).replace(/^\/+|\/+$/g, ''))
    .filter(Boolean);
  const base = BASE_URL.replace(/\/+$/, '');
  return clean.length ? `${base}/${clean.join('/')}` : base + '/';
};

// Absolute URL with SITE_ORIGIN (for canonical, og:url, JSON-LD @id)
export const absoluteUrl = (...parts) => {
  const path = joinUrl(...parts);
  // If path starts with BASE_URL, strip it and join with SITE_ORIGIN
  const base = BASE_URL.replace(/\/+$/, '');
  const rel = path.startsWith(base) ? path.slice(base.length) : path;
  return `${SITE_ORIGIN}${rel}`;
};

// Canonical URL for the current page (absolute, no fragment)
export const canonicalUrl = (...parts) => absoluteUrl(...parts);

// Default JSON-LD for the website (WebSite schema)
export const defaultJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': absoluteUrl('#website'),
  name: SITE_NAME,
  url: absoluteUrl(),
  description: SITE_DESCRIPTION,
  publisher: { '@id': absoluteUrl('#organization') },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${absoluteUrl('search')}?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// Organization JSON-LD (EducationalOrganization schema)
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  '@id': absoluteUrl('#organization'),
  name: SITE_NAME,
  url: absoluteUrl(),
  logo: absoluteUrl('icons', 'icon-512.png'),
  description:
    'A free learning platform for children featuring 30+ educational games, stories, rhymes, creative activities, interactive science experiments, and moral character-building activities for ages 3-10.',
  educationalUse: 'Play-based learning',
  educationalLevel: ['Preschool', 'Kindergarten', 'Elementary'],
  targetAudience: { '@type': 'Audience', audienceType: 'Children ages 3-10' },
  sameAs: [
    'https://facebook.com/gaminglandkids',
    'https://twitter.com/gaminglandkids',
    'https://youtube.com/@gaminglandkids',
  ],
};

// BreadcrumbList JSON-LD factory
export const breadcrumbJsonLd = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: c.url,
  })),
});

// Open Graph / Twitter defaults
export const OG_DEFAULTS = {
  siteName: SITE_NAME,
  locale: 'en_US',
  type: 'website',
  twitterCard: 'summary_large_image',
};

// Default OG image (used when page-specific image is not available)
export const DEFAULT_OG_IMAGE = absoluteUrl('og-image.png');

// Canonical base for self-referencing canonicals
export const CANONICAL_BASE = BASE_URL;