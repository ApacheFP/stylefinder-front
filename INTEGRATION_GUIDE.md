# 🔗 Guida Integrazione Frontend-Backend

## 📋 Panoramica

Questo documento descrive le modifiche effettuate per collegare il frontend React al backend Flask di StyleFinder AI.

---

## 🔧 Modifiche Effettuate

### Frontend (`stylefinder-front/`)

#### 1. `src/services/api.ts`
**Configurazione Axios per sessioni cookie-based**

```typescript
// PRIMA: JWT Token
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  // ...
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  config.headers.Authorization = `Bearer ${token}`;
  // ...
});

// DOPO: Cookie Sessions (Flask-Login)
const api = axios.create({
  baseURL: 'http://localhost:5001/api',  // Porta 5001 (5000 usata da AirPlay su macOS)
  withCredentials: true, // Invia cookie con ogni richiesta
  // ...
});
// Rimosso interceptor JWT
```

---

#### 2. `src/services/authService.ts`
**Aggiornati endpoint autenticazione**

| Funzione | Prima | Dopo |
|----------|-------|------|
| `login()` | `POST /auth/login` | `POST /user/login` |
| `signUp()` | `POST /auth/signup` | `POST /user/` + auto-login |
| `getCurrentUser()` | `GET /auth/me` | `GET /user/session` |
| `logout()` | Solo localStorage | `GET /user/logout` |

**Nota**: Il backend non ha un campo `name`, quindi viene estratto dall'email.

---

#### 3. `src/services/chatService.ts`
**Aggiornati endpoint chat e formato dati**

| Funzione | Prima | Dopo |
|----------|-------|------|
| `sendMessage()` | `POST /chat/message` | `POST /messages/send` |
| `getChatHistory()` | `GET /chat/history` | `GET /conversations` |
| `getChatConversation()` | `GET /chat/{id}` | `GET /chat` (con body `conv_id`) |
| `renameConversation()` | - | `PUT /conversations/rename` |
| `deleteConversation()` | - | `DELETE /conversations/delete` |

**Mapping campi outfit**:
```
Backend → Frontend
─────────────────────
title      → name
image_link → imageUrl
url        → link
```

---

#### 4. `src/services/preferencesService.ts`
**Aggiornato per backend**

