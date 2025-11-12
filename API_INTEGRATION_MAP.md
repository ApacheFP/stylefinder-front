# 🔌 Mappa Integrazione API - Frontend

## 📍 Dove Sono le Chiamate API nel Frontend

Questo documento mostra **esattamente dove** sono le chiamate API nel frontend, così quando il backend sarà pronto, saprai dove intervenire per collegarle.

---

## 🎯 Struttura Attuale

```
src/services/
├── api.ts                    # ⚙️ Configurazione Axios base
├── authService.ts            # 🔐 Chiamate autenticazione
├── chatService.ts            # 💬 Chiamate chat e AI
└── preferencesService.ts     # ⚙️ Chiamate preferenze utente
```

---

## 🔧 File: `src/services/api.ts`

**Cosa fa**: Configurazione base di Axios con:
- Base URL dell'API (da `.env`)
- Timeout
- Interceptor per aggiungere token JWT automaticamente
- Interceptor per gestire errori 401 (redirect a login)

**Cosa devi fare quando backend è pronto**:
1. ✅ Niente! È già pronto
2. Solo verifica che `VITE_API_BASE_URL` in `.env` punti al backend giusto

**Variabili ambiente necessarie**:
```bash
# .env
VITE_API_BASE_URL=http://localhost:8000/api  # O l'URL del backend
```

---

## 🔐 File: `src/services/authService.ts`

**Endpoint API che si aspetta dal backend**:

### 1. Login
```typescript
POST /auth/login
Body: { email: string, password: string }
Response: { token: string, user: { id, email, name } }
```

**Dove viene usato**:
- `src/pages/LoginPage.tsx` (bottone "Accedi")

### 2. Sign Up
```typescript
POST /auth/signup
Body: { email: string, password: string, name: string }
Response: { token: string, user: { id, email, name } }
```

**Dove viene usato**:
- `src/pages/SignUpPage.tsx` (bottone "Crea Account")

### 3. Get Current User
```typescript
GET /auth/me
Headers: { Authorization: "Bearer {token}" }
Response: { id, email, name, preferences? }
```

**Dove viene usato**:
- `src/context/AuthContext.tsx` (al caricamento app per verificare sessione)

### 4. Logout
```typescript
// Locale, nessuna chiamata API
localStorage.removeItem('authToken')
```

**Dove viene usato**:
- `src/components/layout/Header.tsx` (bottone logout)

---

## 💬 File: `src/services/chatService.ts`

**Endpoint API che si aspetta dal backend**:

### 1. Send Message (con AI)
```typescript
POST /chat/message
Body: { 
  message: string, 
  filters: OutfitFilters, 
  chatId?: string,
  image?: File (FormData se presente)
}
Response: { 
  chatId: string,
  message: { role, content, outfits[] }
}
```

**Dove viene usato**:
- `src/pages/ChatPage.tsx` (invio messaggio da `ChatInput`)

**Note**: 
- Se c'è un'immagine, usa `FormData`
- Se non c'è immagine, usa JSON normale

### 2. Get Chat History
```typescript
GET /chat/history
Response: [
  { id, title, lastMessage, timestamp }
]
```

**Dove viene usato**:
- `src/components/layout/Sidebar.tsx` (lista chat nella sidebar)

### 3. Get Chat Conversation
```typescript
GET /chat/{chatId}
Response: [
  { id, role, content, outfits?, timestamp }
]
```

**Dove viene usato**:
- `src/pages/ChatPage.tsx` (quando clicchi su una chat nella sidebar)

### 4. Create New Chat
```typescript
POST /chat/new
Response: { id, title }
```

**Dove viene usato**:
- `src/pages/ChatPage.tsx` (bottone "Nuova Chat" o primo messaggio)

### 5. Explain Outfit
```typescript
POST /chat/explain/{outfitId}
Response: { explanation: string }
```

**Dove viene usato**:
- `src/pages/ChatPage.tsx` (bottone "Spiega" su un outfit)

---

## ⚙️ File: `src/services/preferencesService.ts`

**Endpoint API che si aspetta dal backend**:

### 1. Get Preferences
```typescript
GET /preferences
Response: {
  styles: string[],
  budgetMin: number,
  budgetMax: number,
  favoriteColors: string[],
  sizes: { top, bottom, shoes }
}
```

**Dove viene usato**:
- `src/pages/PreferencesPage.tsx` (al caricamento pagina)
- `src/context/AuthContext.tsx` (dopo login)

### 2. Update Preferences
```typescript
PUT /preferences
Body: { /* tutto l'oggetto preferenze */ }
Response: { success: boolean }
```

