import React, { useRef, useEffect } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { useFocusNavigation } from '../contexts/GroupFocusNavigationContext';
import KeyboardWrapper from './KeyboardWrapper';

const MiniPlayer = () => {
  const { isPlayerOpen, openPlayer } = usePlayer();
  const {
    focusedGroupIndex,
    MINI_PLAYER_GROUP_INDEX,
    isMiniPlayerVisible,
    moveFocusUp,
    moveFocusDown,
  } = useFocusNavigation();
  const miniPlayerRef = useRef(null);

  const isFocused = isMiniPlayerVisible && focusedGroupIndex === MINI_PLAYER_GROUP_INDEX;

  // Mock data - will be replaced with actual player state
  const mockPlayerData = {
    songTitle: 'Song Title',
    artistName: 'Artist Name',
    isPlaying: true,
  };

  useEffect(() => {
    if (isFocused && miniPlayerRef.current) {
      setTimeout(() => {
        if (miniPlayerRef.current) {
          miniPlayerRef.current.focus();
        }
      }, 10);
    }
  }, [isFocused]);

  if (!isMiniPlayerVisible) {
    return null;
  }

  const handleSelect = () => {
    console.log('Mini-player handleSelect called');
    openPlayer();
  };

  const handleUp = e => {
    console.log('Mini-player handleUp called');
    moveFocusUp();
    e.preventDefault();
  };

  const handleDown = e => {
    console.log('Mini-player handleDown called');
    moveFocusDown();
    e.preventDefault();
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'var(--ad-banner-height)',
        left: '50%',
        transform: 'translateX(-50%) translateY(0%)',
        width: '1000px',
        height: '120px',
        zIndex: 200, // Below AdBanner (250) so focus ring bottom is hidden
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: 'auto',
      }}
    >
      <KeyboardWrapper
        ref={miniPlayerRef}
        onSelect={handleSelect}
        onUp={handleUp}
        onDown={handleDown}
      >
        <div
          tabIndex={0}
          data-stable-id="mini-player"
          style={{
            width: '100%',
            height: '100%',
            background: isFocused ? 'rgba(250, 250, 250, 0.95)' : 'rgba(250, 250, 250, 0.9)',
            backdropFilter: 'blur(12px)',
            borderRadius: '30px 30px 0px 0px',
            // Focus ring as outside shadow that "grows" when focused
            boxShadow: isFocused
              ? `0 0 0 var(--focus-outline-width, 10px) var(--color-focus-ring, #ffffff)`
              : 'none',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 30px 20px 22px',
            color: '#121212',
            outline: 'none', // Suppress browser's default focus outline
            transition: 'all 0.15s ease-in-out',
            boxSizing: 'border-box',
            cursor: 'pointer',
          }}
        >
          {/* Left section with cover and content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '16px',
              flex: 1,
              minWidth: 0, // Prevent overflow
            }}
          >
            {/* Cover Art Placeholder */}
            <div
              style={{
                width: '80px',
                height: '80px',
                background: 'rgba(30, 30, 30, 0.3)',
                borderRadius: '10px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(30, 30, 30, 0.6)',
                fontSize: '12px',
                fontFamily: 'var(--font-family-primary)',
              }}
            >
              80x80
            </div>

            {/* Song and Artist Info */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '4px',
                paddingRight: '10px',
                flex: 1,
                minWidth: 0, // Allow text truncation
              }}
            >
              {/* Song Title */}
              <div
                style={{
                  fontFamily: 'Roboto, var(--font-family-primary)',
                  fontSize: '28px',
                  fontWeight: '600',
                  lineHeight: '1.171875em',
                  color: '#121212',
                  textAlign: 'left',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {mockPlayerData.songTitle}
              </div>

              {/* Artist Name */}
              <div
                style={{
                  fontFamily: 'Roboto, var(--font-family-primary)',
                  fontSize: '28px',
                  fontWeight: '400',
                  lineHeight: '1.171875em',
                  color: 'rgba(18, 18, 18, 0.8)',
                  textAlign: 'left',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {mockPlayerData.artistName}
              </div>
            </div>
          </div>

          {/* Right section - empty for TV version */}
          <div style={{ width: '0px' }}>
            {/* Intentionally empty - no controls for TV version */}
          </div>
        </div>
      </KeyboardWrapper>
    </div>
  );
};

export default MiniPlayer;
