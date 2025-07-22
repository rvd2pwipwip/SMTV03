import React, { useEffect, useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import '../styles/App.css';
import { Info, Like, SkipNext } from 'stingray-icons';
import stingrayMusicLogo from '../assets/svg/stingrayMusic.svg';
import PlayPauseButton from './PlayPauseButton';
import KeyboardWrapper from './KeyboardWrapper';
import { Button } from '@smtv/tv-component-library';
import { TRANS_BTN_ICON_SIZE } from '../constants/ui';
import { getSidePadding } from '../utils/layout';
import AdBanner from './AdBanner';

function PlayerOverlay() {
  const { isPlayerOpen, closePlayer } = usePlayer();
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  // Group-based focus management
  const [activeGroup, setActiveGroup] = useState(1); // 0=header, 1=controls (start with controls)
  const [headerFocusedIndex, setHeaderFocusedIndex] = useState(0); // 0=info, 1=like
  const [controlsFocusedIndex, setControlsFocusedIndex] = useState(0); // 0=play/pause, 1=skip

  // Refs for focusable elements
  const infoRef = React.useRef(null);
  const likeRef = React.useRef(null);
  const controlsGroupRef = React.useRef(null);
  const skipRef = React.useRef(null);
  const pauseRef = React.useRef(null);

  // Ref to store the element that opened the player (for focus return)
  const triggerElementRef = React.useRef(null);

  // Arrays of refs for each group
  const headerRefs = [infoRef, likeRef];
  const controlsRefs = [pauseRef, skipRef];

  // Handle animation timing when overlay opens
  useEffect(() => {
    if (isPlayerOpen) {
      // Store the currently focused element to return focus later
      triggerElementRef.current = document.activeElement;

      // Small delay to ensure DOM is ready, then trigger slide-up animation
      const timer = setTimeout(() => {
        setIsAnimatingIn(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      // Reset animation and focus state when closing
      setIsAnimatingIn(false);
      setActiveGroup(1); // Reset to controls group
      setHeaderFocusedIndex(0); // Reset to info button
      setControlsFocusedIndex(0); // Reset to play/pause button

      // Return focus to the element that opened the player
      if (triggerElementRef.current) {
        triggerElementRef.current.focus();
        triggerElementRef.current = null;
      }
    }
  }, [isPlayerOpen]);

  // Set initial focus when animation completes
  useEffect(() => {
    if (isAnimatingIn) {
      // Wait for animation to complete before focusing
      const timer = setTimeout(() => {
        const currentRefs = activeGroup === 0 ? headerRefs : controlsRefs;
        const currentIndex = activeGroup === 0 ? headerFocusedIndex : controlsFocusedIndex;

        if (currentRefs[currentIndex]?.current) {
          currentRefs[currentIndex].current.focus();
        }
      }, 400); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isAnimatingIn, activeGroup, headerFocusedIndex, controlsFocusedIndex]);

  // Add keyboard navigation and escape key handler when overlay is open
  // Must be before early return to follow Rules of Hooks
  useEffect(() => {
    if (!isPlayerOpen) return;

    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        closePlayer();
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        if (activeGroup === 0) {
          // Header group: Navigate between info/like (no wrapping)
          setHeaderFocusedIndex(prev => {
            const newIndex = Math.max(prev - 1, 0);
            if (headerRefs[newIndex]?.current) {
              headerRefs[newIndex].current.focus();
            }
            return newIndex;
          });
        } else {
          // Controls group: Navigate between play/pause/skip (no wrapping)
          setControlsFocusedIndex(prev => {
            const newIndex = Math.max(prev - 1, 0);
            if (controlsRefs[newIndex]?.current) {
              controlsRefs[newIndex].current.focus();
            }
            return newIndex;
          });
        }
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        if (activeGroup === 0) {
          // Header group: Navigate between info/like (no wrapping)
          setHeaderFocusedIndex(prev => {
            const newIndex = Math.min(prev + 1, headerRefs.length - 1);
            if (headerRefs[newIndex]?.current) {
              headerRefs[newIndex].current.focus();
            }
            return newIndex;
          });
        } else {
          // Controls group: Navigate between play/pause/skip (no wrapping)
          setControlsFocusedIndex(prev => {
            const newIndex = Math.min(prev + 1, controlsRefs.length - 1);
            if (controlsRefs[newIndex]?.current) {
              controlsRefs[newIndex].current.focus();
            }
            return newIndex;
          });
        }
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        // Only move up from controls to header
        if (activeGroup === 1) {
          setActiveGroup(0);
          if (headerRefs[headerFocusedIndex]?.current) {
            headerRefs[headerFocusedIndex].current.focus();
          }
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        // Only move down from header to controls
        if (activeGroup === 0) {
          setActiveGroup(1);
          if (controlsRefs[controlsFocusedIndex]?.current) {
            controlsRefs[controlsFocusedIndex].current.focus();
          }
        }
        e.preventDefault();
      } else if (e.key === 'Tab') {
        // Trap focus within the overlay - cycle through groups
        e.preventDefault();
        if (e.shiftKey) {
          // Shift+Tab: Move to previous group or previous item in group
          if (activeGroup === 1) {
            setActiveGroup(0);
            if (headerRefs[headerFocusedIndex]?.current) {
              headerRefs[headerFocusedIndex].current.focus();
            }
          } else {
            setActiveGroup(1);
            if (controlsRefs[controlsFocusedIndex]?.current) {
              controlsRefs[controlsFocusedIndex].current.focus();
            }
          }
        } else {
          // Tab: Move to next group
          if (activeGroup === 0) {
            setActiveGroup(1);
            if (controlsRefs[controlsFocusedIndex]?.current) {
              controlsRefs[controlsFocusedIndex].current.focus();
            }
          } else {
            setActiveGroup(0);
            if (headerRefs[headerFocusedIndex]?.current) {
              headerRefs[headerFocusedIndex].current.focus();
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPlayerOpen,
    closePlayer,
    activeGroup,
    headerFocusedIndex,
    controlsFocusedIndex,
    headerRefs,
    controlsRefs,
  ]);

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
        backgroundColor: 'var(--app-background, #000)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `translateY(${isAnimatingIn ? '0%' : '100%'})`,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--app-background, #000)',
          overflow: 'hidden',
        }}
      >
        {/* Player Header */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: 200,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: `${getSidePadding()}px`,
            boxSizing: 'border-box',
          }}
        >
          {/* Absolute logo */}
          <div
            style={{
              position: 'absolute',
              left: `${getSidePadding()}px`,
              top: `${getSidePadding()}px`,
              width: 245,
              height: 70,
              display: 'flex',
              alignItems: 'center',
              zIndex: 2,
            }}
          >
            <img
              src={stingrayMusicLogo}
              alt="Stingray Music"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          {/* Centered channel title */}
          <h1
            style={{
              fontFamily: 'var(--font-family-secondary)',
              fontSize: 'var(--font-size-h3)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              margin: 0,
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            Unknown Channel
          </h1>
          {/* Centered action buttons row */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            <KeyboardWrapper
              ref={infoRef}
              data-stable-id="player-header-action-info"
              onSelect={() => {}}
            >
              <Button
                icon={<Info size={TRANS_BTN_ICON_SIZE} />}
                showIcon
                size="medium"
                variant="transparent"
                focused={activeGroup === 0 && headerFocusedIndex === 0}
                onFocus={() => {
                  setActiveGroup(0);
                  setHeaderFocusedIndex(0);
                }}
              ></Button>
            </KeyboardWrapper>
            <KeyboardWrapper
              ref={likeRef}
              data-stable-id="player-header-action-like"
              onSelect={() => {}}
            >
              <Button
                icon={<Like size={TRANS_BTN_ICON_SIZE} />}
                showIcon
                size="medium"
                variant="transparent"
                focused={activeGroup === 0 && headerFocusedIndex === 1}
                onFocus={() => {
                  setActiveGroup(0);
                  setHeaderFocusedIndex(1);
                }}
              ></Button>
            </KeyboardWrapper>
          </div>
        </div>

        {/* Main content below header */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            padding: `24px ${getSidePadding()}px 0px`,
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
          }}
        >
          {/* Cover Art Placeholder */}
          <div
            style={{
              width: 360,
              height: 360,
              background: 'var(--color-outline-secondary)',
              borderRadius: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
              fontSize: 32,
              fontFamily: 'var(--font-family-primary)',
              marginBottom: 20,
            }}
          >
            360x360
          </div>

          {/* Channel Info */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-h3)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                textAlign: 'center',
              }}
            >
              Song Title
            </div>
            <div
              style={{
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-body)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-secondary)',
                textAlign: 'center',
              }}
            >
              Artist Name
            </div>
            <div
              style={{
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-body)',
                fontWeight: 'var(--font-weight-regular)',
                color: 'var(--color-text-tertiary, #AAA)',
                textAlign: 'center',
              }}
            >
              Album
            </div>
          </div>

          {/* Controls Row */}
          <div
            ref={controlsGroupRef}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
              position: 'relative',
              width: '100%',
              minHeight: 120,
              marginBottom: 30,
            }}
          >
            {/* Left controls (empty for now) */}
            <div
              style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
            >
              {/* Add left controls here in the future */}
            </div>
            {/* Center PlayPause */}
            <div
              style={{
                flex: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <KeyboardWrapper
                ref={pauseRef}
                data-stable-id="player-control-pause"
                style={{
                  outline:
                    activeGroup === 1 && controlsFocusedIndex === 0 ? '2px solid #fff' : 'none',
                  borderRadius: '50%',
                }}
              >
                <PlayPauseButton
                  onFocus={() => {
                    setActiveGroup(1);
                    setControlsFocusedIndex(0);
                  }}
                />
              </KeyboardWrapper>
            </div>
            {/* Right controls */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <KeyboardWrapper ref={skipRef} data-stable-id="player-control-skip">
                <Button
                  icon={<SkipNext size={TRANS_BTN_ICON_SIZE} />}
                  showIcon
                  size="medium"
                  variant="transparent"
                  focused={activeGroup === 1 && controlsFocusedIndex === 1}
                  onFocus={() => {
                    setActiveGroup(1);
                    setControlsFocusedIndex(1);
                  }}
                />
              </KeyboardWrapper>
            </div>
          </div>
        </div>

        {/* Ad Banner Footer */}
        <AdBanner />
      </div>
    </div>
  );
}

export default PlayerOverlay;
