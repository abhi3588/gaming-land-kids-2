import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const BODY_PARTS = [
  { id: 'eyes', emoji: '👁️', name: 'Eyes', function: 'We use our eyes to see!' },
  { id: 'ears', emoji: '👂', name: 'Ears', function: 'We use our ears to hear sounds!' },
  { id: 'nose', emoji: '👃', name: 'Nose', function: 'We use our nose to smell!' },
  { id: 'mouth', emoji: '👄', name: 'Mouth', function: 'We use our mouth to eat and talk!' },
  { id: 'hands', emoji: '🖐️', name: 'Hands', function: 'We use our hands to touch and hold things!' },
  { id: 'feet', emoji: '👟', name: 'Feet', function: 'We use our feet to walk and run!' },
  { id: 'heart', emoji: '❤️', name: 'Heart', function: 'Our heart pumps blood through our body!' },
  { id: 'brain', emoji: '🧠', name: 'Brain', function: 'Our brain helps us think and learn!' },
  { id: 'stomach', emoji: '🍽️', name: 'Stomach', function: 'Our stomach helps digest food!' },
  { id: 'lungs', emoji: '🫁', name: 'Lungs', function: 'Our lungs help us breathe!' }
];

const ROUNDS = [
  {
    type: 'match',
    question: 'Which body part do we use to see?',
    target: 'eyes',
    options: ['ears', 'eyes', 'nose']
  },
  {
    type: 'match',
    question: 'Which body part do we use to hear?',
    target: 'ears',
    options: ['ears', 'mouth', 'hands']
  },
  {
    type: 'match',
    question: 'Which body part do we use to smell?',
    target: 'nose',
    options: ['eyes', 'nose', 'ears']
  },
  {
    type: 'match',
    question: 'Which body part do we use to eat and talk?',
    target: 'mouth',
    options: ['nose', 'mouth', 'ears']
  },
  {
    type: 'match',
    question: 'Which body part do we use to walk and run?',
    target: 'feet',
    options: ['hands', 'feet', 'mouth']
  },
  {
    type: 'match',
    question: 'Which body part helps us think and learn?',
    target: 'brain',
    options: ['heart', 'brain', 'stomach']
  }
];

const BodyPartsBuilder = ({ onBack }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState([]);

  const handleOption = (partId) => {
    if (selectedOption) return;
    
    setSelectedOption(partId);
    const round = ROUNDS[currentRound];
    const bodyPart = BODY_PARTS.find(p => p.id === partId);
    
    if (partId === round.target) {
      playSound('match');
      setFeedback('Correct! 🌟');
      setScore(prev => prev + 1);
      setStars(prev => [...prev, '⭐']);
      
      setTimeout(() => {
        if (currentRound < ROUNDS.length - 1) {
          setCurrentRound(prev => prev + 1);
          setSelectedOption(null);
          setFeedback('');
        } else {
          playSound('celebrate');
          setCompleted(true);
        }
      }, 2000);
    } else {
      playSound('wrong');
      setFeedback('Try again! Think about your body!');
      setTimeout(() => {
        setSelectedOption(null);
        setFeedback('');
      }, 2000);
    }
  };

  const handleReset = () => {
    playSound('pop');
    setCurrentRound(0);
    setSelectedOption(null);
    setFeedback('');
    setCompleted(false);
    setScore(0);
    setStars([]);
  };

  const currentRoundData = ROUNDS[currentRound];
  const targetPart = BODY_PARTS.find(p => p.id === currentRoundData.target);

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Body Parts Builder</div>
        <div>Round {currentRound + 1} / {ROUNDS.length}</div>
        <div>Score: {score} / {ROUNDS.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((currentRound + 1) / ROUNDS.length) * 100}%` }} />
        </div>
      </div>

      {completed ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🧍</div>
          <h2>Body Builder!</h2>
          <p>You got {score} out of {ROUNDS.length} correct!</p>
          <div style={{ fontSize: '2rem', margin: '1rem 0' }}>
            {stars.map((star, i) => (
              <span key={i} style={{ animation: `pop-in 0.3s ease ${i * 0.1}s both` }}>
                {star}
              </span>
            ))}
          </div>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            You know your body really well! 💪
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Build Again
            </button>
            <button className="btn"  onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Science
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
              {currentRoundData.question}
            </h2>
            {feedback && (
              <div style={{ 
                fontSize: '1.1rem', 
                fontWeight: 'bold',
                color: feedback.includes('Correct') ? 'var(--candy-green)' : '#ff6b6b',
                marginBottom: '1rem',
                padding: '1rem',
                background: feedback.includes('Correct') ? 'rgba(29,209,161,0.1)' : 'rgba(255,107,107,0.1)',
                borderRadius: '12px'
              }}>
                {feedback}
                {feedback.includes('Correct') && (
                  <div style={{ fontSize: '0.95rem', fontWeight: 'normal', marginTop: '0.5rem', color: '#666' }}>
                    {targetPart.function}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="quiz-options">
            {currentRoundData.options.map((partId) => {
              const bodyPart = BODY_PARTS.find(p => p.id === partId);
              const isSelected = selectedOption === partId;
              const isCorrect = partId === currentRoundData.target;
              
              return (
                <button
                  key={partId}
                  className={`quiz-option-btn${isSelected && isCorrect ? ' quiz-correct' : isSelected && !isCorrect ? ' quiz-wrong shake' : ''}`}
                  onClick={() => handleOption(partId)}
                  disabled={selectedOption !== null}
                >
                  <span className="quiz-emoji">{bodyPart.emoji}</span>
                  <span>{bodyPart.name}</span>
                </button>
              );
            })}
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
