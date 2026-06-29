import { useState } from 'react';
import { playSound } from '../../utils/sounds';

const TOTAL_LEVELS = 20;

const createPRNG = (seed) => {
  let currentSeed = seed;
  return () => {
    let x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };
};

const createRound = (level) => {
  const prng = createPRNG(level * 10);
  const getRandomNumber = (min, max) => Math.floor(prng() * (max - min + 1)) + min;
  const shuffle = (array) => [...array].sort(() => prng() - 0.5);

  const tileCount = Math.min(6 + Math.floor((level - 1) / 2), 14);
  const first = getRandomNumber(1, Math.min(10 + level, 25));
  const second = getRandomNumber(1, Math.min(10 + level, 25));
  const target = first + second;
  const tiles = [first, second];

  while (tiles.length < tileCount) {
    const nextValue = getRandomNumber(1, Math.max(target + 2, 12));
    tiles.push(nextValue);
  }

  return { target, tiles: shuffle(tiles) };
};

const SumPairs = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => createRound(1));
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState('Pick two tiles to reach the target.');
  const [status, setStatus] = useState('idle');
  const [gameWon, setGameWon] = useState(false);

  const loadLevel = (nextLevel) => {
    if (nextLevel > TOTAL_LEVELS) {
      setGameWon(true);
      return;
    }
    setLevel(nextLevel);
    setRound(createRound(nextLevel));
    setSelected([]);
    setFeedback('Pick two tiles to reach the target.');
    setStatus('idle');
  };

  const resetGame = () => {
    setGameWon(false);
    loadLevel(1);
  };

  const handleTile = (idx) => {
    if (selected.includes(idx) || status !== 'idle' || gameWon) return;
    const next = [...selected, idx];
    setSelected(next);
    playSound('pop');

    if (next.length === 2) {
      const sum = round.tiles[next[0]] + round.tiles[next[1]];
      if (sum === round.target) {
        playSound('match');
        setStatus('correct');
        setFeedback('Great job! You found a match.');
        if (level === TOTAL_LEVELS) {
          setTimeout(() => {
            setGameWon(true);
          }, 900);
          return;
        }
        setTimeout(() => {
          playSound('celebrate');
          loadLevel(level + 1);
        }, 900);
      } else {
        playSound('wrong');
        setStatus('wrong');
        setFeedback('Oops! That pair does not match. Try again!');
        setTimeout(() => {
          setSelected([]);
          setFeedback('Pick two tiles to reach the target.');
          setStatus('idle');
        }, 900);
      }
    }
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Pair Picker Pro!</h2>
          <p>You completed all 20 Sum Pairs levels.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Sum Pairs</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div>Tiles: {round.tiles.length}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <h2 style={{ textAlign: 'center', margin: '0.5rem 0 1rem', color: '#666', fontSize: '1.2rem' }}>
            Pick two tiles that add up to the target number.
          </h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1rem 0' }}>
            <div style={{ background: 'white', padding: '0.6rem 1rem', borderRadius: 12, boxShadow: 'var(--shadow-soft)', fontWeight: 800, fontSize: '1.4rem' }}>
              Target: {round.target}
            </div>
          </div>

          <div className="sum-grid">
            {round.tiles.map((n, i) => (
              <button
                key={`${round.target}-${i}`}
                className={`sum-tile ${selected.includes(i) ? 'selected' : ''} ${status === 'wrong' && selected.includes(i) ? 'wrong' : ''}`}
                onClick={() => handleTile(i)}
              >
                {n}
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem', color: status === 'wrong' ? 'var(--color-secondary)' : 'var(--color-accent)', fontWeight: 700 }}>
            {feedback}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <div style={{ fontWeight: 800, color: 'var(--color-accent)' }}>Level: {level}</div>
            <div>
              <button className="btn" style={{ background: '#eee' }} onClick={() => loadLevel(level)}>
                Restart Level
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default SumPairs;
