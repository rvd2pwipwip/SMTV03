# CSS Architecture for TV App

## Overview

This document outlines the CSS architecture for our TV application, following React best practices while maintaining a consistent design system.

## File Structure

- `App.css`: App-specific layout, container styles, and TV-specific scaling
- `index.css`: Minimal global styles
- Component-specific CSS files: Located alongside their components
- Design tokens: Imported from `@smtv/design-tokens` npm package

## CSS Organization Principles

### 1. Design Tokens (@smtv/design-tokens)

- Imported from the npm package: `@import '@smtv/design-tokens/dist/design-tokens.css'`
- Provides all CSS variables (colors, typography, spacing, etc.)
- Single source of truth for design system values
- Includes TV-specific optimizations

### 2. App Layout (App.css)

- Focuses on app container and layout structure
- Handles responsive scaling for TV display (16:9 aspect ratio)
- Manages app-specific components like headers and main content areas
- Imports design tokens from npm package

### 3. Global Styles (index.css)

- Minimal global styles that don't fit in the design system
- TV-specific focus and accessibility styles

### 4. Component-Specific CSS

- Each component has its own CSS file (e.g., `ChannelCard.css`)
- CSS is scoped to the component
- Uses design system variables from the npm package for consistency

## Best Practices

1. **Use Design Tokens**: Always use variables from `@smtv/design-tokens` for colors, spacing, etc.
2. **Component Scoping**: Keep component styles with their components
3. **Avoid Global Styles**: Minimize global styles to prevent conflicts
4. **TV-Specific Considerations**: Always consider TV viewing distance and remote navigation
5. **Focus Management**: Ensure proper focus styles for TV navigation

## Future Improvements

- Consider migrating to CSS Modules for better scoping
- Evaluate CSS-in-JS solutions for complex components
- Implement a component library with consistent styling 

## Importing Component Library CSS

To ensure all utility classes and shared styles (such as `.tv-focus-ring`) from `@smtv/tv-component-library` are available throughout the app, **import the library's CSS in your global `index.css`**:

```css
@import '@smtv/tv-component-library/dist/style.css';
```

- This guarantees all library styles are loaded globally and in the correct order.
- **Do not rely on importing the CSS in JS/TS files (like `main.jsx`)**—some build setups may not process these imports as global styles.
- All components from the library will have their intended styles, including the universal focus ring, without any additional configuration.

### Example: `src/styles/index.css`

```css
@import '@smtv/tv-component-library/dist/style.css';
@import '@smtv/design-tokens/dist/design-tokens.css';

/* ...other global styles... */
```

**Result:**
All TV component library styles (including focus rings and utility classes) are available globally, ensuring consistent design and behavior across your app. 