// Related channels algorithm
// Finds channels with similar tags, prioritizing matches based on tag position

import { allStingrayChannels } from '../data/stingrayChannelsIndex';

/**
 * Calculate similarity score between two channels based on tag matching
 * @param {Object} currentChannel - The current channel object
 * @param {Object} candidateChannel - The candidate related channel
 * @returns {number} Similarity score (higher = more similar)
 */
const calculateSimilarityScore = (currentChannel, candidateChannel) => {
  if (!currentChannel.tags || !candidateChannel.tags) return 0;

  let score = 0;

  // Convert tags to lowercase for comparison
  const currentTags = currentChannel.tags.map(tag =>
    typeof tag === 'string' ? tag.toLowerCase() : tag.label?.toLowerCase() || ''
  );

  const candidateTags = candidateChannel.tags.map(tag =>
    typeof tag === 'string' ? tag.toLowerCase() : tag.label?.toLowerCase() || ''
  );

  // Score based on tag position priority
  // First tag matches get highest weight, decreasing for later positions
  currentTags.forEach((currentTag, index) => {
    if (candidateTags.includes(currentTag)) {
      // Position-based weighting: 1st tag = 5 points, 2nd = 4, 3rd = 3, 4th = 2, 5th+ = 1
      const positionWeight = Math.max(1, 6 - index);
      score += positionWeight;
    }
  });

  return score;
};

/**
 * Find related channels based on tag similarity
 * @param {string} currentChannelId - ID of the current channel
 * @param {number} maxResults - Maximum number of related channels to return (default: 5)
 * @returns {Array} Array of related channel objects, sorted by similarity
 */
export const getRelatedChannels = (currentChannelId, maxResults = 5) => {
  // Find the current channel
  const currentChannel = allStingrayChannels.find(
    channel => String(channel.id) === String(currentChannelId)
  );

  if (!currentChannel) {
    console.warn(`Channel with ID ${currentChannelId} not found`);
    return [];
  }

  // Get all other channels (exclude current channel)
  const otherChannels = allStingrayChannels.filter(
    channel => String(channel.id) !== String(currentChannelId)
  );

  // Calculate similarity scores and sort
  const channelsWithScores = otherChannels.map(channel => ({
    ...channel,
    similarityScore: calculateSimilarityScore(currentChannel, channel),
  }));

  // Sort by similarity score (highest first), then by play count as tiebreaker
  const sortedChannels = channelsWithScores
    .filter(channel => channel.similarityScore > 0) // Only include channels with at least one tag match
    .sort((a, b) => {
      if (b.similarityScore !== a.similarityScore) {
        return b.similarityScore - a.similarityScore;
      }
      // Tiebreaker: higher play count wins
      return (b.playCount || 0) - (a.playCount || 0);
    });

  // Additional safety check: ensure no duplicate IDs in results
  const seen = new Set();
  const uniqueChannels = sortedChannels.filter(channel => {
    if (seen.has(channel.id)) {
      return false;
    }
    seen.add(channel.id);
    return true;
  });

  // Return top results without the similarity score
  return uniqueChannels.slice(0, maxResults).map(({ similarityScore, ...channel }) => channel);
};

/**
 * Get debug information about related channel scoring
 * @param {string} currentChannelId - ID of the current channel
 * @param {number} maxResults - Maximum number of results to analyze
 * @returns {Object} Debug information including scores and tag matches
 */
export const getRelatedChannelsDebug = (currentChannelId, maxResults = 10) => {
  const currentChannel = allStingrayChannels.find(
    channel => String(channel.id) === String(currentChannelId)
  );

  if (!currentChannel) return { error: 'Channel not found' };

  const otherChannels = allStingrayChannels.filter(
    channel => String(channel.id) !== String(currentChannelId)
  );

  const results = otherChannels
    .map(channel => {
      const score = calculateSimilarityScore(currentChannel, channel);

      // Find matching tags for debug
      const currentTags =
        currentChannel.tags?.map(tag =>
          typeof tag === 'string' ? tag.toLowerCase() : tag.label?.toLowerCase() || ''
        ) || [];

      const candidateTags =
        channel.tags?.map(tag =>
          typeof tag === 'string' ? tag.toLowerCase() : tag.label?.toLowerCase() || ''
        ) || [];

      const matchingTags = currentTags.filter(tag => candidateTags.includes(tag));

      return {
        id: channel.id,
        title: channel.title,
        score,
        matchingTags,
        currentChannelTags: currentTags,
        candidateChannelTags: candidateTags,
      };
    })
    .sort((a, b) => b.score - a.score);

  return {
    currentChannel: {
      id: currentChannel.id,
      title: currentChannel.title,
      tags: currentChannel.tags,
    },
    results: results.slice(0, maxResults),
  };
};
