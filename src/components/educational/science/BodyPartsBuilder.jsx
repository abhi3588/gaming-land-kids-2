import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

// External, visible body parts only — arranged top to bottom so the
// stages read like a real body being built from head to toe.
const STAGES = [
  { id: 'head', emoji: '👶', name: 'Head', description: 'Our head sits on top of our body and holds our face, eyes, and smile!' },
  { id: 'eyes', emoji: '👁️', name: 'Eyes', description: 'We use our eyes on our face to see all the colorful things around us!' },
  { id: 'ears', emoji: '👂', name: 'Ears', description: 'We use our ears on the side of our head to hear music, voices, and sounds!' },
  { id: 'nose', emoji: '👃', name: 'Nose', description: 'We use our nose on our face to breathe fresh air and smell flowers!' },
  { id: 'mouth', emoji: '👄', name: 'Mouth', description: 'We use our mouth to talk, smile, taste, and eat delicious food!' },
  { id: 'arms', emoji: '💪', name: 'Arms', description: 'Our arms help us reach, hug, and carry the things we love!' },
  { id: 'hands', emoji: '🤚', name: 'Hands', description: 'We use our hands at the end of our arms to write, draw, touch, and hold toys!' },
  { id: 'tummy', emoji: '🤰', name: 'Tummy', description: 'Our tummy helps digest our food so we can grow big and strong!' },
  { id: 'legs', emoji: '🦵', name: 'Legs', description: 'Our legs help us stand tall, walk, and run wherever we go!' },
  { id: 'feet', emoji: '👟', name: 'Feet', description: 'We use our feet at the bottom of our legs to walk, run, skip, and jump!' }
];

const BodyPartsBuilder = ({ onBack }) => {
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
        <div>Body Parts Builder</div>
        <div>Part {currentStage + 1} / {STAGES.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((currentStage + 1) / STAGES.length) * 100}%` }} />
        </div>
      </div>

      {completed ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>💪</div>
          <h2>Body Expert!</h2>
          <p>You learned about different body parts from head to toe!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Build Again
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
                  background: index <= currentStage ? 'var(--candy-blue)' : '#e0e0e0',
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
              {currentStage === STAGES.length - 1 ? 'Finish! 🎉' : 'Next Part →'}
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

export default BodyPartsBuilder;
