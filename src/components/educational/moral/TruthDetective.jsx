import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const SCENARIOS = [
  {
    id: 'broken-toy',
    emoji: '🧸',
    situation: 'You broke your friend\'s toy by accident. What should you do?',
    options: [
      { id: 'tell-truth', text: 'Tell them what happened and say sorry', correct: true },
      { id: 'hide-it', text: 'Hide it and pretend nothing happened', correct: false }
    ],
    lesson: 'Being honest helps fix mistakes and keeps friendships strong!'
  },
  {
    id: 'found-money',
    emoji: '💰',
    situation: 'You found money on the playground. What should you do?',
    options: [
      { id: 'keep-it', text: 'Keep it for yourself', correct: false },
      { id: 'give-teacher', text: 'Give it to your teacher', correct: true }
    ],
    lesson: 'Honesty means returning things that don\'t belong to you!'
  },
  {
    id: 'homework',
    emoji: '📚',
    situation: 'You forgot to do your homework. What should you tell your teacher?',
    options: [
      { id: 'lie', text: 'Say you did it but lost it', correct: false },
      { id: 'honest', text: 'Tell the truth and say you forgot', correct: true }
    ],
    lesson: 'It\'s better to be honest and try again than to tell lies!'
  },
  {
    id: 'spilled-milk',
    emoji: '🥛',
    situation: 'You spilled milk on the floor. What should you do?',
    options: [
      { id: 'blame-sibling', text: 'Blame your brother or sister', correct: false },
      { id: 'admit-clean', text: 'Tell your parents and help clean it up', correct: true }
    ],
    lesson: 'Owning up to mistakes shows you\'re responsible and honest!'
  },
  {
    id: 'cheating',
    emoji: '🎮',
    situation: 'Your friend wants to copy your answers on a test. What should you do?',
    options: [
      { id: 'let-copy', text: 'Let them copy', correct: false },
      { id: 'say-no', text: 'Say no - that\'s not fair', correct: true }
    ],
    lesson: 'Honesty means doing the right thing, even when it\'s hard!'
  },
  {
    id: 'promise',
    emoji: '🤝',
    situation: 'You promised to help your mom but want to play instead. What should you do?',
    options: [
      { id: 'pretend-forget', text: 'Pretend you forgot', correct: false },
      { id: 'keep-promise', text: 'Keep your promise and help', correct: true }
    ],
    lesson: 'Being honest means keeping your promises!'
  }
];

const TruthDetective = ({ onBack }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOption = (option) => {
    if (selectedOption) return;
    
    setSelectedOption(option);
    
    if (option.correct) {
      playSound('match');
      setFeedback('Great choice! You\'re being honest! 🌟');
      setScore(prev => prev + 1);
      
      setTimeout(() => {
        if (currentScenario < SCENARIOS.length - 1) {
          setCurrentScenario(prev => prev + 1);
          setSelectedOption(null);
          setFeedback('');
        } else {
          playSound('celebrate');
          setCompleted(true);
        }
      }, 2000);
    } else {
      playSound('wrong');
      setFeedback('That\'s not honest. Try again!');
      setTimeout(() => {
        setSelectedOption(null);
        setFeedback('');
      }, 2000);
    }
  };

  const handleReset = () => {
    playSound('pop');
    setCurrentScenario(0);
    setSelectedOption(null);
    setFeedback('');
    setCompleted(false);
    setScore(0);
  };

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Truth Detective</div>
        <div>Scenario {currentScenario + 1} / {SCENARIOS.length}</div>
        <div>Score: {score} / {SCENARIOS.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((currentScenario + 1) / SCENARIOS.length) * 100}%` }} />
        </div>
      </div>

      {completed ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🔍</div>
          <h2>Honesty Hero!</h2>
          <p>You got {score} out of {SCENARIOS.length} correct!</p>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Remember: Being honest builds trust and makes you a good friend!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Play Again
            </button>
            <button className="btn btn-back"  onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Moral Education
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <div style={{ 
              fontSize: '6rem', 
              marginBottom: '1rem',
              animation: 'pop-in 0.5s ease'
            }}>
              {SCENARIOS[currentScenario].emoji}
            </div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '1rem', maxWidth: '600px', margin: '0 auto 1rem' }}>
              {SCENARIOS[currentScenario].situation}
            </h2>
            {feedback && (
              <div style={{ 
                fontSize: '1.1rem', 
                fontWeight: 'bold',
                color: feedback.includes('Great') ? 'var(--candy-green)' : '#ff6b6b',
                marginBottom: '1rem',
                padding: '1rem',
                background: feedback.includes('Great') ? 'rgba(29,209,161,0.1)' : 'rgba(255,107,107,0.1)',
                borderRadius: '12px'
              }}>
                {feedback}
                {feedback.includes('Great') && (
                  <div style={{ fontSize: '0.95rem', fontWeight: 'normal', marginTop: '0.5rem', color: '#666' }}>
                    {SCENARIOS[currentScenario].lesson}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="quiz-options">
            {SCENARIOS[currentScenario].options.map((option) => {
              const isSelected = selectedOption === option;
              const isCorrect = option.correct;
              
              return (
                <button
                  key={option.id}
                  className={`quiz-option-btn quiz-text-btn${isSelected && isCorrect ? ' quiz-correct' : isSelected && !isCorrect ? ' quiz-wrong shake' : ''}`}
                  onClick={() => handleOption(option)}
                  disabled={selectedOption !== null}
                >
                  {option.text}
                </button>
              );
            })}
          </div>

          <div className="detail-back-container">
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Moral Education
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TruthDetective;
