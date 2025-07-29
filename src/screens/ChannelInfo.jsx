import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ChannelCard, Button } from '@smtv/tv-component-library';
import '../styles/App.css';

import KeyboardWrapper from '../components/KeyboardWrapper';
import { Like, SingNow } from 'stingray-icons';
import AdBanner from '../components/AdBanner';
import { getSidePadding } from '../utils/layout';
import VariableSwimlane from '../components/VariableSwimlane';
import ChannelRow from '../components/ChannelRow';
import { fakeChannels } from '../data/fakeChannels';
import { fakeChannelInfo } from '../data/fakeChannelInfo';
import { allStingrayChannels } from '../data/stingrayChannelsIndex';
import { getRelatedChannels } from '../utils/relatedChannels';
import { usePlayer } from '../contexts/PlayerContext';
import { useFocusNavigation } from '../contexts/GroupFocusNavigationContext';
import { useScreenMemory } from '../contexts/ScreenMemoryContext';

function ChannelInfo() {
  // Get the channelId from the URL params and the state from the previous screen
  const { channelId } = useParams();
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  // Player context for overlay functionality
  const { isPlayerOpen, openPlayer, closePlayer } = usePlayer();

  // Channel-specific memory for focus state - each channel remembers its own focus
  // Default to ACTIONS_GROUP (Play button) for new channels, remember last position for returning
  const { memory, setField, getFocusedGroupIndex, setFocusedGroupIndex } = useScreenMemory(
    `channel-info-${channelId}`
  );

  // Refs for VariableSwimlane items (like Home.jsx)
  const actionRefs = useRef([]); // For action buttons
  const filterRefs = useRef([]); // For filter buttons
  const relatedCardRefs = useRef([]); // For related channel cards (like Home.jsx)

  // Ref for related channels group
  const relatedGroupRef = useRef(null);

  // Ref for the main content container to handle scrolling
  const contentRef = useRef(null);

  // Find channel in unified dataset (includes all mock channels)
  const channel =
    allStingrayChannels.find(c => String(c.id) === String(channelId)) ||
    fakeChannels.find(c => String(c.id) === String(channelId));

  const channelInfo = fakeChannelInfo.find(c => String(c.id) === String(channelId));

  // Get related channels using tag-based algorithm
  const relatedChannels = getRelatedChannels(channelId, 5);

  // Get related channels using tag-based algorithm
  // Debug: Uncomment to see matching process
  // console.log(`Related channels for "${channel?.title}":`, relatedChannels.map(c => c.title));

  // Fallback: if no tags for this channel, use all unique tags from all channels
  let filterTags = channelInfo?.tags || [];
  if (!filterTags.length && fakeChannelInfo.length > 0) {
    filterTags = fakeChannelInfo[0].tags || [];
    // DEV NOTE: fallback to first channel's tags for stub data/dev purposes
  }

  // Define group indices for up/down navigation
  const ACTIONS_GROUP = 0;
  const FILTERS_GROUP = 1;
  const RELATED_GROUP = 2;

  // LEARNING: Screen-specific focus group state
  // ChannelInfo defaults to ACTIONS_GROUP (0) - users expect to see Play button first
  const focusedGroupIndex = getFocusedGroupIndex(ACTIONS_GROUP);

  // Navigation context for vertical group focus (no longer provides focusedGroupIndex)
  const { moveFocusUp, moveFocusDown, MINI_PLAYER_GROUP_INDEX, isMiniPlayerVisible } =
    useFocusNavigation();

  // Local focus state for each group using per-channel memory
  const [actionsFocusedIndex, setActionsFocusedIndex] = useState(memory.actionsFocusedIndex ?? 0);
  const [filtersFocusedIndex, setFiltersFocusedIndex] = useState(memory.filtersFocusedIndex ?? 0);
  const [relatedFocusedIndex, setRelatedFocusedIndex] = useState(memory.relatedFocusedIndex ?? 0);

  // LEARNING: Wrapper functions for navigation that provide screen state (following Home.jsx pattern)
  const handleMoveFocusUp = () => {
    moveFocusUp(focusedGroupIndex, setFocusedGroupIndex);
  };

  const handleMoveFocusDown = () => {
    moveFocusDown(focusedGroupIndex, setFocusedGroupIndex);
  };

  // REMOVED: Redundant focus initialization effect
  // Home.jsx and SearchBrowse.jsx prove that getFocusedGroupIndex(defaultGroup)
  // handles initialization correctly without needing a useEffect

  // Sync DOM focus with app focus for all groups (following Home.jsx pattern)
  useEffect(() => {
    if (focusedGroupIndex === ACTIONS_GROUP) {
      actionRefs.current[actionsFocusedIndex]?.focus();
    } else if (focusedGroupIndex === FILTERS_GROUP) {
      // Only try to focus if filter buttons actually exist
      if (filterTags.length > 0 && filterRefs.current[filtersFocusedIndex]) {
        filterRefs.current[filtersFocusedIndex]?.focus();
      }
    } else if (focusedGroupIndex === RELATED_GROUP) {
      // Focus the specific related channel card (following Home.jsx pattern)
      relatedCardRefs.current[relatedFocusedIndex]?.focus();
    } else if (focusedGroupIndex === MINI_PLAYER_GROUP_INDEX && isMiniPlayerVisible) {
      // Mini-player manages its own focus internally, just ensure other elements are blurred
      actionRefs.current.forEach(ref => ref?.blur());
      filterRefs.current.forEach(ref => ref?.blur());
      // Also blur the currently focused related channel card
      relatedCardRefs.current[relatedFocusedIndex]?.blur();
    }
  }, [
    focusedGroupIndex,
    actionsFocusedIndex,
    filtersFocusedIndex,
    relatedFocusedIndex,
    filterTags.length,
    MINI_PLAYER_GROUP_INDEX,
    isMiniPlayerVisible,
  ]);

  // Blur action buttons when leaving actions group (following Home.jsx pattern)
  useEffect(() => {
    if (focusedGroupIndex !== ACTIONS_GROUP) {
      actionRefs.current.forEach(ref => ref?.blur());
    }
  }, [focusedGroupIndex]);

  // Blur filter buttons when leaving filters group (following Home.jsx pattern)
  useEffect(() => {
    if (focusedGroupIndex !== FILTERS_GROUP) {
      filterRefs.current.forEach(ref => ref?.blur());
    }
  }, [focusedGroupIndex]);

  // Calculate vertical offset needed to clear overlays and show overflowing content
  const getVerticalOffset = () => {
    // Only reset offset when navigating UP from related channels (to actions/filters)
    // Keep offset when navigating DOWN from related channels (to mini-player)
    if (focusedGroupIndex < RELATED_GROUP) return 0;

    const adBannerHeight =
      parseInt(getComputedStyle(document.documentElement).getPropertyValue('--ad-banner-height')) ||
      150;
    const miniPlayerHeight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--mini-player-height')
      ) || 120;
    const spacingXXL =
      parseInt(getComputedStyle(document.documentElement).getPropertyValue('--spacing-xxl')) || 48;

    // Calculate content overflow beyond viewport
    const contentHeight = contentRef.current?.scrollHeight || 0;
    const viewportHeight = window.innerHeight; // 1080px
    const contentOverflow = Math.max(0, contentHeight - viewportHeight);

    // Total offset = overlay clearance + content overflow
    // Mini-player is visible when overlay is closed (!isPlayerOpen)
    const overlayHeight = adBannerHeight + (!isPlayerOpen ? miniPlayerHeight : 0);
    return overlayHeight + spacingXXL + contentOverflow;
  };

  const verticalOffset = getVerticalOffset();

  // Debug logging for transform offset
  useEffect(() => {
    if (focusedGroupIndex >= RELATED_GROUP && contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const viewportHeight = window.innerHeight;
      const contentOverflow = Math.max(0, contentHeight - viewportHeight);

      console.log('🔄 [DEBUG] Vertical offset calculation:', {
        focusedGroup: focusedGroupIndex === RELATED_GROUP ? 'RELATED' : 'MINI_PLAYER',
        contentHeight,
        viewportHeight,
        contentOverflow,
        isPlayerOpen,
        isMiniPlayerVisible: !isPlayerOpen,
        adBannerHeight:
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--ad-banner-height')
          ) || 150,
        miniPlayerHeight: !isPlayerOpen
          ? parseInt(
              getComputedStyle(document.documentElement).getPropertyValue('--mini-player-height')
            ) || 120
          : 0,
        spacingXXL:
          parseInt(getComputedStyle(document.documentElement).getPropertyValue('--spacing-xxl')) ||
          48,
        totalVerticalOffset: verticalOffset,
      });
    } else {
      console.log('🔄 [DEBUG] Vertical offset reset:', {
        focusedGroup:
          focusedGroupIndex === 0 ? 'ACTIONS' : focusedGroupIndex === 1 ? 'FILTERS' : 'OTHER',
        verticalOffset: 0,
      });
    }
  }, [verticalOffset, focusedGroupIndex, isPlayerOpen]);

  // --- Focus change handlers with per-channel memory ---
  const handleActionFocusChange = index => {
    setActionsFocusedIndex(index);
    setField('actionsFocusedIndex', index); // Per-channel storage
    setFocusedGroupIndex(ACTIONS_GROUP);
  };

  const handleFilterFocusChange = index => {
    setFiltersFocusedIndex(index);
    setField('filtersFocusedIndex', index); // Per-channel storage
    setFocusedGroupIndex(FILTERS_GROUP);
  };

  const handleRelatedFocusChange = index => {
    setRelatedFocusedIndex(index);
    setField('relatedFocusedIndex', index); // Per-channel storage
    setFocusedGroupIndex(RELATED_GROUP);
  };

  const handleChannelSelect = selectedChannel => {
    console.log('Channel selected:', selectedChannel.title);
    // Navigate to the selected channel's info page
    navigate(`/channel-info/${selectedChannel.id}`, {
      state: { fromChannelInfo: true },
    });
  };

  return (
    <>
      <div
        ref={contentRef}
        className="channelinfo-content"
        style={{
          width: '100%',
          height: '100vh',
          boxSizing: 'border-box',
          padding: `${getSidePadding()}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: 15,
          position: 'relative',
          transform: `translateY(-${verticalOffset}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* 
          LEARNING: CSS Grid vs Flexbox for Layout Structure
          
          Why Grid is Better Here:
          - This is a LAYOUT-DRIVEN design: fixed thumbnail (360px) + flexible content area
          - Grid explicitly defines column sizes, eliminating width calculation ambiguity
          - Children automatically respect grid cell boundaries (no width: 100% issues)
          - More predictable and maintainable than flex + manual width constraints
          
          Grid Syntax Explained:
          - display: 'grid' → Creates grid container
          - gridTemplateColumns: '360px 1fr' → Column 1: 360px fixed, Column 2: remaining space
          - gap: 40 → Spacing between grid items (replaces margin/padding calculations)
          - alignItems: 'start' → Align items to top of their grid cells
          
          Compare to Previous Flexbox Issues:
          - Flexbox: Children could reference wrong containing block for width calculations
          - Flexbox: Needed complex minWidth: 0, maxWidth: 100% constraints to prevent overflow
          - Grid: Children naturally contained within their grid cell - no constraints needed
        */}
        <div
          className="channelinfo-header"
          style={{
            display: 'grid',
            gridTemplateColumns: '360px 1fr', // Fixed thumbnail + flexible content
            gap: 40,
            width: '100%',
            boxSizing: 'border-box',
            alignItems: 'start', // Align to top (vs center default)
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          {/* 
            LEARNING: Grid Item Behavior
            
            With CSS Grid:
            - This div automatically goes into the first grid column (360px)
            - No need for flexShrink: 0 (was needed in flexbox to prevent shrinking)
            - Grid cell defines the available space, so width: 360 is just for the element itself
            - Grid eliminates the need for manual flex item controls
          */}
          {/* Channel Thumbnail Placeholder */}
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
              // flexShrink: 0, ← No longer needed with Grid!
            }}
          >
            360x360
          </div>

          {/* 
            LEARNING: Grid Cell + Flexbox Combination
            
            Best of Both Worlds:
            - Grid handles the LAYOUT structure (thumbnail + content columns)
            - Flexbox handles the CONTENT flow within the grid cell (vertical stacking)
            
            Grid Cell Behavior:
            - This div automatically goes into the second grid column (1fr = remaining space)
            - minWidth: 0 still helpful for text overflow scenarios
            - No need for flex: 1, maxWidth: 100%, boxSizing: border-box from flexbox approach
            - Children naturally respect the grid cell boundaries (no more 2497.5px overflow!)
            
            When to Use Grid vs Flexbox:
            - Grid: Known layout structure, explicit sizing relationships
            - Flexbox: Unknown content sizes, dynamic arrangements
            - Combined: Grid for page layout, Flexbox for content flow (like here)
          */}
          {/* Channel Details Group */}
          <div
            className="channelinfo-details-group"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 40,
              minWidth: 0, // Still helpful for text overflow
            }}
          >
            {/* Channel Title */}
            <h1
              style={{
                fontFamily: 'var(--font-family-secondary)',
                fontSize: 'var(--font-size-h1)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                margin: 0,
              }}
            >
              {channel?.title || 'Sample Channel Title'}
            </h1>

            {/* Action Buttons */}
            <VariableSwimlane
              items={[
                {
                  id: 'play',
                  label: 'Play',
                  icon: <SingNow />,
                  variant: 'primary',
                  onClick: () => {
                    openPlayer();
                  },
                  dataStableId: 'channelinfo-action-play',
                },
                {
                  id: 'fav',
                  label: 'Add to Favorites',
                  icon: <Like />,
                  variant: 'secondary',
                  dataStableId: 'channelinfo-action-fav',
                },
              ]}
              onSelect={(item, index) => {
                if (item.onClick) {
                  item.onClick();
                }
              }}
              renderItem={(item, i, isFocused) => (
                <Button
                  key={item.id}
                  ref={el => {
                    actionRefs.current[i] = el;
                  }}
                  data-stable-id={item.dataStableId}
                  icon={item.icon}
                  showIcon
                  size="medium"
                  variant={item.variant}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    }
                  }}
                  focused={isFocused}
                  onFocus={e => {
                    setFocusedGroupIndex(ACTIONS_GROUP);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'ArrowDown') {
                      handleMoveFocusDown();
                      e.preventDefault();
                    } else if (e.key === 'ArrowUp') {
                      handleMoveFocusUp();
                      e.preventDefault();
                    }
                    // Left/Right navigation is handled by VariableSwimlane
                  }}
                >
                  {item.label}
                </Button>
              )}
              className="channelinfo-action-swimlane"
              focused={focusedGroupIndex === ACTIONS_GROUP}
              focusedIndex={actionsFocusedIndex}
              onFocusChange={handleActionFocusChange}
            />

            {/* Channel Description */}
            <div
              style={{
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-body)',
                color: 'var(--color-text-secondary)',
                minHeight: 150,
                maxWidth: '60ch',
              }}
            >
              {channel?.description ||
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque.'}
            </div>

            {/* Filter Buttons - only render if there are filter tags */}
            {filterTags.length > 0 && (
              <VariableSwimlane
                items={filterTags}
                renderItem={(tag, i, isFocused) => (
                  <Button
                    key={tag.id}
                    ref={el => {
                      filterRefs.current[i] = el;
                    }}
                    data-stable-id={`channelinfo-filter-${tag.id}`}
                    size="medium"
                    variant="secondary"
                    focused={isFocused}
                    onFocus={() => {
                      setFocusedGroupIndex(FILTERS_GROUP);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'ArrowDown') {
                        handleMoveFocusDown();
                        e.preventDefault();
                      } else if (e.key === 'ArrowUp') {
                        handleMoveFocusUp();
                        e.preventDefault();
                      }
                      // Left/Right navigation is handled by VariableSwimlane
                    }}
                  >
                    {tag.label}
                  </Button>
                )}
                className="channelinfo-filter-swimlane"
                focused={focusedGroupIndex === FILTERS_GROUP}
                focusedIndex={filtersFocusedIndex}
                onFocusChange={handleFilterFocusChange}
              />
            )}
          </div>
        </div>

        {/* Related Channels */}
        <div
          style={{
            width: '100%',
            boxSizing: 'border-box',
            paddingLeft: 0,
            paddingRight: 0,
            marginTop: 90,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-family-secondary)',
              fontSize: 'var(--font-size-h2)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 16,
            }}
          >
            Related
          </div>
          <ChannelRow
            ref={relatedGroupRef}
            focused={focusedGroupIndex === RELATED_GROUP}
            focusedIndex={relatedFocusedIndex}
            onFocusChange={handleRelatedFocusChange}
            onSelect={index => handleChannelSelect(relatedChannels[index])}
          >
            {relatedChannels.length > 0 ? (
              relatedChannels.map((relatedChannel, index) => (
                <KeyboardWrapper
                  key={relatedChannel.id}
                  onSelect={() => handleChannelSelect(relatedChannel)}
                  selectData={relatedChannel}
                  ref={el => {
                    relatedCardRefs.current[index] = el;
                  }}
                  onUp={handleMoveFocusUp}
                  onDown={handleMoveFocusDown}
                >
                  <ChannelCard
                    title={relatedChannel.title}
                    thumbnailUrl={relatedChannel.thumbnailUrl}
                    focused={focusedGroupIndex === RELATED_GROUP && relatedFocusedIndex === index}
                    onClick={() => handleChannelSelect(relatedChannel)}
                  />
                </KeyboardWrapper>
              ))
            ) : (
              // Fallback when no related channels found
              <div
                style={{
                  color: 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-family-primary)',
                  fontSize: 'var(--font-size-body)',
                  padding: '20px 0',
                }}
              >
                No related channels found
              </div>
            )}
          </ChannelRow>
        </div>
      </div>
      <AdBanner />
    </>
  );
}

export default ChannelInfo;
