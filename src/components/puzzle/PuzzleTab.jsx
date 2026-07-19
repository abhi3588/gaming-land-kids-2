import { useParams, useNavigate } from 'react-router-dom';
import { PUZZLE_CATEGORIES, PUZZLE_DATA } from './puzzle-data.js';
import { playSound } from '../../utils/sounds.js';
import ErrorBoundary from '../ErrorBoundary.jsx';
import { useItemSEO } from '../../utils/useSEO.jsx';

function PuzzleSEO() {
  const { id } = useParams();
  const puzzle = PUZZLE_CATEGORIES.find((p) => p.id === id);
  return useItemSEO('puzzle', puzzle);
}

export default function PuzzleTab() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (id) {
    const category = PUZZLE_CATEGORIES.find((p) => p.id === id);

    if (!category) {
      return (
        <div className="section-header">
          <h2>Puzzle not found</h2>
          <p>Sorry, we couldn't find that puzzle.</p>
          <button className="btn" style={{ marginTop: '1rem' }} onClick={() => navigate('/puzzle')}>
            Back to Puzzles
          </button>
        </div>
      );
    }

    const puzzle = { ...category, ...PUZZLE_DATA[id] };
    const PuzzleComponent = puzzle.component;

    return (
      <ErrorBoundary onBack={() => navigate('/puzzle')}>
        <PuzzleSEO />
        <PuzzleComponent
          puzzle={puzzle}
          onBack={() => navigate('/puzzle')}
        />
      </ErrorBoundary>
    );
  }

  const handleSelect = (puzzleId) => {
    playSound('pop');
    navigate('/puzzle/' + puzzleId);
  };

  return (
    <div>
      <div className="section-header">
        <h2>🧩 Puzzle Palace</h2>
        <p>Choose a magical challenge and let your little genius shine.</p>
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
      <h3>{category.title}</h3>
      <div className="activity-subtitle">Ages {category.ageRange} · 10 Levels</div>
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
