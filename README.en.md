# 📱 SMS Previewer

A clean and elegant SMS backup viewer for SMS Backup & Restore exported files

## 💝 Special Thanks

This project wouldn't be possible without [SMS Backup & Restore](https://play.google.com/store/apps/details?id=com.riteshsahu.SMSBackupRestore). This excellent Android app inspired the creation of this project, aiming to provide users with a better SMS backup browsing experience.

## ✨ Features

- 🔍 Preview XML files exported from SMS Backup & Restore
- 👥 Smart contact list with latest message preview
- 💬 Beautiful chat bubble interface
- 🔔 Unread message counter support
- 📱 Independent scrolling for contacts and messages
- 📊 SMS and call history statistics analysis
  - 📈 Message volume and send/receive ratio statistics
  - 👤 Contact interaction frequency analysis
  - 📅 Time span and daily message volume analysis
- 📞 Call history analysis features
- 📊 Call duration statistics and type filtering
- 🌙 Dark mode support, automatically adapts to system theme
- 📱 Responsive design for mobile and desktop
- 🔄 Optimized navigation experience for switching between SMS and call records
- 🌓 Dark/Light theme support
- 🚀 Fast and lightweight, runs entirely in the browser
- 🔒 Privacy protected, no server upload required

## Tech Stack

- Vue 3 - Progressive JavaScript Framework
- Vite - Next Generation Frontend Build Tool
- Tailwind CSS - Utility-First CSS Framework

## Installation

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

## Usage

1. Export SMS as XML file using SMS Backup & Restore app
2. Open SMS Previewer website
3. Click to upload or drag and drop XML file to the upload area
4. View your SMS records
5. Click "Statistics" button to view message statistics

## For Developers

### XML File Processing

This project processes all data on the client side, ensuring user privacy:

1. File Upload:
   - Uses File API to read user-selected XML files
2. Parsing Process:
   - Uses `FileReader` to read file contents
   - Parses XML structure with `DOMParser`
   - Extracts SMS data into internal data structures
3. Data Storage:
   - All data temporarily stored in memory (Vue reactive state)
   - Data automatically cleared on browser close/refresh
   - No local storage used (LocalStorage/IndexedDB) for privacy
4. Performance Optimization:
   - Batch processing to prevent UI blocking
   - Async parsing with Web Workers
   - Uses requestIdleCallback for compute-intensive tasks
   - Implements incremental loading, prioritizing recent messages

### State Management & Data Flow

The project uses Vue 3's Composition API and reactivity system:

1. Global State Management:
   - Uses `ref` and `reactive` for message and contact data
   - Cross-component state sharing via `provide/inject`
   - `computed` properties for data filtering and sorting

2. Data Flow Mechanism:
   - XML parsing results → Global state → Component state
   - Unidirectional data flow for traceable state changes
   - Component communication via props and events

### Component Communication

Multiple communication methods ensure clear data flow:

1. Props Down:
   - Parent components pass data and config to children
   - Unidirectional data flow prevents direct prop modification

2. Events Up:
   - Child components emit events to parents
   - Completes user interaction and state update loop

3. Cross-Component Communication:
   - Global state sharing via `provide/inject`
   - Event bus for complex scenarios

### Router System

SPA routing management based on Vue Router:

1. Route Configuration:
   - Configuration-based route definitions
   - Route lazy loading for performance
   - Route guards for access control

2. View Organization:
   - Main views: SMS preview and call records
   - Component reuse: shared layout and navigation
   - Route parameter passing: query params and dynamic routes

### Error Handling

Multi-level error handling strategy:

1. XML Parsing Errors:
   - File format validation
   - Parse process exception catching
   - User-friendly error display

2. Runtime Errors:
   - Global error boundary capture
   - Component-level error handling
   - Fallback display mechanism

3. User Feedback:
   - Toast notification system
   - Error detail display
   - Operation guidance

### Code Structure

Modular organization with clear responsibilities:

- `src/utils/`: Utility function modules
  - `xmlParser.js`: XML parsing core logic
    - `parseXMLFile()`: Main parsing function
    - `formatMessageType()`: Message type formatting
    - `formatDateTime()`: Date time formatting
    - `analyzeMessageStats()`: SMS statistics analysis
  - `callParser.js`: Call record parsing module
    - `parseCallHistory()`: Call record parsing
    - `calculateDuration()`: Call duration calculation
    - `analyzeCallStats()`: Call record statistics analysis

- `src/components/`: Vue components
  - `SearchBar.vue`: Search component (real-time search with debounce)
  - `ContactList.vue`: Contact list component
  - `MessageList.vue`: Message list component
  - `CallList.vue`: Call record component
  - `ExportDialog.vue`: Export dialog component

- `src/views/`: Page view components
  - `SMSView.vue`: SMS preview main view
  - `CallsView.vue`: Call records view

- `src/composables/`: Reusable composition functions
  - `useTheme.js`: Theme management
  - `useDevice.js`: Device type detection
  - `useToast.js`: Toast notification system
  - Encapsulates common business logic
  - Provides state management capabilities
  - Implements feature module reuse

### Performance Optimization

To ensure smooth handling of large XML files:

1. Data Processing Optimization:
   - Batch processing: Process large datasets in 500-record batches
   - Incremental rendering: Prioritize processing and display of recent messages
   - Virtual scrolling: Reduce DOM nodes in long lists

2. Asynchronous Processing:
   - Web Worker: Time-consuming calculations in separate threads
   - requestIdleCallback: Non-critical tasks during browser idle time
   - Async component loading: Load non-core components on demand

3. Rendering Performance:
   - Component lazy loading: Route-level component lazy loading
   - Computed property caching: Avoid repeated calculations
   - Event delegation: Reduce event listener count

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/).