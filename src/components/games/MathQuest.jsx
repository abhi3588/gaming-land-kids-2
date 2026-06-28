import { useState, useEffect, useRef } from 'react';
import { playSound } from '../../utils/sounds';

const BALLOON_COLORS = [
  '#f72585',
  '#7209b7',
  '#3f37c9',
  '#4cc9f0',
  '#4caf50',
  '#ffb703',
  '#f9c74f',
  '#f94144'
];

const TOTAL_LEVELS = 20;

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateQuestionData = (level) => {
  let num1, num2, answer, text;

  if (level <= 5) {
    num1 = getRandomNumber(2, 12);
    num2 = getRandomNumber(2, 12);
    answer = num1 + num2;
    text = `${num1} + ${num2} = ?`;
  } else if (level <= 10) {
    num1 = getRandomNumber(8, 24);
    num2 = getRandomNumber(2, num1 - 2);
    answer = num1 - num2;
    text = `${num1} - ${num2} = ?`;
  } else if (level <= 15) {
    num1 = getRandomNumber(2, 9);
    num2 = getRandomNumber(2, 9);
    answer = num1 * num2;
    text = `${num1} × ${num2} = ?`;
  } else {
    const operations = ['+', '-', '×'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    if (op === '+') {
      num1 = getRandomNumber(10, 26);
      num2 = getRandomNumber(5, 20);
      answer = num1 + num2;
      text = `${num1} + ${num2} = ?`;
    } else if (op === '-') {
      num1 = getRandomNumber(15, 30);
      num2 = getRandomNumber(5, num1 - 5);
      answer = num1 - num2;
      text = `${num1} - ${num2} = ?`;
    } else {
      num1 = getRandomNumber(3, 12);
      num2 = getRandomNumber(2, 8);
      answer = num1 * num2;
      text = `${num1} × ${num2} = ?`;
    }
  }

  return { text, answer };
};

const generateBalloonsData = (correctAnswer, level) => {
  const wrongAnswers = new Set();
  let attempts = 0;

  while (wrongAnswers.size < 3 && attempts < 80) {
    const offset = getRandomNumber(-8, 8);
    const val = correctAnswer + offset;
    if (val !== correctAnswer && val > 0) {
      wrongAnswers.add(val);
    }
    attempts++;
  }

  let fallback = 1;
  while (wrongAnswers.size < 3) {
    if (fallback !== correctAnswer) wrongAnswers.add(fallback);
    fallback++;
  }

  const answersList = [correctAnswer, ...Array.from(wrongAnswers)];
  const shuffledAnswers = answersList.sort(() => Math.random() - 0.5);

  return shuffledAnswers.map((value, idx) => {
    const left = 10 + idx * 22 + getRandomNumber(-3, 3);
    const bottom = -80 - getRandomNumber(0, 150);
    const speed = 1.0 + Math.min(level * 0.12, 3.0) + Math.random() * 0.4;
    const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];

    return {
      id: idx,
      value,
      left,
      bottom,
      speed,
      color,
      isPopped: false
    };
  });
};

const getLevelGoal = (level) => 2 + Math.floor((level - 1) / 5);

