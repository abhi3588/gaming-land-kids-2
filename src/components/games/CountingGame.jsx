import { useState } from 'react';
import { playSound } from '../../utils/sounds';

const createLevelData = () => {
  const target = Math.floor(Math.random() * 5) + 3;
  const stars = Array.from({ length: target }, (_, i) => ({
    id: i,
    x: Math.random() * 80 + 10,
    y: Math.random() * 60 + 10,
    popped: false
  }));
  return { target, stars, count: 0 };
};

const CountingGame = ({ onBack }) => {
  const [data, setData] = useState(createLevelData);

  const generateLevel = () => {
    setData(createLevelData());
  };

  const handleStarClick = (id) => {
    const star = data.stars.find(s => s.id === id);
    if (star.popped) return;

    playSound('pop');
    const newStars = data.stars.map(s => s.id === id ? { ...s, popped: true } : s);
    const newCount = data.count + 1;
    
    setData(prev => ({
      ...prev,
      stars: newStars,
      count: newCount
    }));

    if (newCount === data.target) {
      playSound('celebrate');
      setTimeout(generateLevel, 1500);
    }
  };

  return (
    <div className="game-view pop-in">
      <h2>Star Count</h2>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-warning)' }}>
          Pop {data.target} stars! Found: {data.count}
        </p>
      </div>

      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '400px', 
        background: '#0a192f', 
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 0 50px rgba(76, 201, 240, 0.2)'
      }}>
        {data.stars.map(star => (
          <div
            key={star.id}
            onClick={() => handleStarClick(star.id)}
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              fontSize: '3rem',
              cursor: 'pointer',
              opacity: star.popped ? 0 : 1,
              transform: star.popped ? 'scale(2)' : 'scale(1)',
              transition: 'all 0.3s ease-out',
              pointerEvents: star.popped ? 'none' : 'auto'
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button className="btn btn-primary" onClick={onBack}>Main Menu</button>
      </div>
    </div>
  );
};

export default CountingGame;
