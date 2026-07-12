import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const TOTAL_LEVELS = 20;
const GAME_SEED = 7919;

// Deterministic PRNG so each level always yields the same puzzle.
const createPRNG = (seed) => {
  let s = seed;
  return () => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
};

const SMALL_COINS = [1, 2, 5, 10, 20];
const ALL_COINS = [1, 2, 5, 10, 20, 50, 100, 200];

const formatMoney = (v) => (v >= 100 ? `£${(v / 100).toFixed(2)}` : `${v}p`);

const optionCountFor = (level) => Math.min(3 + Math.floor((level - 1) / 4), 6);

const generateQuestion = (levelNum) => {
  const prng = createPRNG(levelNum * GAME_SEED + 13);
  const randInt = (min, max) => Math.floor(prng() * (max - min + 1)) + min;

  // More coin types and more coins as levels increase.
  const set = levelNum < 8 ? SMALL_COINS : ALL_COINS;
  const coinCount = Math.min(2 + Math.floor((levelNum - 1) / 3), 7);
  const coins = Array.from({ length: coinCount }, () => set[randInt(0, set.length - 1)]);
  const total = coins.reduce((a, b) => a + b, 0);

  // Distractors: nearby totals, count grows with level.
  const want = optionCountFor(levelNum);
  const opts = new Set([total]);
  let guard = 0;
  while (opts.size < want && guard < 300) {
    guard += 1;
    const delta = randInt(1, Math.max(3, Math.ceil(total * 0.15)));
    const w = total + (prng() < 0.5 ? -delta : delta);
    if (w >= 0 && w !== total) opts.add(w);
  }
  let n = 1;
  while (opts.size < want) {
    const w = total + n;
    if (w !== total) opts.add(w);
    n += 1;
  }

  const options = [...opts].sort(() => prng() - 0.5).map(formatMoney);
  return { coins, total, answer: formatMoney(total), options };
};

const CoinCounter = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [question, setQuestion] = useState(() => generateQuestion(1));
  const [picked, setPicked] = useState(null);
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [gameWon, setGameWon] = useState(false);

  const loadLevel = useCallback((n) => {
    setLevel(n);
    setQuestion(generateQuestion(n));
    setPicked(null);
    setWrongId(null);
    setFeedback('');
  }, []);

  const resetGame = useCallback(() => {
    setGameWon(false);
    loadLevel(1);
  }, [loadLevel]);

  const handlePick = (opt) => {
    if (picked !== null || gameWon) return;
    setPicked(opt);

    if (opt === question.answer) {
      playSound('match');
      setFeedback('🎉 Correct!');
      setTimeout(() => {
        if (level >= TOTAL_LEVELS) setGameWon(true);
        else loadLevel(level + 1);
      }, 650);
    } else {
      // Notify and stay on the same question so they can try again.
      playSound('wrong');
      setWrongId(opt);
      setFeedback('❌ Not quite — try again!');
      setTimeout(() => {
        setPicked(null);
        setWrongId(null);
      }, 900);
    }
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🪙</div>
          <h2>Coin Champion!</h2>
          <p>You counted every coin across all {TOTAL_LEVELS} levels! 🏆</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => typeof onBack === 'function' && onBack()}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Coin Counter</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div>{feedback || 'How much in total?'}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <div className="coin-row">
            {question.coins.map((c, i) => (
              <span key={i} className="coin-pill">{formatMoney(c)}</span>
            ))}
          </div>

          <div className="choice-options">
            {question.options.map((opt) => {
              let cls = 'choice-btn';
              if (picked === opt) cls += opt === question.answer ? ' choice-correct' : ' choice-wrong';
              return (
                <button
                  key={opt}
                  className={cls}
                  onClick={() => handlePick(opt)}
                  disabled={picked !== null}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button className="btn" style={{ background: '#eee', color: '#333' }} onClick={() => typeof onBack === 'function' && onBack()}>
              Main Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CoinCounter;
