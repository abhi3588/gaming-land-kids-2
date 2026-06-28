import { useState, useEffect, useRef, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const TOTAL_LEVELS = 20;

const createLevelData = (level) => {
  const isHard = level > 10;
  const gridSize = isHard ? 4 : 3;
  const totalCells = gridSize * gridSize;
  
  // Calculate how many cells should light up
  let targetCount;
  if (!isHard) {
    targetCount = Math.min(3 + Math.floor((level - 1) / 3), 6);
  } else {
    targetCount = Math.min(4 + Math.floor((level - 11) / 2), 8);
  }

  const cells = Array.from({ length: totalCells }, (_, i) => i);
  // Shuffle and pick targetCount cells
  const shuffled = [...cells].sort(() => Math.random() - 0.5);
  const targets = shuffled.slice(0, targetCount);

  return { gridSize, totalCells, targets };
};

const MemoryMatrix = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState(() => createLevelData(1));
  const [gameState, setGameState] = useState('idle'); // idle, showing, playing, won, over
  const [selected, setSelected] = useState([]);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState('Watch the grid closely!');
  const [gameWon, setGameWon] = useState(false);

  const timeoutRef = useRef(null);

  const clearTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    return clearTimer;
  }, []);

  const startGame = useCallback((lvl = 1) => {
    clearTimer();
    const newLvlData = createLevelData(lvl);
    setLevel(lvl);
    setData(newLvlData);
    setSelected([]);
    setErrors([]);
    setGameState('showing');
    setMessage('Memorize the lit tiles!');

    timeoutRef.current = setTimeout(() => {
      setGameState('playing');
      setMessage('Now tap the tiles that were lit!');
    }, 2000); // show for 2 seconds
  }, []);

  const handleCellClick = (idx) => {
    if (gameState !== 'playing' || gameWon) return;

    if (selected.includes(idx) || errors.includes(idx)) return;

    if (data.targets.includes(idx)) {
      playSound('pop');
      const newSelected = [...selected, idx];
      setSelected(newSelected);

      if (newSelected.length === data.targets.length) {
        setGameState('won');
        playSound('match');
        setMessage('Perfect memory! 🎉');
        if (level === TOTAL_LEVELS) {
          setTimeout(() => {
            playSound('celebrate');
            setGameWon(true);
          }, 1000);
        } else {
          setTimeout(() => {
            startGame(level + 1);
          }, 1500);
        }
      }
    } else {
      playSound('wrong');
      setErrors([...errors, idx]);
      setGameState('over');
      setMessage('Oops! That was not lit. Try again!');
      setTimeout(() => {
        startGame(level);
      }, 2000);
    }
  };

  const isCellActive = (idx) => {
    if (gameState === 'showing') return data.targets.includes(idx);
    if (gameState === 'playing' || gameState === 'won') return selected.includes(idx);
    if (gameState === 'over') {
      if (data.targets.includes(idx)) return true; // show missed targets
      return false;
    }
    return false;
  };

  const isCellError = (idx) => {
    return errors.includes(idx);
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🧠</div>
          <h2>Memory Master!</h2>
          <p>You completed all 20 levels of Memory Matrix.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => { setGameWon(false); startGame(1); }}>
              Play Again
            </button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => typeof onBack === 'function' && onBack()}>
              Main Menu
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Memory Matrix</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <p style={{ textAlign: 'center', margin: '0.5rem 0 1.5rem', color: '#666', fontWeight: 600 }}>
            {message}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${data.gridSize}, 1fr)`,
                gap: '10px',
                width: '100%',
                maxWidth: '400px',
                aspectRatio: '1',
                background: '#e2e8f0',
                padding: '10px',
                borderRadius: '16px',
                boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              {Array.from({ length: data.totalCells }).map((_, idx) => {
                const active = isCellActive(idx);
                const error = isCellError(idx);
                let bg = 'white';
                if (active) bg = '#1dd1a1';
                if (error) bg = '#ff6b6b';

                return (
                  <button
                    key={idx}
                    onClick={() => handleCellClick(idx)}
                    disabled={gameState !== 'playing'}
                    style={{
                      background: bg,
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: active || error ? '0 0 15px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s',
                      cursor: gameState === 'playing' ? 'pointer' : 'default',
                      transform: active && gameState === 'showing' ? 'scale(0.95)' : 'scale(1)'
                    }}
                  />
                );
              })}
            </div>
          </div>

          {gameState === 'idle' && (
            <div style={{ textAlign: 'center' }}>
              <button className="btn btn-primary" onClick={() => startGame(level)}>
                Start Level
              </button>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button className="btn" style={{ background: '#eee', color: '#333' }}
              onClick={() => typeof onBack === 'function' && onBack()}>
              Main Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MemoryMatrix;
