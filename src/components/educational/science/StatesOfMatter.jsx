import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const BINS = [
  { id: 'solid', emoji: '🧱', label: 'Solid', hint: 'Keeps its shape' },
  { id: 'liquid', emoji: '💦', label: 'Liquid', hint: 'Pours and flows' },
  { id: 'gas', emoji: '🌬️', label: 'Gas', hint: 'Floats and spreads out' }
];

// 10 graduated stages. Each stage is a fresh tray of things to sort into
// Solid / Liquid / Gas.
//  - Stages 1–2: 4 things
//  - Stages 3–4: 5 things
//  - Stages 5–6: 6 things
//  - Stages 7–9: 7 things
//  - Stage 10:   8 things
// Later stages mix in "tricky" matter (jelly, glass, lava, fog, mercury) to test
// deeper understanding of the three states.
const STAGES = [
  {
    title: 'Everyday Things',
    fact: 'Solids keep their shape, liquids pour, and gases float away in the air!',
    items: [
      { id: 'ice', emoji: '❄️', name: 'Ice', cat: 'solid' },
      { id: 'water', emoji: '💧', name: 'Water', cat: 'liquid' },
      { id: 'steam', emoji: '💨', name: 'Steam', cat: 'gas' },
      { id: 'rock', emoji: '🪨', name: 'Rock', cat: 'solid' }
    ]
  },
  {
    title: 'Snack Time',
    fact: 'Juice and honey pour (liquids); an apple holds its shape (solid); balloon air spreads out (gas)!',
    items: [
      { id: 'juice', emoji: '🧃', name: 'Juice', cat: 'liquid' },
      { id: 'apple', emoji: '🍎', name: 'Apple', cat: 'solid' },
      { id: 'air', emoji: '🎈', name: 'Balloon Air', cat: 'gas' },
      { id: 'honey', emoji: '🍯', name: 'Honey', cat: 'liquid' }
    ]
  },
  {
    title: 'Kitchen',
    fact: 'Steam and air are gases; water and oil are liquids; a book is a solid.',
    items: [
      { id: 'water', emoji: '💧', name: 'Water', cat: 'liquid' },
      { id: 'book', emoji: '📕', name: 'Book', cat: 'solid' },
      { id: 'steam', emoji: '💨', name: 'Steam', cat: 'gas' },
      { id: 'oil', emoji: '🫗', name: 'Oil', cat: 'liquid' },
      { id: 'air', emoji: '🌬️', name: 'Air', cat: 'gas' }
    ]
  },
  {
    title: 'Weather',
    fact: 'Snow and rock are solids, rain is liquid, and clouds are made of tiny gas droplets!',
    items: [
      { id: 'rain', emoji: '🌧️', name: 'Rain', cat: 'liquid' },
      { id: 'snow', emoji: '❄️', name: 'Snow', cat: 'solid' },
      { id: 'cloud', emoji: '☁️', name: 'Cloud', cat: 'gas' },
      { id: 'rock', emoji: '🪨', name: 'Rock', cat: 'solid' },
      { id: 'water', emoji: '💧', name: 'Water', cat: 'liquid' }
    ]
  },
  {
    title: 'Nature Walk',
    fact: 'Wood and stone are solids; soup and juice are liquids; air and smoke are gases.',
    items: [
      { id: 'wood', emoji: '🪵', name: 'Wood', cat: 'solid' },
      { id: 'juice', emoji: '🧃', name: 'Juice', cat: 'liquid' },
      { id: 'air', emoji: '🌬️', name: 'Air', cat: 'gas' },
      { id: 'stone', emoji: '🪨', name: 'Stone', cat: 'solid' },
      { id: 'soup', emoji: '🍲', name: 'Soup', cat: 'liquid' },
      { id: 'smoke', emoji: '💨', name: 'Smoke', cat: 'gas' }
    ]
  },
  {
    title: 'Tricky Matter',
    fact: 'Trick: jelly and glass keep their shape (solids); lava is liquid rock; fog and perfume are gases!',
    items: [
      { id: 'jelly', emoji: '🍮', name: 'Jelly', cat: 'solid' },
      { id: 'glass', emoji: '🪟', name: 'Glass', cat: 'solid' },
      { id: 'lava', emoji: '🌋', name: 'Lava', cat: 'liquid' },
      { id: 'fog', emoji: '🌫️', name: 'Fog', cat: 'gas' },
      { id: 'ice', emoji: '❄️', name: 'Ice', cat: 'solid' },
      { id: 'perfume', emoji: '💐', name: 'Perfume', cat: 'gas' }
    ]
  },
  {
    title: 'Around the Home',
    fact: 'Books, bricks, and sand are solids; milk and paint are liquids; steam and balloon air are gases.',
    items: [
      { id: 'book', emoji: '📕', name: 'Book', cat: 'solid' },
      { id: 'milk', emoji: '🥛', name: 'Milk', cat: 'liquid' },
      { id: 'steam', emoji: '💨', name: 'Steam', cat: 'gas' },
      { id: 'brick', emoji: '🧱', name: 'Brick', cat: 'solid' },
      { id: 'paint', emoji: '🎨', name: 'Paint', cat: 'liquid' },
      { id: 'balloon', emoji: '🎈', name: 'Balloon', cat: 'gas' },
      { id: 'sand', emoji: '⏳', name: 'Sand', cat: 'solid' }
    ]
  },
  {
    title: 'More Matter',
    fact: 'Candy and crayons are solids; soda and oil are liquids; clouds and balloons hold gas.',
    items: [
      { id: 'candy', emoji: '🍬', name: 'Candy', cat: 'solid' },
      { id: 'soda', emoji: '🥤', name: 'Soda', cat: 'liquid' },
      { id: 'cloud', emoji: '☁️', name: 'Cloud', cat: 'gas' },
      { id: 'crayon', emoji: '🖍️', name: 'Crayon', cat: 'solid' },
      { id: 'oil', emoji: '🫗', name: 'Oil', cat: 'liquid' },
      { id: 'balloon', emoji: '🎈', name: 'Balloon', cat: 'gas' },
      { id: 'stone', emoji: '🪨', name: 'Stone', cat: 'solid' }
    ]
  },
  {
    title: 'Hard Ones',
    fact: 'Trick: mercury is a liquid metal! Diamond and wood are solids; steam and air are gases.',
    items: [
      { id: 'mercury', emoji: '🌡️', name: 'Mercury', cat: 'liquid' },
      { id: 'diamond', emoji: '💎', name: 'Diamond', cat: 'solid' },
      { id: 'steam', emoji: '💨', name: 'Steam', cat: 'gas' },
      { id: 'glue', emoji: '🧴', name: 'Glue', cat: 'liquid' },
      { id: 'snow', emoji: '❄️', name: 'Snow', cat: 'solid' },
      { id: 'air', emoji: '🌬️', name: 'Air', cat: 'gas' },
      { id: 'wood', emoji: '🪵', name: 'Wood', cat: 'solid' }
    ]
  },
  {
    title: 'Big Mix',
    fact: 'A big mix — can you name each one\'s state? Great job, scientist!',
    items: [
      { id: 'water', emoji: '💧', name: 'Water', cat: 'liquid' },
      { id: 'apple', emoji: '🍎', name: 'Apple', cat: 'solid' },
      { id: 'balloon', emoji: '🎈', name: 'Balloon', cat: 'gas' },
      { id: 'honey', emoji: '🍯', name: 'Honey', cat: 'liquid' },
      { id: 'stone', emoji: '🪨', name: 'Stone', cat: 'solid' },
      { id: 'smoke', emoji: '💨', name: 'Smoke', cat: 'gas' },
      { id: 'book', emoji: '📕', name: 'Book', cat: 'solid' },
      { id: 'rain', emoji: '🌧️', name: 'Rain', cat: 'liquid' }
    ]
  }
];

