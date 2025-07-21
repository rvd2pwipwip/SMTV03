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
import { genreFilters } from '../data/genreFilters'; // for testing VariableSwimlane
import { useFocusNavigation } from '../contexts/GroupFocusNavigationContext';
import { getSidePadding } from '../utils/layout';
import { useScreenMemory } from '../contexts/ScreenMemoryContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  // Persistent screen memory for activeFilterId
  const { memory, setField } = useScreenMemory('home');
  const activeFilterId = memory.activeFilterId || tvHomeFilters[0]?.id;
  // const activeFilterId = memory.activeFilterId || genreFilters[0]?.id;
  const setActiveFilterId = id => setField('activeFilterId', id);

  // Refs for each group
  const searchRef = useRef(null);
  const infoRef = useRef(null);
  const filterRefs = useRef([]); // For filter buttons
  const cardRefs = useRef([]); // For channel cards

  // Navigation context for vertical group focus
  const {
    focusedGroupIndex,
    moveFocusUp,
    moveFocusDown,
    getGroupFocusMemory,
    setGroupFocusMemory,
  } = useFocusNavigation();

  // Group indices
  const HEADER_GROUP = 0;
  const FILTERS_GROUP = 1;
  const SWIMLANE_GROUP = 2;

  // Header group focus
  const [headerFocusedIndex, setHeaderFocusedIndex] = useState(0);

  // UX DESIGN PATTERN: Initial Focus vs Navigation Memory
  // When users return to this screen, we want them to start at their active filter selection
  // rather than where they last navigated horizontally. This creates a more predictable
  // and content-oriented experience. However, once they start navigating horizontally
  // within the current session, we remember their navigation for smoother interaction.

  // Track whether user has navigated horizontally within filters during this session
  const [hasNavigatedFiltersHorizontally, setHasNavigatedFiltersHorizontally] = useState(false);

  // Calculate the index of the currently active filter for initial positioning
  const activeFilterIndex = tvHomeFilters.findIndex(f => f.id === activeFilterId);
  const safeActiveFilterIndex = activeFilterIndex >= 0 ? activeFilterIndex : 0;

  // Filters group focus - UX LOGIC:
  // On mount: Start at active filter (content-based positioning)
  // After horizontal nav: Use focus memory (interaction-based positioning)
  const filtersMemory = getGroupFocusMemory(FILTERS_GROUP);
  const [filtersFocusedIndex, setFiltersFocusedIndex] = useState(
    // UX PRINCIPLE: Content context over navigation memory on fresh loads
    // Users expect to see their active selection highlighted when returning to a screen
    hasNavigatedFiltersHorizontally
      ? (filtersMemory.focusedIndex ?? safeActiveFilterIndex)
      : safeActiveFilterIndex
  );

  // Swimlane group focus
  const swimlaneMemory = getGroupFocusMemory(SWIMLANE_GROUP);
  const [swimlaneFocusedIndex, setSwimlaneFocusedIndex] = useState(
    swimlaneMemory.focusedIndex ?? 0
  );

  const navigate = useNavigate();

  const handleChannelSelect = channel => {
    navigate(`/channel-info/${channel.id}`, {
      state: { fromHome: true },
    });
  };

  // UX ENHANCEMENT: Handle horizontal navigation state tracking
  // This function is called when users navigate left/right within filters
  const handleFilterHorizontalNavigation = newIndex => {
    setFiltersFocusedIndex(newIndex);
    setGroupFocusMemory(FILTERS_GROUP, { focusedIndex: newIndex });

    // UX STATE TRANSITION: Mark that user has started horizontal navigation
    // From this point forward, focus memory takes precedence over active filter positioning
    if (!hasNavigatedFiltersHorizontally) {
      setHasNavigatedFiltersHorizontally(true);
    }
  };

  // Sync DOM focus with app focus for all groups
  useEffect(() => {
    if (focusedGroupIndex === HEADER_GROUP) {
      if (headerFocusedIndex === 0) {
        searchRef.current?.focus();
      }
      if (headerFocusedIndex === 1) {
        infoRef.current?.focus();
      }
    } else if (focusedGroupIndex === FILTERS_GROUP) {
      filterRefs.current[filtersFocusedIndex]?.focus();
    } else if (focusedGroupIndex === SWIMLANE_GROUP) {
      cardRefs.current[swimlaneFocusedIndex]?.focus();
    }
  }, [focusedGroupIndex, headerFocusedIndex, filtersFocusedIndex, swimlaneFocusedIndex]);

  // Blur header buttons when leaving header group
  useEffect(() => {
    if (focusedGroupIndex !== HEADER_GROUP) {
      searchRef.current?.blur();
      infoRef.current?.blur();
    }
  }, [focusedGroupIndex]);

  return (
    <>
      <div
        className="home-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xxl)',
          height: `calc(100vh - 150px)`,
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
        }}
      >
        {/* Header group */}
        <div
          className="home-header"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding:
              'var(--screen-side-padding) var(--screen-side-padding) 0 var(--screen-side-padding)',
            minHeight: 90,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ width: 245, height: 70, display: 'flex', alignItems: 'center' }}>
            <img
              src={stingrayMusicLogo}
              alt="Stingray Music"
              style={{ width: '100%', height: '100%' }}
            />
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
              onClick={() => navigate('/search-browse')}
              onFocus={() => {
                setHeaderFocusedIndex(0);
                setGroupFocusMemory(HEADER_GROUP, { focusedIndex: 0 });
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate('/search-browse');
                  e.preventDefault();
                } else if (e.key === 'ArrowRight') {
                  setHeaderFocusedIndex(1);
                  setGroupFocusMemory(HEADER_GROUP, { focusedIndex: 1 });
                  infoRef.current?.focus();
                  e.preventDefault();
                } else if (e.key === 'ArrowDown') {
                  moveFocusDown();
                  e.preventDefault();
                }
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
              onKeyDown={e => {
                if (e.key === 'ArrowLeft') {
                  setHeaderFocusedIndex(0);
                  setGroupFocusMemory(HEADER_GROUP, { focusedIndex: 0 });
                  searchRef.current?.focus();
                  e.preventDefault();
                } else if (e.key === 'ArrowDown') {
                  moveFocusDown();
                  e.preventDefault();
                }
              }}
            />
          </div>
        </div>

        {/* Filters group */}
        <VariableSwimlane
          items={tvHomeFilters}
          // items={genreFilters}
          renderItem={(filter, i, focused) => (
            <Button
              ref={el => {
                filterRefs.current[i] = el;
              }}
              key={filter.id}
              variant={filter.id === activeFilterId ? 'primary' : 'secondary'}
              size="medium"
              focused={focused}
              onClick={() => setActiveFilterId(filter.id)}
              aria-label={filter.label}
              onKeyDown={e => {
                if (e.key === 'ArrowDown') {
                  moveFocusDown();
                  e.preventDefault();
                } else if (e.key === 'ArrowUp') {
                  moveFocusUp();
                  e.preventDefault();
                }
                // UX NOTE: Horizontal navigation within filters is handled by VariableSwimlane
                // The swimlane component manages left/right arrow keys and calls our onFocusChange
              }}
            >
              {filter.label}
            </Button>
          )}
          focused={focusedGroupIndex === FILTERS_GROUP}
          focusedIndex={filtersFocusedIndex}
          onSelect={(filter, i) => {
            setActiveFilterId(filter.id);
            // UX LOGIC: When user selects a filter, update focus tracking
            // This maintains the selected filter as the new reference point
            handleFilterHorizontalNavigation(i);
          }}
          onFocusChange={index => {
            // UX BEHAVIOR: This is called when user navigates horizontally with arrow keys
            // We use our tracking function to remember this is now navigation-driven focus
            handleFilterHorizontalNavigation(index);
          }}
          leftPadding={getSidePadding()}
          rightPadding={getSidePadding()}
          ensureActiveVisible={true}
          // UX FIX: Use correct data source for activeIndex calculation
          // Previously used tvHomeFilters but we're actually rendering genreFilters
          activeIndex={tvHomeFilters.findIndex(f => f.id === activeFilterId)}
        />

        {/* UX PATTERN: Filter navigation balances content context with navigation memory */}

        {/* Swimlane group */}
        <FixedSwimlane
          items={fakeChannels}
          renderItem={(channel, i, focused) => (
            <KeyboardWrapper
              key={channel.id}
              onSelect={() => handleChannelSelect(channel)}
              selectData={channel}
              ref={el => {
                cardRefs.current[i] = el;
              }}
              onUp={moveFocusUp}
              onDown={moveFocusDown}
            >
              <ChannelCard
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
          onFocusChange={index => {
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
