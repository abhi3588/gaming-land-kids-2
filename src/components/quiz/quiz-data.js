// ===== Quiz Data =====

export const QUIZ_CATEGORIES = [
  {
    id: 'fruits',
    title: 'Fruits',
    icon: '🍎',
    color: 'sorting',
    desc: 'Name fruits from their picture! A juicy challenge for little learners.',
    ageRange: '3–8'
  },
  {
    id: 'flowers',
    title: 'Flowers',
    icon: '🌸',
    color: 'patterns',
    desc: 'Identify beautiful flowers from around the world!',
    ageRange: '4–9'
  },
  {
    id: 'shapes',
    title: 'Shapes',
    icon: '⭐',
    color: 'word',
    desc: 'Match shapes to their names — from circles to hexagons!',
    ageRange: '3–7'
  },
  {
    id: 'animals',
    title: 'Animals',
    icon: '🦁',
    color: 'memory',
    desc: 'Can you name all these wonderful animals? Let\'s find out!',
    ageRange: '3–8'
  }
];

export const QUIZ_DATA = {
  fruits: {
    title: 'Fruit Quiz',
    completionEmoji: '🍎',
    completionMessage: 'You know your fruits so well! 🍉',
    questions: [
      { id: 'apple', emoji: '🍎', question: 'What fruit is this?', answer: 'Apple', options: ['Tomato', 'Apple', 'Cherry', 'Strawberry'] },
      { id: 'banana', emoji: '🍌', question: 'What fruit is this?', answer: 'Banana', options: ['Mango', 'Corn', 'Banana', 'Lemon'] },
      { id: 'grapes', emoji: '🍇', question: 'What fruit is this?', answer: 'Grapes', options: ['Blueberry', 'Grapes', 'Cherry', 'Plum'] },
      { id: 'strawberry', emoji: '🍓', question: 'What fruit is this?', answer: 'Strawberry', options: ['Strawberry', 'Raspberry', 'Cherry', 'Apple'] },
      { id: 'orange', emoji: '🍊', question: 'What fruit is this?', answer: 'Orange', options: ['Peach', 'Apricot', 'Orange', 'Mango'] },
      { id: 'pineapple', emoji: '🍍', question: 'What fruit is this?', answer: 'Pineapple', options: ['Cactus', 'Coconut', 'Artichoke', 'Pineapple'] },
      { id: 'watermelon', emoji: '🍉', question: 'What fruit is this?', answer: 'Watermelon', options: ['Melon', 'Watermelon', 'Cucumber', 'Papaya'] },
      { id: 'mango', emoji: '🥭', question: 'What fruit is this?', answer: 'Mango', options: ['Papaya', 'Peach', 'Mango', 'Guava'] },
      { id: 'cherry', emoji: '🍒', question: 'What fruit is this?', answer: 'Cherry', options: ['Cherry', 'Strawberry', 'Cranberry', 'Plum'] },
      { id: 'kiwi', emoji: '🥝', question: 'What fruit is this?', answer: 'Kiwi', options: ['Avocado', 'Lime', 'Kiwi', 'Fig'] }
    ]
  },
  flowers: {
    title: 'Flower Quiz',
    completionEmoji: '🌸',
    completionMessage: 'You have a green thumb! 🌻',
    questions: [
      { id: 'rose', emoji: '🌹', question: 'Which flower is this?', answer: 'Rose', options: ['Poppy', 'Rose', 'Tulip', 'Peony'] },
      { id: 'sunflower', emoji: '🌻', question: 'Which flower is this?', answer: 'Sunflower', options: ['Daisy', 'Marigold', 'Sunflower', 'Dandelion'] },
      { id: 'tulip', emoji: '🌷', question: 'Which flower is this?', answer: 'Tulip', options: ['Lily', 'Orchid', 'Crocus', 'Tulip'] },
      { id: 'lotus', emoji: '🪷', question: 'Which flower is this?', answer: 'Lotus', options: ['Lotus', 'Lily', 'Water Lily', 'Jasmine'] },
      { id: 'hibiscus', emoji: '🌺', question: 'Which flower is this?', answer: 'Hibiscus', options: ['Bougainvillea', 'Hibiscus', 'Dahlia', 'Petunia'] },
      { id: 'blossom', emoji: '🌸', question: 'Which flower is this?', answer: 'Cherry Blossom', options: ['Jasmine', 'Magnolia', 'Cherry Blossom', 'Almond Blossom'] },
      { id: 'bouquet', emoji: '💐', question: 'What do we call a bunch of flowers?', answer: 'Bouquet', options: ['Wreath', 'Garland', 'Bouquet', 'Bunch'] },
      { id: 'daisy', emoji: '🌼', question: 'Which flower is this?', answer: 'Daisy', options: ['Chamomile', 'Daisy', 'Aster', 'Marigold'] },
      { id: 'herb', emoji: '🌿', question: 'What do we call sweet-smelling plants used in cooking?', answer: 'Herbs', options: ['Spices', 'Herbs', 'Weeds', 'Ferns'] },
      { id: 'seed', emoji: '🌱', question: 'How does a flower start its life?', answer: 'As a Seed', options: ['As a Leaf', 'As a Fruit', 'As a Stem', 'As a Seed'] }
    ]
  },
  shapes: {
    title: 'Shapes Quiz',
    completionEmoji: '⭐',
    completionMessage: 'You\'re a shapes master! 🔷',
    questions: [
      { id: 'circle', emoji: '⭕', question: 'What shape is this?', answer: 'Circle', options: ['Oval', 'Sphere', 'Circle', 'Ring'] },
      { id: 'square', emoji: '🟥', question: 'What shape has 4 equal sides?', answer: 'Square', options: ['Rectangle', 'Square', 'Rhombus', 'Trapezoid'] },
      { id: 'triangle', emoji: '🔺', question: 'What shape has 3 sides?', answer: 'Triangle', options: ['Pentagon', 'Triangle', 'Diamond', 'Hexagon'] },
      { id: 'hexagon', emoji: '⬡', question: 'A beehive cell is shaped like this. What shape?', answer: 'Hexagon', options: ['Octagon', 'Pentagon', 'Heptagon', 'Hexagon'] },
      { id: 'star', emoji: '⭐', question: 'What shape is this?', answer: 'Star', options: ['Sun', 'Cross', 'Star', 'Asterisk'] },
      { id: 'heart', emoji: '❤️', question: 'What shape is this?', answer: 'Heart', options: ['Diamond', 'Leaf', 'Heart', 'Shield'] },
      { id: 'octagon', emoji: '🔷', question: 'A stop sign is this shape. What is it?', answer: 'Octagon', options: ['Hexagon', 'Pentagon', 'Decagon', 'Octagon'] },
      { id: 'oval', emoji: '🥚', question: 'An egg is this shape. What do we call it?', answer: 'Oval', options: ['Circle', 'Oval', 'Sphere', 'Ellipse'] },
      { id: 'diamond', emoji: '💎', question: 'What shape is this?', answer: 'Diamond', options: ['Square', 'Rhombus', 'Diamond', 'Kite'] },
      { id: 'rectangle', emoji: '🟦', question: 'A door is shaped like this. What shape?', answer: 'Rectangle', options: ['Square', 'Rectangle', 'Parallelogram', 'Trapezoid'] }
    ]
  },
  animals: {
    title: 'Animal Quiz',
    completionEmoji: '🦁',
    completionMessage: 'You\'re a wildlife expert! 🐼',
    questions: [
      { id: 'lion', emoji: '🦁', question: 'Which animal is known as the King of the Jungle?', answer: 'Lion', options: ['Tiger', 'Leopard', 'Lion', 'Cheetah'] },
      { id: 'elephant', emoji: '🐘', question: 'Which is the largest land animal?', answer: 'Elephant', options: ['Rhinoceros', 'Hippopotamus', 'Elephant', 'Giraffe'] },
      { id: 'giraffe', emoji: '🦒', question: 'Which animal has the longest neck?', answer: 'Giraffe', options: ['Camel', 'Giraffe', 'Ostrich', 'Horse'] },
      { id: 'monkey', emoji: '🐒', question: 'Which animal loves to swing on trees?', answer: 'Monkey', options: ['Squirrel', 'Monkey', 'Sloth', 'Koala'] },
      { id: 'dog', emoji: '🐶', question: 'Which animal is known as man\'s best friend?', answer: 'Dog', options: ['Cat', 'Rabbit', 'Dog', 'Fox'] },
      { id: 'dolphin', emoji: '🐬', question: 'Which smart sea animal can jump out of water?', answer: 'Dolphin', options: ['Shark', 'Whale', 'Seal', 'Dolphin'] },
      { id: 'panda', emoji: '🐼', question: 'This black-and-white bear loves bamboo. What is it?', answer: 'Panda', options: ['Raccoon', 'Badger', 'Panda', 'Skunk'] },
      { id: 'frog', emoji: '🐸', question: 'Which animal starts life as a tadpole?', answer: 'Frog', options: ['Toad', 'Frog', 'Salamander', 'Newt'] },
      { id: 'penguin', emoji: '🐧', question: 'Which bird cannot fly but loves to swim in cold places?', answer: 'Penguin', options: ['Ostrich', 'Penguin', 'Emu', 'Kiwi'] },
      { id: 'butterfly', emoji: '🦋', question: 'Which beautiful insect starts life as a caterpillar?', answer: 'Butterfly', options: ['Moth', 'Dragonfly', 'Bee', 'Butterfly'] }
    ]
  }
};
