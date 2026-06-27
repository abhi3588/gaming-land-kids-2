// ===== Stories Data (from Codebase 1) =====
const publicImage = (filename) => `${import.meta.env.BASE_URL}${filename}`;

export const stories = [
  {
    id: 'bunny-shares',
    title: 'Benny the Bunny Learns to Share',
    subtitle: 'A meadow tale about kindness',
    emoji: '🐰',
    coverImage: publicImage('images/story-bunny.jpg'),
    ageRange: '3-6',
    minutesToRead: 3,
    moral: 'Sharing makes our hearts grow bigger and our smiles brighter.',
    moralEmoji: '💛',
    gradient: 'linear-gradient(135deg, #ff6b9d, #ff9f43)',
    scenes: [
      {
        emoji: '🐰🥕',
        heading: 'A Big Bunch of Carrots',
        text: "One sunny morning, Benny the Bunny found a giant bunch of crunchy orange carrots in the meadow. 'Yum! All mine!' he cheered, hugging them tight.",
      },
      {
        emoji: '🐭',
        heading: 'A Tummy Rumble',
        text: "Along hopped his friend Milo the Mouse. Milo's tummy gave a tiny little rumble. 'I am so hungry,' Milo whispered, looking at his paws.",
      },
      {
        emoji: '🤔',
        heading: 'A Kind Thought',
        text: "Benny looked at his carrots. He looked at Milo. He thought, 'If I share, I will have fewer carrots. But Milo will have a happy tummy.'",
      },
      {
        emoji: '🥕✨',
        heading: 'Sharing Time!',
        text: "Benny smiled and gave Milo three big carrots. 'Here you go, friend!' Milo's eyes sparkled like little stars. 'Thank you, Benny!'",
      },
      {
        emoji: '🎉',
        heading: 'Bigger Smiles Together',
        text: 'Benny and Milo munched and giggled together. Benny noticed something wonderful — the carrots tasted even sweeter when shared with a friend.',
      },
    ],
  },
  {
    id: 'lily-little-star',
    title: 'Lily, the Little Star',
    subtitle: 'A bedtime tale about being yourself',
    emoji: '⭐',
    coverImage: publicImage('images/story-star.jpg'),
    ageRange: '3-6',
    minutesToRead: 3,
    moral: "You don't have to be the biggest to shine. Just be yourself!",
    moralEmoji: '🌟',
    gradient: 'linear-gradient(135deg, #a55eea, #ff6b9d)',
    scenes: [
      {
        emoji: '🌌',
        heading: 'Up in the Night Sky',
        text: 'High up in the night sky lived Lily, a very little star. All the other stars were big and bright. Lily felt small and a little shy.',
      },
      {
        emoji: '😢',
        heading: 'I Want to Be Big',
        text: "'I wish I was big like everyone else,' Lily sighed. She tried to puff herself up, but she stayed just as tiny as before.",
      },
      {
        emoji: '🦉',
        heading: 'A Wise Old Owl',
        text: "Down below, a wise old owl hooted softly. 'Little star,' the owl called, 'the sky needs stars of every size. Even small lights help someone find their way.'",
      },
      {
        emoji: '🗺️',
        heading: 'A Lost Little Fox',
        text: "That night, a tiny fox was lost in the dark woods. The big stars were too high to see. But Lily's gentle glow was just right. She lit a little path home.",
      },
      {
        emoji: '🦊🏡',
        heading: 'Shining Just Right',
        text: "The little fox found his way home and waved up at Lily. 'Thank you, little star!' Lily twinkled proudly. She didn't want to be big anymore. Being herself was just right.",
      },
    ],
  },
  {
    id: 'brave-beetle',
    title: 'Bruno the Brave Little Beetle',
    subtitle: 'A garden story about courage',
    emoji: '🐞',
    coverImage: null,
    ageRange: '3-6',
    minutesToRead: 3,
    moral: 'Being brave means trying even when you feel scared.',
    moralEmoji: '💪',
    gradient: 'linear-gradient(135deg, #1dd1a1, #54a0ff)',
    scenes: [
      {
        emoji: '🐞🌿',
        heading: 'The Big Wide Garden',
        text: 'Bruno the Beetle lived under a cosy leaf. The garden was big and wide, and Bruno felt very small looking at it all.',
      },
      {
        emoji: '🌻',
        heading: 'The Yellow Flower Calls',
        text: "A tall yellow sunflower waved to Bruno. 'Come visit!' it called. But the path was long, and Bruno felt his tiny legs shake.",
      },
      {
        emoji: '🐛',
        heading: 'A Friend Beside Him',
        text: "His friend Celia the Caterpillar smiled. 'I'll walk with you,' she said. Together, they stepped onto the garden path.",
      },
      {
        emoji: '🌼✨',
        heading: 'One Step at a Time',
        text: 'Bruno took one step, then another, then another. The world got bigger — but so did Bruno. He kept going!',
      },
      {
        emoji: '🌞🐞',
        heading: 'On Top of the Flower',
        text: "Bruno reached the top of the sunflower and looked out at the whole garden. 'I did it!' he cheered. Brave isn't never being scared — it's going anyway.",
      },
    ],
  },
  {
    id: 'cloud-painter',
    title: 'Cleo the Cloud Painter',
    subtitle: 'A sky adventure about creativity',
    emoji: '☁️',
    coverImage: null,
    ageRange: '3-6',
    minutesToRead: 3,
    moral: 'Your imagination can make the whole world more colourful.',
    moralEmoji: '🎨',
    gradient: 'linear-gradient(135deg, #54a0ff, #feca57)',
    scenes: [
      {
        emoji: '☁️🎨',
        heading: 'Cleo Has a Paintbrush',
        text: "High in the sky, Cleo was the only cloud with a paintbrush. The other clouds were white and plain. 'Why bother?' they asked. 'The sky is always blue.'",
      },
      {
        emoji: '🌈',
        heading: 'Stripes and Swirls',
        text: 'Cleo painted purple stripes and golden swirls across the morning sky. Down below, a little girl looked up and gasped.',
      },
      {
        emoji: '👧😍',
        heading: 'A Girl Named Rosa',
        text: "'A dragon! A castle! A dancing elephant!' Rosa shouted, pointing at Cleo's shapes. She had never seen a sky so full of stories.",
      },
      {
        emoji: '⛅🌟',
        heading: 'The Other Clouds Try',
        text: 'One by one, the other clouds asked Cleo to teach them. Soon the whole sky was full of shapes and colours and wonder.',
      },
      {
        emoji: '🌅',
        heading: 'A Sky Full of Dreams',
        text: "Each evening, Rosa and Cleo painted the sunset together — one with a brush in the sky, one with her finger on the glass. Imagination is the best kind of paint.",
      },
    ],
  },
  {
    id: 'tilly-turtle',
    title: 'Tilly the Tiny Turtle',
    subtitle: 'A pond tale about never giving up',
    emoji: '🐢',
    coverImage: null,
    ageRange: '3-6',
    minutesToRead: 3,
    moral: 'Keep going — every small step brings you closer to your dream.',
    moralEmoji: '💪',
    gradient: 'linear-gradient(135deg, #1dd1a1, #54a0ff)',
    scenes: [
      {
        emoji: '🐢🏔️',
        heading: 'The Big Rock',
        text: "Tilly the Turtle wanted to climb the big rock at the edge of the pond. All the other animals had done it. But Tilly's short little legs made it so very hard.",
      },
      {
        emoji: '😓',
        heading: 'Slip and Slide',
        text: "She tried once — and slid back down. She tried again — and slipped. 'Maybe I just can't do it,' she sighed, tucking her head into her shell.",
      },
      {
        emoji: '🐸💬',
        heading: "Frog's Good Advice",
        text: "Froggy hopped over with a big smile. 'Don't look at the top, Tilly,' he said kindly. 'Just look at the very next little step in front of you.'",
      },
      {
        emoji: '🐢✨',
        heading: 'One Step at a Time',
        text: 'Tilly took one tiny step. Then another. She did not look up. She did not look down. Just the next step. And the next. And the next.',
      },
      {
        emoji: '🌅🐢',
        heading: 'The View from the Top',
        text: "When Tilly finally looked up, she was at the very top! The whole pond sparkled below her. 'I did it!' she cheered. 'One small step at a time!'",
      },
    ],
  },
  {
    id: 'max-missing-smile',
    title: "Max and the Missing Smile",
    subtitle: 'A neighbourly tale about kindness',
    emoji: '🐻',
    coverImage: null,
    ageRange: '3-6',
    minutesToRead: 3,
    moral: 'A small act of kindness can change someone\'s whole day.',
    moralEmoji: '🤝',
    gradient: 'linear-gradient(135deg, #ff9f43, #ff6b9d)',
    scenes: [
      {
        emoji: '🐻😐',
        heading: 'Max Notices Something',
        text: "Max the little bear was walking to school when he saw his neighbour, old Mrs Hen, sitting quietly on her step. She was not smiling. She was not singing. She just sat very still.",
      },
      {
        emoji: '🤔💭',
        heading: 'Something Felt Wrong',
        text: "Max thought about walking past. He was already a little late. But something stopped him. He had never seen Mrs Hen so quiet before.",
      },
      {
        emoji: '🐻💬',
        heading: 'Just Three Words',
        text: "Max walked up to her gate. 'Are you okay?' he asked softly. Mrs Hen looked up, surprised. Her eyes went warm. 'My flowers wouldn't grow today,' she said with a little sigh.",
      },
      {
        emoji: '🌸🐻',
        heading: 'Helping Hands',
        text: "Max did not know much about flowers, but he knew about trying. Together they watered every pot and planted three new seeds. They talked and laughed the whole time.",
      },
      {
        emoji: '😊🌺',
        heading: 'The Smile Came Back',
        text: "When Max left for school, Mrs Hen was singing again. He had given nothing but his time — and it turned out that was everything she needed.",
      },
    ],
  },
  {
    id: 'iris-saves-the-day',
    title: 'Ice Queen Iris Saves the Day',
    subtitle: 'A superhero tale about staying calm',
    emoji: '🧊',
    coverImage: null,
    ageRange: '3-6',
    minutesToRead: 3,
    moral: 'When everyone panics, staying calm is a superpower all its own.',
    moralEmoji: '❄️',
    gradient: 'linear-gradient(135deg, #74b9ff, #a29bfe)',
    scenes: [
      {
        emoji: '🏙️☀️',
        heading: 'A Beautiful Morning',
        text: "It was a warm and sunny morning in Sunshine City. Ice Queen Iris was having her favourite breakfast — a big bowl of blueberry ice cream — when her superhero watch started blinking.",
      },
      {
        emoji: '🔥😱',
        heading: 'Danger at the Playground!',
        text: "'FIRE at the playground!' the watch beeped. Iris looked out the window. Thick orange flames were leaping from the old oak tree beside the swings. Children were running and shouting.",
      },
      {
        emoji: '🧊💨',
        heading: 'Iris Flies into Action',
        text: "Iris took a deep breath. She did not panic. She flew to the playground in three quick seconds. 'Everyone stand back and stay calm!' she called in her clear, steady voice.",
      },
      {
        emoji: '❄️🌊',
        heading: 'A Wave of Ice',
        text: "Iris stretched out both hands and sent a shimmering wave of frosty ice across the flames. WHOOOOSH! The fire hissed, crackled… and went out. The oak tree was covered in glittery snowflakes.",
      },
      {
        emoji: '🎉🧊',
        heading: 'The Coolest Hero',
        text: "The children cheered. 'You saved the oak tree, Iris!' a little girl shouted. Iris smiled. 'Remember — when things get scary, take one deep breath first. Calm is the coolest superpower of all.'",
      },
    ],
  },
  {
    id: 'flash-frankie-lost-puppy',
    title: "Flash Frankie and the Lost Puppy",
    subtitle: 'A speedy tale about never giving up',
    emoji: '⚡',
    coverImage: null,
    ageRange: '3-6',
    minutesToRead: 3,
    moral: 'Never give up — even small acts of kindness done quickly can change everything.',
    moralEmoji: '🐾',
    gradient: 'linear-gradient(135deg, #ffeaa7, #fd79a8)',
    scenes: [
      {
        emoji: '⚡🏃',
        heading: 'The Fastest Kid in the City',
        text: "Flash Frankie could run faster than a racing car. In fact, he was so fast that people only ever saw a little yellow blur zooming past. He loved using his speed to help others.",
      },
      {
        emoji: '🐶😢',
        heading: 'A Tiny Whimper',
        text: "One afternoon, Frankie heard a tiny whimper near the park gates. A small brown puppy was sitting alone, looking very scared. Its lead was tangled around a bush and it could not get free.",
      },
      {
        emoji: '⚡🗺️',
        heading: 'A Race Against Sunset',
        text: "Frankie untangled the puppy straight away. But there was no name tag on its collar! The sun was starting to set. Frankie knew he had to find the owner before dark.",
      },
      {
        emoji: '⚡🏘️',
        heading: 'Zooming Through the Streets',
        text: "Frankie zipped up and down every street in Sunshine City, showing everyone the puppy. Door after door, no one knew who it belonged to. But Frankie did not stop. He never gave up.",
      },
      {
        emoji: '🐶🏡❤️',
        heading: 'Home at Last',
        text: "On the very last street, a little boy burst out of a house crying. 'Biscuit! You're safe!' He hugged the puppy tight and then looked up at Frankie. 'Thank you for not giving up on him.' Frankie grinned. 'I never do.'",
      },
    ],
  },
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
  { id: 'heropowermatch', title: 'Hero Power Match', icon: '⚡', color: 'heropowermatch', ageGroup: 'preschool', desc: 'Match each hero to their superpower!' },
  { id: 'savethecity',   title: 'Save the City',    icon: '🏙️', color: 'savethecity',   ageGroup: 'preschool', desc: 'Pick the right hero to save the day!' },

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
];
