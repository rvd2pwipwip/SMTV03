# useRef Deep Dive: From React Concepts to TV Navigation

## Overview

This guide provides a comprehensive understanding of React's `useRef` hook, with special emphasis on its critical role in TV application development. Through practical examples from our TV app, you'll learn when, why, and how to use `useRef` effectively.

## Table of Contents

1. [The Fundamental Problem](#the-fundamental-problem)
2. [useRef vs Vanilla JavaScript](#useref-vs-vanilla-javascript)
3. [TV App Requirements](#tv-app-requirements)
4. [Common useRef Patterns](#common-useref-patterns)
5. [TV-Specific Examples](#tv-specific-examples)
6. [Best Practices & Antipatterns](#best-practices--antipatterns)
7. [Advanced Patterns](#advanced-patterns)
8. [Testing Considerations](#testing-considerations)

---

## The Fundamental Problem

### React's Declarative Philosophy

React is designed around **declarative programming**:

```jsx
// ✅ Declarative: Describe WHAT the UI should look like
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

You describe **what** the UI should look like for any given state, and React figures out **how** to update the DOM.

### When Declarative Isn't Enough

However, some operations require **imperative programming** - telling the computer exactly **how** to do something:

```jsx
// ❌ This won't work - no way to programmatically focus
function SearchField() {
  const [shouldFocus, setShouldFocus] = useState(false);

  return (
    <input
      type="text"
      autoFocus={shouldFocus} // Only works on mount!
    />
  );
}

// ✅ This works - imperative DOM control
function SearchField() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current?.focus(); // Direct DOM manipulation
  };

  return (
    <input
      ref={inputRef}
      type="text"
      onKeyDown={e => {
        if (e.key === 'Escape') {
          inputRef.current?.blur(); // Imperative blur
        }
      }}
    />
  );
}
```

---

## useRef vs Vanilla JavaScript

### The Mental Model Comparison

| **Vanilla JavaScript**              | **React useRef**                       |
| ----------------------------------- | -------------------------------------- |
| `document.getElementById('search')` | `searchRef.current`                    |
| `element.focus()`                   | `ref.current?.focus()`                 |
| `element.scrollIntoView()`          | `ref.current?.scrollIntoView()`        |
| `element.getBoundingClientRect()`   | `ref.current?.getBoundingClientRect()` |

### Code Comparison Example

**Vanilla JavaScript:**

```javascript
// Get DOM elements
const searchButton = document.getElementById('search-button');
const infoButton = document.querySelector('.info-button');

// Focus management
function handleArrowRight() {
  infoButton.focus();
}

// Event handling
searchButton.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') {
    handleArrowRight();
  }
});
```

**React with useRef:**

```jsx
function Header() {
  // Get DOM element references
  const searchRef = useRef(null);
  const infoRef = useRef(null);

  // Focus management
  const handleArrowRight = () => {
    infoRef.current?.focus();
  };

  // Event handling in JSX
  return (
    <Button
      ref={searchRef}
      onKeyDown={e => {
        if (e.key === 'ArrowRight') {
          handleArrowRight();
        }
      }}
    >
      Search
    </Button>
  );
}
```

### Key Differences

1. **Element Selection**:

   - Vanilla: Query the DOM by ID/class
   - React: Attach ref directly to element

2. **Timing**:

   - Vanilla: Elements exist when script runs
   - React: Elements exist after render (use effects)

3. **Integration**:
   - Vanilla: Separate from component logic
   - React: Integrated with component lifecycle

---

## TV App Requirements

### Why TV Apps Need Imperative Control

TV applications have unique requirements that make `useRef` essential:

#### 1. **Remote Control Navigation**

Users can't click with a mouse - they navigate with arrow keys:

```jsx
// TV navigation requires programmatic focus changes
const handleArrowDown = () => {
  nextGroupRef.current?.focus(); // Must imperatively move focus
};
```

#### 2. **Complex Focus Paths**

TV navigation follows 2D spatial logic, not linear tab order:

```jsx
// Example: Grid navigation
const cardRefs = useRef([]);

const handleArrowRight = () => {
  const nextIndex = currentIndex + 1;
  cardRefs.current[nextIndex]?.focus(); // Jump to specific element
};

const handleArrowDown = () => {
  const nextRowIndex = currentIndex + CARDS_PER_ROW;
  cardRefs.current[nextRowIndex]?.focus(); // Jump down a row
};
```

#### 3. **Focus Memory**

TV apps must remember where users were focused when they return to a screen:

```jsx
// Restore focus to remembered position
useEffect(() => {
  const rememberedIndex = getRememberedFocusIndex();
  cardRefs.current[rememberedIndex]?.focus();
}, []);
```

#### 4. **Visual Feedback**

Focus rings and scaling effects require knowing which DOM element is focused:

```jsx
// Sync visual state with actual DOM focus
useEffect(() => {
  if (focusedGroupIndex === SWIMLANE_GROUP) {
    cardRefs.current[swimlaneFocusedIndex]?.focus();
  }
}, [focusedGroupIndex, swimlaneFocusedIndex]);
```

---

## Common useRef Patterns

### 1. DOM Element Access (Primary TV Use Case)

**Single Element Reference:**

```jsx
function SearchButton() {
  const buttonRef = useRef(null);

  return (
    <Button
      ref={buttonRef}
      onKeyDown={e => {
        if (e.key === 'ArrowRight') {
          // Move focus to next element
          nextElementRef.current?.focus();
        }
      }}
    >
      Search
    </Button>
  );
}
```

**Array of Element References:**

```jsx
function ChannelGrid() {
  const cardRefs = useRef([]); // Array for multiple elements

  return (
    <div>
      {channels.map((channel, index) => (
        <ChannelCard
          key={channel.id}
          ref={el => {
            cardRefs.current[index] = el; // Store each ref
          }}
          onKeyDown={e => {
            if (e.key === 'ArrowRight' && index < channels.length - 1) {
              cardRefs.current[index + 1]?.focus();
            }
          }}
        />
      ))}
    </div>
  );
}
```

### 2. Storing Mutable Values (Without Re-renders)

**Timer Management:**

```jsx
function AutoScrollSwimlane() {
  const intervalRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const startAutoScroll = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => prev + 1);
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopAutoScroll(); // Cleanup
  }, []);

  return (
    <div onMouseEnter={stopAutoScroll} onMouseLeave={startAutoScroll}>
      {/* Swimlane content */}
    </div>
  );
}
```

**Previous Value Tracking:**

```jsx
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value; // Store after render
  });

  return ref.current; // Return previous value
}

