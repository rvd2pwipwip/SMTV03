import React, { createContext, useContext, useState } from 'react';

const FocusMemoryContext = createContext();

export function FocusMemoryProvider({ children }) {
  // Store only stable IDs for each screen
  // Example: { "home": "home-card-2", "channelInfo": "info-1" }
  const [focusMemory, setFocusMemory] = useState({});
  const [currentScreen, setCurrentScreen] = useState('home');

  // Save an object with both focusKey and offset for the current screen
  const saveFocus = (screenName, data) => {
    setFocusMemory(prev => ({
      ...prev,
      [screenName]: data // data: { focusKey, offset }
    }));
  };

  // Get the object (focusKey and offset) for a screen
  const restoreFocus = (screenName) => {
    const value = focusMemory[screenName];
    // Migration logic: if value is a string, treat as old stableId format
    if (typeof value === 'string') {
      return { stableId: value, offset: 0 };
    }
    return value;
  };

  // Update which screen is currently active
  const updateCurrentScreen = (screenName) => {
    setCurrentScreen(screenName);
  };

  return (
    <FocusMemoryContext.Provider value={{
      focusMemory,
      currentScreen,
      saveFocus,
      restoreFocus,
      updateCurrentScreen
    }}>
      {children}
    </FocusMemoryContext.Provider>
  );
}

export function useFocusMemory() {
  const context = useContext(FocusMemoryContext);
  if (!context) {
    throw new Error('useFocusMemory must be used within a FocusMemoryProvider');
  }
  return context;
} 