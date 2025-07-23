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

  // Get the channelId from the URL params and the state from the previous screen
  const { channelId } = useParams();
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  const channel = fakeChannels.find(c => String(c.id) === String(channelId));
  const channelInfo = fakeChannelInfo.find(c => String(c.id) === String(channelId));
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

  // Local focus state for each group - MUST BE DECLARED BEFORE useEffect
  const [actionsFocusedIndex, setActionsFocusedIndex] = useState(0);
  const [filtersFocusedIndex, setFiltersFocusedIndex] = useState(0);
  const [relatedFocusedIndex, setRelatedFocusedIndex] = useState(0);

  // LEARNING: Wrapper functions for navigation that provide screen state
  const handleMoveFocusUp = () => {
    moveFocusUp(focusedGroupIndex, setFocusedGroupIndex);
  };

  const handleMoveFocusDown = () => {
    moveFocusDown(focusedGroupIndex, setFocusedGroupIndex);
  };

  // Initialize focus to ACTIONS_GROUP (Play button) on mount
  useEffect(() => {
    // LEARNING: No longer needed since getFocusedGroupIndex handles default
    // Small delay to ensure component is fully mounted, but now just for DOM focus
    const timer = setTimeout(() => {
      // Ensure we start at ACTIONS_GROUP if this is first visit to this screen
      if (getFocusedGroupIndex() !== ACTIONS_GROUP) {
        setFocusedGroupIndex(ACTIONS_GROUP);
      }
    }, 10);
    return () => clearTimeout(timer);
  }, [getFocusedGroupIndex, setFocusedGroupIndex]);

  // Add global keyboard listener for navigation
  useEffect(() => {
    const handleKeyDown = e => {
      // Handle left/right navigation for Related channels
      if (
        focusedGroupIndex === RELATED_GROUP &&
        (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
      ) {
        if (e.key === 'ArrowLeft' && relatedFocusedIndex > 0) {
          const newIndex = relatedFocusedIndex - 1;
          setRelatedFocusedIndex(newIndex);
          relatedCardRefs[newIndex].current?.focus();
          e.preventDefault();
          e.stopPropagation();
        } else if (e.key === 'ArrowRight' && relatedFocusedIndex < relatedCardRefs.length - 1) {
          const newIndex = relatedFocusedIndex + 1;
          setRelatedFocusedIndex(newIndex);
          relatedCardRefs[newIndex].current?.focus();
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }

      // Don't interfere with VariableSwimlane left/right navigation for other groups
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        return;
      }

      if (e.key === 'ArrowDown') {
        handleMoveFocusDown();
        e.preventDefault();
        e.stopPropagation();
      } else if (e.key === 'ArrowUp') {
        handleMoveFocusUp();
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [handleMoveFocusUp, handleMoveFocusDown, focusedGroupIndex, relatedFocusedIndex]);

  // Sync DOM focus with app focus for all groups
  useEffect(() => {
    if (focusedGroupIndex === ACTIONS_GROUP) {
      actionRefs.current[actionsFocusedIndex]?.focus();
    } else if (focusedGroupIndex === FILTERS_GROUP) {
      filterRefs.current[filtersFocusedIndex]?.focus();
    } else if (focusedGroupIndex === RELATED_GROUP) {
      relatedCardRefs[relatedFocusedIndex]?.current?.focus();
    } else if (focusedGroupIndex === MINI_PLAYER_GROUP_INDEX && isMiniPlayerVisible) {
      relatedCardRefs.forEach(ref => ref.current?.blur());
    }
  }, [
    focusedGroupIndex,
    actionsFocusedIndex,
    filtersFocusedIndex,
    relatedFocusedIndex,
    MINI_PLAYER_GROUP_INDEX,
    isMiniPlayerVisible,
  ]);

  // --- Focus change handlers ---
  const handleActionFocusChange = index => {
    setActionsFocusedIndex(index);
    setFocusedGroupIndex(ACTIONS_GROUP);
  };

  const handleFilterFocusChange = index => {
    setFiltersFocusedIndex(index);
    setFocusedGroupIndex(FILTERS_GROUP);
  };

  const handleRelatedFocusChange = index => {
    setRelatedFocusedIndex(index);
    setFocusedGroupIndex(RELATED_GROUP);
  };

  const handleChannelSelect = () => {
    console.log('Channel selected');
  };

  return (
    <>
      <div
        className="channelinfo-content"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: `${getSidePadding()}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: 15,
          position: 'relative',
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
                  onKeyDown={e => {
                    if (e.key === 'ArrowDown') {
                      handleMoveFocusDown();
                      e.preventDefault();
                    } else if (e.key === 'ArrowUp') {
                      handleMoveFocusUp();
                      e.preventDefault();
                    }
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

            {/* Filter Buttons */}
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
                  onKeyDown={e => {
                    if (e.key === 'ArrowDown') {
                      handleMoveFocusDown();
                      e.preventDefault();
                    } else if (e.key === 'ArrowUp') {
                      handleMoveFocusUp();
                      e.preventDefault();
                    }
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
            <KeyboardWrapper
              ref={relatedCard1Ref}
              data-stable-id="channelinfo-related-card-1"
              onSelect={handleChannelSelect}
            >
              <ChannelCard
                title="Sample Channel 1"
                thumbnailUrl="https://picsum.photos/300/300?1"
                focused={focusedGroupIndex === RELATED_GROUP && relatedFocusedIndex === 0}
                onFocus={() => handleRelatedFocusChange(0)}
              />
            </KeyboardWrapper>
            <KeyboardWrapper
              ref={relatedCard2Ref}
              data-stable-id="channelinfo-related-card-2"
              onSelect={handleChannelSelect}
            >
              <ChannelCard
                title="Sample Channel 2"
                thumbnailUrl="https://picsum.photos/300/300?2"
                focused={focusedGroupIndex === RELATED_GROUP && relatedFocusedIndex === 1}
                onFocus={() => handleRelatedFocusChange(1)}
              />
            </KeyboardWrapper>
            <KeyboardWrapper
              ref={relatedCard3Ref}
              data-stable-id="channelinfo-related-card-3"
              onSelect={handleChannelSelect}
            >
              <ChannelCard
                title="Sample Channel 3"
                thumbnailUrl="https://picsum.photos/300/300?3"
                focused={focusedGroupIndex === RELATED_GROUP && relatedFocusedIndex === 2}
                onFocus={() => handleRelatedFocusChange(2)}
              />
            </KeyboardWrapper>
            <KeyboardWrapper
              ref={relatedCard4Ref}
              data-stable-id="channelinfo-related-card-4"
              onSelect={handleChannelSelect}
            >
              <ChannelCard
                title="Sample Channel 4"
                thumbnailUrl="https://picsum.photos/300/300?4"
                focused={focusedGroupIndex === RELATED_GROUP && relatedFocusedIndex === 3}
                onFocus={() => handleRelatedFocusChange(3)}
              />
            </KeyboardWrapper>
            <KeyboardWrapper
              ref={relatedCard5Ref}
              data-stable-id="channelinfo-related-card-5"
              onSelect={handleChannelSelect}
            >
              <ChannelCard
                title="Sample Channel 5"
                thumbnailUrl="https://picsum.photos/300/300?5"
                focused={focusedGroupIndex === RELATED_GROUP && relatedFocusedIndex === 4}
                onFocus={() => handleRelatedFocusChange(4)}
              />
            </KeyboardWrapper>
          </ChannelRow>
        </div>
      </div>
      <AdBanner />
    </>
  );
}

export default ChannelInfo;
