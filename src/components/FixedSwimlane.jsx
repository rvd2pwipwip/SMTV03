import React, { useEffect, useRef, useState, useMemo, useLayoutEffect } from 'react';

/**
 * FixedSwimlane (formerly GenericSwimlane)
 *
 * This component is for fixed-width, card-style swimlanes (e.g., channels).
 * For variable-width items (e.g., filter buttons), use VariableSwimlane.
 *
 * Now supports a controlled focusedIndex prop for focus memory.
 *
 * Updated: Now fills parent container width by default, or uses a set width if provided.
 * Updated: sidePadding is now a prop (default 0), not a CSS variable or internal function.
 */

/**
 * Helper to get the value of --spacing-xl from CSS, with fallback to 32
 */
function getCardGap() {
  if (typeof window !== 'undefined') {
    const root = document.documentElement;
    const value = getComputedStyle(root).getPropertyValue('--spacing-xl');
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 32 : parsed;
  }
  return 32;
}

/**
 * GenericSwimlane - Step 5: Single source of truth for side padding (CSS variable)
 *
 * - Uses --screen-side-padding from CSS for both JS math and CSS style
 * - Fallback to 100 if variable is not set
 * - maxOffset includes both left and right paddings
 * - Learning comments throughout
 */
export default function FixedSwimlane({
  items = [],
  renderItem,
  maxItems = 12,
  fallbackItem = null,
  className = '',
  focused = false,
  onSelect,
  onFocusChange,
  maxVisible = 6, // How many cards visible at once (used for fallback only)
  focusedIndex: controlledFocusedIndex, // New: controlled focused index
  width = '100%', // Width prop, default to fill parent
  sidePadding = 0, // New: side padding prop, default 0
}) {
  // Clamp the number of items to maxItems
  const displayItems = items.slice(0, maxItems);

  // Internal state: which card is focused within the swimlane
  const [uncontrolledFocusedIndex, setUncontrolledFocusedIndex] = useState(0);

  // Use controlled or uncontrolled focused index
  const focusedIndex =
    typeof controlledFocusedIndex === 'number' ? controlledFocusedIndex : uncontrolledFocusedIndex;

  // Ref to the container div for key event handling and measuring width
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // --- Layout constants ---
  const CARD_WIDTH = 300;
  const CARD_GAP = getCardGap(); // Use design token for gap

  // Measure container width after render
  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, [width, items.length]);

  // Fallback viewport width if not yet measured
  const fallbackViewportWidth = maxVisible * CARD_WIDTH + (maxVisible - 1) * CARD_GAP;
  const viewportWidth = containerWidth || fallbackViewportWidth;
  const totalContentWidth = (displayItems.length * CARD_WIDTH) + ((displayItems.length - 1) * CARD_GAP);

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
        if (typeof controlledFocusedIndex === 'number') {
          onFocusChange && onFocusChange(Math.min(focusedIndex + 1, displayItems.length - 1));
        } else {
          setUncontrolledFocusedIndex((prev) => {
            const next = Math.min(prev + 1, displayItems.length - 1);
            onFocusChange && onFocusChange(next);
            return next;
          });
        }
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        if (typeof controlledFocusedIndex === 'number') {
          onFocusChange && onFocusChange(Math.max(focusedIndex - 1, 0));
        } else {
          setUncontrolledFocusedIndex((prev) => {
            const next = Math.max(prev - 1, 0);
            onFocusChange && onFocusChange(next);
            return next;
          });
        }
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
  }, [focused, displayItems, focusedIndex, onSelect, onFocusChange, controlledFocusedIndex]);

  // Reset uncontrolled focusedIndex if items change or swimlane loses focus
  useEffect(() => {
    if (typeof controlledFocusedIndex !== 'number') {
      setUncontrolledFocusedIndex(0);
      onFocusChange && onFocusChange(0);
    }
  }, [items, focused, controlledFocusedIndex, onFocusChange]);

  // --- Render ---
  // Viewport: clips the row, width is set by prop or parent, left/right padding via prop
  // Row: slides left/right via transform
  return (
    <div
      className={`fixed-swimlane-viewport ${className}`}
      style={{
        width: width || '100%',
        margin: '0 auto',
        paddingLeft: sidePadding,
        paddingRight: sidePadding,
        outline: 'none',
      }}
      tabIndex={-1}
      aria-label="Swimlane viewport"
      role="region"
      ref={containerRef}
    >
      <div
        className="fixed-swimlane-row"
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