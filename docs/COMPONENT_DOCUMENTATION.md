# TV App Component Documentation

## Overview

This document catalogs the reusable components used in our TV application and their integration with our custom keyboard navigation system.

## Architecture Principles

### Navigation Philosophy

- **Vertical Group Navigation**: Managed by `GroupFocusNavigationContext`
- **Horizontal Navigation**: Handled by individual components (swimlanes, button groups)
- **Focus Memory**: Persistent per-screen using `ScreenMemoryContext`
- **TV-Optimized**: Designed for remote control and 10ft viewing distance

### Component Responsibilities

- **Components**: Handle their own horizontal navigation and focus states
- **Screens**: Manage vertical navigation between component groups using array-based definitions
- **Contexts**: Provide navigation state management and focus memory

## Core Navigation Components

### FixedSwimlane

**Purpose**: Horizontal scrolling container for fixed-width items (e.g., channel cards)

**Features**:

- Fixed card width (300px) with consistent spacing
- Dynamic viewport measurement for responsive layouts
- Built-in horizontal keyboard navigation (left/right arrows)
- Focus memory and restoration
- Smooth scrolling animations with parking logic

**Props**:

```jsx
{
  items: Array,           // Items to display
  renderItem: Function,   // (item, index, focused) => JSX
  focused: Boolean,       // Is this swimlane currently focused?
  focusedIndex: Number,   // Which item is focused
  onFocusChange: Function,// (index) => void
  onSelect: Function,     // (item, index) => void
  width: String,          // '100%' | '1200px' etc.
  sidePadding: Number,    // Left/right padding in px
  maxItems: Number,       // Limit displayed items
  fallbackItem: JSX       // Displayed when no items
}
```

**Example**:

```jsx
<FixedSwimlane
  items={channels}
  renderItem={(channel, i, focused) => (
    <ChannelCard
      title={channel.title}
      thumbnailUrl={channel.thumbnailUrl}
      focused={focused}
      onClick={() => onChannelSelect(channel)}
    />
  )}
  focused={focusedGroupIndex === SWIMLANE_GROUP}
  focusedIndex={swimlaneFocusedIndex}
  onFocusChange={setSwimlaneFocusedIndex}
  onSelect={onChannelSelect}
  sidePadding={getSidePadding()}
/>
```

### VariableSwimlane

**Purpose**: Horizontal scrolling container for variable-width items (e.g., filter buttons)

**Features**:

- Dynamic item width measurement
- Automatic "More" item when content exceeds available space
- Built-in horizontal keyboard navigation
- Responsive width calculation
- Focus memory and restoration

**Props**:

```jsx
{
  items: Array,              // Items to display
  renderItem: Function,      // (item, index, focused) => JSX
  renderMoreItem: Function,  // (focused) => JSX (optional)
  focused: Boolean,          // Is this swimlane currently focused?
  focusedIndex: Number,      // Which item is focused
  onFocusChange: Function,   // (index) => void
  onSelect: Function,        // (item, index) => void
  width: String,             // '100%' | '80%' etc.
  sidePadding: Number,       // Left/right padding in px
  maxContentWidthRatio: Number // Max content width vs viewport
}
```

**Example**:

```jsx
<VariableSwimlane
  items={filters}
  renderItem={(filter, i, focused) => (
    <Button
      variant={filter.active ? 'primary' : 'secondary'}
      focused={focused}
      onClick={() => setActiveFilter(filter.id)}
    >
      {filter.label}
    </Button>
  )}
  focused={focusedGroupIndex === FILTERS_GROUP}
  focusedIndex={filtersFocusedIndex}
  onFocusChange={setFiltersFocusedIndex}
  onSelect={handleFilterSelect}
  sidePadding={getSidePadding()}
/>
```

### KeyboardWrapper

**Purpose**: Adds keyboard navigation to any child component

**Features**:

- Wraps any component to make it TV-navigable
- Supports all arrow keys plus Enter/Space
- Maintains proper ref forwarding
- Does not interfere with child component behavior

**Props**:

```jsx
{
  children: ReactNode,    // Component to wrap
  onEnter: Function,      // (event) => void
  onUp: Function,         // (event) => void
  onDown: Function,       // (event) => void
  onLeft: Function,       // (event) => void
  onRight: Function,      // (event) => void
  onEscape: Function,     // (event) => void
  tabIndex: Number        // Default: 0
}
```

**Example**:

```jsx
<KeyboardWrapper onEnter={handleSelect} onUp={handleVerticalNav} onDown={handleVerticalNav}>
  <ChannelCard title="Channel 1" focused={focused} onClick={handleSelect} />
</KeyboardWrapper>
```

## Layout Components

### VerticalScrollPadding

**Purpose**: Adds vertical space for overlay-aware scrolling

