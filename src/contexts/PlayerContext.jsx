import React, { createContext, useContext, useState } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const openPlayer = () => {
    console.log('Opening player overlay');
    setIsPlayerOpen(true);
  };

  const closePlayer = () => {
    console.log('Closing player overlay');
    setIsPlayerOpen(false);
  };

  const value = {
    isPlayerOpen,
    openPlayer,
    closePlayer,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};
