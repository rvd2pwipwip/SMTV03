import React, { useEffect, useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';

function PlayerOverlay() {
  const { isPlayerOpen, closePlayer } = usePlayer();
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  // Handle animation timing when overlay opens
  useEffect(() => {
    if (isPlayerOpen) {
      // Small delay to ensure DOM is ready, then trigger slide-up animation
      const timer = setTimeout(() => {
        setIsAnimatingIn(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      // Reset animation state when closing
      setIsAnimatingIn(false);
    }
  }, [isPlayerOpen]);

  // Add escape key handler when overlay is open
  // Must be before early return to follow Rules of Hooks
  useEffect(() => {
    if (!isPlayerOpen) return;

    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        closePlayer();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlayerOpen, closePlayer]);

  // Don't render anything if player is closed
  if (!isPlayerOpen) {
    return null;
  }

  return (
    <div
      className="player-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '1920px',
        height: '1080px',
        backgroundColor: `rgba(0, 0, 0, ${isAnimatingIn ? 0.8 : 0})`,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        transition: 'background-color 0.3s ease-out',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-background-primary, #1a1a1a)',
          padding: '40px',
          borderRadius: '12px 12px 0 0',
          color: 'var(--color-text-primary, white)',
          fontFamily: 'var(--font-family-primary)',
          fontSize: '24px',
          border: '2px solid var(--color-outline-primary, #333)',
          borderBottom: 'none',
          width: '100%',
          maxWidth: '1920px',
          height: '70%',
          transform: `translateY(${isAnimatingIn ? '0%' : '100%'})`,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Player Overlay - Step 7 Animation Test
      </div>
    </div>
  );
}

export default PlayerOverlay;
