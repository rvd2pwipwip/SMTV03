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
  // Persistent screen memory for activeFilterId
  const { memory, setField } = useScreenMemory('home');
  const activeFilterId = memory.activeFilterId || tvHomeFilters[0]?.id;
  const setActiveFilterId = (id) => setField('activeFilterId', id);

  // Refs for each group
  const searchRef = useRef(null);
  const infoRef = useRef(null);
  const filterRefs = useRef([]); // For filter buttons
  const cardRefs = useRef([]);   // For channel cards

  // Navigation context for vertical group focus
  const {
    focusedGroupIndex,
    moveFocusUp,
    moveFocusDown,
    getGroupFocusMemory,
    setGroupFocusMemory
  } = useFocusNavigation();

  console.log('Current focusedGroupIndex:', focusedGroupIndex);

  // Group indices
  const HEADER_GROUP = 0;
  const FILTERS_GROUP = 1;
  const SWIMLANE_GROUP = 2;

  // Header group focus
  const [headerFocusedIndex, setHeaderFocusedIndex] = useState(0);

  // Filters group focus
  const filtersMemory = getGroupFocusMemory(FILTERS_GROUP);
  const [filtersFocusedIndex, setFiltersFocusedIndex] = useState(filtersMemory.focusedIndex ?? 0);

  // Swimlane group focus
  const swimlaneMemory = getGroupFocusMemory(SWIMLANE_GROUP);
  const [swimlaneFocusedIndex, setSwimlaneFocusedIndex] = useState(swimlaneMemory.focusedIndex ?? 0);

  const navigate = useNavigate();

  const handleChannelSelect = (channel) => {
    navigate(`/channel-info/${channel.id}`, {
      state: { fromHome: true }
    });
  };

  // Sync DOM focus with app focus for all groups
  useEffect(() => {
    if (focusedGroupIndex === HEADER_GROUP) {
      if (headerFocusedIndex === 0) {
        console.log('Focusing searchRef');
        searchRef.current?.focus();
      }
      if (headerFocusedIndex === 1) {
        console.log('Focusing infoRef');
        infoRef.current?.focus();
      }
    } else if (focusedGroupIndex === FILTERS_GROUP) {
      console.log('Focusing filterRefs', filtersFocusedIndex);
      filterRefs.current[filtersFocusedIndex]?.focus();
    } else if (focusedGroupIndex === SWIMLANE_GROUP) {
      console.log('Focusing cardRefs', swimlaneFocusedIndex);
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
              onKeyDown={e => {
                if (e.key === 'ArrowRight') {
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
          renderItem={(filter, i, focused) => (
            <Button
              ref={el => { filterRefs.current[i] = el; }}
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
              }}
            >
              {filter.label}
            </Button>
          )}
          focused={focusedGroupIndex === FILTERS_GROUP}
          focusedIndex={filtersFocusedIndex}
          onSelect={(filter, i) => {
            setActiveFilterId(filter.id);
            setFiltersFocusedIndex(i);
            setGroupFocusMemory(FILTERS_GROUP, { focusedIndex: i });
          }}
          onFocusChange={(index) => {
            setFiltersFocusedIndex(index);
            setGroupFocusMemory(FILTERS_GROUP, { focusedIndex: index });
          }}
          leftPadding={getSidePadding()}
          rightPadding={getSidePadding()}
          ensureActiveVisible={true}
          activeIndex={tvHomeFilters.findIndex(f => f.id === activeFilterId)}
        />

        {/* Swimlane group */}
        <FixedSwimlane
          items={fakeChannels}
          renderItem={(channel, i, focused) => (
            <KeyboardWrapper
              key={channel.id}
              onSelect={() => handleChannelSelect(channel)}
              selectData={channel}
              ref={el => { cardRefs.current[i] = el; }}
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