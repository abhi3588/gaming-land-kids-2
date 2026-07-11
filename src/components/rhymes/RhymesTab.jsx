import { useParams, useNavigate } from 'react-router-dom';
import { rhymes } from '../../kids-data.js';
import VideoPlayer from './VideoPlayer.jsx';
import { useItemSEO } from '../../utils/useSEO.jsx';

function RhymeSEO() {
  const { id } = useParams();
  const rhyme = rhymes.find((r) => r.id === id);
  return useItemSEO('rhyme', rhyme);
}

export default function RhymesTab() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSelect = (id) => {
    navigate('/rhymes/' + id);
  };

  const handleBack = () => {
    navigate('/rhymes');
  };

  if (id) {
    const rhyme = rhymes.find((r) => r.id === id);
    if (!rhyme) {
      return (
        <div className="section-header">
          <h2>Rhyme not found</h2>
          <button className="play-btn" onClick={handleBack}>← Back to Rhymes</button>
        </div>
      );
    }
    return (
      <>
        <RhymeSEO />
        <VideoPlayer rhyme={rhyme} onBack={handleBack} />
      </>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2>🎵 Rhymes Time</h2>
        <p>Tap a rhyme and enjoy! 🎈</p>
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
      <h3>{rhyme.title}</h3>
      <p>{rhyme.desc}</p>
      <button className="play-btn" onClick={(e) => { e.stopPropagation(); onSelect(rhyme.id); }}>
        ▶ Play
      </button>
    </div>
  );
}
