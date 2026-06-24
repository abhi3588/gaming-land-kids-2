import { useState } from 'react';
import MemoryGame from './components/games/MemoryGame';
import SortingGame from './components/games/SortingGame';
import PatternGame from './components/games/PatternGame';
import CountingGame from './components/games/CountingGame';
import MathQuest from './components/games/MathQuest';
import WordBuilder from './components/games/WordBuilder';
import ShapeSudoku from './components/games/ShapeSudoku';
import SparkSequence from './components/games/SparkSequence';
import ColorMatch from './components/games/ColorMatch';
import SumPairs from './components/games/SumPairs';
import ErrorBoundary from './components/ErrorBoundary';
import { playSound } from './utils/sounds';

const generateBubblesList = () => 
  Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    width: Math.random() * 100 + 50,
    height: Math.random() * 100 + 50,
    left: Math.random() * 100,
    delay: Math.random() * 20,
    duration: Math.random() * 10 + 10
  }));

function App() {
  const [currentGame, setCurrentGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('preschool'); // 'preschool' (3-5) or 'junior' (6-10)
  const [bubbles] = useState(generateBubblesList);

  const games = [
    // Ages 3-5
    { id: 'memory', title: 'Ocean Match', icon: '🐳', component: MemoryGame, color: 'memory', ageGroup: 'preschool', desc: 'Find matching sea friends!' },
    { id: 'sorting', title: 'Fruit Sort', icon: '🍎', component: SortingGame, color: 'sorting', ageGroup: 'preschool', desc: 'Put fruits in correct bins!' },
    { id: 'patterns', title: 'Pattern Train', icon: '🚂', component: PatternGame, color: 'patterns', ageGroup: 'preschool', desc: 'Finish the train pattern!' },
    { id: 'counting', title: 'Star Count', icon: '⭐', component: CountingGame, color: 'counting', ageGroup: 'preschool', desc: 'Count and pop the stars!' },
    { id: 'colormatch', title: 'Color Match', icon: '🎨', component: ColorMatch, color: 'patterns', ageGroup: 'preschool', desc: 'Match the target color!' },
    
    // Ages 6-10
    { id: 'math', title: 'Math Quest', icon: '🎈', component: MathQuest, color: 'math', ageGroup: 'junior', desc: 'Solve math equations to pop balloons!' },
    { id: 'word', title: 'Word Builder', icon: '✏️', component: WordBuilder, color: 'word', ageGroup: 'junior', desc: 'Spell words for cute emojis!' },
    { id: 'sudoku', title: 'Shape Sudoku', icon: '🧩', component: ShapeSudoku, color: 'sudoku', ageGroup: 'junior', desc: 'Solve logic animal grids!' },
    { id: 'sumpairs', title: 'Sum Pairs', icon: '🔢', component: SumPairs, color: 'math', ageGroup: 'junior', desc: 'Pick two tiles that add up to the target!' },
    { id: 'sequence', title: 'Spark Sequence', icon: '⚡', component: SparkSequence, color: 'sequence', ageGroup: 'junior', desc: 'Repeat the light & sound patterns!' }
  ];

  const handleGameSelect = (gameId) => {
    playSound('pop');
    setCurrentGame(gameId);
  };

  const handleCategorySelect = (category) => {
    playSound('pop');
    setActiveCategory(category);
  };

  const renderGame = () => {
    const game = games.find(g => g.id === currentGame);
    if (!game) return null;
    const GameComponent = game.component;
    return (
      <ErrorBoundary onBack={() => setCurrentGame(null)}>
        <GameComponent onBack={() => setCurrentGame(null)} />
      </ErrorBoundary>
    );
  };

  const filteredGames = games.filter(g => g.ageGroup === activeCategory);

  return (
    <div className="app">
      <div className="bg-bubbles">
        {bubbles.map((b) => (
          <div 
            key={b.id} 
            className="bubble" 
            style={{
              width: `${b.width}px`,
              height: `${b.height}px`,
              left: `${b.left}%`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`
            }}
          />
        ))}
      </div>

      <header>
        <h1>Gaming Land Kids</h1>
        <p>Fun games to help you grow! 🌈</p>
      </header>

      <main className="app-container">
        {!currentGame ? (
          <>
            {/* Age Category Selector */}
            <div className="category-container pop-in">
              <div className="category-tabs">
                <button
                  className={`category-tab ${activeCategory === 'preschool' ? 'active' : ''}`}
                  onClick={() => handleCategorySelect('preschool')}
                >
                  👶 Little Explorers (Ages 3-5)
                </button>
                <button
                  className={`category-tab ${activeCategory === 'junior' ? 'active' : ''}`}
                  onClick={() => handleCategorySelect('junior')}
                >
                  🧠 Junior Genius (Ages 6-10)
                </button>
              </div>
            </div>

            {/* Games Grid */}
            <div className="game-grid pop-in">
              {filteredGames.map((game) => (
                <div 
                  key={game.id} 
                  className={`game-card ${game.color}`}
                  onClick={() => handleGameSelect(game.id)}
                >
                  <div className="game-icon">{game.icon}</div>
                  <h2>{game.title}</h2>
                  <p>{game.desc}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          renderGame()
        )}
      </main>
    </div>
  );
}

export default App;
