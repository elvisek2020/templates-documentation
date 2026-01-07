# Šablona: Login Page

## 📋 Přehled

Login page je první obrazovka, kterou uživatel vidí. Umožňuje zadat jméno a připojit se k serveru přes WebSocket.

---

## 🏗️ HTML Struktura

### Nadpis (Header)

Nadpis je společný pro všechny obrazovky a zobrazuje se na vrcholu stránky. Je to klikatelný element, který při kliknutí obnoví stránku.

```html
<header>
    <h1 id="main-title" style="cursor: pointer;" title="Klikni pro obnovení stránky">Název aplikace</h1>
</header>
```

**Elementy**:
- `header`: Kontejner pro nadpis
- `main-title`: Hlavní nadpis aplikace (h1) - klikatelný element

**Funkcionalita**:
- Kliknutí na nadpis obnoví stránku (`window.location.reload()`)
- Cursor se změní na pointer při najetí myši (`cursor: pointer`)
- Tooltip zobrazí "Klikni pro obnovení stránky"
- Nadpis je společný pro všechny obrazovky (login, lobby, game)

**CSS styly**:
```css
header {
    text-align: center;
    margin-bottom: 30px;
    width: 100%;
}

header h1 {
    color: #2c3e50;
    font-size: 2.5em; /* nebo 3.0em podle projektu */
    text-shadow: 2px 2px 4px rgba(255,255,255,0.8), 0 0 10px rgba(255,255,255,0.5);
    cursor: pointer;
    user-select: none; /* Zabraňuje výběru textu */
}
```

**Volitelné pozicování** (pro některé projekty):
```css
/* Absolutní pozicování na vrcholu stránky */
header {
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    z-index: 1000;
}
```

**Responzivní design**:
```css
@media (max-width: 768px) {
    header h1 {
        font-size: 1.8em;
        margin-bottom: 15px;
    }
}

@media (max-width: 480px) {
    header h1 {
        font-size: 1.5em;
        margin-bottom: 10px;
    }
}
```

**JavaScript inicializace**:
```javascript
window.addEventListener('DOMContentLoaded', () => {
    const mainTitle = document.getElementById('main-title');
    if (mainTitle) {
        mainTitle.addEventListener('click', () => {
            window.location.reload();
        });
    }
});
```

### Základní struktura

Login screen obsahuje box-style komponentu (box s bílým pozadím, border-radius, box-shadow) s formulářem pro přihlášení.

```html
<!-- Login Screen -->
<div id="login-screen" class="screen">
    <div class="box login-box">
        <h2>Přihlášení</h2>
        <input type="text" id="player-name" placeholder="Zadej své jméno" maxlength="20">
        <button id="join-btn" class="btn-primary">Přihlásit</button>
        <div id="login-error" class="error-message"></div>
        <!-- Volitelné: další odkazy nebo informace -->
        <div id="version-info" class="version-info"></div>
    </div>
</div>
```

**Box-style komponenty**:
- Všechny komponenty používají třídu `.box` pro konzistentní vzhled
- Bílé pozadí, border-radius, box-shadow, padding
- Responzivní design pro mobilní zařízení

### Elementy a jejich účel

| Element ID | Typ | Účel | Povinné |
|------------|-----|------|---------|
| `main-title` | h1 | Hlavní nadpis aplikace (v headeru) | ✅ |
| `login-screen` | div | Kontejner pro celou login obrazovku | ✅ |
| `player-name` | input | Input pro zadání jména hráče | ✅ |
| `join-btn` | button | Tlačítko pro přihlášení | ✅ |
| `login-error` | div | Zobrazení chybových zpráv | ✅ |
| `version-info` | div | Zobrazení verze aplikace | ❌ |

### Screen management

- **Třída `screen`**: Základní třída pro všechny obrazovky
- **Třída `hidden`**: Skryje obrazovku (přidá se/odebere podle potřeby)
- **Přepínání obrazovek**: Použijte funkci `showScreen('login-screen')`

**CSS pro screen management**:

```css
/* Varianta 1: Skrývání pomocí třídy hidden */
.screen {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
}

.screen.hidden {
    display: none;
}

/* Varianta 2: Skrývání pomocí :not(.hidden) */
.screen {
    display: none;
}

.screen:not(.hidden) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20px;
}
```

**Login screen specifické styly**:

```css
/* Login screen může mít vlastní pozadí */
#login-screen:not(.hidden) {
    background-image: url('/static/images/pozadi.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
}
```

---

## 🎨 CSS Styly

### Box-style komponenty

Všechny komponenty používají box-style design pro konzistentní vzhled:

