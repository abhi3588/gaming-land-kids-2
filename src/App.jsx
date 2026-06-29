import { useState, useMemo } from 'react';
import GamesTab   from './components/games/GamesTab.jsx';
import StoriesTab from './components/stories/StoriesTab.jsx';
import { gamesMeta, stories } from './kids-data.js';

const generateBubbles = () =>
  Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    width:    Math.random() * 90 + 40,
    height:   Math.random() * 90 + 40,
    left:     Math.random() * 100,
    delay:    Math.random() * 20,
    duration: Math.random() * 10 + 12,
  }));

const FLOATING_SHAPES = [
  { emoji: '🌈', style: { left: '4%',  top: '22%' },  delay: 0,   dur: 7 },
  { emoji: '☁️', style: { right: '5%', top: '14%' },  delay: 1.2, dur: 9 },
  { emoji: '🎈', style: { left: '11%', bottom: '16%'}, delay: 0.6, dur: 8 },
  { emoji: '⭐', style: { right: '9%', bottom: '22%'}, delay: 1.8, dur: 6 },
  { emoji: '🦋', style: { left: '50%', top: '9%' },   delay: 0.9, dur: 10 },
  { emoji: '🍭', style: { left: '27%', bottom: '7%'}, delay: 1.5, dur: 9 },
  { emoji: '🎨', style: { right: '38%',top: '18%' },  delay: 0.3, dur: 8.5},
  { emoji: '🌸', style: { right:'28%', bottom: '9%'}, delay: 2.1, dur: 7.5},
];

export default function App() {
  const [activeTab, setActiveTab] = useState('games');
  const [bubbles] = useState(generateBubbles);

  const gamesCount   = gamesMeta.length;
  const storiesCount = stories.length;

  return (
    <div className="app" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Animated background ── */}
      <div className="bg-bubbles">
        {bubbles.map(b => (
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

      {/* ── Floating decorative shapes ── */}
      <div className="floating-shapes" aria-hidden="true">
        {FLOATING_SHAPES.map((s, i) => (
          <span
            key={i}
            className="floating-shape"
            style={{
              ...s.style,
              '--delay': `${s.delay}s`,
              '--dur':   `${s.dur}s`,
              animationDelay:    `${s.delay}s`,
              animationDuration: `${s.dur}s`,
            }}
          >
            {s.emoji}
          </span>
        ))}
      </div>

      {/* ── Header ── */}
      <header className="app-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(255,255,255,0.8)', borderRadius: '999px',
          padding: '0.3rem 1rem', fontSize: '0.82rem', fontWeight: 700,
          color: '#888', marginBottom: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <span style={{ animation: 'bobble 2s ease-in-out infinite', display: 'inline-block' }}>🎈</span>
          Welcome, little explorer!
        </div>
        <h1>Gaming Land 🌈</h1>
        <p>Play fun games & read happy stories — for kids aged 3 to 10! 💛</p>
      </header>

      {/* ── Tab Navigation ── */}
      <div className="tab-nav">
        <div className="tab-list" role="tablist" aria-label="App sections">
          <button
            role="tab"
            aria-selected={activeTab === 'games'}
            className={`tab-btn games${activeTab === 'games' ? ' active' : ''}`}
            onClick={() => setActiveTab('games')}
          >
            🎮 Games
            <span className="tab-count">{gamesCount}</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'stories'}
            className={`tab-btn stories${activeTab === 'stories' ? ' active' : ''}`}
            onClick={() => setActiveTab('stories')}
          >
            📚 Stories
            <span className="tab-count">{storiesCount}</span>
          </button>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <main className="app-container" style={{ flex: 1, position: 'relative', zIndex: 1 }}
        role="tabpanel" aria-label={activeTab === 'games' ? 'Games' : 'Stories'}>
        {activeTab === 'games'   && <GamesTab   key="games"   />}
        {activeTab === 'stories' && <StoriesTab key="stories" />}
      </main>

      {/* ── Footer ── */}
      <footer className="app-footer">
        Made with 💖 for little learners · Gaming Land 🌈
      </footer>
    </div>
  );
}
