import { useState } from 'react';
import { playSound } from '../../../utils/sounds';

// 10 graduated scenarios on peacemaking & peaceful conflict resolution
const SCENARIOS = [
  {
    emoji: '🧸',
    situation: 'You and a friend both want to play with the exact same toy truck at the same time. What is the peaceful resolution?',
    options: [
      { id: 'timer', text: 'Set a 5-minute timer so you both get equal fun turns! ⏱️', correct: true },
      { id: 'snatch', text: 'Snatch it away and run to another room 🏃', correct: false },
      { id: 'break', text: 'Break the toy so nobody can play 💔', correct: false },
    ],
    lesson: 'Taking turns with a timer solves arguments fairly for both friends!'
  },
  {
    emoji: '🗣️',
    situation: 'Someone uses an unkind voice because they are feeling frustrated. How do you respond peacefully?',
    options: [
      { id: 'yell-back', text: 'Yell back even louder 📢', correct: false },
      { id: 'calm-talk', text: 'Speak calmly using "I feel" statements: "I feel sad when you raise your voice." 💬', correct: true },
      { id: 'push', text: 'Push them away 🖐️', correct: false },
    ],
    lesson: 'Using calm "I feel" words helps solve problems without fighting!'
  },
  {
    emoji: '🎨',
    situation: 'Two groups of kids want to paint at the easel, but there is only room for one group. What should the peacemaker suggest?',
    options: [
      { id: 'switch', text: 'Group A paints during first half of recess, Group B paints during second half 🎨', correct: true },
      { id: 'fight', text: 'Fight over the paintbrushes 🖌️', correct: false },
      { id: 'spill', text: 'Spill the paint containers 🪣', correct: false },
    ],
    lesson: 'Splitting time fairly brings peace and lets everybody create art!'
  },
  {
    emoji: '⚽',
    situation: 'During a tag game, someone says you were tagged, but you feel you were not. How do you handle the dispute?',
    options: [
      { id: 'argument', text: 'Scream and argue for 10 minutes 🗯️', correct: false },
      { id: 're-tag', text: 'Agree to a quick rock-paper-scissors or peaceful do-over! 🪨✂️📜', correct: true },
      { id: 'quit', text: 'Storm off and ruin the game for all players 😤', correct: false },
    ],
    lesson: 'Quick fair do-overs keep games friendly and fun for the whole group!'
  },
  {
    emoji: '🧹',
    situation: 'A mess of blocks was made by several kids, but nobody wants to clean up alone. What is the peacemaker move?',
    options: [
      { id: 'teamwork', text: 'Put on clean-up music and divide the blocks into team pick-ups! 🎵🧹', correct: true },
      { id: 'blame', text: 'Blame everyone else and refuse to help 👈', correct: false },
      { id: 'kick', text: 'Kick the blocks everywhere 🦶', correct: false },
    ],
    lesson: 'Teamwork turns a boring job into a fun, peaceful group game!'
  },
  {
    emoji: '🍿',
    situation: 'You are sharing popcorn with your friend and notice you are taking bigger handfuls. What is fair?',
    options: [
      { id: 'eat-all', text: 'Eat as fast as you can before they get any 🍿', correct: false },
      { id: 'equal', text: 'Pass the bowl back and forth taking equal turns 🤝', correct: true },
      { id: 'hide', text: 'Hide the bowl under your seat 🙈', correct: false },
    ],
    lesson: 'Equal sharing shows respect and keeps snack time peaceful!'
  },
  {
    emoji: '🛋️',
    situation: 'Your sibling wants to watch cartoons, but you want to watch a space show. How do you resolve it peacefully?',
    options: [
      { id: 'remote', text: 'Watch the cartoon show today and the space show tomorrow! 📺', correct: true },
      { id: 'hide-remote', text: 'Hide the TV remote in your pocket 📱', correct: false },
      { id: 'unplug', text: 'Unplug the television cord 🔌', correct: false },
    ],
    lesson: 'Alternating show days guarantees both family members get their choice!'
  },
  {
    emoji: '📝',
    situation: 'You accidentally step on your friend\'s crayon drawing and smudge it. What is the right peacemaker step?',
    options: [
      { id: 'deny', text: 'Pretend it wasn\'t you and walk away 🙈', correct: false },
      { id: 'apologize', text: 'Say "I am so sorry!" and offer to help fix or draw a new one 🖍️✨', correct: true },
      { id: 'blame-floor', text: 'Blame the floor 🧱', correct: false },
    ],
    lesson: 'A sincere apology and offer to help repairs mistakes and restores peace!'
  },
  {
    emoji: '🧩',
    situation: 'A puzzle piece is missing and two kids accuse each other of losing it. How do you bring peace?',
    options: [
      { id: 'search-together', text: 'Say "Let\'s stop blaming and search under the rug together!" 🔍', correct: true },
      { id: 'join-accuse', text: 'Join in yelling and blaming 📢', correct: false },
      { id: 'throw', text: 'Throw the rest of the puzzle away 🗑️', correct: false },
    ],
    lesson: 'Focusing on solving the problem together is far better than blaming!'
  },
  {
    emoji: '🕊️',
    situation: 'You see two friends having a loud disagreement on the playground. How can you be a Peace Captain?',
    options: [
      { id: 'cheer-fight', text: 'Cheer them on to fight louder 📣', correct: false },
      { id: 'peace-bridge', text: 'Listen calmly to both sides and help them find a middle solution 🕊️🤝', correct: true },
      { id: 'ignore-all', text: 'Make fun of them 😜', correct: false },
    ],
    lesson: 'Peace Captains listen kindly and help bridge solutions for everyone!'
  }
];