```css
/* Základní box styling - společný pro všechny box komponenty */
.box {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    border: 2px solid rgba(255,255,255,0.3);
    margin: 15px;
}
```

### Základní styly pro login-box

```css
/* Kontejner pro login box */
.login-box {
    min-width: 400px;
    max-width: 100%;
    text-align: center;
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    border: 2px solid rgba(255,255,255,0.3);
    margin: 15px;
}

/* Volitelné: Průhledné pozadí s blur efektem */
.login-box {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
}

/* Nadpis */
.login-box h2 {
    margin-bottom: 20px;
    color: #667eea; /* Primární barva aplikace */
    text-align: center;
}

/* Input pole */
.login-box input {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border: 2px solid #ddd;
    border-radius: 8px;
    margin-bottom: 15px;
    outline: none;
    transition: border-color 0.3s;
    box-sizing: border-box;
}

/* Focus stav inputu */
.login-box input:focus {
    border-color: #667eea;
}

/* Verze aplikace (volitelné) */
.version-info {
    text-align: center;
    margin-top: 20px;
    font-size: 0.85em;
    color: #999;
    opacity: 0.7;
}
```

### Responzivní design (mobilní zařízení)

```css
@media (max-width: 768px) {
    .login-box {
        min-width: auto;
        width: 100%;
        max-width: 100%;
    }
    
    .login-box input {
        font-size: 16px; /* Prevents zoom on iOS */
        padding: 14px;
    }
}
```

### Error message styly

```css
.error-message {
    color: #dc3545;
    margin-top: 10px;
    padding: 10px;
    background: #f8d7da;
    border-radius: 6px;
    display: none; /* Skryté ve výchozím stavu */
}

.error-message.show {
    display: block; /* Zobrazí se při přidání třídy 'show' */
}
```

### Tlačítko styly

```css
.btn-primary {
    padding: 12px 24px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: bold;
    width: 100%;
    margin-top: 10px;
    background: #667eea;
    color: white;
}

.btn-primary:hover {
    background: #5568d3;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
}
```

---

## 💻 JavaScript Logika

### 1. Inicializace při načtení stránky

```javascript
window.addEventListener('load', () => {
    // Načtení tokenu ze sessionStorage (pro reconnect)
    token = sessionStorage.getItem('token');
    playerId = sessionStorage.getItem('player_id');
    
    // Předvyplnění jména hráče, pokud existuje v sessionStorage
    const savedPlayerName = sessionStorage.getItem('player_name');
    const nameInput = document.getElementById('player-name');
    if (savedPlayerName && nameInput) {
        nameInput.value = savedPlayerName;
    }
    
    // Načtení verze buildu z JSON souboru
    const versionInfo = document.getElementById('version-info');
    if (versionInfo) {
        fetch('/static/version.json')
            .then(response => response.json())
            .then(data => {
                versionInfo.textContent = data.version || 'v.unknown';
            })
            .catch(error => {
                console.error('Chyba při načítání verze:', error);
                versionInfo.textContent = 'v.unknown';
            });
    }
    
    // Přidání event listeneru pro tlačítko Přihlásit
    const joinBtn = document.getElementById('join-btn');
    if (joinBtn) {
        joinBtn.addEventListener('click', handleJoin);
    }
    
    // Pokud máme token, zkusíme reconnect
    if (token && playerId) {
        connectWebSocket();
    }
});
```

**Načítání verze**:
- Verze se načítá z `/static/version.json` pomocí fetch API
- JSON soubor obsahuje: `{"version": "v.20251229.0843"}`
- Pokud se verze nepodaří načíst, zobrazí se `v.unknown`
- Element `version-info` je volitelný - pokud není v HTML, načítání se přeskočí

### 2. Event listener pro tlačítko Přihlásit

```javascript
function handleJoin() {
    const nameInput = document.getElementById('player-name');
    if (!nameInput) return;
    
    const name = nameInput.value.trim();
    
    // Validace jména
    if (!name) {
        showError('Zadej jméno');
        return;
    }
    
    // Uložení jména do sessionStorage pro příští hraní
    sessionStorage.setItem('player_name', name);
    
    // Pokud nemáme token, vytvoříme nový WebSocket
    if (!token && ws) {
        ws.onclose = null; // Zrušíme reconnect
        ws.close();
        ws = null;
    }
    
    // Uložení jména do dočasné proměnné pro pozdější použití
    window.pendingJoinName = name;
    
    // Zavření existujícího WebSocket, pokud není otevřený
    if (ws && ws.readyState !== WebSocket.OPEN) {
        ws.onclose = null;
        ws.close();
        ws = null;
    }
    
    // Vytvoření nového WebSocket
    connectWebSocket();
    
    // Čekání na otevření WebSocket (max 5 sekund)
    let attempts = 0;
    const maxAttempts = 50; // 50 * 100ms = 5 sekund
    const checkInterval = setInterval(() => {
        attempts++;
        if (sendJoinMessage(name)) {
            clearInterval(checkInterval);
            delete window.pendingJoinName;
        } else if (ws && (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING)) {
            clearInterval(checkInterval);
            showError('Připojení se nezdařilo. Zkus to znovu.');
        } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            showError('Timeout při připojování. Zkus to znovu.');
        }
    }, 100);
}
```

