// ScreenMemoryContext: Handles persistent per-screen state (e.g., activeFilterId, lastFocusedId, etc.)
// Use for restoring screen state across navigation, not for group focus within a screen.
/**
 * FocusNavigationContext - provides navigation and screen memory for TV app
 *
 * Now supports robust per-screen memory (e.g., activeFilterId, lastFocusedId, etc.)
 * Use useFocusNavigationMemory(screen) to access/update memory for a screen.
 */
import React, { createContext, useContext, useState } from 'react';

const ScreenMemoryContext = createContext();

export function ScreenMemoryProvider({ children, ...props }) {
  // Each screen can have its own memory object
  const [screenMemory, setScreenMemory] = useState({
    // Example: home: { activeFilterId, lastFocusedId }
  });

  // Helper to update memory for a screen
  const setScreenField = (screen, field, value) => {
    setScreenMemory(mem => ({
      ...mem,
      [screen]: { ...mem[screen], [field]: value }
    }));
  };

  return (
    <ScreenMemoryContext.Provider value={{ screenMemory, setScreenField }} {...props}>
      {children}
    </ScreenMemoryContext.Provider>
  );
}

/**
 * useScreenMemory(screen)
 * - Returns { memory, setField } for the given screen
 * - memory: the memory object for the screen (e.g., { activeFilterId, lastFocusedId })
 * - setField: (field, value) => void, updates a field in the screen's memory
 */
export function useScreenMemory(screen) {
  const { screenMemory, setScreenField } = useContext(ScreenMemoryContext);
  return {
    memory: screenMemory[screen] || {},
    setField: (field, value) => setScreenField(screen, field, value),
  };
} 