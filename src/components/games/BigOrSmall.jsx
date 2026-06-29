import { useState, useCallback } from 'react';
import { playSound } from '../../utils/sounds';

const ROUNDS = [
  { question: 'Which one is BIGGER? 🔍', a: { emoji:'🐘', label:'Elephant' }, b: { emoji:'🐭', label:'Mouse'    }, bigger: 'a' },
  { question: 'Which one is SMALLER? 🔍',a: { emoji:'🦁', label:'Lion'     }, b: { emoji:'🐜', label:'Ant'      }, bigger: 'a', smaller: 'b' },
  { question: 'Which one is BIGGER? 🔍', a: { emoji:'🏠', label:'House'    }, b: { emoji:'🍄', label:'Mushroom' }, bigger: 'a' },
  { question: 'Which one is SMALLER? 🔍',a: { emoji:'🐋', label:'Whale'    }, b: { emoji:'🐟', label:'Fish'     }, bigger: 'a', smaller: 'b' },
  { question: 'Which one is BIGGER? 🔍', a: { emoji:'🚌', label:'Bus'      }, b: { emoji:'🚗', label:'Car'      }, bigger: 'a' },
  { question: 'Which one is SMALLER? 🔍',a: { emoji:'🌳', label:'Tree'     }, b: { emoji:'🌱', label:'Sprout'   }, bigger: 'a', smaller: 'b' },
  { question: 'Which one is BIGGER? 🔍', a: { emoji:'🐊', label:'Croc'     }, b: { emoji:'🦎', label:'Lizard'   }, bigger: 'a' },
  { question: 'Which one is SMALLER? 🔍',a: { emoji:'🌍', label:'Earth'    }, b: { emoji:'🍎', label:'Apple'    }, bigger: 'a', smaller: 'b' },
  { question: 'Which one is BIGGER? 🔍', a: { emoji:'✈️', label:'Plane'    }, b: { emoji:'🦅', label:'Eagle'    }, bigger: 'a' },
  { question: 'Which one is SMALLER? 🔍',a: { emoji:'🏔️', label:'Mountain' }, b: { emoji:'🪨', label:'Rock'     }, bigger: 'a', smaller: 'b' },
  { question: 'Which one is BIGGER? 🔍', a: { emoji:'🎪', label:'Tent'     }, b: { emoji:'⛺', label:'Tent'     }, bigger: 'a' },
  { question: 'Which one is SMALLER? 🔍',a: { emoji:'🐴', label:'Horse'    }, b: { emoji:'🐇', label:'Rabbit'   }, bigger: 'a', smaller: 'b' },
  { question: 'Which one is BIGGER? 🔍', a: { emoji:'🦒', label:'Giraffe'  }, b: { emoji:'🐑', label:'Sheep'    }, bigger: 'a' },
  { question: 'Which one is SMALLER? 🔍',a: { emoji:'🚀', label:'Rocket'   }, b: { emoji:'🔭', label:'Telescope'}, bigger: 'a', smaller: 'b' },
  { question: 'Which one is BIGGER? 🔍', a: { emoji:'🦈', label:'Shark'    }, b: { emoji:'🐠', label:'Fish'     }, bigger: 'a' },
  { question: 'Which one is SMALLER? 🔍',a: { emoji:'🐻', label:'Bear'     }, b: { emoji:'🐝', label:'Bee'      }, bigger: 'a', smaller: 'b' },
  { question: 'Which one is BIGGER? 🔍', a: { emoji:'🚢', label:'Ship'     }, b: { emoji:'🛶', label:'Canoe'    }, bigger: 'a' },
  { question: 'Which one is SMALLER? 🔍',a: { emoji:'🦖', label:'T-Rex'    }, b: { emoji:'🦎', label:'Lizard'   }, bigger: 'a', smaller: 'b' },
  { question: 'Which one is BIGGER? 🔍', a: { emoji:'🏙️', label:'City'     }, b: { emoji:'🏠', label:'House'    }, bigger: 'a' },
  { question: 'Which one is SMALLER? 🔍',a: { emoji:'🐘', label:'Elephant' }, b: { emoji:'🐈', label:'Cat'      }, bigger: 'a', smaller: 'b' }
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const TOTAL_LEVELS = 20;

const BigOrSmall = ({ onBack }) => {
  const [index, setIndex]               = useState(0);
  const [picked, setPicked]             = useState(null);
  const [feedback, setFeedback]         = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [score, setScore]               = useState(0);
  const [gameWon, setGameWon]           = useState(false);

  const current   = ROUNDS[index];
  const askSmall  = current.question.includes('SMALLER');
  const correctId = askSmall ? current.smaller : current.bigger;
  const TOTAL     = TOTAL_LEVELS;

  const resetGame = useCallback(() => {
    setIndex(0);
    setPicked(null);
    setFeedback('');
    setFeedbackType('');
    setScore(0);
    setGameWon(false);
  }, []);

  const handlePick = (id) => {
    if (picked) return;
    setPicked(id);
    if (id === correctId) {
      playSound('match');
      setFeedback('🎉 That\'s right! Great thinking!');
      setFeedbackType('correct');
      setScore((s) => s + 1);
    } else {
      playSound('wrong');
      const correctLabel = correctId === 'a' ? current.a.label : current.b.label;
      setFeedback(`Not quite! The ${askSmall ? 'smaller' : 'bigger'} one is the ${correctLabel}! 💡`);
      setFeedbackType('wrong');
    }
    setTimeout(() => {
      if (index + 1 >= TOTAL) {
        setGameWon(true);
      } else {
        setIndex((i) => i + 1);
        setPicked(null);
        setFeedback('');
        setFeedbackType('');
      }
    }, 1100);
  };

  const borderA = picked === 'a' ? (correctId === 'a' ? '#1dd1a1' : '#ff6b6b') : '#e0e0e0';
  const borderB = picked === 'b' ? (correctId === 'b' ? '#1dd1a1' : '#ff6b6b') : '#e0e0e0';
  const bgA     = picked === 'a' ? (correctId === 'a' ? '#e8fdf3' : '#fff0f0') : (picked && correctId === 'a' ? '#e8fdf3' : '#fff');
  const bgB     = picked === 'b' ? (correctId === 'b' ? '#e8fdf3' : '#fff0f0') : (picked && correctId === 'b' ? '#e8fdf3' : '#fff');

  return (
    <div className="game-view pop-in">
      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>🏆</div>
          <h2>Size Expert!</h2>
          <p>You got <strong>{score}</strong> out of <strong>{TOTAL}</strong> right! Amazing!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => typeof onBack === 'function' && onBack()}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div>Big or Small?</div>
            <div>Round {index + 1} / {TOTAL}</div>
            <div>Score: {score}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(index / TOTAL) * 100}%` }} />
            </div>
          </div>

          <div className="bos-question">{current.question}</div>

          <div className="bos-choices">
            <button
              className="bos-btn"
              style={{ border: `4px solid ${borderA}`, background: bgA }}
              onClick={() => handlePick('a')}
              disabled={!!picked}
            >
              <span className="bos-emoji">{current.a.emoji}</span>
              <span className="bos-label">{current.a.label}</span>
            </button>

            <button
              className="bos-btn"
              style={{ border: `4px solid ${borderB}`, background: bgB }}
              onClick={() => handlePick('b')}
              disabled={!!picked}
            >
              <span className="bos-emoji">{current.b.emoji}</span>
              <span className="bos-label">{current.b.label}</span>
            </button>
          </div>

          {feedback && <div className={`sound-feedback ${feedbackType}`}>{feedback}</div>}

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <button className="btn" style={{ background: '#eee', color: '#333' }}
              onClick={() => typeof onBack === 'function' && onBack()}>Main Menu</button>
          </div>
        </>
      )}
    </div>
  );
};

export default BigOrSmall;
