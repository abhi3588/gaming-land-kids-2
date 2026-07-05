import { stories } from './components/stories/data/index.js';
import { storiesHindi } from './components/stories/data-hindi/index.js';

// ===== Stories Data =====
export { stories, storiesHindi };

// ===== Rhymes Data =====
const getPublicAssetUrl = (assetPath) => {
  const normalizedPath = assetPath.replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${normalizedPath}`;
};

export const rhymes = [
  {
    id: 'mycycle',
    title: 'My Cycle',
    icon: '🚲',
    color: 'memory',
    desc: 'Watch the fun ride!',
    videoUrl: getPublicAssetUrl('video/MyCycle.mp4')
  },
  {
    id: 'fingerstosnap',
    title: 'Fingers to Snap',
    icon: '🖐️',
    color: 'word',
    desc: 'Watch the fun finger snaps!',
    videoUrl: getPublicAssetUrl('video/FingersToSnap.mp4')
  },
  {
    id: 'mightyelephant',
    title: 'Mighty Elephant',
    icon: '🐘',
    color: 'memory',
    desc: 'Watch the mighty elephant stomp!',
    videoUrl: getPublicAssetUrl('video/MightyElephant.mp4')
  },
  {
    id: 'littleplant',
    title: 'Little Plant',
    icon: '🌱',
    color: 'patterns',
    desc: 'Watch the little plant grow!',
    videoUrl: getPublicAssetUrl('video/LittlePlant.mp4')
  },
  {
    id: 'beehive',
    title: 'Beehive',
    icon: '🐝',
    color: 'sorting',
    desc: 'Watch the buzzing beehive!',
    videoUrl: getPublicAssetUrl('video/Beehive.mp4')
  },
  {
    id: 'number12345',
    title: '12345',
    icon: '🔢',
    color: 'counting',
    desc: 'Count along from 1 to 5!',
    videoUrl: getPublicAssetUrl('video/12345.mp4')
  }
];

// ===== Fun Activity Data =====
// Hands-on activities that are different from the playable game components.
export const funActivities = [
  {
    id: 'rainbow-hunt',
    title: 'Rainbow Hunt',
    icon: '\u{1F308}',
    color: 'patterns',
    ageRange: '3-7',
    time: '10 min',
    desc: 'Find one safe object for each rainbow color.',
    materials: ['A basket or tray', 'Color cards or crayons'],
    steps: [
      'Pick a rainbow color.',
      'Find one object that matches it.',
      'Line up all objects in rainbow order.',
      'Say each color name out loud.'
    ]
  },
  {
    id: 'story-dice',
    title: 'Story Dice',
    icon: '\u{1F3B2}',
    color: 'word',
    ageRange: '4-10',
    time: '15 min',
    desc: 'Roll picture prompts and make a short story.',
    materials: ['Paper', 'Pencil or crayons', 'A regular dice'],
    steps: [
      'Draw six tiny pictures, one for each dice number.',
      'Roll the dice three times.',
      'Use the three pictures in a short story.',
      'Act out your favorite part.'
    ]
  },
  {
    id: 'shape-collage',
    title: 'Shape Collage',
    icon: '\u2702\uFE0F',
    color: 'shapefinder',
    ageRange: '3-8',
    time: '20 min',
    desc: 'Create a picture using cut paper shapes.',
    materials: ['Colored paper', 'Safety scissors', 'Glue stick'],
    steps: [
      'Cut circles, squares, triangles, and rectangles.',
      'Choose what you want to build.',
      'Arrange the shapes before gluing.',
      'Name every shape in your picture.'
    ]
  },
  {
    id: 'breathing-star',
    title: 'Breathing Star',
    icon: '\u2B50',
    color: 'counting',
    ageRange: '3-10',
    time: '5 min',
    desc: 'Trace a star while practicing calm breaths.',
    materials: ['Paper', 'Crayon or marker'],
    steps: [
      'Draw a big star.',
      'Trace up one side while breathing in.',
      'Trace down the next side while breathing out.',
      'Go around the star three times.'
    ]
  },
  {
    id: 'kitchen-band',
    title: 'Kitchen Band',
    icon: '\u{1F941}',
    color: 'rhymetime',
    ageRange: '3-9',
    time: '12 min',
    desc: 'Make soft rhythms using safe kitchen items.',
    materials: ['Spoons', 'Plastic bowls', 'Rice in a closed container'],
    steps: [
      'Choose three safe sound makers.',
      'Make a slow beat, then a fast beat.',
      'Copy each other in a rhythm round.',
      'Finish with a quiet ending sound.'
    ]
  },
  {
    id: 'kindness-coupons',
    title: 'Kindness Coupons',
    icon: '\u{1F48C}',
    color: 'sorting',
    ageRange: '5-10',
    time: '18 min',
    desc: 'Make small coupons for kind actions at home.',
    materials: ['Paper strips', 'Crayons', 'A small envelope'],
    steps: [
      'Cut paper into six small coupons.',
      'Write or draw one kind action on each.',
      'Decorate the coupons.',
      'Give one coupon to someone today.'
    ]
  }
];

// ===== Games Metadata =====
// (actual game components live in src/components/games/)
// This is used by the game grid in the Games tab.

export const gamesMeta = [
  // Ages 3-5 (preschool)
  { id: 'memory',    title: 'Ocean Match',    icon: '🐳', color: 'memory',   ageGroup: 'preschool', desc: 'Find matching sea friends!' },
  { id: 'sorting',   title: 'Fruit Sort',     icon: '🍎', color: 'sorting',  ageGroup: 'preschool', desc: 'Put fruits in correct bins!' },
  { id: 'patterns',  title: 'Pattern Train',  icon: '🚂', color: 'patterns', ageGroup: 'preschool', desc: 'Finish the train pattern!' },
  { id: 'counting',  title: 'Star Count',     icon: '⭐', color: 'counting', ageGroup: 'preschool', desc: 'Count and pop the stars!' },
  { id: 'colormatch',   title: 'Color Match',    icon: '🎨', color: 'patterns',     ageGroup: 'preschool', desc: 'Match the target color!' },
  { id: 'animalsounds', title: 'Animal Sounds',  icon: '🐶', color: 'animalsounds', ageGroup: 'preschool', desc: 'Tap the sound each animal makes!' },
  { id: 'shapefinder',  title: 'Shape Finder',   icon: '🔷', color: 'shapefinder',  ageGroup: 'preschool', desc: 'Find the matching shape!' },
  { id: 'oddoneout',    title: 'Odd One Out',     icon: '🐸', color: 'oddoneout',    ageGroup: 'preschool', desc: 'Tap the one that does not belong!' },
  { id: 'heropowermatch',  title: 'Hero Power Match',  icon: '⚡', color: 'heropowermatch',  ageGroup: 'preschool', desc: 'Match each hero to their superpower!' },
  { id: 'savethecity',    title: 'Save the City',     icon: '🏙️', color: 'savethecity',    ageGroup: 'preschool', desc: 'Pick the right hero to save the day!' },
  { id: 'whatcomesnext',  title: 'What Comes Next?',  icon: '🔮', color: 'whatcomesnext',  ageGroup: 'preschool', desc: 'Spot the pattern and pick what comes next!' },
  { id: 'bigorsmall',     title: 'Big or Small?',     icon: '📏', color: 'bigorsmall',     ageGroup: 'preschool', desc: 'Which one is bigger or smaller?' },
  { id: 'alphabetmatch',  title: 'Alphabet Match',    icon: '🔠', color: 'word',           ageGroup: 'preschool', desc: 'Match the uppercase letter to the lowercase!' },
  { id: 'fruitfinder',    title: 'Fruit Finder',      icon: '🍎', color: 'sorting',        ageGroup: 'preschool', desc: 'Find the hidden fruit!' },
  { id: 'shadowmatch',    title: 'Shadow Match',      icon: '👤', color: 'shadowmatch',    ageGroup: 'preschool', desc: 'Find the shadow that matches!' },
  { id: 'oppositematch',  title: 'Opposite Match',    icon: '🔄', color: 'oppositematch',  ageGroup: 'preschool', desc: 'Pick the opposite word!' },
  { id: 'numbermatch',    title: 'Number Match',      icon: '🔢', color: 'counting',        ageGroup: 'preschool', desc: 'Match the number to the dots!' },
  { id: 'missingnumber',  title: 'Missing Number',    icon: '❓', color: 'patterns',        ageGroup: 'preschool', desc: 'Find the missing number in the sequence!' },

  // Ages 6-10 (junior)
  { id: 'herospellquest', title: 'Hero Spell Quest', icon: '🦸', color: 'herospellquest', ageGroup: 'junior', desc: 'Spell superhero names letter by letter!' },
  { id: 'herotrivia',    title: 'Hero Trivia',      icon: '🧠', color: 'herotrivia',    ageGroup: 'junior', desc: 'How well do you know your superheroes?' },
  { id: 'rhymetime',     title: 'Rhyme Time',       icon: '🎵', color: 'rhymetime',     ageGroup: 'junior', desc: 'Find the word that rhymes!' },
  { id: 'mathninja',     title: 'Math Ninja',       icon: '🥷', color: 'mathninja',     ageGroup: 'junior', desc: 'Solve as many sums as you can in 60 seconds!' },
  { id: 'math',         title: 'Math Quest',     icon: '🎈', color: 'math',         ageGroup: 'junior',    desc: 'Solve math equations to pop balloons!' },
  { id: 'word',         title: 'Word Builder',   icon: '✏️', color: 'word',         ageGroup: 'junior',    desc: 'Spell words for cute emojis!' },
  { id: 'sudoku',       title: 'Shape Sudoku',   icon: '🧩', color: 'sudoku',       ageGroup: 'junior',    desc: 'Solve logic animal grids!' },
  { id: 'sumpairs',     title: 'Sum Pairs',      icon: '🔢', color: 'math',         ageGroup: 'junior',    desc: 'Pick two tiles that add up to the target!' },
  { id: 'sequence',     title: 'Spark Sequence', icon: '⚡', color: 'sequence',     ageGroup: 'junior',    desc: 'Repeat the light & sound patterns!' },
  { id: 'wordscramble', title: 'Word Scramble',  icon: '🔤', color: 'wordscramble', ageGroup: 'junior',    desc: 'Unscramble the letters to find the word!' },
  { id: 'memorymatrix', title: 'Memory Matrix',  icon: '🧠', color: 'memory',       ageGroup: 'junior',    desc: 'Memorize the lit tiles on the grid!' },
  { id: 'operatorquest',title: 'Operator Quest', icon: '➕', color: 'math',         ageGroup: 'junior',    desc: 'Find the missing math sign!' },
];
