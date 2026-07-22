import { useState } from 'react';
import { playSound } from '../../utils/sounds';
import { TOTAL_LEVELS, getCodingQuestLevel } from './puzzle-utils';

const CodingQuestPuzzle = ({ puzzle, onBack }) => {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState(() => getCodingQuestLevel(1));
  const [robotPos, setRobotPos] = useState(() => getCodingQuestLevel(1).start);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState('Select the correct arrow sequence to code the robot to the star!');
  const [gameWon, setGameWon] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);

  const loadLevel = (nextLevel) => {
    const nextData = getCodingQuestLevel(nextLevel);
    setLevel(nextLevel);
    setData(nextData);
    setRobotPos(nextData.start);
    setSelectedIdx(null);
    setIsAnimating(false);
    setSolved(false);
    setFeedback('Select the correct arrow sequence to code the robot to the star!');
  };

  const handleOption = (idx) => {
    if (solved || isAnimating) return;

    setSelectedIdx(idx);

    if (idx === data.correctIndex) {
      playSound('match');
      setIsAnimating(true);
      setFeedback('Running your code... 🤖');
      
      // Animate the robot step-by-step
      let step = 0;
      const interval = setInterval(() => {
        if (step < data.path.length - 1) {
          step += 1;
          setRobotPos(data.path[step]);
          playSound('pop');
        } else {
          clearInterval(interval);
          setSolved(true);
          setIsAnimating(false);
          setFeedback('Target reached! Code execution successful! 🌟');
          
          if (level >= TOTAL_LEVELS) {
            playSound('celebrate');
            setAllLevelsComplete(true);
            setGameWon(true);
          } else {
            setTimeout(() => {
              playSound('celebrate');
              loadLevel(level + 1);
            }, 1200);
          }
        }
      }, 350);
    } else {
      playSound('wrong');
      setFeedback('Oops! That code will crash or miss the target. Try another sequence!');
      setTimeout(() => setSelectedIdx(null), 1200);
    }
  };

  const handleReset = () => {
    playSound('pop');
    setGameWon(false);
    setAllLevelsComplete(false);
    loadLevel(1);
  };

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
          <h2>{allLevelsComplete ? 'Coding Master!' : 'Level Complete!'}</h2>
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
            margin: '0 auto 1.25rem'
          }}>
            {feedback}
          </div>

          {/* Grid board rendering */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${data.size}, 1fr)`,
            gap: '8px',
            width: 'min(100%, 360px)',
            margin: '0 auto 1.5rem',
            background: 'rgba(255, 255, 255, 0.4)',
            padding: '12px',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-soft)'
          }}>
            {Array.from({ length: data.size }).map((_, r) =>
              Array.from({ length: data.size }).map((_, c) => {
                const isRobot = robotPos[0] === r && robotPos[1] === c;
                const isGoal = data.goal[0] === r && data.goal[1] === c;
                const isObstacle = data.obstacles.some(obs => obs[0] === r && obs[1] === c);
                
                return (
                  <div
                    key={`${r}-${c}`}
                    style={{
                      aspectRatio: 1,
                      background: isRobot ? 'var(--candy-blue)' : isGoal ? 'var(--candy-yellow)' : isObstacle ? '#e2e8f0' : 'white',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.05)',
                      transition: 'background-color 0.25s, transform 0.25s',
                      transform: isRobot ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    {isRobot ? '🤖' : isGoal ? '🌟' : isObstacle ? '🪨' : ''}
                  </div>
                );
              })
            )}
          </div>

          {/* Arrow sequence options */}
          <div className="quiz-options puzzle-options-grid" style={{ maxWidth: '520px', margin: '0 auto' }}>
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
                  disabled={solved || isAnimating}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '0.8rem 1rem',
                    fontSize: '1.4rem'
                  }}
                >
                  {opt.map((arrow, aIdx) => (
                    <span key={aIdx} style={{ display: 'inline-block' }}>{arrow}</span>
                  ))}
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

export default CodingQuestPuzzle;
