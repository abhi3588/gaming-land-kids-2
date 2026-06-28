import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const TOTAL_LEVELS = 20;

const createRound = (level) => {
  const isMultiplication = level > 12;
  const isSubtraction = level > 6 && !isMultiplication;

  const operators = ['+', '-', '×'];
  
  let num1, num2, answer, operator;

  if (isMultiplication) {
    operator = '×';
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;
    answer = num1 * num2;
  } else if (isSubtraction) {
    operator = '-';
    num1 = Math.floor(Math.random() * 20) + 5;
    num2 = Math.floor(Math.random() * num1); // Ensure positive result
    answer = num1 - num2;
  } else {
    // Addition (levels 1-6)
    operator = '+';
    num1 = Math.floor(Math.random() * 15) + 1;
    num2 = Math.floor(Math.random() * 15) + 1;
    answer = num1 + num2;
  }

  // To make it tricky, sometimes we randomly use a different operator for the same numbers if valid,
  // but to keep it simple and ensure a unique answer, we just generate one and ask for it.
  
  return { num1, num2, answer, operator, options: operators };
};

const OperatorQuest = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => createRound(1));
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState('Pick the correct sign!');
  const [feedbackType, setFeedbackType] = useState('');
  const [gameWon, setGameWon] = useState(false);

  const resetGame = useCallback(() => {
    setLevel(1);
    setRound(createRound(1));
    setPicked(null);
    setFeedback('Pick the correct sign!');
    setFeedbackType('');
    setGameWon(false);
  }, []);

  const handlePick = (op) => {
    if (picked || gameWon) return;
    setPicked(op);

    if (op === round.operator) {
      playSound('match');
      setFeedback('Correct! 🎉');
      setFeedbackType('correct');
      
      setTimeout(() => {
        if (level === TOTAL_LEVELS) {
          playSound('celebrate');
          setGameWon(true);
        } else {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          setRound(createRound(nextLevel));
          setPicked(null);
          setFeedback('Pick the correct sign!');
          setFeedbackType('');
        }
      }, 1000);
    } else {
      playSound('wrong');
      setFeedback('Oops! Try again! 🤔');
      setFeedbackType('wrong');
      setTimeout(() => {
        setPicked(null);
        setFeedback('Pick the correct sign!');
        setFeedbackType('');
      }, 1000);
    }
  };

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Math Genius!</h2>
          <p>You completed all {TOTAL_LEVELS} levels of Operator Quest.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => typeof onBack === 'function' && onBack()}>
              Main Menu
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Operator Quest</div>
            <div>Level {level} / {TOTAL_LEVELS}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
            </div>
          </div>

          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem', fontWeight: 600 }}>
            Which sign completes the equation?
          </p>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: '1rem', 
            fontSize: '3rem', 
            fontWeight: '900',
            color: '#2d3436',
            marginBottom: '3rem'
          }}>
            <div>{round.num1}</div>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px dashed #bdc3c7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: picked === round.operator ? '#1dd1a1' : '#e74c3c'
            }}>
              {picked || '?'}
            </div>
            <div>{round.num2}</div>
            <div>=</div>
            <div style={{ color: '#0984e3' }}>{round.answer}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {round.options.map((op) => (
              <button
                key={op}
                onClick={() => handlePick(op)}
                disabled={!!picked}
                style={{
                  fontSize: '2.5rem',
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  border: 'none',
                  background: 'white',
                  boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
                  color: '#2d3436',
                  cursor: picked ? 'default' : 'pointer',
                  transform: picked === op ? 'scale(0.9)' : 'scale(1)',
                  transition: 'all 0.2s'
                }}
              >
                {op}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`sound-feedback ${feedbackType}`} style={{ marginTop: '2rem' }}>
              {feedback}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn" style={{ background: '#eee', color: '#333' }}
              onClick={() => typeof onBack === 'function' && onBack()}>
              Main Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OperatorQuest;
