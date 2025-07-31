import React, { useMemo, useState, useEffect, useLayoutEffect, useRef, forwardRef } from 'react';

/**
 * ChannelGrid - Responsive 2D grid for channel cards
 *
 * A responsive grid component that automatically calculates cards per row based on container width.
 * Designed for both TV apps (fixed width) and web/mobile apps (responsive).
 *
 * Features:
 * - Responsive width calculation using ResizeObserver
 * - Partial row handling (last row left-aligned)
 * - 2D focus navigation support (Phase 2)
 * - Consistent with ChannelRow patterns
 *
 * TV App Usage (Fixed Width):
 *   <ChannelGrid cardWidth={300} minGap={32}>
 *     {channels.map(channel => <ChannelCard {...channel} />)}
 *   </ChannelGrid>
 *
 * Web/Mobile Usage (Responsive):
 *   Same API - automatically adapts to container width changes
 *
 * Props:
 * - cardWidth: Fixed width for each card (default: 300px)
 * - minGap: Minimum gap between cards (default: 32px)
 * - leftPadding/rightPadding: Container padding (default: 0)
 * - focused: Whether grid has focus for navigation
 * - focusedPosition: Controlled focus {row, col} for Phase 2
 * - onFocusChange: Focus change callback
 * - onSelect: Card selection callback
 */
