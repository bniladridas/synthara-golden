# Changelog

All notable changes to the Synthara Golden website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.2] - 2025-05-09

### Added
- Added delta icon in bottom left corner that displays the changelog when clicked
- Created changelog modal that shows the content of CHANGELOG.md
- Added accessibility features to the changelog modal

## [1.2.1] - 2025-05-09

### Fixed
- Added missing floating pad link to all pages in the "pages" directory
- Ensured consistent navigation structure across all pages

## [1.2.0] - 2025-05-09

### Added
- New SOTA (State-of-the-Art) page showcasing the Qwen3 235B A22B FP8 Throughput model
- Added SOTA link to the "More" dropdown menu in all pages
- Created new CSS styles for the SOTA page
- Added OG image for the SOTA page

### Changed
- Updated SOTA page content to focus on factual information about the Qwen3 model
- Improved meta descriptions for better search engine optimization

## [1.1.1] - 2025-05-08

### Changed
- Moved Workspace link from main navigation to the "More" dropdown menu
- Added active state styling for the current page in navigation
- Updated OG (Open Graph) images for all legal and workspace pages

## [1.1.0] - 2025-05-07

### Added - Accessibility Improvements

#### Semantic HTML Structure
- Added skip link to bypass navigation and go directly to main content
- Added proper ARIA landmark roles (`banner`, `navigation`, `main`, `contentinfo`)
- Added `aria-labelledby` attributes to connect headings with their sections
- Added `id` attributes to headings for proper section labeling
- Added `role="list"` and `role="listitem"` to grid layouts for better semantics
- Added proper dialog role and attributes to the country selection modal

#### Keyboard Navigation
- Added keyboard support for dropdown menus with arrow key navigation
- Implemented focus trapping in modal dialogs to prevent focus from leaving the modal
- Added proper tab order and keyboard interaction patterns
- Added escape key support for closing dialogs
- Added focus management for interactive elements

#### Screen Reader Support
- Added `aria-live` regions for dynamic content like the agent animation
- Added proper ARIA states (`aria-expanded`, `aria-hidden`, etc.)
- Added descriptive `aria-label` attributes for links and buttons
- Added screen reader only text (`.sr-only`) for visual elements
- Added proper error announcements for form validation
- Added `aria-invalid` state for form validation errors

#### Visual Improvements
- Improved color contrast for better readability (updated text colors)
- Added visible focus indicators for keyboard users
- Added styles for focus states with outlines and box shadows
- Added support for reduced motion preferences with `prefers-reduced-motion` media query
- Improved border colors for better visibility

#### Form Accessibility
- Added proper form validation with error messages
- Added `aria-required` and `aria-invalid` attributes to form controls
- Added proper labels for form controls
- Added error message announcements for screen readers

#### JavaScript Enhancements
- Added keyboard event handling for interactive elements
- Added focus management for modals and dropdowns
- Added support for screen reader announcements
- Added support for detecting keyboard vs. mouse users
- Added focus visibility management to only show focus styles when using keyboard

### Changed
- Converted div elements to semantic button elements for interactive controls
- Improved color contrast by darkening the light text color from `#666666` to `#555555`
- Enhanced border visibility by changing border color from `#f5f5f5` to `#e0e0e0`
- Updated JavaScript to handle keyboard interactions
- Modified modal behavior to be more accessible
- Updated form validation to provide better feedback
- Changed alert dialogs to use more accessible notification patterns

### Fixed
- Fixed keyboard navigation issues with dropdown menus
- Fixed focus management in modal dialogs
- Fixed missing ARIA attributes on interactive elements
- Fixed color contrast issues for better readability
- Fixed form validation feedback for screen readers

## [1.0.0] - 2025-04-15

### Added
- Initial release of the Synthara Golden website
- Company information pages
- Technology showcase
- Approach description
- Contact information
- Country selection modal
- Responsive design
- Minimal, clean interface following golden ratio principles
