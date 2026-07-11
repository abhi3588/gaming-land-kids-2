import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { getTabSEO } from './utils/seo.js';
import { gamesMeta, stories, rhymes, funActivities, scienceActivities, moralActivities } from './kids-data.js';
import { QUIZ_CATEGORIES } from './components/quiz/quiz-data.js';
import { PUZZLE_CATEGORIES } from './components/puzzle/puzzle-data.js';
import { TAB_LABELS, tabFromPath } from './router-config.js';
import ScrollToTop from './ScrollToTop.jsx';

// Lazy-load tab views for code-splitting (smaller initial bundle -> better TBT/LCP)
const GamesTab = lazy(() => import('./components/games/GamesTab.jsx'));
const StoriesTab = lazy(() => import('./components/stories/StoriesTab.jsx'));
const RhymesTab = lazy(() => import('./components/rhymes/RhymesTab.jsx'));
const FunTab = lazy(() => import('./components/fun/FunTab.jsx'));
const EducationalTab = lazy(() => import('./components/educational/EducationalTab.jsx'));
const QuizTab = lazy(() => import('./components/quiz/QuizTab.jsx'));
const PuzzleTab = lazy(() => import('./components/puzzle/PuzzleTab.jsx'));

const generateBubbles = () =>
  Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    width: Math.random() * 90 + 40,
    height: Math.random() * 90 + 40,
    left: Math.random() * 100,
    delay: Math.random() * 20,
    duration: Math.random() * 10 + 12,
  }));

const FLOATING_SHAPES = [
  { emoji: '🌈', style: { left: '4%', top: '22%' }, delay: 0, dur: 7 },
  { emoji: '☁️', style: { right: '5%', top: '14%' }, delay: 1.2, dur: 9 },
  { emoji: '🎈', style: { left: '11%', bottom: '16%' }, delay: 0.6, dur: 8 },
  { emoji: '⭐', style: { right: '9%', bottom: '22%' }, delay: 1.8, dur: 6 },
  { emoji: '🦋', style: { left: '50%', top: '9%' }, delay: 0.9, dur: 10 },
  { emoji: '🍭', style: { left: '27%', bottom: '7%' }, delay: 1.5, dur: 9 },
  { emoji: '🎨', style: { right: '38%', top: '18%' }, delay: 0.3, dur: 8.5 },
  { emoji: '🌸', style: { right: '28%', bottom: '9%' }, delay: 2.1, dur: 7.5 },
];

const TAB_ORDER = ['games', 'stories', 'rhymes', 'fun', 'educational', 'quiz', 'puzzle'];

const TAB_COUNTS = {
  games: gamesMeta.length,
  stories: stories.length,
  rhymes: rhymes.length,
  fun: funActivities.length,
  educational: scienceActivities.length + moralActivities.length,
  quiz: QUIZ_CATEGORIES.length,
  puzzle: PUZZLE_CATEGORIES.length,
};

// Unified per-tab SEO (replaces the old inline TabSEO + useSEO hook)
function TabSEO({ activeTab }) {
  const seo = getTabSEO(activeTab, {
    gamesMeta,
    stories,
    rhymes,
    funActivities,
    scienceActivities,
    moralActivities,
    quizCategories: QUIZ_CATEGORIES,
    puzzleCategories: PUZZLE_CATEGORIES,
  });
  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.canonical} />
      <meta property="og:title" content={seo.ogTitle} />
      <meta property="og:description" content={seo.ogDescription} />
      <meta property="og:image" content={seo.ogImage} />
      <meta property="og:url" content={seo.ogUrl} />
      <meta property="og:type" content={seo.ogType || 'website'} />
      <meta name="twitter:card" content={seo.twitterCard || 'summary_large_image'} />
      <meta name="twitter:title" content={seo.twitterTitle || seo.ogTitle} />
      <meta name="twitter:description" content={seo.twitterDescription || seo.ogDescription} />
      <meta name="twitter:image" content={seo.twitterImage || seo.ogImage} />
      {seo.hreflang?.map((h, i) => (
        <link key={i} rel="alternate" hreflang={h.lang} href={h.href} />
      ))}
      {seo.jsonLd && <script type="application/ld+json">{JSON.stringify(seo.jsonLd)}</script>}
    </Helmet>
  );
}

