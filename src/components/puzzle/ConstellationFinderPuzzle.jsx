import { useState } from "react";
import { playSound } from "../../utils/sounds";
import { TOTAL_LEVELS, getConstellationLevel } from "./puzzle-utils";

// ===== Constellation Finder Puzzle =====
// Difficulty Tiers across 10 Levels:
// L1-3: Simple 3-4 star constellations (Big Dipper, Cassiopeia, Triangle), full star names labeled
// L4-6: Medium 5-6 star constellations (Orion's Belt, Cygnus, Leo), partial star outline hint
// L7-9: Complex 7-8 star constellations (Ursa Major, Scorpius, Pegasus), minimal hints
// L10 : Master 9+ star constellation (Dragon / Draco), night sky with distractor stars

const ConstellationFinderPuzzle = ({ puzzle, onBack }) => {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState(() => getConstellationLevel(1));
  const [selectedDots, setSelectedDots] = useState([]);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState("Tap the stars in sequence to connect the constellation!");
  const [gameWon, setGameWon] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);

  const loadLevel = (nextLevel) => {
    setLevel(nextLevel);
    const lvlData = getConstellationLevel(nextLevel);
    setData(lvlData);
    setSelectedDots([]);
    setSolved(false);
    setFeedback(`Find ${lvlData.constellationName}! Tap star #1 to begin.`);
  };

  const handleStarClick = (starId) => {
    if (solved) return;

    const expectedNextId = selectedDots.length + 1;

    if (starId === expectedNextId) {
      playSound("pop");
      const updated = [...selectedDots, starId];
      setSelectedDots(updated);

      if (updated.length === data.stars.length) {
        playSound("match");
        setSolved(true);
        setFeedback(data.successMsg || `Amazing! You revealed ${data.constellationName}! ✨`);

        if (level >= TOTAL_LEVELS) {
          setTimeout(() => {
            playSound("celebrate");
            setAllLevelsComplete(true);
            setGameWon(true);
          }, 1000);
        } else {
          setTimeout(() => {
            playSound("celebrate");
            loadLevel(level + 1);
          }, 1300);
        }
      } else {
        setFeedback(`Great! Next star is #${updated.length + 1}.`);
      }
    } else {
      playSound("wrong");
      setFeedback(`Oops! Star #${starId} is not the next star. You need star #${expectedNextId}!`);
    }
  };

  const handleReset = () => {
    playSound("pop");
    setGameWon(false);
    setAllLevelsComplete(false);
    loadLevel(1);
  };

  return (
    <div className="game-view pop-in">
      <div className="game-header">
        <div>{puzzle.title}</div>
        <div>Level {level} / {TOTAL_LEVELS}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(level / TOTAL_LEVELS) * 100}%` }} />
        </div>
      </div>

      {gameWon ? (
        <div className="champion-screen">
          <div style={{ fontSize: "4rem" }}>{puzzle.completionEmoji}</div>
          <h2>{allLevelsComplete ? "Stargazer Master! ✨" : "Level Complete!"}</h2>
          <p>{puzzle.completionMessage}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={handleReset}>Play Again</button>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === "function") onBack(); }}>Main Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="cf-header-card">
            <div className="cf-constellation-title">
              <span className="cf-emoji">{data.emoji}</span> {data.constellationName}
            </div>
            <div className="cf-hint-text">{data.hint}</div>
          </div>

          {feedback && (
            <div
              className="cf-feedback"
              style={{
                color: solved ? "var(--candy-green)" : selectedDots.length > 0 && !solved && feedback.includes("Oops") ? "var(--candy-red)" : "#7e57c2",
                background: solved ? "rgba(29,209,161,0.12)" : feedback.includes("Oops") ? "rgba(255,107,107,0.10)" : "rgba(126,87,194,0.10)",
                borderColor: solved ? "var(--candy-green)" : feedback.includes("Oops") ? "var(--candy-red)" : "#b39ddb",
              }}
            >
              {feedback}
            </div>
          )}

          {/* Night Sky Stargazing Board */}
          <div className="cf-sky-board">
            <svg className="cf-svg-canvas" viewBox="0 0 320 320">
              {/* Background ambient stars */}
              {data.ambientStars.map((amb, i) => (
                <circle key={`amb-${i}`} cx={amb.x} cy={amb.y} r={amb.r} fill="#ffffff" opacity={amb.opacity} />
              ))}

              {/* Connected Lines */}
              {selectedDots.map((dotId, idx) => {
                if (idx === 0) return null;
                const prevStar = data.stars.find((s) => s.id === selectedDots[idx - 1]);
                const currStar = data.stars.find((s) => s.id === dotId);
                return (
                  <line
                    key={`line-${idx}`}
                    x1={prevStar.x}
                    y1={prevStar.y}
                    x2={currStar.x}
                    y2={currStar.y}
                    stroke="#ffd54f"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                    className="cf-line-glow"
                  />
                );
              })}

              {/* Constellation Stars */}
              {data.stars.map((star) => {
                const isSelected = selectedDots.includes(star.id);
                const isNext = selectedDots.length + 1 === star.id;
                return (
                  <g
                    key={star.id}
                    onClick={() => handleStarClick(star.id)}
                    style={{ cursor: solved ? "default" : "pointer" }}
                  >
                    <circle
                      cx={star.x}
                      cy={star.y}
                      r={isSelected ? 14 : isNext ? 12 : 10}
                      fill={isSelected ? "#ffd54f" : isNext ? "#ffb74d" : "#7986cb"}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className={isNext ? "cf-star-pulse" : ""}
                    />
                    <text
                      x={star.x}
                      y={star.y + 4}
                      textAnchor="middle"
                      fill="#1a237e"
                      fontSize="10"
                      fontWeight="900"
                    >
                      {star.id}
                    </text>
                  </g>
                );
              })}
            </svg>

            {solved && (
              <div className="cf-reveal-badge pop-in">
                ✨ {data.constellationName} Completed! ✨
              </div>
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button className="btn btn-back" onClick={() => { if (typeof onBack === "function") onBack(); }}>
              Main Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ConstellationFinderPuzzle;
