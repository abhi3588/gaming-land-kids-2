import { useState } from 'react';
import { playSound } from '../../utils/sounds';

const shapes = ['🔴', '🔵', '⭐', '💎', '🍀'];
const TOTAL_LEVELS = 20;

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

const createPatternData = (level) => {
  const symbolCount = Math.min(2 + Math.floor((level - 1) / 6), shapes.length);
  const patternLength = Math.min(4 + Math.floor((level - 1) / 5), 6);
  const optionCount = Math.min(2 + Math.floor(level / 6), 4);
  const symbols = shuffle(shapes).slice(0, symbolCount);

  let fullPattern = [];
  if (level <= 8) {
    const [a, b] = symbols;
    for (let i = 0; i < patternLength; i++) {
      fullPattern.push(i % 2 === 0 ? a : b);
    }
  } else if (level <= 14) {
    const [a, b, c] = symbols;
    const base = [a, b, c, a, b, c];
    for (let i = 0; i < patternLength; i++) {
      fullPattern.push(base[i % base.length]);
    }
  } else {
    const [a, b, c, d] = symbols;
    const base = [a, b, c, a, d, b, c];
    for (let i = 0; i < patternLength; i++) {
      fullPattern.push(base[i % base.length]);
    }
  }

  const expected = fullPattern[fullPattern.length - 1];
  const displayPattern = fullPattern.slice(0, fullPattern.length - 1);

  const options = shuffle([
    expected,
    ...shuffle(shapes.filter((shape) => shape !== expected)).slice(0, optionCount - 1)
  ]);

  return {
    pattern: displayPattern,
    options,
    expected,
    message: 'What comes next?'
  };
};

const PatternGame = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState(() => createPatternData(1));
  const [message, setMessage] = useState('What comes next?');
  const [gameWon, setGameWon] = useState(false);

  const loadLevel = (nextLevel) => {
    if (nextLevel > TOTAL_LEVELS) {
      setGameWon(true);
      return;
    }
    setLevel(nextLevel);
    setData(createPatternData(nextLevel));
    setMessage('What comes next?');
  };

  const handleOptionClick = (shape) => {
    if (gameWon) return;

    if (shape === data.expected) {
      playSound('match');
      setMessage('Correct! 🎉');
      if (level === TOTAL_LEVELS) {
        setTimeout(() => {
          setGameWon(true);
        }, 500);
      } else {
        setTimeout(() => {
          playSound('celebrate');
          loadLevel(level + 1);
        }, 800);
      }
    } else {
      playSound('wrong');
      setMessage('Try again! ❤️');
    }
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Pattern Pro!</h2>
          <p>You cracked all 20 pattern puzzles.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => loadLevel(1)}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Pattern Train</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div>Sequence Length: {data.pattern.length + 1}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <div className="pattern-sequence">
            {data.pattern.map((s, i) => (
              <div key={i} className="pop-in">{s}</div>
            ))}
            <div className="pattern-missing">?</div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>{message}</p>
          </div>

          <div className="pattern-options">
            {data.options.map((shape, i) => (
              <button key={i} className="btn pattern-option" onClick={() => handleOptionClick(shape)}>
                {shape}
              </button>
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

export default PatternGame;
