import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * FocusNavigationContext - modular vertical navigation context for TV UIs
 *
 * Provides:
 * - focusedGroupIndex: which vertical group is focused (header, filters, swimlane, etc)
 * - setFocusedGroupIndex: set focus programmatically
 * - moveFocusUp / moveFocusDown: move focus between groups
 * - groupCount: total number of vertical groups
 *
 * Usage:
 * - Wrap your app (or main content) in <FocusNavigationProvider groupCount={3}>
 * - Use useFocusNavigation() in screens/components
 * - Pass focused={focusedGroupIndex === ...} to each group
 * - Call moveFocusUp/moveFocusDown on up/down key events
 */
const FocusNavigationContext = createContext();

export function FocusNavigationProvider({ groupCount = 3, children }) {
  // Which group is currently focused (0 = header, 1 = filters, 2 = swimlane, ...)
  const [focusedGroupIndex, setFocusedGroupIndex] = useState(0);

  // Move focus up (to previous group)
  const moveFocusUp = useCallback(() => {
    setFocusedGroupIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Move focus down (to next group)
  const moveFocusDown = useCallback(() => {
    setFocusedGroupIndex((prev) => Math.min(prev + 1, groupCount - 1));
  }, [groupCount]);

  // Context value
  const value = {
    focusedGroupIndex,
    setFocusedGroupIndex,
    moveFocusUp,
    moveFocusDown,
    groupCount,
  };

  return (
    <FocusNavigationContext.Provider value={value}>
      {children}
    </FocusNavigationContext.Provider>
  );
}

// Hook to use the navigation context
export function useFocusNavigation() {
  const ctx = useContext(FocusNavigationContext);
  if (!ctx) throw new Error('useFocusNavigation must be used within a FocusNavigationProvider');
  return ctx;
} 