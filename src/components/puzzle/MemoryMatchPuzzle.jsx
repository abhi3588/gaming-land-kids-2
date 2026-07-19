import { useState } from 'react';
import { playSound } from '../../utils/sounds';
import { TOTAL_LEVELS, getMemoryMatchLevel, getThemeForLevel } from './puzzle-utils';

const MemoryMatchPuzzle = ({ puzzle, onBack }) => {
  const [level, setLevel] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const [deck, setDeck] = useState(() => getMemoryMatchLevel(1).deck);
  const [pairs, setPairs] = useState(() => getMemoryMatchLevel(1).pairs);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(() => new Set());
  const [lock, setLock] = useState(false);
  const [feedback, setFeedback] = useState('Flip two cards to find a match!');

  const loadLevel = (nextLevel) => {
    const data = getMemoryMatchLevel(nextLevel);
    setLevel(nextLevel);
    setDeck(data.deck);
    setPairs(data.pairs);
    setFlipped([]);
    setMatched(new Set());
    setLock(false);
    setFeedback('Flip two cards to find a match!');
  };

  const handleCardClick = (index) => {
    if (gameWon || lock) return;
    if (matched.has(index) || flipped.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    if (newFlipped.length < 2) return;

    setLock(true);
    const [a, b] = newFlipped;

    if (deck[a] === deck[b]) {
      playSound('match');
      const nextMatched = new Set(matched);
      nextMatched.add(a);
      nextMatched.add(b);
      setMatched(nextMatched);
      setFlipped([]);
      setLock(false);
      setFeedback('Great match! 🎉');

      if (nextMatched.size === deck.length) {
        if (level >= TOTAL_LEVELS) {
          playSound('celebrate');
          setGameWon(true);
        } else {
          setTimeout(() => {
            playSound('celebrate');
            loadLevel(level + 1);
          }, 700);
        }
      }
    } else {
      playSound('wrong');
      setFeedback('Not quite — keep looking!');
      setTimeout(() => {
        setFlipped([]);
        setLock(false);
      }, 900);
    }
  };

  const cols = pairs <= 5 ? pairs : 4;

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>{puzzle.title}</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div>{matched.size / 2} pairs</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>{puzzle.completionEmoji}</div>
          <h2>Memory Master!</h2>
          <p>{puzzle.completionMessage}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={() => { setGameWon(false); loadLevel(1); }}>
              Play Again
            </button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="puzzle-feedback" style={{ background: getThemeForLevel(level).gradient, color: 'white' }}>
            {feedback}
          </div>

          <div className="mm-board" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {deck.map((emoji, i) => {
              const shown = matched.has(i) || flipped.includes(i);
              const cls = `mm-card${shown ? ' shown' : ' mm-down'}${matched.has(i) ? ' matched' : ''}`;
              return (
                <button
                  key={i}
                  type="button"
                  className={cls}
                  onClick={() => handleCardClick(i)}
                  aria-label={shown ? `Card ${emoji}` : 'Hidden card'}
                >
                  {shown ? emoji : '?'}
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MemoryMatchPuzzle;
