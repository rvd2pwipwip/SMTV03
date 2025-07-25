# TV Keyboard Navigation Patterns

## Overview

This guide documents the proven keyboard navigation architecture for TV applications, based on successful implementations in Home.jsx and SearchBrowse.jsx, and lessons learned from debugging ChannelInfo.jsx.

## Table of Contents

1. [Core Architecture](#core-architecture)
2. [The Working Pattern](#the-working-pattern)
3. [Implementation Guide](#implementation-guide)
4. [Common Mistakes](#common-mistakes)
5. [Testing Checklist](#testing-checklist)
6. [Troubleshooting](#troubleshooting)

---

## Core Architecture

### Two-Context System

Our navigation system uses two React contexts that work together:

```jsx
// 1. GroupFocusNavigationContext - Handles vertical group navigation
const { moveFocusUp, moveFocusDown, MINI_PLAYER_GROUP_INDEX, isMiniPlayerVisible } =
  useFocusNavigation();

// 2. ScreenMemoryContext - Handles per-screen focus state persistence
const { getFocusedGroupIndex, setFocusedGroupIndex } = useScreenMemory('screen-name');
```

### Key Principles

1. **Separation of Concerns**: Horizontal navigation ≠ Vertical navigation
2. **Screen Independence**: Each screen manages its own focus state
3. **Trust the System**: Don't add "safety" logic unless absolutely necessary
4. **Consistency**: All screens should follow the same pattern

---

## The Working Pattern

### ✅ Proven Implementation (Home.jsx & SearchBrowse.jsx)

```jsx
function Home() {
  // 1. Get screen-specific focus state (with default)
  const { getFocusedGroupIndex, setFocusedGroupIndex } = useScreenMemory('home');
  const focusedGroupIndex = getFocusedGroupIndex(SWIMLANE_GROUP); // Default group

  // 2. Get navigation functions
  const { moveFocusUp, moveFocusDown, MINI_PLAYER_GROUP_INDEX, isMiniPlayerVisible } =
    useFocusNavigation();

  // 3. Local state for within-group focus
  const [headerFocusedIndex, setHeaderFocusedIndex] = useState(0);
  const [filtersFocusedIndex, setFiltersFocusedIndex] = useState(0);
  const [swimlaneFocusedIndex, setSwimlaneFocusedIndex] = useState(0);

  // 4. Wrapper functions that provide screen state
  const handleMoveFocusUp = () => {
    moveFocusUp(focusedGroupIndex, setFocusedGroupIndex);
  };

  const handleMoveFocusDown = () => {
    moveFocusUp(focusedGroupIndex, setFocusedGroupIndex);
  };

  // 5. Focus sync effect (ONLY for DOM focus)
  useEffect(() => {
    if (focusedGroupIndex === HEADER_GROUP) {
      // Focus appropriate header element
    } else if (focusedGroupIndex === FILTERS_GROUP) {
      filterRefs.current[filtersFocusedIndex]?.focus();
    } else if (focusedGroupIndex === SWIMLANE_GROUP) {
      cardRefs.current[swimlaneFocusedIndex]?.focus();
    }
  }, [focusedGroupIndex, filtersFocusedIndex, swimlaneFocusedIndex]);

  // 6. Individual button handlers
  return (
    <VariableSwimlane
      items={filters}
      renderItem={(filter, i, focused) => (
        <Button
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              handleMoveFocusDown();
              e.preventDefault();
            } else if (e.key === 'ArrowUp') {
              handleMoveFocusUp();
              e.preventDefault();
            }
            // Left/Right handled by VariableSwimlane automatically
          }}
        >
          {filter.label}
        </Button>
      )}
      focused={focusedGroupIndex === FILTERS_GROUP}
      focusedIndex={filtersFocusedIndex}
      onFocusChange={index => {
        setFiltersFocusedIndex(index); // ONLY update within-group focus
        // DON'T call setFocusedGroupIndex here!
      }}
    />
  );
}
```

### Key Success Factors

1. **Simple State Flow**:

   ```
   getFocusedGroupIndex(default) → focusedGroupIndex → DOM focus
   ```

2. **Clear Responsibilities**:

   - `onKeyDown`: Vertical navigation (ArrowUp/ArrowDown)
   - `onFocusChange`: Horizontal navigation (within group)
   - `onFocus`: Set group focus (for click-to-focus)

3. **No Redundant Effects**: Trust `getFocusedGroupIndex(default)` for initialization

---

## Implementation Guide

### Step 1: Copy the Working Pattern

```jsx
// Start with this exact structure from Home.jsx:
const { getFocusedGroupIndex, setFocusedGroupIndex } = useScreenMemory('your-screen-name');
const focusedGroupIndex = getFocusedGroupIndex(YOUR_DEFAULT_GROUP);
const { moveFocusUp, moveFocusDown } = useFocusNavigation();

// Wrapper functions
const handleMoveFocusUp = () => moveFocusUp(focusedGroupIndex, setFocusedGroupIndex);
const handleMoveFocusDown = () => moveFocusDown(focusedGroupIndex, setFocusedGroupIndex);
```

### Step 2: Define Your Groups

```jsx
const HEADER_GROUP = 0; // Optional: search, buttons
const FILTERS_GROUP = 1; // Optional: filter buttons
const CONTENT_GROUP = 2; // Main content area
// Add groups as needed, but keep them simple
```

### Step 3: Add Individual Handlers

```jsx
// For each interactive element:
<Button
  onKeyDown={e => {
    if (e.key === 'ArrowDown') {
      handleMoveFocusDown();
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      handleMoveFocusUp();
      e.preventDefault();
    }
  }}
  onFocus={() => {
    setFocusedGroupIndex(YOUR_GROUP);
  }}
>
```

### Step 4: Handle Component Navigation

```jsx
// For VariableSwimlane or similar:
<VariableSwimlane
  onFocusChange={index => {
    setYourGroupFocusedIndex(index); // Only within-group state
  }}
/>

// For KeyboardWrapper:
<KeyboardWrapper
  onUp={handleMoveFocusUp}
  onDown={handleMoveFocusDown}
>
```

### Step 5: Add Focus Sync

```jsx
useEffect(() => {
  if (focusedGroupIndex === YOUR_GROUP) {
    yourRefs.current[yourFocusedIndex]?.focus();
  }
  // Handle other groups...
}, [focusedGroupIndex, yourFocusedIndex]);
```

---

## Common Mistakes

### ❌ What NOT to Do (Lessons from ChannelInfo.jsx)

#### 1. Adding "Safety" useEffects

```jsx
// DON'T DO THIS - causes remounting loops
useEffect(() => {
  if (getFocusedGroupIndex() !== ACTIONS_GROUP) {
    setFocusedGroupIndex(ACTIONS_GROUP); // Creates dependency loop!
  }
}, [getFocusedGroupIndex, setFocusedGroupIndex]);
```

#### 2. Global Event Listeners

```jsx
// DON'T DO THIS - interferes with component events
useEffect(() => {
  const handleKeyDown = e => {
    if (e.key === 'ArrowDown') {
      handleMoveFocusDown(); // Conflicts with individual handlers
    }
  };
  window.addEventListener('keydown', handleKeyDown, true); // Capture phase!
}, []);
```

#### 3. Mixing Patterns

```jsx
// DON'T MIX - be consistent
// Home.jsx uses individual button handlers ✅
// ChannelInfo.jsx used global listeners ❌
// Pick one pattern and stick with it!
```

#### 4. Calling setFocusedGroupIndex in onFocusChange

```jsx
// DON'T DO THIS - interferes with vertical navigation
onFocusChange={index => {
  setFiltersFocusedIndex(index);
  setFocusedGroupIndex(FILTERS_GROUP); // ❌ Creates conflicts!
}}

// DO THIS INSTEAD - only horizontal state
onFocusChange={index => {
  setFiltersFocusedIndex(index); // ✅ Only within-group
}}
```

### Root Causes of Problems

1. **Over-engineering**: Adding "improvements" to working patterns
2. **Inconsistency**: Different screens using different approaches
3. **Event conflicts**: Multiple listeners for the same keys
4. **Dependency loops**: Effects that trigger themselves

---

## Testing Checklist

### Basic Navigation Test

```bash
# Test on ALL screens after any navigation changes:
□ Navigate up/down between all groups
□ Navigate left/right within groups
□ Switch screens and return
□ Test with browser dev tools open/closed
□ Test mini-player integration
```

### Edge Cases

```bash
□ Empty groups (no filter buttons, etc.)
□ Single item groups
□ Rapid key presses
□ Focus restoration after screen changes
□ Conditional rendering (groups that appear/disappear)
```

### Screen Comparison

```bash
□ Compare useEffect count between screens
□ Verify same navigation handler patterns
□ Check for duplicate event listeners
□ Ensure consistent focus sync logic
```

---

## Troubleshooting

### 🚨 Symptoms: Focus "flashing" between groups

**Likely Cause**: Duplicate event handlers or useEffect loops

**Debug Steps**:

1. Add console logs to all navigation functions
2. Check for multiple `onKeyDown` handlers on same element
3. Look for useEffect with changing dependencies
4. Compare with working Home.jsx implementation

### 🚨 Symptoms: Component remounting during navigation

**Likely Cause**: useEffect dependency loop

**Debug Steps**:

1. Check useEffect dependencies for functions from hooks
2. Look for "safety" effects that call `setFocusedGroupIndex`
3. Temporarily disable React.StrictMode
4. Remove unnecessary initialization effects

### 🚨 Symptoms: Navigation works on some screens but not others

**Likely Cause**: Inconsistent patterns

**Debug Steps**:

1. Compare side-by-side with working screen
2. Check for different event listener approaches
3. Verify same context usage
4. Look for screen-specific "improvements"

### 🚨 Debug Tools

```jsx
// Add this for debugging navigation issues:
console.log('Navigation called:', {
  from: focusedGroupIndex,
  to: newIndex,
  screen: 'your-screen-name',
  timestamp: Date.now(),
});
```

---

## Best Practices Summary

### ✅ Do This

1. **Copy working patterns exactly** before modifying
2. **Use individual button onKeyDown handlers** for up/down
3. **Let VariableSwimlane handle left/right** automatically
4. **Trust getFocusedGroupIndex(default)** for initialization
5. **Test immediately** after any navigation changes
6. **Keep patterns consistent** across all screens

### ❌ Don't Do This

1. **Add "safety" useEffects** for focus initialization
2. **Use global window listeners** for arrow keys
3. **Call setFocusedGroupIndex** in onFocusChange handlers
4. **Mix different navigation approaches** in same app
5. **Optimize before proving it works**
6. **Skip testing** on all screens

---

## Migration Guide

### When Fixing Broken Navigation

1. **Compare with Home.jsx** line by line
2. **Remove global event listeners** first
3. **Remove redundant useEffects** that call setFocusedGroupIndex
4. **Add individual button handlers** following Home.jsx pattern
5. **Test each change incrementally**

### When Adding New Screens

1. **Copy Home.jsx structure** as starting point
2. **Modify only content and group definitions**
3. **Keep navigation logic identical**
4. **Test thoroughly** before adding features

---

## Example: Converting Broken Screen

### Before (Broken)

```jsx
// Multiple problems:
useEffect(() => {
  // ❌ Redundant safety effect
  if (getFocusedGroupIndex() !== ACTIONS_GROUP) {
    setFocusedGroupIndex(ACTIONS_GROUP);
  }
}, [getFocusedGroupIndex, setFocusedGroupIndex]);

useEffect(() => {
  // ❌ Global listener conflicts with individual handlers
  const handleKeyDown = e => {
    if (e.key === 'ArrowDown') handleMoveFocusDown();
  };
  window.addEventListener('keydown', handleKeyDown, true);
}, []);

const handleActionFocusChange = index => {
  setActionsFocusedIndex(index);
  setFocusedGroupIndex(ACTIONS_GROUP); // ❌ Creates conflicts
};
```

### After (Fixed)

```jsx
// Simple, working pattern:
const focusedGroupIndex = getFocusedGroupIndex(ACTIONS_GROUP); // ✅ Trust the system

const handleActionFocusChange = index => {
  setActionsFocusedIndex(index); // ✅ Only within-group state
};

<Button
  onKeyDown={e => {
    if (e.key === 'ArrowDown') {
      handleMoveFocusDown(); // ✅ Individual handler
      e.preventDefault();
    }
  }}
  onFocus={() => {
    setFocusedGroupIndex(ACTIONS_GROUP); // ✅ For click-to-focus
  }}
/>;
```

---

_This pattern has been proven to work reliably across multiple screens. When in doubt, copy Home.jsx exactly and modify only what you need to change._
