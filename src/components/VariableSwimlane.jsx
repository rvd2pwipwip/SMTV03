import React, { useRef, useState, useLayoutEffect, useMemo } from 'react';

/**
 * VariableSwimlane - for variable-width items (e.g., filter buttons)
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
}) {
  // Refs for each item to measure width
  const itemRefs = useRef([]);
  // State for measured widths
  const [itemWidths, setItemWidths] = useState([]);
  // State for whether to show More item
  const [showMore, setShowMore] = useState(false);
  // Focused index (including More item if present)
  const [focusedIndex, setFocusedIndex] = useState(0);

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

  // Offset/parking logic: scroll so focused item is visible, park last item
  // For simplicity, offset is sum of widths of items before focusedIndex
  const offset = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < focusedIndex; i++) {
      sum += itemWidths[i] || 0;
      if (i > 0) sum += 30; // gap
    }
    // Clamp so last item parks at right edge
    const maxOffset = Math.max(0, totalContentWidth - viewportWidth);
    return Math.min(sum, maxOffset);
  }, [focusedIndex, itemWidths, totalContentWidth, viewportWidth]);

  // Keyboard navigation
  React.useEffect(() => {
    if (!focused) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setFocusedIndex((prev) => Math.min(prev + 1, numItems - 1));
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
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
  }, [focused, focusedIndex, items, showMore, onSelect, numItems]);

  // Reset focus when items or focus state changes
  React.useEffect(() => {
    setFocusedIndex(0);
    onFocusChange && onFocusChange(0);
  }, [items, focused, onFocusChange]);

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
          gap: 30,
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