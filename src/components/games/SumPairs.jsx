import { useState } from 'react';
import { playSound } from '../../utils/sounds';

const generateTiles = (count = 8) => {
  // generate random numbers 1-12
  return Array.from({ length: count }).map(() => Math.floor(Math.random() * 12) + 1);
};

const SumPairs = ({ onBack }) => {
  const [tiles, setTiles] = useState(() => generateTiles());
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 20) + 5);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);

  const resetRound = () => {
    setTiles(generateTiles());
    setTarget(Math.floor(Math.random() * 20) + 5);
    setSelected([]);
  };

  const handleTile = (idx) => {
    if (selected.includes(idx)) return;
    const next = [...selected, idx];
    setSelected(next);
    playSound('pop');

    if (next.length === 2) {
      const sum = tiles[next[0]] + tiles[next[1]];
      if (sum === target) {
        playSound('match');
        setScore(s => s + 1);
        setTimeout(resetRound, 600);
      } else {
        playSound('wrong');
        setTimeout(() => setSelected([]), 600);
      }
    }
  };

  return (
    <div className="game-view pop-in">
      <h2>Sum Pairs</h2>
      <p style={{ textAlign: 'center', margin: '-0.5rem 0 1rem', color: '#666' }}>Pick two tiles that add up to the target number.</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1rem 0' }}>
        <div style={{ background: 'white', padding: '0.6rem 1rem', borderRadius: 12, boxShadow: 'var(--shadow-soft)', fontWeight: 800, fontSize: '1.4rem' }}>
          Target: {target}
        </div>
      </div>

      <div className="sum-grid">
        {tiles.map((n, i) => (
          <button
            key={i}
            className={`sum-tile ${selected.includes(i) ? 'selected' : ''}`}
            onClick={() => handleTile(i)}
          >
            {n}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
        <div style={{ fontWeight: 800, color: 'var(--color-accent)' }}>Score: {score}</div>
        <div>
          <button className="btn" style={{ background: '#eee' }} onClick={resetRound}>New</button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button className="btn btn-primary" onClick={onBack}>Main Menu</button>
      </div>
    </div>
  );
};

export default SumPairs;
