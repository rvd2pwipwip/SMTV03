import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChannelCard } from '@smtv/tv-component-library';
import '@smtv/tv-component-library/dist/style.css';
import '../styles/App.css';
import AdBanner from '../components/AdBanner';
import ChannelGrid from '../components/ChannelGrid';
import KeyboardWrapper from '../components/KeyboardWrapper';
import { useFocusNavigation } from '../contexts/GroupFocusNavigationContext';
import { getSidePadding } from '../utils/layout';
import { useScreenMemory } from '../contexts/ScreenMemoryContext';
import { popChannels } from '../data/popChannels';

function MoreGridView() {
  const { genreId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get genre name from navigation state or fallback to formatted genreId
  const genreName =
    location.state?.genreName ||
    (genreId ? genreId.charAt(0).toUpperCase() + genreId.slice(1) : 'Genre');

  // For now, use popChannels as mock data - will be filtered by genre later
  const channels = popChannels;

  // Persistent screen memory for grid focus position
  const { memory, setField, getFocusedGroupIndex, setFocusedGroupIndex } = useScreenMemory(
    `more-grid-${genreId}`
  );

  // Grid ref for focus management
  const gridRef = useRef(null);

  // Group indices - only GRID_GROUP and MINI_PLAYER_GROUP for this screen
  const GRID_GROUP = 0;

  // Screen-specific focus group state - default to grid
  const focusedGroupIndex = getFocusedGroupIndex(GRID_GROUP);

  // Navigation context for vertical group focus
  const { moveFocusUp, moveFocusDown, MINI_PLAYER_GROUP_INDEX, isMiniPlayerVisible } =
    useFocusNavigation();

  // Grid focus position state
  const [gridFocusedPosition, setGridFocusedPosition] = useState(
    memory.gridFocusedPosition || { row: 0, col: 0 }
  );

  const handleChannelSelect = channel => {
    navigate(`/channel-info/${channel.id}`, {
      state: { fromMoreGrid: true, genreId },
    });
  };

  // Navigation wrapper functions
  const handleMoveFocusUp = () => {
    moveFocusUp(focusedGroupIndex, setFocusedGroupIndex);
  };

  const handleMoveFocusDown = () => {
    moveFocusDown(focusedGroupIndex, setFocusedGroupIndex);
  };

  // Handle grid navigation escape (boundary navigation)
  const handleGridNavigationEscape = direction => {
    if (direction === 'down') {
      // Escape down from grid goes to mini-player if visible
      if (isMiniPlayerVisible) {
        setFocusedGroupIndex(MINI_PLAYER_GROUP_INDEX);
      }
    } else if (direction === 'up') {
      // Escape up from grid - no header to navigate to, so stay in grid
      // This maintains consistency with TV navigation patterns
    }
  };

  // Handle grid focus changes
  const handleGridFocusChange = position => {
    setGridFocusedPosition(position);
    setField('gridFocusedPosition', position);
  };

  // Sync focus state with navigation context
  useEffect(() => {
    if (focusedGroupIndex === GRID_GROUP) {
      // Grid manages its own internal focus
      gridRef.current?.focus?.();
    } else if (focusedGroupIndex === MINI_PLAYER_GROUP_INDEX && isMiniPlayerVisible) {
      // Mini-player manages its own focus internally
      gridRef.current?.blur?.();
    }
  }, [focusedGroupIndex, isMiniPlayerVisible]);

  // Auto-focus grid on mount
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.focus?.();
    }
  }, []);

  return (
    <>
      {/* Sticky Header - positioned to match app-content left edge */}
      <div
        className="more-grid-view-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '1920px', // Same width as app-content
          zIndex: 1000,
          height: '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 0px 30px 0px',
          backgroundColor: 'rgba(49, 49, 49, 0.8)',
          backdropFilter: 'blur(12px)',
          boxSizing: 'border-box',
        }}
      >
        <h1
          style={{
            fontSize: 'var(--font-size-h2)', // 34px
            fontFamily: 'var(--font-family-primary)',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          {genreName}
        </h1>
      </div>

      {/* Main content container */}
      <div
        className="more-grid-view-content"
        style={{
          width: '100%',
          height: '100vh',
          backgroundColor: 'var(--color-background-primary)',
        }}
      >
        {/* Grid Content - starts below header but can scroll under it */}
        <ChannelGrid
          ref={gridRef}
          items={channels}
          renderItem={(channel, index, focused) => (
            <KeyboardWrapper
              key={channel.id}
              onSelect={() => handleChannelSelect(channel)}
              selectData={channel}
              // ChannelGrid handles its own focus management, so we don't need refs here
            >
              <ChannelCard
                title={channel.title}
                thumbnailUrl={channel.thumbnailUrl}
                focused={focused}
                data-focused={focused ? 'true' : 'false'}
                onClick={() => handleChannelSelect(channel)}
              />
            </KeyboardWrapper>
          )}
          focused={focusedGroupIndex === GRID_GROUP}
          focusedPosition={gridFocusedPosition}
          onFocusChange={handleGridFocusChange}
          onSelect={handleChannelSelect}
          onNavigationEscape={handleGridNavigationEscape}
          leftPadding={getSidePadding()} // Use side padding like swimlanes
          rightPadding={getSidePadding()}
          style={{
            width: '100%',
            height: '100vh', // Full viewport height
            paddingTop: '210px', // Start content below header
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Ad banner is outside the main content and not focusable */}
      <AdBanner />
    </>
  );
}

export default MoreGridView;
