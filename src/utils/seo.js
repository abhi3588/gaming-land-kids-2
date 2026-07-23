// ============================================
// SEO UTILITIES — Dynamic Meta Tags & JSON-LD
// ============================================
import {
  SITE_ORIGIN,
  BASE_URL,
  joinUrl,
  defaultJsonLd,
  organizationJsonLd,
} from './seoConfig.js';

// ------------------------------------------------------------------
// Schema factory helpers (keep JSON-LD consistent everywhere)
// ------------------------------------------------------------------
export const websiteSchema = () => defaultJsonLd;

export const organizationSchema = () => organizationJsonLd;


export const gameSchema = (game) => ({
  '@context': 'https://schema.org',
  '@type': 'Game',
  '@id': joinUrl(SITE_ORIGIN, 'games', `${game.id}#game`),
  name: game.title,
  description: game.desc,
  url: joinUrl(BASE_URL, 'games', game.id),
  image: joinUrl(BASE_URL, `og-game-${game.id}.png`),
  genre: 'Educational',
  gamePlatform: 'Web Browser',
  operatingSystem: 'Any',
  applicationCategory: 'EducationalGame',
  isAccessibleForFree: true,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  targetAudience: {
    '@type': 'Audience',
    audienceType: game.ageGroup === 'preschool' ? 'Children ages 3-5' : 'Children ages 6-10',
  },
  teaches: getGameTeaches(game.id),
  publisher: { '@id': joinUrl(SITE_ORIGIN, '#organization') },
});

const getGameTeaches = (gameId) => {
  const teachesMap = {
    memory: ['Memory', 'Pattern Recognition', 'Sea Animals'],
    sorting: ['Categorization', 'Fruit Recognition', 'Sorting'],
    patterns: ['Pattern Recognition', 'Sequencing', 'Logic'],
    counting: ['Counting', 'Number Recognition', 'Basic Math'],
    colormatch: ['Color Recognition', 'Visual Discrimination'],
    animalsounds: ['Animal Sounds', 'Auditory Discrimination'],
    shapefinder: ['Shape Recognition', 'Geometry', 'Visual Matching'],
    oddoneout: ['Critical Thinking', 'Categorization', 'Logic'],
    heropowermatch: ['Superhero Knowledge', 'Matching', 'Memory'],
    savethecity: ['Problem Solving', 'Decision Making', 'Superhero Knowledge'],
    whatcomesnext: ['Pattern Recognition', 'Sequencing', 'Prediction'],
    bigorsmall: ['Size Comparison', 'Measurement Concepts', 'Visual Discrimination'],
    alphabetmatch: ['Letter Recognition', 'Uppercase/Lowercase Matching', 'Alphabet'],
    fruitfinder: ['Fruit Recognition', 'Visual Search', 'Vocabulary'],
    shadowmatch: ['Visual Discrimination', 'Shape Matching', 'Spatial Reasoning'],
    oppositematch: ['Opposites', 'Vocabulary', 'Conceptual Thinking'],
    numbermatch: ['Number Recognition', 'Counting', 'Subitizing'],
    missingnumber: ['Number Sequences', 'Pattern Recognition', 'Early Math'],
    herospellquest: ['Spelling', 'Superhero Vocabulary', 'Letter Sequencing'],
    herotrivia: ['Superhero Knowledge', 'Reading Comprehension', 'Memory'],
    rhymetime: ['Rhyming', 'Phonological Awareness', 'Word Families'],
    mathninja: ['Mental Math', 'Addition', 'Subtraction', 'Speed'],
    math: ['Math Equations', 'Problem Solving', 'Arithmetic'],
    word: ['Spelling', 'Vocabulary', 'Word Building'],
    sudoku: ['Logic', 'Spatial Reasoning', 'Pattern Recognition'],
    sumpairs: ['Addition', 'Number Bonds', 'Mental Math'],
    sequence: ['Memory', 'Pattern Recognition', 'Sequencing'],
    wordscramble: ['Spelling', 'Anagrams', 'Vocabulary'],
    memorymatrix: ['Visual Memory', 'Spatial Memory', 'Concentration'],
    operatorquest:     ['Math Operators', 'Equation Solving', 'Arithmetic'],
    'emotion-express': ['Emotional Intelligence', 'Feelings Recognition', 'Empathy', 'Social Skills'],
    'color-magic':     ['Color Theory', 'Primary Colors', 'Color Mixing', 'Creative Arts'],
    'fraction-bakery': ['Fractions', 'Numeracy', 'Math Problem Solving', 'Pizza Slices'],
    'globe-trotter':   ['World Geography', 'Landmarks', 'Countries', 'Capitals', 'Animal Habitats'],
  };
  return teachesMap[gameId] || ['Educational Concepts'];
};

