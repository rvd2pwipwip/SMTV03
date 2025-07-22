// GroupFocusNavigationContext: Handles vertical group navigation and per-group focus memory for TV UIs.
// Use for up/down navigation and restoring focus within a screen.
// Not for persistent screen state across navigation.
import React, { createContext, useContext, useState, useCallback } from 'react';
import { usePlayer } from './PlayerContext';

/**
 * FocusNavigationContext - modular vertical navigation context for TV UIs
 *
 * Provides:
 * - focusedGroupIndex: which vertical group is focused (header, filters, swimlane, etc)
 * - setFocusedGroupIndex: set focus programmatically
 * - moveFocusUp / moveFocusDown: move focus between groups
 * - groupCount: total number of vertical groups
 * - focusMemory: remembers focusedIndex and offset for each group
 * - setGroupFocusMemory: update memory for a group
 * - getGroupFocusMemory: get memory for a group
 *
 * Usage:
 * - Wrap your app (or main content) in <FocusNavigationProvider groupCount={3}>
 * - Use useFocusNavigation() in screens/components
 * - Pass focused={focusedGroupIndex === ...} to each group
 * - Call moveFocusUp/moveFocusDown on up/down key events
 * - Use setGroupFocusMemory/getGroupFocusMemory for per-group focus/offset memory
 */
const FocusNavigationContext = createContext();

export function GroupFocusNavigationProvider({
  baseGroupCount = 3,
  initialGroupIndex = 0,
  children,
}) {
  // Get mini-player visibility from PlayerContext
  const { isPlayerOpen } = usePlayer();

  // Dynamic group count: +1 when mini-player is visible (and player overlay is closed)
  const isMiniPlayerVisible = !isPlayerOpen; // Mini-player shows when overlay is closed
  const groupCount = isMiniPlayerVisible ? baseGroupCount + 1 : baseGroupCount;
  const MINI_PLAYER_GROUP_INDEX = baseGroupCount; // Always the last group (index 3)

  // Which group is currently focused (0 = header, 1 = filters, 2 = swimlane, 3 = mini-player)
  const [focusedGroupIndex, setFocusedGroupIndex] = useState(initialGroupIndex);

  // Ensure focused group index stays within bounds when group count changes
  React.useEffect(() => {
    if (focusedGroupIndex >= groupCount) {
      setFocusedGroupIndex(groupCount - 1);
    }
  }, [groupCount, focusedGroupIndex]);

  // Per-group focus memory: { [groupIndex]: { focusedIndex, offset } }
  const [focusMemory, setFocusMemory] = useState({});

  // Move focus up (to previous group)
  const moveFocusUp = useCallback(() => {
    setFocusedGroupIndex(prev => Math.max(prev - 1, 0));
  }, []);

  // Move focus down (to next group)
  const moveFocusDown = useCallback(() => {
    setFocusedGroupIndex(prev => Math.min(prev + 1, groupCount - 1));
  }, [groupCount]);

  // Set focus memory for a group
  const setGroupFocusMemory = useCallback((groupIndex, memory) => {
    setFocusMemory(prev => ({ ...prev, [groupIndex]: memory }));
  }, []);

  // Get focus memory for a group
  const getGroupFocusMemory = useCallback(
    groupIndex => {
      return focusMemory[groupIndex] || { focusedIndex: 0, offset: 0 };
    },
    [focusMemory]
  );

  // Context value
  const value = {
    focusedGroupIndex,
    setFocusedGroupIndex,
    moveFocusUp,
    moveFocusDown,
    groupCount,
    baseGroupCount,
    isMiniPlayerVisible,
    MINI_PLAYER_GROUP_INDEX,
    focusMemory,
    setGroupFocusMemory,
    getGroupFocusMemory,
  };

  return (
    <FocusNavigationContext.Provider value={value}>{children}</FocusNavigationContext.Provider>
  );
}

// Hook to use the navigation context
export function useFocusNavigation() {
  const ctx = useContext(FocusNavigationContext);
  if (!ctx) throw new Error('useFocusNavigation must be used within a FocusNavigationProvider');
  return ctx;
}
