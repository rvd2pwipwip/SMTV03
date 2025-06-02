import React, { useEffect, useRef, useState } from 'react';
import { ChannelCard, Button } from '@smtv/tv-component-library';
import '../styles/App.css';
import ChannelRow from '../components/ChannelRow';
import KeyboardWrapper from '../components/KeyboardWrapper';
import { Like, SingNow } from 'stingray-icons';
import AdBanner from '../components/AdBanner';
import VariableSwimlane from '../components/VariableSwimlane';
import { channelInfoFilters } from '../data/channelInfoFilters';
import { useFocusNavigation } from '../contexts/FocusNavigationContext';
import VerticalScrollPadding from '../components/VerticalScrollPadding';

function getSpacingXXL() {
  if (typeof window !== 'undefined') {
    const value = getComputedStyle(document.documentElement).getPropertyValue('--spacing-xxl');
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 64 : parsed;
  }
  return 64;
}

function ChannelInfo({ channel, onPlay }) {
  // Use navigation context for vertical group focus
  const {
    focusedGroupIndex,
    setFocusedGroupIndex,
    moveFocusUp,
    moveFocusDown,
    getGroupFocusMemory,
    setGroupFocusMemory,
    setGroupCount
  } = useFocusNavigation();

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
  const [actionFocusedIndex, setActionFocusedIndex] = useState(getGroupFocusMemory(0).focusedIndex ?? 0);
  const [filtersFocusedIndex, setFiltersFocusedIndex] = useState(getGroupFocusMemory(1).focusedIndex ?? 0);
  const [relatedFocusedIndex, setRelatedFocusedIndex] = useState(getGroupFocusMemory(2).focusedIndex ?? 0);

  // Refs for scrolling and measuring
  const scrollContainerRef = useRef(null);
  const relatedGroupRef = useRef(null);
  const adBannerRef = useRef(null);
  const [adBannerHeight, setAdBannerHeight] = useState(0);
  const [spacingXXL, setSpacingXXL] = useState(getSpacingXXL());

  // Measure Ad Banner height and spacingXXL on mount and resize
  useEffect(() => {
    function measure() {
      if (adBannerRef.current) {
        setAdBannerHeight(adBannerRef.current.getBoundingClientRect().height);
      }
      setSpacingXXL(getSpacingXXL());
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Set group count dynamically
  const groups = [
    {
      type: 'actions',
      render: () => (
        <VariableSwimlane
          items={actionItems}
          focused={focusedGroupIndex === 0}
          focusedIndex={actionFocusedIndex}
          onFocusChange={(index) => {
            setActionFocusedIndex(index);
            setGroupFocusMemory(0, { focusedIndex: index });
          }}
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
      )
    },
    {
      type: 'filters',
      render: () => (
        <VariableSwimlane
          items={channelInfoFilters}
          focused={focusedGroupIndex === 1}
          focusedIndex={filtersFocusedIndex}
          onFocusChange={(index) => {
            setFiltersFocusedIndex(index);
            setGroupFocusMemory(1, { focusedIndex: index });
          }}
          renderItem={(filter, i, focused) => (
            <Button key={filter.id} variant="secondary" size="medium" focused={focused}>{filter.label}</Button>
          )}
        />
      )
    },
    {
      type: 'related',
      render: () => (
        <div
          ref={relatedGroupRef}
          style={{ 
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
            focused={focusedGroupIndex === 2}
            focusedIndex={relatedFocusedIndex}
            onFocusChange={(index) => {
              setRelatedFocusedIndex(index);
              setGroupFocusMemory(2, { focusedIndex: index });
            }}
          >
            {[1,2,3,4,5].map((n, i) => (
              <KeyboardWrapper
                key={n}
                data-stable-id={`channelinfo-related-card-${n}`}
              >
                <ChannelCard 
                  title={`Sample Channel ${n}`}
                  thumbnailUrl={`https://picsum.photos/300/300?${n}`}
                  onSelect={() => {}}
                  focused={focusedGroupIndex === 2 && relatedFocusedIndex === i}
                />
              </KeyboardWrapper>
            ))}
          </ChannelRow>
        </div>
      )
    }
  ];

  useEffect(() => {
    setGroupCount(groups.length);
  }, [setGroupCount, groups.length]);

  // Ensure initial focus is always on Play button when screen mounts
  useEffect(() => {
    setFocusedGroupIndex(0); // Focus the actions group
    setActionFocusedIndex(0); // Focus the Play button
    setGroupFocusMemory(0, { focusedIndex: 0 });
  }, [setFocusedGroupIndex, setActionFocusedIndex, setGroupFocusMemory]);

  // When a group regains focus, restore the last focused index
  useEffect(() => {
    if (focusedGroupIndex === 0) {
      setActionFocusedIndex(getGroupFocusMemory(0).focusedIndex ?? 0);
    } else if (focusedGroupIndex === 1) {
      setFiltersFocusedIndex(getGroupFocusMemory(1).focusedIndex ?? 0);
    } else if (focusedGroupIndex === 2) {
      setRelatedFocusedIndex(getGroupFocusMemory(2).focusedIndex ?? 0);
    }
  }, [focusedGroupIndex, getGroupFocusMemory]);

  // Handle up/down keys to move between groups
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

  // Scroll related group into view with correct offset when focused
  useEffect(() => {
    if (
      focusedGroupIndex === 2 &&
      relatedGroupRef.current &&
      scrollContainerRef.current &&
      adBannerHeight > 0 &&
      spacingXXL > 0
    ) {
      const relatedRect = relatedGroupRef.current.getBoundingClientRect();
      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const desiredBottom = windowHeight - (2 * adBannerHeight + spacingXXL);
      const scrollDelta = relatedRect.bottom - desiredBottom;
      // Only scroll if the bottom is below the desired position
      if (scrollDelta > 0) {
        scrollContainerRef.current.scrollBy({ top: scrollDelta, behavior: 'smooth' });
      }
    }
  }, [focusedGroupIndex, adBannerHeight, spacingXXL]);

  return (
    <>
      <div
        ref={scrollContainerRef}
        style={{ 
          width: '100%', 
          boxSizing: 'border-box', 
          padding: 'var(--screen-side-padding) var(--screen-side-padding)', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 15, 
          position: 'relative',
          overflowY: 'auto',
          maxHeight: `calc(100vh - ${adBannerHeight}px)`,
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
        className="channelinfo-scroll-container"
      >
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
            
            {/* Render groups[0] (actions) */}
            {groups[0].render()}
            
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
            
            {/* Render groups[1] (filters) */}
            {groups[1].render()}
          </div>
        </div>
        
        {/* Render groups[2] (related) */}
        {groups[2].render()}
        {/* Add vertical scroll padding for overlays */}
        {spacingXXL > 0 && <VerticalScrollPadding spacingXXL={spacingXXL} />}
      </div>
      <AdBanner ref={adBannerRef} />
    </>
  );
}

// Hide scroll bar for the scroll container
// Add this CSS to your global styles or in a CSS module:
// .channelinfo-scroll-container::-webkit-scrollbar { display: none; }
// .channelinfo-scroll-container { scrollbar-width: none; -ms-overflow-style: none; }

export default ChannelInfo;