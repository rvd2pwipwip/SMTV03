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

## Best Practices

- **Never call state setters (or parent callbacks that trigger state) during render or mount unless inside a `useEffect` and only when truly necessary.**
- **Event/callback handlers** (like `onFocusChange`) should only be called in response to user actions, not as part of initial render logic.
- **For focus management:**
  - Let the parent be the source of truth for initial focus.
  - Only notify the parent of changes when the user actually changes focus.

---

## Lessons Learned

- React's strict rules about state updates during render are there to prevent unpredictable UI bugs.
- TV app focus management requires careful separation of initial state, user-driven state, and effect-driven state.
- Always review component effects and callback usage for possible side effects during mount.

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