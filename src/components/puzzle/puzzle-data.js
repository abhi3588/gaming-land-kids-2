import JigsawPuzzle from './JigsawPuzzle.jsx';
import SlidePuzzle from './SlidePuzzle.jsx';
import ConnectDotsPuzzle from './ConnectDotsPuzzle.jsx';
import MazePuzzle from './MazePuzzle.jsx';
import SpotDifferencePuzzle from './SpotDifferencePuzzle.jsx';
import ShapeFitPuzzle from './ShapeFitPuzzle.jsx';

export const PUZZLE_CATEGORIES = [
  {
    id: 'jigsaw-animals',
    title: 'Animal Jigsaw',
    icon: '🧩',
    color: 'sudoku',
    ageRange: '4–8',
    desc: 'Drag the pieces to reveal a friendly animal picture!',
  },
  {
    id: 'slide-picture',
    title: 'Slide Picture',
    icon: '🖼️',
    color: 'patterns',
    ageRange: '5–10',
    desc: 'Slide the tiles until the picture shines again!',
  },
  {
    id: 'connect-dots',
    title: 'Connect the Dots',
    icon: '✏️',
    color: 'memory',
    ageRange: '3–6',
    desc: 'Tap the dots in order to reveal a happy surprise!',
  },
  {
    id: 'maze-adventure',
    title: 'Maze Adventure',
    icon: '🗺️',
    color: 'sorting',
    ageRange: '4–8',
    desc: 'Guide the explorer to the treasure with smart turns!',
  },
  {
    id: 'spot-difference',
    title: 'Spot the Difference',
    icon: '🔍',
    color: 'word',
    ageRange: '4–9',
    desc: 'Spot the tiny changes hidden between two cheerful scenes!',
  },
  {
    id: 'shape-fit',
    title: 'Shape Fit',
    icon: '🔷',
    color: 'counting',
    ageRange: '3–7',
    desc: 'Match each shape to its perfect home and watch it click!',
  },
];

export const PUZZLE_DATA = {
  'jigsaw-animals': {
    title: 'Animal Jigsaw',
    completionEmoji: '🧩',
    completionMessage: 'You completed the jigsaw! Amazing eye for detail!',
    component: JigsawPuzzle,
  },
  'slide-picture': {
    title: 'Slide Picture',
    completionEmoji: '🖼️',
    completionMessage: 'Picture perfect! You solved every slide puzzle!',
    component: SlidePuzzle,
  },
  'connect-dots': {
    title: 'Connect the Dots',
    completionEmoji: '✏️',
    completionMessage: 'Dot-to-dot champion! What a beautiful reveal!',
    component: ConnectDotsPuzzle,
  },
  'maze-adventure': {
    title: 'Maze Adventure',
    completionEmoji: '🗺️',
    completionMessage: 'Maze master! You found every treasure path!',
    component: MazePuzzle,
  },
  'spot-difference': {
    title: 'Spot the Difference',
    completionEmoji: '🔍',
    completionMessage: 'Super spotter! Nothing gets past your eyes!',
    component: SpotDifferencePuzzle,
  },
  'shape-fit': {
    title: 'Shape Fit',
    completionEmoji: '🔷',
    completionMessage: 'Shape superstar! Every piece fits perfectly!',
    component: ShapeFitPuzzle,
  },
};
