import { useState } from 'react';
import { playSound } from '../../utils/sounds';

const shapes = ['🔴', '🔵', '⭐', '💎', '🍀'];

const createPatternData = () => {
  const s1 = shapes[Math.floor(Math.random() * shapes.length)];
  const s2 = shapes[Math.floor(Math.random() * shapes.length)];
  const pattern = [s1, s2, s1, s2, s1];
  const nextShape = s2;
  
  const otherOptions = shapes.filter(s => s !== nextShape)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  const options = [...otherOptions, nextShape].sort(() => Math.random() - 0.5);
  
  return { pattern, options, message: 'What comes next?' };
};

const PatternGame = ({ onBack }) => {
  const [data, setData] = useState(createPatternData);

  const generatePattern = () => {
    setData(createPatternData());
  };

  const handleOptionClick = (shape) => {
    const nextShape = data.pattern[1]; // simplified ABAB pattern
    if (shape === nextShape) {
      playSound('match');
      setData(prev => ({ ...prev, message: 'Correct! 🎉' }));
      setTimeout(() => {
        playSound('celebrate');
        generatePattern();
      }, 1000);
    } else {
      playSound('wrong');
      setData(prev => ({ ...prev, message: 'Try again! ❤️' }));
    }
  };

  return (
    <div className="game-view pop-in">
      <h2>Pattern Train</h2>
      <div className="pattern-sequence">
        {data.pattern.map((s, i) => <div key={i} className="pop-in">{s}</div>)}
        <div className="pattern-missing shake">?</div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>{data.message}</p>
      </div>

      <div className="pattern-options">
        {data.options.map((shape, i) => (
          <button
            key={i}
            className="btn pattern-option"
            onClick={() => handleOptionClick(shape)}
          >
            {shape}
          </button>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button className="btn btn-primary" onClick={onBack}>Main Menu</button>
      </div>
    </div>
  );
};

export default PatternGame;
