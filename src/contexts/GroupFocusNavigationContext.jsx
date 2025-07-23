// GroupFocusNavigationContext: Handles vertical group navigation and per-group focus memory for TV UIs.
// Use for up/down navigation and restoring focus within a screen.
// Not for persistent screen state across navigation.
import React, { createContext, useContext, useState, useCallback } from 'react';
import { usePlayer } from './PlayerContext';

/**
 * FocusNavigationContext - modular vertical navigation context for TV UIs
 *
 * Provides:
 * - moveFocusUp / moveFocusDown: move focus between groups
 * - groupCount: total number of vertical groups
 * - focusMemory: remembers focusedIndex and offset for each group
 * - setGroupFocusMemory: update memory for a group
 * - getGroupFocusMemory: get memory for a group
 * - MiniPlayer coordination: isMiniPlayerVisible, MINI_PLAYER_GROUP_INDEX
 *
 * IMPORTANT CHANGE: focusedGroupIndex is now managed per-screen via ScreenMemoryContext
 * Each screen is responsible for managing its own focused group state.
 *
 * Usage:
 * - Wrap your app (or main content) in <FocusNavigationProvider baseGroupCount={3}>
 * - Use useFocusNavigation() in screens/components
 * - Screens manage their own focusedGroupIndex via useScreenMemory()
 * - Call moveFocusUp/moveFocusDown on up/down key events (screens provide current focusedGroupIndex)
 * - Use setGroupFocusMemory/getGroupFocusMemory for per-group focus/offset memory
 */
const FocusNavigationContext = createContext();

export function GroupFocusNavigationProvider({ baseGroupCount = 3, children }) {
  // Get mini-player visibility from PlayerContext
  const { isPlayerOpen } = usePlayer();

  // Dynamic group count: +1 when mini-player is visible (and player overlay is closed)
  const isMiniPlayerVisible = !isPlayerOpen; // Mini-player shows when overlay is closed
  const groupCount = isMiniPlayerVisible ? baseGroupCount + 1 : baseGroupCount;
  const MINI_PLAYER_GROUP_INDEX = baseGroupCount; // Always the last group (index 3)

  // LEARNING: Removed global focusedGroupIndex - now managed per-screen
  // Each screen will manage its own focusedGroupIndex via ScreenMemoryContext

  // Per-group focus memory: { [groupIndex]: { focusedIndex, offset } }
  const [focusMemory, setFocusMemory] = useState({});

  // LEARNING: Navigation functions now accept currentFocusedGroupIndex as parameter
  // This allows screens to provide their current state while keeping navigation logic centralized

  // Move focus up (to previous group)
  const moveFocusUp = useCallback((currentFocusedGroupIndex, setFocusedGroupIndex) => {
    const newIndex = Math.max(currentFocusedGroupIndex - 1, 0);
    setFocusedGroupIndex(newIndex);
    return newIndex;
  }, []);

  // Move focus down (to next group)
  const moveFocusDown = useCallback(
    (currentFocusedGroupIndex, setFocusedGroupIndex) => {
      const newIndex = Math.min(currentFocusedGroupIndex + 1, groupCount - 1);
      setFocusedGroupIndex(newIndex);
      return newIndex;
    },
    [groupCount]
  );

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
    // LEARNING: Removed focusedGroupIndex and setFocusedGroupIndex - now per-screen
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
