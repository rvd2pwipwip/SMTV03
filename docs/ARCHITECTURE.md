# TV App Architecture

## Overview
This document outlines the technical architecture of our TV application, built with React and Vite.

## Tech Stack
- **Frontend Framework**: React
- **Build Tool**: Vite
- **Styling**: CSS Modules/Styled Components
- **State Management**: React Context (Phase 1), Redux (Phase 2 if needed)
- **Testing**: Vitest

## Project Structure
```
├── public/           # Static assets that don't need processing
├── src/
│   ├── assets/      # Processed assets (images, fonts, etc.)
│   ├── components/  # Reusable UI components
│   ├── constants/   # App-wide constants and configurations
│   ├── hooks/       # Custom React hooks
│   ├── layouts/     # Page components
│   ├── services/    # API calls and external service integrations
│   ├── styles/      # Global styles and themes
│   ├── utils/       # Utility functions
│   ├── App.jsx      # Root component
│   └── main.jsx     # Application entry point
├── env/             # Environment-specific configurations
├── index.html       # Vite entry point
└── vite.config.js   # Vite configuration
```

## Key Architectural Decisions

### 1. Component Architecture
- Functional components with hooks
- Component composition over inheritance
- Custom hooks for shared logic
- See `COMPONENTS.md` for detailed component documentation

### 2. State Management
- React Context for global state management
  - Theme management
  - User preferences
  - Navigation state
  - App-wide settings
  - Authentication state
- Benefits of this approach:
  - Built into React, no additional dependencies
  - Simpler learning curve
  - Sufficient for our current scale
  - Easy to test and maintain
  - Good performance for our use case
- Future considerations:
  - If state complexity grows significantly
  - If we need more advanced features like time-travel debugging
  - If we need better performance optimization tools
  - We can evaluate Redux or other solutions then

### 3. Routing
- React Router for navigation
- TV-optimized route transitions
- Focus management between routes
- History management

### 4. Performance Considerations
- Code splitting
- Lazy loading
- Memoization where needed
- TV-specific optimizations
  - Animation performance (see [STYLING.md](./STYLING.md))
  - Efficient rendering
  - Memory management

## TV-Specific Considerations

### 1. Focus Management
- Custom focus trap implementation
- Keyboard navigation support
- Focus restoration between routes
- See `COMPONENTS.md` for implementation details

### 2. Remote Control Support
- Keyboard event handling
- Navigation patterns
- Selection mechanisms
- See `COMPONENTS.md` for component-specific implementations

### 3. Performance
- 60fps animations
- Efficient rendering
- Memory management
- Asset optimization

## Build and Deployment
- Development server configuration
- Production build optimization
- Asset handling
- Environment management

## Future Considerations
- State management scaling
- Testing strategy
- Build optimization
- Deployment strategy
- TypeScript migration (Phase 3) 