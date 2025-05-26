import React from 'react';

/**
 * KeyboardWrapper - A generic wrapper component for keyboard navigation
 *
 * This component works exactly like EnterKeyWrapper but accepts any component as a child.
 * It will:
 * 1. Accept any child component
 * 2. Pass Enter key events to the child via onKeyDown
 * 3. Forward all props and ref to the child (the child must be a focusable DOM element)
 * 4. Does NOT handle focus itself (focus is managed by Norigin and the browser)
 *
 * Best practice: The child should be the focusable element (with tabIndex and ref),
 * so Norigin can manage focus and focus rings correctly for TV navigation.
 */

const KeyboardWrapper = React.forwardRef(({ onSelect, children, ...props }, ref) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSelect) {
      onSelect();
    }
  };

  // Pass key handling and ref to the child, do not handle focus here
  return React.cloneElement(children, {
    ref,
    onKeyDown: handleKeyDown,
    ...props
  });
});

export default KeyboardWrapper; 