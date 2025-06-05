import React, { useRef, useState, useEffect } from 'react';
import { ChannelCard, Button } from '@smtv/tv-component-library';
import '@smtv/tv-component-library/dist/style.css';
import '../styles/App.css';
import AdBanner from '../components/AdBanner';
import { MagnifyingGlass, Info } from 'stingray-icons';
import stingrayMusicLogo from '../assets/svg/stingrayMusic.svg';
import { TRANS_BTN_ICON_SIZE } from '../constants/ui';
import FixedSwimlane from '../components/FixedSwimlane';
import { fakeChannels } from '../data/fakeChannels';
import KeyboardWrapper from '../components/KeyboardWrapper';  
import VariableSwimlane from '../components/VariableSwimlane';
import { tvHomeFilters } from '../data/tvHomeFilters';
import { genreFilters } from '../data/genreFilters';
import { useFocusNavigation } from '../contexts/GroupFocusNavigationContext';
import { getSidePadding } from '../utils/layout';
import { useScreenMemory } from '../contexts/ScreenMemoryContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  // Use persistent screen memory for activeFilterId
  const { memory, setField } = useScreenMemory('home');
  // Use memory.activeFilterId as the source of truth, fallback to first filter
  const activeFilterId = memory.activeFilterId || tvHomeFilters[0]?.id;
  const setActiveFilterId = (id) => setField('activeFilterId', id);

  // Use plain refs for each card
  const cardRefs = useRef([]);
  const searchRef = useRef(null);
  const infoRef = useRef(null);

  // Use navigation context for vertical group focus
  const { 
    focusedGroupIndex, 
    moveFocusUp, 
    moveFocusDown, 
    getGroupFocusMemory, 
    setGroupFocusMemory 
  } = useFocusNavigation();

  // Define group indices for up/down navigation
  const HEADER_GROUP = 0;
  const FILTERS_GROUP = 1;
  const SWIMLANE_GROUP = 2;

  // Get the last focused index for the filter group from context
  const filtersMemory = getGroupFocusMemory(FILTERS_GROUP);
  const [filtersFocusedIndex, setFiltersFocusedIndex] = useState(filtersMemory.focusedIndex);

  const navigate = useNavigate();

  const handleChannelSelect = (channel) => {
    console.log('Navigating to channel:', channel.id);
    // Save focus memory if needed
    navigate(`/channel-info/${channel.id}`, {
      state: {
        fromHome: true,
        // Add more state here if needed
      }
    });
  };

  // When the group regains focus, restore the last focused index
  useEffect(() => {
    if (focusedGroupIndex === FILTERS_GROUP) {
      setFiltersFocusedIndex(filtersMemory.focusedIndex);
    }
    // eslint-disable-next-line
  }, [focusedGroupIndex]);

  // Get the last focused index for the swimlane group from context
  const swimlaneMemory = getGroupFocusMemory(SWIMLANE_GROUP);
  const [swimlaneFocusedIndex, setSwimlaneFocusedIndex] = useState(swimlaneMemory.focusedIndex);

  // When the group regains focus, restore the last focused index
  useEffect(() => {
    if (focusedGroupIndex === SWIMLANE_GROUP) {
      setSwimlaneFocusedIndex(swimlaneMemory.focusedIndex);
    }
    // eslint-disable-next-line
  }, [focusedGroupIndex]);

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

  // Get the last focused index for the header group from context
  const headerMemory = getGroupFocusMemory(HEADER_GROUP);
  const [headerFocusedIndex, setHeaderFocusedIndex] = useState(headerMemory.focusedIndex ?? 0);
  const [hasVisitedHeader, setHasVisitedHeader] = useState(false);

  // When the header group regains focus, focus first child on first visit, else use memory
  useEffect(() => {
    if (focusedGroupIndex === HEADER_GROUP) {
      if (!hasVisitedHeader) {
        // First time: focus first child
        searchRef.current?.focus();
        setHeaderFocusedIndex(0);
        setGroupFocusMemory(HEADER_GROUP, { focusedIndex: 0 });
        setHasVisitedHeader(true);
      } else {
        // Subsequent times: focus last focused child
        if (headerFocusedIndex === 0) {
          searchRef.current?.focus();
        } else if (headerFocusedIndex === 1) {
          infoRef.current?.focus();
        }
      }
    }
  }, [focusedGroupIndex, hasVisitedHeader, headerFocusedIndex, setGroupFocusMemory]);

  useEffect(() => {
    if (focusedGroupIndex !== HEADER_GROUP) return;
  
    const handleHeaderKeyDown = (e) => {
      if (e.key === 'ArrowRight' && headerFocusedIndex === 0) {
        setHeaderFocusedIndex(1);
        setGroupFocusMemory(HEADER_GROUP, { focusedIndex: 1 });
        infoRef.current?.focus();
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' && headerFocusedIndex === 1) {
        setHeaderFocusedIndex(0);
        setGroupFocusMemory(HEADER_GROUP, { focusedIndex: 0 });
        searchRef.current?.focus();
        e.preventDefault();
      }
    };
  
    window.addEventListener('keydown', handleHeaderKeyDown);
    return () => window.removeEventListener('keydown', handleHeaderKeyDown);
  }, [focusedGroupIndex, headerFocusedIndex, setGroupFocusMemory]);

  // Blur header buttons when leaving header group to remove focus ring
  useEffect(() => {
    if (focusedGroupIndex !== HEADER_GROUP) {
      searchRef.current?.blur();
      infoRef.current?.blur();
    }
  }, [focusedGroupIndex]);

  // Ensures the DOM focus matches your app visual focus.
  useEffect(() => {
    if (
      focusedGroupIndex === SWIMLANE_GROUP &&
      cardRefs.current[swimlaneFocusedIndex]
    ) {
      cardRefs.current[swimlaneFocusedIndex].focus();
    }
  }, [swimlaneFocusedIndex, focusedGroupIndex]);

  return (
    <>
      {/* Main navigation stack: header, filters, swimlane */}
      <div
        className="home-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          // Use design token for vertical gap between main sections
          gap: 'var(--spacing-xxl)',
          height: `calc(100vh - 150px)`,
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
              focused={focusedGroupIndex === HEADER_GROUP && headerFocusedIndex === 0}
              onFocus={() => {
                setHeaderFocusedIndex(0);
                setGroupFocusMemory(HEADER_GROUP, { focusedIndex: 0 });
              }}
            />
            <Button
              ref={infoRef}
              data-stable-id="home-header-action-info"
              icon={<Info size={TRANS_BTN_ICON_SIZE} />}
              showIcon
              size="medium"
              variant="transparent"
              aria-label="Info"
              focused={focusedGroupIndex === HEADER_GROUP && headerFocusedIndex === 1}
              onFocus={() => {
                setHeaderFocusedIndex(1);
                setGroupFocusMemory(HEADER_GROUP, { focusedIndex: 1 });
              }}
            />
          </div>
        </div>
        {/*
          VariableSwimlane for filter buttons.
          - Uses Button.tsx (medium, secondary for all except active, which is medium primary)
          - Focus ring is handled by Button component
        */}
        <VariableSwimlane
          items={tvHomeFilters}
          renderItem={(filter, i, focused) => (
            <Button
              key={filter.id}
              variant={filter.id === activeFilterId ? 'primary' : 'secondary'}
              size="medium"
              focused={focused}
              onClick={
                () => setActiveFilterId(filter.id) 
              }
              aria-label={filter.label}
            >
              {filter.label}
            </Button>
          )}
          focused={focusedGroupIndex === FILTERS_GROUP}
          focusedIndex={filtersFocusedIndex}
          onSelect={(filter) => setActiveFilterId(filter.id)}
          onFocusChange={(index) => {
            setFiltersFocusedIndex(index);
            setGroupFocusMemory(FILTERS_GROUP, { focusedIndex: index });
          }}
          leftPadding={getSidePadding()}
          rightPadding={getSidePadding()}
          ensureActiveVisible={true}
          activeIndex={tvHomeFilters.findIndex(f => f.id === activeFilterId)}
        />

        <FixedSwimlane
          items={fakeChannels}
          renderItem={(channel, i, focused) => (
            <KeyboardWrapper
              key={channel.id}
              onSelect={() => handleChannelSelect(channel)}
              selectData={channel}
              ref={el => { cardRefs.current[i] = el; }} // <-- Pass ref to KeyboardWrapper
            >
              <ChannelCard
                ref={el => { cardRefs.current[i] = el; }}
                title={channel.title}
                thumbnailUrl={channel.thumbnailUrl}
                focused={focused}
                onClick={() => handleChannelSelect(channel)}
              />
            </KeyboardWrapper>
          )}
          maxItems={12}
          fallbackItem={<div>No channels available</div>}
          focused={focusedGroupIndex === SWIMLANE_GROUP}
          focusedIndex={swimlaneFocusedIndex}
          onFocusChange={(index) => {
            setSwimlaneFocusedIndex(index);
            setGroupFocusMemory(SWIMLANE_GROUP, { focusedIndex: index });
          }}
          leftPadding={getSidePadding()}
          rightPadding={getSidePadding()}
        />
      </div>
      
      {/* Ad banner is outside the navigation context and not focusable */}
      <AdBanner />
    </>
  );
}

export default Home;