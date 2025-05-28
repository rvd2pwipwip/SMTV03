import React, { useRef, useState, useEffect } from 'react';
import KeyboardWrapper from '../components/KeyboardWrapper';
import { ChannelCard, Button } from '@smtv/tv-component-library';
import '@smtv/tv-component-library/dist/style.css';
import Swimlane from '../components/Swimlane';
import SlidingSwimlane from '../components/SlidingSwimlane';
import '../styles/App.css';
import { useFocusMemory } from '../contexts/FocusMemoryContext';
import AdBanner from '../components/AdBanner';
import { MagnifyingGlass, Info } from 'stingray-icons';
import stingrayMusicLogo from '../assets/svg/stingrayMusic.svg';
import { TRANS_BTN_ICON_SIZE } from '../constants/ui';
import ChannelInfo from './ChannelInfo';
// TODO: Remove this once we have a real swimlane
import GenericSwimlane from '../components/GenericSwimlane';
import { fakeChannels } from '../data/fakeChannels';

function Home({ onChannelSelect }) {
  // Use plain refs for each card
  const cardRefs = Array.from({ length: 12 }, () => useRef(null));
  const searchRef = useRef(null);
  const infoRef = useRef(null);
  const testButtonRef = useRef(null);
  const slidingSwimlaneRef = useRef(null);
  const swimlaneRef = useRef(null);

  // Define group indices for up/down navigation
  const HEADER_GROUP = 0;
  const FILTERS_GROUP = 1;
  const SWIMLANE_GROUP = 2;

  // TEMP: Local focus group state for standalone testing
  const [focusedGroupIndex, setFocusedGroupIndex] = useState(SWIMLANE_GROUP); // Swimlane focused by default

  // ---
  // Legacy swimlane navigation logic (kept for reference):
  // This logic handled left/right navigation and focus for the old swimlane implementation.
  // It is commented out so it does not interfere with the new GenericSwimlane,
  // but is kept here as a reference for offset/parking behavior.
  // ---
  // const cardRefs = Array.from({ length: 12 }, () => useRef(null));
  // const [focusedCard, setFocusedCard] = useState(0);
  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     if (e.key === 'ArrowRight') {
  //       setFocusedCard((prev) => {
  //         const next = Math.min(prev + 1, cardRefs.length - 1);
  //         return next;
  //       });
  //     } else if (e.key === 'ArrowLeft') {
  //       setFocusedCard((prev) => {
  //         const next = Math.max(prev - 1, 0);
  //         return next;
  //       });
  //     }
  //   };
  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => window.removeEventListener('keydown', handleKeyDown);
  // }, [cardRefs.length]);
  // useEffect(() => {
  //   const ref = cardRefs[focusedCard];
  //   if (ref && ref.current) {
  //     ref.current.focus();
  //   }
  // }, [focusedCard, cardRefs]);

  // Example click handler
  const handleCardClick = (channelData) => {
    onChannelSelect(channelData);
  };



  return (
    <div
      style={{
        width: '1920px',
        height: '1080px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        background: 'var(--app-background, #000)',
        margin: '0 auto',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 32px rgba(0,0,0,0.5)',
        overflow: 'hidden',
      }}
    >
      {/* Main navigation stack: header, filters, swimlane */}
      <div
        className="main-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 150px)',
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
        }}
      >
        <div className="home-header" style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--screen-side-padding) var(--screen-side-padding) 0 var(--screen-side-padding)', minHeight: 90, boxSizing: 'border-box' }}>
          <div style={{ width: 245, height: 70, display: 'flex', alignItems: 'center' }}>
            <img src={stingrayMusicLogo} alt="Stingray Music" style={{ width: '100%', height: '100%' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center' }}>
            <Button
              ref={searchRef}
              data-stable-id="home-header-action-search"
              icon={<MagnifyingGlass size={TRANS_BTN_ICON_SIZE} />}
              showIcon
              size="medium"
              variant="transparent"
              aria-label="Search"
            />
            <Button
              ref={infoRef}
              data-stable-id="home-header-action-info"
              icon={<Info size={TRANS_BTN_ICON_SIZE} />}
              showIcon
              size="medium"
              variant="transparent"
              aria-label="Info"
            />
          </div>
        </div>
        <div className="home-filters" style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '32px 0' }}>
          <Button
            ref={testButtonRef}
            data-stable-id="home-test-primary-button"
            variant="primary"
            size="medium"
          >
            Test Primary Button
          </Button>
        </div>
        {/* TODO: Remove this once we have a real swimlane */}
        {/* <SlidingSwimlane focusedIndex={focusedCard} numCards={cardRefs.length}>
          <Swimlane
            ref={swimlaneRef}
            groupIndex={SWIMLANE_GROUP}
            focusedGroupIndex={focusedGroupIndex}
            cardRefs={cardRefs}
          >
            {cardRefs.map((ref, i) => (
              <KeyboardWrapper
                key={i}
                ref={ref}
                onSelect={onChannelSelect}
                selectData={{ id: i + 1, title: `Sample Channel ${i + 1}` }}
              >
                <ChannelCard
                  data-stable-id={`home-card-${i + 1}`}
                  title={`Sample Channel ${i + 1}`}
                  thumbnailUrl={`https://picsum.photos/300/300?${i + 1}`}
                  onClick={() => handleCardClick({ id: i + 1, title: `Sample Channel ${i + 1}` })}
                  focused={focusedCard === i}
                />
              </KeyboardWrapper>
            ))}
          </Swimlane>
        </SlidingSwimlane> */}
        {/*
          Hybrid navigation approach:
          - Parent (Home) manages which group is focused (header, filters, swimlane)
          - Swimlane manages its own left/right navigation and focus ring
          - Pass focused, onSelect, and onFocusChange to GenericSwimlane
        */}
        <GenericSwimlane
          items={fakeChannels}
          renderItem={(channel, i, focused) => (
            <ChannelCard
              key={channel.id}
              title={channel.title}
              thumbnailUrl={channel.thumbnailUrl}
              onClick={() => onChannelSelect(channel)}
              focused={focused} // Only the focused card shows the focus ring
            />
          )}
          maxItems={12}
          fallbackItem={<div>No channels available</div>}
          // New props for navigation/focus
          focused={focusedGroupIndex === SWIMLANE_GROUP} // Only handle keys when swimlane is focused
          onSelect={onChannelSelect} // Called when Enter/OK is pressed on a card
          onFocusChange={(index) => {
            /* Optional: update parent memory or analytics here */
            // console.log('Swimlane focused card:', index);
          }}
        />
      </div>
      {/* Ad banner is outside the navigation context and not focusable */}
      <AdBanner />
    </div>
  );
}

export default Home;