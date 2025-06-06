import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ChannelCard, Button } from '@smtv/tv-component-library';
import '../styles/App.css';
import ChannelRow from '../components/ChannelRow';
import KeyboardWrapper from '../components/KeyboardWrapper';
import { Like, SingNow } from 'stingray-icons';
import AdBanner from '../components/AdBanner';
import { getSidePadding } from '../utils/layout';
import VariableSwimlane from '../components/VariableSwimlane';
import { useFocusNavigation } from '../contexts/GroupFocusNavigationContext';
import { fakeChannels } from '../data/fakeChannels';
import { useScreenMemory } from '../contexts/ScreenMemoryContext';
import { fakeChannelInfo } from '../data/fakeChannelInfo';


function ChannelInfo() {
  // Use plain refs for focusable elements
  const actionGroupRef = useRef(null);
  const playRef = useRef(null);
  const favRef = useRef(null);
  const filterGroupRef = useRef(null);
  const allRef = useRef(null);
  const popularRef = useRef(null);
  const recommendedRef = useRef(null);
  const newRef = useRef(null);
  const favoritesRef = useRef(null);
  const relatedGroupRef = useRef(null);
  const relatedCard1Ref = useRef(null);
  const relatedCard2Ref = useRef(null);
  const relatedCard3Ref = useRef(null);
  const relatedCard4Ref = useRef(null);
  const relatedCard5Ref = useRef(null);

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
  console.log('channelId:', channelId, 'channelInfo:', channelInfo, 'filterTags:', filterTags);

  // Persistent per-channel focus memory
  const { memory: screenMemory, setField: setScreenField } = useScreenMemory('channelinfo-' + channelId);

  // Define group indices for up/down navigation
  const ACTIONS_GROUP = 0;
  const FILTERS_GROUP = 1;
  const RELATED_GROUP = 2;

  // --- Persistent focus memory ---
  // On first mount, restore last focused group/item if present
  const [initialized, setInitialized] = useState(false);
  const [actionsFocusedIndex, setActionsFocusedIndex] = useState(0);
  const [filtersFocusedIndex, setFiltersFocusedIndex] = useState(0);
  const [relatedFocusedIndex, setRelatedFocusedIndex] = useState(0);
  const [focusedGroupIndex, setFocusedGroupIndex] = useState(ACTIONS_GROUP);

  // Helper: get focused index for a group from memory
  const getLastFocusedItemIndex = (groupIndex) => {
    return screenMemory.lastFocusedItemIndices?.[groupIndex] ?? 0;
  };

  // On mount: restore focus from memory if available
  useEffect(() => {
    if (!initialized) {
      if (
        typeof screenMemory.lastFocusedGroupIndex === 'number' &&
        screenMemory.lastFocusedItemIndices
      ) {
        setFocusedGroupIndex(screenMemory.lastFocusedGroupIndex);
        setActionsFocusedIndex(getLastFocusedItemIndex(ACTIONS_GROUP));
        setFiltersFocusedIndex(getLastFocusedItemIndex(FILTERS_GROUP));
        setRelatedFocusedIndex(getLastFocusedItemIndex(RELATED_GROUP));
      } else {
        // Default: focus Play button
        setFocusedGroupIndex(ACTIONS_GROUP);
        setActionsFocusedIndex(0);
        setFiltersFocusedIndex(0);
        setRelatedFocusedIndex(0);
        setScreenField('lastFocusedGroupIndex', ACTIONS_GROUP);
        setScreenField('lastFocusedItemIndices', { [ACTIONS_GROUP]: 0, [FILTERS_GROUP]: 0, [RELATED_GROUP]: 0 });
      }
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenMemory, initialized, channelId]);

  // --- Group navigation handlers ---
  // Move focus up/down and persist group index
  const moveFocusUp = () => {
    setFocusedGroupIndex((prev) => {
      const next = Math.max(prev - 1, 0);
      setScreenField('lastFocusedGroupIndex', next);
      return next;
    });
  };
  const moveFocusDown = () => {
    setFocusedGroupIndex((prev) => {
      const next = Math.min(prev + 1, 2);
      setScreenField('lastFocusedGroupIndex', next);
      return next;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        moveFocusDown();
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        moveFocusUp();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Focused index change handlers ---
  // When focused index changes, persist in memory
  const handleActionFocusChange = (index) => {
    setActionsFocusedIndex(index);
    setScreenField('lastFocusedGroupIndex', ACTIONS_GROUP);
    setScreenField('lastFocusedItemIndices', {
      ...screenMemory.lastFocusedItemIndices,
      [ACTIONS_GROUP]: index,
      [FILTERS_GROUP]: filtersFocusedIndex,
      [RELATED_GROUP]: relatedFocusedIndex,
    });
  };
  const handleFilterFocusChange = (index) => {
    setFiltersFocusedIndex(index);
    setScreenField('lastFocusedGroupIndex', FILTERS_GROUP);
    setScreenField('lastFocusedItemIndices', {
      ...screenMemory.lastFocusedItemIndices,
      [ACTIONS_GROUP]: actionsFocusedIndex,
      [FILTERS_GROUP]: index,
      [RELATED_GROUP]: relatedFocusedIndex,
    });
  };
  const handleRelatedFocusChange = (index) => {
    setRelatedFocusedIndex(index);
    setScreenField('lastFocusedGroupIndex', RELATED_GROUP);
    setScreenField('lastFocusedItemIndices', {
      ...screenMemory.lastFocusedItemIndices,
      [ACTIONS_GROUP]: actionsFocusedIndex,
      [FILTERS_GROUP]: filtersFocusedIndex,
      [RELATED_GROUP]: index,
    });
  };

  const handleChannelSelect = () => {
    console.log('Channel selected');
  };

  return (
    <>
      <div style={{ 
        width: '100%', 
        boxSizing: 'border-box', 
        padding: `${getSidePadding()}px`, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 15, 
        position: 'relative' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 40, width: '100%', boxSizing: 'border-box', paddingLeft: 0, paddingRight: 0 }}>
          {/* Channel Thumbnail Placeholder */}
          <div
            style={{
              width: 400,
              height: 400,
              background: 'var(--color-outline-secondary)',
              borderRadius: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
              fontSize: 32,
              fontFamily: 'var(--font-family-primary)',
              flexShrink: 0,
            }}
          >
            400x400
          </div>

          {/* Channel Details Group */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 900 }}>
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
              {channel?.title || "Sample Channel Title"}
            </h1>
            
            {/* Action Buttons */}
            <VariableSwimlane
              items={[
                {
                  id: 'play',
                  label: 'Play',
                  icon: <SingNow />, 
                  variant: 'primary',
                  ref: playRef,
                  onClick: () => {
                    // Implement play logic
                  },
                  dataStableId: 'channelinfo-action-play',
                },
                {
                  id: 'fav',
                  label: 'Add to Favorites',
                  icon: <Like />, 
                  variant: 'secondary',
                  ref: favRef,
                  dataStableId: 'channelinfo-action-fav',
                },
              ]}
              renderItem={(item, i, isFocused) => (
                <KeyboardWrapper
                  ref={item.ref}
                  data-stable-id={item.dataStableId}
                  key={item.id}
                >
                  <Button
                    icon={item.icon}
                    showIcon
                    size="medium"
                    variant={item.variant}
                    onClick={item.onClick}
                    focused={isFocused} 
                  >
                    {item.label}
                  </Button>
                </KeyboardWrapper>
              )}
              className="channelinfo-action-swimlane"
              width={"100%"}
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
                maxWidth: 700,
              }}
            >
              {channel?.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque."}
            </div>
            
            {/* Filter Buttons */}
            <VariableSwimlane
              items={filterTags}
              renderItem={(tag, i, isFocused) => (
                <KeyboardWrapper
                  key={tag.id}
                  data-stable-id={`channelinfo-filter-${tag.id}`}
                >
                  <Button
                    variant="secondary"
                    focused={focusedGroupIndex === FILTERS_GROUP && filtersFocusedIndex === i}
                    onFocus={() => handleFilterFocusChange(i)}
                  >
                    {tag.label}
                  </Button>
                </KeyboardWrapper>
              )}
              className="channelinfo-filter-swimlane"
              width={"100%"}
              focused={focusedGroupIndex === FILTERS_GROUP}
              focusedIndex={filtersFocusedIndex}
              onFocusChange={handleFilterFocusChange}
            />
          </div>
        </div>
        
        {/* Related Channels */}
        <div style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 0, paddingRight: 0, marginTop: 90 }}>
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
          >
            <KeyboardWrapper
              ref={relatedCard1Ref}
              data-stable-id="channelinfo-related-card-1"
            >
              <ChannelCard 
                title="Sample Channel 1"    
                thumbnailUrl="https://picsum.photos/300/300?1"
                onSelect={handleChannelSelect} 
                focused={focusedGroupIndex === RELATED_GROUP && relatedFocusedIndex === 0}
                onFocus={() => handleRelatedFocusChange(0)}
              />
            </KeyboardWrapper>
            <KeyboardWrapper
              ref={relatedCard2Ref}
              data-stable-id="channelinfo-related-card-2"
            >
              <ChannelCard 
                title="Sample Channel 2"    
                thumbnailUrl="https://picsum.photos/300/300?2"
                onSelect={handleChannelSelect} 
                focused={focusedGroupIndex === RELATED_GROUP && relatedFocusedIndex === 1}
                onFocus={() => handleRelatedFocusChange(1)}
              />
            </KeyboardWrapper>
            <KeyboardWrapper
              ref={relatedCard3Ref}
              data-stable-id="channelinfo-related-card-3"
            >
              <ChannelCard 
                title="Sample Channel 3"    
                thumbnailUrl="https://picsum.photos/300/300?3"
                onSelect={handleChannelSelect} 
                focused={focusedGroupIndex === RELATED_GROUP && relatedFocusedIndex === 2}
                onFocus={() => handleRelatedFocusChange(2)}
              />
            </KeyboardWrapper>
            <KeyboardWrapper
              ref={relatedCard4Ref}
              data-stable-id="channelinfo-related-card-4"
            >
              <ChannelCard 
                title="Sample Channel 4"    
                thumbnailUrl="https://picsum.photos/300/300?4"
                onSelect={handleChannelSelect} 
                focused={focusedGroupIndex === RELATED_GROUP && relatedFocusedIndex === 3}
                onFocus={() => handleRelatedFocusChange(3)}
              />
            </KeyboardWrapper>
            <KeyboardWrapper
              ref={relatedCard5Ref}
              data-stable-id="channelinfo-related-card-5"
            >
              <ChannelCard 
                title="Sample Channel 5"    
                thumbnailUrl="https://picsum.photos/300/300?5"
                onSelect={handleChannelSelect} 
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