import React, { useState, useEffect } from 'react';
import Home from './screens/Home';
import ChannelInfo from './screens/ChannelInfo';
import Player from './screens/Player';
import { FocusMemoryProvider, useFocusMemory } from './contexts/FocusMemoryContext';
import './styles/App.css';

function AppContent() {
  const [screenStack, setScreenStack] = useState(['home']);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const { saveFocus, restoreFocus, updateCurrentScreen } = useFocusMemory();

  // Screen navigation functions
  const pushScreen = (screen, data = null) => {
    // Save focus before leaving current screen
    const currentScreen = screenStack[screenStack.length - 1];
    const focusedElement = document.querySelector('[data-focus-key]:focus');
    if (focusedElement) {
      const stableId = focusedElement.getAttribute('data-stable-id');
      if (stableId) {
        saveFocus(currentScreen, stableId);
      }
    }

    setScreenStack([...screenStack, screen]);
    if (data) setSelectedChannel(data);
    updateCurrentScreen(screen);
  };

  const popScreen = () => {
    // Save focus before leaving current screen
    const currentScreen = screenStack[screenStack.length - 1];
    const focusedElement = document.querySelector('[data-focus-key]:focus');
    if (focusedElement) {
      const stableId = focusedElement.getAttribute('data-stable-id');
      if (stableId) {
        saveFocus(currentScreen, stableId);
      }
    }

    setScreenStack(screenStack.slice(0, -1));
    const previousScreen = screenStack[screenStack.length - 2];
    if (previousScreen === 'home') {
      setSelectedChannel(null);
    }
    updateCurrentScreen(previousScreen);
    
    // Restore focus on the previous screen
    const stableId = restoreFocus(previousScreen);
    if (stableId) {
      const element = document.querySelector(`[data-stable-id="${stableId}"]`);
      if (element) {
        const focusKey = element.getAttribute('data-focus-key');
        if (focusKey) {
          setFocus(focusKey);
        }
      }
    }
  };

  // Global 'B' key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'b' && screenStack.length > 1) {
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
          onChannelSelect={(channel) => pushScreen('channelInfo', channel)}
        />
      )}
      {currentScreen === 'channelInfo' && (
        <ChannelInfo 
          channel={selectedChannel}
          onBack={popScreen}
          onPlay={() => pushScreen('player', selectedChannel)}
        />
      )}
      {currentScreen === 'player' && (
        <Player 
          channel={selectedChannel}
          onBack={popScreen}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <FocusMemoryProvider>
      <AppContent />
    </FocusMemoryProvider>
  );
}

export default App;