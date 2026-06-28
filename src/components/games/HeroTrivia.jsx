import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const QUESTIONS = [
  {
    q: 'What colour is the Hulk?',
    emoji: '💚',
    options: ['Green', 'Blue', 'Red', 'Purple'],
    answer: 'Green',
  },
  {
    q: "Who wields a magical hammer called Mjolnir?",
    emoji: '⚡',
    options: ['Thor', 'Iron Man', 'Batman', 'Aquaman'],
    answer: 'Thor',
  },
  {
    q: 'Which city does Batman protect?',
    emoji: '🦇',
    options: ['Gotham', 'New York', 'Metropolis', 'Central City'],
    answer: 'Gotham',
  },
  {
    q: 'Which hero can breathe underwater?',
    emoji: '🌊',
    options: ['Aquaman', 'Superman', 'The Flash', 'Spider-Man'],
    answer: 'Aquaman',
  },
  {
    q: "What is Spider-Man's real first name?",
    emoji: '🕷️',
    options: ['Peter', 'Tony', 'Bruce', 'Clark'],
    answer: 'Peter',
  },
  {
    q: 'Which hero wears a red and gold armoured suit?',
    emoji: '🦾',
    options: ['Iron Man', 'Batman', 'Thor', 'Captain America'],
    answer: 'Iron Man',
  },
  {
    q: "What shape is Captain America's shield?",
    emoji: '🛡️',
    options: ['Circle', 'Triangle', 'Square', 'Star'],
    answer: 'Circle',
  },
  {
    q: 'Which hero runs at super speed?',
    emoji: '🏃',
    options: ['The Flash', 'Hulk', 'Aquaman', 'Batman'],
    answer: 'The Flash',
  },
  {
    q: "What is Superman's weakness?",
    emoji: '🦸',
    options: ['Kryptonite', 'Gold', 'Silver', 'Water'],
    answer: 'Kryptonite',
  },
  {
    q: 'Which hero is the king of Wakanda?',
    emoji: '🐾',
    options: ['Black Panther', 'Thor', 'Aquaman', 'Iron Man'],
    answer: 'Black Panther',
  },
  {
    q: 'Who shoots laser beams from their eyes?',
    emoji: '🔴',
    options: ['Cyclops', 'Hawkeye', 'Batman', 'The Flash'],
    answer: 'Cyclops',
  },
  {
    q: 'Which planet was Superman born on?',
    emoji: '🌍',
    options: ['Krypton', 'Mars', 'Asgard', 'Vulcan'],
    answer: 'Krypton',
  },
  {
    q: 'Where does Thor come from?',
    emoji: '⚡',
    options: ['Asgard', 'Earth', 'Atlantis', 'Wakanda'],
    answer: 'Asgard',
  },
  {
    q: "What are Wolverine's claws made of?",
    emoji: '🐺',
    options: ['Adamantium', 'Gold', 'Iron', 'Diamond'],
    answer: 'Adamantium',
  },
  {
    q: 'Which hero is also known as the Dark Knight?',
    emoji: '🌃',
    options: ['Batman', 'Superman', 'Iron Man', 'Thor'],
    answer: 'Batman',
  },
  {
    q: 'What does Spider-Man shoot from his wrists?',
    emoji: '🕸️',
    options: ['Webs', 'Lasers', 'Fire', 'Ice'],
    answer: 'Webs',
  },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const HeroTrivia = ({ onBack }) => {
  const [questions] = useState(() => shuffle([...QUESTIONS]));
  const [index, setIndex]               = useState(0);
  const [wrongPicks, setWrongPicks]     = useState([]);
  const [solved, setSolved]             = useState(false);
  const [feedback, setFeedback]         = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [score, setScore]               = useState(0);
  const [gameWon, setGameWon]           = useState(false);

  const TOTAL = questions.length;
  const current = questions[index];

  const resetGame = useCallback(() => {
    setIndex(0);
    setWrongPicks([]);
    setSolved(false);
    setFeedback('');
    setFeedbackType('');
    setScore(0);
    setGameWon(false);
  }, []);

  const handlePick = (option) => {
    if (solved || wrongPicks.includes(option)) return;

    if (option === current.answer) {
      playSound('match');
      setFeedback('🎉 Correct! You know your heroes!');
      setFeedbackType('correct');
      setSolved(true);
      setScore((s) => s + 1);
      setTimeout(() => {
        if (index + 1 >= TOTAL) {
          setGameWon(true);
        } else {
          setIndex((i) => i + 1);
          setWrongPicks([]);
          setSolved(false);
          setFeedback('');
          setFeedbackType('');
        }
      }, 1000);
    } else {
      playSound('wrong');
      setWrongPicks((prev) => [...prev, option]);
      setFeedback('❌ Not right — that button is locked! Keep trying!');
      setFeedbackType('wrong');
    }
  };

  const grade = score >= 14 ? '🏆 Superhero Master!' :
                score >= 11 ? '🥇 Hero Expert!' :
                score >= 8  ? '🥈 Hero Fan!' :
                              '🥉 Hero Trainee!';

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>{grade}</h2>
          <p>You scored <strong>{score}</strong> out of <strong>{TOTAL}</strong>!</p>
          <p style={{ fontSize: '1rem', color: '#888', marginTop: '0.5rem' }}>
            {score === TOTAL ? 'Perfect score! You know everything about superheroes! 🌟' :
             score >= 12 ? 'Incredible knowledge — almost perfect!' :
             'Great effort! Play again to beat your score!'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => typeof onBack === 'function' && onBack()}>
              Main Menu
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Hero Trivia</div>
            <div>Q {index + 1} / {TOTAL}</div>
            <div>Score: {score}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(index / TOTAL) * 100}%` }} />
            </div>
          </div>

          <div className="trivia-card">
            <div className="trivia-emoji">{current.emoji}</div>
            <div className="trivia-question">{current.q}</div>
          </div>

          <div className="trivia-options">
            {current.options.map((opt) => {
              const isWrong   = wrongPicks.includes(opt);
              const isCorrect = solved && opt === current.answer;
              let cls = 'trivia-btn';
              if (isCorrect) cls += ' trivia-correct';
              else if (isWrong) cls += ' trivia-wrong';
              return (
                <button
                  key={opt}
                  className={cls}
                  onClick={() => handlePick(opt)}
                  disabled={isWrong || solved}
                  title={isWrong ? 'Already tried!' : ''}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className={`sound-feedback ${feedbackType}`}>{feedback}</div>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
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

export default HeroTrivia;
