import React, { useRef, useState, useEffect } from 'react';
import { ChannelCard, Button } from '@smtv/tv-component-library';
import '@smtv/tv-component-library/dist/style.css';
import '../styles/App.css';
import CategoryCard from '../components/CategoryCard';
import AdBanner from '../components/AdBanner';
import FixedSwimlane from '../components/FixedSwimlane';
import { fakeChannels } from '../data/fakeChannels';
import KeyboardWrapper from '../components/KeyboardWrapper';
import VariableSwimlane from '../components/VariableSwimlane';
import { browseFilters } from '../data/browseFilters';
import { genreFilters } from '../data/genreFilters';
import { generateFakeSearchResults } from '../data/fakeSearchResults';
import { fakeBrowseCategories, getCategoriesForFilter } from '../data/fakeBrowseCategories';
import { useFocusNavigation } from '../contexts/GroupFocusNavigationContext';
import { getSidePadding } from '../utils/layout';
import { useScreenMemory } from '../contexts/ScreenMemoryContext';
import { useNavigate } from 'react-router-dom';
import SearchField from '../components/SearchField';

function SearchBrowse() {
  // Search state management
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Browse mode state
  const [activeBrowseFilter, setActiveBrowseFilter] = useState('genre'); // genre, activity, mood, era, theme

  // Get current browse categories based on active filter
  const currentBrowseCategories = getCategoriesForFilter(activeBrowseFilter);

  // Dynamic filters based on mode
  const searchResultFilters = isSearchMode
    ? [
        { id: 'channels', label: `Channels (${(searchResults.channels || []).length})` },
        { id: 'artists', label: `Artists (${(searchResults.artists || []).length})` },
        { id: 'radio', label: `Radio (${(searchResults.radio || []).length})` },
        { id: 'vibes', label: `Vibes (${(searchResults.vibes || []).length})` },
      ].filter(filter => searchResults[filter.id] && searchResults[filter.id].length > 0)
    : [];

  // Show main browse filters in browse mode, search filters in search mode
  const currentFilters = isSearchMode ? searchResultFilters : browseFilters;

  // Persistent screen memory for activeFilterId
  const { memory, setField } = useScreenMemory('search-browse');
  const activeFilterId = memory.activeFilterId || currentFilters[0]?.id;
  const setActiveFilterId = id => setField('activeFilterId', id);

  // Refs for each group
  const searchRef = useRef(null);
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

  // Header group focus - only search field
  const [headerFocusedIndex, setHeaderFocusedIndex] = useState(0);

  // Track whether user has navigated horizontally within filters during this session
  const [hasNavigatedFiltersHorizontally, setHasNavigatedFiltersHorizontally] = useState(false);

  // Calculate the index of the currently active filter for initial positioning
  const activeFilterIndex = currentFilters.findIndex(f => f.id === activeFilterId);
  const safeActiveFilterIndex = activeFilterIndex >= 0 ? activeFilterIndex : 0;

  // Filters group focus - UX LOGIC: same as Home.jsx
  const filtersMemory = getGroupFocusMemory(FILTERS_GROUP);
  const [filtersFocusedIndex, setFiltersFocusedIndex] = useState(
    hasNavigatedFiltersHorizontally
      ? (filtersMemory.focusedIndex ?? safeActiveFilterIndex)
      : safeActiveFilterIndex
  );

  // Swimlane group focus - use screen-specific memory and always start at 0
  // This ensures SearchBrowse swimlane is independent from Home swimlane
  const [swimlaneFocusedIndex, setSwimlaneFocusedIndex] = useState(0);

  const navigate = useNavigate();

  // Search logic - trigger search on 2nd character
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = generateFakeSearchResults(searchQuery);
      setSearchResults(results);
      setIsSearchMode(true);

      // Set active filter to first category with results
      const firstCategoryWithResults = Object.keys(results).find(
        key => results[key] && results[key].length > 0
      );
      if (firstCategoryWithResults) {
        setActiveFilterId(firstCategoryWithResults);
      }
    } else if (searchQuery.length === 0) {
      // Clear search - return to browse mode
      setSearchResults({});
      setIsSearchMode(false);
      setActiveFilterId(browseFilters[0]?.id);
    }
  }, [searchQuery]);

  // Reset filter and swimlane focus when switching modes or active browse filter
  useEffect(() => {
    setFiltersFocusedIndex(0);
    setHasNavigatedFiltersHorizontally(false);
    // Always reset swimlane to first item when mode or active browse filter changes
    setSwimlaneFocusedIndex(0);
  }, [isSearchMode, activeFilterId, activeBrowseFilter]);

  const handleChannelSelect = channel => {
    navigate(`/channel-info/${channel.id}`, {
      state: { fromSearchBrowse: true },
    });
  };

  const handleCategorySelect = category => {
    // TODO: Navigate to category details screen
    console.log('Selected category:', category);
  };

  // Handle horizontal navigation state tracking
  const handleFilterHorizontalNavigation = newIndex => {
    setFiltersFocusedIndex(newIndex);
    setGroupFocusMemory(FILTERS_GROUP, { focusedIndex: newIndex });

    if (!hasNavigatedFiltersHorizontally) {
      setHasNavigatedFiltersHorizontally(true);
    }
  };

  // Get display items
  const getDisplayItems = () => {
    if (isSearchMode) {
      return searchResults[activeFilterId] || [];
    } else {
      // In browse mode, return categories for the selected browse filter
      return currentBrowseCategories || [];
    }
  };

  const displayItems = getDisplayItems();

  // Sync DOM focus with app focus for all groups
  useEffect(() => {
    if (focusedGroupIndex === HEADER_GROUP) {
      searchRef.current?.focus();
    } else if (focusedGroupIndex === FILTERS_GROUP && currentFilters.length > 0) {
      filterRefs.current[filtersFocusedIndex]?.focus();
    } else if (focusedGroupIndex === SWIMLANE_GROUP) {
      cardRefs.current[swimlaneFocusedIndex]?.focus();
    }
  }, [focusedGroupIndex, filtersFocusedIndex, swimlaneFocusedIndex, currentFilters.length]);

  // Blur header elements when leaving header group
  useEffect(() => {
    if (focusedGroupIndex !== HEADER_GROUP) {
      searchRef.current?.blur();
    }
  }, [focusedGroupIndex]);

  // Auto-focus search field on mount and reset swimlane to start
  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
    // Always start with first item in swimlane when entering this screen
    setSwimlaneFocusedIndex(0);
  }, []);

  return (
    <>
      <div
        className="search-browse-content"
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
        {/* Header group - only search field */}
        <div
          className="search-browse-header"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding:
              'var(--screen-side-padding) var(--screen-side-padding) 0 var(--screen-side-padding)',
            minHeight: 184,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ width: '100%' }}>
            <SearchField
              ref={searchRef}
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              focused={focusedGroupIndex === HEADER_GROUP}
              onFocus={() => {
                setHeaderFocusedIndex(0);
                setGroupFocusMemory(HEADER_GROUP, { focusedIndex: 0 });
              }}
              onKeyDown={e => {
                if (e.key === 'ArrowDown') {
                  moveFocusDown();
                  e.preventDefault();
                }
              }}
            />
          </div>
        </div>

        {/* Filters group - only show if there are filters to display */}
        {currentFilters.length > 0 && (
          <VariableSwimlane
            items={currentFilters}
            renderItem={(filter, i, focused) => (
              <Button
                ref={el => {
                  filterRefs.current[i] = el;
                }}
                key={filter.id}
                variant={
                  isSearchMode
                    ? filter.id === activeFilterId
                      ? 'primary'
                      : 'secondary'
                    : filter.id === activeBrowseFilter
                      ? 'primary'
                      : 'secondary'
                }
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
              if (isSearchMode) {
                setActiveFilterId(filter.id);
              } else {
                // In browse mode, set the active browse filter
                setActiveBrowseFilter(filter.id);
              }
              handleFilterHorizontalNavigation(i);
            }}
            onFocusChange={index => {
              handleFilterHorizontalNavigation(index);
            }}
            leftPadding={getSidePadding()}
            rightPadding={getSidePadding()}
            ensureActiveVisible={true}
            activeIndex={
              isSearchMode
                ? currentFilters.findIndex(f => f.id === activeFilterId)
                : currentFilters.findIndex(f => f.id === activeBrowseFilter)
            }
          />
        )}

        {/* Swimlane group */}
        {displayItems.length > 0 && (
          <FixedSwimlane
            items={displayItems}
            renderItem={(item, i, focused) => (
              <KeyboardWrapper
                key={item.id}
                onSelect={() =>
                  isSearchMode ? handleChannelSelect(item) : handleCategorySelect(item)
                }
                selectData={item}
                ref={el => {
                  cardRefs.current[i] = el;
                }}
                onUp={moveFocusUp}
                onDown={moveFocusDown}
              >
                {isSearchMode ? (
                  <ChannelCard
                    title={item.title || item.name || 'Unknown'}
                    thumbnailUrl={item.thumbnailUrl}
                    focused={focused}
                    onClick={() => handleChannelSelect(item)}
                  />
                ) : (
                  <CategoryCard
                    title={item.name || 'Unknown Category'}
                    thumbnailUrl={item.thumbnailUrl}
                    focused={focused}
                    onClick={() => handleCategorySelect(item)}
                  />
                )}
              </KeyboardWrapper>
            )}
            maxItems={24}
            fallbackItem={<div>No content available</div>}
            focused={focusedGroupIndex === SWIMLANE_GROUP}
            focusedIndex={swimlaneFocusedIndex}
            onFocusChange={index => {
              setSwimlaneFocusedIndex(index);
              // Don't store in global group memory - keep SearchBrowse swimlane independent
            }}
            leftPadding={getSidePadding()}
            rightPadding={getSidePadding()}
          />
        )}

        {/* Empty state when no results */}
        {displayItems.length === 0 && isSearchMode && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              fontSize: '32px',
              color: '#FAFAFA',
              opacity: 0.7,
            }}
          >
            No results found for "{searchQuery}"
          </div>
        )}

        {/* Empty state for browse mode */}
        {displayItems.length === 0 && !isSearchMode && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              fontSize: '32px',
              color: '#FAFAFA',
              opacity: 0.7,
            }}
          >
            No categories available
          </div>
        )}
      </div>

      {/* Ad banner is outside the navigation context and not focusable */}
      <AdBanner />
    </>
  );
}

export default SearchBrowse;
