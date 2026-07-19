import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const ITEMS = [
  { emoji: '🐤', name: 'Rubber Duck', floats: true, fact: 'Rubber is light and traps air, so ducks bob on top! 🦆' },
  { emoji: '🔑', name: 'Metal Key', floats: false, fact: 'Metal is heavy and dense, so keys drop to the bottom! 🪨' },
  { emoji: '🪶', name: 'Feather', floats: true, fact: 'Feathers are super light and can rest right on the water! 💨' },
  { emoji: '🪨', name: 'Heavy Stone', floats: false, fact: 'Stones are heavy, so they sink straight down! 🌊' },
  { emoji: '⛵', name: 'Toy Boat', floats: true, fact: 'Boats are shaped to push water aside, so they float! ⛵' }
];

const FloatOrSink = ({ onBack }) => {
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState(null); // 'float' | 'sink' chosen by the child
  const [drop, setDrop] = useState('none'); // 'none' | 'float' | 'sink' (visual position)
  const [splash, setSplash] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const item = ITEMS[index];
  const answered = guess !== null;

  const handleGuess = (choice) => {
    if (answered) return;
    playSound('pop');
    setGuess(choice);
    // Animate the item to its real position (float or sink) regardless of guess.
    setDrop(item.floats ? 'float' : 'sink');
    setSplash(true);
    setTimeout(() => setSplash(false), 700);

    const correct = choice === (item.floats ? 'float' : 'sink');
    if (correct) {
      setTimeout(() => playSound('match'), 250);
      setScore((s) => s + 1);
    } else {
      setTimeout(() => playSound('wrong'), 250);
    }
  };

  const handleNext = () => {
    playSound('pop');
    if (index < ITEMS.length - 1) {
      setIndex((i) => i + 1);
      setGuess(null);
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
    setGuess(null);
    setDrop('none');
    setSplash(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="game-view pop-in">
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🌊</div>
          <h2>Splash Scientist!</h2>
          <p>You guessed {score} out of {ITEMS.length} correctly!</p>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Light things with air inside float, while heavy, dense things sink.
            Now you can predict what happens in any tub! 💧
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

  const isCorrect = answered && guess === (item.floats ? 'float' : 'sink');

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Float or Sink 🌊</div>
        <div>Toy {index + 1} / {ITEMS.length}</div>
        <div>Score: {score}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((index) / ITEMS.length) * 100}%` }} />
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

      {/* Result line */}
      {answered && (
        <div className={`fos-result ${isCorrect ? 'fos-right' : 'fos-wrong'}`}>
          {isCorrect
            ? `Great guess! The ${item.name} ${item.floats ? 'floats' : 'sinks'}! 🎉`
            : `Oops! The ${item.name} actually ${item.floats ? 'floats' : 'sinks'}. 💡`}
          <div className="fos-fact">{item.fact}</div>
        </div>
      )}

      {/* Guess buttons */}
      {!answered ? (
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
