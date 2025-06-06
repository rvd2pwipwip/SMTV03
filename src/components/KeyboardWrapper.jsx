import React from 'react';

/**
 * KeyboardWrapper - TV navigation utility for custom focusable components
 *
 * Purpose:
 *   - Wraps a single custom focusable child (e.g., a ChannelCard rendered as a <div>).
 *   - Injects a keyboard handler so Enter/OK, ArrowUp, and ArrowDown keys trigger app navigation logic.
 *   - Calls onSelect with selectData when Enter/OK is pressed (for selection/activation).
 *   - Calls onUp/onDown when ArrowUp/ArrowDown are pressed (for vertical group navigation).
 *   - Keeps navigation logic out of presentational components, making them reusable and simple.
 *
 * When to use:
 *   - Use for custom focusable elements (e.g., cards, tiles) that are not native <button> elements.
 *   - Not needed for native <button> elements (browser handles Enter/OK natively; use onKeyDown for up/down if needed).
 *
 * Why:
 *   - Ensures keyboard/remote navigation works consistently for TV UIs.
 *   - Keeps focus and keyboard event logic centralized and easy to maintain.
 *   - See docs/tv-keyboard-focus-pattern.md for a full explanation and diagrams.
 *
 * Props:
 *   - onSelect: function to call when Enter/OK is pressed (receives selectData, event)
 *   - selectData: any data to pass to onSelect (e.g., channel info)
 *   - children: the custom focusable child element (must accept ref and onKeyDown)
 *   - ref: forwarded to the child
 *   - onUp: function to call when ArrowUp is pressed
 *   - onDown: function to call when ArrowDown is pressed
 */
const KeyboardWrapper = React.forwardRef(
  ({ onSelect, children, selectData, onUp, onDown }, ref) => {
    // Handles keydown events for TV remote/keyboard
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        // Pass selectData and event to onSelect handler
        if (onSelect) onSelect(selectData, e);
      } else if (e.key === 'ArrowUp') {
        if (onUp) onUp(e);
      } else if (e.key === 'ArrowDown') {
        if (onDown) onDown(e);
      }
    };

    // Clone the child to inject ref and onKeyDown handler
    // This keeps KeyboardWrapper generic and reusable
    return React.cloneElement(children, {
      ref,
      onKeyDown: handleKeyDown,
    });
  }
);

export default KeyboardWrapper; 