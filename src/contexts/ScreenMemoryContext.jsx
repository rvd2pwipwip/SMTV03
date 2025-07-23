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
    // Example: home: { activeFilterId, lastFocusedId, focusedGroupIndex }
  });

  // Helper to update memory for a screen
  const setScreenField = (screen, field, value) => {
    // console.trace('setScreenField called', {screen, field, value});
    setScreenMemory(mem => ({
      ...mem,
      [screen]: { ...mem[screen], [field]: value },
    }));
  };

  // LEARNING: Helper Functions for Focus Group Management
  // These provide a clean API for screens to manage their focused group state
  // Think of this as a "focus bookmark" - each screen remembers which group was last focused

  // Get the focused group index for a screen (with fallback to default)
  const getScreenFocusedGroupIndex = (screen, defaultGroupIndex = 0) => {
    return screenMemory[screen]?.focusedGroupIndex ?? defaultGroupIndex;
  };

  // Set the focused group index for a screen
  const setScreenFocusedGroupIndex = (screen, groupIndex) => {
    setScreenField(screen, 'focusedGroupIndex', groupIndex);
  };

  return (
    <ScreenMemoryContext.Provider
      value={{
        screenMemory,
        setScreenField,
        getScreenFocusedGroupIndex,
        setScreenFocusedGroupIndex,
      }}
      {...props}
    >
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
  const { screenMemory, setScreenField, getScreenFocusedGroupIndex, setScreenFocusedGroupIndex } =
    useContext(ScreenMemoryContext);
  return {
    memory: screenMemory[screen] || {},
    setField: (field, value) => setScreenField(screen, field, value),
    // LEARNING: Screen-specific focus group helpers
    // These make it easy for screens to manage their own focus state
    getFocusedGroupIndex: defaultGroupIndex =>
      getScreenFocusedGroupIndex(screen, defaultGroupIndex),
    setFocusedGroupIndex: groupIndex => setScreenFocusedGroupIndex(screen, groupIndex),
  };
}
