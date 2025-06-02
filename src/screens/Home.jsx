import React, { useRef, useState, useEffect } from 'react';
import KeyboardWrapper from '../components/KeyboardWrapper';
import { ChannelCard, Button } from '@smtv/tv-component-library';
import '@smtv/tv-component-library/dist/style.css';
import '../styles/App.css';
import AdBanner from '../components/AdBanner';
import { MagnifyingGlass, Info } from 'stingray-icons';
import stingrayMusicLogo from '../assets/svg/stingrayMusic.svg';
import { TRANS_BTN_ICON_SIZE } from '../constants/ui';
import ChannelInfo from './ChannelInfo';
import FixedSwimlane from '../components/FixedSwimlane';
import { fakeChannels } from '../data/fakeChannels';
import VariableSwimlane from '../components/VariableSwimlane';
import { genreFilters } from '../data/genreFilters';
import { homeFilters } from '../data/homeFilters';
import { useFocusNavigation } from '../contexts/FocusNavigationContext';
import { getSidePadding } from '../utils/ui';

function Home({ onChannelSelect }) {
  // Refs for header buttons
  const searchRef = useRef(null);
  const infoRef = useRef(null);

  // Use navigation context for vertical group focus
  const {
    focusedGroupIndex,
    moveFocusUp,
    moveFocusDown,
    getGroupFocusMemory,
    setGroupFocusMemory,
    setGroupCount
  } = useFocusNavigation();

  // Track active filter for the filter swimlane
  const [activeFilterId, setActiveFilterId] = useState(homeFilters[0]?.id);

  // Focus memory for each group
  const [headerFocusedIndex, setHeaderFocusedIndex] = useState(getGroupFocusMemory(0).focusedIndex ?? 0);
  const [hasVisitedHeader, setHasVisitedHeader] = useState(false);
  const [filtersFocusedIndex, setFiltersFocusedIndex] = useState(getGroupFocusMemory(1).focusedIndex);
  const [swimlaneFocusedIndex, setSwimlaneFocusedIndex] = useState(getGroupFocusMemory(2).focusedIndex);

  // Set group count dynamically
  const groups = [
    {
      type: 'header',
      render: () => (
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
              focused={focusedGroupIndex === 0 && headerFocusedIndex === 0}
              onFocus={() => {
                setHeaderFocusedIndex(0);
                setGroupFocusMemory(0, { focusedIndex: 0 });
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
              focused={focusedGroupIndex === 0 && headerFocusedIndex === 1}
              onFocus={() => {
                setHeaderFocusedIndex(1);
                setGroupFocusMemory(0, { focusedIndex: 1 });
              }}
            />
          </div>
        </div>
      )
    },
    {
      type: 'filters',
      render: () => (
        <VariableSwimlane
          items={homeFilters}
          renderItem={(filter, i, focused) => (
            <Button
              key={filter.id}
              variant={filter.id === activeFilterId ? 'primary' : 'secondary'}
              size="medium"
              focused={focused}
              onClick={() => setActiveFilterId(filter.id)}
              aria-label={filter.label}
            >
              {filter.label}
            </Button>
          )}
          focused={focusedGroupIndex === 1}
          focusedIndex={filtersFocusedIndex}
          onSelect={(filter) => setActiveFilterId(filter.id)}
          onFocusChange={(index) => {
            setFiltersFocusedIndex(index);
            setGroupFocusMemory(1, { focusedIndex: index });
          }}
          sidePadding={getSidePadding()}
        />
      )
    },
    {
      type: 'swimlane',
      render: () => (
        <FixedSwimlane
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
          focused={focusedGroupIndex === 2}
          focusedIndex={swimlaneFocusedIndex}
          onFocusChange={(index) => {
            setSwimlaneFocusedIndex(index);
            setGroupFocusMemory(2, { focusedIndex: index });
          }}
          onSelect={onChannelSelect}
          sidePadding={getSidePadding()}
        />
      )
    }
  ];

  useEffect(() => {
    setGroupCount(groups.length);
  }, [setGroupCount, groups.length]);

  // When a group regains focus, restore the last focused index
  useEffect(() => {
    if (focusedGroupIndex === 0) {
      if (!hasVisitedHeader) {
        searchRef.current?.focus();
        setHeaderFocusedIndex(0);
        setGroupFocusMemory(0, { focusedIndex: 0 });
        setHasVisitedHeader(true);
      } else {
        if (headerFocusedIndex === 0) {
          searchRef.current?.focus();
        } else if (headerFocusedIndex === 1) {
          infoRef.current?.focus();
        }
      }
    } else if (focusedGroupIndex === 1) {
      setFiltersFocusedIndex(getGroupFocusMemory(1).focusedIndex);
    } else if (focusedGroupIndex === 2) {
      setSwimlaneFocusedIndex(getGroupFocusMemory(2).focusedIndex);
    }
  }, [focusedGroupIndex, hasVisitedHeader, headerFocusedIndex, setGroupFocusMemory, getGroupFocusMemory]);

  // Blur header buttons when leaving header group to remove focus ring
  useEffect(() => {
    if (focusedGroupIndex !== 0) {
      searchRef.current?.blur();
      infoRef.current?.blur();
    }
  }, [focusedGroupIndex]);

  // Header action buttons horizontal navigation
  useEffect(() => {
    if (focusedGroupIndex !== 0) return;
    const handleHeaderKeyDown = (e) => {
      if (e.key === 'ArrowRight' && headerFocusedIndex === 0) {
        setHeaderFocusedIndex(1);
        setGroupFocusMemory(0, { focusedIndex: 1 });
        infoRef.current?.focus();
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' && headerFocusedIndex === 1) {
        setHeaderFocusedIndex(0);
        setGroupFocusMemory(0, { focusedIndex: 0 });
        searchRef.current?.focus();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleHeaderKeyDown);
    return () => window.removeEventListener('keydown', handleHeaderKeyDown);
  }, [focusedGroupIndex, headerFocusedIndex, setGroupFocusMemory]);

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
      <div
        className="main-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xxl)',
          height: 'calc(100vh - 150px)',
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
        }}
      >
        {groups.map((group, i) => (
          <React.Fragment key={group.type}>
            {group.render()}
          </React.Fragment>
        ))}
      </div>
      <AdBanner />
    </div>
  );
}

export default Home;