import { useState } from 'react';
import { PUZZLE_CATEGORIES, PUZZLE_DATA } from './puzzle-data.js';
import { playSound } from '../../utils/sounds.js';
import ErrorBoundary from '../ErrorBoundary.jsx';

export default function PuzzleTab() {
  const [activeId, setActiveId] = useState(null);

  const handleSelect = (id) => {
    playSound('pop');
    setActiveId(id);
  };

  if (activeId) {
    const puzzle = PUZZLE_DATA[activeId];
    const PuzzleComponent = puzzle.component;

    return (
      <ErrorBoundary onBack={() => setActiveId(null)}>
        <PuzzleComponent
          puzzle={puzzle}
          onBack={() => setActiveId(null)}
        />
      </ErrorBoundary>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2>🧩 Puzzle Palace</h2>
        <p>Choose a magical challenge and let your little genius shine.</p>
      </div>

      <div className="puzzle-hero-card pop-in">
        <div className="puzzle-hero-badge">✨ Brain Boost</div>
        <h3>Mini challenges, big smiles</h3>
        <p>Each puzzle is designed to feel cozy, playful, and rewarding while building focus, memory, and problem-solving.</p>
      </div>

      <div className="educational-grid pop-in" style={{ marginTop: '1rem' }}>
        {PUZZLE_CATEGORIES.map((category) => (
          <PuzzleCard key={category.id} category={category} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
}

function PuzzleCard({ category, onSelect }) {
  return (
    <div
      className={`game-card ${category.color}`}
      onClick={() => onSelect(category.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(category.id)}
      aria-label={`Start ${category.title} puzzle`}
    >
      <span className="game-icon">{category.icon}</span>
      <h2>{category.title}</h2>
      <div className="activity-subtitle">Ages {category.ageRange} · 5 Levels</div>
      <p className="game-desc">{category.desc}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '0.6rem' }}>
        <button
          className="play-btn"
          onClick={(e) => { e.stopPropagation(); onSelect(category.id); }}
        >
          Start Adventure
        </button>
      </div>
    </div>
  );
}
