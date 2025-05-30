import React, { useRef, useState, useLayoutEffect, useMemo } from 'react';

/**
 * VariableSwimlane - for variable-width items (e.g., filter buttons)
 *
 * Now supports a controlled focusedIndex prop for focus memory.
 *
 * Features:
 * - Accepts items and renderItem
 * - Measures item widths after render
 * - Calculates total content width
 * - If content width > maxContentWidth (default 2.5x viewport), appends a More item
 * - Handles horizontal navigation and offset/parking logic
 * - More item is navigable and included in offset math
 * - Only horizontal navigation/Enter
 * - Single row only
 * - Learning comments throughout
 */
export default function VariableSwimlane({
  items = [],
  renderItem,
  renderMoreItem,
  fallbackItem = null,
  className = '',
  focused = false,
  onSelect,
  onFocusChange,
  viewportWidth = 1920, // default TV width
  maxContentWidthRatio = 2.5, // max content width = 2.5x viewport
  focusedIndex: controlledFocusedIndex, // New: controlled focused index
}) {
  // Refs for each item to measure width
  const itemRefs = useRef([]);
  // State for measured widths
  const [itemWidths, setItemWidths] = useState([]);
  // State for whether to show More item
  const [showMore, setShowMore] = useState(false);
  // Internal state for focused index
  const [uncontrolledFocusedIndex, setUncontrolledFocusedIndex] = useState(0);
  // Use controlled or uncontrolled focused index
  const focusedIndex =
    typeof controlledFocusedIndex === 'number' ? controlledFocusedIndex : uncontrolledFocusedIndex;

  // Helper: measure widths after render
  useLayoutEffect(() => {
    if (!items.length) return;
    itemRefs.current = itemRefs.current.slice(0, items.length);
    const widths = itemRefs.current.map(ref => ref?.offsetWidth || 0);
    setItemWidths(widths);
  }, [items]);

  // Calculate total content width
  const totalContentWidth = useMemo(() => {
    return itemWidths.reduce((sum, w) => sum + w, 0) + (itemWidths.length - 1) * 30; // 30px gap
  }, [itemWidths]);

  // Calculate max content width
  const maxContentWidth = viewportWidth * maxContentWidthRatio;

  // Show More item if content is too wide
  useLayoutEffect(() => {
    setShowMore(totalContentWidth > maxContentWidth);
  }, [totalContentWidth, maxContentWidth]);

  // Navigation: include More item if present
  const numItems = items.length + (showMore ? 1 : 0);

  /**
   * Helper to get the value of --spacing-xl from CSS, with fallback to 32
   */
  function getGap() {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      const value = getComputedStyle(root).getPropertyValue('--spacing-xl');
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? 32 : parsed;
    }
    return 32;
  }

  const GAP = getGap(); // Use design token for gap
  const offset = useMemo(() => {
    // Sum widths and gaps of all items before the focused one
    let sum = 0;
    for (let i = 0; i < focusedIndex; i++) {
      sum += (itemWidths[i] || 0) + GAP;
    }
    // Clamp so last item parks at right edge
    const maxOffset = Math.max(0, totalContentWidth - viewportWidth);
    return Math.min(sum, maxOffset);
  }, [focusedIndex, itemWidths, totalContentWidth, viewportWidth, GAP]);

  // Keyboard navigation
  React.useEffect(() => {
    if (!focused) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        if (typeof controlledFocusedIndex === 'number') {
          onFocusChange && onFocusChange(Math.min(focusedIndex + 1, numItems - 1));
        } else {
          setUncontrolledFocusedIndex((prev) => {
            const next = Math.min(prev + 1, numItems - 1);
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
        if (focusedIndex < items.length) {
          onSelect && onSelect(items[focusedIndex], focusedIndex);
        } else if (showMore && focusedIndex === items.length) {
          onSelect && onSelect({ type: 'more' }, focusedIndex);
        }
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focused, focusedIndex, items, showMore, onSelect, numItems, onFocusChange, controlledFocusedIndex]);

  // Reset uncontrolled focusedIndex if items or focus state changes
  React.useEffect(() => {
    if (typeof controlledFocusedIndex !== 'number') {
      setUncontrolledFocusedIndex(0);
      onFocusChange && onFocusChange(0);
    }
  }, [items, focused, controlledFocusedIndex, onFocusChange]);

  // Render
  return (
    <div
      className={`variable-swimlane-viewport ${className}`}
      style={{ width: viewportWidth, overflow: 'visible', display: 'flex', alignItems: 'center', padding: '0 var(--screen-side-padding, 100px)' }}
      tabIndex={-1}
      aria-label="Variable Swimlane viewport"
      role="region"
    >
      <div
        className="variable-swimlane-row"
        style={{
          display: 'flex',
          gap: GAP,
          transform: `translateX(-${offset}px)`,
          transition: 'transform 0.3s cubic-bezier(.4,1.3,.6,1)',
        }}
        tabIndex={-1}
        aria-label="Variable Swimlane"
        role="list"
      >
        {items.length === 0 && fallbackItem}
        {items.map((item, i) => (
          <div
            key={item.id}
            ref={el => (itemRefs.current[i] = el)}
            tabIndex={-1}
            style={{ outline: focused && i === focusedIndex ? '2px solid #fff' : 'none' }}
          >
            {renderItem(item, i, focused && i === focusedIndex)}
          </div>
        ))}
        {showMore && (
          <div
            key="more-item"
            ref={el => (itemRefs.current[items.length] = el)}
            tabIndex={-1}
            style={{ outline: focused && focusedIndex === items.length ? '2px solid #fff' : 'none' }}
          >
            {renderMoreItem ? renderMoreItem(focused && focusedIndex === items.length) : <button>More</button>}
          </div>
        )}
      </div>
    </div>
  );
} 