- `getPreferences()`: Usa `/user/session` (le preferenze sono nell'oggetto user)
- `updatePreferences()`: `PUT /preferences`

---

#### 5. `src/context/AuthContext.tsx`
**Rimosso mock auto-login**

- Rimosso mock user automatico
- Usa sessioni cookie invece di localStorage token
- `logout()` ora è async e chiama l'API

---

#### 6. `src/hooks/useChatMessages.ts`
**Integrato con API reali**

- `sendMessage()`: Chiama `chatService.sendMessage()` invece di mock
- Gestisce creazione nuove conversazioni
- Trasforma risposta backend in formato frontend

---

#### 7. `src/pages/ChatPage.tsx`
**Rimossi mock data, integrato con API**

- Rimossi `MOCK_CHAT_HISTORY`, `MOCK_CHAT_MESSAGES`, `MOCK_CHAT_FILTERS`
- Aggiunto `loadChatHistory()` da API
- Aggiornamento automatico history quando si crea nuova chat
- Preparate funzioni `handleDeleteChat()` e `handleRenameChat()`

---

#### 8. `.env` (nuovo file)
```bash
# Porta 8000 come configurato dal team backend
VITE_API_BASE_URL=http://localhost:8000/api
```

---

### Backend (`BackEnd-StyleFinderAI/`)

#### 1. `requirements.txt`
Aggiunto `flask-cors` per gestire richieste cross-origin.

#### 2. `app.py`
Aggiunta configurazione CORS:

```python
from flask_cors import CORS

CORS(app, 
     origins=[
         "http://localhost:5173", 
         "http://localhost:5174",
         "http://127.0.0.1:5173",
         "http://127.0.0.1:5174"
     ],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
```

---

## 🗺️ Mappa Endpoint API

### Autenticazione
| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| POST | `/api/user/` | Registrazione | ❌ |
| POST | `/api/user/login` | Login | ❌ |
| GET | `/api/user/logout` | Logout | ✅ |
| GET | `/api/user/session` | Verifica sessione | ✅ |
| POST | `/api/user/update` | Aggiorna credenziali | ✅ |

### Chat
| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| POST | `/api/messages/send` | Invia messaggio + riceve outfit | ❌* |
| GET | `/api/conversations` | Lista conversazioni | ✅ |
| GET | `/api/chat` | Messaggi di una chat | ✅ |
| PUT | `/api/conversations/rename` | Rinomina chat | ✅ |
| DELETE | `/api/conversations/delete` | Elimina chat | ✅ |

*Funziona anche senza auth (non salva la conversazione)

### Preferenze
| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| PUT/POST | `/api/preferences` | Aggiorna preferenze | ✅ |

---

## 🧪 Testing

### Prerequisiti

1. **Database PostgreSQL** configurato e running
2. **Python 3.8+** installato
3. **Node.js 18+** installato

### Step 1: Avvia il Backend

```bash
# Naviga nella cartella backend
cd BackEnd-StyleFinderAI

# Crea ambiente virtuale (opzionale ma consigliato)
python3 -m venv venv
source venv/bin/activate

# Installa dipendenze
pip3 install -r requirements.txt

# Avvia il server sulla porta 8000
flask run --host=0.0.0.0 --port=8000
```

> **Nota**: Le variabili d'ambiente per il database (DATABASE_URL, ecc.) sono configurate **solo nel backend**. Il frontend non accede mai direttamente al DB.

Il backend sarà disponibile su `http://localhost:8000`

### Step 2: Avvia il Frontend

```bash
# Naviga nella cartella frontend
cd stylefinder-front

# Installa dipendenze
npm install

# Avvia dev server
npm run dev
```

> **Variabili d'ambiente frontend** (`.env`):
> ```bash
> VITE_API_BASE_URL=http://localhost:5000/api
> ```
> Questa è l'**unica** variabile necessaria: indica dove si trova il backend API.

Il frontend sarà disponibile su `http://localhost:5173`

### Step 3: Test Funzionalità

#### ✅ Test 1: Registrazione
1. Vai su `http://localhost:5173/signup`
2. Inserisci email e password
3. Clicca "Sign Up"
4. ✓ Dovresti essere reindirizzato a `/preferences`

#### ✅ Test 2: Login
1. Vai su `http://localhost:5173/login`
2. Inserisci credenziali create
3. Clicca "Log In"
4. ✓ Dovresti essere reindirizzato a `/chat`

#### ✅ Test 3: Sessione Persistente
1. Dopo il login, ricarica la pagina (F5)
2. ✓ Dovresti rimanere loggato (non redirect a login)

#### ✅ Test 4: Chat (senza login)
1. Vai su `http://localhost:5173/chat` senza essere loggato
2. Scrivi un messaggio, es: "Voglio un outfit casual"
3. ✓ Dovresti ricevere suggerimenti outfit
4. ✓ La conversazione NON viene salvata

#### ✅ Test 5: Chat (con login)
1. Effettua login
2. Vai su `/chat`
3. Invia un messaggio
4. ✓ Dovresti vedere la nuova chat nella sidebar
5. Ricarica la pagina
6. ✓ La conversazione dovrebbe essere ancora lì

#### ✅ Test 6: Upload Immagine
1. Nella chat, clicca l'icona 📎 o trascina un'immagine
2. Invia con un messaggio
3. ✓ Dovresti vedere l'immagine nel messaggio
4. ✓ Dovresti ricevere outfit consigliati

#### ✅ Test 7: Logout
1. Clicca sul bottone logout nell'header
2. ✓ Dovresti essere reindirizzato alla landing page
3. Vai su `/chat`
4. ✓ La sidebar dovrebbe essere vuota (nessuna history)

---

## 🐛 Troubleshooting

### Errore: CORS
```
Access to XMLHttpRequest blocked by CORS policy
```
**Soluzione**: Verifica che `flask-cors` sia installato e configurato in `app.py`

### Errore: 401 Unauthorized
```
Request failed with status code 401
```
**Possibili cause**:
- Sessione scaduta → Ri-effettua login
- Cookie non inviato → Verifica `withCredentials: true` in api.ts

### Errore: Network Error
```
Network Error / ERR_CONNECTION_REFUSED
```
**Soluzione**: Verifica che il backend sia running su porta 5000

### Chat non si salva
**Causa**: Non sei loggato
**Soluzione**: Effettua login prima di usare la chat

---

## 📝 Note Tecniche

### Autenticazione
- Il backend usa **Flask-Login** con sessioni cookie
- Il frontend invia cookie automaticamente con `withCredentials: true`
- Non c'è JWT, non serve localStorage per token

### Formato Dati
- Backend restituisce outfit con campi: `title`, `image_link`, `url`, `price`
- Frontend trasforma in: `name`, `imageUrl`, `link`, `price`
- La trasformazione avviene in `chatService.ts`

### Endpoint GET /api/chat
- Questo endpoint usa un body JSON in una richiesta GET (non standard)
- Potrebbe dare problemi con alcuni client HTTP
- Considerare di cambiarlo in POST o usare query params

---

## 🚀 Prossimi Passi

1. **UI/UX Improvements**: Migliorare l'interfaccia utente
2. **Error Handling**: Messaggi di errore più user-friendly
3. **Loading States**: Skeleton loaders durante caricamento
4. **Rename/Delete Chat**: Collegare UI alle funzioni già pronte
5. **Preferences Page**: Integrare con backend
