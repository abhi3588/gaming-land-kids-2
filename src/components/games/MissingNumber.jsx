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
  const prng = createPRNG(level * 53);
  const shuffle = (array) => [...array].sort(() => prng() - 0.5);

  let sequence, missingIndex, correctAnswer;

  if (level <= 5) {
    // Simple counting 1-5
    const start = Math.floor(prng() * 3) + 1;
    sequence = [start, start + 1, start + 2, start + 3, start + 4];
    missingIndex = Math.floor(prng() * 5);
    correctAnswer = sequence[missingIndex];
  } else if (level <= 10) {
    // Counting 1-10
    const start = Math.floor(prng() * 6) + 1;
    sequence = [start, start + 1, start + 2, start + 3];
    missingIndex = Math.floor(prng() * 4);
    correctAnswer = sequence[missingIndex];
  } else if (level <= 15) {
    // Counting by 2s
    const start = Math.floor(prng() * 3) * 2 + 2;
    sequence = [start, start + 2, start + 4, start + 6, start + 8];
    missingIndex = Math.floor(prng() * 5);
    correctAnswer = sequence[missingIndex];
  } else {
    // Mixed patterns
    const patternType = Math.floor(prng() * 3);
    if (patternType === 0) {
      // Backward counting
      const start = Math.floor(prng() * 5) + 6;
      sequence = [start, start - 1, start - 2, start - 3];
      missingIndex = Math.floor(prng() * 4);
      correctAnswer = sequence[missingIndex];
    } else if (patternType === 1) {
      // Counting by 5s
      const start = Math.floor(prng() * 2) * 5 + 5;
      sequence = [start, start + 5, start + 10, start + 15];
      missingIndex = Math.floor(prng() * 4);
      correctAnswer = sequence[missingIndex];
    } else {
      // Counting by 3s
      const start = Math.floor(prng() * 2) * 3 + 3;
      sequence = [start, start + 3, start + 6, start + 9];
      missingIndex = Math.floor(prng() * 4);
      correctAnswer = sequence[missingIndex];
    }
  }

  // Determine number of options based on level (starts at 2, increases to 6)
  const optionCount = Math.min(2 + Math.floor((level - 1) / 4), 6);

  // Generate distractors
  const distractors = [];
  const maxDistractor = correctAnswer + 5;
  while (distractors.length < optionCount - 1) {
    const num = Math.floor(prng() * maxDistractor) + 1;
    if (num !== correctAnswer && !distractors.includes(num) && num > 0) {
      distractors.push(num);
    }
  }

  const options = shuffle([correctAnswer, ...distractors]);

  return { sequence, missingIndex, correctAnswer, options };
};

const MissingNumber = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => buildRound(1));
  const [feedback, setFeedback] = useState('Find the missing number!');
  const [gameWon, setGameWon] = useState(false);
  const [picked, setPicked] = useState(null);

  const nextRound = useCallback((nextLevel) => {
    setRound(buildRound(nextLevel));
  }, []);

  const handlePick = (number) => {
    if (gameWon || (picked && number === round.correctAnswer)) return;

    if (number === round.correctAnswer) {
      playSound('match');
      setPicked(number);
      if (level === TOTAL_LEVELS) {
        setFeedback('Amazing! You found all the missing numbers!');
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
        setFeedback('Find the missing number!');
        setPicked(null);
      }, 800);
    } else {
      playSound('wrong');
      setFeedback('Oops, try again!');
      setPicked(number);
      setTimeout(() => {
        setPicked(null);
        setFeedback('Find the missing number!');
      }, 800);
    }
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Missing Number Champion!</h2>
          <p>You completed all 20 missing number levels.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => {
              setLevel(1);
              setGameWon(false);
              setFeedback('Find the missing number!');
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
            <div>Missing Number</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <p style={{ textAlign: 'center', margin: '-0.5rem 0 1rem', color: '#666' }}>{feedback}</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '2rem 0' }}>
            <div className="pattern-sequence">
              {round.sequence.map((num, i) => (
                <div key={i} style={{ 
                  fontSize: '3rem', 
                  fontWeight: 'bold',
                  minWidth: '60px',
                  textAlign: 'center'
                }}>
                  {i === round.missingIndex ? (
                    <span style={{ 
                      color: '#ccc',
                      borderBottom: '4px dashed #ccc'
                    }}>
                      ?
                    </span>
                  ) : (
                    <span style={{ color: 'var(--color-primary)' }}>
                      {num}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="color-options" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            {round.options.map((number, i) => {
              let isWrong = picked === number && number !== round.correctAnswer;
              let isCorrect = picked === number && number === round.correctAnswer;
              
              return (
                <button
                  key={i}
                  className={`btn ${isWrong ? 'shake' : ''}`}
                  style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'bold',
                    padding: '1rem 2rem',
                    background: isCorrect ? '#1dd1a1' : isWrong ? '#ff6b6b' : 'white',
                    color: isCorrect || isWrong ? 'white' : 'var(--color-accent)',
                    border: '4px solid',
                    borderColor: isCorrect ? '#1dd1a1' : isWrong ? '#ff6b6b' : '#eee',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-soft)',
                    minWidth: '80px'
                  }}
                  onClick={() => handlePick(number)}
                >
                  {number}
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

export default MissingNumber;
