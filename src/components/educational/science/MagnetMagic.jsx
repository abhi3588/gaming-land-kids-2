import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const ITEMS = [
  { id: 'iron-nail', emoji: '🔩', name: 'Iron Nail', cat: 'magnetic' },
  { id: 'paperclip', emoji: '📎', name: 'Paperclip', cat: 'magnetic' },
  { id: 'refrigerator', emoji: '🧊', name: 'Refrigerator', cat: 'magnetic' },
  { id: 'wood-block', emoji: '🪵', name: 'Wooden Block', cat: 'non-magnetic' },
  { id: 'plastic-spoon', emoji: '🥄', name: 'Plastic Spoon', cat: 'non-magnetic' },
  { id: 'paper', emoji: '📄', name: 'Paper', cat: 'non-magnetic' }
];

const BINS = [
  { id: 'magnetic', emoji: '🧲', label: 'Magnetic', hint: 'Pulled by a magnet' },
  { id: 'non-magnetic', emoji: '🚫', label: 'Non-Magnetic', hint: 'Not pulled by a magnet' }
];

const MagnetMagic = ({ onBack }) => {
  const [selected, setSelected] = useState(null);
  const [placed, setPlaced] = useState({}); // itemId -> binId
  const [shakeBin, setShakeBin] = useState(null);
  const [completed, setCompleted] = useState(false);

  const placedCount = Object.keys(placed).length;

  const handleItemClick = (item) => {
    if (placed[item.id]) return;
    playSound('pop');
    setSelected(item.id === selected ? null : item.id);
  };

  const handleBinClick = (binId) => {
    if (!selected) return;
    const item = ITEMS.find((i) => i.id === selected);
    if (item.cat === binId) {
      playSound('match');
      const next = { ...placed, [item.id]: binId };
      setPlaced(next);
      setSelected(null);
      if (Object.keys(next).length === ITEMS.length) {
        playSound('celebrate');
        setCompleted(true);
      }
    } else {
      playSound('wrong');
      setShakeBin(binId);
      setSelected(null);
      setTimeout(() => setShakeBin(null), 500);
    }
  };

  const handleReset = () => {
    playSound('pop');
    setPlaced({});
    setSelected(null);
    setShakeBin(null);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="game-view pop-in">
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🧲</div>
          <h2>Magnet Master!</h2>
          <p>You sorted all {ITEMS.length} objects by what sticks to a magnet!</p>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Magnets pull metal things like nails, paperclips, and fridges — but not wood, plastic, or paper.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Play Again
            </button>
            <button className="btn" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Science
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Magnet Magic 🧲</div>
        <div>Sorted {placedCount} / {ITEMS.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(placedCount / ITEMS.length) * 100}%` }} />
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', margin: '0.5rem 0 1rem' }}>
        Tap an object, then tap the bin where it belongs!
      </p>

      {/* Tray of unsorted items */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.75rem',
        marginBottom: '2rem'
      }}>
        {ITEMS.filter((i) => !placed[i.id]).map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={selected === item.id ? 'quiz-option-btn quiz-correct' : 'quiz-option-btn'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              minWidth: '92px',
              padding: '0.75rem',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '2.5rem' }}>{item.emoji}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{item.name}</span>
          </button>
        ))}
        {ITEMS.every((i) => placed[i.id]) && (
          <div style={{ width: '100%', textAlign: 'center', color: 'var(--candy-green)', fontWeight: 'bold' }}>
            All objects sorted! 🎉
          </div>
        )}
      </div>

      {/* Sorting bins */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        maxWidth: '640px',
        margin: '0 auto'
      }}>
        {BINS.map((bin) => {
          const binItems = ITEMS.filter((i) => placed[i.id] === bin.id);
          return (
            <div
              key={bin.id}
              onClick={() => handleBinClick(bin.id)}
              className={shakeBin === bin.id ? 'shake' : ''}
              style={{
                border: '4px dashed var(--color-primary)',
                borderRadius: '20px',
                padding: '1rem',
                minHeight: '180px',
                background: binItems.length ? 'rgba(108, 92, 231, 0.08)' : 'transparent',
                textAlign: 'center',
                cursor: 'pointer',
                animation: 'float-wiggle 2.5s ease-in-out infinite',
                transition: 'background 0.3s ease'
              }}
            >
              <div style={{ fontSize: '2.5rem' }}>{bin.emoji}</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: '0.25rem 0' }}>{bin.label}</div>
              <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.75rem' }}>{bin.hint}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                {binItems.map((i) => (
                  <span
                    key={i.id}
                    style={{
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: '#fff',
                      borderRadius: '12px',
                      padding: '0.4rem 0.5rem',
                      boxShadow: 'var(--shadow-card, 0 2px 6px rgba(0,0,0,0.1))'
                    }}
                  >
                    <span style={{ fontSize: '1.6rem' }}>{i.emoji}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{i.name}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="detail-back-container">
        <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
          Back to Science
        </button>
      </div>
    </div>
  );
};

export default MagnetMagic;
