import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import '../styles/App.css';

const SlidingSwimlane = React.forwardRef(({ children, restoring = false, ...props }, ref) => {
  const [offset, setOffset] = useState(0);
  const swimlaneRef = useRef(null);

  // Expose imperative handle for parent to get/set offset
  useImperativeHandle(ref, () => ({
    // Returns the current offset value
    getOffset: () => offset,
    // Allows parent to set the offset directly
    setOffset: (value) => setOffset(value)
  }), [offset]);

  // Calculate offset when focus changes
  useEffect(() => {
    // Skip observer logic during restoration phase
    if (restoring) return;
    if (!swimlaneRef.current) return;

    const updateOffset = () => {
      const focusedElement = document.querySelector('[data-focused="true"]');
      if (!focusedElement) return;

      // Only update offset if the focused element is inside the swimlane
      if (!swimlaneRef.current.contains(focusedElement)) return;

      const viewportRect = swimlaneRef.current.getBoundingClientRect();
      const focusedRect = focusedElement.getBoundingClientRect();
      const firstCard = swimlaneRef.current.querySelector('[data-stable-id="home-card-1"]');
      
      if (!firstCard) return;

      const firstCardRect = firstCard.getBoundingClientRect();
      const newOffset = firstCardRect.left - focusedRect.left;

      // Get the total width of the content
      const contentRect = swimlaneRef.current.getBoundingClientRect();
      const contentWidth = contentRect.width;
      const viewportWidth = viewportRect.width;
      
      // Get the CSS variable value using getComputedStyle
      const screenSidePadding = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--screen-side-padding'));

      // Calculate how much the content can slide before reaching the margin
      const maxSlide = contentWidth - viewportWidth + screenSidePadding + screenSidePadding;

      // If the new offset would slide the content beyond the max slide, use the max slide instead
      if (Math.abs(newOffset) > maxSlide) {
        setOffset(-maxSlide);
        return;
      }

      setOffset(newOffset);
    };

    // Set up MutationObserver to watch for focus changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-focused') {
          updateOffset();
        }
      });
    });

    // Start observing all cards in the swimlane
    const cards = swimlaneRef.current.querySelectorAll('[data-stable-id^="home-card-"]');
    cards.forEach(card => {
      observer.observe(card, { attributes: true });
    });

    // Initial update
    updateOffset();

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [restoring]);

  return (
    <div 
      className="swimlane-viewport"
      style={{ width: '100%' }}
    >
      <div 
        className="content-swimlane"
        ref={swimlaneRef}
        style={{ 
          transform: `translateX(${offset}px)`,
          transition: restoring ? 'none' : undefined // Disable transition if restoring
        }}
      >
        {children}
      </div>
    </div>
  );
});

SlidingSwimlane.displayName = 'SlidingSwimlane';

export default SlidingSwimlane; 