### 3. Odeslání join zprávy

```javascript
function sendJoinMessage(name) {
    if (ws && ws.readyState === WebSocket.OPEN && token) {
        // Pokud máme token, můžeme použít existující WebSocket
        const joinMessage = { type: 'join', name: name };
        try {
            ws.send(JSON.stringify(joinMessage));
            return true;
        } catch (error) {
            console.error('Chyba při odesílání join zprávy:', error);
            return false;
        }
    }
    return false;
}
```

### 4. WebSocket připojení

```javascript
function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
        if (token) {
            // Reconnect s tokenem
            ws.send(JSON.stringify({ type: 'reconnect', token: token }));
        } else if (window.pendingJoinName) {
            // Odeslání join zprávy s jménem
            const name = window.pendingJoinName;
            const joinMessage = { type: 'join', name: name };
            ws.send(JSON.stringify(joinMessage));
            delete window.pendingJoinName;
        }
    };
    
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleMessage(message);
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        showError('Chyba připojení');
    };
    
    ws.onclose = (event) => {
        // Reconnect pouze pokud máme token
        if (token) {
            setTimeout(() => {
                if (token) {
                    connectWebSocket();
                }
            }, 1000);
        }
    };
}
```

### 5. Zpracování zpráv ze serveru

```javascript
function handleMessage(message) {
    switch (message.type) {
        case 'join_ok':
            // Úspěšné přihlášení
            playerId = message.player_id;
            token = message.token;
            sessionStorage.setItem('player_id', playerId);
            sessionStorage.setItem('token', token);
            
            // Přepnutí na lobby screen
            showScreen('lobby-screen');
            break;
        
        case 'error':
            // Chyba ze serveru
            showError(message.message || 'Nastala chyba');
            break;
        
        case 'reconnect_ok':
            // Úspěšný reconnect
            playerId = message.player_id;
            showScreen('lobby-screen');
            break;
    }
}
```

### 6. Zobrazení chybové zprávy

```javascript
function showError(message) {
    const errorDiv = document.getElementById('login-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000); // Skryje se po 5 sekundách
    }
}
```

### 7. Přepínání obrazovek

```javascript
function showScreen(screenId) {
    // Skryje všechny obrazovky
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Zobrazí požadovanou obrazovku
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }
}
```

### 8. Enter klávesa pro submit

```javascript
document.getElementById('player-name')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('join-btn').click();
    }
});
```

---

## 🔌 WebSocket Komunikace

### Client → Server

#### Join zpráva
```json
{
  "type": "join",
  "name": "Jméno hráče"
}
```

**Povinná pole**:
- `type`: "join"
- `name`: String (max 20 znaků)

**Volitelná pole** (pro rozšířené funkce):
- `password`: String (pro admin/super_power režim)

### Server → Client

#### Join OK
```json
{
  "type": "join_ok",
  "player_id": "uuid",
  "token": "uuid",
  "is_super_power": false
}
```

**Pole**:
- `type`: "join_ok"
- `player_id`: UUID hráče
- `token`: UUID token pro reconnect
- `is_super_power`: Boolean (volitelné)

#### Error
```json
{
  "type": "error",
  "message": "Chybová zpráva"
}
```

**Možné chyby**:
- "Jméno je povinné"
- "Jméno je již obsazené"
- "Lobby je plné (max 5 hráčů)"
- "Nesprávné heslo" (pro admin režim)

#### Reconnect OK
```json
{
  "type": "reconnect_ok",
  "player_id": "uuid"
}
```

---

## 📦 Verze aplikace

### JSON soubor s verzí

Vytvořte soubor `/static/version.json` s následujícím obsahem:

```json
{
  "version": "v.20251229.0843"
}
```

**Formát verze**:
- Doporučený formát: `v.YYYYMMDD.HHMM` (např. `v.20251229.0843`)
- Verze se zobrazuje v elementu `version-info` na login stránce
- Verze se načítá automaticky při načtení stránky pomocí fetch API

### Alternativní implementace (statická verze)

