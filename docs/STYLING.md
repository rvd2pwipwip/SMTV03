# TV App Design System

## Color Palette

### Primary Colors
- **Primary Blue**: `#007AFF` - Main brand color, used for primary actions and highlights
- **Secondary Blue**: `#0056B3` - Used for hover states and secondary elements

### Neutral Colors
- **Background Dark**: `#121212` - Main background color
- **Surface Dark**: `#1E1E1E` - Card and component backgrounds
- **Text Primary**: `#FFFFFF` - Primary text color
- **Text Secondary**: `#B3B3B3` - Secondary text color

### Accent Colors
- **Success Green**: `#34C759` - Success states and confirmations
- **Warning Yellow**: `#FFD60A` - Warning states and notifications
- **Error Red**: `#FF3B30` - Error states and critical alerts

### Focus States
- **Focus Ring**: `#007AFF` with 2px width
- **Focus Background**: `rgba(0, 122, 255, 0.1)` - Subtle highlight for focused elements
- **Focus Scale**: 1.05 - Scale factor for focused elements
- **Focus Transition**: 200ms - Duration for focus transitions

## Typography

### Font Families
- **Primary Font**: `Inter` - Clean, modern sans-serif
- **Secondary Font**: `SF Pro Display` - For headings and emphasis

### Font Sizes
- **Heading 1**: 48px
- **Heading 2**: 36px
- **Heading 3**: 24px
- **Body Text**: 18px
- **Small Text**: 14px

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Bold**: 700

## Spacing System
- **Base Unit**: 8px
- **Spacing Scale**:
  - xs: 4px
  - sm: 8px
  - md: 16px
  - lg: 24px
  - xl: 32px
  - xxl: 48px

## Component Styling

### Buttons
- **Height**: 48px
- **Padding**: 16px 24px
- **Border Radius**: 8px
- **Focus Ring**: 2px solid #007AFF
- **Focus Scale**: 1.05
- **Focus Transition**: 200ms

### Cards
- **Padding**: 24px
- **Border Radius**: 12px
- **Background**: #1E1E1E
- **Shadow**: 0 4px 6px rgba(0, 0, 0, 0.1)
- **Focus Ring**: 2px solid #007AFF
- **Focus Scale**: 1.05
- **Focus Transition**: 200ms

### Swimlanes
- **Height**: 300px
- **Padding**: 24px
- **Background**: Transparent
- **Focus Ring**: 2px solid #007AFF
- **Focus Scale**: 1.05
- **Focus Transition**: 200ms
- **Scroll Behavior**: Smooth

### Input Fields
- **Height**: 48px
- **Padding**: 12px 16px
- **Border Radius**: 8px
- **Border**: 1px solid #333333

## Animation Guidelines

### Performance Specifications
- Target frame rate: 60fps
- Maximum animation duration: 300ms
- Minimum animation duration: 150ms
- Preferred easing: cubic-bezier(0.4, 0, 0.2, 1)

### Transitions
- **Duration**: 200-300ms
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Focus Transitions**: 150ms
- **Spatial Navigation Transitions**: 200ms

### Focus Effects
- **Scale**: 1.05
- **Brightness**: 1.1
- **Transition**: 200ms
- **Focus Ring**: 2px solid #007AFF
- **Focus Background**: rgba(0, 122, 255, 0.1)

## Accessibility

### Color Contrast
- **Text on Dark**: Minimum 4.5:1 contrast ratio
- **Interactive Elements**: Minimum 3:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio

### Focus Indicators
- **Visible Focus Ring**: 2px solid #007AFF
- **Focus Background**: Subtle highlight
- **Focus Scale**: 1.05
- **Focus Transition**: 200ms
- **Focus Tree**: Proper hierarchy

## TV-Specific Styles

### Focus States
```css
.focused {
  transform: scale(1.05);
  box-shadow: 0 0 0 2px var(--color-primary);
  transition: all 0.2s ease-in-out;
}
```

### Animations
- Transition duration: 200ms
- Easing: ease-in-out
- Scale factor: 1.05

### Layout
- Grid gap: 24px
- Content padding: 32px
- Safe area margins: 48px
- Fixed card sizes (no responsive scaling)

## Spatial Navigation Styles

### Focus Tree
- Root container: Header
- Child containers: Category navigation, Swimlanes
- Leaf nodes: Cards, Buttons
- Proper focus restoration
- Clear focus indicators

### Focus Transitions
- Smooth transitions between focus states
- Clear visual feedback
- Proper focus restoration
- Directional navigation support

### Focus Indicators
- Clear focus ring
- Subtle background highlight
- Scale effect
- Smooth transitions
- Proper focus tree hierarchy

## Component Styles

### Cards
- Fixed width: 200px
- Fixed height: 200px
- Border radius: 8px
- Padding: 16px
- Background: Surface color
- Focus scale: 1.05

### Buttons
- Height: 48px
- Padding: 0 24px
- Border radius: 8px
- Focus ring: 2px
- Minimum width: 120px

### Navigation
- Item height: 56px
- Icon size: 24px
- Active indicator: 4px
- Fixed positioning

## TV Optimization
- No hover states (TV has no mouse)
- Clear focus indicators
- Large touch targets
- Fixed dimensions
- No media queries needed
- No mobile/tablet considerations

## Accessibility
- Minimum contrast ratio: 4.5:1
- Focus visible: Always
- Large text for viewing distance
- Clear focus indicators
- Remote-friendly navigation

## Implementation

### CSS Variables
```css
:root {
  /* Colors */
  --color-primary: #007AFF;
  --color-surface: #1E1E1E;
  
  /* Spacing */
  --spacing-lg: 24px;
  --safe-area: 48px;
  
  /* Fixed Sizes */
  --card-width: 200px;
  --button-height: 48px;
  --nav-height: 56px;
  
  /* Focus */
  --focus-scale: 1.05;
  --focus-ring: 2px;
  --focus-transition: 200ms;
}
```

### Component Example
```css
.card {
  width: var(--card-width);
  height: var(--card-width);
  margin: var(--spacing-lg);
  background: var(--color-surface);
}

.card:focus-visible {
  transform: scale(var(--focus-scale));
  box-shadow: 0 0 0 var(--focus-ring) var(--color-primary);
  transition: all var(--focus-transition) ease-in-out;
}
``` 