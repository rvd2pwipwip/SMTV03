// Fake browse categories data based on Figma design
// https://www.figma.com/design/141y3RaYYkdrj6ahAAyAuf/SMTV-HTML?node-id=7524-337143&t=GcVt1Nwd5HJU57Fx-4

import { fakeChannels } from './fakeChannels';

// Generate fake channels for each category
const generateCategoryChannels = (categoryName, count = 15) => {
  return Array.from({ length: count }, (_, i) => ({
    ...fakeChannels[i % fakeChannels.length],
    id: `${categoryName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${i + 1}`,
    title: `${categoryName} ${i + 1}`,
    category: categoryName,
  }));
};

export const fakeBrowseCategories = {
  genre: {
    id: 'genre',
    label: 'Genre',
    categories: [
      {
        id: 'classical',
        name: 'Classical',
        channels: generateCategoryChannels('Classical'),
      },
      {
        id: 'country-roots',
        name: 'Country and Roots',
        channels: generateCategoryChannels('Country and Roots'),
      },
      {
        id: 'electronic',
        name: 'Electronic',
        channels: generateCategoryChannels('Electronic'),
      },
      {
        id: 'hip-hop',
        name: 'Hip-Hop',
        channels: generateCategoryChannels('Hip-Hop'),
      },
      {
        id: 'indie',
        name: 'Indie',
        channels: generateCategoryChannels('Indie'),
      },
      {
        id: 'jazz-blues',
        name: 'Jazz & Blues',
        channels: generateCategoryChannels('Jazz & Blues'),
      },
      {
        id: 'kids-teens',
        name: 'Kids and Teens',
        channels: generateCategoryChannels('Kids and Teens'),
      },
      {
        id: 'latin',
        name: 'Latin',
        channels: generateCategoryChannels('Latin'),
      },
      {
        id: 'miscellaneous',
        name: 'Miscellaneous',
        channels: generateCategoryChannels('Miscellaneous'),
      },
      {
        id: 'pop',
        name: 'Pop',
        channels: generateCategoryChannels('Pop'),
      },
      {
        id: 'praise-worship',
        name: 'Praise and Worship',
        channels: generateCategoryChannels('Praise and Worship'),
      },
      {
        id: 'rb-soul',
        name: 'R&B/Soul',
        channels: generateCategoryChannels('R&B/Soul'),
      },
      {
        id: 'rock',
        name: 'Rock',
        channels: generateCategoryChannels('Rock'),
      },
      {
        id: 'singer-songwriter',
        name: 'Singer-Songwriter',
        channels: generateCategoryChannels('Singer-Songwriter'),
      },
      {
        id: 'world',
        name: 'World',
        channels: generateCategoryChannels('World'),
      },
    ],
  },

  activity: {
    id: 'activity',
    label: 'Activity',
    categories: [
      {
        id: 'around-house',
        name: 'Around the House',
        channels: generateCategoryChannels('Around the House'),
      },
      {
        id: 'driving-commuting',
        name: 'Driving/Commuting',
        channels: generateCategoryChannels('Driving/Commuting'),
      },
      {
        id: 'entertaining',
        name: 'Entertaining',
        channels: generateCategoryChannels('Entertaining'),
      },
      {
        id: 'exercise',
        name: 'Exercise',
        channels: generateCategoryChannels('Exercise'),
      },
      {
        id: 'family-time',
        name: 'Family Time',
        channels: generateCategoryChannels('Family Time'),
      },
      {
        id: 'focus',
        name: 'Focus',
        channels: generateCategoryChannels('Focus'),
      },
      {
        id: 'party',
        name: 'Party!',
        channels: generateCategoryChannels('Party!'),
      },
      {
        id: 'relaxation',
        name: 'Relaxation',
        channels: generateCategoryChannels('Relaxation'),
      },
      {
        id: 'romance',
        name: 'Romance',
        channels: generateCategoryChannels('Romance'),
      },
    ],
  },

  mood: {
    id: 'mood',
    label: 'Mood',
    categories: [
      {
        id: 'adventurous',
        name: 'Adventurous',
        channels: generateCategoryChannels('Adventurous'),
      },
      {
        id: 'bold',
        name: 'Bold',
        channels: generateCategoryChannels('Bold'),
      },
      {
        id: 'cerebral',
        name: 'Cerebral',
        channels: generateCategoryChannels('Cerebral'),
      },
      {
        id: 'chill',
        name: 'Chill',
        channels: generateCategoryChannels('Chill'),
      },
      {
        id: 'cute',
        name: 'Cute',
        channels: generateCategoryChannels('Cute'),
      },
      {
        id: 'defiant',
        name: 'Defiant',
        channels: generateCategoryChannels('Defiant'),
      },
      {
        id: 'dramatic',
        name: 'Dramatic',
        channels: generateCategoryChannels('Dramatic'),
      },
      {
        id: 'earthy',
        name: 'Earthy',
        channels: generateCategoryChannels('Earthy'),
      },
      {
        id: 'elegant',
        name: 'Elegant',
        channels: generateCategoryChannels('Elegant'),
      },
      {
        id: 'energetic',
        name: 'Energetic',
        channels: generateCategoryChannels('Energetic'),
      },
      {
        id: 'festive',
        name: 'Festive',
        channels: generateCategoryChannels('Festive'),
      },
      {
        id: 'fun',
        name: 'Fun',
        channels: generateCategoryChannels('Fun'),
      },
      {
        id: 'furious',
        name: 'Furious',
        channels: generateCategoryChannels('Furious'),
      },
      {
        id: 'happy',
        name: 'Happy',
        channels: generateCategoryChannels('Happy'),
      },
      {
        id: 'melancholy',
        name: 'Melancholy',
        channels: generateCategoryChannels('Melancholy'),
      },
      {
        id: 'nostalgic',
        name: 'Nostalgic',
        channels: generateCategoryChannels('Nostalgic'),
      },
      {
        id: 'powerful',
        name: 'Powerful',
        channels: generateCategoryChannels('Powerful'),
      },
      {
        id: 'quirky',
        name: 'Quirky',
        channels: generateCategoryChannels('Quirky'),
      },
      {
        id: 'romantic',
        name: 'Romantic',
        channels: generateCategoryChannels('Romantic'),
      },
      {
        id: 'sexy',
        name: 'Sexy',
        channels: generateCategoryChannels('Sexy'),
      },
      {
        id: 'silly',
        name: 'Silly',
        channels: generateCategoryChannels('Silly'),
      },
      {
        id: 'trendy',
        name: 'Trendy',
        channels: generateCategoryChannels('Trendy'),
      },
      {
        id: 'uplifted',
        name: 'Uplifted',
        channels: generateCategoryChannels('Uplifted'),
      },
      {
        id: 'zen',
        name: 'Zen',
        channels: generateCategoryChannels('Zen'),
      },
    ],
  },

  era: {
    id: 'era',
    label: 'Era',
    categories: [
      {
        id: 'today',
        name: 'Today',
        channels: generateCategoryChannels('Today'),
      },
      {
        id: '2020s',
        name: '2020s',
        channels: generateCategoryChannels('2020s'),
      },
      {
        id: '2010s',
        name: '2010s',
        channels: generateCategoryChannels('2010s'),
      },
      {
        id: '2000s',
        name: '2000s',
        channels: generateCategoryChannels('2000s'),
      },
      {
        id: '1990s',
        name: '1990s',
        channels: generateCategoryChannels('1990s'),
      },
      {
        id: '1980s',
        name: '1980s',
        channels: generateCategoryChannels('1980s'),
      },
      {
        id: '1970s',
        name: '1970s',
        channels: generateCategoryChannels('1970s'),
      },
      {
        id: '1960s',
        name: '1960s',
        channels: generateCategoryChannels('1960s'),
      },
      {
        id: '1950s',
        name: '1950s',
        channels: generateCategoryChannels('1950s'),
      },
      {
        id: '1940s',
        name: '1940s',
        channels: generateCategoryChannels('1940s'),
      },
    ],
  },

  theme: {
    id: 'theme',
    label: 'Theme',
    categories: [
      {
        id: 'africa',
        name: 'Africa',
        channels: generateCategoryChannels('Africa'),
      },
      {
        id: 'artist-channel',
        name: 'Artist Channel',
        channels: generateCategoryChannels('Artist Channel'),
      },
      {
        id: 'asia',
        name: 'Asia',
        channels: generateCategoryChannels('Asia'),
      },
      {
        id: 'best-of-lists',
        name: 'Best of Lists',
        channels: generateCategoryChannels('Best of Lists'),
      },
      {
        id: 'caribbean',
        name: 'Caribbean',
        channels: generateCategoryChannels('Caribbean'),
      },
      {
        id: 'europe',
        name: 'Europe',
        channels: generateCategoryChannels('Europe'),
      },
      {
        id: 'francophonie',
        name: 'Francophonie',
        channels: generateCategoryChannels('Francophonie'),
      },
      {
        id: 'instrumental',
        name: 'Instrumental',
        channels: generateCategoryChannels('Instrumental'),
      },
      {
        id: 'latin-america',
        name: 'Latin America',
        channels: generateCategoryChannels('Latin America'),
      },
      {
        id: 'middle-east',
        name: 'Middle East',
        channels: generateCategoryChannels('Middle East'),
      },
      {
        id: 'north-america',
        name: 'North America',
        channels: generateCategoryChannels('North America'),
      },
      {
        id: 'special-curator',
        name: 'Special Curator',
        channels: generateCategoryChannels('Special Curator'),
      },
      {
        id: 'special-occasions',
        name: 'Special Occasions',
        channels: generateCategoryChannels('Special Occasions'),
      },
      {
        id: 'holidays-christmas',
        name: 'The Holidays / Christmas',
        channels: generateCategoryChannels('The Holidays / Christmas'),
      },
      {
        id: 'vocal',
        name: 'Vocal',
        channels: generateCategoryChannels('Vocal'),
      },
    ],
  },
};

// Helper function to get channels for a specific category
export const getChannelsForCategory = (mainCategory, categoryId) => {
  const category = fakeBrowseCategories[mainCategory]?.categories.find(
    cat => cat.id === categoryId
  );
  return category ? category.channels : [];
};

// Helper function to get all categories for a main filter
export const getCategoriesForFilter = mainCategory => {
  return fakeBrowseCategories[mainCategory]?.categories || [];
};
