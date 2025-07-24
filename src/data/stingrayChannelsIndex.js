// Unified Stingray Music channel dataset
// Combines Most Popular, New Releases, and Recommendations for comprehensive mock data

import { stingrayChannels, getMostPopularChannels } from './realStingrayChannels';
import {
  newReleasesChannels,
  getAllNewReleases,
  getFrancophoneNewReleases,
  getBestOf2025Channels,
} from './newReleasesChannels';
import {
  recommendationsChannels,
  getAllRecommendations,
  getRetroRecommendations,
  getWorkoutRecommendations,
  getTeenPopRecommendations,
  getTrendingRecommendations,
} from './recommendationsChannels';

// Combined dataset
export const allStingrayChannels = [
  ...stingrayChannels,
  ...newReleasesChannels,
  ...recommendationsChannels,
];

// Export individual datasets
export { stingrayChannels as mostPopularChannels } from './realStingrayChannels';
export { newReleasesChannels } from './newReleasesChannels';
export { recommendationsChannels } from './recommendationsChannels';

// Content category functions
export const getChannelsByCategory = category => {
  switch (category.toLowerCase()) {
    case 'most popular':
    case 'mostpopular':
      return getMostPopularChannels();
    case 'new releases':
    case 'newreleases':
      return getAllNewReleases();
    case 'recommendations':
      return getAllRecommendations();
    case 'francophone':
      return getFrancophoneNewReleases();
    case 'best of 2025':
    case 'bestof2025':
      return getBestOf2025Channels();
    case 'retro':
      return getRetroRecommendations();
    case 'workout':
      return getWorkoutRecommendations();
    case 'teen pop':
    case 'teenpop':
      return getTeenPopRecommendations();
    case 'trending':
      return getTrendingRecommendations();
    default:
      return [];
  }
};

// Genre filtering across all channels
export const getAllChannelsByGenre = genre => {
  return allStingrayChannels.filter(channel => channel.genre.toLowerCase() === genre.toLowerCase());
};

// Tag filtering across all channels
export const getAllChannelsByTag = tag => {
  return allStingrayChannels.filter(channel =>
    channel.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
};

// Get top channels by play count across all datasets
export const getTopChannelsGlobally = (limit = 10) => {
  return [...allStingrayChannels].sort((a, b) => b.playCount - a.playCount).slice(0, limit);
};

// Search function across all channels
export const searchChannels = query => {
  const searchTerm = query.toLowerCase();
  return allStingrayChannels.filter(
    channel =>
      channel.title.toLowerCase().includes(searchTerm) ||
      channel.description.toLowerCase().includes(searchTerm) ||
      channel.genre.toLowerCase().includes(searchTerm) ||
      channel.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

// Get random channels for recommendations
export const getRandomChannels = (count = 6) => {
  const shuffled = [...allStingrayChannels].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Content stats
export const getChannelStats = () => {
  return {
    totalChannels: allStingrayChannels.length,
    mostPopular: stingrayChannels.length,
    newReleases: newReleasesChannels.length,
    recommendations: recommendationsChannels.length,
    totalGenres: [...new Set(allStingrayChannels.map(c => c.genre))].length,
    francophoneChannels: getFrancophoneNewReleases().length,
    bestOf2025: getBestOf2025Channels().length,
    retroChannels: getRetroRecommendations().length,
    workoutChannels: getWorkoutRecommendations().length,
  };
};

// Export everything for easy importing
export {
  getMostPopularChannels,
  getAllNewReleases,
  getAllRecommendations,
  getFrancophoneNewReleases,
  getBestOf2025Channels,
  getRetroRecommendations,
  getWorkoutRecommendations,
  getTeenPopRecommendations,
  getTrendingRecommendations,
};
