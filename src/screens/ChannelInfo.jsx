import React, { useEffect, useRef } from 'react';
import { ChannelCard, Button } from '@smtv/tv-component-library';
import '../styles/App.css';
import ChannelRow from '../components/ChannelRow';
import KeyboardWrapper from '../components/KeyboardWrapper';
import { Like, SingNow } from 'stingray-icons';
import AdBanner from '../components/AdBanner';

function ChannelInfo({ channel, onBack, onPlay }) {
  // Action button group focus context (not itself focusable, tracks children)
  const actionGroupRef = useRef(null);

  // Play button focusable
  const playRef = useRef(null);

  // Add to Favorites button focusable
  const favRef = useRef(null);

  // Filter button group focus context (not itself focusable, tracks children)
  const filterGroupRef = useRef(null);

  // Individual filter buttons
  const allRef = useRef(null);
  const popularRef = useRef(null);
  const recommendedRef = useRef(null);
  const newRef = useRef(null);
  const favoritesRef = useRef(null);

  // Related channel cards group focus context (not itself focusable, tracks children)
  const relatedGroupRef = useRef(null);

  // Individual related channel cards
  const relatedCard1Ref = useRef(null);
  const relatedCard2Ref = useRef(null);
  const relatedCard3Ref = useRef(null);
  const relatedCard4Ref = useRef(null);
  const relatedCard5Ref = useRef(null);

  // Set initial focus to Play button on mount
  useEffect(() => {
    if (playRef) {
      setTimeout(() => {
        playRef.current.focus();
      }, 0);
    }
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
            
            {/* Action Buttons */}
            <div 
              ref={actionGroupRef}
              style={{ display: 'flex', gap: 24 }}
            >
              <KeyboardWrapper
                ref={playRef}
                data-stable-id="channelinfo-action-play"
                onSelect={onPlay}
              >
                <Button
                  icon={<SingNow />}
                  showIcon
                  size="medium"
                  variant="primary"
                  onClick={onPlay}
                >
                  Play
                </Button>
              </KeyboardWrapper>
              <KeyboardWrapper
                ref={favRef}
                data-stable-id="channelinfo-action-fav"
              >
                <Button
                  icon={<Like />}
                  showIcon
                  size="medium"
                  variant="secondary"
                >
                  Add to Favorites
                </Button>
              </KeyboardWrapper>
            </div>
            
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