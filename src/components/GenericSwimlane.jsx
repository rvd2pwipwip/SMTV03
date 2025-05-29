import React, { useEffect, useRef, useState, useMemo } from 'react';

/**
 * GenericSwimlane - Step 4: Offset/parking logic with CSS variable padding
 *
 * - Uses left padding var(--screen-side-padding) for viewport and maxOffset
 * - Offset logic matches old SlidingSwimlane: focused card stays in place until last card is fully visible
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
  // Use CSS variable for side padding (matches old swimlane)
  const SIDE_PADDING = 64; // fallback for JS math, but use CSS var in style
  const viewportWidth = maxVisible * CARD_WIDTH + (maxVisible - 1) * CARD_GAP;
  const totalContentWidth = displayItems.length * (CARD_WIDTH + CARD_GAP);

  // --- Offset/Parking Logic (matches SlidingSwimlane) ---
  const offset = useMemo(() => {
    const cardFullWidth = CARD_WIDTH + CARD_GAP;
    const left = focusedIndex * cardFullWidth;
    // maxOffset: last card parks at right edge, includes left padding
    const maxOffset = Math.max(0, totalContentWidth - viewportWidth + SIDE_PADDING);
    // Clamp so we never scroll past the last card
    return Math.min(left, maxOffset);
  }, [focusedIndex, CARD_WIDTH, CARD_GAP, displayItems.length, viewportWidth, totalContentWidth]);

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
  // Viewport: clips the row, fixed width, left padding via CSS var
  // Row: slides left/right via transform
  return (
    <div
      className={`generic-swimlane-viewport ${className}`}
      style={{
        width: viewportWidth,
        outline: 'none',
        margin: '0 auto',
        paddingLeft: 'var(--screen-side-padding, 100px)', // Use CSS var for left padding
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