**Features**:

- Ensures bottom content can scroll above overlays
- Uses global `AD_BANNER_HEIGHT` constant
- Reads spacing from CSS design tokens
- Prevents focus events with `pointer-events: none`

**Props**:

```jsx
{
  spacingXXL: Number; // Additional spacing in px
}
```

**Example**:

```jsx
<VerticalScrollPadding spacingXXL={getSpacingXXL()} />
```

### AdBanner

**Purpose**: Fixed overlay at bottom of screen

**Features**:

- Uses global `AD_BANNER_HEIGHT` constant
- Positioned absolutely at bottom
- High z-index for overlay behavior

## External Components

### Button (from @smtv/tv-component-library)

**Purpose**: TV-optimized interactive buttons

**Variants**:

- `primary`: Main action buttons
- `secondary`: Secondary actions, filters
- `transparent`: Icon-only or minimal buttons

**Key Features**:

- Built-in focus states optimized for TV
- Icon support with consistent sizing
- Proper accessibility attributes

### ChannelCard (from @smtv/tv-component-library)

**Purpose**: Displays channel information with thumbnail

**Features**:

- Square aspect ratio thumbnails
- Focus ring around thumbnail only
- 2-line text labels
- TV-optimized sizing and spacing

## Navigation Patterns

### Array-Based Group Definition

**Best Practice**: Define navigation groups as an array for scalability

```jsx
const groups = [
  {
    type: 'header',
    render: () => <Header ... />
  },
  {
    type: 'filters',
    render: () => <VariableSwimlane ... />
  },
  {
    type: 'content',
    render: () => <FixedSwimlane ... />
  }
];

// Set group count dynamically
useEffect(() => {
  setGroupCount(groups.length);
}, [setGroupCount, groups.length]);

// Render groups
return (
  <div>
    {groups.map((group, i) => (
      <div key={group.type}>
        {group.render()}
      </div>
    ))}
  </div>
);
```

### Screen-Level Navigation Implementation

```jsx
function MyScreen() {
  const {
    focusedGroupIndex,
    setGroupCount,
    moveFocusUp,
    moveFocusDown,
    getGroupFocusMemory,
    setGroupFocusMemory,
  } = useFocusNavigation();

  // Define groups
  const groups = [
    /* ... */
  ];

  // Set group count
  useEffect(() => {
    setGroupCount(groups.length);
  }, [setGroupCount, groups.length]);

  // Handle vertical navigation
  useEffect(() => {
    const handleKeyDown = e => {
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

  // Render groups...
}
```

## Utility Functions

### getSidePadding()

**Purpose**: Reads screen side padding from CSS design tokens
**Location**: `src/utils/layout.js`
**Usage**: Consistent horizontal spacing for swimlanes

```jsx
import { getSidePadding } from '../utils/layout';

<FixedSwimlane sidePadding={getSidePadding()} ... />
```

### getSpacingXXL()

**Purpose**: Reads extra-large spacing from CSS design tokens
**Usage**: Consistent vertical spacing for scroll padding

## Design System Integration

### Constants

- `AD_BANNER_HEIGHT`: Global overlay height (150px)
- `TRANS_BTN_ICON_SIZE`: Consistent icon sizing for transparent buttons

### CSS Design Tokens

- `--screen-side-padding`: Horizontal safe area
- `--spacing-xxl`: Large vertical spacing
- Component library tokens for colors, typography, focus states

### TV-Specific Considerations

- 1920x1080 fixed viewport
- 10ft viewing distance optimization
- Remote control navigation patterns
- Clear focus indicators with scaling/rings
- Overlay-aware scrolling

## Testing Guidelines

### Component Testing

- Unit tests for navigation logic
- Focus state verification
- Keyboard event handling
- Accessibility compliance

### Integration Testing

- Cross-component navigation flow
- Focus memory restoration
- Screen transition handling
- Overlay behavior verification

## Best Practices

### Component Development

1. **Copy working patterns** from existing components
2. **Test keyboard navigation** immediately after changes
3. **Use consistent prop patterns** (focused, focusedIndex, onFocusChange)
4. **Follow TV UX guidelines** from `TV_NAVIGATION_PATTERNS.md`

### Navigation Implementation

1. **Start with array-based group definition**
2. **Use contexts for state management**
3. **Separate horizontal and vertical navigation concerns**
4. **Always implement focus memory**

### Performance

1. **Use React.memo** for frequently re-rendered components
2. **Optimize scroll calculations** with proper viewport measurement
3. **Implement lazy loading** for large item lists

---

_For detailed navigation patterns and debugging guidance, see `TV_NAVIGATION_PATTERNS.md`_
_For specific component design decisions, see `KEYBOARD_WRAPPER_DESIGN.md`_
