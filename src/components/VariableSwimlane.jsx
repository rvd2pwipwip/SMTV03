import React, { useRef, useState, useLayoutEffect, useMemo, useEffect } from 'react';

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

/**
 * VariableSwimlane - for variable-width items (e.g., filter buttons)
 *
 * Supports a controlled focusedIndex prop for focus memory.
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
 *
 * Padding on the left and right is controlled by the optional leftPadding and rightPadding props.
 * By default, both are 0. You can pass a value (e.g., from getSidePadding()) to use a CSS variable or any other value.
 *
 * New feature:
 *   - ensureActiveVisible: if true, will animate the offset to bring the active filter (activeIndex) into view on mount or when activeIndex changes, but will NOT change focus.
 *   - activeIndex: the index of the active filter.
 *
 * Example usage:
 *   <VariableSwimlane leftPadding={getSidePadding()} rightPadding={getSidePadding()} ensureActiveVisible activeIndex={activeFilterIndex} ... />
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
  width = '100%',
  maxContentWidthRatio = 2.5,
  focusedIndex: controlledFocusedIndex,
  leftPadding = 0,
  rightPadding = 0,
  ensureActiveVisible = false,
  activeIndex = null,
})  {
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
  // Ref and state for container width
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  // State for offset (for learning: this allows us to control the offset directly)
  const [offset, setOffset] = useState(0);
  // Animation control
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // --- Measure container width and item widths ---
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => setContainerWidth(containerRef.current.offsetWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  useLayoutEffect(() => {
    if (!items.length) return;
    itemRefs.current = itemRefs.current.slice(0, items.length);
    const widths = itemRefs.current.map(ref => ref?.offsetWidth || 0);
    setItemWidths(widths);
  }, [items]);

  // --- Calculate total content width and max content width ---
  const viewportWidth = containerWidth || 1920;
  const GAP = getGap();
  const totalContentWidth = useMemo(() => {
    return itemWidths.reduce((sum, w) => sum + w, 0) + (itemWidths.length - 1) * GAP;
  }, [itemWidths, GAP]);
  const maxContentWidth = viewportWidth * maxContentWidthRatio;

  // --- Show More item if content is too wide ---
  useLayoutEffect(() => {
    setShowMore(totalContentWidth > maxContentWidth);
  }, [totalContentWidth, maxContentWidth]);
  const numItems = items.length + (showMore ? 1 : 0);

  // --- Standard offset calculation for focusedIndex (for navigation) ---
  // This is used for normal navigation (arrow keys, group-to-group)
  const calcOffsetForIndex = (index) => {
    let sum = 0;
    for (let i = 0; i < index; i++) {
      sum += (itemWidths[i] || 0) + GAP;
    }
    // Clamp so row's right edge parks at the inner edge of the right padding
    // GAP/2 is added because in a flex row with gaps, the last item's right edge is half a gap away from the true end of the row.
    const maxOffset = Math.max(0, totalContentWidth - viewportWidth + leftPadding + rightPadding + GAP / 2);
    return Math.min(sum, maxOffset);
  };

  // --- Ensure active filter is visible (with animation) on mount or when activeIndex changes ---
  useLayoutEffect(() => {
    if (!ensureActiveVisible || activeIndex == null || !itemWidths.length || !containerWidth) return;
    // Always animate and park the active filter at the left edge (or as far as possible, respecting max offset)
    // This draws user attention and provides a consistent, predictable swimlane experience.
    setShouldAnimate(true);
    setOffset(calcOffsetForIndex(activeIndex));
  }, [ensureActiveVisible, activeIndex, itemWidths, containerWidth]);

  // --- Standard navigation: update offset when focusedIndex changes (arrow keys, group-to-group) ---
  useEffect(() => {
    if (!focused) return;
    setShouldAnimate(true); // Animate for user navigation
    setOffset(calcOffsetForIndex(focusedIndex));
  }, [focusedIndex, focused, itemWidths, containerWidth]);

  // --- Keyboard navigation logic (focus memory for group-to-group only) ---
  React.useEffect(() => {
    if (!focused) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setShouldAnimate(true);
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
        setShouldAnimate(true);
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

  // --- Reset uncontrolled focusedIndex if items or focus state changes ---
  React.useEffect(() => {
    if (typeof controlledFocusedIndex !== 'number') {
      setUncontrolledFocusedIndex(0);
      // onFocusChange && onFocusChange(0);
    }
  }, [items, focused, controlledFocusedIndex, onFocusChange]);

  // --- Render ---
  return (
    <div
      ref={containerRef}
      className={`variable-swimlane-viewport ${className}`}
      style={{ width: typeof width === 'number' ? `${width}px` : width, overflow: 'visible', display: 'flex', alignItems: 'center', paddingLeft: leftPadding, paddingRight: rightPadding }}
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
          transition: shouldAnimate ? 'transform 0.3s cubic-bezier(.4,1.3,.6,1)' : 'none',
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