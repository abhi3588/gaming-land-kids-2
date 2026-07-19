import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const STAGES = [
  { id: 'winter', emoji: '❄️', name: 'Winter', description: 'Winter is the coldest season! It snows and we wear warm coats, hats, and mittens.' },
  { id: 'spring', emoji: '🌸', name: 'Spring', description: 'Spring is warm and rainy! Flowers start to bloom, trees turn green, and we carry umbrellas.' },
  { id: 'summer', emoji: '☀️', name: 'Summer', description: 'Summer is hot and sunny! We wear sunglasses, short sleeves, and love to go to the beach.' },
  { id: 'autumn', emoji: '🍂', name: 'Autumn', description: 'Autumn is cool and windy! Leaves turn golden and red and fall from the trees, and we wear cozy sweaters.' }
];

const WeatherWatcher = ({ onBack }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleNext = () => {
    playSound('match');
    if (currentStage < STAGES.length - 1) {
      setCurrentStage(prev => prev + 1);
    } else {
      playSound('celebrate');
      setCompleted(true);
    }
  };

  const handleReset = () => {
    playSound('pop');
    setCurrentStage(0);
    setCompleted(false);
  };

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Weather Watcher</div>
        <div>Season {currentStage + 1} / {STAGES.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((currentStage + 1) / STAGES.length) * 100}%` }} />
        </div>
      </div>

      {completed ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🌤️</div>
          <h2>Weather Expert!</h2>
          <p>You learned about all four seasons in order of progression!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Explore Again
            </button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Science
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <div style={{ 
              fontSize: '8rem', 
              marginBottom: '1rem',
              animation: 'pop-in 0.5s ease'
            }}>
              {STAGES[currentStage].emoji}
            </div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              {STAGES[currentStage].name}
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '500px', margin: '0 auto' }}>
              {STAGES[currentStage].description}
            </p>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem', margin: '2rem 0' }}>
            {STAGES.map((stage, index) => (
              <div
                key={stage.id}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: index <= currentStage ? 'var(--candy-green)' : '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  transition: 'all 0.3s ease'
                }}
                title={stage.name}
              >
                {stage.emoji}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
              style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}
            >
              {currentStage === STAGES.length - 1 ? 'Finish! 🎉' : 'Next Season →'}
            </button>
          </div>

          <div className="detail-back-container">
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Science
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherWatcher;
