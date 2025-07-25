# KeyboardWrapper Component Design

## Overview

The `KeyboardWrapper` component is a generic wrapper that adds keyboard navigation functionality to any child component, specifically designed for TV remote control interaction patterns.

## Design Decision & Evolution

### Problem Statement

- Need for consistent keyboard event handling across different focusable components
- Requirement to maintain proper focus management in TV navigation context
- Desire for a reusable solution that doesn't tightly couple with specific components

### Original Implementation Issues

The initial `EnterKeyWrapper` had several limitations:

- **Tight Coupling**: Directly rendered `ChannelCard` inside, limiting reusability
- **Limited Event Support**: Only handled Enter key events
- **Focus Management Problems**: Breaking focus ring display and event handling

## Design Principles

### 1. Generic Wrapper Pattern

- **True Wrapper**: Accepts any children rather than specific components
- **Ref Forwarding**: Properly forwards refs to maintain focus context
- **Event Delegation**: Handles keyboard events without interfering with child behavior

### 2. Focus Management Preservation

- **Focus Ring Display**: Maintains proper focus indicators on child components
- **Focus Context**: Preserves focus management through component tree
- **Event Bubbling**: Ensures focus events propagate correctly

### 3. Extensible Event Handling

- **Multiple Events**: Supports various keyboard events (Enter, Arrow keys, Escape)
- **Custom Handlers**: Allows custom event handlers via props
- **Event Propagation**: Maintains proper event flow

## Technical Implementation

### Component Structure

```jsx
const KeyboardWrapper = forwardRef(
  ({ children, onEnter, onUp, onDown, onLeft, onRight, onEscape, tabIndex = 0, ...props }, ref) => {
    const handleKeyDown = e => {
      switch (e.key) {
        case 'Enter':
          onEnter?.(e);
          break;
        case 'ArrowUp':
          onUp?.(e);
          break;
        case 'ArrowDown':
          onDown?.(e);
          break;
        // ... other cases
      }
    };

    return (
      <div ref={ref} tabIndex={tabIndex} onKeyDown={handleKeyDown} {...props}>
        {children}
      </div>
    );
  }
);
```

### Key Features

#### 1. Ref Forwarding

- Uses `React.forwardRef` for proper ref handling
- Enables parent components to access the wrapped element
- Maintains focus management chain

#### 2. Event Handler Props

- `onEnter` - Selection/activation events
- `onUp/onDown` - Vertical navigation
- `onLeft/onRight` - Horizontal navigation
- `onEscape` - Back/cancel actions

#### 3. Accessibility Support

- Proper `tabIndex` management
- ARIA attributes passthrough
- Keyboard event standards compliance

## Usage Patterns

### Basic Usage

```jsx
<KeyboardWrapper onEnter={handleSelect}>
  <ChannelCard {...channelProps} />
</KeyboardWrapper>
```

### Navigation Integration

```jsx
<KeyboardWrapper onEnter={handleSelect} onUp={handleUpNavigation} onDown={handleDownNavigation}>
  <FilterButton {...buttonProps} />
</KeyboardWrapper>
```

### Custom Focus Management

```jsx
<KeyboardWrapper ref={buttonRef} onEnter={handleAction} tabIndex={isCurrentFocus ? 0 : -1}>
  <ActionButton {...props} />
</KeyboardWrapper>
```

## Design Benefits

### 1. Reusability

- **Component Agnostic**: Works with any child component
- **Consistent API**: Same interface across different use cases
- **Easy Integration**: Drop-in wrapper for existing components

### 2. Separation of Concerns

- **Navigation Logic**: Isolated in the wrapper
- **Component Logic**: Child components focus on their core functionality
- **Event Handling**: Centralized keyboard event management

### 3. TV-Optimized

- **Remote Control Support**: Handles standard TV remote buttons
- **Focus Management**: Proper focus indicators and state management
- **Navigation Patterns**: Supports TV-specific interaction patterns

## Migration Strategy

### From Specific Wrappers

1. Replace component-specific wrappers with `KeyboardWrapper`
2. Move component rendering to children prop
3. Update event handler props to match new API
4. Test focus behavior and keyboard navigation

### Integration Steps

1. **Test with Existing Components**: Verify focus ring display works
2. **Validate Event Handling**: Ensure keyboard events function correctly
3. **Check Focus Restoration**: Confirm focus management remains intact
4. **Verify Accessibility**: Test with screen readers and keyboard navigation

## Testing Considerations

### Focus Management

- Verify focus ring appears correctly on child components
- Test focus restoration after navigation
- Validate focus trap behavior in modal contexts

### Keyboard Events

- Test all supported keyboard events (Enter, Arrow keys, Escape)
- Verify event propagation doesn't interfere with child behavior
- Check custom event handlers receive correct event objects

### Accessibility

- Screen reader compatibility
- Proper focus order maintenance
- ARIA attributes preservation

## Best Practices

### 1. Event Handler Implementation

- Keep handlers focused on navigation concerns
- Avoid business logic in keyboard handlers
- Use proper event prevention when needed

### 2. Focus Management

- Set appropriate `tabIndex` values
- Ensure only one focusable element per navigation group
- Restore focus after route changes or modal closure

### 3. Performance

- Use `React.memo` for frequently re-rendered wrapped components
- Avoid unnecessary re-renders through proper prop management
- Consider `useCallback` for event handlers in parent components

---

_This component represents a key architectural decision for TV navigation, providing a reusable foundation for keyboard interaction while maintaining focus management integrity._
