import { useState } from 'react';
import { playSound } from '../../utils/sounds';

const COLORS = [
  '#FF6B6B', // red
  '#FFD93D', // yellow
  '#6BCB77', // green
  '#4D96FF', // blue
  '#C77DFF', // purple
  '#FF9F1C'  // orange
];

const getShuffled = (arr) => [...arr].sort(() => Math.random() - 0.5);

const ColorMatch = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(() => {
    const list = getShuffled(COLORS);
    return list[0];
  });

  const options = getShuffled(COLORS).slice(0, 4);
  if (!options.includes(target)) {
    options[Math.floor(Math.random() * 4)] = target;
  }

  const handlePick = (c) => {
    if (c === target) {
      playSound('match');
      setScore(s => s + 1);
      setLevel(l => l + 1);
      setTimeout(() => setTarget(getShuffled(COLORS)[0]), 400);
    } else {
      playSound('wrong');
    }
  };

  return (
    <div className="game-view pop-in">
      <h2>Color Match</h2>
      <p style={{ textAlign: 'center', margin: '-0.5rem 0 1rem', color: '#666' }}>Tap the color that matches the target!</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1rem 0' }}>
        <div className="color-circle" style={{ background: target }} aria-hidden />
      </div>

      <div className="color-options">
        {options.map((c,i) => (
          <button
            key={i}
            className="btn"
            style={{ background: c, width: 84, height: 84, borderRadius: 18, border: '4px solid rgba(0,0,0,0.06)' }}
            onClick={() => handlePick(c)}
          />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '1rem' }}>
        <div style={{ fontWeight: 800, color: 'var(--color-accent)' }}>Level: {level}</div>
        <div style={{ fontWeight: 800, color: 'var(--color-success)' }}>Score: {score}</div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button className="btn btn-primary" onClick={onBack}>Main Menu</button>
      </div>
    </div>
  );
};

export default ColorMatch;
