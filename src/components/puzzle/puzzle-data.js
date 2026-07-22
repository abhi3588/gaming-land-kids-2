import JigsawPuzzle from './JigsawPuzzle.jsx';
import SlidePuzzle from './SlidePuzzle.jsx';
import ConnectDotsPuzzle from './ConnectDotsPuzzle.jsx';
import MazePuzzle from './MazePuzzle.jsx';
import SpotDifferencePuzzle from './SpotDifferencePuzzle.jsx';
import ShapeFitPuzzle from './ShapeFitPuzzle.jsx';
import ColorSortPuzzle from './ColorSortPuzzle.jsx';
import MemoryMatchPuzzle from './MemoryMatchPuzzle.jsx';
import ShadowMatchPuzzle from './ShadowMatchPuzzle.jsx';
import PatternSequencePuzzle from './PatternSequencePuzzle.jsx';
import WordSearchPuzzle from './WordSearchPuzzle.jsx';
import PipeConnectorPuzzle from './PipeConnectorPuzzle.jsx';
import CodingQuestPuzzle from './CodingQuestPuzzle.jsx';
import ScaleBalancePuzzle from './ScaleBalancePuzzle.jsx';

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
  {
    id: 'color-sort',
    title: 'Color Sort',
    icon: '🎨',
    color: 'sequence',
    ageRange: '4–9',
    desc: 'Pour the balls until each tube holds just one colour!',
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    icon: '🃏',
    color: 'math',
    ageRange: '3–8',
    desc: 'Flip the cards and find the matching pairs!',
  },
  {
    id: 'shadow-match',
    title: 'Shadow Match',
    icon: '👤',
    color: 'sorting',
    ageRange: '3–7',
    desc: 'Match the colourful toys to their dark shadows!',
  },
  {
    id: 'pattern-sequence',
    title: 'Pattern Sequence',
    icon: '🔀',
    color: 'patterns',
    ageRange: '4–8',
    desc: 'Find out what comes next in the patterns!',
  },
  {
    id: 'word-search',
    title: 'Emoji Word Search',
    icon: '🔎',
    color: 'word',
    ageRange: '4–9',
    desc: 'Find the hidden words matching the friendly emojis!',
  },
  {
    id: 'pipe-connector',
    title: 'Pipe Connector',
    icon: '🔧',
    color: 'sequence',
    ageRange: '4–9',
    desc: 'Rotate the pipes to help water flow to the flower!',
  },
  {
    id: 'coding-quest',
    title: 'Robot Coding Quest',
    icon: '🤖',
    color: 'sequence',
    ageRange: '5–10',
    desc: 'Code the arrow sequences to guide the robot to the star!',
  },
  {
    id: 'scale-balance',
    title: 'Scale Balance',
    icon: '⚖️',
    color: 'math',
    ageRange: '4–9',
    desc: 'Find the right weight or emoji to balance the scales perfectly!',
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
  'color-sort': {
    title: 'Color Sort',
    completionEmoji: '🎨',
    completionMessage: 'Colour genius! Every tube is perfectly sorted!',
    component: ColorSortPuzzle,
  },
  'memory-match': {
    title: 'Memory Match',
    completionEmoji: '🃏',
    completionMessage: 'Memory master! You found every matching pair!',
    component: MemoryMatchPuzzle,
  },
  'shadow-match': {
    title: 'Shadow Match',
    completionEmoji: '👤',
    completionMessage: 'Shadow sleuth! You matched every toy to its shadow!',
    component: ShadowMatchPuzzle,
  },
  'pattern-sequence': {
    title: 'Pattern Sequence',
    completionEmoji: '🔀',
    completionMessage: 'Pattern pro! You cracked every sequence!',
    component: PatternSequencePuzzle,
  },
  'word-search': {
    title: 'Emoji Word Search',
    completionEmoji: '🔎',
    completionMessage: 'Word wizard! You spotted every hidden word!',
    component: WordSearchPuzzle,
  },
  'pipe-connector': {
    title: 'Pipe Connector',
    completionEmoji: '🔧',
    completionMessage: 'Plumbing pro! You watered every flower!',
    component: PipeConnectorPuzzle,
  },
  'coding-quest': {
    title: 'Robot Coding Quest',
    completionEmoji: '🤖',
    completionMessage: 'Coding Master! You guided the robot safely home!',
    component: CodingQuestPuzzle,
  },
  'scale-balance': {
    title: 'Scale Balance',
    completionEmoji: '⚖️',
    completionMessage: 'Balance Champion! You matched every weight perfectly!',
    component: ScaleBalancePuzzle,
  },
};
