import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

const PLANETS = [
  { id: 'sun', emoji: '☀️', name: 'Sun', fact: 'The Sun is a star that gives us light and heat!' },
  { id: 'mercury', emoji: '⚫', name: 'Mercury', fact: 'Mercury is the smallest planet and closest to the Sun!' },
  { id: 'venus', emoji: '🟡', name: 'Venus', fact: 'Venus is the hottest planet!' },
  { id: 'earth', emoji: '🌍', name: 'Earth', fact: 'Earth is our home planet!' },
  { id: 'mars', emoji: '🔴', name: 'Mars', fact: 'Mars is called the red planet!' },
  { id: 'jupiter', emoji: '🟠', name: 'Jupiter', fact: 'Jupiter is the biggest planet!' },
  { id: 'saturn', emoji: '🪐', name: 'Saturn', fact: 'Saturn has beautiful rings!' },
  { id: 'uranus', emoji: '🔵', name: 'Uranus', fact: 'Uranus spins on its side!' },
  { id: 'neptune', emoji: '🔵', name: 'Neptune', fact: 'Neptune is very windy!' },
  { id: 'moon', emoji: '🌙', name: 'Moon', fact: 'The Moon orbits around Earth!' }
];

const ROUNDS = [
  {
    type: 'match',
    question: 'Which planet is our home?',
    target: 'earth',
    options: ['mars', 'earth', 'venus']
  },
  {
    type: 'match',
    question: 'Which planet is called the red planet?',
    target: 'mars',
    options: ['jupiter', 'mars', 'earth']
  },
  {
    type: 'match',
    question: 'Which planet has beautiful rings?',
    target: 'saturn',
    options: ['saturn', 'uranus', 'neptune']
  },
  {
    type: 'match',
    question: 'Which is the biggest planet?',
    target: 'jupiter',
    options: ['earth', 'jupiter', 'saturn']
  },
  {
    type: 'match',
    question: 'Which star gives us light and heat?',
    target: 'sun',
    options: ['moon', 'sun', 'mars']
  },
  {
    type: 'match',
    question: 'Which planet is closest to the Sun?',
    target: 'mercury',
    options: ['mercury', 'venus', 'earth']
  }
];

const SolarSystemExplorer = ({ onBack }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [badges, setBadges] = useState([]);

  const handleOption = (planetId) => {
    if (selectedOption) return;
    
    setSelectedOption(planetId);
    const round = ROUNDS[currentRound];
    const planet = PLANETS.find(p => p.id === planetId);
    
    if (planetId === round.target) {
      playSound('match');
      setFeedback('Correct! 🚀');
      setScore(prev => prev + 1);
      setBadges(prev => [...prev, '⭐']);
      
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
      setFeedback('Try again! Think about our solar system!');
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
    setBadges([]);
  };

  const currentRoundData = ROUNDS[currentRound];
  const targetPlanet = PLANETS.find(p => p.id === currentRoundData.target);

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Solar System Explorer</div>
        <div>Round {currentRound + 1} / {ROUNDS.length}</div>
        <div>Score: {score} / {ROUNDS.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((currentRound + 1) / ROUNDS.length) * 100}%` }} />
        </div>
      </div>

      {completed ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🪐</div>
          <h2>Space Explorer!</h2>
          <p>You got {score} out of {ROUNDS.length} correct!</p>
          <div style={{ fontSize: '2rem', margin: '1rem 0' }}>
            {badges.map((badge, i) => (
              <span key={i} style={{ animation: `pop-in 0.3s ease ${i * 0.1}s both` }}>
                {badge}
              </span>
            ))}
          </div>
          <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem' }}>
            You're now a Solar System expert! 🌟
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Explore Again
            </button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>
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
                    {targetPlanet.fact}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="quiz-options">
            {currentRoundData.options.map((planetId) => {
              const planet = PLANETS.find(p => p.id === planetId);
              const isSelected = selectedOption === planetId;
              const isCorrect = planetId === currentRoundData.target;
              
              return (
                <button
                  key={planetId}
                  className={`btn ${isSelected && !isCorrect ? 'shake' : ''}`}
                  style={{ 
                    fontSize: '3rem', 
                    fontWeight: 'bold',
                    padding: '1.5rem 2rem',
                    background: isSelected && isCorrect ? '#1dd1a1' : isSelected && !isCorrect ? '#ff6b6b' : 'white',
                    color: isSelected ? 'white' : 'var(--color-accent)',
                    border: '4px solid',
                    borderColor: isSelected && isCorrect ? '#1dd1a1' : isSelected && !isCorrect ? '#ff6b6b' : '#eee',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-soft)',
                    minWidth: '120px',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => handleOption(planetId)}
                  disabled={selectedOption !== null}
                >
                  <div>{planet.emoji}</div>
                  <div style={{ fontSize: '1rem', marginTop: '0.5rem' }}>{planet.name}</div>
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Science
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SolarSystemExplorer;