export const storySchema = (story, lang = 'en') => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  '@id': joinUrl(SITE_ORIGIN, 'stories', `${lang === 'hi' ? 'hi/' : ''}${story.id}#story`),
  name: story.title,
  headline: story.title,
  description: story.subtitle,
  url: joinUrl(BASE_URL, 'stories', `${lang === 'hi' ? 'hi/' : ''}${story.id}`),
  image: story.coverImage ? joinUrl(BASE_URL, story.coverImage) : undefined,
  genre: "Children's Literature",
  inLanguage: lang === 'hi' ? 'hi' : 'en',
  isAccessibleForFree: true,
  author: { '@type': 'Organization', name: 'Gaming Land Kids', '@id': joinUrl(SITE_ORIGIN, '#organization') },
  publisher: { '@id': joinUrl(SITE_ORIGIN, '#organization') },
  datePublished: '2024-01-01',
  dateModified: '2024-12-01',
  audience: { '@type': 'Audience', audienceType: `Children ages ${story.ageRange}` },
  educationalUse: 'Reading Practice',
  educationalLevel: ['Preschool', 'Kindergarten'],
  learningResourceType: 'Story',
  teaches: story.moral,
  keywords: ['bedtime story', 'children story', 'moral lesson', story.moral],
  about: { '@type': 'Thing', name: story.moral, description: story.moral },
});

export const quizSchema = (quiz) => ({
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  '@id': joinUrl(SITE_ORIGIN, 'quiz', `${quiz.id}#quiz`),
  name: quiz.title,
  description:
    quiz.desc || `Test your knowledge with ${quiz.questions?.length || 0} questions about ${quiz.title}.`,
  url: joinUrl(BASE_URL, 'quiz', quiz.id),
  image: joinUrl(BASE_URL, `og-quiz-${quiz.id}.png`),
  educationalUse: 'Assessment',
  educationalLevel: ['Preschool', 'Kindergarten', 'Elementary'],
  learningResourceType: 'Quiz',
  isAccessibleForFree: true,
  teaches: (quiz.questions || []).map((q) => q.question).slice(0, 5).join(', '),
  audience: { '@type': 'Audience', audienceType: `Children ages ${quiz.ageRange || '3-10'}` },
  publisher: { '@id': joinUrl(SITE_ORIGIN, '#organization') },
  questionCount: (quiz.questions || []).length,
});

export const videoSchema = (rhyme) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  '@id': joinUrl(SITE_ORIGIN, 'rhymes', `${rhyme.id}#video`),
  name: rhyme.title,
  description: rhyme.desc,
  url: joinUrl(BASE_URL, 'rhymes', rhyme.id),
  contentUrl: rhyme.videoUrl,
  embedUrl: rhyme.videoUrl,
  thumbnailUrl: joinUrl(BASE_URL, `og-rhyme-${rhyme.id}.png`),
  uploadDate: '2024-01-01',
  duration: 'PT2M',
  isAccessibleForFree: true,
  genre: 'Nursery Rhyme',
  inLanguage: 'en',
  publisher: { '@id': joinUrl(SITE_ORIGIN, '#organization') },
  audience: { '@type': 'Audience', audienceType: 'Children ages 3-8' },
  educationalUse: 'Entertainment',
  educationalLevel: ['Preschool', 'Kindergarten'],
});