const PeaceCaptain = ({ onBack }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const scenario = SCENARIOS[currentScenario];

  const handleOption = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);

    if (option.correct) {
      playSound('match');
      setFeedback('Peaceful Solution! 🕊️✨');
      setScore((s) => s + 1);

      setTimeout(() => {
        if (currentScenario < SCENARIOS.length - 1) {
          setCurrentScenario((prev) => prev + 1);
          setSelectedOption(null);
          setFeedback('');
        } else {
          playSound('celebrate');
          setCompleted(true);
        }
      }, 2000);
    } else {
      playSound('wrong');
      setWrongFeedback();
    }
  };

  const setWrongFeedback = () => {
    setFeedback('That won\'t bring peace. Try a peaceful solution!');
    setTimeout(() => {
      setSelectedOption(null);
      setFeedback('');
    }, 1500);
  };

  const handleReset = () => {
    playSound('pop');
    setCurrentScenario(0);
    setSelectedOption(null);
    setFeedback('');
    setCompleted(false);
    setScore(0);
  };

  if (completed) {
    return (
      <div className="game-view pop-in">
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🕊️🏆✨</div>
          <h2>Peace Captain Master!</h2>
          <p>You created {score} peaceful solutions out of {SCENARIOS.length}!</p>
          <p style={{ fontSize: '1.05rem', color: '#666', marginTop: '1rem' }}>
            Solving problems with calm talk, fair turns, and kindness creates harmony everywhere!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Play Again
            </button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Back to Moral Education
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>Peace Captain 🕊️</div>
        <div>Story {currentScenario + 1} / {SCENARIOS.length}</div>
        <div>Score: {score} / {SCENARIOS.length}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((currentScenario + 1) / SCENARIOS.length) * 100}%` }} />
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        <div style={{ fontSize: '5rem', marginBottom: '0.75rem', animation: 'pop-in 0.5s ease' }}>
          {scenario.emoji}
        </div>
        <h2 style={{ fontSize: '1.3rem', color: '#1565c0', maxWidth: '540px', margin: '0 auto 1rem', lineHeight: '1.4' }}>
          {scenario.situation}
        </h2>
        {feedback && (
          <div style={{
            fontSize: '1.05rem',
            fontWeight: 'bold',
            color: feedback.includes('Peaceful Solution') ? 'var(--candy-green)' : '#ff6b6b',
            marginBottom: '1rem',
            padding: '0.85rem',
            background: feedback.includes('Peaceful Solution') ? 'rgba(29,209,161,0.1)' : 'rgba(255,107,107,0.1)',
            borderRadius: '14px',
            maxWidth: '540px',
            margin: '0 auto 1rem'
          }}>
            {feedback}
            {feedback.includes('Peaceful Solution') && (
              <div style={{ fontSize: '0.9rem', fontWeight: '600', marginTop: '0.4rem', color: '#0d47a1' }}>
                {scenario.lesson}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="quiz-options" style={{ maxWidth: '540px', margin: '0 auto' }}>
        {scenario.options.map((option) => {
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

      <div className="detail-back-container" style={{ marginTop: '1.5rem' }}>
        <button className="btn btn-back" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
          Back to Moral Education
        </button>
      </div>
    </div>
  );
};

export default PeaceCaptain;