function TabBar() {
  const { pathname } = useLocation();
  const activeTab = tabFromPath(pathname);
  return (
    <div className="tab-nav">
      <div className="tab-list" role="tablist" aria-label="App sections">
        {TAB_ORDER.map((tab) => (
          <Link
            key={tab}
            to={`/${tab}`}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls="tab-content"
            className={`tab-btn ${tab}${activeTab === tab ? ' active' : ''}`}
          >
            {TAB_LABELS[tab]}
            <span className="tab-count">{TAB_COUNTS[tab]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem', color: '#888' }}>
      Loading… ✨
    </div>
  );
}

function Shell() {
  const { pathname } = useLocation();
  const activeTab = tabFromPath(pathname);
  const bubbles = generateBubbles();

  return (
    <>
      <TabSEO activeTab={activeTab} />
      <ScrollToTop />
      <div
        className="app"
        style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Animated background */}
        <div className="bg-bubbles" aria-hidden="true">
          {bubbles.map((b) => (
            <div
              key={b.id}
              className="bubble"
              style={{
                width: `${b.width}px`,
                height: `${b.height}px`,
                left: `${b.left}%`,
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.duration}s`,
              }}
            />
          ))}
        </div>

        {/* Floating decorative shapes */}
        <div className="floating-shapes" aria-hidden="true">
          {FLOATING_SHAPES.map((s, i) => (
            <span
              key={i}
              className="floating-shape"
              style={{
                ...s.style,
                '--delay': `${s.delay}s`,
                '--dur': `${s.dur}s`,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.dur}s`,
              }}
            >
              {s.emoji}
            </span>
          ))}
        </div>

        {/* Header */}
        <header className="app-header">
          <h1>Gaming Land Kids</h1>
          <p>Educational games, stories, rhymes &amp; activities for ages 3-10 💛</p>
        </header>

        <TabBar />

        {/* Tab Content */}
        <main
          id="tab-content"
          className="app-container"
          style={{ flex: 1, position: 'relative', zIndex: 1 }}
          role="tabpanel"
          aria-label={TAB_LABELS[activeTab]}
        >
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<GamesTab />} />
              <Route path="/games" element={<GamesTab />} />
              <Route path="/games/:id" element={<GamesTab />} />
              <Route path="/stories" element={<StoriesTab />} />
              <Route path="/stories/hi" element={<StoriesTab lang="hi" />} />
              <Route path="/stories/:id" element={<StoriesTab />} />
              <Route path="/stories/hi/:id" element={<StoriesTab lang="hi" />} />
              <Route path="/rhymes" element={<RhymesTab />} />
              <Route path="/rhymes/:id" element={<RhymesTab />} />
              <Route path="/fun" element={<FunTab />} />
              <Route path="/fun/:id" element={<FunTab />} />
              <Route path="/educational" element={<EducationalTab />} />
              <Route path="/educational/science/:id" element={<EducationalTab initialCategory="science" />} />
              <Route path="/educational/moral/:id" element={<EducationalTab initialCategory="moral" />} />
              <Route path="/quiz" element={<QuizTab />} />
              <Route path="/quiz/:id" element={<QuizTab />} />
              <Route path="/puzzle" element={<PuzzleTab />} />
              <Route path="/puzzle/:id" element={<PuzzleTab />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div style={{ marginBottom: '0.5rem' }}>Made with 💖 for little learners</div>
          <div
            style={{
              fontSize: '0.85rem',
              color: '#999',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            A magical place for joyful learning featuring 30+ educational games, bedtime stories,
            nursery rhymes, and creative activities for children ages 3-10.
          </div>
        </footer>
      </div>
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL || '/'}>
        <Shell />
      </BrowserRouter>
    </HelmetProvider>
  );
}
