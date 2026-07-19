import { useState } from 'react';
import { playSound } from '../../utils/sounds';
import { TOTAL_LEVELS, getPatternSequenceLevel } from './puzzle-utils';

const PatternSequencePuzzle = ({ puzzle, onBack }) => {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState(() => getPatternSequenceLevel(1));
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState('Look at the pattern and choose what comes next!');
  const [gameWon, setGameWon] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);

  const loadLevel = (nextLevel) => {
    setLevel(nextLevel);
    setData(getPatternSequenceLevel(nextLevel));
    setSelected(null);
    setSolved(false);
    setFeedback('Look at the pattern and choose what comes next!');
  };

  const handleOption = (opt) => {
    if (solved) return;

    setSelected(opt);

    if (opt === data.correct) {
      playSound('match');
      setSolved(true);
      setFeedback('You found the pattern! 🌟');

      if (level >= TOTAL_LEVELS) {
        playSound('celebrate');
        setAllLevelsComplete(true);
        setGameWon(true);
      } else {
        setTimeout(() => {
          playSound('celebrate');
          loadLevel(level + 1);
        }, 1100);
      }
    } else {
      playSound('wrong');
      setFeedback('Not quite — look closely at the rhythm and try again!');
      setTimeout(() => setSelected(null), 900);
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
          <h2>{allLevelsComplete ? 'Pattern Pro!' : 'Level Complete!'}</h2>
          <p>{puzzle.completionMessage}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Play Again
            </button>
            <button className="btn" style={{ background: '#eee', color: '#333' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Main Menu
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: solved ? 'var(--candy-green)' : '#666',
            background: solved ? 'rgba(29,209,161,0.1)' : 'rgba(108, 92, 231, 0.08)',
            padding: '0.75rem 1rem',
            borderRadius: '14px',
            maxWidth: '520px',
            margin: '0 auto 1.5rem'
          }}>
            {feedback}
          </div>

          {/* Sequence line with the missing slot at the end */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem'
          }}>
            {data.seq.map((emoji, i) => (
              <div
                key={i}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: '#fff',
                  boxShadow: 'var(--shadow-card, 0 8px 20px rgba(0,0,0,0.08))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.2rem'
                }}
              >
                {emoji}
              </div>
            ))}

            {/* Missing slot */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              border: '4px dashed var(--color-primary)',
              background: solved ? '#fff' : 'rgba(108, 92, 231, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: solved ? '2.2rem' : '1.6rem',
              fontWeight: 'bold',
              color: 'var(--color-primary)'
            }}>
              {solved ? data.correct : '?'}
            </div>
          </div>

          {/* Multiple-choice options */}
          <div className="quiz-options quiz-options-grid" style={{ maxWidth: '520px', margin: '0 auto' }}>
            {data.options.map((opt) => {
              const isSelected = selected === opt;
              const isCorrect = opt === data.correct;
              let stateClass = '';
              if (solved && isCorrect) stateClass = ' quiz-correct';
              if (isSelected && !solved) stateClass = ' quiz-wrong shake';
              return (
                <button
                  key={opt}
                  className={`quiz-option-btn${stateClass}`}
                  onClick={() => handleOption(opt)}
                  disabled={solved}
                >
                  <span className="quiz-emoji">{opt}</span>
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Main Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PatternSequencePuzzle;