const StatesOfMatter = ({ onBack }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [placed, setPlaced] = useState({}); // itemId -> binId
  const [shakeBin, setShakeBin] = useState(null);
  const [stageSolved, setStageSolved] = useState(false);
  const [completed, setCompleted] = useState(false);

  const stage = STAGES[stageIndex];
  const items = stage.items;
  const placedCount = Object.keys(placed).length;

  const resetStage = (newIndex) => {
    playSound('pop');
    setStageIndex(newIndex);
    setSelected(null);
    setPlaced({});
    setShakeBin(null);
    setStageSolved(false);
  };

  const handleItemClick = (item) => {
    if (placed[item.id] || stageSolved) return;
    playSound('pop');
    setSelected(item.id === selected ? null : item.id);
  };

  const handleBinClick = (binId) => {
    if (!selected || stageSolved) return;
    const item = items.find((i) => i.id === selected);
    if (item.cat === binId) {
      playSound('match');
      const next = { ...placed, [item.id]: binId };
      setPlaced(next);
      setSelected(null);
      if (Object.keys(next).length === items.length) {
        playSound('celebrate');
        setStageSolved(true);
      }
    } else {
      playSound('wrong');
      setShakeBin(binId);
      setSelected(null);
      setTimeout(() => setShakeBin(null), 500);
    }
  };

  const handleNext = () => {
    if (stageIndex < STAGES.length - 1) {
      resetStage(stageIndex + 1);
    } else {
      playSound('celebrate');
      setCompleted(true);
    }
  };

  const handleResetAll = () => {
    playSound('pop');
    setSelected(null);
    setPlaced({});
    setShakeBin(null);
    setStageSolved(false);
    setCompleted(false);
    setStageIndex(0);
  };

  if (completed) {
    return (
      <div className="game-view pop-in">
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🧪</div>
          <h2>States of Matter Pro!</h2>
          <p>You sorted every thing across all {STAGES.length} stages — solid work!</p>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Solids hold their shape, liquids pour, and gases float away in the air!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleResetAll}>
              Play Again
            </button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
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
        <div>States of Matter 💧</div>
        <div>Stage {stageIndex + 1} / {STAGES.length}</div>
        <div>Sorted {placedCount} / {items.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(placedCount / items.length) * 100}%` }} />
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', margin: '0.5rem 0 1rem' }}>
        <b>{stage.title}</b> — tap a thing, then tap the bin that matches its state!
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.75rem',
        marginBottom: '2rem'
      }}>
        {items.filter((i) => !placed[i.id]).map((item) => (
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
        {items.every((i) => placed[i.id]) && (
          <div style={{ width: '100%', textAlign: 'center', color: 'var(--candy-green)', fontWeight: 'bold' }}>
            All things sorted! 🎉
          </div>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
        maxWidth: '720px',
        margin: '0 auto'
      }}>
        {BINS.map((bin) => {
          const binItems = items.filter((i) => placed[i.id] === bin.id);
          return (
            <div
              key={bin.id}
              onClick={() => handleBinClick(bin.id)}
              className={shakeBin === bin.id ? 'shake' : ''}
              style={{
                border: '4px dashed var(--color-primary)',
                borderRadius: '20px',
                padding: '1rem 0.5rem',
                minHeight: '190px',
                background: binItems.length ? 'rgba(108, 92, 231, 0.08)' : 'transparent',
                textAlign: 'center',
                cursor: 'pointer',
                animation: 'float-wiggle 2.5s ease-in-out infinite',
                transition: 'background 0.3s ease'
              }}
            >
              <div style={{ fontSize: '2.2rem' }}>{bin.emoji}</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: '0.25rem 0' }}>{bin.label}</div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.75rem' }}>{bin.hint}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
                {binItems.map((i) => (
                  <span
                    key={i.id}
                    style={{
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: '#fff',
                      borderRadius: '12px',
                      padding: '0.35rem 0.4rem',
                      boxShadow: 'var(--shadow-card, 0 2px 6px rgba(0,0,0,0.1))'
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{i.emoji}</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>{i.name}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Success / controls */}
      {stageSolved ? (
        <div className="fc-success" style={{ marginTop: '1.5rem' }}>
          <div className="fc-success-badge">🌟 Stage complete! {stage.fact}</div>
          <div className="detail-back-container" style={{ gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={handleNext}>
              {stageIndex < STAGES.length - 1 ? 'Next Stage ➡️' : 'Finish! 🎉'}
            </button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Science
            </button>
          </div>
        </div>
      ) : (
        <div className="detail-back-container">
          <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
            Back to Science
          </button>
        </div>
      )}
    </div>
  );
};

export default StatesOfMatter;
