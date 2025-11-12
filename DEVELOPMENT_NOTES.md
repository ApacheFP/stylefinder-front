# 🛠️ Development Notes

## Mock Auto-Login for Development

Per facilitare lo sviluppo e i test, l'applicazione include un **auto-login automatico** con un utente mock.

### Utente Mock di Default
```javascript
{
  id: 'mock-user-1',
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    gender: 'man',
    favoriteStyles: ['Smart Casual', 'Business'],
    favoriteColors: ['Navy', 'Black', 'White'],
    favoriteBrands: ['J.Crew', 'Brooks Brothers']
  }
}
```

### Come Funziona
- Se NON c'è un token in localStorage, l'app crea automaticamente un utente mock
- Questo permette di testare tutte le funzionalità senza fare login ogni volta
- Il token mock è: `'mock-token-for-development'`

### ⚠️ IMPORTANTE: Disabilitare Prima di Production

**File da modificare:** `src/context/AuthContext.tsx`

**Rimuovi questo blocco di codice:**
```typescript
else {
  // TODO: Remove this mock auto-login before production
  // For development: Auto-login with mock user
  const mockUser: User = {
    id: 'mock-user-1',
    name: 'John Doe',
    email: 'john@example.com',
    preferences: { ... },
  };
  setUser(mockUser);
  localStorage.setItem('authToken', 'mock-token-for-development');
}
```

**Sostituisci con:**
```typescript
// No auto-login in production
```

### Testing Manual Login/Logout

Se vuoi testare il login manuale durante lo sviluppo:

1. Apri DevTools → Application → Local Storage
2. Cancella `authToken`
3. Ricarica la pagina
4. Ora vedrai i bottoni "Log In" / "Sign Up" nel header

---

## Header User Menu

Il componente Header ora mostra:

### Utente NON loggato
- Bottone "Log In"
- Bottone "Sign Up" (primary style)

### Utente loggato
- Nome utente
- Avatar circolare con iniziale (background blu primario)
- Click sull'avatar apre menu dropdown con:
  - Info utente (nome + email)
  - Link a Preferences
  - Link a Profile
  - Bottone Logout (rosso)

### Features
- ✅ Click outside chiude il menu
- ✅ Hover states su tutti gli elementi
- ✅ Icone Lucide React
- ✅ Animazioni smooth

---

## Image Upload

### Come Testare
1. Vai alla ChatPage
2. **Metodo 1:** Click sull'icona graffetta 📎
3. **Metodo 2:** Trascina un'immagine direttamente nella chat

### Validazioni
- Formati supportati: JPEG, PNG, WebP
- Dimensione massima: 5MB
- Se validazione fallisce, appare un alert

### Preview
- Mostra thumbnail dell'immagine
- Nome del file
- Bottone "X" per rimuovere

### Anti-Flickering
Per evitare il flickering durante il drag and drop, usiamo un **drag counter** con `useRef`:
- `dragEnter` incrementa il counter
- `dragLeave` decrementa il counter
- L'overlay appare solo quando counter > 0
- Questo previene il flickering causato dagli eventi nested

### Backend Integration
Le immagini vengono inviate come `FormData`:
```javascript
formData.append('message', inputMessage);
formData.append('filters', JSON.stringify(filters));
formData.append('image', selectedImage);
```

---

## Product Cards

### Nuove Dimensioni
- Max width: 200px
- Image height: 200px (fixed)
- Padding ridotto: 3 (invece di 4)
- Font sizes ridotti per migliore proporzione

### Before vs After
- **Before:** aspect-square (troppo grande)
- **After:** fixed height 200px (più proporzionato)

### Layout nel Chat
- Le card sono dentro un **container bianco unificato** con bordo e padding
- Questo include: testo del messaggio, product cards e bottone "Explain"
- La spiegazione (se presente) ha uno sfondo grigio chiaro per distinguersi

---

## Chat Message Layout

### User Messages
- Sfondo blu primario
- Testo bianco
- Allineato a destra
- Può includere immagini caricate

### Assistant Messages
- **Container unificato** con sfondo bianco, bordo e padding
- Include tutto: testo + product cards + bottone explain
- Layout verticale con spacing consistente
- La spiegazione dell'outfit ha sfondo grigio chiaro per contrasto visivo

### Explain Outfit Button
- **Loading Animation**: Quando l'utente clicca su "Explain this outfit", appare un'animazione con tre pallini
- Il bottone mostra "Generating explanation..." con i pallini animati
- L'animazione dura 1.5 secondi (mock timeout)
- Una volta generata, il bottone diventa "Explanation shown below" e viene disabilitato
- La spiegazione appare sotto con sfondo grigio chiaro

---

## Tips per Sviluppo

### Hot Reload
Vite è configurato per hot reload. Le modifiche ai file sono immediate.

### TypeScript Errors
Se vedi errori TypeScript nel terminale, verifica:
- Tutte le prop sono definite correttamente
- I tipi importati sono corretti
- Non ci sono import non utilizzati

### Tailwind Autocomplete
Assicurati che il plugin Tailwind CSS IntelliSense sia installato in VS Code.

### Mock Data
Tutti i mock data sono in `src/utils/mockData.ts`. Modificali per testare scenari diversi.

---

## Prossimi Step (Opzionale)

### UI Enhancements
- [ ] Animazioni con Framer Motion
- [ ] Toast notifications per feedback
- [ ] Loading skeletons
- [ ] Empty states più ricchi
- [ ] Dark mode

### Features
- [ ] Profile page
- [ ] Chat search/filter
- [ ] Outfit favorites/save
- [ ] Share outfit via link
- [ ] Multi-language support

### Performance
- [ ] Image lazy loading
- [ ] Code splitting
- [ ] Bundle size optimization
- [ ] PWA support

---

## Troubleshooting

### "Cannot read property of undefined"
- Verifica che l'AuthContext sia wrappato attorno all'app in `main.tsx`

### "Network Error"
- Normale! Non c'è backend ancora. L'app usa mock data.

### Immagini non si caricano
- Verifica che l'URL sia accessibile
- I placeholder `via.placeholder.com` funzionano sempre

### Tailwind classes non funzionano
- Riavvia il dev server: `npm run dev`
- Verifica `tailwind.config.js` e `postcss.config.js`

---

## Contatti

Per domande o problemi, contatta il team di sviluppo!