export const howToSchema = (activity) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  '@id': joinUrl(SITE_ORIGIN, 'fun', `${activity.id}#howto`),
  name: activity.title,
  description: activity.desc,
  url: joinUrl(BASE_URL, 'fun', activity.id),
  image: joinUrl(BASE_URL, `og-fun-${activity.id}.png`),
  totalTime: activity.time ? `PT${activity.time.replace(' min', 'M')}` : undefined,
  estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
  supply: (activity.materials || []).map((m) => ({ '@type': 'HowToSupply', name: m })),
  tool: [],
  step: (activity.steps || []).map((step, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: `Step ${i + 1}`,
    text: step,
    url: joinUrl(BASE_URL, 'fun', activity.id, `#step-${i + 1}`),
  })),
  audience: { '@type': 'Audience', audienceType: `Children ages ${activity.ageRange}` },
  publisher: { '@id': joinUrl(SITE_ORIGIN, '#organization') },
  isAccessibleForFree: true,
});

export const learningResourceSchema = (edu) => {
  const category = edu.category || 'science';
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    '@id': joinUrl(SITE_ORIGIN, 'educational', category, `${edu.id}#resource`),
    name: edu.title,
    description: edu.desc,
    url: joinUrl(BASE_URL, 'educational', category, edu.id),
    image: joinUrl(BASE_URL, `og-edu-${category}-${edu.id}.png`),
    educationalUse: 'Play-based learning',
    educationalLevel: ['Preschool', 'Kindergarten', 'Elementary'],
    learningResourceType: 'EducationalGame',
    isAccessibleForFree: true,
    inLanguage: 'en',
    teaches: [edu.title],
    audience: { '@type': 'Audience', audienceType: `Children ages ${edu.ageRange}` },
    publisher: { '@id': joinUrl(SITE_ORIGIN, '#organization') },
  };
};

// Build a BreadcrumbList schema from a hierarchical list of crumbs, each
// `{ name, url }` (e.g. Home → Educational → Science → Float or Sink). Tells
// search engines the site structure and powers breadcrumb rich snippets.
export const breadcrumbSchema = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: c.url,
  })),
});

// Derive the breadcrumb trail for a content item based on its type/category.
const buildBreadcrumbs = (type, item, opts) => {
  const lang = opts.lang || 'en';
  const home = { name: 'Home', url: BASE_URL };
  const sectionMap = {
    game: { label: 'Games', path: ['games'] },
    story: { label: 'Stories', path: ['stories'] },
    quiz: { label: 'Quiz', path: ['quiz'] },
    rhyme: { label: 'Rhymes', path: ['rhymes'] },
    fun: { label: 'Fun Activities', path: ['fun'] },
    educational: { label: 'Educational', path: ['educational'] },
  };
  const section = sectionMap[type];
  if (!section) return [home];

  const crumbs = [home, { name: section.label, url: joinUrl(BASE_URL, ...section.path) }];

  if (type === 'educational') {
    const cat = opts.category || item.category || 'science';
    crumbs.push({
      name: cat === 'moral' ? 'Moral Education' : 'Science',
      url: joinUrl(BASE_URL, 'educational', cat),
    });
  }

  const itemPath = lang === 'hi' ? [type, 'hi', item.id] : [type, item.id];
  crumbs.push({ name: item.title, url: joinUrl(BASE_URL, ...itemPath) });
  return crumbs;
};

