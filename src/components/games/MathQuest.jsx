import { useState, useEffect, useRef } from 'react';
import { playSound } from '../../utils/sounds';

const BALLOON_COLORS = [
  '#f72585', // pink
  '#7209b7', // purple
  '#3f37c9', // indigo
  '#4cc9f0', // light blue
  '#4caf50', // green
  '#ffb703', // yellow
  '#f9c74f', // orange-yellow
  '#f94144'  // coral red
];

// Pure random helpers defined outside the component
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateQuestionData = (level) => {
  let num1, num2, answer, text;
  
  if (level === 1) {
    num1 = getRandomNumber(2, 10);
    num2 = getRandomNumber(2, 10);
    answer = num1 + num2;
    text = `${num1} + ${num2} = ?`;
  } else if (level === 2) {
    num1 = getRandomNumber(6, 20);
    num2 = getRandomNumber(2, num1 - 1);
    answer = num1 - num2;
    text = `${num1} - ${num2} = ?`;
  } else {
    num1 = getRandomNumber(2, 9);
    num2 = getRandomNumber(2, 9);
    answer = num1 * num2;
    text = `${num1} × ${num2} = ?`;
  }
  return { text, answer };
};

const generateBalloonsData = (correctAnswer, level) => {
  const wrongAnswers = new Set();
  while (wrongAnswers.size < 3) {
    let offset = getRandomNumber(-5, 5);
    let val = correctAnswer + offset;
    if (val !== correctAnswer && val > 0) {
      wrongAnswers.add(val);
    }
  }

  const answersList = [correctAnswer, ...Array.from(wrongAnswers)];
  const shuffledAnswers = answersList.sort(() => Math.random() - 0.5);

  return shuffledAnswers.map((value, idx) => {
    const left = 10 + idx * 22 + getRandomNumber(-3, 3);
    const bottom = -80 - getRandomNumber(0, 150);
    const speed = 1.0 + (level * 0.2) + Math.random() * 0.4;
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

const MathQuest = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  
  // Initialize state synchronously
  const [question, setQuestion] = useState(() => generateQuestionData(1));
  const [balloons, setBalloons] = useState(() => generateBalloonsData(question.answer, 1));
  
  const requestRef = useRef();
  const balloonsRef = useRef(balloons);

  // Sync ref with state at start
  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const triggerNextQuestion = (nextLevel) => {
    const qData = generateQuestionData(nextLevel);
    setQuestion(qData);
    const bData = generateBalloonsData(qData.answer, nextLevel);
    setBalloons(bData);
    balloonsRef.current = bData;
  };

  const triggerBalloonsRegeneration = () => {
    const bData = generateBalloonsData(question.answer, level);
    setBalloons(bData);
    balloonsRef.current = bData;
  };

  const startGame = () => {
    setLevel(1);
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    
    const qData = generateQuestionData(1);
    setQuestion(qData);
    const bData = generateBalloonsData(qData.answer, 1);
    setBalloons(bData);
    balloonsRef.current = bData;
  };

  // Frame update loop for floating balloons
  useEffect(() => {
    if (gameOver || gameWon) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const animate = () => {
      const updated = balloonsRef.current.map(b => {
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

    const balloonIndex = balloonsRef.current.findIndex(b => b.id === id);
    if (balloonIndex === -1 || balloonsRef.current[balloonIndex].isPopped) return;

    const poppedBalloons = balloonsRef.current.map(b => 
      b.id === id ? { ...b, isPopped: true } : b
    );
    balloonsRef.current = poppedBalloons;
    setBalloons(poppedBalloons);

    if (value === question.answer) {
      playSound('match');
      const newScore = score + 1;
      setScore(newScore);

      if (newScore === 5 && level === 1) {
        playSound('celebrate');
        setLevel(2);
        triggerNextQuestion(2);
      } else if (newScore === 10 && level === 2) {
        playSound('celebrate');
        setLevel(3);
        triggerNextQuestion(3);
      } else if (newScore >= 15) {
        playSound('celebrate');
        setGameWon(true);
      } else {
        setTimeout(() => triggerNextQuestion(level), 400);
      }
    } else {
      playSound('wrong');
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setGameOver(true);
      } else {
        setTimeout(triggerBalloonsRegeneration, 600);
      }
    }
  };

  return (
    <div className="game-view pop-in">
      <h2>Math Quest</h2>
      <p style={{ textAlign: 'center', margin: '-0.5rem 0 1.5rem', color: '#666' }}>
        Pop the correct balloon! 🎈
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', padding: '0 10px', fontSize: '1.2rem', fontWeight: 'bold' }}>
        <div style={{ color: 'var(--color-accent)' }}>Level: {level}</div>
        <div style={{ color: 'var(--color-success)' }}>Score: {score}/15</div>
        <div style={{ color: 'var(--color-secondary)' }}>
          Lives: {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} style={{ opacity: i < lives ? 1 : 0.2, marginRight: '3px' }}>❤️</span>
          ))}
        </div>
      </div>

      {!gameOver && !gameWon ? (
        <>
          <div style={{ 
            textAlign: 'center', 
            background: 'white', 
            borderRadius: '15px', 
            padding: '1rem', 
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-soft)',
            border: '3px solid var(--color-soft-blue)'
          }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1b263b' }}>
              {question.text}
            </span>
          </div>

          <div className="math-quest-area">
            {balloons.map(b => !b.isPopped && (
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
        </>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          background: 'white', 
          borderRadius: '24px', 
          padding: '3rem 2rem', 
          boxShadow: 'var(--shadow-pop)',
          border: '4px solid ' + (gameWon ? 'var(--color-soft-green)' : 'var(--color-soft-pink)')
        }}>
          {gameWon ? (
            <>
              <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏆</div>
              <h3 style={{ fontSize: '2rem', color: 'var(--color-success)', marginBottom: '1rem' }}>You Are a Math Champion!</h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>You solved all the equations correctly!</p>
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
            <button className="btn" style={{ background: '#eee' }} onClick={onBack}>Main Menu</button>
          </div>
        </div>
      )}

      {!gameOver && !gameWon && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="btn btn-primary" style={{ background: '#eee', color: '#333' }} onClick={onBack}>Main Menu</button>
        </div>
      )}
    </div>
  );
};

export default MathQuest;
