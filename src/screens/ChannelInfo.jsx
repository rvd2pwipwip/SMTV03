import React, { useEffect, useRef, useState } from 'react';
import { ChannelCard, Button } from '@smtv/tv-component-library';
import '../styles/App.css';
import ChannelRow from '../components/ChannelRow';
import KeyboardWrapper from '../components/KeyboardWrapper';
import { Like, SingNow } from 'stingray-icons';
import AdBanner from '../components/AdBanner';
import { getSidePadding } from '../utils/layout';
import VariableSwimlane from '../components/VariableSwimlane';
import { useFocusNavigation } from '../contexts/GroupFocusNavigationContext';


function ChannelInfo({ channel, onBack, onPlay }) {
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

  // Define group indices for up/down navigation
  const ACTIONS_GROUP = 0;
  const FILTERS_GROUP = 1;
  const RELATED_GROUP = 2;

  const {
    focusedGroupIndex,
    setFocusedGroupIndex,
    moveFocusUp,
    moveFocusDown,
    getGroupFocusMemory,
    setGroupFocusMemory
  } = useFocusNavigation();

  useEffect(() => {
    setActionsFocusedIndex(0); // Focus Play button in actions group
    setGroupFocusMemory(ACTIONS_GROUP, { focusedIndex: 0 });
    setFocusedGroupIndex(ACTIONS_GROUP);
  }, []);

  const actionsMemory = getGroupFocusMemory(ACTIONS_GROUP);
  const [actionsFocusedIndex, setActionsFocusedIndex] = useState(actionsMemory.focusedIndex ?? 0);

  const filtersMemory = getGroupFocusMemory(FILTERS_GROUP);
  const [filtersFocusedIndex, setFiltersFocusedIndex] = useState(filtersMemory.focusedIndex ?? 0);

  const relatedMemory = getGroupFocusMemory(RELATED_GROUP);
  const [relatedFocusedIndex, setRelatedFocusedIndex] = useState(relatedMemory.focusedIndex ?? 0);

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
  }, [moveFocusUp, moveFocusDown]);

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
                  onClick: onPlay,
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
              onFocusChange={(index) => {
                setActionsFocusedIndex(index);
                setGroupFocusMemory(ACTIONS_GROUP, { focusedIndex: index });
              }}
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
            <div
              ref={filterGroupRef}
              style={{ display: 'flex', gap: 16 }}
            >
              <KeyboardWrapper
                ref={allRef}
                data-stable-id="channelinfo-filter-all"
              >
                <Button variant="secondary">All</Button>
              </KeyboardWrapper>
              <KeyboardWrapper
                ref={popularRef}
                data-stable-id="channelinfo-filter-popular"
              >
                <Button variant="secondary">Popular</Button>
              </KeyboardWrapper>
              <KeyboardWrapper
                ref={recommendedRef}
                data-stable-id="channelinfo-filter-recommended"
              >
                <Button variant="secondary">Recommended</Button>
              </KeyboardWrapper>
              <KeyboardWrapper
                ref={newRef}
                data-stable-id="channelinfo-filter-new"
              >
                <Button variant="secondary">New</Button>
              </KeyboardWrapper>
              <KeyboardWrapper
                ref={favoritesRef}
                data-stable-id="channelinfo-filter-favorites"
              >
                <Button variant="secondary">Favorites</Button>
              </KeyboardWrapper>
            </div>
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