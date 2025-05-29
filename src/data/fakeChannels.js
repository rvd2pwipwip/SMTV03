// Fake channel data for testing FixedSwimlane with ChannelCard
export const fakeChannels = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Sample Channel ${i + 1}`,
  thumbnailUrl: `/assets/channels/${i + 1}.jpg`,
})); 