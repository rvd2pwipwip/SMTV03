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
  // Player context for overlay functionality
  const { isPlayerOpen, openPlayer, closePlayer } = usePlayer();

  // Screen memory for focus state - ChannelInfo defaults to ACTIONS_GROUP (Play button)
  const { getFocusedGroupIndex, setFocusedGroupIndex } = useScreenMemory('channel-info');

  // Refs for VariableSwimlane items (like Home.jsx)
  const actionRefs = useRef([]); // For action buttons
  const filterRefs = useRef([]); // For filter buttons

  // Refs for related channels grid
  const relatedGroupRef = useRef(null);
  const relatedCard1Ref = useRef(null);
  const relatedCard2Ref = useRef(null);
  const relatedCard3Ref = useRef(null);
  const relatedCard4Ref = useRef(null);
  const relatedCard5Ref = useRef(null);
  const relatedCardRefs = [
    relatedCard1Ref,
    relatedCard2Ref,
    relatedCard3Ref,
    relatedCard4Ref,
    relatedCard5Ref,
  ];

  // Ref for the main content container to handle scrolling
  const contentRef = useRef(null);

  // Get the channelId from the URL params and the state from the previous screen
  const { channelId } = useParams();
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

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

  // DEBUG: Verify this code is loaded and track what's causing remounts
  console.log('🚀 [DEBUG] ChannelInfo component loaded with debug code!', {
    focusedGroupIndex,
    filterTagsLength: filterTags.length,
    channelId,
    channel: channel?.title,
    locationKey: location.key,
    locationState: location.state,
  });

  // DEBUG: Add global listener to see ALL keydown events
  useEffect(() => {
    const globalKeyListener = e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        console.log('🌍 [DEBUG] GLOBAL keydown detected:', {
          key: e.key,
          target: e.target,
          targetType: e.target.tagName,
          targetClasses: e.target.className,
          currentTarget: e.currentTarget,
          phase: e.eventPhase,
          defaultPrevented: e.defaultPrevented,
          propagationStopped: e.cancelBubble,
        });
      }
    };

    // Add both capture and bubble listeners
    window.addEventListener('keydown', globalKeyListener, true); // Capture
    window.addEventListener('keydown', globalKeyListener, false); // Bubble

    return () => {
      window.removeEventListener('keydown', globalKeyListener, true);
      window.removeEventListener('keydown', globalKeyListener, false);
    };
  }, []);

  // Navigation context for vertical group focus (no longer provides focusedGroupIndex)
  const { moveFocusUp, moveFocusDown, MINI_PLAYER_GROUP_INDEX, isMiniPlayerVisible } =
    useFocusNavigation();

  // Local focus state for each group - MUST BE DECLARED BEFORE useEffect
  const [actionsFocusedIndex, setActionsFocusedIndex] = useState(0);
  const [filtersFocusedIndex, setFiltersFocusedIndex] = useState(0);
  const [relatedFocusedIndex, setRelatedFocusedIndex] = useState(0);

  // LEARNING: Wrapper functions for navigation that provide screen state
  const handleMoveFocusUp = () => {
    const originalIndex = focusedGroupIndex;
    let newIndex = Math.max(focusedGroupIndex - 1, 0);

    // Skip FILTERS_GROUP if no filter tags exist
    if (newIndex === FILTERS_GROUP && filterTags.length === 0) {
      console.log('🔄 [DEBUG] Skipping FILTERS_GROUP (no tags), moving up again');
      newIndex = Math.max(newIndex - 1, 0);
    }

    console.log('🔄 [DEBUG] MoveFocusUp:', {
      from: originalIndex,
      to: newIndex,
      filterTagsLength: filterTags.length,
      groupNames: { 0: 'ACTIONS', 1: 'FILTERS', 2: 'RELATED' },
    });
    setFocusedGroupIndex(newIndex);
  };

  const handleMoveFocusDown = () => {
    const originalIndex = focusedGroupIndex;
    const maxIndex = 2; // RELATED_GROUP is the last regular group
    let newIndex = Math.min(focusedGroupIndex + 1, maxIndex);

    // Skip FILTERS_GROUP if no filter tags exist
    if (newIndex === FILTERS_GROUP && filterTags.length === 0) {
      console.log('🔄 [DEBUG] Skipping FILTERS_GROUP (no tags), moving down again');
      newIndex = Math.min(newIndex + 1, maxIndex);
    }

    console.log('🔄 [DEBUG] MoveFocusDown:', {
      from: originalIndex,
      to: newIndex,
      filterTagsLength: filterTags.length,
      groupNames: { 0: 'ACTIONS', 1: 'FILTERS', 2: 'RELATED' },
    });
    setFocusedGroupIndex(newIndex);
  };

  // REMOVED: Redundant focus initialization effect
  // Home.jsx and SearchBrowse.jsx prove that getFocusedGroupIndex(defaultGroup)
  // handles initialization correctly without needing a useEffect

  // Sync DOM focus with app focus for all groups
  useEffect(() => {
    console.log('🎯 [DEBUG] Focus sync triggered:', {
      focusedGroupIndex,
      groupName: { 0: 'ACTIONS', 1: 'FILTERS', 2: 'RELATED' }[focusedGroupIndex] || 'UNKNOWN',
      actionsFocusedIndex,
      filtersFocusedIndex,
      relatedFocusedIndex,
      filterTagsLength: filterTags.length,
      timestamp: Date.now(),
    });

    if (focusedGroupIndex === ACTIONS_GROUP) {
      console.log('🎯 [DEBUG] Focusing action button:', actionsFocusedIndex);
      actionRefs.current[actionsFocusedIndex]?.focus();
    } else if (focusedGroupIndex === FILTERS_GROUP) {
      // CRITICAL FIX: Only try to focus if filter buttons actually exist
      if (filterTags.length > 0 && filterRefs.current[filtersFocusedIndex]) {
        console.log('🎯 [DEBUG] Focusing filter button:', filtersFocusedIndex);
        filterRefs.current[filtersFocusedIndex]?.focus();
      } else {
        // If no filter buttons exist, skip to next group
        console.warn('🚨 [DEBUG] No filter buttons available, skipping FILTERS_GROUP focus');
        return;
      }
    } else if (focusedGroupIndex === RELATED_GROUP) {
      console.log('🎯 [DEBUG] Focusing related channel:', relatedFocusedIndex);
      relatedCardRefs[relatedFocusedIndex]?.current?.focus();
    } else if (focusedGroupIndex === MINI_PLAYER_GROUP_INDEX && isMiniPlayerVisible) {
      console.log('🎯 [DEBUG] Focusing mini-player, blurring related channels');
      relatedCardRefs.forEach(ref => ref.current?.blur());
    }
  }, [
    focusedGroupIndex,
    actionsFocusedIndex,
    filtersFocusedIndex,
    relatedFocusedIndex,
    filterTags.length, // Add this dependency to react to filterTags changes
    MINI_PLAYER_GROUP_INDEX,
    isMiniPlayerVisible,
  ]);

  // Handle scroll when navigating to related channels
  useEffect(() => {
    if (focusedGroupIndex === RELATED_GROUP && relatedGroupRef.current && contentRef.current) {
      // Calculate scroll position to ensure related channels are properly visible
      const relatedGroupRect = relatedGroupRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();

      // Convert 3 rems to pixels (assuming 1rem = 16px)
      const remInPixels = 16;
      const clearanceNeeded = 3 * remInPixels;

      // Mini-player is positioned at bottom of screen (1080px - mini-player height)
      // Assuming mini-player height is around 120px, so top is at ~960px
      const miniPlayerTop = 960;

      // Calculate the bottom of the related channels (including channel card labels)
      // Channel cards are ~200px tall, labels add ~40px, so total height ~240px
      const relatedChannelsBottom = relatedGroupRect.bottom;

      // Calculate required scroll to maintain clearance
      const targetBottom = miniPlayerTop - clearanceNeeded;
      const scrollNeeded = relatedChannelsBottom - targetBottom;

      if (scrollNeeded > 0) {
        // Smooth scroll to the calculated position
        contentRef.current.scrollTo({
          top: contentRef.current.scrollTop + scrollNeeded,
          behavior: 'smooth',
        });
      }
    }
  }, [focusedGroupIndex, RELATED_GROUP]);

  // --- Focus change handlers ---
  // These should ONLY update within-group focus, not call setFocusedGroupIndex
  // Following the Home.jsx pattern where onFocusChange only handles horizontal navigation
  const handleActionFocusChange = index => {
    console.log('🔀 [DEBUG] handleActionFocusChange called:', {
      index,
      currentFocusedGroup: focusedGroupIndex,
    });
    setActionsFocusedIndex(index);
    // DON'T call setFocusedGroupIndex here - that's for up/down navigation only
  };

  const handleFilterFocusChange = index => {
    console.log('🔀 [DEBUG] handleFilterFocusChange called:', {
      index,
      currentFocusedGroup: focusedGroupIndex,
    });
    setFiltersFocusedIndex(index);
    // DON'T call setFocusedGroupIndex here - that's for up/down navigation only
  };

  const handleRelatedFocusChange = index => {
    console.log('🔀 [DEBUG] handleRelatedFocusChange called:', {
      index,
      currentFocusedGroup: focusedGroupIndex,
    });
    setRelatedFocusedIndex(index);
    // DON'T call setFocusedGroupIndex here - that's for up/down navigation only
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
          overflowY: 'auto',
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
                    console.log('🎯 [DEBUG] Action button focused, setting group to ACTIONS', {
                      target: e.target,
                      targetClasses: e.target.className,
                      buttonIndex: i,
                      isFocused,
                    });
                    setFocusedGroupIndex(ACTIONS_GROUP);
                  }}
                  onKeyDown={e => {
                    console.log('⌨️ [DEBUG] Action button keydown:', e.key);
                    if (e.key === 'ArrowDown') {
                      console.log(
                        '⌨️ [DEBUG] Action button ArrowDown - calling handleMoveFocusDown'
                      );
                      handleMoveFocusDown();
                      e.preventDefault();
                    } else if (e.key === 'ArrowUp') {
                      console.log('⌨️ [DEBUG] Action button ArrowUp - calling handleMoveFocusUp');
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
                      console.log('🎯 [DEBUG] Filter button focused, setting group to FILTERS');
                      setFocusedGroupIndex(FILTERS_GROUP);
                    }}
                    onKeyDown={e => {
                      console.log('⌨️ [DEBUG] Filter button keydown:', e.key);
                      if (e.key === 'ArrowDown') {
                        console.log(
                          '⌨️ [DEBUG] Filter button ArrowDown - calling handleMoveFocusDown'
                        );
                        handleMoveFocusDown();
                        e.preventDefault();
                      } else if (e.key === 'ArrowUp') {
                        console.log('⌨️ [DEBUG] Filter button ArrowUp - calling handleMoveFocusUp');
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
          <ChannelRow ref={relatedGroupRef}>
            {relatedChannels.length > 0 ? (
              relatedChannels.map((relatedChannel, index) => (
                <KeyboardWrapper
                  key={relatedChannel.id}
                  ref={relatedCardRefs[index]}
                  data-stable-id={`channelinfo-related-card-${index + 1}`}
                  onSelect={() => handleChannelSelect(relatedChannel)}
                  selectData={relatedChannel}
                  onUp={handleMoveFocusUp}
                  onDown={handleMoveFocusDown}
                >
                  <ChannelCard
                    title={relatedChannel.title}
                    thumbnailUrl={relatedChannel.thumbnailUrl}
                    focused={focusedGroupIndex === RELATED_GROUP && relatedFocusedIndex === index}
                    onFocus={() => {
                      setFocusedGroupIndex(RELATED_GROUP);
                      handleRelatedFocusChange(index);
                    }}
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
