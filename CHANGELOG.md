## v0.1.3

### Packages and technologies

- added `tailwindcss` for styling and `popperjs` (tooltip / popper positioning engine)

### Functionality

- removed unused fonts and icons to increase initial loading speed / bundle size
- added tutorial popup windows for user controls and image change screen
- image editor now keeps the same format of the image when exporting

### User Interface

- added animations to interactive elements to improve visibility (bounce animation for drag thumb in image change screen, pulsing animation for infopoints)
- improved animation for zoom in (added easing with linear interpolation)
- added ability to move through exposition with keyboard arrows and to pause with spacebar
- aligned start screen collapsable sections
- removed start button after loading completed when opening exposition initially

### Bugs

- fixed screen preview with CTRL+P
- fixed infopoint not hiding in photogallery screen when transitioning to next photo

### Screens

- `Game draw`
  - added ability to erase, choose color and thickness
- `Photogallery`
  - extended animation time
- `Video screen`
  - user can pause by clicking on the video itself

## v0.1.2

### Packages and technologies

- added `i18next` and `react-i18next` packages for translations

### Functionality

- added the ability to pause animations mid play
- added **asynchronous** file loading
  - loads files in advance for **previous**, **current** and **next** screen
- added support for multiple languages

### Screens

- **all screens**
  - adjsuted for new file loading system
- **games screens**
  - changed toolbar
  - added animations to solution reveal
- `Image screen`
  - reworked the design
- `Parallax screen`
  - improved animation
  - added animation pausing
- `Zoom in screen`
  - changed visuals of zoom text
  - added animation pausing
- `Image change` (before and after)
  - new drag handle
  - added snaping to corners of the screen
  - improved UX
  - kept only slide animation variations (horizontal or vertical)
- `Game find`
  - added new cursor
  - added animations when setting location
- `Game draw` and `Game wipe`
  - added new cursor
  - improved canvas drawing
- `Game sizing`
  - added bounds to resizing the element
  - changed solution visualization (shows next to the initial image)
  - improved scaling gesture
  - added scale icon and surrounded the element in a dashed box
- `Game quiz`
  - changed visuals
- `Finish screen`
  - changed visuals
  - added more share buttons
  - responsive design

### User interface

- removed initial file loading indication

## v0.1.1

### Packages and technologies

- [**BREAKING CHANGE**] updated to Node version `16.15.0`
- updated packages (`react`, `react-router-dom`, `redux`)
- added / updated linters for code analysis and conventions (`eslint`, `prettier`)
- added `typescript` for static types
  - added types for redux store and dialogs
- added `react-spring` for animations
- started using hooks and function components
- started using **scss** modules for styling

### User interface

- changed font to `Work Sans`
- completely redesigned introduction screen
- modified infopoint visuals
- added user controles
  - pause button
  - previous screen, next screen
  - chapters button
- added animations using `react-spring`
  - collapsing items
  - opening chapters list
  - opening sidebar with screen information
- added exposition progression bar to the bottom of the screen

### Functionality

- removed interactive and view mode (merged into single mode with better user controls)
- added an ability to pause exposition
- added navigation between screens and chapters

## v0.1.0

- initial version before SLA (2021)
