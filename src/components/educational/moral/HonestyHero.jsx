import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const SCENARIOS = [
  {
    id: 'game-points',
    emoji: '🎮',
    situation: 'Your friend got a lower game score than you by mistake. What do you do?',
    options: [
      { id: 'correct-score', text: 'Tell them their true score and laugh together', correct: true },
      { id: 'keep-quiet', text: 'Keep quiet so you look like the winner', correct: false }
    ],
    lesson: 'Honesty is more valuable than winning any game!'
  },
  {
    id: 'lost-pencil',
    emoji: '✏️',
    situation: 'You found a nice shiny pencil on the floor next to your classmate\'s desk. What do you do?',
    options: [
      { id: 'keep-pencil', text: 'Put it in your bag', correct: false },
      { id: 'ask-classmate', text: 'Ask if it belongs to them', correct: true }
    ],
    lesson: 'Returning lost things is a mark of true honesty!'
  },
  {
    id: 'broken-plate',
    emoji: '🍽️',
    situation: 'You accidentally cracked a plate in the kitchen while grabbing a cookie. What do you do?',
    options: [
      { id: 'tell-truth', text: 'Tell your parents right away and say sorry', correct: true },
      { id: 'blame-dog', text: 'Blame the dog or pretend you did not see it', correct: false }
    ],
    lesson: 'Owning up to accidents shows courage and truthfulness!'
  },
  {
    id: 'secret-snack',
    emoji: '🍓',
    situation: 'You ate the last strawberry snack that was saved for dessert. What do you say when asked?',
    options: [
      { id: 'deny', text: 'Say you do not know who ate it', correct: false },
      { id: 'admit', text: 'Admit that you ate it because it looked yummy', correct: true }
    ],
    lesson: 'Telling the truth makes parents trust you even more!'
  },
  {
    id: 'wrong-change',
    emoji: '🪙',
    situation: 'The shopkeeper accidentally handed you extra coins in your change. What do you do?',
    options: [
      { id: 'give-back', text: 'Hand the extra coins back to the shopkeeper', correct: true },
      { id: 'pocket-it', text: 'Pocket the extra coins and walk away', correct: false }
    ],
    lesson: 'Being honest means doing the right thing even when no one is watching!'
  },
  {
    id: 'friend-secret',
    emoji: '🤫',
    situation: 'You accidentally shared a secret your friend told you. What do you do?',
    options: [
      { id: 'deny-talk', text: 'Pretend you never said anything to anyone', correct: false },
      { id: 'confess-sorry', text: 'Confess to your friend and apologize sincerely', correct: true }
    ],
    lesson: 'Telling the truth helps rebuild trust in friendships!'
  }
];

const HonestyHero = ({ onBack }) => {
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
        <div>Honesty Hero</div>
        <div>Scenario {currentScenario + 1} / {SCENARIOS.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((currentScenario + 1) / SCENARIOS.length) * 100}%` }} />
        </div>
      </div>

      {completed ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>💎</div>
          <h2>Honesty Hero!</h2>
          <p>You completed all scenarios and showed great truthfulness!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Play Again
            </button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
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
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              {SCENARIOS[currentScenario].situation}
            </h2>
            {feedback && (
              <p style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold',
                color: feedback.includes('Great') ? 'var(--candy-green)' : '#ff6b6b',
                marginTop: '1rem'
              }}>
                {feedback}
              </p>
            )}
            {selectedOption && selectedOption.correct && (
              <p style={{ fontSize: '1.05rem', color: '#666', marginTop: '0.5rem', fontStyle: 'italic' }}>
                {SCENARIOS[currentScenario].lesson}
              </p>
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
                  <span>{option.text}</span>
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

export default HonestyHero;