const ChannelGrid = forwardRef(
  (
    {
      items = [], // CHANGED: Use items + renderItem pattern like FixedSwimlane
      renderItem, // CHANGED: Function to render each item with KeyboardWrapper
      cardWidth = 300, // px, consistent with ChannelRow
      minGap = 32, // px, minimum gap between cards
      style,
      // Navigation props (compatible with existing system)
      focused = false,
      focusedPosition: controlledFocusedPosition,
      onFocusChange,
      onSelect, // For Enter/Space key handling
      onNavigationEscape, // For boundary escape (up from first row, down from last row)
      // Content loading props (prepared for Phase 3)
      maxRows,
      onLoadMore,
      hasNextPage = false,
      loadMoreThreshold = 2,
      // Layout props
      enableVerticalParking = true,
      leftPadding = 0,
      rightPadding = 0,
      maxHeight,
      ...props
    },
    forwardedRef
  ) => {
    const [containerWidth, setContainerWidth] = useState(0);

    // Internal state for focused position (uncontrolled mode)
    const [uncontrolledFocusedPosition, setUncontrolledFocusedPosition] = useState({
      row: 0,
      col: 0,
    });

    // Vertical parking scroll state
    const [scrollOffset, setScrollOffset] = useState(0);

    // Use controlled or uncontrolled focused position
    const focusedPosition = controlledFocusedPosition || uncontrolledFocusedPosition;

    const cardCount = items.length;

    // Calculate grid dimensions using ChannelRow logic
    const { cardsPerRow, actualGap, totalRows, gridItems } = useMemo(() => {
      console.log('Grid calculation debug:', { cardCount, containerWidth, cardWidth, minGap });

      if (cardCount === 0) {
        return { cardsPerRow: 0, actualGap: 0, totalRows: 0, gridItems: [] };
      }

      if (cardCount === 1) {
        return {
          cardsPerRow: 1,
          actualGap: 0,
          totalRows: 1,
          gridItems: [items],
        };
      }

      // If containerWidth is 0 (initial render), use conservative fallback
      if (containerWidth === 0) {
        console.log('Using fallback calculation - containerWidth is 0');
        const fallbackCardsPerRow = Math.min(cardCount, 3);
        const fallbackRows = Math.ceil(cardCount / fallbackCardsPerRow);
        const fallbackGridItems = [];

        for (let i = 0; i < fallbackRows; i++) {
          const rowStart = i * fallbackCardsPerRow;
          const rowEnd = Math.min(rowStart + fallbackCardsPerRow, cardCount);
          fallbackGridItems.push(items.slice(rowStart, rowEnd));
        }

        console.log('Fallback result:', {
          fallbackCardsPerRow,
          fallbackRows,
          gridItems: fallbackGridItems.map(row => row.length),
        });

        return {
          cardsPerRow: fallbackCardsPerRow,
          actualGap: minGap,
          totalRows: fallbackRows,
          gridItems: fallbackGridItems,
        };
      }

      // Calculate maximum cards that can fit per row (borrowing from ChannelRow)
      let maxCardsThatCanFit = Math.floor((containerWidth + minGap) / (cardWidth + minGap));
      if (maxCardsThatCanFit < 1) maxCardsThatCanFit = 1;

      // Calculate the actual gap using the maximum cards that can fit
      const totalCardWidth = maxCardsThatCanFit * cardWidth;
      const availableGapSpace = containerWidth - totalCardWidth;
      const numberOfGaps = maxCardsThatCanFit - 1;

      const calculatedGap = numberOfGaps > 0 ? availableGapSpace / numberOfGaps : 0;
      const finalGap = Math.max(calculatedGap, minGap, 0);

      // Calculate total rows needed
      const calculatedTotalRows = Math.ceil(cardCount / maxCardsThatCanFit);

      // Create grid structure: array of rows, each row is array of items
      const calculatedGridItems = [];

      for (let rowIndex = 0; rowIndex < calculatedTotalRows; rowIndex++) {
        const rowStart = rowIndex * maxCardsThatCanFit;
        const rowEnd = Math.min(rowStart + maxCardsThatCanFit, cardCount);
        calculatedGridItems.push(items.slice(rowStart, rowEnd));
      }

      console.log('Final grid calculation:', {
        maxCardsThatCanFit,
        finalGap,
        calculatedTotalRows,
        gridItems: calculatedGridItems.map(row => row.length),
        containerWidth,
        cardWidth,
        minGap,
      });

      return {
        cardsPerRow: maxCardsThatCanFit,
        actualGap: finalGap,
        totalRows: calculatedTotalRows,
        gridItems: calculatedGridItems,
      };
    }, [containerWidth, cardWidth, cardCount, minGap, items]);

    // Row height - will be measured from actual DOM element
    const [measuredRowHeight, setMeasuredRowHeight] = useState(0);
    const firstRowRef = useRef(null);

    // Clamp focus position to valid bounds
    const clampedFocusedPosition = useMemo(() => {
      if (totalRows === 0) return { row: 0, col: 0 };

      const clampedRow = Math.min(Math.max(focusedPosition.row, 0), totalRows - 1);
      const currentRowLength = gridItems[clampedRow]?.length || 0;
      const clampedCol = Math.min(Math.max(focusedPosition.col, 0), currentRowLength - 1);

      return { row: clampedRow, col: clampedCol };
    }, [focusedPosition, totalRows, gridItems]);

    // Debug: Log state changes (after all variables are declared)
    console.log('📦 ChannelGrid render:', {
      cardCount,
      containerWidth,
      focused,
      scrollOffset,
      focusedPosition: clampedFocusedPosition,
      totalRows,
      actualGap,
    });

    // Use the forwarded ref for measurements with resize observer (better than ChannelRow pattern)
    useEffect(() => {
      if (!forwardedRef?.current) return;

      const element = forwardedRef.current;

      // Initial measurement
      const updateWidth = () => {
        const width = element.offsetWidth;
        console.log('ChannelGrid: Container width update:', width);
        if (width > 0) {
          setContainerWidth(prevWidth => {
            if (prevWidth !== width) {
              console.log('ChannelGrid: Width changed from', prevWidth, 'to', width);
              return width;
            }
            return prevWidth;
          });
        }
      };

      updateWidth();

      // Add resize observer for responsive updates
      const resizeObserver = new ResizeObserver(updateWidth);
      resizeObserver.observe(element);

      // Also add window resize listener as backup
      window.addEventListener('resize', updateWidth);

      // Cleanup
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', updateWidth);
      };
    }, []); // Only run once, ResizeObserver handles updates

    // Phase 2: 2D Navigation + Boundary Escape Pattern
    // Handle full 2D navigation within grid, escape at boundaries for group navigation
    useEffect(() => {
      if (!focused) return;

      const handleKeyDown = e => {
        const currentRow = clampedFocusedPosition.row;
        const currentCol = clampedFocusedPosition.col;
        const currentRowLength = gridItems[currentRow]?.length || 0;

        if (e.key === 'ArrowRight') {
          // Navigate right within current row
          if (currentCol < currentRowLength - 1) {
            const newPosition = { row: currentRow, col: currentCol + 1 };
            if (typeof controlledFocusedPosition === 'object') {
              onFocusChange && onFocusChange(newPosition);
            } else {
              setUncontrolledFocusedPosition(newPosition);
              onFocusChange && onFocusChange(newPosition);
            }
          }
          e.preventDefault();
          e.stopPropagation();
        } else if (e.key === 'ArrowLeft') {
          // Navigate left within current row
          if (currentCol > 0) {
            const newPosition = { row: currentRow, col: currentCol - 1 };
            if (typeof controlledFocusedPosition === 'object') {
              onFocusChange && onFocusChange(newPosition);
            } else {
              setUncontrolledFocusedPosition(newPosition);
              onFocusChange && onFocusChange(newPosition);
            }
          }
          e.preventDefault();
          e.stopPropagation();
        } else if (e.key === 'ArrowDown') {
          // 2D Navigation: Move down to next row within grid
          if (currentRow < totalRows - 1) {
            const nextRowLength = gridItems[currentRow + 1]?.length || 0;
            // Smart column preservation: clamp to available cards in next row
            const newCol = Math.min(currentCol, nextRowLength - 1);
            const newPosition = { row: currentRow + 1, col: newCol };
            if (typeof controlledFocusedPosition === 'object') {
              onFocusChange && onFocusChange(newPosition);
            } else {
              setUncontrolledFocusedPosition(newPosition);
              onFocusChange && onFocusChange(newPosition);
            }
            e.preventDefault();
            e.stopPropagation();
          } else {
            // Boundary Escape: Down from last row → let parent handle group navigation
            onNavigationEscape && onNavigationEscape('down');
            // Don't preventDefault - let it bubble for group navigation
          }
        } else if (e.key === 'ArrowUp') {
          // 2D Navigation: Move up to previous row within grid
          if (currentRow > 0) {
            const prevRowLength = gridItems[currentRow - 1]?.length || 0;
            // Smart column preservation: clamp to available cards in previous row
            const newCol = Math.min(currentCol, prevRowLength - 1);
            const newPosition = { row: currentRow - 1, col: newCol };
            if (typeof controlledFocusedPosition === 'object') {
              onFocusChange && onFocusChange(newPosition);
            } else {
              setUncontrolledFocusedPosition(newPosition);
              onFocusChange && onFocusChange(newPosition);
            }
            e.preventDefault();
            e.stopPropagation();
          } else {
            // Boundary Escape: Up from first row → let parent handle group navigation
            onNavigationEscape && onNavigationEscape('up');
            // Don't preventDefault - let it bubble for group navigation
          }
        } else if (e.key === 'Enter' || e.key === ' ') {
          // Selection: Handle Enter/Space within grid for now
          // TODO: This will be moved to KeyboardWrapper in integration phase
          const currentRowItems = gridItems[currentRow];
          if (currentRowItems && currentRowItems[currentCol]) {
            onSelect && onSelect(currentRowItems[currentCol], clampedFocusedPosition);
          }
          e.preventDefault();
          e.stopPropagation();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [
      focused,
      clampedFocusedPosition,
      gridItems,
      totalRows,
      onFocusChange,
      onSelect,
      onNavigationEscape,
      controlledFocusedPosition,
    ]);

    // Reset uncontrolled focusedPosition when focus changes or children change
    useEffect(() => {
      if (!controlledFocusedPosition) {
        setUncontrolledFocusedPosition({ row: 0, col: 0 });
      }
    }, [focused, cardCount, controlledFocusedPosition]);

    // Measure actual row height from DOM
    useLayoutEffect(() => {
      if (firstRowRef.current) {
        const height = firstRowRef.current.offsetHeight;
        if (height > 0 && height !== measuredRowHeight) {
          setMeasuredRowHeight(height);
          console.log('🔍 Measured row height from DOM:', height);
        }
      }
    }, [gridItems, measuredRowHeight]);

    // Use measured row height for calculations
    const rowHeight = measuredRowHeight || 435; // Fallback to estimated height

    // Calculate scroll offset to park the LAST ROW at bottom (FixedSwimlane behavior, transposed vertically)
    useEffect(() => {
      if (!focused || !forwardedRef?.current || !rowHeight) return;

      const containerHeight = forwardedRef.current.offsetHeight;
      const totalContentHeight = totalRows * rowHeight;

      // Calculate bottom safety padding (like ChannelInfo.jsx for overlay clearance)
      const getBottomSafetyPadding = () => {
        const adBannerHeight = 150; // --ad-banner-height
        const miniPlayerHeight = 120; // --mini-player-height (when visible)
        const spacingXXL = 48; // --spacing-xxl

        // For now, assume mini-player is visible (can be made dynamic later)
        return adBannerHeight + miniPlayerHeight + spacingXXL;
      };

      const bottomPadding = getBottomSafetyPadding();

      // FixedSwimlane parking logic, transposed vertically:
      // 1. Natural scroll position (content moves by full rows)
      const naturalScrollOffset = clampedFocusedPosition.row * rowHeight;

      // 2. Max scroll position (last row parks at bottom with padding)
      const maxScrollOffset = Math.max(0, totalContentHeight - containerHeight + bottomPadding);

      // 3. Use minimum (never scroll past the last row parking position)
      const clampedOffset = -Math.min(naturalScrollOffset, maxScrollOffset);

      setScrollOffset(clampedOffset);

      // Debug info for testing
      console.log('🎯 LAST ROW PARKING DEBUG:', {
        focusedRow: clampedFocusedPosition.row,
        focusedCol: clampedFocusedPosition.col,
        totalRows,
        containerHeight,
        totalContentHeight,
        rowHeight: `${rowHeight}px ${measuredRowHeight ? '(measured)' : '(fallback)'}`,
        bottomPadding,
        naturalScrollOffset,
        maxScrollOffset,
        finalScrollOffset: clampedOffset,
        lastRowPosition: (totalRows - 1) * rowHeight,
        lastRowTargetPosition: containerHeight - bottomPadding - rowHeight,
        contentFitsInContainer: totalContentHeight <= containerHeight,
      });
    }, [clampedFocusedPosition, focused, forwardedRef, totalRows, rowHeight]);

    // Calculate flat index for each card (needed for renderItem pattern)
    const getFlatIndex = (row, col) => {
      let flatIndex = 0;
      for (let r = 0; r < row; r++) {
        flatIndex += gridItems[r]?.length || 0;
      }
      return flatIndex + col;
    };

    return (
      <div
        ref={forwardedRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%', // Fill parent container
          paddingLeft: leftPadding,
          paddingRight: rightPadding,
          maxHeight: maxHeight,
          overflow: 'visible', // Allow transformed content to show outside bounds
          gap: `${actualGap}px`,
          boxSizing: 'border-box',
          position: 'relative', // For parking scroll positioning
          outline: 'none', // Prevent browser focus outline
          ...style,
        }}
        tabIndex={-1} // Make container not focusable by browser
        onFocus={e => e.target.blur()} // Immediately blur any focus
        {...props}
      >
        <div
          style={{
            transform: `translateY(${scrollOffset}px)`,
            transition: 'transform 0.2s ease-out', // Smooth scrolling animation
            width: '100%', // Ensure content wrapper takes full width
            overflow: 'visible', // Allow transformed content to show outside bounds
          }}
        >
          {/* Debug: Last row parking info */}
          {focused && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: 'rgba(0,100,200,0.9)',
                color: 'white',
                padding: '8px 12px',
                fontSize: '11px',
                zIndex: 1002,
                borderRadius: '4px',
                fontFamily: 'monospace',
              }}
            >
              <div>
                Row: {clampedFocusedPosition.row + 1}/{totalRows}
              </div>
              <div>Scroll: {scrollOffset.toFixed(1)}px</div>
              <div>
                Row Height: {rowHeight}px {measuredRowHeight ? '✓' : '?'}
              </div>
              <div>
                Mode:{' '}
                {Math.abs(scrollOffset) >= (totalRows - 1) * rowHeight - 50
                  ? 'PARKED'
                  : 'SCROLLING'}
              </div>
            </div>
          )}
          {gridItems.map((rowItems, rowIndex) => (
            <div
              key={rowIndex}
              ref={rowIndex === 0 ? firstRowRef : null} // Measure first row height
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start', // Left-align for partial rows
                alignItems: 'center',
                width: '100%',
                gap: `${actualGap}px`,
                flexWrap: 'nowrap',
              }}
            >
              {rowItems.map((item, colIndex) => {
                const flatIndex = getFlatIndex(rowIndex, colIndex);

                // Use FixedSwimlane pattern: focused && i === focusedIndex
                const isItemFocused =
                  focused &&
                  rowIndex === clampedFocusedPosition.row &&
                  colIndex === clampedFocusedPosition.col;

                return (
                  <div key={item.id || `${rowIndex}-${colIndex}`} style={{ width: cardWidth }}>
                    {renderItem ? (
                      renderItem(item, flatIndex, isItemFocused)
                    ) : (
                      <div>No renderItem provided</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Focus ring removed - using card's own focus styling */}
      </div>
    );
  }
);

ChannelGrid.displayName = 'ChannelGrid';

export default ChannelGrid;
