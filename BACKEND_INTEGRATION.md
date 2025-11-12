# 🔌 Backend Integration Guide

This document is for the **backend team** to understand how to integrate with this frontend application.

## 📋 Overview

This frontend is **ready for API integration**. All API calls go through the service layer, making it easy to connect to your backend once it's ready.

## 🔗 API Endpoints Expected

### Base URL
Set in `.env` file:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### Authentication Endpoints

#### `POST /auth/login`
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "preferences": { ... }
  },
  "token": "jwt-token-here"
}
```

#### `POST /auth/signup`
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:** Same as login

#### `GET /auth/me`
**Headers:** `Authorization: Bearer {token}`  
**Response:** User object

---

### Preferences Endpoints

#### `GET /preferences`
**Headers:** `Authorization: Bearer {token}`  
**Response:**
```json
{
  "gender": "man" | "woman" | "non-binary",
  "favoriteStyles": ["Casual", "Minimalist"],
  "favoriteColors": ["Blue", "Black"],
  "favoriteBrands": ["Nike", "Zara"]
}
```

#### `PUT /preferences`
**Headers:** `Authorization: Bearer {token}`  
**Request Body:** Preferences object  
**Response:** Updated preferences

---

### Chat Endpoints

#### `POST /chat/message`
**Headers:** `Authorization: Bearer {token}`  
**Content-Type:** `multipart/form-data` (if image is included) or `application/json`

**Request Body (JSON - no image):**
```json
{
  "message": "I need an outfit for an interview",
  "filters": {
    "budgetMax": 200,
    "outfitType": "full" | "partial",
    "selectedItems": ["jacket", "shirt", "pants"]
  },
  "chatId": "optional-chat-id-if-continuing-conversation"
}
```

**Request Body (FormData - with image):**
```
message: "I need an outfit like this"
filters: '{"budgetMax":200,"outfitType":"full","selectedItems":[]}'
image: [File object]
chatId: "optional-chat-id-if-continuing-conversation"
```

**Notes:**
- When an image is attached, send as `multipart/form-data`
- The `filters` field should be a JSON string when using FormData
- Images should be processed by your AI/ML model to extract style preferences
- Supported image formats: JPEG, PNG, WebP
- Max image size: 5MB
- Images can be uploaded via:
  - Click on paperclip icon (opens file picker)
  - Drag and drop directly onto the chat interface

**Response:**
```json
{
  "id": "string",
  "role": "assistant",
  "content": "Here's what I found...",
  "timestamp": "ISO date string",
  "outfit": {
    "id": "string",
    "items": [
      {
        "id": "string",
        "name": "Navy Blue Blazer",
        "price": 89.99,
        "imageUrl": "https://...",
        "category": "blazer",
        "brand": "J.Crew",
        "link": "https://..."
      }
    ],
    "totalPrice": 199.97,
    "explanation": "Why this outfit works..."
  },
  "imageUrl": "https://optional-if-user-attached-image"
}
```

#### `GET /chat/history`
**Headers:** `Authorization: Bearer {token}`  
**Response:**
```json
[
  {
    "id": "string",
    "title": "Interview outfit 200€",
    "lastMessage": "ISO date string"
  }
]
```

#### `GET /chat/:chatId`
**Headers:** `Authorization: Bearer {token}`  
**Response:** Array of ChatMessage objects

#### `POST /chat/new`
**Headers:** `Authorization: Bearer {token}`  
**Response:** New chat object

#### `POST /chat/explain/:outfitId`
**Headers:** `Authorization: Bearer {token}`  
**Response:**
```json
{
  "explanation": "Detailed explanation of why this outfit works..."
}
```

---

## 🔐 Authentication

The frontend expects **JWT tokens** for authentication.

**Token Storage:** LocalStorage (`authToken` key)

**Request Interceptor:** Automatically adds `Authorization: Bearer {token}` header to all API requests

**Error Handling:** 401 responses automatically redirect to `/login`

---

## 📁 Where to Find Code

- **Service Layer:** `src/services/` - All API calls
- **Type Definitions:** `src/types/index.ts` - TypeScript interfaces
- **Mock Data:** `src/utils/mockData.ts` - Temporary fake data
- **API Config:** `src/services/api.ts` - Axios instance with interceptors

---

## 🚀 Integration Steps

1. **Set up your backend** with the endpoints above
2. **Update `.env`** file with your backend URL
3. **Test endpoints** - Frontend is already calling them with mock data
4. **Remove mock responses** from services (they're clearly marked with `// TODO`)
5. **Handle CORS** on your backend to allow requests from `http://localhost:5173`

---

## 📝 Notes for Backend Team

- All dates should be in **ISO 8601 format**
- Image URLs should be **absolute URLs** (including protocol)
- Product links should open in **new tabs** (frontend handles this)
- Prices should be in **USD** (no currency symbol in API response)
- Keep response times under **2 seconds** for good UX

---

## ❓ Questions?

Contact the frontend developer for clarification on any endpoints or data structures.
