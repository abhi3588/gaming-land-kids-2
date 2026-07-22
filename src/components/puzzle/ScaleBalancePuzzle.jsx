import { useState } from 'react';
import { playSound } from '../../utils/sounds';
import { TOTAL_LEVELS, getScaleBalanceLevel } from './puzzle-utils';

const ScaleBalancePuzzle = ({ puzzle, onBack }) => {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState(() => getScaleBalanceLevel(1));
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState('Add the correct item to balance the scale!');
  const [gameWon, setGameWon] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);

  const loadLevel = (nextLevel) => {
    setLevel(nextLevel);
    setData(getScaleBalanceLevel(nextLevel));
    setSelectedIdx(null);
    setSolved(false);
    setFeedback('Add the correct item to balance the scale!');
  };

  const handleOption = (idx) => {
    if (solved) return;

    setSelectedIdx(idx);
    const selectedOpt = data.options[idx];

    // Check if the weight matches the required weight
    const requiredWeight = data.leftWeight - data.rightWeight;
    
    if (selectedOpt.weight === requiredWeight) {
      playSound('match');
      setSolved(true);
      setFeedback('Balanced perfectly! Outstanding! ⚖️🌟');

      if (level >= TOTAL_LEVELS) {
        playSound('celebrate');
        setAllLevelsComplete(true);
        setGameWon(true);
      } else {
        setTimeout(() => {
          playSound('celebrate');
          loadLevel(level + 1);
        }, 1300);
      }
    } else {
      playSound('wrong');
      setFeedback('Oops! The scale is not balanced. Try a different weight!');
      setTimeout(() => setSelectedIdx(null), 1200);
    }
  };

  const handleReset = () => {
    playSound('pop');
    setGameWon(false);
    setAllLevelsComplete(false);
    loadLevel(1);
  };

  // Determine current tilt rotation
  // If not solved and no option is selected (or incorrect option is selected), it tilts left (left is heavier)
  // If solved, it is balanced (0deg)
  // If incorrect option is selected, let's tilt depending on whether it's too heavy or too light
  let tiltAngle = -8; // Default tilt left since left side is heavier initially
  if (solved) {
    tiltAngle = 0;
  } else if (selectedIdx !== null) {
    const selectedOpt = data.options[selectedIdx];
    const totalRight = data.rightWeight + selectedOpt.weight;
    if (totalRight > data.leftWeight) {
      tiltAngle = 8; // Right is heavier
    } else if (totalRight < data.leftWeight) {
      tiltAngle = -8; // Left is still heavier
    } else {
      tiltAngle = 0;
    }
  }

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>{puzzle.title}</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>{puzzle.completionEmoji}</div>
          <h2>{allLevelsComplete ? 'Balance Champion!' : 'Level Complete!'}</h2>
          <p>{puzzle.completionMessage}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Play Again
            </button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: solved ? 'var(--candy-green)' : selectedIdx !== null && selectedIdx !== data.correctIndex ? 'var(--candy-red)' : '#666',
            background: solved ? 'rgba(29,209,161,0.1)' : 'rgba(108, 92, 231, 0.08)',
            padding: '0.75rem 1rem',
            borderRadius: '14px',
            maxWidth: '520px',
            margin: '0 auto 1.5rem'
          }}>
            {feedback}
          </div>

          {/* Scale graphics using React inline styling and CSS transitions */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '460px',
            height: '240px',
            margin: '0 auto 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            background: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '24px',
            padding: '20px',
            boxShadow: 'var(--shadow-soft)',
            overflow: 'hidden'
          }}>
            
            {/* The Beam (Crossbar) */}
            <div style={{
              position: 'absolute',
              top: '80px',
              width: '320px',
              height: '12px',
              background: '#a1a1a1',
              borderRadius: '6px',
              transition: 'transform 0.4s ease-in-out',
              transform: `rotate(${tiltAngle}deg)`,
              transformOrigin: 'center center',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              {/* Fulcrum hinge point */}
              <div style={{
                position: 'absolute',
                left: 'calc(50% - 12px)',
                top: '-6px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#e2e8f0',
                border: '4px solid #718096',
                zIndex: 5
              }} />

              {/* Left Hanging Pan */}
              <div style={{
                position: 'absolute',
                left: '-10px',
                top: '6px',
                width: '120px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: `rotate(${-tiltAngle}deg)`,
                transition: 'transform 0.4s ease-in-out',
                transformOrigin: 'top center'
              }}>
                {/* Hanging cords */}
                <div style={{
                  width: '80px',
                  height: '50px',
                  borderLeft: '2px solid #718096',
                  borderRight: '2px solid #718096',
                  transform: 'perspective(100px) rotateX(30deg)',
                  transformOrigin: 'top center'
                }} />
                {/* Plate/Pan */}
                <div style={{
                  width: '110px',
                  height: '14px',
                  background: '#718096',
                  borderRadius: '0 0 10px 10px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingBottom: '2px'
                }} />
                {/* Left Side Content Container */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  height: '40px',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}>
                  {data.leftSide.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '1.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span>{item.emoji}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#4a5568' }}>
                        {data.mode === 'weight' ? item.label : `(${item.weight})`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Hanging Pan */}
              <div style={{
                position: 'absolute',
                right: '-10px',
                top: '6px',
                width: '120px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: `rotate(${-tiltAngle}deg)`,
                transition: 'transform 0.4s ease-in-out',
                transformOrigin: 'top center'
              }}>
                {/* Hanging cords */}
                <div style={{
                  width: '80px',
                  height: '50px',
                  borderLeft: '2px solid #718096',
                  borderRight: '2px solid #718096',
                  transform: 'perspective(100px) rotateX(30deg)',
                  transformOrigin: 'top center'
                }} />
                {/* Plate/Pan */}
                <div style={{
                  width: '110px',
                  height: '14px',
                  background: '#718096',
                  borderRadius: '0 0 10px 10px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingBottom: '2px'
                }} />
                {/* Right Side Content Container */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  height: '40px',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}>
                  {data.rightSide.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '1.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span>{item.emoji}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#4a5568' }}>
                        {data.mode === 'weight' ? item.label : `(${item.weight})`}
                      </span>
                    </div>
                  ))}
                  
                  {/* Missing Slot (Placeholder or Chosen Item) */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    border: solved ? 'none' : '2px dashed var(--color-primary)',
                    borderRadius: '8px',
                    background: solved ? 'transparent' : 'rgba(108, 92, 231, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: solved ? '1.8rem' : '1.1rem',
                    fontWeight: 'bold',
                    color: 'var(--color-primary)'
                  }}>
                    {selectedIdx !== null ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.4rem', lineHeight: '1' }}>{data.options[selectedIdx].emoji}</span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#4a5568', lineHeight: '1', marginTop: '2px' }}>
                          {data.mode === 'weight' ? data.options[selectedIdx].label : `(${data.options[selectedIdx].weight})`}
                        </span>
                      </div>
                    ) : '?'}
                  </div>
                </div>
              </div>
            </div>

            {/* Fulcrum base (Triangle stand) */}
            <div style={{
              width: '0',
              height: '0',
              borderLeft: '30px solid transparent',
              borderRight: '30px solid transparent',
              borderBottom: '90px solid #4a5568',
              position: 'relative',
              top: '3px'
            }} />
            
            {/* Stand Base plate */}
            <div style={{
              width: '140px',
              height: '10px',
              background: '#2d3748',
              borderRadius: '5px',
              zIndex: 2
            }} />
          </div>

          {/* Multiple-choice options */}
          <div className="quiz-options quiz-options-grid" style={{ maxWidth: '520px', margin: '0 auto' }}>
            {data.options.map((opt, idx) => {
              const isSelected = selectedIdx === idx;
              const isCorrect = idx === data.correctIndex;
              let stateClass = '';
              if (solved && isCorrect) stateClass = ' quiz-correct';
              if (isSelected && !solved) stateClass = ' quiz-wrong shake';
              
              return (
                <button
                  key={idx}
                  className={`quiz-option-btn${stateClass}`}
                  onClick={() => handleOption(idx)}
                  disabled={solved}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.8rem 1rem',
                    fontSize: '1.4rem'
                  }}
                >
                  <span style={{ fontSize: '1.8rem' }}>{opt.emoji}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', marginTop: '2px' }}>
                    {opt.label} {data.mode !== 'weight' && `(${opt.weight})`}
                  </span>
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
};

export default ScaleBalancePuzzle;
