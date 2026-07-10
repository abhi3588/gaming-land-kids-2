import { useMemo, useState } from 'react';
import { playSound } from '../../utils/sounds';
import {
  GRID_SIZE,
  TOTAL_LEVELS,
  createPRNG,
  getThemeForLevel,
  shuffleArray,
} from './puzzle-utils';

const createPieces = (level) => {
  const pieces = [];
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      pieces.push({
        id: `${row}-${col}`,
        row,
        col,
        placed: false,
      });
    }
  }
  return shuffleArray(pieces, createPRNG(level * 421));
};

const JigsawPuzzle = ({ puzzle, onBack }) => {
  const [level, setLevel] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);
  const [feedback, setFeedback] = useState('Drag a piece to its matching spot on the board.');
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const theme = useMemo(() => getThemeForLevel(level), [level]);
  const [board, setBoard] = useState(() => Array.from({ length: GRID_SIZE * GRID_SIZE }, () => null));
  const [tray, setTray] = useState(() => createPieces(1));

  const loadLevel = (nextLevel) => {
    setLevel(nextLevel);
    setBoard(Array.from({ length: GRID_SIZE * GRID_SIZE }, () => null));
    setTray(createPieces(nextLevel));
    setSelectedPieceId(null);
    setFeedback('Drag a piece to its matching spot on the board.');
  };

  const remaining = tray.filter((piece) => !piece.placed).length;

  const placePiece = (pieceId, slotIndex) => {
    const piece = tray.find((item) => item.id === pieceId && !item.placed);
    if (!piece || board[slotIndex]) return;

    const targetRow = Math.floor(slotIndex / GRID_SIZE);
    const targetCol = slotIndex % GRID_SIZE;

    if (piece.row === targetRow && piece.col === targetCol) {
      playSound('match');
      const nextBoard = [...board];
      nextBoard[slotIndex] = pieceId;
      setBoard(nextBoard);
      setTray((prev) => prev.map((item) => (
        item.id === pieceId ? { ...item, placed: true } : item
      )));
      setSelectedPieceId(null);
      setFeedback('Perfect fit! Keep going.');

      const placedCount = nextBoard.filter(Boolean).length;
      if (placedCount === GRID_SIZE * GRID_SIZE) {
        if (level >= TOTAL_LEVELS) {
          playSound('celebrate');
          setAllLevelsComplete(true);
          setGameWon(true);
          return;
        }
        setTimeout(() => {
          playSound('celebrate');
          loadLevel(level + 1);
          setFeedback(`Great job! Level ${level + 1} starts now.`);
        }, 700);
      }
      return;
    }

    playSound('wrong');
    setFeedback('That piece belongs somewhere else. Try again!');
  };

  const handleDragStart = (event, pieceId) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('pieceId', pieceId);
    }
    setSelectedPieceId(pieceId);
    playSound('pop');
  };

  const handleDrop = (event, slotIndex) => {
    event.preventDefault();
    const pieceId = event.dataTransfer
      ? event.dataTransfer.getData('pieceId')
      : selectedPieceId;
    if (pieceId) placePiece(pieceId, slotIndex);
  };

  const renderPieceContent = (row, col) => (
    <div
      className="puzzle-piece-content"
      style={{ background: theme.gradient }}
    >
      <span
        className="puzzle-piece-emoji"
        style={{
          transform: `translate(calc(${(-col / 3) * 100}% ), calc(${(-row / 3) * 100}% ))`,
        }}
      >
        {theme.emoji}
      </span>
    </div>
  );

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>{puzzle.title}</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div>{remaining} pieces left</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: '4rem' }}>{puzzle.completionEmoji}</div>
          <h2>{allLevelsComplete ? 'Jigsaw Champion!' : 'Level Complete!'}</h2>
          <p>{puzzle.completionMessage}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setGameWon(false);
                setAllLevelsComplete(false);
                loadLevel(1);
              }}
            >
              Play Again
            </button>
            <button className="btn" style={{ background: '#eee' }} onClick={() => { if (typeof onBack === 'function') onBack(); }}>
              Main Menu
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="puzzle-feedback">{feedback}</div>

          <div className="puzzle-board-container">
            <div className="puzzle-preview" style={{ background: theme.gradient }} aria-hidden="true">
              <span>{theme.emoji}</span>
            </div>

            <div className="puzzle-grid puzzle-grid-3">
              {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, slotIndex) => {
                const row = Math.floor(slotIndex / GRID_SIZE);
                const col = slotIndex % GRID_SIZE;
                const placedPieceId = board[slotIndex];
                const placedPiece = tray.find((item) => item.id === placedPieceId);

                return (
                  <div
                    key={slotIndex}
                    className={`puzzle-cell puzzle-drop-zone${placedPiece ? ' filled' : ''}${selectedPieceId && !placedPiece ? ' highlight' : ''}`}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => handleDrop(event, slotIndex)}
                    onClick={() => {
                      if (selectedPieceId) placePiece(selectedPieceId, slotIndex);
                    }}
                    aria-label={`Jigsaw slot row ${row + 1} column ${col + 1}`}
                  >
                    {placedPiece ? renderPieceContent(placedPiece.row, placedPiece.col) : (
                      <span className="puzzle-slot-hint">{row + 1},{col + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="puzzle-tray">
            {tray.filter((piece) => !piece.placed).map((piece) => (
              <div
                key={piece.id}
                className={`puzzle-piece draggable${selectedPieceId === piece.id ? ' selected' : ''}`}
                draggable
                onDragStart={(event) => handleDragStart(event, piece.id)}
                onClick={() => {
                  setSelectedPieceId((current) => (current === piece.id ? null : piece.id));
                  playSound('pop');
                  setFeedback('Tap a board slot to place the selected piece.');
                }}
                aria-label={`Jigsaw piece row ${piece.row + 1} column ${piece.col + 1}`}
              >
                {renderPieceContent(piece.row, piece.col)}
              </div>
            ))}
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

export default JigsawPuzzle;
