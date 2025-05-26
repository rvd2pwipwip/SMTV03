# Swimlane Restoration System

## Overview
The swimlane is a horizontally scrolling row of channel cards, optimized for TV remote/keyboard navigation using Norigin Spatial Navigation. It ensures:
- The focused card is always visible and aligned with a screen-side padding.
- The swimlane slides as the user navigates, but never past the content edges.

## Keyboard Navigation
- Each card is focusable via Norigin's `useFocusable`.
- Navigation (left/right) moves focus and slides the swimlane so the focused card is always in a predictable position.

## Focus and Offset Management
- **Focus**: Managed by Norigin, but we track which card was last focused using a stable ID (e.g., `home-card-3`).
- **Offset**: The horizontal scroll position (translateX) of the swimlane, tracked in React state.

## Why Use Stable IDs?
- Norigin's focus keys are dynamic and change between renders.
- Stable IDs are tied to your data and DOM, so they are safe to persist and use for restoration.
- On restore, we look up the current focus key using the saved stable ID.

## Imperative Handles
- We use React's `useImperativeHandle` to expose `getOffset` and `setOffset` methods from `SlidingSwimlane`.
- This allows the parent (`Home.jsx`) to directly control the swimlane's offset for restoration.
- This pattern is appropriate for focus/scroll restoration and keeps the component encapsulated.

## Restoration Phase
- When returning to Home, we restore both the last focused card and the swimlane offset.
- A `restoring` state/prop is used to:
  - Disable CSS transitions (so the offset is set instantly, with no animation).
  - Skip the MutationObserver logic (so the offset isn't recalculated during restoration).
- After restoration, normal sliding and observer logic resume.

## Migration Logic
- The context's `restoreFocus` function supports both old (string) and new (object) formats for backward compatibility.
- If a string is found, it is treated as a stable ID with offset 0.

## Key Code Snippets

**Saving focus and offset:**
```js
// In handleCardClick (Home.jsx)
const element = document.querySelector(`[data-focus-key="${focusKey}"]`);
const stableId = element ? element.getAttribute('data-stable-id') : null;
saveFocus('home', { stableId, offset: currentOffset });
```

**Restoring focus and offset:**
```js
// In useEffect (Home.jsx)
const saved = restoreFocus('home');
if (saved) {
  setRestoring(true);
  if (slidingSwimlaneRef.current) {
    slidingSwimlaneRef.current.setOffset(saved.offset);
  }
  if (saved.stableId) {
    const element = document.querySelector(`[data-stable-id="${saved.stableId}"]`);
    if (element) {
      const focusKey = element.getAttribute('data-focus-key');
      if (focusKey) setFocus(focusKey);
    }
  }
  setTimeout(() => setRestoring(false), 0);
}
```

**Imperative handle in SlidingSwimlane:**
```js
useImperativeHandle(ref, () => ({
  getOffset: () => offset,
  setOffset: (value) => setOffset(value)
}), [offset]);
```

**Disabling animation and observer during restore:**
```js
// In SlidingSwimlane.jsx
useEffect(() => {
  if (restoring) return; // Skip observer logic
  // ... observer code ...
}, [focusRef, restoring]);

<div
  style={{
    transform: `translateX(${offset}px)`,
    transition: restoring ? 'none' : undefined
  }}
>
```

**Migration logic in context:**
```js
const restoreFocus = (screenName) => {
  const value = focusMemory[screenName];
  if (typeof value === 'string') {
    return { stableId: value, offset: 0 };
  }
  return value;
};
```

## Summary Table
| Step                | What Happens                                                      |
|---------------------|-------------------------------------------------------------------|
| Save on leave       | Store stableId and offset in context                              |
| Restore on mount    | Set offset and focus using imperative handle and stableId lookup  |
| Restoration phase   | Disable animation/observer for seamless snap                     |
| Resume normal logic | After restoration, sliding and observer logic resume              |

## Tips for Future Maintenance
- Always use stable IDs for persistence, not dynamic focus keys.
- If you add more swimlanes, use unique stable IDs and context keys per swimlane.
- Keep imperative handles focused: only expose what the parent needs.
- If you change the card structure, ensure stable IDs remain unique and consistent.
- Test restoration after navigation and after app reloads (migration logic helps).

---
This document is your reference for how and why swimlane restoration works. Update it as the system evolves! 