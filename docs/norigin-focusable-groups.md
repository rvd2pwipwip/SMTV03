# Norigin Spatial Navigation: Focusable Groups and Node Reference Warnings

## Problem: "Component added without a node reference"

When using Norigin Spatial Navigation's `useFocusable` hook, you may see a warning like:

```
Component added without a node reference. This will result in its coordinates being empty and may cause lost focus. Check the "ref" passed to "useFocusable": {focusKey: '...', node: null, ...}
```

### Why This Happens
- This warning occurs when you call `useFocusable` for a group or item, but **do not attach the returned `ref` to a real DOM node** in your render output.
- Norigin relies on the `ref` to track the position and focus state of each focusable in the spatial navigation tree.
- If the `ref` is not attached, Norigin cannot determine the coordinates or register the node, which can cause lost focus, navigation bugs, or skipped groups.

### Common Causes
- Creating a focusable group in your component (e.g., for a swimlane or button row) but forgetting to attach its `ref` to the outermost DOM element.
- Passing the `ref` to a React component instead of a DOM element (e.g., `<MyComponent ref={groupRef} />` instead of `<div ref={groupRef}>`).
- Conditional rendering: the group is registered in code but not rendered in the DOM.

## Solution: Always Attach the Ref

- **Always attach the `ref` returned by `useFocusable` to a real DOM node** (e.g., a `<div>` or `<section>`) in your render output.
- For focusable groups, the `ref` and `data-focus-key` should be attached to the same outermost element that contains all the group's children.

### Example Pattern

```jsx
// In parent (e.g., Home.jsx)
const { ref: groupRef, focusKey: groupFocusKey } = useFocusable({
  focusable: false, // or true if you want the group itself to be focusable
  trackChildren: true,
});

<FilterSwimlane
  groupRef={groupRef}
  groupFocusKey={groupFocusKey}
  ...
/>
```

```jsx
// In FilterSwimlane.jsx
return (
  <div
    className="filter-swimlane-viewport"
    ref={groupRef} // <-- Attach ref here
    data-focus-key={groupFocusKey}
  >
    {filters.map((filter, i) => {
      const { ref: btnRef, focusKey: btnFocusKey } = useFocusable({ focusable: true });
      return (
        <Button
          key={filter.stableId}
          ref={btnRef}
          data-focus-key={btnFocusKey}
          ...
        >
          {filter.label}
        </Button>
      );
    })}
  </div>
);
```

## Impact on Navigation and Focus Tree
- If the group ref is not attached, Norigin cannot register the group in the focus tree.
- Navigation (e.g., up/down between groups) may skip the group or behave unpredictably.
- Focus restoration and spatial navigation logic may break.

## Summary Table
| What to Do                | Why It Matters                                 |
|-------------------------- |-----------------------------------------------|
| Attach useFocusable ref   | Ensures Norigin can track and register node    |
| Use real DOM node         | Coordinates and focus state are available      |
| Attach data-focus-key     | Registers group in Norigin focus tree          |
| No ref = warning + bugs   | Lost focus, navigation skips, broken UX        |

## Best Practice
- **Always attach the ref from useFocusable to a real DOM node.**
- For groups, attach both the ref and data-focus-key to the same element.
- Check the browser console for warnings and fix any missing node references immediately.

---

_This doc was created after resolving a Norigin warning in the Home screen filter swimlane. Review this pattern whenever you add or refactor focusable groups in your TV app._ 