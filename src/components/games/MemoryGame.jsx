import { useState } from 'react';
import { playSound } from '../../utils/sounds';

const EMOJIS = ['🐳', '🐙', '🐢', '🐠', '🦀', '🐬', '🐚', '🐋'];
const TOTAL_LEVELS = 20;

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
const getPairCount = (level) => Math.min(2 + Math.floor((level - 1) / 3), 8);

const createCards = (level) => {
  const pairCount = getPairCount(level);
  const selected = shuffle(EMOJIS).slice(0, pairCount);
  const duplicates = selected.flatMap((emoji, index) => [
    { id: `${level}-${index}-a`, emoji },
    { id: `${level}-${index}-b`, emoji }
  ]);
  return shuffle(duplicates);
};

const MemoryGame = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState(() => createCards(1));
  const [flipped, setFlipped] = useState([]);
  const [matches, setMatches] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState('Match the sea friends!');
  const [gameWon, setGameWon] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);

  const loadLevel = (nextLevel) => {
    if (nextLevel > TOTAL_LEVELS) {
      setGameWon(true);
      return;
    }

    setLevel(nextLevel);
    setCards(createCards(nextLevel));
    setFlipped([]);
    setMatches([]);
    setDisabled(false);
    setMatchedPairs(0);
    setMessage(`Level ${nextLevel}: Find ${getPairCount(nextLevel)} pairs!`);
  };

  const resetGame = () => {
    setGameWon(false);
    loadLevel(1);
  };

  const handleCardClick = (index) => {
    if (disabled || flipped.includes(index) || matches.includes(index) || gameWon) return;

    playSound('pop');
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const [first, second] = newFlipped;

      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          playSound('match');
          setMatches(prev => [...prev, first, second]);
          setFlipped([]);
          setDisabled(false);
          setMatchedPairs((prev) => {
            const next = prev + 1;
            if (next === getPairCount(level)) {
              if (level === TOTAL_LEVELS) {
                setGameWon(true);
                setMessage('Amazing! You finished the final level!');
              } else {
                setMessage('Great job! Level up coming...');
                setTimeout(() => {
                  loadLevel(level + 1);
                }, 900);
              }
            }
            return next;
          });
        }, 500);
      } else {
        setTimeout(() => {
          playSound('wrong');
          setFlipped([]);
          setDisabled(false);
          setMessage('Try again!');
        }, 900);
      }
    }
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Memory Master!</h2>
          <p>You completed all 20 memory levels with flying colors.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Ocean Match</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div>Pairs: {matchedPairs}/{getPairCount(level)}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--color-accent)', fontWeight: 700 }}>
            {message}
          </div>

          <div className="memory-board">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`card ${flipped.includes(index) || matches.includes(index) ? 'flipped' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="card-inner">
                  <div className="card-back">❓</div>
                  <div className="card-front">{card.emoji}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn" style={{ background: '#eee' }} onClick={resetGame}>Reset Game</button>
            <button className="btn btn-primary" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MemoryGame;
