# TV Component Library Documentation

## Overview

### Project Information
- **Repository**: [tv-component-library](https://github.com/rvd2pwipwip/tv-component-library)
- **Purpose**: Reusable TV components with TV-specific considerations
- **Status**: Initial setup phase
- **Version**: _[Add your current version here, e.g., 1.0.0]_  <!-- Add versioning info for future reference -->

## Design Philosophy

### Building Blocks Approach
Components are designed as simple, reusable building blocks that:
- Maintain focus and simplicity
- Enable flexible composition
- Follow design system best practices
- Support easy testing and documentation

### Navigation and Interactivity
- Navigation managed at application level
- Components remain simple and predictable
- Parent components handle navigation patterns
- Applications implement custom navigation

## Component Categories

### 1. Navigation Components
- **TVMenu**
  - Purpose: Main navigation menu
  - Features:
    - Focus management using Norigin Spatial Navigation
    - Keyboard navigation
    - Visual feedback
  - Props:
    - items: Array of menu items
    - onSelect: Selection handler
    - currentFocus: Active item
  - **Example:**
    ```jsx
    <TVMenu
      items={[{ label: 'Home' }, { label: 'Channels' }]}
      onSelect={handleMenuSelect}
      currentFocus={focusKey}
    />
    ```

- **TVMenuItem**
  - Purpose: Individual menu item
  - Features:
    - Focus styles
    - Selection feedback
    - Icon support
  - Props:
    - label: Item text
    - icon: Optional icon
    - isSelected: Selection state
    - onSelect: Click handler

### 2. Content Components
- **TVSwimlane**
  - Purpose: Horizontal scrollable content container
  - Features:
    - Single row of focusable items
    - Smooth horizontal scrolling
    - Focus management with Norigin
    - Category-specific content
  - Props:
    - title: Category title
    - items: Array of content items
    - onItemSelect: Selection handler
  - **Example:**
    ```jsx
    <TVSwimlane
      title="Featured"
      items={channelList}
      onItemSelect={handleChannelSelect}
    />
    ```

- **TVCard**
  - Purpose: Content container
  - Features:
    - Rounded corners square aspect ratio thumbnail
    - Focus display around thumbnail only
    - Card label text left aligned below thumbnail
    - 2-line max text label
    - Image optimization
    - Metadata display
  - Props:
    - title: Card title
    - content: Main content
    - image: Optional image
    - metadata: Additional info
  - **Example:**
    ```jsx
    <TVCard
      title="Channel 1"
      image="/images/channel1.png"
      metadata={{ viewers: 1200 }}
    />
    ```

### 3. Interactive Components
- **TVButton**
  - Purpose: Interactive button
  - Features:
    - Focus states
    - Keyboard interaction
    - Visual feedback
    - **Consistent icon sizing for transparent variant**
  - Props:
    - label: Button text
    - onClick: Click handler
    - variant: Style variant
    - size: Button size
    - icon: Icon element
  - **Available Variants:**
    - `"primary"`
    - `"secondary"`
    - `"ButtonTransparent"` (for icon-only or minimal buttons)
  - **Example:**
    ```jsx
    <Button
      icon={<Info style={{ width: TRANS_BTN_ICON_SIZE, height: TRANS_BTN_ICON_SIZE }} />}
      showIcon
      size="medium"
      variant="ButtonTransparent"
      onClick={handleInfo}
    >
      Info
    </Button>
    ```

#### Icon Sizing for Transparent Buttons
To ensure consistent icon sizing for all transparent buttons across the app, use the shared JS constant `TRANS_BTN_ICON_SIZE` defined in `src/constants/ui.js`:

```js
// src/constants/ui.js
export const TRANS_BTN_ICON_SIZE = 44; // px
```

When using a transparent button with an icon:
```js
import { TRANS_BTN_ICON_SIZE } from '../constants/ui';
<Button
  icon={<Info style={{ width: TRANS_BTN_ICON_SIZE, height: TRANS_BTN_ICON_SIZE }} />}
  showIcon
  size="medium"
  variant="ButtonTransparent"
/>
```

To update the icon size for all transparent buttons, change the value of `TRANS_BTN_ICON_SIZE` in one place.

## Implementation Guidelines

### Component Responsibilities
Components should:
- Handle their own styling and layout
- Manage their internal state
- Provide clear props for customization
- Be accessible and keyboard-focusable
- Not implement complex navigation logic

### Parent Component Responsibilities
Parent components should:
- Implement navigation patterns
- Manage focus and keyboard events
- Handle component composition
- Define interaction patterns

## Design System Integration

### Shared Design Tokens
- Colors
- Typography
- Spacing
- Focus states
- **Icon sizing constant for transparent buttons**

**Note:**
> Always import the design tokens CSS in your app entry point (e.g., `main.jsx` or `App.jsx`) to ensure all components are styled correctly:
> ```js
> import '@smtv/design-tokens/dist/design-tokens.css';
> ```

### TV-Specific Considerations
- Fixed viewport (1920x1080)
- Remote control navigation
- Clear focus states
- 10ft viewing distance

## Development Guidelines

### Focus Management
- Every interactive component must use Norigin Spatial Navigation
- Implement proper focus tree structure
- Support keyboard navigation
- Handle focus restoration

### Accessibility Requirements
- Include ARIA labels
- Support screen readers
- Maintain proper focus order
- Ensure clear focus indicators
- Follow TV-specific accessibility guidelines

### Spatial Navigation Integration
- Use `useFocusable` hook for focusable components
- Implement `FocusContext.Provider` for containers
- Handle focus tree hierarchy
- Manage focus restoration
- Support directional navigation
- Implement proper focus styles

## Migration Plan

### Phase 1: Core Components
1. **ChannelCard**
   - Move from `src/components/ChannelCard.jsx`
   - Include styles and stories
   - Document usage and variants

2. **TVSwimlane**
   - Move from `src/components/TVSwimlane.jsx`
   - Include styles and stories
   - Document usage and variants

### Phase 2: Navigation Components
1. **Header**
2. **Category Navigation**
3. **Mode Switcher**

### Phase 3: Player Components
1. **Mini Player**
2. **Player Controls**
3. **Progress Bar**

## Development Workflow

### Component Development Process
1. Create component file
2. Implement basic functionality
3. Add TV-specific features
4. Test keyboard navigation
5. Verify accessibility
6. Document props and usage
7. Add to component library

### Testing Requirements
- Unit tests for component logic
- Integration tests for navigation
- Accessibility testing
- Performance testing
- Remote control testing

## Documentation

### Component Library
- Storybook documentation
- Usage examples
- Props documentation
- Accessibility guidelines

### TV App
- Component usage
- Integration patterns
- Customization options
- Migration guides 