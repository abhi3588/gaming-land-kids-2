import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const SCENARIOS = [
  {
    id: 'cleaning',
    emoji: '🧹',
    situation: 'You made a mess with your toys. What should you do?',
    options: [
      { id: 'leave', text: 'Leave it for someone else to clean', correct: false },
      { id: 'clean', text: 'Clean it up yourself', correct: true }
    ],
    lesson: 'Responsibility means cleaning up your own messes!'
  },
  {
    id: 'pet-care',
    emoji: '🐕',
    situation: 'It\'s time to feed your pet. What should you do?',
    options: [
      { id: 'forget', text: 'Forget and play video games instead', correct: false },
      { id: 'feed', text: 'Feed your pet before playing', correct: true }
    ],
    lesson: 'Responsibility means taking care of those who depend on you!'
  },
  {
    id: 'homework',
    emoji: '📝',
    situation: 'You have homework due tomorrow. What should you do?',
    options: [
      { id: 'play', text: 'Play now and do it in the morning', correct: false },
      { id: 'do-now', text: 'Do your homework now', correct: true }
    ],
    lesson: 'Responsibility means doing your work on time!'
  },
  {
    id: 'being-late',
    emoji: '⏰',
    situation: 'You need to be at school on time. What should you do?',
    options: [
      { id: 'sleep', text: 'Sleep in and be late', correct: false },
      { id: 'wake-up', text: 'Wake up on time and get ready', correct: true }
    ],
    lesson: 'Responsibility means being punctual and respecting others\' time!'
  },
  {
    id: 'lost-item',
    emoji: '🔑',
    situation: 'You lost your house key. What should you do?',
    options: [
      { id: 'hide', text: 'Hide it and hope no one notices', correct: false },
      { id: 'tell-parents', text: 'Tell your parents right away', correct: true }
    ],
    lesson: 'Responsibility means owning up to mistakes and asking for help!'
  },
  {
    id: 'teamwork',
    emoji: '🤝',
    situation: 'Your team is working on a project. What should you do?',
    options: [
      { id: 'let-others', text: 'Let others do all the work', correct: false },
      { id: 'do-share', text: 'Do your fair share of the work', correct: true }
    ],
    lesson: 'Responsibility means doing your part in teamwork!'
  }
];

const ResponsibilityCaptain = ({ onBack }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState([]);

  const handleOption = (option) => {
    if (selectedOption) return;
    
    setSelectedOption(option);
    
    if (option.correct) {
      playSound('match');
      setFeedback('That\'s responsible! ⭐');
      setScore(prev => prev + 1);
      setStars(prev => [...prev, '⭐']);
      
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
      setFeedback('That\'s not responsible. Try again!');
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
    setStars([]);
  };

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Responsibility Captain</div>
        <div>Scenario {currentScenario + 1} / {SCENARIOS.length}</div>
        <div>Score: {score} / {SCENARIOS.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((currentScenario + 1) / SCENARIOS.length) * 100}%` }} />
        </div>
      </div>

      {completed ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🌟</div>
          <h2>Responsibility Captain!</h2>
          <p>You earned {stars.length} responsibility stars!</p>
          <div style={{ fontSize: '2rem', margin: '1rem 0' }}>
            {stars.map((star, i) => (
              <span key={i} style={{ animation: `pop-in 0.3s ease ${i * 0.1}s both` }}>
                {star}
              </span>
            ))}
          </div>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Remember: Being responsible helps you become trustworthy and reliable!
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
                color: feedback.includes('responsible') ? 'var(--candy-green)' : '#ff6b6b',
                marginBottom: '1rem',
                padding: '1rem',
                background: feedback.includes('responsible') ? 'rgba(29,209,161,0.1)' : 'rgba(255,107,107,0.1)',
                borderRadius: '12px'
              }}>
                {feedback}
                {feedback.includes('responsible') && (
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

export default ResponsibilityCaptain;
