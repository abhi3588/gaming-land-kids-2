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

const shuffle = (array, prng) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(prng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildRound = (level) => {
  const prng = createPRNG(level * 57);
  const optionCount = Math.min(2 + Math.floor((level - 1) / 4), 6);

  let pool = ['🐶', '🐱', '🐰', '🐼', '🦊', '🍎', '🍊', '🚗', '🧸', '🎈'];
  if (level <= 8) {
    pool = ['🐶', '🐱', '🐰', '🐼', '🦊', '🐸', '🐢', '🐵', '🐳', '🐙'];
  } else if (level <= 12) {
    pool = ['🍎', '🍊', '🍌', '🍓', '🍇', '🍉', '🥕', '🍋'];
  } else if (level <= 16) {
    pool = ['🐸', '🐢', '🦎', '🐛', '🦋', '🐞', '🐊', '🦖'];
  } else {
    pool = ['🦋', '🐛', '🐞', '🪲', '🦗', '🦟', '🦀', '🐌'];
  }

  const targetIndex = Math.floor(prng() * pool.length);
  const target = pool[targetIndex];
  const distractorPool = pool.filter((emoji) => emoji !== target);
  const distractors = shuffle(distractorPool, prng).slice(0, optionCount - 1);
  const options = shuffle([target, ...distractors], prng);

  return { target, options };
};

const ShadowMatch = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => buildRound(1));
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState('Find the matching shadow!');
  const [feedbackType, setFeedbackType] = useState('');
  const [gameWon, setGameWon] = useState(false);

  const resetGame = useCallback(() => {
    setLevel(1);
    setRound(buildRound(1));
    setPicked(null);
    setFeedback('Find the matching shadow!');
    setFeedbackType('');
    setGameWon(false);
  }, []);

  const handlePick = (emoji) => {
    if (gameWon || picked) return;

    setPicked(emoji);

    if (emoji === round.target) {
      playSound('match');
      setFeedback('Perfect! You found the shadow!');
      setFeedbackType('correct');

      if (level === TOTAL_LEVELS) {
        setTimeout(() => setGameWon(true), 800);
        return;
      }

      setTimeout(() => {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        setRound(buildRound(nextLevel));
        setPicked(null);
        setFeedback('Find the matching shadow!');
        setFeedbackType('');
      }, 800);
    } else {
      playSound('wrong');
      setFeedback('Not quite! Look at the shape! 🤔');
      setFeedbackType('wrong');
      setTimeout(() => {
        setPicked(null);
        setFeedback('Find the matching shadow!');
        setFeedbackType('');
      }, 700);
    }
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Shadow Master!</h2>
          <p>You found every shadow with bright eyes and a careful look.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn btn-back" onClick={() => typeof onBack === 'function' && onBack()}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Shadow Match</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <div className="shadow-target">
            <div className="shadow-target-emoji">{round.target}</div>
            <div className="shadow-target-label">Find the matching shadow</div>
          </div>

          <div className="shadow-grid">
            {round.options.map((emoji) => {
              const isCorrect = picked === round.target && emoji === round.target;
              const isWrong = picked && picked !== round.target && emoji === picked;
              return (
                <button
                  key={`${emoji}-${level}`}
                  className={`shadow-btn${isCorrect ? ' shadow-correct' : ''}${isWrong ? ' shadow-wrong' : ''}`}
                  onClick={() => handlePick(emoji)}
                  disabled={!!picked}
                >
                  <span className="shadow-filter">{emoji}</span>
                </button>
              );
            })}
          </div>

          {feedback && <div className={`sound-feedback ${feedbackType}`}>{feedback}</div>}

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button className="btn btn-back" onClick={() => typeof onBack === 'function' && onBack()}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShadowMatch;
