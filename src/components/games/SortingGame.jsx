import { useState } from 'react';
import { playSound } from '../../utils/sounds';

const items = [
  { emoji: '🍎', color: 'red' },
  { emoji: '🍌', color: 'yellow' },
  { emoji: '🥦', color: 'green' },
  { emoji: '🫐', color: 'blue' },
  { emoji: '🍓', color: 'red' },
  { emoji: '🍋', color: 'yellow' },
  { emoji: '🥬', color: 'green' },
  { emoji: '🍇', color: 'blue' }
];

// Helper defined outside component for purity
const getShuffledItems = () => [...items].sort(() => Math.random() - 0.5);

const SortingGame = ({ onBack }) => {
  const [draggables, setDraggables] = useState(getShuffledItems);
  const [bins, setBins] = useState({ red: [], yellow: [], green: [], blue: [] });

  const handleDragStart = (e, item, index) => {
    e.dataTransfer.setData('itemIndex', index);
    playSound('pop');
  };

  const handleDrop = (e, binColor) => {
    e.preventDefault();
    const itemIndex = e.dataTransfer.getData('itemIndex');
    const item = draggables[itemIndex];

    if (item.color === binColor) {
      playSound('match');
      const newDraggables = draggables.filter((_, i) => i !== parseInt(itemIndex));
      setDraggables(newDraggables);
      setBins({ ...bins, [binColor]: [...bins[binColor], item] });

      if (newDraggables.length === 0) {
        playSound('celebrate');
      }
    } else {
      e.target.classList.add('shake');
      setTimeout(() => e.target.classList.remove('shake'), 400);
    }
  };

  return (
    <div className="game-view pop-in">
      <h2>Fruit Sort</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', minHeight: '100px', margin: '2rem' }}>
        {draggables.map((item, index) => (
          <div
            key={index}
            className="draggable"
            draggable
            onDragStart={(e) => handleDragStart(e, item, index)}
          >
            {item.emoji}
          </div>
        ))}
      </div>
      
      <div className="drop-zones">
        {Object.keys(bins).map(color => (
          <div
            key={color}
            className={`drop-zone color-${color}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, color)}
            style={{ 
              backgroundColor: bins[color].length > 0 ? `var(--color-soft-${color})` : 'white',
              borderColor: `var(--color-${color === 'red' ? 'secondary' : color === 'yellow' ? 'warning' : color === 'green' ? 'success' : 'primary'})`
            }}
          >
            <span>{color.toUpperCase()}</span>
            <div style={{ fontSize: '1.5rem' }}>
              {bins[color].map((item, i) => <span key={i}>{item.emoji}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button className="btn btn-primary" onClick={onBack}>Main Menu</button>
      </div>
    </div>
  );
};

export default SortingGame;
