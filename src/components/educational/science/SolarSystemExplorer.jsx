import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const STAGES = [
  { id: 'mercury', emoji: '⚫', name: 'Mercury', description: 'Mercury is the smallest planet and closest to the Sun!' },
  { id: 'venus', emoji: '🟡', name: 'Venus', description: 'Venus is the hottest planet in our solar system!' },
  { id: 'earth', emoji: '🌍', name: 'Earth', description: 'Earth is our home planet and the only one with life!' },
  { id: 'mars', emoji: '🔴', name: 'Mars', description: 'Mars is called the red planet because of its red soil!' },
  { id: 'jupiter', emoji: '🟠', name: 'Jupiter', description: 'Jupiter is the biggest planet of all!' },
  { id: 'saturn', emoji: '🪐', name: 'Saturn', description: 'Saturn has beautiful rings made of ice and rock!' },
  { id: 'uranus', emoji: '🔵', name: 'Uranus', description: 'Uranus is a cold planet that spins completely on its side!' },
  { id: 'neptune', emoji: '🔵', name: 'Neptune', description: 'Neptune is the farthest planet and is very windy!' }
];

const SolarSystemExplorer = ({ onBack }) => {
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
        <div>Solar System Explorer</div>
        <div>Planet {currentStage + 1} / {STAGES.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((currentStage + 1) / STAGES.length) * 100}%` }} />
        </div>
      </div>

      {completed ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🪐</div>
          <h2>Space Explorer!</h2>
          <p>You learned about all the planets in order of distance from the Sun!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Explore Again
            </button>
            <button className="btn" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
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
                  background: index <= currentStage ? 'var(--candy-purple)' : '#e0e0e0',
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
              {currentStage === STAGES.length - 1 ? 'Finish! 🎉' : 'Next Planet →'}
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

export default SolarSystemExplorer;
