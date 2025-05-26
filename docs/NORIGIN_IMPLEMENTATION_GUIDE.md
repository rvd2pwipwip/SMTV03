# Norigin Spatial Navigation Implementation Guide

## Overview
This guide documents the step-by-step process of implementing Norigin Spatial Navigation in a TV application, including common mistakes and their solutions.

## Table of Contents
1. [Basic Setup](#basic-setup)
2. [Common Mistakes](#common-mistakes)
3. [Correct Implementation](#correct-implementation)
4. [How It Works](#how-it-works)
5. [Next Steps](#next-steps)

## Basic Setup

### 1. Installation
```bash
npm install @noriginmedia/norigin-spatial-navigation
```

### 2. Initialization
In your main application file (e.g., `src/main.jsx`):
```jsx
import { init } from '@noriginmedia/norigin-spatial-navigation';

// Initialize spatial navigation
init({
  debug: false,
  visualDebug: false
});
```

### 3. Required Imports
```jsx
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
```

## Common Mistakes

### 1. Incorrect Import Path
❌ **Wrong:**
```jsx
import { Focusable } from '@noriginmedia/norigin-spatial-navigation/src/components/Focusable';
```

✅ **Correct:**
```jsx
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
```

### 2. Using Focusable Component
❌ **Wrong:**
```jsx
<Focusable focusKey={swimlaneFocusKey} ref={swimlaneRef}>
  <div className="content-swimlane">
    {/* content */}
  </div>
</Focusable>
```

✅ **Correct:**
```jsx
<div className="content-swimlane" ref={swimlaneRef} data-focus-key={swimlaneFocusKey}>
  {/* content */}
</div>
```

### 3. Incorrect Prop Usage
❌ **Wrong:**
```jsx
<div className="content-swimlane" ref={swimlaneRef} focusKey={swimlaneFocusKey}>
```

✅ **Correct:**
```jsx
<div className="content-swimlane" ref={swimlaneRef} data-focus-key={swimlaneFocusKey}>
```

## Correct Implementation

### Basic Component Structure
```jsx
function Home() {
  // Root level focus context
  const { ref, focusKey } = useFocusable();
  
  // Swimlane focus context
  const { ref: swimlaneRef, focusKey: swimlaneFocusKey } = useFocusable();

  return (
    <FocusContext.Provider value={{ focusKey }}>
      <div className="app" ref={ref}>
        <Header title="TV App" />
        <div className="content-swimlane" 
             ref={swimlaneRef} 
             data-focus-key={swimlaneFocusKey}>
          {/* Channel cards or other content */}
        </div>
      </div>
    </FocusContext.Provider>
  );
}
```

## How It Works

### 1. Focusable Elements
- Each focusable element needs its own `useFocusable` hook instance
- The hook returns:
  - `ref`: Used to attach to DOM elements
  - `focusKey`: A unique identifier for the focusable element

### 2. Focus Hierarchy
- `FocusContext.Provider` establishes a focus hierarchy
- Parent elements provide focus context to their children
- Focus moves naturally through the hierarchy

### 3. Focus Management
- `data-focus-key` tells Norigin which elements can receive focus
- The system automatically handles:
  - Focus movement between elements
  - Focus restoration
  - Focus tree hierarchy

## Key Learning Points

1. **Hook Usage**
   - Always use `useFocusable` hook instead of importing `Focusable` component
   - Each focusable element needs its own hook instance

2. **DOM Attributes**
   - Use `data-focus-key` for DOM elements, not `focusKey` prop
   - This follows React's convention for custom DOM attributes

3. **Focus Hierarchy**
   - Maintain proper focus hierarchy with `FocusContext.Provider`
   - Parent elements should provide context to their children

4. **Focus Management**
   - The system handles focus movement automatically
   - Focus restoration works out of the box
   - Focus tree hierarchy is maintained automatically

## Next Steps

### 1. Add Focus Styles
```css
.focused {
  transform: scale(1.05);
  box-shadow: 0 0 0 2px var(--color-primary);
  transition: all 0.2s ease-in-out;
}
```

### 2. Set Initial Focus
```jsx
const { ref, focusKey, focusSelf } = useFocusable();

useEffect(() => {
  focusSelf();
}, []);
```

### 3. Implement Focus Movement
- Add focus handlers to channel cards
- Implement directional navigation
- Handle focus restoration

## ChannelCard Integration Plan

### Overview
This section outlines the implementation plan for integrating Norigin Spatial Navigation with the existing ChannelCard component from `@smtv/tv-component-library`.

### Implementation Steps

1. **Initial Focus Setup**
   - Add `focusSelf` to the root level focus context
   - Create an `useEffect` hook to set initial focus on the first ChannelCard
   - Ensure focus restoration works after navigation

2. **Mouse Navigation Integration**
   - Since ChannelCard already handles mouse clicks, we need to:
     - Ensure mouse hover events don't interfere with keyboard focus
     - Maintain the existing click-to-focus behavior
     - Test the interaction between mouse and keyboard navigation

3. **Focus Management**
   - Add proper focus movement between cards
   - Implement directional navigation (up/down/left/right)
   - Handle edge cases (first/last items)
   - Ensure focus state is properly synchronized between Norigin and ChannelCard

4. **Testing Requirements**
   - Verify initial focus works on app load
   - Test that ChannelCard's existing focus ring appears with keyboard navigation
   - Validate mouse click behavior still works as expected
   - Check focus restoration after navigation
   - Test edge cases and error states

### Key Points
- ChannelCard has existing focus ring implementation
- Focus on proper integration rather than style implementation
- Maintain existing mouse click behavior
- Ensure smooth transition between mouse and keyboard navigation

## Troubleshooting

### Common Issues
1. **Focus Not Working**
   - Check if `data-focus-key` is properly set
   - Verify focus hierarchy with `FocusContext.Provider`
   - Ensure proper ref attachment

2. **Focus Styles Not Showing**
   - Verify CSS selectors
   - Check if focus state is being applied
   - Ensure proper CSS specificity

3. **Focus Movement Issues**
   - Verify focus hierarchy
   - Check for missing `data-focus-key` attributes
   - Ensure proper focus context

## Best Practices

1. **Component Structure**
   - Keep focus hierarchy shallow
   - Use meaningful focus keys
   - Maintain consistent focus patterns

2. **Performance**
   - Minimize focusable elements
   - Use proper focus restoration
   - Implement lazy loading for large lists

3. **Accessibility**
   - Ensure clear focus indicators
   - Maintain proper focus order
   - Support keyboard navigation

## Resources
- [Norigin Spatial Navigation Documentation](https://github.com/NoriginMedia/Norigin-Spatial-Navigation)
- [TV App Best Practices](https://www.w3.org/TR/2016/REC-html51-20161101/)
- [React Focus Management](https://react.dev/learn/managing-state)

## Successful Implementation Example

### Working ChannelCard Navigation
```jsx
import React, { useEffect } from 'react';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { ChannelCard } from '@smtv/tv-component-library';

function Home() {
  // Card focus contexts first, focusSelf for setting initial focus
  const { ref: card1Ref, focusKey: card1FocusKey, focusSelf: focusCard1 } = useFocusable({
    focusable: true,
    onFocus: () => {
      setTimeout(() => {
        card1Ref.current?.focus();
      }, 0);
    }
  });
  const { ref: card2Ref, focusKey: card2FocusKey } = useFocusable({
    focusable: true,
    onFocus: () => {
      setTimeout(() => {
        card2Ref.current?.focus();
      }, 0);
    }
  });
  const { ref: card3Ref, focusKey: card3FocusKey } = useFocusable({
    focusable: true,
    onFocus: () => {
      setTimeout(() => {
        card3Ref.current?.focus();
      }, 0);
    }
  });

  // Root level focus context
  const { ref, focusKey } = useFocusable({
    focusable: false,
    trackChildren: true
  });
  
  // Swimlane focus context
  const { ref: swimlaneRef, focusKey: swimlaneFocusKey } = useFocusable({
    focusable: false,
    trackChildren: true
  });

  // Set initial focus on first card
  useEffect(() => {
    focusCard1();
  }, []);

  return (
    <FocusContext.Provider value={{ focusKey }}>
      <div className="app" ref={ref}>
        <Header title="TV App" />
        <div className="content-swimlane" 
             ref={swimlaneRef} 
             data-focus-key={swimlaneFocusKey}>
          <ChannelCard 
            ref={card1Ref}
            data-focus-key={card1FocusKey}
            title="Sample Channel 1"    
            thumbnailUrl="https://picsum.photos/300/300"
            onSelect={handleChannelSelect}
          />
          {/* Additional ChannelCards */}
        </div>
      </div>
    </FocusContext.Provider>
  );
}
```

### Key Implementation Points

1. **Initialization**
   - Initialize Norigin once in `main.jsx`
   - Do not initialize in component files
   - Example initialization:
   ```jsx
   init({
     debug: true,
     visualDebug: true
   });
   ```

2. **Focus Self Function**
   - Use `focusSelf` to programmatically set focus
   - Important for setting initial focus
   - Example:
   ```jsx
   const { ref, focusKey, focusSelf } = useFocusable();
   useEffect(() => {
     focusSelf();
   }, []);
   ```

3. **Focus Hierarchy**
   - Root and container elements should be `focusable: false`
   - Set `trackChildren: true` for containers
   - Only interactive elements (like cards) should be `focusable: true`

4. **Native Focus Integration**
   - Use `setTimeout` to ensure proper focus timing
   - Example:
   ```jsx
   onFocus: () => {
     setTimeout(() => {
       ref.current?.focus();
     }, 0);
   }
   ```

### Common Pitfalls and Solutions

1. **Multiple Initializations**
   ❌ **Wrong:** Initializing Norigin in multiple components
   ✅ **Correct:** Initialize once in `main.jsx`

2. **Focus Timing**
   ❌ **Wrong:** Setting focus directly in `onFocus`
   ✅ **Correct:** Use `setTimeout` to ensure proper timing

3. **Focus Hierarchy**
   ❌ **Wrong:** Making containers focusable
   ✅ **Correct:** Set `focusable: false` for containers

4. **Initial Focus**
   ❌ **Wrong:** Using `preferredChildFocusKey`
   ✅ **Correct:** Use `focusSelf` with `useEffect` 

## Component Wrapper Pattern

### Overview
When working with third-party components that don't natively support keyboard navigation, we can use a wrapper component pattern to add this functionality without modifying the original component.

### Implementation Example
```jsx
// KeyboardWrapper.jsx
import React from 'react';

export const KeyboardWrapper = ({ onSelect, children, ...props }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSelect) {
      onSelect();
    }
  };

  return (
    <div onKeyDown={handleKeyDown} {...props}>
      {children}
    </div>
  );
};
```

### Usage in Home Component
```jsx
// Home.jsx
import { KeyboardWrapper } from '../components/KeyboardWrapper';
import { ChannelCard } from '@smtv/tv-component-library';

// In the component:
<KeyboardWrapper 
  ref={card1Ref}
  data-focus-key={card1FocusKey}
  data-stable-id="home-card-1"
  onSelect={() => handleCardClick(card1FocusKey, { id: 1, title: "Sample Channel 1" }, 'enter')}
>
  <ChannelCard 
    title="Sample Channel 1"    
    thumbnailUrl="https://picsum.photos/300/300"
    onClick={() => handleCardClick(card1FocusKey, { id: 1, title: "Sample Channel 1" }, 'click')}
  />
</KeyboardWrapper>
```

### Why Use This Pattern?

1. **Separation of Concerns**
   - Keeps third-party components clean
   - Isolates keyboard navigation logic
   - Makes testing easier

2. **Flexibility**
   - Can be used with any component
   - Doesn't require library changes
   - Can be project-specific

3. **Maintainability**
   - Clear separation of responsibilities
   - Easy to update navigation logic
   - Simple to debug

### Best Practices

1. **Keep It Simple**
   - One wrapper, one responsibility
   - Clear naming conventions
   - Good documentation

2. **Proper Prop Forwarding**
   - Use spread operator carefully
   - Handle refs correctly
   - Maintain component API

3. **Performance Considerations**
   - Use React.memo when needed
   - Avoid unnecessary re-renders
   - Keep the wrapper lightweight

### Common Use Cases

1. **Adding Keyboard Navigation**
   - Enter key handling
   - Arrow key navigation
   - Focus management

2. **Cross-Cutting Concerns**
   - Analytics
   - Error boundaries
   - Logging

3. **TV-Specific Features**
   - Spatial navigation
   - Focus management
   - Keyboard controls

### When to Use This Pattern

✅ **Good Cases:**
- Adding keyboard navigation to third-party components
- Implementing TV-specific features
- Adding cross-cutting concerns

❌ **Avoid When:**
- The component can be modified directly
- The wrapper adds too much complexity
- Performance is critical

## Focus Memory System

### Overview
The focus memory system allows screens to remember and restore their last focused item after remounting. This is crucial for TV applications where users expect focus to return to their last position when navigating back to a screen.

### Why Stable IDs?
Norigin generates dynamic focus keys (e.g., `sn:focusable-item-1`) that change on each component remount. This makes it impossible to directly store and restore focus keys. Instead, we use stable IDs that remain constant across remounts.

### Implementation Details

1. **Stable ID Pattern**
   ```jsx
   <KeyboardWrapper
     ref={card1Ref}
     data-focus-key={card1FocusKey}  // Dynamic, from norigin
     data-stable-id="home-card-1"    // Static, from our code
     onSelect={() => handleCardClick(card1FocusKey, { id: 1, title: "Sample Channel 1" }, 'enter')}
   >
   ```

2. **Focus Memory Context**
   ```jsx
   // Stores only stable IDs
   const [focusMemory, setFocusMemory] = useState({
     "home": "home-card-2",    // Last focused stable ID for home screen
     "channelInfo": "info-1"   // Last focused stable ID for channel info screen
   });
   ```

3. **Focus Restoration**
   ```jsx
   // When screen mounts
   useEffect(() => {
     const savedStableId = restoreFocus('home');
     if (savedStableId) {
       const element = document.querySelector(`[data-stable-id="${savedStableId}"]`);
       if (element) {
         const focusKey = element.getAttribute('data-focus-key');
         if (focusKey) {
           setFocus(focusKey);
         }
       }
     }
   }, []);
   ```

### Key Design Decisions

1. **Why Store Only Stable IDs?**
   - Focus keys are dynamic and change on remount
   - Stable IDs provide a reliable reference point
   - Simpler state management
   - More predictable behavior

2. **Why Not Store Both?**
   - Extra complexity without benefit
   - Focus keys would be outdated on remount
   - Stable IDs are sufficient for restoration

3. **Why Use DOM Queries?**
   - Direct access to current focus keys
   - Works with norigin's dynamic key generation
   - Reliable across remounts

### Best Practices

1. **Naming Conventions**
   - Use consistent patterns for stable IDs
   - Include screen name in ID
   - Make IDs descriptive and unique

2. **Focus Management**
   - Save focus before screen transitions
   - Restore focus after screen transitions
   - Handle edge cases (no saved focus)

3. **Testing**
   - Verify focus restoration works
   - Test with different navigation paths
   - Check focus behavior after remounts

### Common Issues and Solutions

1. **Focus Not Restoring**
   - Check if stable ID exists
   - Verify focus key is valid
   - Ensure proper timing of focus restoration

2. **Duplicate Focus Events**
   - Use refs to track mount state
   - Implement proper cleanup
   - Handle focus events carefully

3. **Observer Not Triggering**
   - Check attribute names
   - Verify observer setup
   - Ensure proper cleanup

4. **Content Clipping**
   - Ensure proper padding calculations
   - Check viewport width measurements
   - Verify content width calculations

5. **Performance Issues**
   - Optimize DOM queries
   - Use efficient selectors
   - Implement proper cleanup

6. **Memory Leaks**
   - Always implement cleanup
   - Disconnect observer on unmount
   - Handle edge cases

7. **Focus Management**
   - Ensure focus remains visible
   - Handle edge cases properly
   - Maintain focus hierarchy

### Example Implementation

```jsx
// In App.jsx
const pushScreen = (screen, data = null) => {
  // Save focus before leaving current screen
  const currentScreen = screenStack[screenStack.length - 1];
  const focusedElement = document.querySelector('[data-focus-key]:focus');
  if (focusedElement) {
    const stableId = focusedElement.getAttribute('data-stable-id');
    if (stableId) {
      saveFocus(currentScreen, stableId);
    }
  }
  // ... rest of navigation logic
};

const popScreen = () => {
  // ... save focus logic ...
  
  // Restore focus on the previous screen
  const stableId = restoreFocus(previousScreen);
  if (stableId) {
    const element = document.querySelector(`[data-stable-id="${stableId}"]`);
    if (element) {
      const focusKey = element.getAttribute('data-focus-key');
      if (focusKey) {
        setFocus(focusKey);
      }
    }
  }
};

// In Home.jsx
function Home() {
  // Root level focus context
  const { ref, focusKey } = useFocusable({
    focusable: false,
    trackChildren: true
  });
  
  // Swimlane focus context
  const { ref: swimlaneRef, focusKey: swimlaneFocusKey } = useFocusable({
    focusable: false,
    trackChildren: true
  });

  return (
    <FocusContext.Provider value={{ focusKey }}>
      <div className="app" ref={ref}>
        <Header title="TV App" />
        <SlidingSwimlane>
          <Swimlane ref={swimlaneRef} data-focus-key={swimlaneFocusKey}>
            {/* Channel cards with KeyboardWrapper */}
          </Swimlane>
        </SlidingSwimlane>
      </div>
    </FocusContext.Provider>
  );
}
```

### Future Improvements

1. **Nested Components**
   - Add focus memory for nested components
   - Implement hierarchical focus restoration
   - Handle complex navigation paths

2. **Focus History**
   - Track focus history for each screen
   - Implement undo/redo for focus
   - Add focus navigation shortcuts

3. **Debugging Tools**
   - Add focus state visualization
   - Implement focus logging
   - Create focus debugging tools

## Sliding Behavior Implementation

### Overview
The sliding behavior in the TV app ensures that content swimlanes slide smoothly while maintaining proper padding from the screen edges. This section details how the sliding behavior works and how it handles screen-side-padding.

### Why MutationObserver?

1. **Direct DOM Changes**
   - The spatial navigation library updates the DOM directly
   - It adds/removes the `data-focused` attribute
   - We need to detect these changes reliably

2. **React State Limitations**
   - React's state system doesn't detect DOM changes made by third-party libraries
   - useEffect with dependencies wouldn't catch these changes
   - We need a more direct way to observe DOM changes

3. **Performance Considerations**
   - MutationObserver is more efficient than polling
   - Provides immediate response to changes
   - No unnecessary re-renders

### Implementation Details

1. **Setting up the Observer**
```jsx
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'data-focused') {
      updateOffset();
    }
  });
});
```

2. **What the Observer Watches**
```jsx
const cards = swimlaneRef.current.querySelectorAll('[data-stable-id^="home-card-"]');
cards.forEach(card => {
  observer.observe(card, { attributes: true });
});
```

3. **CSS Setup**
```css
.swimlane-viewport {
  width: 100%;
  overflow: hidden;
  position: relative;
  padding-left: var(--screen-side-padding);
}

.content-swimlane {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: fit-content;
  min-width: 100%;
  gap: var(--spacing-lg);
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: var(--spacing-md) 0;
  position: relative;
  transition: transform 0.3s ease-in-out;
  will-change: transform;
}
```

4. **Offset Calculation**
```jsx
const updateOffset = () => {
  const focusedElement = document.querySelector('[data-focused="true"]');
  if (!focusedElement) return;

  const viewportRect = focusRef.current.getBoundingClientRect();
  const focusedRect = focusedElement.getBoundingClientRect();
  const firstCard = swimlaneRef.current.querySelector('[data-stable-id="home-card-1"]');
  
  if (!firstCard) return;

  const firstCardRect = firstCard.getBoundingClientRect();
  const newOffset = firstCardRect.left - focusedRect.left;

  // Get the total width of the content
  const contentRect = swimlaneRef.current.getBoundingClientRect();
  const contentWidth = contentRect.width;
  const viewportWidth = viewportRect.width;
  
  // Get the CSS variable value for screen-side-padding
  const screenSidePadding = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--screen-side-padding'));

  // Calculate how much the content can slide before reaching the margin
  const maxSlide = contentWidth - viewportWidth + screenSidePadding + screenSidePadding;

  // If the new offset would slide the content beyond the max slide, use the max slide instead
  if (Math.abs(newOffset) > maxSlide) {
    setOffset(-maxSlide);
    return;
  }

  setOffset(newOffset);
};
```

5. **Cleanup**
```jsx
return () => {
  observer.disconnect();
};
```

### Flow of Events
```
User presses arrow key
  ↓
Spatial Navigation Library updates DOM
  ↓
Adds data-focused="true" to new card
  ↓
MutationObserver detects change
  ↓
Calls updateOffset()
  ↓
Calculates new position
  ↓
Updates offset state
  ↓
React re-renders with new transform
```

### How It Works

1. **Screen-Side Padding**
   - The viewport has a left padding defined by `--screen-side-padding` CSS variable
   - This ensures content doesn't touch the screen edge
   - The padding is considered in all calculations

2. **Sliding Behavior**
   - Content slides smoothly using CSS transform
   - The offset is calculated based on the focused element's position
   - The sliding stops when the right edge of content is at the screen-side-padding from the viewport's right edge

3. **Maximum Slide Calculation**
   - Takes into account:
     - Total content width
     - Viewport width
     - Screen-side-padding on both sides
   - Prevents content from sliding beyond the maximum allowed position

### Alternative Approaches Considered

1. **useEffect with Dependencies**
   - Wouldn't detect DOM changes from the library
   - Less reliable for our use case
   - Could miss focus changes

2. **Stable ID + Interval**
   - More "React-like" but less efficient
   - Requires polling
   - Could miss focus changes between checks

3. **Spatial Navigation Events**
   - Might not give same level of control
   - More complex to implement
   - Could require additional state management

### Best Practices

1. **Observer Setup**
   - Watch only necessary attributes
   - Use proper cleanup
   - Handle edge cases

2. **Performance**
   - Use `will-change: transform` for smooth animations
   - Implement proper cleanup of observers
   - Minimize DOM queries
   - Use efficient selectors

3. **Accessibility**
   - Ensure content remains visible during sliding
   - Maintain proper focus indicators
   - Consider screen reader announcements

4. **Responsive Design**
   - Use CSS variables for padding and spacing
   - Consider different screen sizes
   - Maintain consistent behavior across devices

### Common Issues and Solutions

1. **Observer Not Triggering**
   - Check attribute names
   - Verify observer setup
   - Ensure proper cleanup

2. **Content Clipping**
   - Ensure proper padding calculations
   - Check viewport width measurements
   - Verify content width calculations

3. **Performance Issues**
   - Optimize DOM queries
   - Use efficient selectors
   - Implement proper cleanup

4. **Memory Leaks**
   - Always implement cleanup
   - Disconnect observer on unmount
   - Handle edge cases

5. **Focus Management**
   - Ensure focus remains visible
   - Handle edge cases properly
   - Maintain focus hierarchy

### Example Implementation

```jsx
// In App.jsx
const pushScreen = (screen, data = null) => {
  // Save focus before leaving current screen
  const currentScreen = screenStack[screenStack.length - 1];
  const focusedElement = document.querySelector('[data-focus-key]:focus');
  if (focusedElement) {
    const stableId = focusedElement.getAttribute('data-stable-id');
    if (stableId) {
      saveFocus(currentScreen, stableId);
    }
  }
  // ... rest of navigation logic
};

const popScreen = () => {
  // ... save focus logic ...
  
  // Restore focus on the previous screen
  const stableId = restoreFocus(previousScreen);
  if (stableId) {
    const element = document.querySelector(`[data-stable-id="${stableId}"]`);
    if (element) {
      const focusKey = element.getAttribute('data-focus-key');
      if (focusKey) {
        setFocus(focusKey);
      }
    }
  }
};

// In Home.jsx
function Home() {
  // Root level focus context
  const { ref, focusKey } = useFocusable({
    focusable: false,
    trackChildren: true
  });
  
  // Swimlane focus context
  const { ref: swimlaneRef, focusKey: swimlaneFocusKey } = useFocusable({
    focusable: false,
    trackChildren: true
  });

  return (
    <FocusContext.Provider value={{ focusKey }}>
      <div className="app" ref={ref}>
        <Header title="TV App" />
        <SlidingSwimlane>
          <Swimlane ref={swimlaneRef} data-focus-key={swimlaneFocusKey}>
            {/* Channel cards with KeyboardWrapper */}
          </Swimlane>
        </SlidingSwimlane>
      </div>
    </FocusContext.Provider>
  );
}
```

### Future Improvements

1. **Nested Components**
   - Add focus memory for nested components
   - Implement hierarchical focus restoration
   - Handle complex navigation paths

2. **Focus History**
   - Track focus history for each screen
   - Implement undo/redo for focus
   - Add focus navigation shortcuts

3. **Debugging Tools**
   - Add focus state visualization
   - Implement focus logging
   - Create focus debugging tools