Pokud nechcete používat JSON soubor, můžete verzi zobrazit přímo v HTML:

```html
<div style="text-align: center; margin-top: 20px; font-size: 0.85em; color: #666;">
    v.20251229.0750
</div>
```

**Doporučení**: Použijte dynamické načítání z JSON souboru, aby bylo možné aktualizovat verzi bez změny HTML.

---

## 📦 SessionStorage

### Ukládání dat

```javascript
// Uložení jména hráče
sessionStorage.setItem('player_name', name);

// Uložení tokenu a player_id (po úspěšném join)
sessionStorage.setItem('token', token);
sessionStorage.setItem('player_id', playerId);
```

### Načtení dat

```javascript
// Načtení tokenu a player_id při načtení stránky
token = sessionStorage.getItem('token');
playerId = sessionStorage.getItem('player_id');

// Načtení jména pro předvyplnění
const savedPlayerName = sessionStorage.getItem('player_name');
```

### Smazání dat

```javascript
// Při odhlášení nebo chybě
sessionStorage.removeItem('token');
sessionStorage.removeItem('player_id');
sessionStorage.removeItem('player_name');
```

---

## ✅ Checklist pro implementaci

### HTML struktura
- [ ] Header s nadpisem (`main-title`)
- [ ] Login screen kontejner (`login-screen`)
- [ ] Login box (`login-box`) s box-style styling
- [ ] Input pole pro jméno (`player-name`)
- [ ] Tlačítko pro přihlášení (`join-btn`)
- [ ] Error message element (`login-error`)
- [ ] Version info element (`version-info`) - volitelné

### CSS styly
- [ ] Box-style komponenty (`.box`)
- [ ] CSS styly pro header a nadpis
- [ ] CSS styly pro login-box
- [ ] Responzivní design pro mobilní zařízení
- [ ] Error message styly
- [ ] Tlačítko styly (`.btn-primary`)

### JavaScript funkcionalita
- [ ] JavaScript inicializace pro kliknutí na nadpis (reload)
- [ ] JavaScript inicializace při načtení stránky
- [ ] Načítání verze z `/static/version.json`
- [ ] Event listener pro tlačítko Přihlásit
- [ ] Validace jména (ne prázdné)
- [ ] WebSocket připojení
- [ ] Odeslání join zprávy
- [ ] Zpracování join_ok zprávy
- [ ] Zpracování error zprávy
- [ ] Zobrazení chybových zpráv
- [ ] Přepnutí na lobby screen po úspěšném join
- [ ] SessionStorage pro ukládání jména a tokenu
- [ ] Reconnect funkcionalita
- [ ] Enter klávesa pro submit

### Soubory
- [ ] Vytvoření `/static/version.json` s verzí aplikace

---

## 🎯 Klíčové body

1. **Box-style komponenty**: Všechny komponenty používají konzistentní box-style design (bílé pozadí, border-radius, box-shadow)
2. **Nadpis (Header)**: Klikatelný nadpis, který obnoví stránku - společný pro všechny obrazovky
3. **Validace na klientovi**: Zkontrolujte, že jméno není prázdné
4. **SessionStorage**: Ukládejte jméno pro pohodlí uživatele
5. **Token systém**: Ukládejte token pro reconnect
6. **Verze aplikace**: Načítání verze z JSON souboru pro snadnou aktualizaci
7. **Error handling**: Zobrazujte srozumitelné chybové zprávy
8. **WebSocket management**: Správně spravujte životní cyklus WebSocket připojení
9. **UX**: Poskytněte feedback (loading, error, success)
10. **Responzivní design**: Optimalizace pro mobilní zařízení

---

## 🔧 Přizpůsobení pro vlastní projekt

### Změna textů
- Upravte placeholder v inputu
- Změňte text tlačítka
- Upravte chybové zprávy

### Změna stylů
- Upravte barvy (primární barva: `#667eea`)
- Změňte velikosti a padding
- Přizpůsobte responzivní breakpointy

### Rozšíření funkcionality
- Přidejte heslo pro admin režim
- Přidejte validaci jména (min/max délka, znaky)
- Přidejte CAPTCHA nebo jinou ochranu
- Přidejte "Zapamatovat si mě" funkcionalitu

---

## 📚 Související dokumentace

- [WebSocket komunikace](./ARCHITEKTURA_A_NAVOD_PRO_PODOBNE_APLIKACE.md#websocket-komunikace)
- [Lobby Page Template](./TEMPLATE_LOBBY_PAGE.md)
- [Frontend architektura](./ARCHITEKTURA_A_NAVOD_PRO_PODOBNE_APLIKACE.md#frontend-architektura)

