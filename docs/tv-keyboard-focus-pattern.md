# TV App Keyboard Focus & Enter Handling in React

## Why is Enter/OK Key Handling Tricky in TV UIs?

In TV apps, you often want to:
- Show a custom focus ring on a card when it is "focused" (using your app's navigation logic)
- Trigger an action (like navigation) when the user presses Enter/OK on the remote or keyboard

But React and browsers only send keyboard events (like Enter) to the **DOM element that is actually focused**. If you only manage focus in your app's state (e.g., `focusedIndex`), but don't focus the DOM node, Enter/OK won't work!

---

## The Problem: Visual vs. DOM Focus

- **Visual focus**: Your app tracks which card is focused (e.g., with a `focused` prop) and shows a ring.
- **DOM focus**: The browser tracks which element is focused. Only this element receives keyboard events.

**If these are out of sync, Enter/OK won't work!**

---

## The Solution: Sync App Focus and DOM Focus

When your app's navigation logic says a card is focused, you must also call `.focus()` on its DOM node.

### Example: Focusing the Card
```jsx
const cardRefs = useRef([]);

useEffect(() => {
  if (focusedGroupIndex === SWIMLANE_GROUP && cardRefs.current[swimlaneFocusedIndex]) {
    cardRefs.current[swimlaneFocusedIndex].focus();
  }
}, [swimlaneFocusedIndex, focusedGroupIndex]);
```

---

## KeyboardWrapper: Handling Enter/OK

`KeyboardWrapper` is a React component that:
- Wraps a focusable child (like a card)
- Injects an `onKeyDown` handler that listens for Enter/OK
- Calls your `onSelect` handler when Enter is pressed

### Example:
```jsx
const KeyboardWrapper = React.forwardRef(({ onSelect, children, selectData }, ref) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (onSelect) onSelect(selectData, e);
    }
  };
  return React.cloneElement(children, {
    ref,
    onKeyDown: handleKeyDown,
  });
});
```

---

## The Crucial Ref Line

When rendering your cards, you must:
- Pass the ref **to the KeyboardWrapper** (not directly to the card)
- Let KeyboardWrapper pass the ref to the card (which must be a `forwardRef` component)

### Correct Pattern:
```jsx
<KeyboardWrapper
  key={channel.id}
  onSelect={() => handleChannelSelect(channel)}
  selectData={channel}
  ref={el => { cardRefs.current[i] = el; }} // <-- THIS LINE IS CRUCIAL!
>
  <ChannelCard
    title={channel.title}
    thumbnailUrl={channel.thumbnailUrl}
    focused={focused}
    onClick={() => handleChannelSelect(channel)}
  />
</KeyboardWrapper>
```

- This ensures the DOM node for the focused card is actually focused, so it receives Enter/OK events.

---

## How the Flow Works

1. **App navigation logic** updates `swimlaneFocusedIndex`.
2. **Effect** calls `.focus()` on the DOM node for the focused card.
3. **KeyboardWrapper** injects `onKeyDown` to the card.
4. **User presses Enter/OK**: `onKeyDown` fires, `onSelect` is called.
5. **Action happens** (e.g., navigation).

---

## Diagram

```
[App state: swimlaneFocusedIndex]
        |
        v
[useEffect: .focus() DOM node]
        |
        v
[KeyboardWrapper injects onKeyDown]
        |
        v
[User presses Enter/OK]
        |
        v
[onSelect handler fires]
```

---

## Common Pitfalls

- **Not using `forwardRef`**: The card component must use `React.forwardRef` to receive the ref.
- **Passing ref to the wrong component**: Pass the ref to `KeyboardWrapper`, not directly to the card in the render function.
- **Not calling `.focus()`**: If you only update visual focus, Enter/OK won't work.
- **Overwriting `onKeyDown`**: Only one `onKeyDown` should be active; let `KeyboardWrapper` handle it.

---

## Summary

- Always sync your app's visual focus with DOM focus for keyboard/remote events.
- Use a ref array to track card DOM nodes.
- Pass the ref to `KeyboardWrapper`, which passes it to the card.
- Call `.focus()` on the DOM node when your app's focus changes.
- Let `KeyboardWrapper` handle Enter/OK with `onKeyDown` and `onSelect`.

---

## Further Reading
- [React Refs and the DOM](https://react.dev/reference/react/useRef)
- [React.forwardRef](https://react.dev/reference/react/forwardRef)
- [Keyboard Accessibility for Custom Components](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/) 