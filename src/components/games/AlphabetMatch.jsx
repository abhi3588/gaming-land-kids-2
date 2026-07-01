import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const ALPHABET = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

const createPRNG = (seed) => {
  let currentSeed = seed;
  return () => {
    let x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };
};

const TOTAL_LEVELS = 20;

const buildRound = (level) => {
  const prng = createPRNG(level * 42);
  const shuffle = (array) => [...array].sort(() => prng() - 0.5);

  // Pick target deterministically for the level
  const targetIndex = Math.floor(prng() * 26);
  const targetUpper = ALPHABET[targetIndex];
  const targetLower = targetUpper.toLowerCase();

  // Determine number of options based on level (starts at 2, increases to 6)
  const optionCount = Math.min(2 + Math.floor((level - 1) / 4), 6);

  const distractors = ALPHABET.filter(c => c !== targetUpper);
  const selectedDistractors = shuffle(distractors).slice(0, optionCount - 1).map(c => c.toLowerCase());
  
  const options = shuffle([targetLower, ...selectedDistractors]);

  return { targetUpper, targetLower, options };
};

const AlphabetMatch = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => buildRound(1));
  const [feedback, setFeedback] = useState('Find the matching lowercase letter!');
  const [gameWon, setGameWon] = useState(false);
  const [picked, setPicked] = useState(null);

  const nextRound = useCallback((nextLevel) => {
    setRound(buildRound(nextLevel));
  }, []);

  const handlePick = (letter) => {
    if (gameWon || (picked && letter === round.targetLower)) return;

    if (letter === round.targetLower) {
      playSound('match');
      setPicked(letter);
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
        setFeedback('Find the matching lowercase letter!');
        setPicked(null);
      }, 800);
    } else {
      playSound('wrong');
      setFeedback('Oops, try again!');
      setPicked(letter);
      setTimeout(() => {
        setPicked(null);
        setFeedback('Find the matching lowercase letter!');
      }, 800);
    }
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Alphabet Champion!</h2>
          <p>You completed all 20 alphabet levels.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => {
              setLevel(1);
              setGameWon(false);
              setFeedback('Find the matching lowercase letter!');
              nextRound(1);
              setPicked(null);
            }}>
              Play Again
            </button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Main Menu
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Alphabet Match</div>
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
              {round.targetUpper}
            </div>
          </div>

          <div className="color-options" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            {round.options.map((letter, i) => {
              let isWrong = picked === letter && letter !== round.targetLower;
              let isCorrect = picked === letter && letter === round.targetLower;
              
              return (
                <button
                  key={i}
                  className={`btn ${isWrong ? 'shake' : ''}`}
                  style={{ 
                    fontSize: '3rem', 
                    fontWeight: 'bold',
                    padding: '1rem 2rem',
                    background: isCorrect ? '#1dd1a1' : isWrong ? '#ff6b6b' : 'white',
                    color: isCorrect || isWrong ? 'white' : 'var(--color-accent)',
                    border: '4px solid',
                    borderColor: isCorrect ? '#1dd1a1' : isWrong ? '#ff6b6b' : '#eee',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-soft)'
                  }}
                  onClick={() => handlePick(letter)}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button className="btn btn-primary" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default AlphabetMatch;
