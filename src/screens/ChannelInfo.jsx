import React, { useEffect, useRef, useState } from 'react';
import { ChannelCard, Button } from '@smtv/tv-component-library';
import '../styles/App.css';
import ChannelRow from '../components/ChannelRow';
import KeyboardWrapper from '../components/KeyboardWrapper';
import { Like, SingNow } from 'stingray-icons';
import AdBanner from '../components/AdBanner';
import VariableSwimlane from '../components/VariableSwimlane';
import { channelInfoFilters } from '../data/channelInfoFilters';

function ChannelInfo({ channel, onPlay }) {
  // Use plain refs for focusable elements
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
  const ACTION_GROUP = 0;
  const FILTERS_GROUP = 1;
  const RELATED_GROUP = 2;

  // Action swimlane state
  const actionItems = [
    {
      id: 'play',
      label: 'Play',
      icon: <SingNow />,
      onClick: onPlay,
      variant: 'primary',
    },
    {
      id: 'fav',
      label: 'Add to Favorites',
      icon: <Like />,
      onClick: () => {},
      variant: 'secondary',
    },
  ];
  const [actionFocusedIndex, setActionFocusedIndex] = useState(0);

  // Set initial focus to Play button on mount (optional, for keyboard users)
  useEffect(() => {
    setActionFocusedIndex(0);
  }, []);

  const handleChannelSelect = () => {
    console.log('Channel selected');
  };

  return (
    <>
      <div style={{ 
        width: '100%', 
        boxSizing: 'border-box', 
        padding: 'var(--screen-side-padding) var(--screen-side-padding)', 
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
            
            {/* Action Buttons as VariableSwimlane */}
            <VariableSwimlane
              items={actionItems}
              focused={true}
              focusedIndex={actionFocusedIndex}
              onFocusChange={setActionFocusedIndex}
              onSelect={(item) => item.onClick && item.onClick()}
              renderItem={(item, i, focused) => (
                <Button
                  key={item.id}
                  icon={item.icon}
                  showIcon
                  size="medium"
                  variant={item.variant}
                  focused={focused}
                  onClick={item.onClick}
                >
                  {item.label}
                </Button>
              )}
              style={{ marginBottom: 0 }}
            />
            
            {/* Channel Description */}
            <div
              style={{
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-body)',
                color: 'var(--color-text-secondary)',
                maxWidth: '60ch',
              }}
            >
              {channel?.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque."}
            </div>
            
            {/* Filter Buttons */}
            <VariableSwimlane
              items={channelInfoFilters}
              renderItem={(filter, i, focused) => (
                <Button key={filter.id} variant="secondary" size="medium" focused={focused}>{filter.label}</Button>
              )}
            />
          </div>
        </div>
        
        {/* Related Channels */}
        <div style={{ 
          width: '100%', 
          boxSizing: 'border-box', 
          paddingLeft: 0, 
          paddingRight: 0, 
          marginTop: 'var(--spacing-xxl)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-s12)', }}>
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