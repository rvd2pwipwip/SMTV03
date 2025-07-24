// Home screen data utilities
// Handles fetching appropriate channel data for each filter category

import { getChannelsByCategory } from '../data/stingrayChannelsIndex';
import { fakeChannels } from '../data/fakeChannels';
import { genreFilters } from '../data/genreFilters';

/**
 * Get items (channels or categories) for a specific home filter, limited to maxItems
 * @param {string} filterId - The filter ID ('mostPopular', 'newReleases', 'recommendations', 'tvLineup')
 * @param {number} maxItems - Maximum number of items to return (default: 12)
 * @returns {Array} Array of channel objects or category objects (for TV Lineup)
 */
export const getChannelsForHomeFilter = (filterId, maxItems = 12) => {
  let items = [];

  switch (filterId) {
    case 'mostPopular':
      items = getChannelsByCategory('most popular');
      break;
    case 'newReleases':
      items = getChannelsByCategory('new releases');
      break;
    case 'recommendations':
      items = getChannelsByCategory('recommendations');
      break;
    case 'tvLineup':
      // TV Lineup shows genre subcategories instead of channels
      items = genreFilters;
      break;
    default:
      items = [];
  }

  // Limit to maxItems (12 items, leaving room for "More" tile)
  return items.slice(0, maxItems);
};

/**
 * Check if a category has more items than the display limit
 * Used to determine if "More" tile should be shown
 * @param {string} filterId - The filter ID
 * @param {number} maxItems - Maximum number of displayed items (default: 12)
 * @returns {boolean} True if there are more items available
 */
export const hasMoreChannels = (filterId, maxItems = 12) => {
  let totalItems = 0;

  switch (filterId) {
    case 'mostPopular':
      totalItems = getChannelsByCategory('most popular').length;
      break;
    case 'newReleases':
      totalItems = getChannelsByCategory('new releases').length;
      break;
    case 'recommendations':
      totalItems = getChannelsByCategory('recommendations').length;
      break;
    case 'tvLineup':
      totalItems = genreFilters.length;
      break;
    default:
      totalItems = 0;
  }

  return totalItems > maxItems;
};

/**
 * Get the total count of items for a filter category
 * @param {string} filterId - The filter ID
 * @returns {number} Total number of items (channels or categories) available
 */
export const getTotalChannelCount = filterId => {
  switch (filterId) {
    case 'mostPopular':
      return getChannelsByCategory('most popular').length;
    case 'newReleases':
      return getChannelsByCategory('new releases').length;
    case 'recommendations':
      return getChannelsByCategory('recommendations').length;
    case 'tvLineup':
      return genreFilters.length;
    default:
      return 0;
  }
};

/**
 * Determine if a filter returns channels or categories
 * @param {string} filterId - The filter ID
 * @returns {string} 'channels' or 'categories'
 */
export const getFilterDataType = filterId => {
  return filterId === 'tvLineup' ? 'categories' : 'channels';
};
