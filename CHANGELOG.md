# 📝 Changelog - StyleFinder AI Frontend

## [Unreleased] - 2024-11-12

### ✨ Added Features

#### Image Upload System
- **Click to upload**: Click on paperclip icon 📎 to open file picker
- **Drag and drop**: Drag images directly into chat area
- **Preview system**: Shows thumbnail with filename before sending
- **Validation**: 
  - File type validation (JPEG, PNG, WebP only)
  - Size limit: 5MB maximum
- **Backend integration ready**: Images sent as `multipart/form-data`

#### User Authentication UI
- **Header updates**:
  - Shows Login/SignUp buttons when logged out
  - Shows user avatar with dropdown menu when logged in
- **User dropdown menu**:
  - User info (name + email)
  - Link to Preferences
  - Link to Profile (placeholder)
  - Logout button
- **Auto-login for development**: Mock user automatically logged in
- **Click outside to close**: Dropdown closes when clicking outside

#### UI Improvements
- **Product Cards**: Reduced image size from square to fixed 200px height
- **Better proportions**: Smaller padding and font sizes for cleaner look
- **Smooth animations**: All transitions use smooth CSS animations

### 🐛 Bug Fixes

#### Drag and Drop Flickering
- **Problem**: Overlay flickered constantly during drag due to nested events
- **Solution**: Implemented drag counter with `useRef` to track enter/leave events
- **Result**: Smooth, flicker-free drag and drop experience

#### Header Authentication State
- **Problem**: Header showed Login/SignUp even when user was logged in
- **Solution**: Connected Header to AuthContext, added user dropdown menu
- **Result**: Proper UI state for authenticated users

### 🔧 Technical Changes

#### Code Organization
- Updated `ChatMessage` type to include optional `imageUrl` field
- Enhanced `chatService.sendMessage()` to handle `FormData` for images
- Added `dragCounter` ref to track nested drag events
- Improved event handlers for drag operations

#### Backend Integration Documentation
- Updated `BACKEND_INTEGRATION.md` with image upload specs
- Added FormData format examples
- Documented supported formats and size limits
- Added note about drag and drop functionality

### 📚 Documentation

#### New Files
- `DEVELOPMENT_NOTES.md`: Tips for developers
- `CHANGELOG.md`: This file

#### Updated Files
- `BACKEND_INTEGRATION.md`: Image upload endpoints
- `PROJECT_STATUS.md`: New features added
- `README.md`: Updated feature list

---

## Development Notes

### Mock Auto-Login
By default, the app auto-logs in with a mock user for easier development. This should be removed before production. See `DEVELOPMENT_NOTES.md` for details.

### Testing Image Upload
1. Navigate to ChatPage
2. Try both upload methods:
   - Click paperclip icon
   - Drag image onto chat area
3. Verify preview appears
4. Send message with image
5. Check that image displays in chat

### Known Limitations
- Backend not yet implemented (uses mock responses)
- Image processing happens client-side only
- No persistent storage (localStorage only)

---

## Future Enhancements

### Planned Features
- [ ] Multiple image upload
- [ ] Image editing (crop, rotate)
- [ ] Image gallery in chat history
- [ ] Paste images from clipboard
- [ ] Voice input
- [ ] Real-time notifications
- [ ] Chat export/share

### Performance Improvements
- [ ] Image compression before upload
- [ ] Lazy loading for chat history
- [ ] Virtual scrolling for long conversations
- [ ] Service worker for offline support

---

## Credits

Developed by StyleFinder AI Team
