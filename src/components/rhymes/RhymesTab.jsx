import { useState } from 'react';
import { rhymes } from '../../kids-data.js';
import VideoPlayer from './VideoPlayer.jsx';

export default function RhymesTab() {
  const [activeRhymeId, setActiveRhymeId] = useState(null);

  const handleSelect = (id) => {
    setActiveRhymeId(id);
  };

  const handleBack = () => {
    setActiveRhymeId(null);
  };

  if (activeRhymeId) {
    const rhyme = rhymes.find((r) => r.id === activeRhymeId);
    if (!rhyme) return null;
    return <VideoPlayer rhyme={rhyme} onBack={handleBack} />;
  }

  return (
    <div>
      <div className="section-header">
        <h2>🎵 Sing Along with Rhymes</h2>
        <p>Watch, sing, and dance along with your favorite rhymes! 🎈</p>
      </div>

      <div className="game-grid pop-in rhymes-grid">
        {rhymes.map((rhyme) => (
          <RhymeCard key={rhyme.id} rhyme={rhyme} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
}

function RhymeCard({ rhyme, onSelect }) {
  return (
    <div
      className={`game-card rhyme-card ${rhyme.color || 'word'}`}
      onClick={() => onSelect(rhyme.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(rhyme.id)}
      aria-label={`Watch ${rhyme.title}`}
    >
      <span className="game-icon">{rhyme.icon}</span>
      <h2>{rhyme.title}</h2>
      <p>{rhyme.desc}</p>
      <button className="play-btn" onClick={(e) => { e.stopPropagation(); onSelect(rhyme.id); }}>
        ▶ Play
      </button>
    </div>
  );
}
