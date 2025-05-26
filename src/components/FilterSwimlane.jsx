import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Button } from '@smtv/tv-component-library';
import '../styles/App.css';

/**
 * FilterSwimlane component
 * @param {Object[]} filters - Array of filter objects { label, stableId }
 * @param {string} activeFilterId - The stableId of the currently active filter
 * @param {function} onFilterChange - Callback when a filter is activated
 * @param {boolean} restoring - Whether restoration is in progress
 * @param {number} initialOffset - Offset to restore on mount (optional)
 * @param {object} groupRef - Ref for the group container (for Norigin navigation)
 * @param {string} groupFocusKey - Focus key for the group container
 */
const FilterSwimlane = forwardRef(({
  filters = [],
  activeFilterId,
  onFilterChange,
  restoring = false,
  initialOffset = 0,
  groupRef,
  groupFocusKey,
}, ref) => {
  const [offset, setOffset] = useState(initialOffset);
  const contentRef = useRef(null);

  // Expose imperative handle for restoration
  useImperativeHandle(ref, () => ({
    getOffset: () => offset,
    setOffset: (value) => setOffset(value)
  }), [offset]);

  // Refs and focusKeys for each filter button
  const buttonRefs = useRef([]);
  if (buttonRefs.current.length !== filters.length) {
    buttonRefs.current = Array(filters.length).fill().map((_, i) => buttonRefs.current[i] || React.createRef());
  }
  const buttonFocusKeys = filters.map((_, i) => `filter-btn-${i}`);

  // Focus active filter when group receives focus
  useEffect(() => {
    const handleFocus = () => {
      const activeIdx = filters.findIndex(f => f.stableId === activeFilterId);
      if (activeIdx !== -1 && buttonRefs.current[activeIdx]?.current) {
        setTimeout(() => {
          buttonRefs.current[activeIdx].current.focus();
        }, 0);
      }
    };
    const groupNode = groupRef?.current;
    if (groupNode) {
      groupNode.addEventListener('focus', handleFocus);
    }
    return () => {
      if (groupNode) {
        groupNode.removeEventListener('focus', handleFocus);
      }
    };
  }, [groupRef, filters, activeFilterId]);

  // Helper: ensure a button is visible in the viewport
  const ensureButtonInView = (btnIdx) => {
    const viewport = groupRef?.current;
    const content = contentRef.current;
    const btn = buttonRefs.current[btnIdx]?.current;
    if (!viewport || !content || !btn) return;

    const viewportRect = viewport.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    // Calculate left/right overflow relative to viewport
    const leftOverflow = btnRect.left - viewportRect.left;
    const rightOverflow = btnRect.right - viewportRect.right;

    let newOffset = offset;
    // If button is left of viewport, scroll right
    if (leftOverflow < 0) {
      newOffset += -leftOverflow;
    }
    // If button is right of viewport, scroll left
    else if (rightOverflow > 0) {
      newOffset -= rightOverflow;
    }

    // Clamp offset so we never scroll past content edges
    const maxOffset = 0;
    const minOffset = Math.min(0, viewportRect.width - contentRect.width);
    newOffset = Math.max(Math.min(newOffset, maxOffset), minOffset);

    if (newOffset !== offset) {
      setOffset(newOffset);
    }
  };

  // On mount and when activeFilterId changes, ensure active filter is visible
  useEffect(() => {
    const activeIdx = filters.findIndex(f => f.stableId === activeFilterId);
    if (activeIdx !== -1) {
      ensureButtonInView(activeIdx);
    }
    // eslint-disable-next-line
  }, [activeFilterId, filters.length]);

  // On focus change, ensure focused filter is visible
  useEffect(() => {
    const handleFocus = (e) => {
      const idx = buttonRefs.current.findIndex(ref => ref.current === e.target);
      if (idx !== -1) {
        ensureButtonInView(idx);
      }
    };
    // Attach focus listeners to each button
    buttonRefs.current.forEach(ref => {
      if (ref.current) {
        ref.current.addEventListener('focus', handleFocus);
      }
    });
    return () => {
      buttonRefs.current.forEach(ref => {
        if (ref.current) {
          ref.current.removeEventListener('focus', handleFocus);
        }
      });
    };
    // eslint-disable-next-line
  }, [filters.length]);

  return (
    <div className="filter-swimlane-viewport" ref={groupRef} data-focus-key={groupFocusKey}>
      <div
        className="filter-swimlane-content"
        ref={contentRef}
        style={{
          transform: `translateX(${offset}px)`,
          transition: restoring ? 'none' : undefined,
          display: 'flex',
          gap: 'var(--spacing-lg)',
        }}
      >
        {filters.map((filter, i) => {
          const isActive = filter.stableId === activeFilterId;
          return (
            <Button
              key={filter.stableId}
              ref={buttonRefs.current[i]}
              variant={isActive ? 'primary' : 'secondary'}
              size="medium"
              data-stable-id={filter.stableId}
              data-focus-key={buttonFocusKeys[i]}
              onClick={() => onFilterChange && onFilterChange(filter.stableId)}
            >
              {filter.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
});

export default FilterSwimlane; 