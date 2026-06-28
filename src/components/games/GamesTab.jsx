import { useState } from 'react';
import { gamesMeta } from '../../kids-data.js';
import { playSound } from '../../utils/sounds.js';
import ErrorBoundary from '../ErrorBoundary.jsx';

// Lazy-load game components
import MemoryGame    from '../games/MemoryGame.jsx';
import SortingGame   from '../games/SortingGame.jsx';
import PatternGame   from '../games/PatternGame.jsx';
import CountingGame  from '../games/CountingGame.jsx';
import MathQuest     from '../games/MathQuest.jsx';
import WordBuilder   from '../games/WordBuilder.jsx';
import ShapeSudoku   from '../games/ShapeSudoku.jsx';
import SparkSequence from '../games/SparkSequence.jsx';
import ColorMatch    from '../games/ColorMatch.jsx';
import SumPairs      from '../games/SumPairs.jsx';
import AnimalSounds  from '../games/AnimalSounds.jsx';
import WordScramble  from '../games/WordScramble.jsx';
import ShapeFinder     from '../games/ShapeFinder.jsx';
import OddOneOut       from '../games/OddOneOut.jsx';
import HeroPowerMatch  from '../games/HeroPowerMatch.jsx';
import SaveTheCity     from '../games/SaveTheCity.jsx';
import HeroSpellQuest  from '../games/HeroSpellQuest.jsx';
import HeroTrivia      from '../games/HeroTrivia.jsx';
import RhymeTime       from '../games/RhymeTime.jsx';
import MathNinja       from '../games/MathNinja.jsx';
import WhatComesNext   from '../games/WhatComesNext.jsx';
import BigOrSmall      from '../games/BigOrSmall.jsx';
import MemoryMatrix    from '../games/MemoryMatrix.jsx';
import OperatorQuest   from '../games/OperatorQuest.jsx';

const COMPONENT_MAP = {
  memory:       MemoryGame,
  sorting:      SortingGame,
  patterns:     PatternGame,
  counting:     CountingGame,
  math:         MathQuest,
  word:         WordBuilder,
  sudoku:       ShapeSudoku,
  sequence:     SparkSequence,
  colormatch:   ColorMatch,
  sumpairs:     SumPairs,
  animalsounds: AnimalSounds,
  wordscramble: WordScramble,
  shapefinder:    ShapeFinder,
  oddoneout:      OddOneOut,
  heropowermatch: HeroPowerMatch,
  savethecity:    SaveTheCity,
  herospellquest: HeroSpellQuest,
  herotrivia:     HeroTrivia,
  rhymetime:      RhymeTime,
  mathninja:      MathNinja,
  whatcomesnext:  WhatComesNext,
  bigorsmall:     BigOrSmall,
  memorymatrix:   MemoryMatrix,
  operatorquest:  OperatorQuest,
};

export default function GamesTab() {
  const [currentGame, setCurrentGame]     = useState(null);
  const [activeCategory, setActiveCategory] = useState('preschool');

  const handleSelect = (id) => {
    playSound('pop');
    setCurrentGame(id);
  };

  const handleBack = () => {
    setCurrentGame(null);
  };

  const handleCategory = (cat) => {
    playSound('pop');
    setActiveCategory(cat);
  };

  // Render active game
  if (currentGame) {
    const GameComponent = COMPONENT_MAP[currentGame];
    if (!GameComponent) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.2rem', color: '#888' }}>Game coming soon! 🚧</p>
          <button className="btn-back" onClick={handleBack} style={{ marginTop: '1rem' }}>
            ← Back to Games
          </button>
        </div>
      );
    }
    return (
      <ErrorBoundary onBack={handleBack}>
        <GameComponent onBack={handleBack} />
      </ErrorBoundary>
    );
  }

  const filtered = gamesMeta.filter(g => g.ageGroup === activeCategory);
  const preschoolCount = gamesMeta.filter(g => g.ageGroup === 'preschool').length;
  const juniorCount    = gamesMeta.filter(g => g.ageGroup === 'junior').length;

  return (
    <div>
      <div className="section-header">
        <h2>🎮 Pick a Game to Play</h2>
        <p>Tap any card and let the fun begin! 🎉</p>
      </div>

      {/* Age Category Selector */}
      <div className="category-container pop-in">
        <div className="category-tabs">
          <button
            className={`category-tab${activeCategory === 'preschool' ? ' active' : ''}`}
            onClick={() => handleCategory('preschool')}
          >
            👶 Little Explorers (Ages 3–5) · {preschoolCount}
          </button>
          <button
            className={`category-tab${activeCategory === 'junior' ? ' active' : ''}`}
            onClick={() => handleCategory('junior')}
          >
            🧠 Junior Genius (Ages 6–10) · {juniorCount}
          </button>
        </div>
      </div>

      {/* Games Grid */}
      <div className="game-grid pop-in">
        {filtered.map((game) => (
          <GameCard key={game.id} game={game} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
}

function GameCard({ game, onSelect }) {
  return (
    <div
      className={`game-card ${game.color}`}
      onClick={() => onSelect(game.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(game.id)}
      aria-label={`Play ${game.title}`}
    >
      <span className="game-icon">{game.icon}</span>
      <h2>{game.title}</h2>
      <p>{game.desc}</p>
      <button className="play-btn" onClick={(e) => { e.stopPropagation(); onSelect(game.id); }}>
        ▶ Play
      </button>
    </div>
  );
}
