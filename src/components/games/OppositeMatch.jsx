import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const TOTAL_LEVELS = 20;

const OPPOSITE_PAIRS = [
  { a: { emoji: '☀️', label: 'Hot' }, b: { emoji: '❄️', label: 'Cold' } },
  { a: { emoji: '🌞', label: 'Day' }, b: { emoji: '🌙', label: 'Night' } },
  { a: { emoji: '😊', label: 'Happy' }, b: { emoji: '😢', label: 'Sad' } },
  { a: { emoji: '⬆️', label: 'Up' }, b: { emoji: '⬇️', label: 'Down' } },
  { a: { emoji: '😃', label: 'Big' }, b: { emoji: '😅', label: 'Small' } },
  { a: { emoji: '🚀', label: 'Fast' }, b: { emoji: '🐢', label: 'Slow' } },
  { a: { emoji: '🌧️', label: 'Wet' }, b: { emoji: '☀️', label: 'Dry' } },
  { a: { emoji: '🧸', label: 'Soft' }, b: { emoji: '🪨', label: 'Hard' } },
  { a: { emoji: '🕊️', label: 'Light' }, b: { emoji: '🪨', label: 'Heavy' } },
  { a: { emoji: '🌈', label: 'Bright' }, b: { emoji: '🌑', label: 'Dark' } },
  { a: { emoji: '👋', label: 'Open' }, b: { emoji: '🔒', label: 'Closed' } },
  { a: { emoji: '🧁', label: 'Sweet' }, b: { emoji: '🥒', label: 'Sour' } },
  { a: { emoji: '🥳', label: 'Full' }, b: { emoji: '😴', label: 'Empty' } },
  { a: { emoji: '🌼', label: 'In' }, b: { emoji: '🌳', label: 'Out' } },
  { a: { emoji: '🪜', label: 'Tall' }, b: { emoji: '🔎', label: 'Short' } },
  { a: { emoji: '⚡', label: 'On' }, b: { emoji: '🔌', label: 'Off' } },
  { a: { emoji: '💖', label: 'Love' }, b: { emoji: '😡', label: 'Hate' } },
  { a: { emoji: '🧒', label: 'Young' }, b: { emoji: '👵', label: 'Old' } },
  { a: { emoji: '🔼', label: 'High' }, b: { emoji: '🔽', label: 'Low' } },
  { a: { emoji: '💡', label: 'Bright' }, b: { emoji: '🌫️', label: 'Dim' } },
  { a: { emoji: '🍞', label: 'Fresh' }, b: { emoji: '🧀', label: 'Stale' } },
  { a: { emoji: '🏁', label: 'Start' }, b: { emoji: '🛑', label: 'Stop' } },
  { a: { emoji: '👍', label: 'Yes' }, b: { emoji: '👎', label: 'No' } },
  { a: { emoji: '🪄', label: 'Win' }, b: { emoji: '😔', label: 'Lose' } },
];

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
  const prng = createPRNG(level * 83);
  const optionCount = Math.min(2 + Math.floor((level - 1) / 4), 6);
  const pairIndex = Math.floor(prng() * OPPOSITE_PAIRS.length);
  const pair = OPPOSITE_PAIRS[pairIndex];
  const showA = prng() > 0.5;
  const prompt = showA ? pair.a : pair.b;
  const target = showA ? pair.b : pair.a;

  const distractorPool = OPPOSITE_PAIRS
    .filter((candidate) => candidate.a.label !== target.label && candidate.b.label !== target.label)
    .flatMap((candidate) => [candidate.a, candidate.b]);

  const distractors = shuffle(distractorPool, prng)
    .filter((item) => item.label !== target.label)
    .slice(0, optionCount - 1)
    .map((item) => ({ ...item }));

  const options = shuffle([target, ...distractors], prng);
  return { prompt, target, options };
};

const OppositeMatch = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => buildRound(1));
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState('Pick the opposite!');
  const [feedbackType, setFeedbackType] = useState('');
  const [gameWon, setGameWon] = useState(false);

  const resetGame = useCallback(() => {
    setLevel(1);
    setRound(buildRound(1));
    setPicked(null);
    setFeedback('Pick the opposite!');
    setFeedbackType('');
    setGameWon(false);
  }, []);

  const handlePick = (option) => {
    if (gameWon || picked) return;

    setPicked(option);

    if (option.label === round.target.label) {
      playSound('match');
      setFeedback('Yes! That is the opposite!');
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
        setFeedback('Pick the opposite!');
        setFeedbackType('');
      }, 800);
    } else {
      playSound('wrong');
      setFeedback('Not quite! Try another one!');
      setFeedbackType('wrong');
      setTimeout(() => {
        setPicked(null);
        setFeedback('Pick the opposite!');
        setFeedbackType('');
      }, 700);
    }
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Opposite Expert!</h2>
          <p>You matched all the opposites with confidence.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn btn-back" onClick={() => typeof onBack === 'function' && onBack()}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Opposite Match</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <div className="opposite-prompt">
            <div className="opposite-prompt-emoji">{round.prompt.emoji}</div>
            <div className="opposite-prompt-label">{round.prompt.label}</div>
          </div>

          <div className="opposite-grid">
            {round.options.map((option, index) => {
              const isCorrect = picked && option.label === round.target.label;
              const isWrong = picked && option.label !== round.target.label && picked.label === option.label;
              return (
                <button
                  key={`${option.label}-${index}`}
                  className={`opposite-btn${isCorrect ? ' opposite-correct' : ''}${isWrong ? ' opposite-wrong' : ''}`}
                  onClick={() => handlePick(option)}
                  disabled={!!picked}
                >
                  <span className="opposite-emoji">{option.emoji}</span>
                  <span className="opposite-label">{option.label}</span>
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

export default OppositeMatch;
