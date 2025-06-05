import React from 'react';

/**
 * KeyboardWrapper - TV navigation utility
 *
 * - Wraps a single focusable child.
 * - Calls onSelect with selectData when Enter is pressed.
 * - Keeps navigation logic out of presentational components (best practice).
 *
 * Props:
 *   - onSelect: function to call when Enter is pressed (receives selectData, event)
 *   - selectData: any data to pass to onSelect (e.g., channel info)
 *   - children: the focusable child element
 *   - ref: forwarded to the child
 */
const KeyboardWrapper = React.forwardRef(({ onSelect, children, selectData }, ref) => {
  // Handles keydown events for TV remote/keyboard
  const handleKeyDown = (e) => {
    console.log('KeyDown on ChannelCard:', e.key);
    if (e.key === 'Enter') {
      // Pass selectData and event to onSelect handler
      if (onSelect) onSelect(selectData, e);
    }
  };

  // Clone the child to inject ref and onKeyDown handler
  // This keeps KeyboardWrapper generic and reusable
  return React.cloneElement(children, {
    ref,
    onKeyDown: handleKeyDown,
  });
});

export default KeyboardWrapper; 