import { useState } from 'react';
import { playSound } from '../../utils/sounds';
import { TOTAL_LEVELS, getWordSearchLevel, getThemeForLevel } from './puzzle-utils';

const cellKey = ([r, c]) => `${r},${c}`;
const sameCell = (a, b) => !!a && !!b && a[0] === b[0] && a[1] === b[1];

// Returns the straight line of cells from `start` to `end` (including both),
// or null if they are not on a shared row, column, or 45° diagonal.
const getLine = (start, end) => {
  if (!start || !end) return null;
  const [r1, c1] = start;
  const [r2, c2] = end;
  if (r1 === r2 && c1 === c2) return [[r1, c1]];
  if (r1 !== r2 && c1 !== c2 && Math.abs(r2 - r1) !== Math.abs(c2 - c1)) return null;
  const dr = Math.sign(r2 - r1);
  const dc = Math.sign(c2 - c1);
  const cells = [];
  let r = r1;
  let c = c1;
  cells.push([r, c]);
  while (r !== r2 || c !== c2) {
    r += dr;
    c += dc;
    cells.push([r, c]);
  }
  return cells;
};

const WordSearchPuzzle = ({ puzzle, onBack }) => {
  const [level, setLevel] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const [data, setData] = useState(() => getWordSearchLevel(1));
  const [sel, setSel] = useState({ start: null, end: null });
  const [active, setActive] = useState(false); // a start cell is pending a second tap
  const [foundSet, setFoundSet] = useState(new Set());
  const [previewLine, setPreviewLine] = useState(null);
  const [feedback, setFeedback] = useState('Tap a letter, then tap the last letter of a word!');

  const loadLevel = (nextLevel) => {
    const nd = getWordSearchLevel(nextLevel);
    setData(nd);
    setLevel(nextLevel);
    setSel({ start: null, end: null });
    setActive(false);
    setFoundSet(new Set());
    setPreviewLine(null);
    setFeedback('Tap a letter, then tap the last letter of a word!');
  };

  const resolve = (start, end) => {
    const line = getLine(start, end);
    setSel({ start: null, end: null });
    setActive(false);
    setPreviewLine(null);
    if (!line || line.length < 2) return;

    const lineSet = new Set(line.map(cellKey));
    let matchedIndex = -1;
    data.words.forEach((w, i) => {
      if (foundSet.has(i)) return;
      const wset = new Set(w.cells.map(cellKey));
      if (wset.size === lineSet.size && [...wset].every((k) => lineSet.has(k))) {
        matchedIndex = i;
      }
    });

    if (matchedIndex >= 0) {
      const next = new Set(foundSet);
      next.add(matchedIndex);
      setFoundSet(next);
      const w = data.words[matchedIndex];
      playSound('match');
      setFeedback(`Great! You found ${w.word} ${w.emoji}`);
      if (next.size === data.words.length) {
        if (level >= TOTAL_LEVELS) {
          playSound('celebrate');
          setGameWon(true);
        } else {
          setTimeout(() => {
            playSound('celebrate');
            loadLevel(level + 1);
          }, 700);
        }
      }
    } else {
      playSound('wrong');
      setFeedback('Not quite — that’s not a word. Try again!');
    }
  };

  // Tap-to-select (mobile friendly): first tap sets the start, second tap sets
  // the end and resolves. Pointer-enter handles drag preview on desktop mice.
  const handlePointerDown = (r, c) => {
    if (gameWon) return;
    if (active && sel.start && sameCell(sel.start, [r, c])) {
      setSel({ start: null, end: null });
      setActive(false);
      setPreviewLine(null);
      return;
    }
    if (active && sel.start) {
      resolve(sel.start, [r, c]);
      return;
    }
    setSel({ start: [r, c], end: [r, c] });
    setActive(true);
    setPreviewLine(getLine([r, c], [r, c]));
  };

  const handlePointerEnter = (r, c) => {
    if (active && sel.start && !sameCell(sel.start, [r, c])) {
      setSel((s) => (s.start ? { ...s, end: [r, c] } : s));
      setPreviewLine(getLine(sel.start, [r, c]));
    }
  };

  const handlePointerUp = () => {
    if (active && sel.start && sel.end && !sameCell(sel.start, sel.end)) {
      resolve(sel.start, sel.end);
    }
  };

  const foundCells = new Set();
  data.words.forEach((w, i) => {
    if (foundSet.has(i)) w.cells.forEach((cell) => foundCells.add(cellKey(cell)));
  });
  const previewCells = previewLine ? new Set(previewLine.map(cellKey)) : new Set();

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>{puzzle.title}</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div>{foundSet.size} / {data.words.length} found</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>{puzzle.completionEmoji}</div>
          <h2>Word Wizard!</h2>
          <p>{puzzle.completionMessage}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={() => { setGameWon(false); loadLevel(1); }}>
              Play Again
            </button>
            <button className="btn" style={{ background: '#eee', color: '#333' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Main Menu
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="puzzle-feedback" style={{ background: getThemeForLevel(level).gradient, color: 'white' }}>
            {feedback}
          </div>

          <div className="ws-layout">
            <div
              className="ws-words"
              role="list"
              aria-label={`Words to find in ${data.category}`}
            >
              <span className="ws-category">{data.icon} {data.category}</span>
              {data.words.map((w, i) => (
                <span key={i} className={`ws-word${foundSet.has(i) ? ' found' : ''}`} role="listitem">
                  <span className="ws-emoji">{w.emoji}</span> {w.word}
                </span>
              ))}
            </div>

            <div
              className="ws-board"
              style={{ gridTemplateColumns: `repeat(${data.size}, 1fr)` }}
            >
              {data.grid.map((row, r) => row.map((ch, c) => {
                const key = cellKey([r, c]);
                const isFound = foundCells.has(key);
                const isSel = previewCells.has(key);
                return (
                  <button
                    key={key}
                    type="button"
                    className={`ws-cell${isFound ? ' found' : ''}${isSel ? ' sel' : ''}`}
                    onPointerDown={() => handlePointerDown(r, c)}
                    onPointerEnter={() => handlePointerEnter(r, c)}
                    onPointerUp={handlePointerUp}
                    aria-label={`Letter ${ch}`}
                  >
                    {ch}
                  </button>
                );
              }))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Main Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WordSearchPuzzle;
