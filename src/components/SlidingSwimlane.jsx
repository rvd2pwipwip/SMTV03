import React, { useMemo } from 'react';
import '../styles/App.css';

/**
 * SlidingSwimlane - horizontally scrolls its children based on the focused card index.
 *
 * Props:
 * - children: ChannelCard components
 * - focusedIndex: index of the currently focused card
 * - cardWidth: width of a card (px)
 * - cardGap: gap between cards (px)
 * - numCards: total number of cards
 * - viewportWidth: width of the visible swimlane area (px)
 * - sidePadding: padding on each side (px)
 */
const SlidingSwimlane = React.forwardRef(({
  children,
  focusedIndex = 0,
  cardWidth = 300,
  cardGap = 24,
  numCards = 12,
  viewportWidth = 1792, // 1920 - 2*64
  sidePadding = 64,
  ...props
}, ref) => {
  // Calculate the offset for the swimlane content
  const offset = useMemo(() => {
    // The full width of a card including the gap
    const cardFullWidth = cardWidth + cardGap;
    // The total width of all cards
    const totalContentWidth = numCards * cardFullWidth;
    // The maximum offset so the last card "parks" at the right edge
    const maxOffset = Math.max(0, totalContentWidth - viewportWidth + sidePadding);
    // Desired offset: keep focused card at left after padding
    let calcOffset = focusedIndex * cardFullWidth - sidePadding;
    // Clamp so we never scroll before the first card
    calcOffset = Math.max(0, calcOffset);
    // Clamp so we never scroll past the last card
    calcOffset = Math.min(calcOffset, maxOffset);
    return calcOffset;
  }, [focusedIndex, cardWidth, cardGap, numCards, viewportWidth, sidePadding]);

  return (
    <div 
      className="swimlane-viewport"
      style={{ width: '100%', overflow: 'hidden', paddingLeft: 'var(--screen-side-padding)' }}
    >
      <div 
        className="content-swimlane"
        style={{
          display: 'flex',
          gap: `${cardGap}px`,
          transform: `translateX(-${offset}px)`,
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {children}
      </div>
    </div>
  );
});

SlidingSwimlane.displayName = 'SlidingSwimlane';

export default SlidingSwimlane; 