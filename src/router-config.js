// ============================================
// ROUTER CONFIG — single source of truth for routes & tab mapping
// ============================================
export const TAB_LABELS = {
  games: 'Games',
  stories: 'Stories',
  rhymes: 'Rhymes',
  fun: 'Fun',
  educational: 'Educational',
  quiz: 'Quiz',
  puzzle: 'Puzzle',
};

// Derive the active top-level tab from a pathname (e.g. /games/ocean-match -> games)
export const tabFromPath = (pathname = '') => {
  const seg = pathname.split('/').filter(Boolean); // ['gaming-land-kids-2', 'games', 'x'] handled by basename
  const first = seg[0] || 'games';
  return TAB_LABELS[first] ? first : 'games';
};

export const ROUTES = {
  home: '/',
  games: '/games',
  stories: '/stories',
  storiesHi: '/stories/hi',
  rhymes: '/rhymes',
  fun: '/fun',
  educational: '/educational',
  quiz: '/quiz',
  puzzle: '/puzzle',
};
