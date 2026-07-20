import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

// 10 graduated toys. Mix of floats and sinks with a child-friendly "why" fact.
// Difficulty steps up with surprising cases (apple & watermelon float, potato sinks).
const ITEMS = [
  { emoji: '🦆', name: 'Rubber Duck', floats: true, fact: 'Rubber is light and traps air, so ducks bob on top! 🦆' },
  { emoji: '🔑', name: 'Metal Key', floats: false, fact: 'Metal is heavy and dense, so keys drop to the bottom! 🪨' },
  { emoji: '🪶', name: 'Feather', floats: true, fact: 'Feathers are super light and can rest right on the water! 💨' },
  { emoji: '🪨', name: 'Heavy Stone', floats: false, fact: 'Stones are heavy, so they sink straight down! 🌊' },
  { emoji: '⛵', name: 'Toy Boat', floats: true, fact: 'Boats are shaped to push water aside, so they float! ⛵' },
  { emoji: '🍎', name: 'Apple', floats: true, fact: 'Apples are full of tiny air pockets, so they float like a little boat! 🍎' },
  { emoji: '🥔', name: 'Potato', floats: false, fact: 'Potatoes are dense and heavy, so they plop to the bottom! 🥔' },
  { emoji: '🧴', name: 'Plastic Bottle', floats: true, fact: 'An empty plastic bottle traps air, so it floats high! 🧴' },
  { emoji: '🔩', name: 'Iron Nail', floats: false, fact: 'Iron is heavy and sinks the moment you let go! 🔩' },
  { emoji: '🍉', name: 'Watermelon', floats: true, fact: 'A whole watermelon has a rind full of air — it floats! 🍉' }
];

const FloatOrSink = ({ onBack }) => {
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState(false); // current toy guessed correctly
  const [wrongFlash, setWrongFlash] = useState(false); // a wrong guess is pending
  const [drop, setDrop] = useState('none'); // 'none' | 'float' | 'sink' (visual position)
  const [splash, setSplash] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [completed, setCompleted] = useState(false);

  const item = ITEMS[index];

  const handleGuess = (choice) => {
    if (solved) return;
    playSound('pop');
    const correct = choice === (item.floats ? 'float' : 'sink');
    if (correct) {
      // Correct: reveal the drop and let the child move on.
      setSolved(true);
      setWrongFlash(false);
      setDrop(item.floats ? 'float' : 'sink');
      setSplash(true);
      setTimeout(() => setSplash(false), 700);
      setTimeout(() => playSound('match'), 250);
      setScore((s) => s + 1);
    } else {
      // Wrong: stop and notify, but do NOT reveal or advance. Let the child retry.
      playSound('wrong');
      setWrongFlash(true);
    }
  };

  const handleNext = () => {
    playSound('pop');
    if (index < ITEMS.length - 1) {
      setIndex((i) => i + 1);
      setSolved(false);
      setWrongFlash(false);
      setDrop('none');
      setSplash(false);
    } else {
      playSound('celebrate');
      setCompleted(true);
    }
  };

  const handleReset = () => {
    playSound('pop');
    setIndex(0);
    setSolved(false);
    setWrongFlash(false);
    setDrop('none');
    setSplash(false);
    setScore(0);
    setMistakes(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="game-view pop-in">
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🌊</div>
          <h2>Splash Scientist!</h2>
          <p>You floated and sank all {ITEMS.length} toys!</p>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            {mistakes === 0
              ? 'Perfect — not a single try-again! Light things with air inside float, while heavy, dense things sink.'
              : `You needed ${mistakes} try-again${mistakes === 1 ? '' : 's'} — great guessing! Light things with air inside float, while heavy, dense things sink.`}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Play Again
            </button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Science
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Float or Sink 🌊</div>
        <div>Toy {index + 1} / {ITEMS.length}</div>
        <div>Score: {score}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((index + (solved ? 1 : 0)) / ITEMS.length) * 100}%` }} />
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', margin: '0.25rem 0 1rem' }}>
        Will the <b>{item.name}</b> float on top or sink to the bottom?
      </p>

      {/* Water tub */}
      <div className="fos-tub">
        <div className="fos-water">
          <div className={`fos-item fos-${drop}${splash ? ' fos-splash' : ''}`}>
            <span className="fos-item-emoji">{item.emoji}</span>
          </div>
          {splash && <div className="fos-splash-rings" aria-hidden="true" />}
          <div className="fos-waterline" />
        </div>
        <div className="fos-base">🛁 Tub</div>
      </div>

      {/* Wrong-guess retry prompt (shown until the child answers correctly) */}
      {!solved && wrongFlash && (
        <div className="fos-result fos-wrong">
          Not quite! 💡 Try again — will it float or sink?
        </div>
      )}

      {/* Result line (only revealed after a correct guess) */}
      {solved && (
        <div className="fos-result fos-right">
          Great guess! The {item.name} {item.floats ? 'floats' : 'sinks'}! 🎉
          <div className="fos-fact">{item.fact}</div>
        </div>
      )}

      {/* Guess buttons */}
      {!solved ? (
        <div className="fos-choices">
          <button className="fos-btn fos-float-btn" onClick={() => handleGuess('float')}>
            🌊 Float
          </button>
          <button className="fos-btn fos-sink-btn" onClick={() => handleGuess('sink')}>
            🪨 Sink
          </button>
        </div>
      ) : (
        <div className="detail-back-container" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleNext}>
            {index < ITEMS.length - 1 ? 'Next Toy ➡️' : 'See Score 🏆'}
          </button>
        </div>
      )}

      <div className="detail-back-container">
        <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
          Back to Science
        </button>
      </div>
    </div>
  );
};

export default FloatOrSink;
