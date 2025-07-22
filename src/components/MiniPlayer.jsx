import React, { useState, useRef, useEffect } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { useFocusNavigation } from '../contexts/GroupFocusNavigationContext';
import KeyboardWrapper from './KeyboardWrapper';

/**
 * MiniPlayer - Overlay component that appears above AdBanner
 *
 * Features:
 * - Positioned absolutely within app container (above AdBanner)
 * - Smooth slide-in/out transitions
 * - Focusable with keyboard navigation
 * - Enter key opens full PlayerOverlay
 * - No player controls (TV-specific behavior)
 */
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

  // This component is focused when it's the active group and visible
  const isFocused = isMiniPlayerVisible && focusedGroupIndex === MINI_PLAYER_GROUP_INDEX;

  // For now, use mock data - will be replaced with actual player state
  const mockPlayerData = {
    songTitle: 'Song Title',
    artistName: 'Artist Name',
    isPlaying: true,
  };

  // HOOKS MUST COME BEFORE ANY CONDITIONAL RETURNS
  // Focus management: focus the mini-player when it becomes the active group
  useEffect(() => {
    if (isFocused && miniPlayerRef.current) {
      console.log('Setting focus on mini-player');
      // Small delay to ensure other elements are blurred first
      setTimeout(() => {
        if (miniPlayerRef.current) {
          miniPlayerRef.current.focus();
          console.log('Focus set on mini-player');
        }
      }, 10);
    }
  }, [isFocused]);

  // Debug logging to track focus state
  useEffect(() => {
    console.log('MiniPlayer state:', {
      isFocused,
      focusedGroupIndex,
      MINI_PLAYER_GROUP_INDEX,
      hasRef: !!miniPlayerRef.current,
    });
  }, [isFocused, focusedGroupIndex, MINI_PLAYER_GROUP_INDEX]);

  // Don't render if player overlay is open or if not visible according to context
  if (!isMiniPlayerVisible) {
    return null;
  }

  // For now, always show mini-player when visible - later will be conditional on actual player state
  const shouldShow = true;

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
        bottom: 'var(--ad-banner-height)', // 150px - sits on top of AdBanner
        left: '50%',
        transform: `translateX(-50%) translateY(${
          shouldShow ? (isFocused ? 'calc(-1 * var(--focus-outline-width, 10px))' : '0%') : '100%'
        })`,
        width: '960px',
        height: '120px',
        zIndex: 200,
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: shouldShow ? 'auto' : 'none',
      }}
    >
      <KeyboardWrapper
        ref={miniPlayerRef}
        onSelect={handleSelect}
        onUp={handleUp}
        onDown={handleDown}
      >
        <div
          data-stable-id="mini-player"
          tabIndex={0}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '30px 30px 0px 0px',
            // Use box-shadow instead of outline for better visibility
            // Keep focus ring consistent with app's focus system using design tokens
            boxShadow: isFocused
              ? '0 0 0 var(--focus-outline-width, 10px) var(--color-focus-ring, #ffffff)'
              : 'none',
            transition: 'box-shadow 0.15s ease-in-out',
            outline: 'none', // Remove default browser focus outline
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              // Inverted theme: light background when app is dark, dark when app is light
              background: isFocused ? 'rgba(250, 250, 250, 0.95)' : 'rgba(250, 250, 250, 0.9)',
              backdropFilter: 'blur(12px)',
              borderRadius: '30px 30px 0px 0px',
              border: isFocused ? '2px solid var(--color-focus-ring, #ffffff)' : 'none',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 30px 20px 22px',
              boxSizing: 'border-box',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out',
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
                  // Inverted: dark placeholder when mini-player has light background
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
                    // Inverted: dark text when mini-player has light background
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
                    // Inverted: dark gray text when mini-player has light background
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

            {/* Right section - empty for now (no controls in TV version) */}
            <div style={{ width: '0px' }}>
              {/* Intentionally empty - no controls for TV version */}
            </div>
          </div>
        </div>
      </KeyboardWrapper>
    </div>
  );
};

export default MiniPlayer;
