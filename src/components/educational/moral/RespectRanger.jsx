import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const SCENARIOS = [
  {
    id: 'listening',
    emoji: '👂',
    situation: 'Someone is talking to you. What should you do?',
    options: [
      { id: 'interrupt', text: 'Interrupt and talk about yourself', correct: false },
      { id: 'listen', text: 'Listen carefully and wait your turn', correct: true }
    ],
    lesson: 'Respect means listening to others and letting them finish speaking!'
  },
  {
    id: 'borrowing',
    emoji: '✏️',
    situation: 'You want to borrow your friend\'s pencil. What should you do?',
    options: [
      { id: 'take', text: 'Just take it without asking', correct: false },
      { id: 'ask', text: 'Ask politely and return it when done', correct: true }
    ],
    lesson: 'Respect means asking permission and taking care of others\' things!'
  },
  {
    id: 'different-opinion',
    emoji: '💭',
    situation: 'Your friend likes a different game than you. What should you do?',
    options: [
      { id: 'make-fun', text: 'Make fun of their choice', correct: false },
      { id: 'accept', text: 'Accept that everyone likes different things', correct: true }
    ],
    lesson: 'Respect means accepting that everyone has different opinions!'
  },
  {
    id: 'please-thank-you',
    emoji: '🙏',
    situation: 'Someone helps you with your homework. What should you say?',
    options: [
      { id: 'nothing', text: 'Say nothing', correct: false },
      { id: 'thank-you', text: 'Say thank you', correct: true }
    ],
    lesson: 'Respect means using polite words like please and thank you!'
  },
  {
    id: 'personal-space',
    emoji: '🫂',
    situation: 'Someone is standing too close to you. What should you do?',
    options: [
      { id: 'push', text: 'Push them away angrily', correct: false },
      { id: 'ask-politely', text: 'Politely ask them to give you space', correct: true }
    ],
    lesson: 'Respect means asking politely for what you need, not being rude!'
  },
  {
    id: 'elder',
    emoji: '👴',
    situation: 'An elderly person needs help carrying groceries. What should you do?',
    options: [
      { id: 'ignore', text: 'Ignore them and keep walking', correct: false },
      { id: 'help', text: 'Offer to help them', correct: true }
    ],
    lesson: 'Respect means being kind and helpful to everyone, especially elders!'
  }
];

const RespectRanger = ({ onBack }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [badges, setBadges] = useState([]);

  const handleOption = (option) => {
    if (selectedOption) return;
    
    setSelectedOption(option);
    
    if (option.correct) {
      playSound('match');
      setFeedback('That shows respect! 🎖️');
      setScore(prev => prev + 1);
      setBadges(prev => [...prev, '🎖️']);
      
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
      setFeedback('That\'s not respectful. Try again!');
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
    setBadges([]);
  };

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Respect Ranger</div>
        <div>Scenario {currentScenario + 1} / {SCENARIOS.length}</div>
        <div>Score: {score} / {SCENARIOS.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((currentScenario + 1) / SCENARIOS.length) * 100}%` }} />
        </div>
      </div>

      {completed ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🎖️</div>
          <h2>Respect Ranger!</h2>
          <p>You earned {badges.length} respect badges!</p>
          <div style={{ fontSize: '2rem', margin: '1rem 0' }}>
            {badges.map((badge, i) => (
              <span key={i} style={{ animation: `pop-in 0.3s ease ${i * 0.1}s both` }}>
                {badge}
              </span>
            ))}
          </div>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Remember: Respect makes everyone feel valued and appreciated!
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
                color: feedback.includes('respect') ? 'var(--candy-green)' : '#ff6b6b',
                marginBottom: '1rem',
                padding: '1rem',
                background: feedback.includes('respect') ? 'rgba(29,209,161,0.1)' : 'rgba(255,107,107,0.1)',
                borderRadius: '12px'
              }}>
                {feedback}
                {feedback.includes('respect') && (
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

export default RespectRanger;
