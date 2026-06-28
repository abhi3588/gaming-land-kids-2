import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const ROUNDS = [
  { word: 'CAT',   correct: 'HAT',   wrong: ['DOG', 'RUN', 'FISH']   },
  { word: 'MOON',  correct: 'SPOON', wrong: ['STAR', 'TREE', 'KITE']  },
  { word: 'RING',  correct: 'SING',  wrong: ['WALK', 'JUMP', 'PLAY']  },
  { word: 'CAKE',  correct: 'LAKE',  wrong: ['BREAD', 'RICE', 'SOUP'] },
  { word: 'FROG',  correct: 'LOG',   wrong: ['DUCK', 'BIRD', 'FISH']  },
  { word: 'NIGHT', correct: 'LIGHT', wrong: ['DARK', 'RAIN', 'WIND']  },
  { word: 'BEAR',  correct: 'CHAIR', wrong: ['TABLE', 'LAMP', 'BOOK'] },
  { word: 'SNOW',  correct: 'GLOW',  wrong: ['RAIN', 'HAIL', 'SLEET'] },
  { word: 'FISH',  correct: 'DISH',  wrong: ['FORK', 'BOWL', 'CUP']   },
  { word: 'STAR',  correct: 'CAR',   wrong: ['MOON', 'SKY', 'CLOUD']  },
  { word: 'KING',  correct: 'RING',  wrong: ['QUEEN', 'JACK', 'CROWN']},
  { word: 'BOAT',  correct: 'COAT',  wrong: ['SHIP', 'SAIL', 'MAST']  },
  { word: 'TREE',  correct: 'BEE',   wrong: ['LEAF', 'ROOT', 'TWIG']  },
  { word: 'HAND',  correct: 'SAND',  wrong: ['FOOT', 'ARM', 'LEG']    },
  { word: 'MICE',  correct: 'RICE',  wrong: ['RATS', 'DOGS', 'CATS']  },
  { word: 'BLUE',  correct: 'GLUE',  wrong: ['RED', 'GREEN', 'PINK']  },
  { word: 'PLAY',  correct: 'DAY',   wrong: ['NIGHT', 'WORK', 'REST'] },
  { word: 'CLOCK', correct: 'ROCK',  wrong: ['TIME', 'BELL', 'TICK']  },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const buildOptions = (round) =>
  shuffle([round.correct, ...round.wrong.slice(0, 3)]);

const TOTAL_LEVELS = 20;

const RhymeTime = ({ onBack }) => {
  const [order]      = useState(() => Array.from({ length: TOTAL_LEVELS }, () => ROUNDS[Math.floor(Math.random() * ROUNDS.length)]));
  const [index, setIndex]           = useState(0);
  const [options, setOptions]       = useState(() => buildOptions(Array.from({ length: TOTAL_LEVELS }, () => ROUNDS[Math.floor(Math.random() * ROUNDS.length)])[0]));
  const [picked, setPicked]         = useState(null);
  const [feedback, setFeedback]     = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [score, setScore]           = useState(0);
  const [gameWon, setGameWon]       = useState(false);

  const current = order[index];

  const resetGame = useCallback(() => {
    setIndex(0);
    setOptions(buildOptions(order[0]));
    setPicked(null);
    setFeedback('');
    setFeedbackType('');
    setScore(0);
    setGameWon(false);
  }, [order]);

  const handlePick = (opt) => {
    if (picked) return;
    setPicked(opt);
    if (opt === current.correct) {
      playSound('match');
      setFeedback('🎵 Great rhyme!');
      setFeedbackType('correct');
      setScore((s) => s + 1);
    } else {
      playSound('wrong');
      setFeedback(`Not quite! "${current.correct}" rhymes with "${current.word}" 💡`);
      setFeedbackType('wrong');
    }
    setTimeout(() => {
      if (index + 1 >= TOTAL_LEVELS) {
        setGameWon(true);
      } else {
        const next = index + 1;
        setIndex(next);
        setOptions(buildOptions(order[next]));
        setPicked(null);
        setFeedback('');
        setFeedbackType('');
      }
    }, 1100);
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🎵</div>
          <h2>Rhyme Master!</h2>
          <p>You got <strong>{score}</strong> out of <strong>{TOTAL_LEVELS}</strong> rhymes correct!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => typeof onBack === 'function' && onBack()}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Rhyme Time</div>
            <div>Round {index + 1} / {TOTAL_LEVELS}</div>
            <div>Score: {score}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(index / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <p style={{ textAlign: 'center', color: '#666', fontWeight: 600, marginBottom: '0.75rem' }}>
            Which word rhymes with… 🎵
          </p>

          <div className="rhyme-target">
            <span className="rhyme-target-word">{current.word}</span>
          </div>

          <div className="rhyme-options">
            {options.map((opt) => {
              let cls = 'rhyme-btn';
              if (picked === opt) cls += opt === current.correct ? ' rhyme-correct' : ' rhyme-wrong';
              else if (picked && opt === current.correct) cls += ' rhyme-correct';
              return (
                <button key={opt} className={cls} onClick={() => handlePick(opt)} disabled={!!picked}>
                  {opt}
                </button>
              );
            })}
          </div>

          {feedback && <div className={`sound-feedback ${feedbackType}`}>{feedback}</div>}

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <button className="btn" style={{ background: '#eee', color: '#333' }}
              onClick={() => typeof onBack === 'function' && onBack()}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default RhymeTime;
