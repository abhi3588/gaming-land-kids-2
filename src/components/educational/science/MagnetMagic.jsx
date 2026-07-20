import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const BINS = [
  { id: 'magnetic', emoji: '🧲', label: 'Magnetic', hint: 'Pulled by a magnet' },
  { id: 'non-magnetic', emoji: '🚫', label: 'Non-Magnetic', hint: 'Not pulled by a magnet' }
];

// 10 graduated stages. Each stage is a fresh tray of objects to sort into the
// Magnetic / Non-Magnetic bins.
//  - Stages 1–2: 4 objects
//  - Stages 3–4: 5 objects
//  - Stages 5–6: 6 objects
//  - Stages 7–9: 7 objects
//  - Stage 10:   8 objects
// Later stages mix in "tricky" metals (gold, aluminium, copper, brass) that look
// metallic but are NOT magnetic — testing deeper understanding.
const STAGES = [
  {
    title: 'Around the House',
    fact: 'Magnets pull on iron and steel — like nails and paperclips!',
    items: [
      { id: 'nail', emoji: '🔩', name: 'Iron Nail', cat: 'magnetic' },
      { id: 'clip', emoji: '📎', name: 'Paperclip', cat: 'magnetic' },
      { id: 'wood', emoji: '🪵', name: 'Wooden Block', cat: 'non-magnetic' },
      { id: 'spoon', emoji: '🥄', name: 'Plastic Spoon', cat: 'non-magnetic' }
    ]
  },
  {
    title: 'In the Kitchen',
    fact: 'Fridges have steel doors that stick to magnets — but paper and apples do not!',
    items: [
      { id: 'fridge', emoji: '🧊', name: 'Refrigerator', cat: 'magnetic' },
      { id: 'key', emoji: '🔑', name: 'Metal Key', cat: 'magnetic' },
      { id: 'paper', emoji: '📄', name: 'Paper', cat: 'non-magnetic' },
      { id: 'apple', emoji: '🍎', name: 'Apple', cat: 'non-magnetic' }
    ]
  },
  {
    title: 'Garage Tools',
    fact: 'Tools like screws and chains are often steel (magnetic), while rubber and stone are not.',
    items: [
      { id: 'screw', emoji: '⚙️', name: 'Screw', cat: 'magnetic' },
      { id: 'chain', emoji: '🔗', name: 'Steel Chain', cat: 'magnetic' },
      { id: 'ball', emoji: '🧶', name: 'Rubber Ball', cat: 'non-magnetic' },
      { id: 'stone', emoji: '🪨', name: 'Stone', cat: 'non-magnetic' },
      { id: 'leaf', emoji: '🌿', name: 'Leaf', cat: 'non-magnetic' }
    ]
  },
  {
    title: 'Desk Drawer',
    fact: 'Scissors and wrenches are steel (magnetic); food like bananas and bread are not.',
    items: [
      { id: 'scissors', emoji: '✂️', name: 'Scissors', cat: 'magnetic' },
      { id: 'wrench', emoji: '🔧', name: 'Wrench', cat: 'magnetic' },
      { id: 'banana', emoji: '🍌', name: 'Banana', cat: 'non-magnetic' },
      { id: 'bread', emoji: '🍞', name: 'Bread', cat: 'non-magnetic' },
      { id: 'sock', emoji: '🧦', name: 'Sock', cat: 'non-magnetic' }
    ]
  },
  {
    title: 'Mixed Tray',
    fact: 'Trick: gold rings and aluminium cans look shiny like metal, but magnets ignore them!',
    items: [
      { id: 'nail', emoji: '🔩', name: 'Iron Nail', cat: 'magnetic' },
      { id: 'clip', emoji: '📎', name: 'Paperclip', cat: 'magnetic' },
      { id: 'wood', emoji: '🪵', name: 'Wood Block', cat: 'non-magnetic' },
      { id: 'bottle', emoji: '🧴', name: 'Plastic Bottle', cat: 'non-magnetic' },
      { id: 'gold', emoji: '💍', name: 'Gold Ring', cat: 'non-magnetic' },
      { id: 'can', emoji: '🥫', name: 'Aluminium Can', cat: 'non-magnetic' }
    ]
  },
  {
    title: 'Toy Box',
    fact: 'A tin toy car and a key are steel (magnetic); a rubber duck and wood are not.',
    items: [
      { id: 'car', emoji: '🚗', name: 'Toy Car', cat: 'magnetic' },
      { id: 'key', emoji: '🔑', name: 'Metal Key', cat: 'magnetic' },
      { id: 'duck', emoji: '🦆', name: 'Rubber Duck', cat: 'non-magnetic' },
      { id: 'wood', emoji: '🪵', name: 'Wooden Block', cat: 'non-magnetic' },
      { id: 'paper', emoji: '📄', name: 'Paper', cat: 'non-magnetic' },
      { id: 'stone', emoji: '🪨', name: 'Stone', cat: 'non-magnetic' }
    ]
  },
  {
    title: 'Garden Shed',
    fact: 'Garden tools are steel (magnetic), but plants, stones, and plastic pots are not.',
    items: [
      { id: 'screw', emoji: '⚙️', name: 'Screw', cat: 'magnetic' },
      { id: 'chain', emoji: '🔗', name: 'Chain', cat: 'magnetic' },
      { id: 'apple', emoji: '🍎', name: 'Apple', cat: 'non-magnetic' },
      { id: 'leaf', emoji: '🌿', name: 'Leaf', cat: 'non-magnetic' },
      { id: 'stone', emoji: '🪨', name: 'Stone', cat: 'non-magnetic' },
      { id: 'bucket', emoji: '🪣', name: 'Metal Bucket', cat: 'magnetic' },
      { id: 'pot', emoji: '🪴', name: 'Plant Pot', cat: 'non-magnetic' }
    ]
  },
  {
    title: 'Classroom',
    fact: 'Paperclips and rulers are steel (magnetic); a pencil, paper, and cloth are not.',
    items: [
      { id: 'clip', emoji: '📎', name: 'Paperclip', cat: 'magnetic' },
      { id: 'scissors', emoji: '✂️', name: 'Scissors', cat: 'magnetic' },
      { id: 'pencil', emoji: '✏️', name: 'Pencil', cat: 'non-magnetic' },
      { id: 'sponge', emoji: '🧽', name: 'Sponge', cat: 'non-magnetic' },
      { id: 'ruler', emoji: '📏', name: 'Metal Ruler', cat: 'magnetic' },
      { id: 'paper', emoji: '📄', name: 'Paper', cat: 'non-magnetic' },
      { id: 'cloth', emoji: '🧣', name: 'Cloth', cat: 'non-magnetic' }
    ]
  },
  {
    title: 'Tricky Metals',
    fact: 'Trick: copper, brass, and gold are NOT magnetic — only iron and steel stick!',
    items: [
      { id: 'gold', emoji: '💍', name: 'Gold Ring', cat: 'non-magnetic' },
      { id: 'can', emoji: '🥫', name: 'Aluminium Can', cat: 'non-magnetic' },
      { id: 'spoon', emoji: '🥄', name: 'Steel Spoon', cat: 'magnetic' },
      { id: 'nail', emoji: '🔩', name: 'Iron Nail', cat: 'magnetic' },
      { id: 'wire', emoji: '🔌', name: 'Copper Wire', cat: 'non-magnetic' },
      { id: 'bell', emoji: '🔔', name: 'Brass Bell', cat: 'non-magnetic' },
      { id: 'chain', emoji: '🔗', name: 'Steel Chain', cat: 'magnetic' }
    ]
  },
  {
    title: 'Big Mix',
    fact: 'Practice: keys, clips, and screws stick; wood, fruit, and aluminium cans do not!',
    items: [
      { id: 'key', emoji: '🔑', name: 'Metal Key', cat: 'magnetic' },
      { id: 'clip', emoji: '📎', name: 'Paperclip', cat: 'magnetic' },
      { id: 'wood', emoji: '🪵', name: 'Wood', cat: 'non-magnetic' },
      { id: 'apple', emoji: '🍎', name: 'Apple', cat: 'non-magnetic' },
      { id: 'ball', emoji: '🧶', name: 'Rubber Ball', cat: 'non-magnetic' },
      { id: 'stone', emoji: '🪨', name: 'Stone', cat: 'non-magnetic' },
      { id: 'can', emoji: '🥫', name: 'Aluminium Can', cat: 'non-magnetic' },
      { id: 'screw', emoji: '⚙️', name: 'Screw', cat: 'magnetic' }
    ]
  }
];

const MagnetMagic = ({ onBack }) => {
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
          <div style={{ fontSize: '4rem' }}>🧲</div>
          <h2>Magnet Master!</h2>
          <p>You sorted every object across all {STAGES.length} stages — what a pro!</p>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Magnets pull iron and steel (nails, clips, fridges) — but not wood, plastic,
            gold, aluminium, copper, or brass!
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
        <div>Magnet Magic 🧲</div>
        <div>Stage {stageIndex + 1} / {STAGES.length}</div>
        <div>Sorted {placedCount} / {items.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(placedCount / items.length) * 100}%` }} />
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', margin: '0.5rem 0 1rem' }}>
        <b>{stage.title}</b> — tap an object, then tap the bin where it belongs!
      </p>

      {/* Tray of unsorted items */}
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
          const binItems = items.filter((i) => placed[i.id] === bin.id);
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

export default MagnetMagic;
