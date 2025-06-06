# onFocusChange Bug Fix: Detailed Explanation

## Overview
This document explains a subtle but important bug encountered in the TV app's focus management system, specifically related to the `onFocusChange` callback in the `VariableSwimlane` component. The fix and its rationale are documented here for future learning and review.

---

## The Bug: React setState-in-render Error

**Symptom:**
- When navigating from the action button group to the filter group (using the down arrow key), the app would crash with the following error:

```
ScreenMemoryContext.jsx:21 Cannot update a component (`ScreenMemoryProvider`) while rendering a different component (`ChannelInfo`). To locate the bad setState() call inside `ChannelInfo`, follow the stack trace as described in https://react.dev/link/setstate-in-render
```

**Stack trace highlights:**
- The error pointed to a `setScreenField` call in `ChannelInfo.jsx`, but only when navigation occurred.

---

## Why Did This Happen?

- The `VariableSwimlane` component accepted an `onFocusChange` prop, which was used by parent components to update focus memory/state.
- Inside `VariableSwimlane`, there was a `useEffect` that called `onFocusChange(0)` whenever the items or focus state changed, including on mount:

```js
React.useEffect(() => {
  if (typeof controlledFocusedIndex !== 'number') {
    setUncontrolledFocusedIndex(0);
    onFocusChange && onFocusChange(0); // <-- Problematic call
  }
}, [items, focused, controlledFocusedIndex, onFocusChange]);
```

- If the parent (`ChannelInfo.jsx`) passed a handler that called `setScreenField` (a state setter), this would trigger a state update in the parent **during the initial render/mount of the child**.
- React does not allow state updates during render, leading to the error.

---

## Diagnosis Process

1. **Stack Trace Analysis:**
   - The error only occurred on the first navigation to the filter group.
   - The stack trace pointed to a state update in `ChannelInfo.jsx` triggered by a callback from `VariableSwimlane`.
2. **Code Review:**
   - Found that `onFocusChange` was being called in a mount/reset effect, not just in response to user navigation.
3. **Component Behavior:**
   - Confirmed that the callback was being triggered on mount, not just on user action.

---

## The Solution

- **Remove the call to `onFocusChange(0)` from the mount/reset effect in `VariableSwimlane.jsx`.**
- Only call `onFocusChange` in response to actual user navigation (e.g., arrow key events), not on mount or when items change.

**Refactored effect:**
```js
React.useEffect(() => {
  if (typeof controlledFocusedIndex !== 'number') {
    setUncontrolledFocusedIndex(0);
    // Do NOT call onFocusChange(0) here!
  }
}, [items, focused, controlledFocusedIndex]);
```

---

## Follow-up Bug: Infinite Update Loop in ChannelInfo

**Symptom:**
- After fixing the setState-in-render error, a new error appeared:

```
Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
```

**Root Cause:**
- The `ChannelInfo` component was syncing local state from context memory (and vice versa) using `useEffect` hooks.
- Each effect would update the other whenever their values changed, causing an infinite loop if the values were not perfectly in sync.
- Example:
  - Context changes → local state updates → local state changes → context updates → context changes → ...

**Diagnosis:**
- The effects did not check if the new value was actually different before calling the setter, so even identical values would trigger updates and re-renders.

**Solution:**
- Update both effects to only call their respective setters if the value is actually different.
- This breaks the cycle and prevents unnecessary updates.

**Example Fix:**
```js
// Sync local state from memory when it changes
useEffect(() => {
  if (
    typeof screenMemory.lastFocusedGroupIndex === 'number' &&
    screenMemory.lastFocusedItemIndices
  ) {
    if (focusedGroupIndex !== screenMemory.lastFocusedGroupIndex) {
      setFocusedGroupIndex(screenMemory.lastFocusedGroupIndex);
    }
    if (actionsFocusedIndex !== (screenMemory.lastFocusedItemIndices[ACTIONS_GROUP] ?? 0)) {
      setActionsFocusedIndex(screenMemory.lastFocusedItemIndices[ACTIONS_GROUP] ?? 0);
    }
    if (filtersFocusedIndex !== (screenMemory.lastFocusedItemIndices[FILTERS_GROUP] ?? 0)) {
      setFiltersFocusedIndex(screenMemory.lastFocusedItemIndices[FILTERS_GROUP] ?? 0);
    }
    if (relatedFocusedIndex !== (screenMemory.lastFocusedItemIndices[RELATED_GROUP] ?? 0)) {
      setRelatedFocusedIndex(screenMemory.lastFocusedItemIndices[RELATED_GROUP] ?? 0);
    }
  }
}, [screenMemory, channelId]);

// Sync context memory when focusedGroupIndex changes
useEffect(() => {
  if (screenMemory.lastFocusedGroupIndex !== focusedGroupIndex) {
    setScreenField('lastFocusedGroupIndex', focusedGroupIndex);
  }
}, [focusedGroupIndex, setScreenField, screenMemory.lastFocusedGroupIndex]);
```

---

## Best Practices

- **Never call state setters (or parent callbacks that trigger state) during render or mount unless inside a `useEffect` and only when truly necessary.**
- **Event/callback handlers** (like `onFocusChange`) should only be called in response to user actions, not as part of initial render logic.
- **For focus management:**
  - Let the parent be the source of truth for initial focus.
  - Only notify the parent of changes when the user actually changes focus.
- **When syncing state between local and context/global state:**
  - Only update if the new value is actually different from the current value.
  - This prevents infinite update loops and unnecessary re-renders.

---

## Lessons Learned

- React's strict rules about state updates during render are there to prevent unpredictable UI bugs.
- TV app focus management requires careful separation of initial state, user-driven state, and effect-driven state.
- Always review component effects and callback usage for possible side effects during mount.
- When syncing state between local and context/global state, always check for actual value changes before updating to avoid infinite loops.

---

## References
- [React: State Updates May Be Asynchronous](https://react.dev/learn/queueing-a-series-of-state-updates)
- [React: setState in render warning](https://react.dev/warnings/invalid-hook-call-warning)
- [TV App Architecture](./ARCHITECTURE.md)
- [Component Documentation](./COMPONENT_DOCUMENTATION.md)
- [VariableSwimlane.jsx](/src/components/VariableSwimlane.jsx)
- [ChannelInfo.jsx](/src/screens/ChannelInfo.jsx)

---

**This document is intended for future developers and reviewers to understand the root cause, fix, and best practices for similar issues.** 