// Usage in TV navigation
function NavigationLogger() {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const prevFocusedIndex = usePrevious(focusedIndex);

  useEffect(() => {
    if (prevFocusedIndex !== undefined) {
      console.log(`Focus moved from ${prevFocusedIndex} to ${focusedIndex}`);
      // Could trigger scroll animations, sound effects, etc.
    }
  }, [focusedIndex, prevFocusedIndex]);
}
```

### 3. Third-Party Library Integration

**Integrating Non-React Libraries:**

```jsx
function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const playerInstanceRef = useRef(null);

  useEffect(() => {
    // Initialize third-party video player
    playerInstanceRef.current = new TVVideoPlayer(videoRef.current, {
      src,
      controls: false, // TV uses custom controls
    });

    return () => {
      // Cleanup
      playerInstanceRef.current?.destroy();
    };
  }, [src]);

  const handleKeyDown = e => {
    switch (e.key) {
      case 'Enter':
        playerInstanceRef.current?.togglePlay();
        break;
      case 'ArrowLeft':
        playerInstanceRef.current?.seek(-10);
        break;
      case 'ArrowRight':
        playerInstanceRef.current?.seek(10);
        break;
    }
  };

  return <div ref={videoRef} onKeyDown={handleKeyDown} tabIndex={0} />;
}
```

### 4. Performance Optimization (Avoiding Stale Closures)

**Event Handler Optimization:**

```jsx
function OptimizedNavigation() {
  const [activeChannelId, setActiveChannelId] = useState(null);
  const activeChannelRef = useRef(activeChannelId);

  // Keep ref in sync with state
  activeChannelRef.current = activeChannelId;

  // Memoized handler doesn't recreate on every render
  const handleChannelAction = useCallback(() => {
    // Uses current value, not stale closure
    performActionOnChannel(activeChannelRef.current);
  }, []); // Empty dependency array is safe

  return (
    <div>
      {channels.map(channel => (
        <ChannelCard
          key={channel.id}
          onAction={handleChannelAction}
          focused={channel.id === activeChannelId}
        />
      ))}
    </div>
  );
}
```

---

## TV-Specific Examples

### Example 1: Home Screen Navigation (From Our Codebase)

```jsx
function Home() {
  // Refs for each focusable group
  const searchRef = useRef(null);
  const infoRef = useRef(null);
  const filterRefs = useRef([]); // Array for filter buttons
  const cardRefs = useRef([]); // Array for channel cards

  // Group focus constants
  const HEADER_GROUP = 0;
  const FILTERS_GROUP = 1;
  const SWIMLANE_GROUP = 2;

  // Current focus state
  const [focusedGroupIndex, setFocusedGroupIndex] = useState(SWIMLANE_GROUP);
  const [headerFocusedIndex, setHeaderFocusedIndex] = useState(0);
  const [filtersFocusedIndex, setFiltersFocusedIndex] = useState(0);
  const [swimlaneFocusedIndex, setSwimlaneFocusedIndex] = useState(0);

  // CRITICAL: Sync React state with DOM focus
  useEffect(() => {
    if (focusedGroupIndex === HEADER_GROUP) {
      if (headerFocusedIndex === 0) {
        searchRef.current?.focus(); // Imperative focus
      } else if (headerFocusedIndex === 1) {
        infoRef.current?.focus(); // Imperative focus
      }
    } else if (focusedGroupIndex === FILTERS_GROUP) {
      filterRefs.current[filtersFocusedIndex]?.focus();
    } else if (focusedGroupIndex === SWIMLANE_GROUP) {
      cardRefs.current[swimlaneFocusedIndex]?.focus();
    }
  }, [focusedGroupIndex, headerFocusedIndex, filtersFocusedIndex, swimlaneFocusedIndex]);

  return (
    <div>
      {/* Header Group */}
      <div>
        <Button
          ref={searchRef} // Attach ref for focus control
          onKeyDown={e => {
            if (e.key === 'ArrowRight') {
              setHeaderFocusedIndex(1);
              // Focus will be set by useEffect above
            } else if (e.key === 'ArrowDown') {
              setFocusedGroupIndex(FILTERS_GROUP);
              // Focus will be set by useEffect above
            }
          }}
        >
          Search
        </Button>

        <Button
          ref={infoRef} // Attach ref for focus control
          onKeyDown={e => {
            if (e.key === 'ArrowLeft') {
              setHeaderFocusedIndex(0);
            } else if (e.key === 'ArrowDown') {
              setFocusedGroupIndex(FILTERS_GROUP);
            }
          }}
        >
          Info
        </Button>
      </div>

      {/* Filters Group */}
      <VariableSwimlane
        items={filters}
        renderItem={(filter, i, focused) => (
          <Button
            ref={el => {
              filterRefs.current[i] = el; // Store in array
            }}
            key={filter.id}
            focused={focused}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') {
                setFocusedGroupIndex(SWIMLANE_GROUP);
              } else if (e.key === 'ArrowUp') {
                setFocusedGroupIndex(HEADER_GROUP);
              }
            }}
          >
            {filter.label}
          </Button>
        )}
        focusedIndex={filtersFocusedIndex}
        onFocusChange={setFiltersFocusedIndex}
      />

      {/* Channel Cards Group */}
      <FixedSwimlane
        items={channels}
        renderItem={(channel, i, focused) => (
          <KeyboardWrapper
            key={channel.id}
            ref={el => {
              cardRefs.current[i] = el; // Store in array
            }}
            onUp={() => setFocusedGroupIndex(FILTERS_GROUP)}
            onEnter={() => navigateToChannel(channel)}
          >
            <ChannelCard
              title={channel.title}
              thumbnailUrl={channel.thumbnailUrl}
              focused={focused}
            />
          </KeyboardWrapper>
        )}
        focusedIndex={swimlaneFocusedIndex}
        onFocusChange={setSwimlaneFocusedIndex}
      />
    </div>
  );
}
```

**Key Learning Points:**

1. **Multiple ref types**: Single refs (`searchRef`) and array refs (`cardRefs`)
2. **Centralized focus sync**: One useEffect manages all DOM focus
3. **State-driven focus**: React state determines focus, refs execute it
4. **Array ref pattern**: `ref={el => { arrayRef.current[index] = el }}`

### Example 2: Scroll Position Restoration

```jsx
function ChannelInfo() {
  const scrollContainerRef = useRef(null);
  const lastScrollPositionRef = useRef(0);

  // Save scroll position when leaving screen
  useEffect(() => {
    const saveScrollPosition = () => {
      if (scrollContainerRef.current) {
        lastScrollPositionRef.current = scrollContainerRef.current.scrollTop;
      }
    };

    window.addEventListener('beforeunload', saveScrollPosition);
    return () => {
      saveScrollPosition(); // Save on unmount too
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, []);

  // Restore scroll position when returning to screen
  useEffect(() => {
    if (scrollContainerRef.current && lastScrollPositionRef.current > 0) {
      scrollContainerRef.current.scrollTo({
        top: lastScrollPositionRef.current,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <div ref={scrollContainerRef} style={{ height: '100vh', overflow: 'auto' }}>
      {/* Long scrollable content */}
    </div>
  );
}
```

### Example 3: Custom Focus Trap for Modals

```jsx
function TVModal({ children, isOpen, onClose }) {
  const modalRef = useRef(null);
  const focusableElementsRef = useRef([]);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store previously focused element
    previousFocusRef.current = document.activeElement;

    // Find all focusable elements in modal
    const focusableQuery = 'button, [tabindex]:not([tabindex="-1"])';
    focusableElementsRef.current = Array.from(
      modalRef.current?.querySelectorAll(focusableQuery) || []
    );

    // Focus first element
    focusableElementsRef.current[0]?.focus();

    // Cleanup: restore previous focus
    return () => {
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  const handleKeyDown = e => {
    if (!isOpen) return;

    const focusableElements = focusableElementsRef.current;
    const currentIndex = focusableElements.indexOf(document.activeElement);

    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown':
      case 'Tab':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
        focusableElements[prevIndex]?.focus();
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px' }}>{children}</div>
    </div>
  );
}
```

---

## Best Practices & Antipatterns

### ✅ Best Practices

#### 1. **Use Optional Chaining**

```jsx
// ✅ Safe - handles null refs gracefully
searchRef.current?.focus();

// ❌ Dangerous - will throw if ref is null
searchRef.current.focus();
```

#### 2. **Initialize Refs Properly**

```jsx
// ✅ For single elements
const buttonRef = useRef(null);

// ✅ For arrays
const cardRefs = useRef([]);

// ❌ Don't initialize with empty object
const badRef = useRef({});
```

#### 3. **Handle Dynamic Lists Correctly**

```jsx
// ✅ Dynamic array ref pattern
const itemRefs = useRef([]);

{
  items.map((item, index) => (
    <Item
      key={item.id} // Stable key
      ref={el => {
        if (el) {
          itemRefs.current[index] = el;
        }
      }}
    />
  ));
}

// ❌ Don't create refs inside render
{
  items.map((item, index) => {
    const itemRef = useRef(null); // Creates new ref every render!
    return <Item ref={itemRef} />;
  });
}
```

#### 4. **Clean Up Side Effects**

```jsx
// ✅ Clean up intervals/timeouts
useEffect(() => {
  const interval = setInterval(() => {
    // Do something
  }, 1000);

  intervalRef.current = interval;

  return () => {
    clearInterval(intervalRef.current);
  };
}, []);
```

#### 5. **Use with forwardRef for Component Libraries**

```jsx
// ✅ Component that forwards refs
const CustomButton = forwardRef(({ children, ...props }, ref) => {
  return (
    <button ref={ref} {...props}>
      {children}
    </button>
  );
});

// Usage
const buttonRef = useRef(null);
<CustomButton ref={buttonRef}>Click me</CustomButton>;
```

### ❌ Antipatterns to Avoid

#### 1. **Don't Use for Values That Affect Rendering**

```jsx
// ❌ Wrong - component won't update when this changes
const countRef = useRef(0);
const increment = () => {
  countRef.current += 1; // No re-render triggered
};

return <div>Count: {countRef.current}</div>; // Always shows 0

// ✅ Right - use useState for values that affect rendering
const [count, setCount] = useState(0);
const increment = () => {
  setCount(prev => prev + 1); // Triggers re-render
};

return <div>Count: {count}</div>; // Shows current count
```

#### 2. **Don't Access .current During Render**

```jsx
// ❌ Wrong - .current might be null during render
function BadComponent() {
  const divRef = useRef(null);

  // This might be null on first render
  const width = divRef.current?.offsetWidth || 0;

  return <div ref={divRef}>Width: {width}</div>;
}

// ✅ Right - access .current in effects
function GoodComponent() {
  const divRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (divRef.current) {
      setWidth(divRef.current.offsetWidth);
    }
  }, []);

  return <div ref={divRef}>Width: {width}</div>;
}
```

#### 3. **Don't Overuse for Simple State**

```jsx
// ❌ Overkill - simple boolean doesn't need ref
const isLoadingRef = useRef(false);

// ✅ Simple - use useState for simple state
const [isLoading, setIsLoading] = useState(false);
```

#### 4. **Don't Mutate .current in Render**

```jsx
// ❌ Wrong - mutating during render causes issues
function BadCounter({ step }) {
  const countRef = useRef(0);
  countRef.current += step; // Don't do this in render!

  return <div>Count: {countRef.current}</div>;
}

// ✅ Right - mutate in event handlers or effects
function GoodCounter({ step }) {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(prev => prev + step);
  };

  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

---

## Advanced Patterns

### 1. Custom Hook for Focus Management

```jsx
// Custom hook for TV navigation
function useTVNavigation(items, defaultIndex = 0) {
  const itemRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(defaultIndex);

  // Sync focus with DOM
  useEffect(() => {
    itemRefs.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  // Navigation functions
  const moveLeft = useCallback(() => {
    setFocusedIndex(prev => Math.max(0, prev - 1));
  }, []);

  const moveRight = useCallback(() => {
    setFocusedIndex(prev => Math.min(items.length - 1, prev + 1));
  }, [items.length]);

  // Ref callback for items
  const getItemRef = useCallback(
    index => el => {
      if (el) {
        itemRefs.current[index] = el;
      }
    },
    []
  );

  return {
    focusedIndex,
    setFocusedIndex,
    moveLeft,
    moveRight,
    getItemRef,
  };
}

// Usage
function HorizontalMenu({ items }) {
  const { focusedIndex, moveLeft, moveRight, getItemRef } = useTVNavigation(items);

  return (
    <div>
      {items.map((item, index) => (
        <Button
          key={item.id}
          ref={getItemRef(index)}
          focused={index === focusedIndex}
          onKeyDown={e => {
            if (e.key === 'ArrowLeft') moveLeft();
            if (e.key === 'ArrowRight') moveRight();
          }}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
```

### 2. Imperative Handle for Custom Components

```jsx
// Custom component with imperative API
const TVSwimlane = forwardRef(({ items, onSelect }, ref) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef([]);

  // Expose imperative methods to parent
  useImperativeHandle(
    ref,
    () => ({
      focusItem: index => {
        setFocusedIndex(index);
        itemRefs.current[index]?.focus();
      },
      getCurrentItem: () => items[focusedIndex],
      getFocusedIndex: () => focusedIndex,
    }),
    [items, focusedIndex]
  );

  return (
    <div>
      {items.map((item, index) => (
        <div
          key={item.id}
          ref={el => {
            itemRefs.current[index] = el;
          }}
          tabIndex={0}
          onFocus={() => setFocusedIndex(index)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onSelect(item, index);
            }
          }}
        >
          {item.title}
        </div>
      ))}
    </div>
  );
});

// Parent component using imperative API
function TVScreen() {
  const swimlaneRef = useRef(null);

  const handleAction = () => {
    // Imperatively control the swimlane
    const currentItem = swimlaneRef.current?.getCurrentItem();
    console.log('Current item:', currentItem);

    // Focus a specific item
    swimlaneRef.current?.focusItem(2);
  };

  return (
    <div>
      <TVSwimlane ref={swimlaneRef} items={channels} onSelect={handleChannelSelect} />
      <Button onClick={handleAction}>Get Current Item</Button>
    </div>
  );
}
```

### 3. Intersection Observer with Refs

```jsx
// Auto-focus elements when they come into view
function useAutoFocus(threshold = 0.5) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);

        // Auto-focus when element becomes visible
        if (entry.isIntersecting) {
          element.focus();
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold]);

  return { elementRef, isVisible };
}

// Usage in TV app
function LazyLoadedCard({ channel }) {
  const { elementRef, isVisible } = useAutoFocus(0.8);

  return (
    <div
      ref={elementRef}
      tabIndex={0}
      style={{
        opacity: isVisible ? 1 : 0.5,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        transition: 'all 0.3s ease',
      }}
    >
      <ChannelCard {...channel} />
    </div>
  );
}
```

---

## Testing Considerations

### Unit Testing with Refs

```jsx
import { render, fireEvent } from '@testing-library/react';

function ComponentWithRef() {
  const buttonRef = useRef(null);

  return (
    <button
      ref={buttonRef}
      onClick={() => {
        buttonRef.current?.blur();
      }}
    >
      Click me
    </button>
  );
}

// Test
test('button blurs itself when clicked', () => {
  const { getByRole } = render(<ComponentWithRef />);
  const button = getByRole('button');

  // Focus the button first
  button.focus();
  expect(document.activeElement).toBe(button);

  // Click the button
  fireEvent.click(button);

  // Should be blurred now
  expect(document.activeElement).not.toBe(button);
});
```

### Integration Testing TV Navigation

```jsx
// Test complete navigation flow
test('TV navigation works correctly', () => {
  const { getByTestId } = render(<TVScreen />);

  const searchButton = getByTestId('search-button');
  const infoButton = getByTestId('info-button');

  // Start with search button focused
  searchButton.focus();
  expect(document.activeElement).toBe(searchButton);

  // Press right arrow
  fireEvent.keyDown(searchButton, { key: 'ArrowRight' });

  // Info button should be focused
  expect(document.activeElement).toBe(infoButton);
});
```

### Mocking Refs in Tests

```jsx
// Mock ref behavior for testing
const mockRef = {
  current: {
    focus: jest.fn(),
    blur: jest.fn(),
    scrollIntoView: jest.fn(),
  },
};

// Replace useRef in tests
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: () => mockRef,
}));
```

---

## Summary: When to Use useRef

### ✅ **Use useRef when you need:**

1. **Direct DOM access** (focus, scroll, measurements)
2. **Mutable values** that don't trigger re-renders
3. **Instance variables** across renders
4. **Timer/interval references** for cleanup
5. **Third-party library integration**
6. **Previous value tracking**
7. **Performance optimizations** (avoiding stale closures)

### ❌ **Don't use useRef for:**

1. **Regular component state** (use `useState`)
2. **Values that affect rendering** (use `useState`)
3. **Simple derived state** (use regular variables)
4. **API responses** (use `useState` + `useEffect`)
5. **Props or computed values** (use regular variables)

### 🎯 **TV App Specific:**

In TV applications, `useRef` is **essential and unavoidable** because:

- Remote control navigation requires imperative focus management
- Complex 2D navigation patterns need direct DOM access
- Focus memory and restoration require element references
- Visual feedback synchronization needs DOM focus control

**Remember**: In TV apps, `useRef` isn't just an optimization or edge case—it's a fundamental requirement for creating a proper user experience. Every interactive element needs a ref because every focus change must be programmatically controlled.

---

_This comprehensive guide covers the full spectrum of `useRef` usage, from basic concepts to advanced TV application patterns. The key is understanding when React's declarative approach isn't sufficient and imperative DOM control becomes necessary._
