import React, { useEffect, useRef, useState } from 'react';

/**
 * GenericSwimlane - Step 2: Self-contained focus and left/right navigation
 *
 * Now handles:
 * - Internal focusedIndex state
 * - Left/right/enter key events (when focused)
 * - Calls onSelect/onFocusChange callbacks
 * - Passes focused to renderItem
 * - Still generic: works for any item type
 *
 * Props:
 *   - items: array of data to render
 *   - renderItem: function (item, i, focused) => ReactNode
 *   - maxItems: maximum number of items to display (default: 12)
 *   - fallbackItem: what to render if items is empty (optional)
 *   - className: for custom styling (optional)
 *   - focused: is this swimlane the active group? (parent controls)
 *   - onSelect: called with (item, index) when Enter/OK is pressed (optional)
 *   - onFocusChange: called with (index) when focusedIndex changes (optional)
 */
export default function GenericSwimlane({
  items = [],
  renderItem,
  maxItems = 12,
  fallbackItem = null,
  className = '',
  focused = false,
  onSelect,
  onFocusChange,
}) {
  // Clamp the number of items to maxItems
  const displayItems = items.slice(0, maxItems);

  // Internal state: which card is focused within the swimlane
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Ref to the container div for key event handling
  const containerRef = useRef(null);

  // When swimlane becomes focused, focus the container div (for accessibility)
  useEffect(() => {
    if (focused && containerRef.current) {
      containerRef.current.focus();
    }
  }, [focused]);

  // Handle left/right/enter key events when focused
  useEffect(() => {
    if (!focused) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setFocusedIndex((prev) => {
          const next = Math.min(prev + 1, displayItems.length - 1);
          if (next !== prev && onFocusChange) onFocusChange(next);
          return next;
        });
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        setFocusedIndex((prev) => {
          const next = Math.max(prev - 1, 0);
          if (next !== prev && onFocusChange) onFocusChange(next);
          return next;
        });
        e.preventDefault();
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (onSelect && displayItems[focusedIndex]) {
          onSelect(displayItems[focusedIndex], focusedIndex);
        }
        e.preventDefault();
      }
    };
    // Attach keydown listener to window (TV remotes often don't focus DOM nodes)
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focused, displayItems, focusedIndex, onSelect, onFocusChange]);

  // Reset focusedIndex if items change or swimlane loses focus
  useEffect(() => {
    setFocusedIndex(0);
    if (onFocusChange) onFocusChange(0);
  }, [items, focused]);

  // Learning: This is the basic horizontal row, now with focus and navigation
  return (
    <div
      ref={containerRef}
      className={`generic-swimlane-row ${className}`}
      style={{ display: 'flex', gap: 24, outline: 'none' }}
      tabIndex={-1} // Make div programmatically focusable
      aria-label="Swimlane"
      role="list"
    >
      {displayItems.length === 0
        ? fallbackItem
        : displayItems.map((item, i) =>
            renderItem(item, i, focused && i === focusedIndex)
          )}
    </div>
  );
} 