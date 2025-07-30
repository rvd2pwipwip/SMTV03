import React, { useMemo, useState, useEffect, forwardRef } from 'react';

const ChannelRow = forwardRef(
  (
    {
      children,
      cardWidth = 300, // px, adjust as needed
      minGap = 32, // px, minimum gap between cards
      style,
      // New navigation props (following VariableSwimlane pattern)
      focused = false,
      focusedIndex: controlledFocusedIndex,
      onFocusChange,
      onSelect,
      ...props
    },
    forwardedRef
  ) => {
    const [containerWidth, setContainerWidth] = useState(0);

    // Internal state for focused index (uncontrolled mode)
    const [uncontrolledFocusedIndex, setUncontrolledFocusedIndex] = useState(0);

    // Use controlled or uncontrolled focused index
    const focusedIndex =
      typeof controlledFocusedIndex === 'number'
        ? controlledFocusedIndex
        : uncontrolledFocusedIndex;

    const cardCount = React.Children.count(children);

    // Calculate max number of cards that can fit and the actual gap to use
    const { maxCards, actualGap } = useMemo(() => {
      if (cardCount < 2) {
        return { maxCards: cardCount, actualGap: 0 };
      }

      // If containerWidth is 0 (initial render), use minGap as fallback
      if (containerWidth === 0) {
        // Conservative fallback - show fewer cards when we don't know container width
        const fallbackMaxCards = Math.min(cardCount, 3); // Show max 3 cards as fallback
        return { maxCards: fallbackMaxCards, actualGap: minGap };
      }

      // Calculate maximum cards that can fit (ignore actual cardCount for gap calculation)
      let maxCardsThatCanFit = Math.floor((containerWidth + minGap) / (cardWidth + minGap));
      if (maxCardsThatCanFit < 2) maxCardsThatCanFit = 2;

      // Use the max cards for gap calculation (consistent spacing)
      let possibleCards = maxCardsThatCanFit;

      // Calculate the actual gap that would be used with maxCards
      const totalCardWidth = possibleCards * cardWidth;
      const availableGapSpace = containerWidth - totalCardWidth;
      const numberOfGaps = possibleCards - 1;

      // Handle edge case where we have only 1 card
      const calculatedGap = numberOfGaps > 0 ? availableGapSpace / numberOfGaps : 0;

      // Ensure gap is non-negative and at least minGap (protect against very narrow containers)
      const finalGap = Math.max(calculatedGap, minGap, 0);

      return { maxCards: possibleCards, actualGap: finalGap };
    }, [containerWidth, cardWidth, cardCount, minGap]);

    // Only render available cards (don't try to show more cards than we have)
    const actualCardsToShow = Math.min(cardCount, maxCards);
    const visibleChildren = React.Children.toArray(children).slice(0, actualCardsToShow);

    // Keyboard navigation logic (following VariableSwimlane pattern)
    useEffect(() => {
      if (!focused) return;

      const handleKeyDown = e => {
        if (e.key === 'ArrowRight') {
          if (typeof controlledFocusedIndex === 'number') {
            onFocusChange && onFocusChange(Math.min(focusedIndex + 1, visibleChildren.length - 1));
          } else {
            setUncontrolledFocusedIndex(prev => {
              const next = Math.min(prev + 1, visibleChildren.length - 1);
              onFocusChange && onFocusChange(next);
              return next;
            });
          }
          e.preventDefault();
          e.stopPropagation();
        } else if (e.key === 'ArrowLeft') {
          if (typeof controlledFocusedIndex === 'number') {
            onFocusChange && onFocusChange(Math.max(focusedIndex - 1, 0));
          } else {
            setUncontrolledFocusedIndex(prev => {
              const next = Math.max(prev - 1, 0);
              onFocusChange && onFocusChange(next);
              return next;
            });
          }
          e.preventDefault();
          e.stopPropagation();
        } else if (e.key === 'Enter' || e.key === ' ') {
          onSelect && onSelect(focusedIndex);
          e.preventDefault();
          e.stopPropagation();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [
      focused,
      focusedIndex,
      visibleChildren.length,
      onSelect,
      onFocusChange,
      controlledFocusedIndex,
    ]);

    // Reset uncontrolled focusedIndex when focus changes or children change
    useEffect(() => {
      if (typeof controlledFocusedIndex !== 'number') {
        setUncontrolledFocusedIndex(0);
      }
    }, [focused, cardCount, controlledFocusedIndex]);

    // Use the forwarded ref for measurements
    useEffect(() => {
      if (forwardedRef?.current) {
        const element = forwardedRef.current;
        const width = element.offsetWidth;

        if (width > 0) {
          setContainerWidth(width);
        }
      }
    }); // No dependency array - run on every render

    return (
      <div
        ref={forwardedRef}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          gap: `${actualGap}px`,
          flexWrap: 'nowrap',
          ...style,
        }}
        {...props}
      >
        {visibleChildren.map((child, index) =>
          React.cloneElement(child, {
            key: child.key || index,
            style: { width: cardWidth, ...child.props.style },
            // Pass focused state to child for styling
            focused: focused && focusedIndex === index,
          })
        )}
      </div>
    );
  }
);

ChannelRow.displayName = 'ChannelRow';

export default ChannelRow;
