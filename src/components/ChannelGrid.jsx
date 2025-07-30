import React, { useMemo, useState, useEffect, forwardRef } from 'react';

const ChannelGrid = forwardRef(
  (
    {
      children,
      cardWidth = 300, // px, consistent with ChannelRow
      minGap = 32, // px, minimum gap between cards
      style,
      // Navigation props (prepared for Phase 2)
      focused = false,
      focusedPosition: controlledFocusedPosition,
      onFocusChange,
      onSelect,
      onNavigationEscape,
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

    // Use controlled or uncontrolled focused position
    const focusedPosition = controlledFocusedPosition || uncontrolledFocusedPosition;

    const cardCount = React.Children.count(children);

    // Calculate grid dimensions using ChannelRow logic
    const { cardsPerRow, actualGap, totalRows, gridItems } = useMemo(() => {
      // DEBUG: Add console logging to see what's happening
      console.log('ChannelGrid Debug:', {
        containerWidth,
        cardCount,
        cardWidth,
        minGap,
      });
      if (cardCount === 0) {
        return { cardsPerRow: 0, actualGap: 0, totalRows: 0, gridItems: [] };
      }

      if (cardCount === 1) {
        return {
          cardsPerRow: 1,
          actualGap: 0,
          totalRows: 1,
          gridItems: [React.Children.toArray(children)],
        };
      }

      // If containerWidth is 0 (initial render), use conservative fallback
      if (containerWidth === 0) {
        const fallbackCardsPerRow = Math.min(cardCount, 3);
        const fallbackRows = Math.ceil(cardCount / fallbackCardsPerRow);
        const childrenArray = React.Children.toArray(children);
        const fallbackGridItems = [];

        for (let i = 0; i < fallbackRows; i++) {
          const rowStart = i * fallbackCardsPerRow;
          const rowEnd = Math.min(rowStart + fallbackCardsPerRow, cardCount);
          fallbackGridItems.push(childrenArray.slice(rowStart, rowEnd));
        }

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

      // Create grid structure: array of rows, each row is array of children
      const childrenArray = React.Children.toArray(children);
      const calculatedGridItems = [];

      for (let rowIndex = 0; rowIndex < calculatedTotalRows; rowIndex++) {
        const rowStart = rowIndex * maxCardsThatCanFit;
        const rowEnd = Math.min(rowStart + maxCardsThatCanFit, cardCount);
        calculatedGridItems.push(childrenArray.slice(rowStart, rowEnd));
      }

      console.log('ChannelGrid Calculated:', {
        maxCardsThatCanFit,
        finalGap,
        calculatedTotalRows,
      });

      return {
        cardsPerRow: maxCardsThatCanFit,
        actualGap: finalGap,
        totalRows: calculatedTotalRows,
        gridItems: calculatedGridItems,
      };
    }, [containerWidth, cardWidth, cardCount, minGap, children]);

    // Clamp focus position to valid bounds
    const clampedFocusedPosition = useMemo(() => {
      if (totalRows === 0) return { row: 0, col: 0 };

      const clampedRow = Math.min(Math.max(focusedPosition.row, 0), totalRows - 1);
      const currentRowLength = gridItems[clampedRow]?.length || 0;
      const clampedCol = Math.min(Math.max(focusedPosition.col, 0), currentRowLength - 1);

      return { row: clampedRow, col: clampedCol };
    }, [focusedPosition, totalRows, gridItems]);

    // Use the forwarded ref for measurements (same pattern as ChannelRow)
    useEffect(() => {
      if (forwardedRef?.current) {
        const element = forwardedRef.current;
        const width = element.offsetWidth;

        if (width > 0) {
          setContainerWidth(width);
        }
      }
    }); // No dependency array - run on every render

    // Reset uncontrolled focusedPosition when focus changes or children change
    useEffect(() => {
      if (!controlledFocusedPosition) {
        setUncontrolledFocusedPosition({ row: 0, col: 0 });
      }
    }, [focused, cardCount, controlledFocusedPosition]);

    return (
      <div
        ref={forwardedRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          paddingLeft: leftPadding,
          paddingRight: rightPadding,
          maxHeight: maxHeight,
          overflow: maxHeight ? 'hidden' : 'visible',
          gap: `${actualGap}px`,
          ...style,
        }}
        {...props}
      >
        {gridItems.map((rowItems, rowIndex) => (
          <div
            key={rowIndex}
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
            {rowItems.map((child, colIndex) => {
              const isChildFocused =
                focused &&
                clampedFocusedPosition.row === rowIndex &&
                clampedFocusedPosition.col === colIndex;

              return React.cloneElement(child, {
                key: child.key || `${rowIndex}-${colIndex}`,
                style: { width: cardWidth, ...child.props.style },
                // Pass focused state to child for styling
                focused: isChildFocused,
              });
            })}
          </div>
        ))}
      </div>
    );
  }
);

ChannelGrid.displayName = 'ChannelGrid';

export default ChannelGrid;
