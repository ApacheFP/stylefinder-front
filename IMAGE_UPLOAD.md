# 🖼️ Image Upload Feature

## Overview
Users can attach images to their chat messages to help the AI understand their style preferences better. Images can be uploaded via **click** or **drag and drop**.

## Features

### 1. **Click to Upload** 
- Click the paperclip icon (📎) in the chat input
- Opens native file picker
- Select an image file (JPEG, PNG, WebP)

### 2. **Drag and Drop**
- Drag an image file from desktop/finder
- Drop it anywhere on the chat interface
- Visual overlay appears showing drop zone
- Automatic validation on drop

### 3. **Image Preview**
- Shows thumbnail preview before sending
- Displays filename
- "X" button to remove image before sending
- Preview persists until message is sent or removed

### 4. **Validation**
- **Supported formats:** JPEG, PNG, WebP
- **Maximum size:** 5MB
- Automatic alerts for invalid files
- User-friendly error messages

### 5. **Chat Display**
- Images appear in user messages
- Rounded corners for better aesthetics
- Max dimensions: 300x256px (responsive)
- Images are clickable (future: open in modal)

## Technical Implementation

### Frontend (React + TypeScript)

**State Management:**
```typescript
const [selectedImage, setSelectedImage] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);
const [isDragging, setIsDragging] = useState(false);
```

**File Validation:**
```typescript
// Type validation
if (!file.type.startsWith('image/')) {
  alert('Please select an image file');
  return;
}

// Size validation (5MB)
if (file.size > 5 * 1024 * 1024) {
  alert('Image size must be less than 5MB');
  return;
}
```

**Preview Generation:**
```typescript
const reader = new FileReader();
reader.onloadend = () => {
  setImagePreview(reader.result as string);
};
reader.readAsDataURL(file);
```

### Backend Integration

**Endpoint:** `POST /chat/message`

**Content-Type:** `multipart/form-data` (when image is included)

**Request Format:**
```javascript
const formData = new FormData();
formData.append('message', inputMessage);
formData.append('filters', JSON.stringify(filters));
formData.append('image', selectedImage); // File object
if (chatId) {
  formData.append('chatId', chatId);
}
```

**Axios Configuration:**
```javascript
await api.post('/chat/message', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

### Data Flow

1. **User uploads image** → File object stored in state
2. **FileReader creates preview** → Base64 string for display
3. **User clicks Send** → FormData with image + message + filters
4. **Backend receives** → Processes image with AI/ML
5. **AI analyzes image** → Extracts colors, styles, patterns
6. **Backend responds** → Returns outfit recommendations
7. **Frontend displays** → Shows recommended outfits + user's image

## UI/UX Details

### Drag and Drop Overlay
```tsx
{isDragging && (
  <div className="absolute inset-0 z-50 bg-primary/10 backdrop-blur-sm">
    <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-primary border-dashed">
      <Paperclip className="w-16 h-16 text-primary mx-auto mb-4" />
      <h3>Drop your image here</h3>
      <p>Supported formats: JPEG, PNG, WebP (max 5MB)</p>
    </div>
  </div>
)}
```

### Preview Card
```tsx
{imagePreview && (
  <div className="mb-4 bg-white border rounded-xl p-4">
    <div className="relative">
      <img src={imagePreview} className="rounded-lg max-h-32" />
      <button onClick={handleRemoveImage} className="absolute -top-2 -right-2">
        ×
      </button>
    </div>
    <p>{selectedImage?.name}</p>
  </div>
)}
```

### Message Display
```tsx
{message.imageUrl && (
  <img 
    src={message.imageUrl} 
    alt="User uploaded" 
    className="rounded-lg mb-2 max-w-xs max-h-64 object-cover"
  />
)}
```

## Backend Requirements

### Image Processing
1. **Receive multipart/form-data** with image file
2. **Validate file** (type, size, dimensions)
3. **Store image** (cloud storage: AWS S3, Cloudinary, etc.)
4. **Process with AI/ML:**
   - Color extraction
   - Style recognition (casual, formal, sporty, etc.)
   - Pattern detection
   - Clothing item identification
5. **Use insights** to refine outfit recommendations
6. **Return image URL** in response

### Recommended AI/ML Services
- **Google Vision API** - Label detection, color extraction
- **AWS Rekognition** - Object and scene detection
- **Custom ML Model** - Fashion-specific classification
- **OpenAI GPT-4 Vision** - Comprehensive image understanding

### Example Backend Response
```json
{
  "id": "msg123",
  "role": "assistant",
  "content": "Based on your image, I found similar styles...",
  "timestamp": "2024-01-15T10:30:00Z",
  "imageUrl": "https://cdn.example.com/user-uploads/image123.jpg",
  "outfit": {
    "id": "outfit456",
    "items": [...],
    "totalPrice": 299.97
  }
}
```

## Future Enhancements

- [ ] Multiple image upload
- [ ] Image cropping/editing before send
- [ ] Image-to-image search (find similar products)
- [ ] Camera capture on mobile devices
- [ ] Image gallery view in chat history
- [ ] OCR for text in images (brand names, etc.)
- [ ] Style transfer (apply style from image to outfit)

## Files Modified

- `src/pages/ChatPage.tsx` - Main implementation
- `src/types/index.ts` - Added `imageUrl` to `ChatMessage` interface
- `src/services/chatService.ts` - FormData handling
- `BACKEND_INTEGRATION.md` - API documentation

## Testing

### Manual Tests
1. ✅ Upload valid image (JPEG, PNG, WebP)
2. ✅ Upload invalid file type (PDF, TXT)
3. ✅ Upload oversized image (>5MB)
4. ✅ Drag and drop valid image
5. ✅ Drag and drop invalid file
6. ✅ Remove image before sending
7. ✅ Send message with image
8. ✅ Send message without image
9. ✅ View image in chat history

### Browser Compatibility
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- **Image preview** uses FileReader (client-side, no server load)
- **File validation** happens immediately (prevents bad uploads)
- **Lazy loading** for images in chat history (future enhancement)
- **Image compression** recommended before upload (future enhancement)

---

**Status:** ✅ Fully implemented and ready for backend integration
**Last Updated:** 12 novembre 2025
