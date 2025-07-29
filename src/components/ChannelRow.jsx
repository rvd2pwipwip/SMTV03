import React, { useMemo, useRef, useState, useEffect } from 'react';

const ChannelRow = ({
  children,
  cardWidth = 300,      // px, adjust as needed
  minGap = 32,          // px, minimum gap between cards
  style,
  // New navigation props (following VariableSwimlane pattern)
  focused = false,
  focusedIndex: controlledFocusedIndex,
  onFocusChange,
  onSelect,
  ...props
}) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Internal state for focused index (uncontrolled mode)
  const [uncontrolledFocusedIndex, setUncontrolledFocusedIndex] = useState(0);
  
  // Use controlled or uncontrolled focused index
  const focusedIndex = typeof controlledFocusedIndex === 'number' ? controlledFocusedIndex : uncontrolledFocusedIndex;

  // Update container width on resize
  useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = () => {
      setContainerWidth(containerRef.current.offsetWidth);
    };
    handleResize();
    const resizeObserver = new window.ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const cardCount = React.Children.count(children);

  // Calculate max number of cards that can fit
  const { maxCards } = useMemo(() => {
    if (cardCount < 2 || containerWidth === 0) {
      return { maxCards: cardCount };
    }
    // Try to fit as many cards as possible with at least minGap
    let possibleCards = Math.min(cardCount, Math.floor((containerWidth + minGap) / (cardWidth + minGap)));
    if (possibleCards < 2) possibleCards = 2;
    return { maxCards: possibleCards };
  }, [containerWidth, cardWidth, cardCount, minGap]);

  // Only render up to maxCards
  const visibleChildren = React.Children.toArray(children).slice(0, maxCards);

  // Keyboard navigation logic (following VariableSwimlane pattern)
  useEffect(() => {
    if (!focused) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        if (typeof controlledFocusedIndex === 'number') {
          onFocusChange && onFocusChange(Math.min(focusedIndex + 1, visibleChildren.length - 1));
        } else {
          setUncontrolledFocusedIndex((prev) => {
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
          setUncontrolledFocusedIndex((prev) => {
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
  }, [focused, focusedIndex, visibleChildren.length, onSelect, onFocusChange, controlledFocusedIndex]);

  // Reset uncontrolled focusedIndex when focus changes or children change
  useEffect(() => {
    if (typeof controlledFocusedIndex !== 'number') {
      setUncontrolledFocusedIndex(0);
    }
  }, [focused, cardCount, controlledFocusedIndex]);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: 0,
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
};

export default ChannelRow; 