import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const SCENARIOS = [
  {
    id: 'sharing-toys',
    emoji: '🧸',
    situation: 'A new kid at school has no one to play with. What should you do?',
    options: [
      { id: 'ignore', text: 'Keep playing with your friends', correct: false },
      { id: 'invite', text: 'Invite them to play with you', correct: true }
    ],
    lesson: 'Kindness means including others and making new friends!'
  },
  {
    id: 'sad-friend',
    emoji: '😢',
    situation: 'Your friend is sad because they lost their game. What should you do?',
    options: [
      { id: 'walk-away', text: 'Walk away and let them be sad', correct: false },
      { id: 'comfort', text: 'Give them a hug and say it\'s okay', correct: true }
    ],
    lesson: 'Kindness means being there for friends when they need you!'
  },
  {
    id: 'sharing-snack',
    emoji: '🍪',
    situation: 'You have extra cookies at lunch. What should you do?',
    options: [
      { id: 'eat-all', text: 'Eat them all by yourself', correct: false },
      { id: 'share', text: 'Share with classmates who don\'t have snacks', correct: true }
    ],
    lesson: 'Sharing is a kind way to show you care about others!'
  },
  {
    id: 'helping-teacher',
    emoji: '👩‍🏫',
    situation: 'Your teacher is carrying many books. What should you do?',
    options: [
      { id: 'watch', text: 'Watch and do nothing', correct: false },
      { id: 'help', text: 'Offer to help carry some books', correct: true }
    ],
    lesson: 'Kindness means helping others, especially when they need it!'
  },
  {
    id: 'compliment',
    emoji: '⭐',
    situation: 'Your classmate did a great job on their project. What should you do?',
    options: [
      { id: 'say-nothing', text: 'Say nothing', correct: false },
      { id: 'compliment', text: 'Tell them they did a great job!', correct: true }
    ],
    lesson: 'Kind words make others feel happy and appreciated!'
  },
  {
    id: 'forgiving',
    emoji: '🤝',
    situation: 'Your friend accidentally broke your pencil. What should you do?',
    options: [
      { id: 'get-angry', text: 'Get angry and yell at them', correct: false },
      { id: 'forgive', text: 'Say it\'s okay and forgive them', correct: true }
    ],
    lesson: 'Kindness means forgiving others when they make mistakes!'
  },
  {
    id: 'hold-door',
    emoji: '🚪',
    situation: 'A grown-up is carrying heavy bags behind you at the door. What do you do?',
    options: [
      { id: 'hold-door', text: 'Hold the door open for them', correct: true },
      { id: 'let-close', text: 'Let it close in their face', correct: false }
    ],
    lesson: 'Small kind acts like holding a door make someone\'s day!'
  },
  {
    id: 'new-student',
    emoji: '🆕',
    situation: 'A new student looks lost in the hallway. What do you do?',
    options: [
      { id: 'guide', text: 'Walk them to their classroom', correct: true },
      { id: 'ignore', text: 'Walk past quickly', correct: false }
    ],
    lesson: 'Kindness is helping others find their way!'
  },
  {
    id: 'dropped-books',
    emoji: '📚',
    situation: 'A classmate drops all their books in the hall. What do you do?',
    options: [
      { id: 'help-pick', text: 'Help them pick everything up', correct: true },
      { id: 'laugh', text: 'Laugh and keep walking', correct: false }
    ],
    lesson: 'Helping in small moments shows a big kind heart!'
  },
  {
    id: 'elder-cross',
    emoji: '🦮',
    situation: 'An elderly neighbor struggles to cross the street. What do you do?',
    options: [
      { id: 'assist', text: 'Offer your arm and cross slowly with them', correct: true },
      { id: 'rush', text: 'Rush ahead and leave them', correct: false }
    ],
    lesson: 'Kindness means looking out for those who need help!'
  }
];

const KindnessHelper = ({ onBack }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [kindnessStars, setKindnessStars] = useState([]);

  const handleOption = (option) => {
    if (selectedOption) return;
    
    setSelectedOption(option);
    
    if (option.correct) {
      playSound('match');
      setFeedback('That\'s so kind! 🌟');
      setScore(prev => prev + 1);
      setKindnessStars(prev => [...prev, '⭐']);
      
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
      setFeedback('That\'s not very kind. Try again!');
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
    setKindnessStars([]);
  };

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Kindness Helper</div>
        <div>Scenario {currentScenario + 1} / {SCENARIOS.length}</div>
        <div>Score: {score} / {SCENARIOS.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((currentScenario + 1) / SCENARIOS.length) * 100}%` }} />
        </div>
      </div>

      {completed ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>💝</div>
          <h2>Kindness Superstar!</h2>
          <p>You earned {kindnessStars.length} kindness stars!</p>
          <div style={{ fontSize: '2rem', margin: '1rem 0' }}>
            {kindnessStars.map((star, i) => (
              <span key={i} style={{ animation: `pop-in 0.3s ease ${i * 0.1}s both` }}>
                {star}
              </span>
            ))}
          </div>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            Remember: Small acts of kindness can make a big difference!
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
                color: feedback.includes('kind') ? 'var(--candy-green)' : '#ff6b6b',
                marginBottom: '1rem',
                padding: '1rem',
                background: feedback.includes('kind') ? 'rgba(29,209,161,0.1)' : 'rgba(255,107,107,0.1)',
                borderRadius: '12px'
              }}>
                {feedback}
                {feedback.includes('kind') && (
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

export default KindnessHelper;
