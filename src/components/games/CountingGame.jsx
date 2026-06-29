import { useState } from 'react';
import { playSound } from '../../utils/sounds';

const TOTAL_LEVELS = 20;
const MAX_STARS = 16;

const getTarget = (level) => Math.min(3 + Math.floor(level * 0.8), 15);
const getTotalStars = (target) => Math.min(target + 2, MAX_STARS);

const createPRNG = (seed) => () => {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const createLevelData = (level) => {
  const prng = createPRNG(level * 10);
  const target = getTarget(level);
  const total = getTotalStars(target);
  const stars = Array.from({ length: total }, (_, i) => ({
    id: `${level}-${i}`,
    x: prng() * 82 + 8,
    y: prng() * 62 + 8,
    popped: false
  }));

  return {
    target,
    stars,
    count: 0,
    level
  };
};

const CountingGame = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState(() => createLevelData(1));
  const [message, setMessage] = useState(`Level 1: Pop ${getTarget(1)} stars!`);
  const [gameWon, setGameWon] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const loadLevel = (nextLevel) => {
    if (nextLevel > TOTAL_LEVELS) {
      setGameWon(true);
      return;
    }
    setLevel(nextLevel);
    setData(createLevelData(nextLevel));
    setMessage(`Level ${nextLevel}: Pop ${getTarget(nextLevel)} stars!`);
    setDisabled(false);
  };

  const handleStarClick = (id) => {
    if (disabled || gameWon) return;
    const star = data.stars.find((s) => s.id === id);
    if (!star || star.popped) return;

    playSound('pop');
    const newStars = data.stars.map((s) => (s.id === id ? { ...s, popped: true } : s));
    const newCount = data.count + 1;

    setData((prev) => ({ ...prev, stars: newStars, count: newCount }));

    if (newCount === data.target) {
      playSound('celebrate');
      setDisabled(true);
      if (level === TOTAL_LEVELS) {
        setTimeout(() => {
          setGameWon(true);
        }, 700);
      } else {
        setMessage('Well done! Next level coming up...');
        setTimeout(() => {
          loadLevel(level + 1);
        }, 1000);
      }
    }
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Star Counting Hero!</h2>
          <p>You completed all 20 counting levels with brilliant focus.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => loadLevel(1)}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Star Count</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div>Found: {data.count}/{data.target}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--color-accent)', fontWeight: 700 }}>
            {message}
          </div>

          <div className="counting-area">
            {data.stars.map((star) => (
              <div
                key={star.id}
                className="star"
                onClick={() => handleStarClick(star.id)}
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  opacity: star.popped ? 0 : 1,
                  transform: star.popped ? 'scale(1.6)' : 'scale(1)',
                  pointerEvents: star.popped ? 'none' : 'auto'
                }}
              >
                ⭐
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn btn-primary" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CountingGame;
