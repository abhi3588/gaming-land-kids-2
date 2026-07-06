import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const STAGES = [
  { id: 'seed', emoji: '🌰', name: 'Seed', description: 'A tiny seed waits in the soil.' },
  { id: 'sprout', emoji: '🌱', name: 'Sprout', description: 'The seed grows a tiny sprout.' },
  { id: 'plant', emoji: '🌿', name: 'Plant', description: 'The sprout grows into a plant.' },
  { id: 'flower', emoji: '🌸', name: 'Flower', description: 'The plant blooms a beautiful flower!' }
];

const PlantLifeCycle = ({ onBack }) => {
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
        <div>Plant Life Cycle</div>
        <div>Stage {currentStage + 1} / {STAGES.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((currentStage + 1) / STAGES.length) * 100}%` }} />
        </div>
      </div>

      {completed ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🌸</div>
          <h2>Amazing!</h2>
          <p>You learned how a plant grows from a seed to a flower!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Learn Again
            </button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>
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
            <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              {STAGES[currentStage].name}
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '500px', margin: '0 auto' }}>
              {STAGES[currentStage].description}
            </p>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', margin: '2rem 0' }}>
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
              {currentStage === STAGES.length - 1 ? 'Finish! 🎉' : 'Next Stage →'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Science
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PlantLifeCycle;
