# TV App UI Layout Reference

## Viewport Specifications
- Fixed resolution: 1920x1080 (Full HD)
- Optimal viewing distance: 10ft
- Fixed scaling for consistent TV experience

## Header Layout
- Company logo (left)
- Music/Radio mode switcher (center)
- Navigation items (right)
  - Search
  - User Profile
  - Settings

## Navigation Pattern
- Horizontal category-genre navigation below header
  - Favorites (only when populated)
  - History (only when populated)
  - Pop
  - Decades
  - Rock
  - Dance
  - Country
  - Extra
  - Jazz
  - Classical
  - World Music
  - Multicultural
  - Hip-Hop

## Content Layout
- Horizontal swimlanes for channel cards
  - Single row of channels from currently selected category-genre
  - Smooth horizontal scrolling
  - Focus management using Norigin Spatial Navigation
  - Clear focus indicators
  - Proper focus tree structure

## Mini Player Bar
- Fixed position at bottom
- Album art thumbnail
- Song title
- Artist name
- Playback controls (play/pause, skip)

## Design Assets
The original design reference image is stored in:
`docs/assets/design-reference/home-layout.png`
This layout png is in light mode but the app will be developed in dark mode

## Key UI Decisions
1. **Horizontal Navigation**
   - Departure from traditional vertical menu
   - Better suited for TV navigation
   - Optimized for remote control
   - Fixed width calculations based on 1920px viewport
   - Spatial navigation using Norigin
   - Clear focus indicators
   - Smooth transitions

2. **Swimlane Layout**
   - Single row per category-genre
   - Focus on current selection
   - Smooth scrolling animation
   - Clear focus states
   - Fixed width calculations for 1920px viewport
   - Proper focus tree structure
   - Focus restoration on mount
   - Directional navigation support

3. **Mode Switcher**
   - Prominent position in header
   - Clear visual distinction
   - Easy toggle between Music/Radio
   - Focus management with Norigin
   - Clear focus indicators

4. **Accessibility**
   - Clear focus indicators (see [STYLING.md](./STYLING.md))
   - Logical tab order
   - High contrast for text
   - Adequate spacing for TV viewing
   - Proper focus tree structure
   - Smooth transitions
   - Clear visual feedback

## Spatial Navigation Considerations
1. **Focus Tree Structure**
   - Header as root container
   - Category navigation as child container
   - Swimlanes as child containers
   - Cards as leaf nodes
   - Proper focus restoration

2. **Navigation Patterns**
   - Left/Right for horizontal navigation
   - Up/Down for vertical navigation
   - Enter for selection
   - Escape for back/cancel
   - Smooth transitions between focus states

3. **Focus Management**
   - Clear focus indicators
   - Proper focus restoration
   - Smooth transitions
   - Directional navigation
   - Focus tree hierarchy

4. **Implementation Details**
   - Use Norigin Spatial Navigation
   - Implement proper focus tree
   - Handle focus restoration
   - Manage focus states
   - Support directional navigation 