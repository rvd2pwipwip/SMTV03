import React, { useEffect } from 'react';
import { usePlayer } from '../contexts/PlayerContext';

function PlayerOverlay() {
  const { isPlayerOpen, closePlayer } = usePlayer();

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
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-background-primary, #1a1a1a)',
          padding: '40px',
          borderRadius: '12px',
          color: 'var(--color-text-primary, white)',
          fontFamily: 'var(--font-family-primary)',
          fontSize: '24px',
          border: '2px solid var(--color-outline-primary, #333)',
        }}
      >
        Player Overlay - Step 3 Test
      </div>
    </div>
  );
}

export default PlayerOverlay;
