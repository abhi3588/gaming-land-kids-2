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
  },
  {
    id: 'colors',
    title: 'Colors',
    icon: '🎨',
    color: 'patterns',
    desc: 'Match colors to cute objects and name them correctly!',
    ageRange: '3–6'
  },
  {
    id: 'vehicles',
    title: 'Vehicles',
    icon: '🚗',
    color: 'counting',
    desc: 'Identify different vehicles and modes of transport!',
    ageRange: '3–8'
  },
  {
    id: 'birds',
    title: 'Birds',
    icon: '🐦',
    color: 'sky',
    desc: 'Spot and name amazing birds — from tiny chicks to proud peacocks!',
    ageRange: '3–8'
  },
  {
    id: 'vegetables',
    title: 'Vegetables',
    icon: '🥕',
    color: 'garden',
    desc: 'Name healthy veggies — from crunchy carrots to leafy greens!',
    ageRange: '3–9'
  },
  {
    id: 'insects',
    title: 'Insects',
    icon: '🐞',
    color: 'garden',
    desc: 'Identify buzzy bugs and creepy-crawlies!',
    ageRange: '3–8'
  },
  {
    id: 'space',
    title: 'Space',
    icon: '🚀',
    color: 'sky',
    desc: 'Explore rockets, planets, and stars far away!',
    ageRange: '3–9'
  },
  {
    id: 'dinosaurs',
    title: 'Dinosaur Quiz',
    icon: '🦖',
    color: 'sorting',
    desc: 'Rawr! Name and spot these prehistoric giant creatures!',
    ageRange: '4–9'
  },
  {
    id: 'sea-creatures',
    title: 'Sea Creatures',
    icon: '🐙',
    color: 'sky',
    desc: 'Dive deep under the sea and find sharks, crabs, and whales!',
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
  },
  colors: {
    title: 'Colors Quiz',
    completionEmoji: '🎨',
    completionMessage: 'You\'re a color genius! 🌈',
    questions: [
      { id: 'red', emoji: '🍒', question: 'What color is this sweet cherry?', answer: 'Red', options: ['Blue', 'Green', 'Red', 'Yellow'] },
      { id: 'yellow', emoji: '🍌', question: 'What color is this ripe banana?', answer: 'Yellow', options: ['Purple', 'Yellow', 'Pink', 'Orange'] },
      { id: 'blue', emoji: '🐳', question: 'What color is this friendly whale?', answer: 'Blue', options: ['Green', 'Brown', 'Black', 'Blue'] },
      { id: 'green', emoji: '🐸', question: 'What color is this jumping frog?', answer: 'Green', options: ['Red', 'Orange', 'Green', 'White'] },
      { id: 'orange', emoji: '🍊', question: 'What color is this juicy orange?', answer: 'Orange', options: ['Yellow', 'Orange', 'Pink', 'Purple'] },
      { id: 'pink', emoji: '🦩', question: 'What color is this tall flamingo?', answer: 'Pink', options: ['Pink', 'Blue', 'Green', 'Brown'] },
      { id: 'purple', emoji: '🍇', question: 'What color are these sweet grapes?', answer: 'Purple', options: ['White', 'Yellow', 'Purple', 'Red'] },
      { id: 'brown', emoji: '🐻', question: 'What color is this cute teddy bear?', answer: 'Brown', options: ['Blue', 'Black', 'Orange', 'Brown'] },
      { id: 'white', emoji: '☃️', question: 'What color is this cold snowman?', answer: 'White', options: ['Green', 'White', 'Purple', 'Pink'] },
      { id: 'black', emoji: '🐈‍⬛', question: 'What color is this little cat?', answer: 'Black', options: ['Red', 'Yellow', 'Blue', 'Black'] }
    ]
  },
  vehicles: {
    title: 'Vehicles Quiz',
    completionEmoji: '🚗',
    completionMessage: 'You\'re a transportation expert! 🚀',
    questions: [
      { id: 'car', emoji: '🚗', question: 'What vehicle is this that drives on roads?', answer: 'Car', options: ['Bicycle', 'Train', 'Car', 'Boat'] },
      { id: 'airplane', emoji: '✈️', question: 'What vehicle flies high up in the sky?', answer: 'Airplane', options: ['Ship', 'Helicopter', 'Tractor', 'Airplane'] },
      { id: 'train', emoji: '🚂', question: 'What vehicle travels on tracks and goes choo-choo?', answer: 'Train', options: ['Train', 'Car', 'Bus', 'Submarine'] },
      { id: 'ship', emoji: '🚢', question: 'What large vehicle travels across deep oceans?', answer: 'Ship', options: ['Rocket', 'Bicycle', 'Ship', 'Helicopter'] },
      { id: 'bicycle', emoji: '🚲', question: 'What vehicle has two wheels and pedaling pedals?', answer: 'Bicycle', options: ['Motorcycle', 'Bicycle', 'Car', 'Train'] },
      { id: 'helicopter', emoji: '🚁', question: 'What vehicle flies using spinning blades on top?', answer: 'Helicopter', options: ['Airplane', 'Hot Air Balloon', 'Rocket', 'Helicopter'] },
      { id: 'rocket', emoji: '🚀', question: 'What powerful vehicle travels into outer space?', answer: 'Rocket', options: ['Submarine', 'Rocket', 'Train', 'Bus'] },
      { id: 'fireengine', emoji: '🚒', question: 'What red vehicle helps firefighters put out fires?', answer: 'Fire Engine', options: ['Ambulance', 'Police Car', 'Fire Engine', 'Tractor'] },
      { id: 'schoolbus', emoji: '🚌', question: 'What yellow vehicle takes children to school?', answer: 'School Bus', options: ['School Bus', 'Truck', 'Airplane', 'Car'] },
      { id: 'tractor', emoji: '🚜', question: 'What vehicle does a farmer use on a field?', answer: 'Tractor', options: ['Bicycle', 'Boat', 'Submarine', 'Tractor'] }
    ]
  },
  birds: {
    title: 'Bird Quiz',
    completionEmoji: '🐦',
    completionMessage: 'You\'re a bird expert! 🦉',
    questions: [
      { id: 'bird', emoji: '🐦', question: 'Which animal has feathers and can fly?', answer: 'Bird', options: ['Bird', 'Bat', 'Bee', 'Butterfly'] },
      { id: 'eagle', emoji: '🦅', question: 'Which bird is known as the king of the sky?', answer: 'Eagle', options: ['Hawk', 'Crow', 'Eagle', 'Owl'] },
      { id: 'owl', emoji: '🦉', question: 'Which bird is awake at night and calls "hoot"?', answer: 'Owl', options: ['Parrot', 'Duck', 'Owl', 'Sparrow'] },
      { id: 'parrot', emoji: '🦜', question: 'Which colorful bird can copy your words?', answer: 'Parrot', options: ['Crow', 'Pigeon', 'Robin', 'Parrot'] },
      { id: 'duck', emoji: '🦆', question: 'Which bird says "quack"?', answer: 'Duck', options: ['Goose', 'Duck', 'Swan', 'Heron'] },
      { id: 'swan', emoji: '🦢', question: 'Which graceful white bird glides on lakes?', answer: 'Swan', options: ['Swan', 'Goose', 'Crane', 'Pelican'] },
      { id: 'chick', emoji: '🐤', question: 'What do we call a baby chicken?', answer: 'Chick', options: ['Duckling', 'Chick', 'Cygnet', 'Kitten'] },
      { id: 'goose', emoji: '🪿', question: 'Which bird flies in a V and says "honk"?', answer: 'Goose', options: ['Duck', 'Swan', 'Goose', 'Crow'] },
      { id: 'rooster', emoji: '🐓', question: 'Which bird wakes us with "cock-a-doodle-doo"?', answer: 'Rooster', options: ['Hen', 'Turkey', 'Rooster', 'Peacock'] },
      { id: 'peacock', emoji: '🦚', question: 'Which bird shows off a big fan of feathers?', answer: 'Peacock', options: ['Turkey', 'Pheasant', 'Ostrich', 'Peacock'] }
    ]
  },
  vegetables: {
    title: 'Vegetable Quiz',
    completionEmoji: '🥕',
    completionMessage: 'You eat your veggies like a pro! 🥦',
    questions: [
      { id: 'carrot', emoji: '🥕', question: 'Which vegetable is long and orange?', answer: 'Carrot', options: ['Radish', 'Carrot', 'Corn', 'Banana'] },
      { id: 'broccoli', emoji: '🥦', question: 'Which green vegetable looks like tiny trees?', answer: 'Broccoli', options: ['Broccoli', 'Cabbage', 'Lettuce', 'Spinach'] },
      { id: 'tomato', emoji: '🍅', question: 'Which red vegetable is often called a fruit?', answer: 'Tomato', options: ['Apple', 'Tomato', 'Pepper', 'Cherry'] },
      { id: 'cucumber', emoji: '🥒', question: 'Which green vegetable is pickled into pickles?', answer: 'Cucumber', options: ['Zucchini', 'Celery', 'Cucumber', 'Bean'] },
      { id: 'corn', emoji: '🌽', question: 'Which yellow vegetable do we eat at a barbecue?', answer: 'Corn', options: ['Corn', 'Carrot', 'Potato', 'Pea'] },
      { id: 'potato', emoji: '🥔', question: 'Which brown vegetable grows underground?', answer: 'Potato', options: ['Onion', 'Potato', 'Turnip', 'Radish'] },
      { id: 'onion', emoji: '🧅', question: 'Which vegetable makes you cry when you cut it?', answer: 'Onion', options: ['Garlic', 'Leek', 'Onion', 'Shallot'] },
      { id: 'lettuce', emoji: '🥬', question: 'Which leafy green vegetable goes in salads?', answer: 'Lettuce', options: ['Cabbage', 'Spinach', 'Lettuce', 'Kale'] },
      { id: 'pepper', emoji: '🫑', question: 'Which vegetable can be green, red, or yellow and is crunchy?', answer: 'Pepper', options: ['Chili', 'Pepper', 'Tomato', 'Carrot'] },
      { id: 'eggplant', emoji: '🍆', question: 'Which purple vegetable is shaped like an egg?', answer: 'Eggplant', options: ['Plum', 'Beet', 'Eggplant', 'Grape'] }
    ]
  },
  insects: {
    title: 'Insect Quiz',
    completionEmoji: '🐞',
    completionMessage: 'You\'re a bug expert! 🐝',
    questions: [
      { id: 'butterfly', emoji: '🦋', question: 'Which insect has colourful wings and starts as a caterpillar?', answer: 'Butterfly', options: ['Moth', 'Dragonfly', 'Butterfly', 'Bee'] },
      { id: 'ladybug', emoji: '🐞', question: 'Which small red bug has black spots?', answer: 'Ladybug', options: ['Beetle', 'Ladybug', 'Ant', 'Spider'] },
      { id: 'bee', emoji: '🐝', question: 'Which insect makes honey and has yellow stripes?', answer: 'Bee', options: ['Wasp', 'Fly', 'Bee', 'Mosquito'] },
      { id: 'ant', emoji: '🐜', question: 'Which tiny insect loves to carry crumbs in a line?', answer: 'Ant', options: ['Ant', 'Termite', 'Beetle', 'Bug'] },
      { id: 'spider', emoji: '🕷️', question: 'Which eight-legged crawler spins a web?', answer: 'Spider', options: ['Spider', 'Beetle', 'Cricket', 'Snail'] },
      { id: 'beetle', emoji: '🪲', question: 'Which shiny bug has a hard shell on its back?', answer: 'Beetle', options: ['Ladybug', 'Roach', 'Beetle', 'Ant'] },
      { id: 'snail', emoji: '🐌', question: 'Which slow crawler carries its home on its back?', answer: 'Snail', options: ['Worm', 'Slug', 'Snail', 'Caterpillar'] },
      { id: 'caterpillar', emoji: '🐛', question: 'Which wiggly bug turns into a butterfly?', answer: 'Caterpillar', options: ['Worm', 'Caterpillar', 'Grub', 'Snail'] },
      { id: 'mosquito', emoji: '🦟', question: 'Which buzzing bug leaves an itchy bite?', answer: 'Mosquito', options: ['Fly', 'Bee', 'Mosquito', 'Beetle'] },
      { id: 'cricket', emoji: '🦗', question: 'Which bug chirps at night with its legs?', answer: 'Cricket', options: ['Grasshopper', 'Cricket', 'Beetle', 'Ant'] }
    ]
  },
  space: {
    title: 'Space Quiz',
    completionEmoji: '🚀',
    completionMessage: 'You\'re a space explorer! 🌟',
    questions: [
      { id: 'rocket', emoji: '🚀', question: 'What vehicle blasts off into space?', answer: 'Rocket', options: ['Airplane', 'Rocket', 'Car', 'Boat'] },
      { id: 'moon', emoji: '🌙', question: 'What shines in the night sky and has craters?', answer: 'Moon', options: ['Sun', 'Star', 'Moon', 'Comet'] },
      { id: 'sun', emoji: '☀️', question: 'What is the big bright star at the center of our solar system?', answer: 'Sun', options: ['Sun', 'Planet', 'Moon', 'Light'] },
      { id: 'saturn', emoji: '🪐', question: 'Which planet is famous for its big bright rings?', answer: 'Saturn', options: ['Jupiter', 'Mars', 'Saturn', 'Earth'] },
      { id: 'astronaut', emoji: '🧑‍🚀', question: 'Who travels to space in a special suit?', answer: 'Astronaut', options: ['Pilot', 'Astronaut', 'Scientist', 'Captain'] },
      { id: 'star', emoji: '⭐', question: 'What twinkles far away in the night sky?', answer: 'Star', options: ['Star', 'Moon', 'Comet', 'Spark'] },
      { id: 'earth', emoji: '🌍', question: 'Which blue and green planet is our home?', answer: 'Earth', options: ['Mars', 'Earth', 'Venus', 'Moon'] },
      { id: 'comet', emoji: '☄️', question: 'What streaks across the sky with a glowing tail?', answer: 'Comet', options: ['Meteor', 'Comet', 'Rocket', 'Star'] },
      { id: 'alien', emoji: '👽', question: 'What friendly being might live on another planet?', answer: 'Alien', options: ['Monster', 'Robot', 'Alien', 'Ghost'] },
      { id: 'shooting-star', emoji: '🌠', question: 'What do we call a star that quickly falls through the sky?', answer: 'Shooting Star', options: ['Shooting Star', 'Comet', 'Spark', 'Moon'] }
    ]
  },
  dinosaurs: {
    title: 'Dinosaur Quiz',
    completionEmoji: '🦖',
    completionMessage: 'You are a dino expert! Rawr! 🦕',
    questions: [
      { id: 'trex', emoji: '🦖', question: 'Which dinosaur was the fierce king with big sharp teeth?', answer: 'T-Rex', options: ['Stegosaurus', 'T-Rex', 'Brachiosaurus', 'Triceratops'] },
      { id: 'triceratops', emoji: '🦏', question: 'Which dinosaur had three big horns on its face?', answer: 'Triceratops', options: ['Triceratops', 'Rhino', 'Ankylosaurus', 'Stegosaurus'] },
      { id: 'stegosaurus', emoji: '🐉', question: 'Which dinosaur had bony plates along its back?', answer: 'Stegosaurus', options: ['Stegosaurus', 'T-Rex', 'Pterodactyl', 'Iguanodon'] },
      { id: 'brachiosaurus', emoji: '🦕', question: 'Which giant dinosaur had a very long neck?', answer: 'Brachiosaurus', options: ['Brachiosaurus', 'Triceratops', 'Velociraptor', 'Ankylosaurus'] },
      { id: 'pterodactyl', emoji: '🦅', question: 'Which prehistoric creature flew in the sky with wings?', answer: 'Pterodactyl', options: ['Pterodactyl', 'Eagle', 'Bat', 'Brachiosaurus'] },
      { id: 'ankylosaurus', emoji: '🐢', question: 'Which dinosaur wore bony armor and a club tail?', answer: 'Ankylosaurus', options: ['Ankylosaurus', 'Triceratops', 'Turtle', 'Stegosaurus'] },
      { id: 'fossils', emoji: '🦴', question: 'What do we call the hardened remains of dinosaurs we dig up?', answer: 'Fossils', options: ['Fossils', 'Bones', 'Rocks', 'Shells'] },
      { id: 'dino-eggs', emoji: '🥚', question: 'What did baby dinosaurs hatch out of long ago?', answer: 'Dinosaur Eggs', options: ['Dinosaur Eggs', 'Nests', 'Seeds', 'Rocks'] },
      { id: 'herbivores', emoji: '🌿', question: 'What do we call dinosaurs that ate only plants?', answer: 'Herbivores', options: ['Herbivores', 'Carnivores', 'Omnivores', 'Mammals'] },
      { id: 'velociraptor', emoji: '🐊', question: 'Which small, fast dinosaur hunted in packs with sharp claws?', answer: 'Velociraptor', options: ['Velociraptor', 'T-Rex', 'Crocodile', 'Compsognathus'] }
    ]
  },
  'sea-creatures': {
    title: 'Sea Creatures Quiz',
    completionEmoji: '🐙',
    completionMessage: 'You are an ocean explorer! 🌊',
    questions: [
      { id: 'octopus', emoji: '🐙', question: 'Which sea animal has eight wiggly arms?', answer: 'Octopus', options: ['Octopus', 'Squid', 'Crab', 'Starfish'] },
      { id: 'shark', emoji: '🦈', question: 'Which ocean hunter has sharp teeth and a fin on top?', answer: 'Shark', options: ['Shark', 'Dolphin', 'Whale', 'Swordfish'] },
      { id: 'whale', emoji: '🐳', question: 'Which is the biggest animal that lives in the sea?', answer: 'Whale', options: ['Whale', 'Shark', 'Dolphin', 'Seal'] },
      { id: 'starfish', emoji: '⭐', question: 'Which sea creature has five arms and lives on the seabed?', answer: 'Starfish', options: ['Starfish', 'Jellyfish', 'Crab', 'Snail'] },
      { id: 'crab', emoji: '🦀', question: 'Which sea animal walks sideways with claws?', answer: 'Crab', options: ['Crab', 'Lobster', 'Shrimp', 'Octopus'] },
      { id: 'seahorse', emoji: '🐴', question: 'Which tiny sea creature looks like a little horse?', answer: 'Seahorse', options: ['Seahorse', 'Horse', 'Dolphin', 'Eel'] },
      { id: 'jellyfish', emoji: '🪼', question: 'Which sea creature drifts with soft, stinging tentacles?', answer: 'Jellyfish', options: ['Jellyfish', 'Squid', 'Coral', 'Octopus'] },
      { id: 'dolphin', emoji: '🐬', question: 'Which smart, friendly sea animal loves to leap and click?', answer: 'Dolphin', options: ['Dolphin', 'Shark', 'Whale', 'Seal'] },
      { id: 'sea-turtle', emoji: '🐢', question: 'Which shelled reptile swims slowly in the ocean?', answer: 'Sea Turtle', options: ['Sea Turtle', 'Tortoise', 'Frog', 'Crab'] },
      { id: 'fish', emoji: '🐠', question: 'Which colorful sea animal has scales and breathes through gills?', answer: 'Fish', options: ['Fish', 'Whale', 'Dolphin', 'Shrimp'] }
    ]
  }
};