// ------------------------------------------------------------------
// Per-tab SEO config
// ------------------------------------------------------------------
export const getTabSEO = (tab, extra = {}) => {
  const configs = {
    games: {
      title: '🎮 38+ Educational Games for Kids Ages 3-10 | Gaming Land Kids',
      description:
        'Free educational games: math, counting, alphabet, colors, shapes, patterns, memory, words, spelling, sudoku. Safe, ad-free learning through play!',
      canonical: joinUrl(BASE_URL, 'games'),
      ogTitle: '🎮 38+ Educational Games for Kids Ages 3-10',
      ogDescription:
        'Free educational games: math, counting, alphabet, colors, shapes, patterns, memory, words, spelling. Safe, ad-free learning!',
      ogImage: joinUrl(BASE_URL, 'og-games.png'),
      ogUrl: joinUrl(BASE_URL, 'games'),
      jsonLd: {
        '@graph': [
          websiteSchema(),
          organizationSchema(),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': joinUrl(SITE_ORIGIN, 'games#gamelist'),
            name: 'Educational Games for Kids',
            description: '30+ free educational games for children ages 3-10',
            numberOfItems: extra.gamesMeta?.length || 30,
            itemListElement: (extra.gamesMeta || []).map((g, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: g.title,
              description: g.desc,
              url: joinUrl(BASE_URL, 'games', g.id),
            })),
          },
        ],
      },
    },
    stories: {
      title: '📖 Bedtime Stories for Kids — English & Hindi | Gaming Land Kids',
      description:
        'Read 12 bedtime stories with pictures in English and Hindi. Moral lessons, ages 3-6, 3 min reads. Perfect for bedtime!',
      canonical: joinUrl(BASE_URL, 'stories'),
      ogTitle: '📖 Bedtime Stories for Kids — English & Hindi',
      ogDescription:
        'Read 12 bedtime stories with pictures in English and Hindi. Moral lessons, ages 3-6, 3 min reads.',
      ogImage: joinUrl(BASE_URL, 'og-stories.png'),
      ogUrl: joinUrl(BASE_URL, 'stories'),
      jsonLd: {
        '@graph': [
          websiteSchema(),
          organizationSchema(),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': joinUrl(SITE_ORIGIN, 'stories#storylist'),
            name: 'Bedtime Stories for Kids',
            description: '12 bedtime stories with moral lessons in English and Hindi',
            numberOfItems: extra.stories?.length || 12,
            itemListElement: (extra.stories || []).map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: s.title,
              description: s.subtitle,
              url: joinUrl(BASE_URL, 'stories', s.id),
            })),
          },
        ],
      },
      hreflang: [
        { lang: 'en', href: joinUrl(BASE_URL, 'stories') },
        { lang: 'hi', href: joinUrl(BASE_URL, 'stories', 'hi') },
        { lang: 'x-default', href: joinUrl(BASE_URL, 'stories') },
      ],
    },
    rhymes: {
      title: '🎵 Nursery Rhymes & Kids Songs — Free Videos | Gaming Land Kids',
      description:
        'Watch 8 free nursery rhyme videos: My Cycle, Fingers to Snap, Mighty Elephant, Little Plant, Beehive, 12345, Topsy Turvy Zoo, Cloud.',
      canonical: joinUrl(BASE_URL, 'rhymes'),
      ogTitle: '🎵 Nursery Rhymes & Kids Songs — Free Videos',
      ogDescription:
        'Watch 8 free nursery rhyme videos for kids. My Cycle, Elephant, Plant, Bee, Counting, Zoo, Cloud!',
      ogImage: joinUrl(BASE_URL, 'og-rhymes.png'),
      ogUrl: joinUrl(BASE_URL, 'rhymes'),
      jsonLd: {
        '@graph': [
          websiteSchema(),
          organizationSchema(),
          {
            '@context': 'https://schema.org',
            '@type': 'VideoPlaylist',
            name: 'Nursery Rhymes for Kids',
            description: '8 free nursery rhyme videos for children',
            hasPart: (extra.rhymes || []).map((r) => ({
              '@type': 'VideoObject',
              name: r.title,
              description: r.desc,
              contentUrl: r.videoUrl,
              thumbnailUrl: joinUrl(BASE_URL, `og-rhyme-${r.id}.png`),
              uploadDate: '2024-01-01',
              duration: 'PT2M',
              isAccessibleForFree: true,
            })),
          },
        ],
      },
    },
    fun: {
      title: '🎉 12 Fun Activities for Kids — Hands-on Creative Ideas | Gaming Land Kids',
      description:
        '12 hands-on fun activities: Rainbow Hunt, Story Dice, Shape Collage, Breathing Star, Kitchen Band, Kindness Coupons, Nature Journal, Sock Puppet Show, Shadow Puppets, Bubble Sculptures, Magical Milk Art, Solar Oven Smores. Ages 3-10.',
      canonical: joinUrl(BASE_URL, 'fun'),
      ogTitle: '🎉 12 Fun Activities for Kids — Hands-on Creative Ideas',
      ogDescription:
        '12 hands-on activities including Magical Milk Art, Solar Oven Smores, Rainbow Hunt, Bubble Sculptures, and more! Ages 3-10.',
      ogImage: joinUrl(BASE_URL, 'og-fun.png'),
      ogUrl: joinUrl(BASE_URL, 'fun'),
      jsonLd: {
        '@graph': [
          websiteSchema(),
          organizationSchema(),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Fun Activities for Kids',
            description: 'Hands-on creative activities for children',
            itemListElement: (extra.funActivities || []).map((a, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: a.title,
              description: a.desc,
              url: joinUrl(BASE_URL, 'fun', a.id),
            })),
          },
        ],
      },
    },
    educational: {
      title: '🧪 Educational Activities — Science & Moral Learning | Gaming Land Kids',
      description:
        '12 interactive educational activities: Plant Life Cycle, Weather Watcher, Solar System, Body Parts, Water Cycle, Dinosaur Age + Truth Detective, Kindness Helper, Respect Ranger, Responsibility Captain, Honesty Hero, Gratitude Garden.',
      canonical: joinUrl(BASE_URL, 'educational'),
      ogTitle: '🧪 Educational Activities — Science & Moral Learning',
      ogDescription: '12 interactive science & moral education activities for kids ages 3-10.',
      ogImage: joinUrl(BASE_URL, 'og-educational.png'),
      ogUrl: joinUrl(BASE_URL, 'educational'),
      jsonLd: {
        '@graph': [
          websiteSchema(),
          organizationSchema(),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Educational Activities for Kids',
            description: 'Science and moral education activities',
            itemListElement: [
              ...(extra.scienceActivities || []).map((a, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: a.title,
                description: a.desc,
                url: joinUrl(BASE_URL, 'educational', 'science', a.id),
              })),
              ...(extra.moralActivities || []).map((a, i) => ({
                '@type': 'ListItem',
                position: (extra.scienceActivities?.length || 0) + i + 1,
                name: a.title,
                description: a.desc,
                url: joinUrl(BASE_URL, 'educational', 'moral', a.id),
              })),
            ],
          },
        ],
      },
    },
    quiz: {
      title: '📝 Quiz Corner — 14 Educational Quizzes for Kids | Gaming Land Kids',
      description:
        'Test knowledge with 14 fun quizzes: Fruits, Flowers, Shapes, Animals, Colors, Vehicles, Birds, Veggies, Bugs, Space, Dinosaurs, Sea Creatures, World Wonders, Inventions. 20 questions each, ages 3-10. Free!',
      canonical: joinUrl(BASE_URL, 'quiz'),
      ogTitle: '📝 Quiz Corner — 14 Educational Quizzes for Kids',
      ogDescription: '14 fun quizzes covering animals, science, world wonders, inventions, space, and more. 20 questions each, ages 3-10.',
      ogImage: joinUrl(BASE_URL, 'og-quiz.png'),
      ogUrl: joinUrl(BASE_URL, 'quiz'),
      jsonLd: {
        '@graph': [
          websiteSchema(),
          organizationSchema(),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Educational Quizzes for Kids',
            description: '6 interactive quizzes for children ages 3-9',
            itemListElement: (extra.quizCategories || []).map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: c.title,
              description: c.desc,
              url: joinUrl(BASE_URL, 'quiz', c.id),
            })),
          },
        ],
      },
    },
    puzzle: {
      title: '🧩 Puzzle Palace — 6 Brain Games for Kids | Gaming Land Kids',
      description:
        '6 brain-boosting puzzles: Animal Jigsaw, Slide Picture, Connect the Dots, Maze Adventure, Spot the Difference, Shape Fit. 5 levels each, ages 3-10.',
      canonical: joinUrl(BASE_URL, 'puzzle'),
      ogTitle: '🧩 Puzzle Palace — 6 Brain Games for Kids',
      ogDescription: '6 puzzles: Jigsaw, Slide, Connect Dots, Maze, Spot Difference, Shape Fit. 5 levels each, ages 3-10.',
      ogImage: joinUrl(BASE_URL, 'og-puzzle.png'),
      ogUrl: joinUrl(BASE_URL, 'puzzle'),
      jsonLd: {
        '@graph': [
          websiteSchema(),
          organizationSchema(),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Puzzle Games for Kids',
            description: '6 brain-boosting puzzle games with 5 levels each',
            itemListElement: (extra.puzzleCategories || []).map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.title,
              description: p.desc,
              url: joinUrl(BASE_URL, 'puzzle', p.id),
            })),
          },
        ],
      },
    },
  };

  function normalizeSEOConfig(seo) {
    return {
      title: seo.title,
      description: seo.description,
      canonical: seo.canonical,
      ogTitle: seo.ogTitle,
      ogDescription: seo.ogDescription,
      ogImage: seo.ogImage,
      ogUrl: seo.ogUrl,
      ogType: seo.ogType || 'website',
      twitterCard: seo.twitterCard || 'summary_large_image',
      twitterTitle: seo.twitterTitle || seo.ogTitle || seo.title,
      twitterDescription: seo.twitterDescription || seo.ogDescription || seo.description,
      twitterImage: seo.twitterImage || seo.ogImage,
      robots: seo.robots || 'index, follow',
      jsonLd: seo.jsonLd,
      hreflang: seo.hreflang,
    };
  }

  return normalizeSEOConfig(configs[tab] || configs.games);
};

