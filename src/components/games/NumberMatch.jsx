import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const TOTAL_LEVELS = 20;

const createPRNG = (seed) => {
  let currentSeed = seed;
  return () => {
    let x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };
};

const buildRound = (level) => {
  const prng = createPRNG(level * 37);
  const shuffle = (array) => [...array].sort(() => prng() - 0.5);

  // Determine max number based on level
  const maxNumber = level <= 5 ? 3 : level <= 10 ? 5 : level <= 15 ? 7 : 10;
  
  // Pick target number deterministically
  const targetNumber = Math.floor(prng() * maxNumber) + 1;

  // Determine number of options based on level (starts at 2, increases to 6)
  const optionCount = Math.min(2 + Math.floor((level - 1) / 4), 6);

  // Generate distractors
  const distractors = [];
  while (distractors.length < optionCount - 1) {
    const num = Math.floor(prng() * maxNumber) + 1;
    if (num !== targetNumber && !distractors.includes(num)) {
      distractors.push(num);
    }
  }

  const options = shuffle([targetNumber, ...distractors]);

  return { targetNumber, options };
};

const NumberMatch = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => buildRound(1));
  const [feedback, setFeedback] = useState('Match the number to the dots!');
  const [gameWon, setGameWon] = useState(false);
  const [picked, setPicked] = useState(null);

  const nextRound = useCallback((nextLevel) => {
    setRound(buildRound(nextLevel));
  }, []);

  const handlePick = (number) => {
    if (gameWon || (picked && number === round.targetNumber)) return;

    if (number === round.targetNumber) {
      playSound('match');
      setPicked(number);
      if (level === TOTAL_LEVELS) {
        setFeedback('Amazing! You matched them all!');
        setTimeout(() => {
          setGameWon(true);
        }, 800);
        return;
      }

      setFeedback('Great job! Level up!');
      setTimeout(() => {
        setLevel((prev) => {
          const nextLevel = prev + 1;
          nextRound(nextLevel);
          return nextLevel;
        });
        setFeedback('Match the number to the dots!');
        setPicked(null);
      }, 800);
    } else {
      playSound('wrong');
      setFeedback('Oops, try again!');
      setPicked(number);
      setTimeout(() => {
        setPicked(null);
        setFeedback('Match the number to the dots!');
      }, 800);
    }
  };

  const renderDots = (count) => {
    const dots = [];
    for (let i = 0; i < count; i++) {
      dots.push(
        <span key={i} style={{ 
          fontSize: 'clamp(1.2rem, 5vw, 2rem)', 
          margin: '0.2rem',
          display: 'inline-block'
        }}>
          ⚫
        </span>
      );
    }
    return dots;
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Number Match Champion!</h2>
          <p>You completed all 20 number matching levels.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => {
              setLevel(1);
              setGameWon(false);
              setFeedback('Match the number to the dots!');
              nextRound(1);
              setPicked(null);
            }}>
              Play Again
            </button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Number Match</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <p style={{ textAlign: 'center', margin: '-0.5rem 0 1rem', color: '#666' }}>{feedback}</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '2rem 0' }}>
            <div style={{ 
              fontSize: '6rem', 
              fontWeight: 'bold', 
              color: 'var(--color-primary)',
              textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
            }}>
              {round.targetNumber}
            </div>
          </div>

          <div className="color-options" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            {round.options.map((number, i) => {
              let isWrong = picked === number && number !== round.targetNumber;
              let isCorrect = picked === number && number === round.targetNumber;
              
              return (
                <button
                  key={i}
                  className={`btn ${isWrong ? 'shake' : ''}`}
                  style={{ 
                    fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', 
                    fontWeight: 'bold',
                    padding: 'clamp(0.5rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem)',
                    background: isCorrect ? '#1dd1a1' : isWrong ? '#ff6b6b' : 'white',
                    color: isCorrect || isWrong ? 'white' : 'var(--color-accent)',
                    border: '4px solid',
                    borderColor: isCorrect ? '#1dd1a1' : isWrong ? '#ff6b6b' : '#eee',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-soft)',
                    minWidth: 'clamp(80px, 20vw, 120px)',
                    flex: '1 1 auto',
                    maxWidth: '45%'
                  }}
                  onClick={() => handlePick(number)}
                >
                  <div>{renderDots(number)}</div>
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default NumberMatch;
