// Simulated search results data
// In a real app, this would come from an API call
export const generateFakeSearchResults = query => {
  // If no query or query too short, return empty results
  if (!query || query.length < 2) {
    return {
      channels: [],
      artists: [],
      radio: [],
      vibes: [],
    };
  }

  // Simulate search results based on query
  const lowerQuery = query.toLowerCase();

  return {
    channels: mockChannels.filter(channel => channel.title.toLowerCase().includes(lowerQuery)),
    artists: mockArtists.filter(artist => artist.name.toLowerCase().includes(lowerQuery)),
    radio: mockRadio.filter(radio => radio.title.toLowerCase().includes(lowerQuery)),
    vibes: mockVibes.filter(vibe => vibe.title.toLowerCase().includes(lowerQuery)),
  };
};

// Mock data for search results
const mockChannels = [
  { id: 'ch1', title: "Jazz Lovers' Groove", thumbnailUrl: null, type: 'channel' },
  { id: 'ch2', title: "Rockin' Love Anthems", thumbnailUrl: null, type: 'channel' },
  { id: 'ch3', title: "Pop Lovers' Paradise", thumbnailUrl: null, type: 'channel' },
  { id: 'ch4', title: 'Ballads of the Heart', thumbnailUrl: null, type: 'channel' },
  { id: 'ch5', title: 'Country Love Songs', thumbnailUrl: null, type: 'channel' },
  { id: 'ch6', title: 'R&B Love Vibes', thumbnailUrl: null, type: 'channel' },
  { id: 'ch7', title: 'Classical Love Serenades', thumbnailUrl: null, type: 'channel' },
  { id: 'ch8', title: 'Indie Love Tunes', thumbnailUrl: null, type: 'channel' },
  { id: 'ch9', title: 'Reggae Love Rhythms', thumbnailUrl: null, type: 'channel' },
  { id: 'ch10', title: 'Hip-Hop Love Beats', thumbnailUrl: null, type: 'channel' },
  { id: 'ch11', title: 'Blues of the Lovers', thumbnailUrl: null, type: 'channel' },
  { id: 'ch12', title: 'Electronic Love Waves', thumbnailUrl: null, type: 'channel' },
];

const mockArtists = [
  { id: 'ar1', name: 'The Love Birds', type: 'artist' },
  { id: 'ar2', name: 'Lovesick Symphony', type: 'artist' },
  { id: 'ar3', name: 'Romance Revival', type: 'artist' },
  { id: 'ar4', name: 'Beloved Harmonies', type: 'artist' },
  { id: 'ar5', name: 'Love Letter Band', type: 'artist' },
];

const mockRadio = [
  { id: 'ra1', title: 'Love Songs Radio', thumbnailUrl: null, type: 'radio' },
  { id: 'ra2', title: 'Romantic Classics FM', thumbnailUrl: null, type: 'radio' },
  { id: 'ra3', title: "Lover's Choice Radio", thumbnailUrl: null, type: 'radio' },
];

const mockVibes = [
  { id: 'vi1', title: 'Romantic Evening', thumbnailUrl: null, type: 'vibe' },
  { id: 'vi2', title: 'Love & Devotion', thumbnailUrl: null, type: 'vibe' },
  { id: 'vi3', title: 'Passionate Romance', thumbnailUrl: null, type: 'vibe' },
];