const MathQuest = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [message, setMessage] = useState('Pop the correct balloon!');

  const [question, setQuestion] = useState(() => generateQuestionData(1));
  const [balloons, setBalloons] = useState(() => generateBalloonsData(question.answer, 1));
  const requestRef = useRef();
  const balloonsRef = useRef(balloons);

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const loadLevel = (nextLevel) => {
    if (nextLevel > TOTAL_LEVELS) {
      setGameWon(true);
      return;
    }

    const qData = generateQuestionData(nextLevel);
    setQuestion(qData);
    const bData = generateBalloonsData(qData.answer, nextLevel);
    setBalloons(bData);
    balloonsRef.current = bData;
    setLevel(nextLevel);
    setProgress(0);
    setMessage(`Level ${nextLevel}: Pop ${getLevelGoal(nextLevel)} correct balloons!`);
  };

  const triggerBalloonsRegeneration = () => {
    const bData = generateBalloonsData(question.answer, level);
    setBalloons(bData);
    balloonsRef.current = bData;
  };

  const startGame = () => {
    setLevel(1);
    setScore(0);
    setProgress(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    const qData = generateQuestionData(1);
    setQuestion(qData);
    const bData = generateBalloonsData(qData.answer, 1);
    setBalloons(bData);
    balloonsRef.current = bData;
    setMessage('Pop the correct balloon!');
  };

  useEffect(() => {
    if (gameOver || gameWon) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const animate = () => {
      const updated = balloonsRef.current.map((b) => {
        if (b.isPopped) return b;
        let newBottom = b.bottom + b.speed;
        if (newBottom > 480) {
          newBottom = -100 - getRandomNumber(0, 80);
        }
        return { ...b, bottom: newBottom };
      });
      balloonsRef.current = updated;
      setBalloons(updated);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameOver, gameWon]);

  const handleBalloonClick = (id, value) => {
    if (gameOver || gameWon) return;

    const balloonIndex = balloonsRef.current.findIndex((b) => b.id === id);
    if (balloonIndex === -1 || balloonsRef.current[balloonIndex].isPopped) return;

    const poppedBalloons = balloonsRef.current.map((b) =>
      b.id === id ? { ...b, isPopped: true } : b
    );
    balloonsRef.current = poppedBalloons;
    setBalloons(poppedBalloons);

    if (value === question.answer) {
      playSound('match');
      setScore((prev) => prev + 1);
      setProgress((prev) => prev + 1);

      const nextProgress = progress + 1;
      const targetGoal = getLevelGoal(level);
      if (nextProgress >= targetGoal) {
        if (level === TOTAL_LEVELS) {
          setTimeout(() => {
            setGameWon(true);
          }, 600);
          return;
        }

        setTimeout(() => {
          playSound('celebrate');
          loadLevel(level + 1);
        }, 700);
      } else {
        setMessage('Nice! Keep going.');
        setTimeout(() => {
          triggerBalloonsRegeneration();
        }, 500);
      }
    } else {
      playSound('wrong');
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setGameOver(true);
      } else {
        setMessage('Oops! Try the next balloon.');
        setTimeout(triggerBalloonsRegeneration, 700);
      }
    }
  };

  return (
    <div className="game-view pop-in">
      <p style={{ textAlign: 'center', margin: '0 0 1.5rem', color: '#666' }}>
        Pop the correct balloon! 🎈
      </p>

      <div className="game-header">
        <div>Math Quest</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div>Score: {score}</div>
        <div>Lives: {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} style={{ opacity: i < lives ? 1 : 0.3, marginRight: '3px' }}>❤️</span>
        ))}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {!gameOver && !gameWon ? (
        <>
          <div style={{ textAlign: 'center', background: 'white', borderRadius: '15px', padding: '1rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-soft)', border: '3px solid var(--color-soft-blue)' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1b263b' }}>
              {question.text}
            </span>
          </div>

          <div className="math-quest-area">
            {balloons.map((b) => !b.isPopped && (
              <div
                key={b.id}
                className="balloon"
                style={{
                  left: `${b.left}%`,
                  bottom: `${b.bottom}px`,
                  backgroundColor: b.color,
                  color: 'white',
                  borderColor: b.color
                }}
                onClick={() => handleBalloonClick(b.id, b.value)}
              >
                {b.value}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--color-accent)', fontWeight: 700 }}>{message}</div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" style={{ background: '#eee', color: '#333' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </>
      ) : (
        <div className="champion-screen" style={{ borderColor: gameWon ? 'var(--color-soft-green)' : 'var(--color-soft-pink)' }}>
          {gameWon ? (
            <>
              <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏆</div>
              <h3 style={{ fontSize: '2rem', color: 'var(--color-success)', marginBottom: '1rem' }}>You Are a Math Champion!</h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>You solved all 20 levels of balloon math.</p>
            </>
          ) : (
            <>
              <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>😢</div>
              <h3 style={{ fontSize: '2rem', color: 'var(--color-secondary)', marginBottom: '1rem' }}>Game Over!</h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>Don't worry, practice makes perfect!</p>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={startGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>Main Menu</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MathQuest;
