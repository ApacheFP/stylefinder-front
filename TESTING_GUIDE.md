# Visual Testing Guide - StyleFinder AI

## Quick Testing Checklist by Device Size

### 📱 Mobile (< 640px) - iPhone SE, Galaxy S21

#### Landing Page
- [ ] Hero text readable and well-sized (3xl)
- [ ] "Get Started" button easily tappable (48px height)
- [ ] Features display in 2-column grid (or 1 column if very small)
- [ ] All text is readable without zoom
- [ ] No horizontal scrolling

#### Login/Sign Up
- [ ] Form centered with proper padding
- [ ] Input fields easy to tap (44px min height)
- [ ] Keyboard doesn't obscure submit button
- [ ] Links are easily tappable
- [ ] Form width looks good (not too wide or narrow)

#### Chat Page
- [ ] Hamburger menu visible in top left
- [ ] Sidebar opens as overlay when hamburger clicked
- [ ] Sidebar closes when overlay clicked
- [ ] Sidebar closes when "X" clicked
- [ ] Filters stack vertically
- [ ] Input field spans full width
- [ ] Send button is large enough to tap
- [ ] Product cards display 1 per row
- [ ] Product card images load smoothly
- [ ] No hover effects on touch (overlay doesn't show)

#### Preferences Page
- [ ] All preference chips are tappable (44px min)
- [ ] Chips wrap nicely to multiple lines
- [ ] Action buttons stack vertically
- [ ] Radio buttons have adequate touch area
- [ ] Modal fits well on screen

#### Header
- [ ] Logo size appropriate
- [ ] User name hidden on small screens
- [ ] Avatar is visible and tappable
- [ ] Dropdown menu fits on screen
- [ ] Log in/Sign up buttons visible and tappable

---

### 📱 Tablet (640px - 1024px) - iPad, Android Tablets

#### Landing Page
- [ ] Hero text larger (4xl)
- [ ] Features in 2-column or 3-column grid
- [ ] Spacing looks balanced
- [ ] Images and icons properly sized

#### Chat Page
- [ ] Sidebar still collapsible (hamburger menu visible)
- [ ] Product cards in 2-column grid
- [ ] Filters can be horizontal or vertical (test both)
- [ ] Chat messages have good width

#### All Pages
- [ ] Content doesn't look stretched
- [ ] Padding is comfortable
- [ ] Touch targets still adequate
- [ ] Text size readable without zoom

---

### 🖥️ Desktop (≥ 1024px) - Laptop, Desktop Monitors

#### Landing Page
- [ ] Hero text at largest size (5xl)
- [ ] Features in 3-column grid
- [ ] Content centered with max-width
- [ ] Hover effects work on buttons/links

#### Chat Page
- [ ] Sidebar always visible (no hamburger)
- [ ] Sidebar is fixed on left side
- [ ] Product cards in 3-column grid
- [ ] Hover overlay on product cards works
- [ ] "View on store" appears on hover
- [ ] Filters horizontal layout
- [ ] Chat input has fixed width (not full width)

#### All Pages
- [ ] Cursor changes to pointer on interactive elements
- [ ] Hover states visible and smooth
- [ ] Content doesn't stretch too wide
- [ ] User menu dropdown positioned correctly

---

## Component-Specific Tests

### Button Component
**Mobile:**
- [ ] Minimum 44px height
- [ ] Easy to tap without mis-clicking
- [ ] Active state shows on touch
- [ ] No accidental zooming on double-tap

**Desktop:**
- [ ] Hover effect (scale 1.02)
- [ ] Cursor changes to pointer
- [ ] Active state on click
- [ ] Loading spinner centered

### Product Card
**Mobile:**
- [ ] Image loads with blur placeholder
- [ ] Brand badge visible and readable
- [ ] Price formatted correctly (€XX.XX)
- [ ] "View on store" button always visible (no hover)
- [ ] Card fills width correctly

**Desktop:**
- [ ] Hover animation smooth (scale-105)
- [ ] Overlay appears on hover with smooth transition
- [ ] Brand badge transitions opacity on hover
- [ ] Image maintains aspect ratio
- [ ] Card max-width enforced (sm = 384px)

### Sidebar
**Mobile (< 1024px):**
- [ ] Hidden by default
- [ ] Opens from left with animation
- [ ] Overlay dims background
- [ ] Close button (X) visible in top right
- [ ] Closes when overlay clicked
- [ ] Smooth animations (no jank)
- [ ] Takes full height

**Desktop (≥ 1024px):**
- [ ] Always visible
- [ ] Fixed width (280px)
- [ ] No overlay
- [ ] No close button
- [ ] Scrollable if content overflows

### Chat Input
**Mobile:**
- [ ] Filters stack vertically
- [ ] Each filter spans full width
- [ ] Gap between filters adequate
- [ ] Input field full width
- [ ] Send button easy to tap

**Desktop:**
- [ ] Filters horizontal
- [ ] Each filter has fixed width
- [ ] Input field has max width
- [ ] Everything aligns nicely

---

## Performance Tests

### Image Loading
- [ ] Product card images show blur placeholder first
- [ ] Images fade in smoothly when loaded
- [ ] No layout shift when images load

### Animations
- [ ] All animations are smooth (60fps)
- [ ] No lag when opening sidebar
- [ ] Hover effects don't cause jank
- [ ] Scroll is smooth

### Touch Response
- [ ] No delay on button press
- [ ] Touch feedback immediate
- [ ] No accidental zooming
- [ ] Swipe gestures work naturally

---

## Browser-Specific Tests

### Safari (iOS)
- [ ] Rounded corners display correctly
- [ ] Safe area respected (notch, home indicator)
- [ ] Focus states work with keyboard
- [ ] Touch events register correctly
- [ ] No rubberband scrolling issues

### Chrome (Android)
- [ ] Address bar hides on scroll
- [ ] Viewport height calculated correctly
- [ ] Touch ripple effects don't conflict
- [ ] Back button works correctly

### Chrome/Firefox/Edge (Desktop)
- [ ] Hover states work
- [ ] Click events register
- [ ] Keyboard navigation works
- [ ] Forms autofill correctly

---

## Accessibility Tests

### Keyboard Navigation
- [ ] Tab order logical
- [ ] Focus visible on all elements
- [ ] Enter/Space activate buttons
- [ ] Escape closes sidebar/modals

### Screen Reader
- [ ] Hamburger menu has aria-label
- [ ] Images have alt text
- [ ] Form labels associated with inputs
- [ ] Buttons have descriptive text

### Color Contrast
- [ ] Text readable on all backgrounds
- [ ] Primary color (#0D6EFD) has sufficient contrast
- [ ] Disabled states are distinguishable

---

## How to Test

### Using Chrome DevTools
1. Open Developer Tools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select device from dropdown or enter custom dimensions
4. Test each page and interaction
5. Try both portrait and landscape orientations

### Using Real Devices
1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Start dev server: `npm run dev`
3. Open `http://[YOUR_IP]:5173` on mobile device
4. Test all interactions and pages
5. Check different orientations

### Testing Checklist Order
1. Start with mobile (smallest screen)
2. Test all pages and interactions
3. Gradually increase screen size
4. Test tablet breakpoints
5. Finally test desktop
6. Go back to mobile to verify nothing broke

---

## Common Issues to Watch For

❌ **Common Problems:**
- Content cut off on small screens
- Buttons too small to tap easily
- Text too small to read
- Horizontal scrolling on mobile
- Hover effects on touch devices
- Sidebar doesn't close on mobile
- Images too large on mobile
- Forms obscured by keyboard

✅ **Should Not Happen:**
- Layout breaking at any screen size
- Text overlapping
- Buttons unclickable
- Images not loading
- Sidebar stuck open
- JavaScript errors in console

---

## Bug Reporting Template

If you find an issue, report it with this format:

```
**Device/Browser:** iPhone 14 / Safari
**Screen Size:** 390x844
**Page:** Chat Page
**Issue:** Product cards not displaying in grid
**Steps to Reproduce:** 
1. Open chat page
2. Send message
3. Observe product cards

**Expected:** Cards should be in 1-column grid
**Actual:** Cards are overlapping

**Screenshot:** [attach if possible]
```

---

**Happy Testing! 🚀**