**Dove viene usato**:
- `src/pages/PreferencesPage.tsx` (bottone "Salva Preferenze")

---

## 📋 Checklist per Backend Team

Quando implementate le API, assicuratevi di:

### Headers Richiesti
- ✅ `Content-Type: application/json` (o `multipart/form-data` per upload)
- ✅ `Authorization: Bearer {token}` per endpoint protetti

### CORS
```python
# FastAPI example
allow_origins=["http://localhost:5173"]  # Frontend dev
allow_credentials=True
allow_methods=["*"]
allow_headers=["*"]
```

### Formato Risposte
```json
// Success
{ "data": { ... } }

// Error
{ "error": "Message", "code": 400 }
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (token non valido/mancante)
- `404` - Not Found
- `500` - Server Error

---

## 🔄 Cosa Fare Quando Backend È Pronto

### Step 1: Configura URL Backend
```bash
# .env.local (non committare!)
VITE_API_BASE_URL=http://localhost:8000/api
```

### Step 2: Testa Endpoint Singolarmente
```bash
# Esempio con curl
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'
```

### Step 3: Frontend Dovrebbe Funzionare Automaticamente! 🎉
Se il backend rispetta i contratti API definiti, il frontend dovrebbe funzionare senza modifiche!

### Step 4: Se Serve Aggiustare
Se il backend usa endpoint/formati diversi, modifica solo i file in `src/services/`:
- `authService.ts` - per auth
- `chatService.ts` - per chat/AI
- `preferencesService.ts` - per preferenze

**NON toccare**:
- ✅ Pages (`src/pages/*`) - già pronti
- ✅ Components (`src/components/*`) - già pronti
- ✅ Context (`src/context/*`) - già pronti

---

## 🧪 Come Testare Integrazione

### 1. Mock API (attualmente usato)
```typescript
// src/utils/mockData.ts
// Dati fake per sviluppo senza backend
```

### 2. Backend Reale
```bash
# Cambia .env
VITE_API_BASE_URL=http://localhost:8000/api

# Riavvia dev server
npm run dev
```

### 3. Testing Flow
1. **Login** → Verifica token salvato in localStorage
2. **Chat** → Invia messaggio, verifica risposta AI
3. **History** → Verifica lista chat nella sidebar
4. **Preferences** → Salva/carica preferenze

---

## 📊 Diagramma Flusso Chiamate

```
User Action                   Frontend                  Backend
─────────────────────────────────────────────────────────────────
[Click "Accedi"]        →   LoginPage.tsx
                        →   authService.login()
                        →   api.post('/auth/login')   →  POST /auth/login
                        ←   { token, user }           ←  
                        →   localStorage.setItem()
                        →   Navigate to /chat

[Invia messaggio]       →   ChatPage.tsx
                        →   chatService.sendMessage()
                        →   api.post('/chat/message') →  POST /chat/message
                        ←   { chatId, message }       ←  (con AI response)
                        →   Update UI

[Salva preferenze]      →   PreferencesPage.tsx
                        →   preferencesService.update()
                        →   api.put('/preferences')   →  PUT /preferences
                        ←   { success }               ←
                        →   Show success message
```

---

## 🎯 TL;DR per Te (Frontend Developer)

### Cosa È GIÀ Pronto ✅
- ✅ Tutti i service file (`src/services/`)
- ✅ Tutte le pagine che usano i service
- ✅ Gestione errori e token
- ✅ TypeScript types

### Cosa Farai Quando Backend È Pronto 🔧
1. Cambia `VITE_API_BASE_URL` in `.env`
2. Testa login → dovrebbe funzionare
3. Testa chat → dovrebbe funzionare
4. Se qualcosa non va, aggiusta **solo** i file in `src/services/`

### Dove NON Devi Toccare ✋
- ❌ Pages
- ❌ Components
- ❌ Context
- ❌ Styles

Tutto il resto è già pronto! 🎉

---

## 📞 Comunicazione con Backend Team

### Cosa Chiedere Loro
1. ❓ "Qual è l'URL base del vostro server?" (es: `http://localhost:8000`)
2. ❓ "Gli endpoint seguono questa struttura?" (mostra questo documento)
3. ❓ "Il formato delle risposte è uguale?" (mostra esempi)
4. ❓ "Quando posso iniziare a testare?" (data)

### Cosa Dargli
1. 📄 Questo documento (`API_INTEGRATION_MAP.md`)
2. 📄 `BACKEND_ANALYSIS.md` (analisi completa)
3. 📄 `src/types/index.ts` (TypeScript interfaces)

---

*Documento creato: 12 Novembre 2025*  
*StyleFinder AI - Frontend Team*
