import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './screens/Home';
import ChannelInfo from './screens/ChannelInfo';
import SearchBrowse from './screens/SearchBrowse';
import './styles/App.css';
import { GroupFocusNavigationProvider } from './contexts/GroupFocusNavigationContext';
import { ScreenMemoryProvider } from './contexts/ScreenMemoryContext';
import { PlayerProvider, usePlayer } from './contexts/PlayerContext';
import PlayerOverlay from './components/PlayerOverlay';
import MiniPlayer from './components/MiniPlayer';

// Inner component that can access PlayerContext
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isPlayerOpen } = usePlayer();

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        // Don't navigate if player overlay is open - let PlayerOverlay handle it
        if (isPlayerOpen) {
          return;
        }
        // Only navigate back if not on Home
        if (location.pathname !== '/') {
          e.preventDefault();
          navigate(-1);
        }
        // Optionally, you could show a toast or do nothing on Home
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, location.pathname, isPlayerOpen]);

  return (
    <GroupFocusNavigationProvider baseGroupCount={3} initialGroupIndex={2}>
      <ScreenMemoryProvider>
        <div
          className="app-content"
          style={{
            width: '1920px',
            height: '1080px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            background: 'var(--app-background, #000)',
            margin: '0 auto',
            position: 'absolute',
            overflow: 'hidden',
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search-browse" element={<SearchBrowse />} />
            <Route path="/channel-info/:channelId" element={<ChannelInfo />} />
          </Routes>

          {/* Mini Player - positioned absolutely above AdBanner */}
          <MiniPlayer />
        </div>
        <PlayerOverlay />
      </ScreenMemoryProvider>
    </GroupFocusNavigationProvider>
  );
}

function App() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
}

export default App;
