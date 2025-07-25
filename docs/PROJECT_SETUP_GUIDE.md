# TV App Project Setup Guide

## Project Overview

A modern TV application built with React and Vite, focusing on UX design principles and TV-specific navigation patterns.

## Key Project Decisions

### **Tech Stack**

- **Frontend**: React + Vite
- **Styling**: CSS with TV-specific considerations
- **Navigation**: Custom keyboard/remote control handling
- **Focus**: UX learning journey with incremental development

### **Design Philosophy**

- **TV-First UX**: Horizontal navigation, single swimlanes, remote control optimization
- **Learning-Focused**: Step-by-step approach with extensive documentation
- **Prototype-First**: UX over detailed UI, minimal viable styling

## Documentation Structure

### **Core Files**

- `README.md` - Project overview and getting started
- `docs/TV_NAVIGATION_PATTERNS.md` - Keyboard navigation architecture
- `docs/ARCHITECTURE.md` - Technical decisions
- `docs/UI-LAYOUT.md` - Design reference and layout decisions

### **Notepads (for quick reference)**

- Project Context - Current phase and requirements
- UX Checklist - TV-specific implementation requirements
- React Learning - Progress tracking and patterns

## Communication Rules (.cursorrules)

### **Message Format**

- 🤖🤖🤖 for AI responses
- 👤👤👤 for user messages

### **CLI Commands**

- Always use main UI terminal
- Explain before executing
- Wait for confirmation on interactive commands

### **Code Changes**

- Explain changes before making them
- Reference relevant documentation
- Follow TV-specific UX guidelines

## Project Structure

```
SMTV03/
├── docs/                           # Project documentation
│   ├── assets/
│   │   └── design-reference/       # Design images and references
│   ├── chat-history/               # Development conversation logs
│   ├── ARCHITECTURE.md             # Technical architecture decisions
│   ├── COMPONENT_DOCUMENTATION.md  # Component library docs
│   ├── DEVELOPMENT_LOG.md          # Development progress log
│   ├── PROJECT_SETUP_GUIDE.md      # This guide
│   ├── STYLING.md                  # Design system and styling
│   ├── TV_NAVIGATION_PATTERNS.md   # Navigation architecture guide
│   ├── UI-LAYOUT.md               # Design reference and layout
│   └── UX-DESIGN.md               # UX guidelines and principles
├── public/
│   └── assets/
│       └── channels/               # Channel artwork assets
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── AdBanner.jsx
│   │   ├── ChannelRow.jsx
│   │   ├── FixedSwimlane.jsx       # Fixed-width horizontal scrolling
│   │   ├── Header.jsx
│   │   ├── KeyboardWrapper.jsx     # TV navigation wrapper
│   │   ├── MiniPlayer.jsx
│   │   ├── VariableSwimlane.jsx    # Variable-width horizontal scrolling
│   │   ├── VerticalScrollPadding.jsx
│   │   └── [other components...]
│   ├── contexts/                   # React Context providers
│   │   ├── FocusNavigationContext.jsx
│   │   ├── GroupFocusNavigationContext.jsx  # Vertical group navigation
│   │   ├── PlayerContext.jsx       # Music player state
│   │   └── ScreenMemoryContext.jsx # Per-screen focus memory
│   ├── screens/                    # Main app screens
│   │   ├── ChannelInfo.jsx        # Channel detail screen
│   │   ├── Home.jsx               # Main home screen
│   │   └── SearchBrowse.jsx       # Search and browse screen
│   ├── data/                      # Static data and content
│   │   ├── fakeChannels.js
│   │   ├── genreFilters.js
│   │   └── [other data files...]
│   ├── constants/
│   │   └── ui.js                  # UI constants and helpers
│   ├── utils/                     # Utility functions
│   │   ├── homeData.js
│   │   ├── layout.js
│   │   └── ui.js                  # UI helper functions
│   ├── styles/                    # Global styles and CSS
│   │   ├── App.css
│   │   ├── focus-ring.css         # TV focus styling
│   │   └── index.css
│   ├── assets/                    # Local assets and SVGs
│   ├── App.jsx                    # Main app component
│   └── main.jsx                   # React entry point
├── .cursorrules                   # Communication guidelines
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite build configuration
└── README.md                      # Project overview
```

## TV-Specific Design Principles

### **Navigation Pattern**

- **Header**: Logo + Mode Switcher + Utility Icons
- **Category Nav**: Horizontal scrolling pills
- **Content**: Single swimlanes (not grids)
- **Player**: Fixed bottom bar

### **Focus Management**

- Clear focus indicators (rings, scaling)
- Smooth transitions (200ms)
- Keyboard/remote navigation support
- Focus restoration between screens

### **Layout Approach**

- Fixed viewport considerations (1920x1080)
- Horizontal scrolling for content
- Remote control optimized spacing
- Accessibility-first design

## Development Approach

### **Learning Philosophy**

- **Step-by-step implementation** - No overwhelming feature dumps
- **Copy working patterns** - Don't reinvent proven solutions
- **Test immediately** - Verify each change before proceeding
- **Document decisions** - Track learning milestones

### **Problem-Solving Process**

1. Identify the specific issue
2. Compare with working implementations
3. Debug systematically with console logs
4. Document the solution for future reference

## Key Learnings from Development

### **Navigation Architecture**

- Use distributed event handling (individual button handlers)
- Avoid global event listeners that conflict
- Trust the screen memory context system
- Keep patterns consistent across screens

### **React Patterns**

- Trust `getFocusedGroupIndex(default)` for initialization
- Don't add "safety" useEffects unless necessary
- Separate horizontal and vertical navigation concerns
- Use proper effect dependencies to avoid loops

## Getting Started

1. Review existing documentation
2. Check current project phase in notepads
3. Follow TV navigation patterns guide
4. Test changes on all screens
5. Update documentation as you learn

---

_This guide captures the project setup journey and key decisions made during development. It serves as both a technical reference and a learning milestone._