// ------------------------------------------------------------------
// Per-item SEO config
// type: 'game' | 'story' | 'quiz' | 'rhyme' | 'fun' | 'educational'
// ------------------------------------------------------------------
export const getItemSEO = (type, item, opts = {}) => {
  const lang = opts.lang || 'en';
  const base = {
    title: `${item.title} | Gaming Land Kids`,
    description: item.desc || item.subtitle || `Play ${item.title} - a fun educational activity for kids.`,
    canonical: joinUrl(BASE_URL, type, `${lang === 'hi' ? 'hi/' : ''}${item.id}`),
    ogTitle: item.title,
    ogDescription: item.desc || item.subtitle || `Play ${item.title}!`,
    ogImage: joinUrl(BASE_URL, `og-${type}-${item.id}.png`),
    ogUrl: joinUrl(BASE_URL, type, `${lang === 'hi' ? 'hi/' : ''}${item.id}`),
    ogType: 'article',
    jsonLd: null,
  };

  let itemSchema = null;
  switch (type) {
    case 'game':
      itemSchema = gameSchema(item);
      break;
    case 'story':
      itemSchema = storySchema(item, lang);
      base.hreflang = [
        { lang: 'en', href: joinUrl(BASE_URL, 'stories', item.id) },
        { lang: 'hi', href: joinUrl(BASE_URL, 'stories', 'hi', item.id) },
        { lang: 'x-default', href: joinUrl(BASE_URL, 'stories', item.id) },
      ];
      break;
    case 'quiz':
      itemSchema = quizSchema(item);
      break;
    case 'rhyme':
      itemSchema = videoSchema(item);
      break;
    case 'fun':
      itemSchema = howToSchema(item);
      break;
    case 'educational':
      itemSchema = learningResourceSchema({ ...item, category: opts.category || item.category || 'science' });
      break;
  }

  // Attach a BreadcrumbList alongside the item schema so search engines can
  // render breadcrumb rich snippets for every content page.
  if (itemSchema) {
    base.jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [itemSchema, breadcrumbSchema(buildBreadcrumbs(type, item, opts))],
    };
  }

  return base;
};
