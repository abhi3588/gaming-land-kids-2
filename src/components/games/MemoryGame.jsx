import { useState } from 'react';
import { playSound } from '../../utils/sounds';

const emojis = ['🐳', '🐙', '🐢', '🐠', '🦀', '🐬', '🐚', '🐋'];

const generateInitialCards = () => {
  const doubled = [...emojis, ...emojis];
  return doubled
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({ id: index, emoji }));
};

const MemoryGame = ({ onBack }) => {
  const [cards, setCards] = useState(generateInitialCards);
  const [flipped, setFlipped] = useState([]);
  const [matches, setMatches] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const resetGame = () => {
    setCards(generateInitialCards());
    setFlipped([]);
    setMatches([]);
    setDisabled(false);
  };

  const handleCardClick = (id) => {
    if (disabled || flipped.includes(id) || matches.includes(id)) return;

    playSound('pop');
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const [first, second] = newFlipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          setMatches(prev => {
            const nextMatches = [...prev, first, second];
            if (nextMatches.length === cards.length) {
              playSound('celebrate');
            } else {
              playSound('match');
            }
            return nextMatches;
          });
          setFlipped([]);
          setDisabled(false);
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="game-view pop-in">
      <h2>Ocean Match</h2>
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
        <button className="btn btn-primary" onClick={onBack}>Main Menu</button>
      </div>
    </div>
  );
};

export default MemoryGame;
