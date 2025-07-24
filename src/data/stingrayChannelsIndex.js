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

// Helper function to deduplicate channels by ID
const deduplicateChannels = channels => {
  const seen = new Set();
  return channels.filter(channel => {
    if (seen.has(channel.id)) {
      return false;
    }
    seen.add(channel.id);
    return true;
  });
};

// Combined dataset with duplicates removed
// Priority: Most Popular > New Releases > Recommendations
export const allStingrayChannels = deduplicateChannels([
  ...stingrayChannels,
  ...newReleasesChannels,
  ...recommendationsChannels,
]);

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
  const originalTotal =
    stingrayChannels.length + newReleasesChannels.length + recommendationsChannels.length;
  const duplicatesRemoved = originalTotal - allStingrayChannels.length;

  return {
    totalChannels: allStingrayChannels.length,
    mostPopular: stingrayChannels.length,
    newReleases: newReleasesChannels.length,
    recommendations: recommendationsChannels.length,
    originalTotal,
    duplicatesRemoved,
    totalGenres: [...new Set(allStingrayChannels.map(c => c.genre))].length,
    francophoneChannels: getFrancophoneNewReleases().length,
    bestOf2025: getBestOf2025Channels().length,
    retroChannels: getRetroRecommendations().length,
    workoutChannels: getWorkoutRecommendations().length,
  };
};

// Debug function to find any remaining duplicates
export const findDuplicateChannels = () => {
  const idCounts = {};
  allStingrayChannels.forEach(channel => {
    idCounts[channel.id] = (idCounts[channel.id] || 0) + 1;
  });

  const duplicates = Object.entries(idCounts)
    .filter(([id, count]) => count > 1)
    .map(([id, count]) => ({ id, count }));

  return duplicates;
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
