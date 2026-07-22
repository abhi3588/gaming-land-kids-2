import { useState } from 'react';
import { playSound } from '../../utils/sounds.js';

const TOTAL_LEVELS = 20;

const createPRNG = (seed) => {
  let s = seed;
  return () => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
};

const COLOR_OPTIONS = [
  { id: 'orange', emoji: '🟠', name: 'Orange', colorCode: '#ff9f43' },
  { id: 'green', emoji: '🟢', name: 'Green', colorCode: '#1dd1a1' },
  { id: 'purple', emoji: '🟣', name: 'Purple', colorCode: '#a55eea' },
  { id: 'pink', emoji: '🩷', name: 'Pink', colorCode: '#ff9ff3' },
  { id: 'gray', emoji: '🩶', name: 'Gray', colorCode: '#8395a7' },
  { id: 'cyan', emoji: '🩵', name: 'Cyan / Light Blue', colorCode: '#48dbfb' },
  { id: 'brown', emoji: '🤎', name: 'Brown', colorCode: '#834c32' },
  { id: 'yellow', emoji: '🟡', name: 'Yellow', colorCode: '#feca57' },
  { id: 'blue', emoji: '🔵', name: 'Blue', colorCode: '#54a0ff' },
  { id: 'red', emoji: '🔴', name: 'Red', colorCode: '#ff6b6b' },
];

const RECIPES = [
  { color1: '🔴 Red', color2: '🟡 Yellow', resultId: 'orange', targetName: 'Orange Potion 🧪' },
  { color1: '🔵 Blue', color2: '🟡 Yellow', resultId: 'green', targetName: 'Green Potion 🧪' },
  { color1: '🔴 Red', color2: '🔵 Blue', resultId: 'purple', targetName: 'Purple Potion 🧪' },
  { color1: '🔴 Red', color2: '⚪ White', resultId: 'pink', targetName: 'Pink Potion 🧪' },
  { color1: '🔵 Blue', color2: '⚪ White', resultId: 'cyan', targetName: 'Light Blue Potion 🧪' },
  { color1: '⬛ Black', color2: '⚪ White', resultId: 'gray', targetName: 'Gray Potion 🧪' },
  { color1: '🔴 Red', color2: '🟢 Green', resultId: 'brown', targetName: 'Brown Potion 🧪' },
  { color1: '🔴 Red', color2: '🟡 Yellow + ⚪ White', resultId: 'orange', targetName: 'Peach Potion 🧪' },
  { color1: '🔵 Blue', color2: '🟢 Green', resultId: 'cyan', targetName: 'Teal Potion 🧪' },
  { color1: '🔴 Red', color2: '🟣 Purple', resultId: 'pink', targetName: 'Magenta Potion 🧪' },
];

const getColorMagicLevel = (level) => {
  const prng = createPRNG(level * 233 + 7);
  const recipe = RECIPES[(level - 1) % RECIPES.length];
  const correctObj = COLOR_OPTIONS.find(c => c.id === recipe.resultId);

  // Total choices: L1-5: 2 choices, L6-12: 3 choices, L13-20: 4 choices
  const totalChoices = level <= 5 ? 2 : level <= 12 ? 3 : 4;

  const distractors = COLOR_OPTIONS.filter(c => c.id !== recipe.resultId);
  for (let i = distractors.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
  }

  const options = [correctObj, ...distractors.slice(0, totalChoices - 1)];

  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return { recipe, correctObj, options };
};

export default function ColorMagic({ onBack }) {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState(() => getColorMagicLevel(1));
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState('Mix the colors in the cauldron! What color do we get?');
  const [gameWon, setGameWon] = useState(false);

  const loadLevel = (lvl) => {
    setLevel(lvl);
    setData(getColorMagicLevel(lvl));
    setSelected(null);
    setSolved(false);
    setFeedback('Mix the colors in the cauldron! What color do we get?');
  };

  const handleSelectOption = (opt) => {
    if (solved) return;
    setSelected(opt);

    if (opt.id === data.correctObj.id) {
      playSound('match');
      setSolved(true);
      setFeedback(`Magic Potion Complete! You created ${opt.name}! ${opt.emoji}✨`);

      if (level >= TOTAL_LEVELS) {
        playSound('celebrate');
        setGameWon(true);
      } else {
        setTimeout(() => {
          playSound('celebrate');
          loadLevel(level + 1);
        }, 1200);
      }
    } else {
      playSound('wrong');
      setFeedback('Not that color! Try another magic mix!');
      setTimeout(() => setSelected(null), 1000);
    }
  };

  const handleReset = () => {
    playSound('pop');
    setGameWon(false);
    loadLevel(1);
  };

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Color Magic 🎨</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4.5rem' }}>🎨✨🏆</div>
          <h2>Color Magic Master!</h2>
          <p>You solved every potion color recipe in the magic academy!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={handleReset}>Play Again</button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: solved ? 'var(--candy-green)' : selected ? 'var(--candy-red)' : '#666',
            background: solved ? 'rgba(29,209,161,0.12)' : 'rgba(108, 92, 231, 0.08)',
            padding: '0.75rem 1rem',
            borderRadius: '14px',
            maxWidth: '520px',
            margin: '0 auto 1.5rem'
          }}>
            {feedback}
          </div>

          {/* Potion mixing cauldron graphic card */}
          <div style={{
            maxWidth: '460px',
            margin: '0 auto 2rem',
            background: 'white',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-soft)',
            textAlign: 'center',
            border: '3px solid var(--candy-purple)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🥣✨</div>
            <h3 style={{ margin: '0 0 0.8rem', color: '#444', fontSize: '1.3rem' }}>
              Mix <span style={{ color: 'var(--candy-purple)' }}>{data.recipe.color1}</span> + <span style={{ color: 'var(--candy-pink)' }}>{data.recipe.color2}</span> = ?
            </h3>
            
            {/* Visual mixing bowl representation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              fontSize: '2rem',
              background: '#f8f9fa',
              padding: '0.8rem',
              borderRadius: '16px'
            }}>
              <span>{data.recipe.color1.split(' ')[0]}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>+</span>
              <span>{data.recipe.color2.split(' ')[0]}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>=</span>
              <span style={{
                fontSize: '2.5rem',
                borderBottom: '4px dashed var(--candy-purple)',
                padding: '0 0.5rem'
              }}>
                {solved ? data.correctObj.emoji : '❓'}
              </span>
            </div>
          </div>

          {/* Responsive options grid */}
          <div className="puzzle-options-grid" style={{ maxWidth: '500px', margin: '0 auto' }}>
            {data.options.map((opt) => {
              const isSelected = selected?.id === opt.id;
              const isCorrect = opt.id === data.correctObj.id;
              let stateClass = '';
              if (solved && isCorrect) stateClass = ' quiz-correct';
              if (isSelected && !solved) stateClass = ' quiz-wrong shake';

              return (
                <button
                  key={opt.id}
                  className={`quiz-option-btn${stateClass}`}
                  onClick={() => handleSelectOption(opt)}
                  disabled={solved}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.8rem 1rem',
                    minHeight: '80px'
                  }}
                >
                  <span style={{ fontSize: '2.4rem', lineHeight: '1' }}>{opt.emoji}</span>
                  <span style={{ fontSize: '1rem', fontWeight: '800', marginTop: '4px', color: '#444' }}>{opt.name}</span>
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
}
