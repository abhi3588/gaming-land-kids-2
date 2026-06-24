import { useState } from 'react';
import { playSound } from '../../utils/sounds';

const ITEMS = [
  { emoji: '🍎', color: 'red' },
  { emoji: '🍓', color: 'red' },
  { emoji: '🍒', color: 'red' },
  { emoji: '🍌', color: 'yellow' },
  { emoji: '🍋', color: 'yellow' },
  { emoji: '🥭', color: 'yellow' },
  { emoji: '🥦', color: 'green' },
  { emoji: '🥬', color: 'green' },
  { emoji: '🥝', color: 'green' },
  { emoji: '🫐', color: 'blue' },
  { emoji: '🍇', color: 'blue' },
  { emoji: '🫐', color: 'blue' }
];

const BIN_COLORS = ['red', 'yellow', 'green', 'blue'];
const TOTAL_LEVELS = 20;

const getShuffled = (array) => [...array].sort(() => Math.random() - 0.5);

const generateLevelItems = (level) => {
  const itemCount = Math.min(4 + Math.floor((level - 1) / 2), 14);
  const pool = [];

  BIN_COLORS.forEach(color => {
    const colorItems = ITEMS.filter(item => item.color === color);
    const choice = colorItems[Math.floor(Math.random() * colorItems.length)];
    pool.push(choice);
  });

  while (pool.length < itemCount) {
    const extra = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    pool.push(extra);
  }

  return getShuffled(pool).map((item, index) => ({
    ...item,
    id: `${level}-${index}`
  }));
};

const SortingGame = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [draggables, setDraggables] = useState(() => generateLevelItems(1));
  const [bins, setBins] = useState({ red: [], yellow: [], green: [], blue: [] });
  const [feedback, setFeedback] = useState('Drag each fruit into the correct color bin.');
  const [gameWon, setGameWon] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const loadLevel = (nextLevel) => {
    setLevel(nextLevel);
    setDraggables(generateLevelItems(nextLevel));
    setBins({ red: [], yellow: [], green: [], blue: [] });
    setFeedback('Drag each fruit into the correct color bin.');
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('itemIndex', index);
    playSound('pop');
  };

  const handleDrop = (e, binColor) => {
    e.preventDefault();
    const itemIndex = parseInt(e.dataTransfer.getData('itemIndex'), 10);
    if (isNaN(itemIndex) || itemIndex < 0 || itemIndex >= draggables.length) return;

    const item = draggables[itemIndex];
    if (!item) return;

    if (item.color === binColor) {
      playSound('match');
      const newDraggables = draggables.filter((_, i) => i !== itemIndex);
      setDraggables(newDraggables);
      setBins(prev => ({ ...prev, [binColor]: [...prev[binColor], item] }));
      setFeedback('Nice! Keep going.');

      if (newDraggables.length === 0) {
        if (level === TOTAL_LEVELS) {
          playSound('celebrate');
          setGameWon(true);
          return;
        }
        const nextLevel = level + 1;
        setTimeout(() => {
          playSound('celebrate');
          loadLevel(nextLevel);
          setFeedback(`Great job! Level ${nextLevel} starts now.`);
        }, 700);
      }
    } else {
      playSound('wrong');
      setFeedback(`Oops! This belongs in the ${binColor.toUpperCase()} bin.`);
      const dropZone = e.currentTarget;
      dropZone.classList.add('shake');
      setTimeout(() => {
        dropZone.classList.remove('shake');
      }, 400);
    }
  };

  // Touch / tap flow: drop by selecting item then tapping a bin
  const handleDropFromIndex = (itemIndex, binColor) => {
    if (isNaN(itemIndex) || itemIndex < 0 || itemIndex >= draggables.length) return;
    const item = draggables[itemIndex];
    if (!item) return;

    if (item.color === binColor) {
      playSound('match');
      const newDraggables = draggables.filter((_, i) => i !== itemIndex);
      setDraggables(newDraggables);
      setBins(prev => ({ ...prev, [binColor]: [...prev[binColor], item] }));
      setFeedback('Nice! Keep going.');
      setSelectedIndex(null);

      if (newDraggables.length === 0) {
        if (level === TOTAL_LEVELS) {
          playSound('celebrate');
          setGameWon(true);
          return;
        }
        const nextLevel = level + 1;
        setTimeout(() => {
          playSound('celebrate');
          loadLevel(nextLevel);
          setFeedback(`Great job! Level ${nextLevel} starts now.`);
        }, 700);
      }
    } else {
      playSound('wrong');
      setFeedback(`Oops! This belongs in the ${binColor.toUpperCase()} bin.`);
    }
  };

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Fruit Sort</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div>{draggables.length} fruit left</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Fruit Sorting Champion!</h2>
          <p>You mastered all 20 fruit sorting levels.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => {
              setGameWon(false);
              loadLevel(1);
            }}>
              Play Again
            </button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Main Menu
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 700, color: 'var(--color-accent)' }}>
            {feedback}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', minHeight: '100px', margin: '2rem' }}>
            {draggables.map((item, index) => (
              <div
                key={item.id}
                className={`draggable ${selectedIndex === index ? 'selected' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onClick={() => {
                  // allow tap-to-select on mobile
                  if (selectedIndex === index) setSelectedIndex(null);
                  else { playSound('pop'); setSelectedIndex(index); }
                }}
              >
                {item.emoji}
              </div>
            ))}
          </div>

          <div className="drop-zones">
            {BIN_COLORS.map(color => (
              <div
                key={color}
                className={`drop-zone color-${color}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, color)}
                onClick={() => { if (selectedIndex !== null) handleDropFromIndex(selectedIndex, color); }}
                style={{
                  backgroundColor: bins[color].length > 0 ? `var(--color-soft-${color})` : 'white',
                  borderColor: `var(--color-${color === 'red' ? 'secondary' : color === 'yellow' ? 'warning' : color === 'green' ? 'success' : 'primary'})`
                }}
              >
                <span>{color.toUpperCase()}</span>
                <div style={{ fontSize: '1.5rem' }}>
                  {bins[color].map((item, index) => <span key={index}>{item.emoji}</span>)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn btn-primary" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Main Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SortingGame;
