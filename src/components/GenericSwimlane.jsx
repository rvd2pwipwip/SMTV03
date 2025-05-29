import React, { useEffect, useRef, useState, useMemo } from 'react';

/**
 * Helper to get the value of --screen-side-padding from CSS, with fallback to 100
 */
function getSidePadding() {
  if (typeof window !== 'undefined') {
    const root = document.documentElement;
    const value = getComputedStyle(root).getPropertyValue('--screen-side-padding');
    // Remove 'px' and parse as integer
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 100 : parsed;
  }
  return 100;
}

/**
 * GenericSwimlane - Step 5: Single source of truth for side padding (CSS variable)
 *
 * - Uses --screen-side-padding from CSS for both JS math and CSS style
 * - Fallback to 100 if variable is not set
 * - maxOffset includes both left and right paddings
 * - Learning comments throughout
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
  maxVisible = 6, // How many cards visible at once
}) {
  // Clamp the number of items to maxItems
  const displayItems = items.slice(0, maxItems);

  // Internal state: which card is focused within the swimlane
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Ref to the container div for key event handling
  const containerRef = useRef(null);

  // --- Layout constants ---
  const CARD_WIDTH = 300;
  const CARD_GAP = 24;
  // Get side padding from CSS variable (single source of truth)
  const sidePadding = getSidePadding();
  const viewportWidth = maxVisible * CARD_WIDTH + (maxVisible - 1) * CARD_GAP;
  const totalContentWidth = displayItems.length * (CARD_WIDTH + CARD_GAP);

  // --- Offset/Parking Logic (mirrored paddings) ---
  const offset = useMemo(() => {
    const cardFullWidth = CARD_WIDTH + CARD_GAP;
    const left = focusedIndex * cardFullWidth;
    // maxOffset: last card parks at right edge, includes both paddings
    const maxOffset = Math.max(0, totalContentWidth - viewportWidth + 2 * sidePadding);
    // Clamp so we never scroll past the last card
    return Math.min(left, maxOffset);
  }, [focusedIndex, CARD_WIDTH, CARD_GAP, displayItems.length, viewportWidth, totalContentWidth, sidePadding]);

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
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focused, displayItems, focusedIndex, onSelect, onFocusChange]);

  // Reset focusedIndex if items change or swimlane loses focus
  useEffect(() => {
    setFocusedIndex(0);
    if (onFocusChange) onFocusChange(0);
  }, [items, focused]);

  // --- Render ---
  // Viewport: clips the row, fixed width, left/right padding via CSS var
  // Row: slides left/right via transform
  return (
    <div
      className={`generic-swimlane-viewport ${className}`}
      style={{
        width: viewportWidth,
        margin: '0 auto',
        paddingLeft: 'var(--screen-side-padding, 100px)', // Use CSS var for left padding
        paddingRight: 'var(--screen-side-padding, 100px)', // Use CSS var for right padding
      }}
      tabIndex={-1}
      aria-label="Swimlane viewport"
      role="region"
    >
      <div
        ref={containerRef}
        className="generic-swimlane-row"
        style={{
          display: 'flex',
          gap: CARD_GAP,
          transform: `translateX(-${offset}px)`,
          transition: 'transform 0.3s cubic-bezier(.4,1.3,.6,1)',
          outline: 'none',
        }}
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
    </div>
  );
} 