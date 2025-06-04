import React, { useState, useEffect } from 'react';
import Home from './screens/Home';
import ChannelInfo from './screens/ChannelInfo';
import Player from './screens/Player';
import './styles/App.css';
import { GroupFocusNavigationProvider } from './contexts/GroupFocusNavigationContext';
import { ScreenMemoryProvider } from './contexts/ScreenMemoryContext';

function AppContent() {
  const [screenStack, setScreenStack] = useState(['home']);
  const [selectedChannel, setSelectedChannel] = useState(null);

  // Screen navigation functions
  const pushScreen = (screen, data = null) => {
    setScreenStack([...screenStack, screen]);
    if (data) setSelectedChannel(data);
  };

  const popScreen = () => {
    setScreenStack(screenStack.slice(0, -1));
    const previousScreen = screenStack[screenStack.length - 2];
    if (previousScreen === 'home') {
      setSelectedChannel(null);
    }
  };

  // Global 'Escape' key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && screenStack.length > 1) {
        e.preventDefault();
        popScreen();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [screenStack]);

  // Get current screen
  const currentScreen = screenStack[screenStack.length - 1];

  return (
    <div className="app">
      {currentScreen === 'home' && (
        <Home 
          onChannelSelect={(channel) => { pushScreen('channelInfo', channel); }}
        />
      )}
      {currentScreen === 'channelInfo' && (
        <ChannelInfo 
          channel={selectedChannel}
          onBack={() => { popScreen(); }}
          onPlay={() => { pushScreen('player', selectedChannel); }}
        />
      )}
      {currentScreen === 'player' && (
        <Player 
          channel={selectedChannel}
          onBack={() => { popScreen(); }}
        />
      )}
    </div>
  );
}

function App() {
  // Home: header=0, filters=1, swimlane=2
  return (
    <GroupFocusNavigationProvider groupCount={3} initialGroupIndex={2}>
      <ScreenMemoryProvider>
        <AppContent />
      </ScreenMemoryProvider>
    </GroupFocusNavigationProvider>
  );
}

export default App;