import React, { createContext, useContext, useState } from 'react';

/**
 * FocusContext: Manages which group is focused (vertical navigation).
 * Each group manages its own left/right navigation and focus memory.
 */
const FocusContext = createContext();

export function FocusProvider({ children, groupCount }) {
  // Index of the currently focused group (vertical)
  const [focusedGroupIndex, setFocusedGroupIndex] = useState(0);

  /**
   * Move focus between groups (up/down)
   */
  function moveVertical(direction) {
    setFocusedGroupIndex((prev) => {
      if (direction === 'down') return Math.min(prev + 1, groupCount - 1);
      if (direction === 'up') return Math.max(prev - 1, 0);
      return prev;
    });
  }

  return (
    <FocusContext.Provider value={{
      focusedGroupIndex,
      moveVertical,
      setFocusedGroupIndex,
    }}>
      {children}
    </FocusContext.Provider>
  );
}

export function useFocusContext() {
  return useContext(FocusContext);
} 