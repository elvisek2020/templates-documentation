# Šablona: Lobby Page

## 📋 Přehled

Lobby page zobrazuje seznam hráčů, jejich ready status a umožňuje hráči označit se jako připravený. Hra se automaticky spustí, když jsou všichni hráči připraveni.

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

Lobby screen obsahuje box-style komponentu (box s bílým pozadím, border-radius, box-shadow) s formulářem pro shromažďování hráčů před vstupem do hry.

```html
<!-- Lobby Screen -->
<div id="lobby-screen" class="screen hidden">
    <div class="box lobby-box">
        <h2>Lobby</h2>
        <div id="players-list" class="players-list"></div>
        <!-- Volitelné: výběr barvy (např. pro Člověče, nezlob se) -->
        <div id="color-selection" class="color-selection" style="display: none;">
            <label>Vyberte barvu:</label>
            <div id="color-buttons" class="color-buttons"></div>
        </div>
        <button id="ready-btn" class="btn-primary">Připraven</button>
        <!-- Volitelné: tlačítko pro manuální spuštění hry -->
        <button id="start-game-btn" class="btn-primary" style="display: none;">Spustit hru</button>
        <button id="leave-btn" class="btn-secondary">Odejít</button>
        <div id="lobby-status" class="status-message"></div>
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
| `lobby-screen` | div | Kontejner pro celou lobby obrazovku | ✅ |
| `lobby-box` | div | Box-style komponenta pro lobby (třída `.box`) | ✅ |
| `players-list` | div | Kontejner pro seznam hráčů | ✅ |
| `ready-btn` | button | Tlačítko pro označení jako připravený | ✅ |
| `leave-btn` | button | Tlačítko pro opuštění lobby | ✅ |
| `lobby-status` | div | Zobrazení stavu lobby | ✅ |
| `color-selection` | div | Kontejner pro výběr barvy hráče | ❌ |
| `color-buttons` | div | Kontejner pro tlačítka barev | ❌ |
| `start-game-btn` | button | Tlačítko pro manuální spuštění hry | ❌ |

### Dynamicky generované elementy

- **Player items**: Každý hráč je zobrazen jako `<div class="player-item">` v `players-list`
  - Obsahuje jméno hráče a status (připraven/čeká/ve hře)
  - Může obsahovat barvu hráče (pro hry s barvami)
- **Status text**: Dynamicky se mění podle stavu hry
- **Color buttons**: Dynamicky generované tlačítka pro výběr barvy (pokud je podporováno)

### Screen management

- **Třída `screen`**: Základní třída pro všechny obrazovky
- **Třída `hidden`**: Skryje obrazovku (přidá se/odebere podle potřeby)
- **Přepínání obrazovek**: Použijte funkci `showScreen('lobby-screen')`

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

**Lobby screen specifické styly**:

```css
/* Lobby screen může mít vlastní pozadí */
#lobby-screen:not(.hidden) {
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

### Základní styly pro lobby-box

```css
/* Kontejner pro lobby box */
.lobby-box {
    min-width: 500px;
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
.lobby-box {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    margin: 0 auto;
}

/* Nadpis */
.lobby-box h2 {
    margin-bottom: 20px;
    color: #667eea;
    text-align: center;
}

/* Seznam hráčů */
.players-list {
    margin-bottom: 20px;
}
```

### Player item styly

```css
/* Jednotlivý hráč v seznamu */
.player-item {
    padding: 12px;
    margin: 8px 0;
    background: #f5f5f5;
    border-radius: 8px;
    border: 2px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Hráč je připraven */
.player-item.ready {
    background: #d4edda;
    border-color: #28a745;
}

/* Levá strana player itemu */
.player-item-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* Jméno hráče */
.player-item .player-name {
    font-weight: bold;
}

/* Status hráče (připraven/čeká) */
.player-item .ready-status {
    color: #28a745;
    font-weight: bold;
    margin-left: auto;
}
```

### Status message styly

```css
.status-message {
    margin-top: 15px;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
    font-weight: bold;
    font-size: 0.95em;
}

/* Různé barvy podle stavu */
.status-message.waiting {
    color: #667eea;
    background: #e7f0ff;
}

.status-message.ready {
    color: #28a745;
    background: #d4edda;
}

.status-message.playing {
    color: #ff9800;
    background: #fff3e0;
}

.status-message.finished {
    color: #dc3545;
    background: #f8d7da;
}
```

### Responzivní design (mobilní zařízení)

```css
@media (max-width: 768px) {
    .lobby-box {
        min-width: auto;
        width: 100%;
        max-width: 100%;
    }
    
    .player-item {
        padding: 14px;
        font-size: 16px;
    }
    
    .btn-primary, .btn-secondary {
        padding: 14px 24px;
        font-size: 16px;
        min-height: 44px; /* Touch-friendly size */
    }
}

@media (max-width: 480px) {
    .lobby-box {
        padding: 15px;
        margin: 10px;
    }
    
    .player-item {
        padding: 10px;
        font-size: 0.9em;
    }
}
```

### Volitelné: Výběr barvy (Color Selection)

Pro hry, které vyžadují výběr barvy hráče (např. Člověče, nezlob se):

```css
/* Color Selection */
.color-selection {
    margin: 15px 0;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
}

.color-selection label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
    color: #333;
}

.color-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.color-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #ccc;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 1.2em;
    display: flex;
    align-items: center;
    justify-content: center;
}

.color-btn:hover:not(:disabled) {
    transform: scale(1.1);
    border-color: #333;
}

.color-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.color-btn.selected {
    border-color: #667eea;
    border-width: 3px;
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
}
```

---

## 💻 JavaScript Logika

### 1. Inicializace event listenerů

```javascript
window.addEventListener('load', () => {
    // Ready button
    const readyBtn = document.getElementById('ready-btn');
    if (readyBtn) {
        readyBtn.addEventListener('click', handleReady);
    }
    
    // Leave button
    const leaveBtn = document.getElementById('leave-btn');
    if (leaveBtn) {
        leaveBtn.addEventListener('click', handleLeave);
    }
});
```

### 2. Ready button handler

```javascript
let isReady = false;

function handleReady() {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        showError('Není připojení k serveru');
        return;
    }
    
    isReady = !isReady;
    
    // Odeslání zprávy serveru
    ws.send(JSON.stringify({ 
        type: 'set_ready', 
        ready: isReady 
    }));
    
    // Aktualizace textu tlačítka
    const readyBtn = document.getElementById('ready-btn');
    if (readyBtn) {
        readyBtn.textContent = isReady ? 'Zrušit' : 'Připraven';
    }
}
```

### 3. Leave button handler

```javascript
function handleLeave() {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        showError('Není připojení k serveru');
        return;
    }
    
    // Odeslání zprávy serveru
    ws.send(JSON.stringify({ type: 'leave_lobby' }));
    
    // Smazání tokenu a player_id
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('player_id');
    playerId = null;
    token = null;
    
    // Zavření WebSocket
    if (ws) {
        ws.onclose = null; // Zrušíme reconnect
        ws.close();
        ws = null;
    }
    
    // Přepnutí na login screen
    showScreen('login-screen');
}
```

### 4. Aktualizace lobby (hlavní funkce)

```javascript
function updateLobby(state) {
    const playersList = document.getElementById('players-list');
    if (!playersList) return;
    
    // Zjištění, zda hra probíhá
    const isGameActive = state.status === 'playing' || state.status === 'finished';
    
    // Vymazání seznamu hráčů
    playersList.innerHTML = '';
    
    // Vytvoření elementů pro každého hráče
    state.players.forEach(player => {
        const div = document.createElement('div');
        div.className = `player-item ${player.ready ? 'ready' : ''}`;
        
        // Určení status textu podle stavu hry
        let statusText = 'Čeká...';
        
        if (isGameActive) {
            // Během hry zobrazujeme jiný status
            // Pro karetní hry: kontrolujeme hand_size
            const handSize = player.hand_size || 0;
            const hasCards = handSize > 0;
            
            if (hasCards) {
                // Hráč má karty - hraje
                statusText = player.alive !== false ? 'Ve hře' : 'Vypadl';
            } else {
                // Nový hráč, který se připojil během hry
                statusText = 'V lobby';
            }
            
            // Pro deskové hry: kontrolujeme pieces_count nebo jiný indikátor
            // const piecesCount = player.pieces_count || 0;
            // statusText = piecesCount === 4 ? 'Vyhrál!' : 'Ve hře';
        } else {
            // Hra neprobíhá - zobrazujeme ready status
            statusText = player.ready ? '✓ Připraven' : 'Čeká...';
        }
        
        // Volitelné: Zobrazení barvy hráče (pro hry s barvami)
        const colorName = player.color || '';
        const colorHex = colorName ? COLORS[colorName] : '';
        const colorDisplay = colorName ? 
            `<span style="display: inline-block; width: 20px; height: 20px; background: ${colorHex}; border-radius: 50%; margin-right: 8px; border: 2px solid #333;"></span>` : 
            '';
        
        // Vytvoření HTML pro player item
        div.innerHTML = `
            <div class="player-item-left">
                ${colorDisplay}
                <span class="player-name">${escapeHtml(player.name)}</span>
            </div>
            <span class="ready-status">${statusText}</span>
        `;
        
        playersList.appendChild(div);
    });
    
    // Volitelné: Aktualizace výběru barev (pokud je podporováno)
    // updateColorSelection(state);
    
    // Aktualizace ready button podle stavu aktuálního hráče
    const myPlayer = state.players.find(p => p.player_id === playerId);
    const readyBtn = document.getElementById('ready-btn');
    const startGameBtn = document.getElementById('start-game-btn'); // Volitelné
    
    if (isGameActive) {
        // Během hry skryjeme ready button
        if (readyBtn) {
            readyBtn.style.display = 'none';
        }
        if (startGameBtn) {
            startGameBtn.style.display = 'none';
        }
    } else {
        // Když hra neprobíhá, zobrazíme ready button
        if (readyBtn) {
            readyBtn.style.display = '';
            if (myPlayer) {
                isReady = myPlayer.ready || false;
                readyBtn.textContent = isReady ? 'Zrušit' : 'Připraven';
            }
        }
        // Volitelné: Zobrazení tlačítka pro manuální spuštění hry
        if (startGameBtn) {
            if (state.can_start) {
                startGameBtn.style.display = '';
            } else {
                startGameBtn.style.display = 'none';
            }
        }
    }
    
    // Aktualizace status zprávy
    updateLobbyStatus(state, isGameActive);
}
```

### 5. Aktualizace status zprávy

```javascript
function updateLobbyStatus(state, isGameActive) {
    const statusDiv = document.getElementById('lobby-status');
    if (!statusDiv) return;
    
    // Odstranění všech tříd
    statusDiv.className = 'status-message';
    
    if (isGameActive) {
        // Během hry
        if (state.status === 'playing') {
            statusDiv.textContent = 'Probíhá hra';
            statusDiv.classList.add('playing');
            statusDiv.style.color = '#ff9800';
        } else if (state.status === 'finished') {
            statusDiv.textContent = 'Hra skončila';
            statusDiv.classList.add('finished');
            statusDiv.style.color = '#dc3545';
        }
    } else if (state.can_start) {
        // Všichni jsou připraveni
        statusDiv.textContent = 'Všichni jsou připraveni! Hra začne automaticky...';
        statusDiv.classList.add('ready');
        statusDiv.style.color = '#28a745';
    } else {
        // Čekáme na hráče
        const maxPlayers = state.max_players || 5; // Z konfigurace nebo výchozí hodnota
        statusDiv.textContent = `Čekáme na hráče... (${state.players.length}/${maxPlayers})`;
        statusDiv.classList.add('waiting');
        statusDiv.style.color = '#667eea';
    }
}
```

### 6. Volitelné: Aktualizace výběru barev

Pro hry, které vyžadují výběr barvy hráče:

```javascript
function updateColorSelection(state) {
    const colorSelection = document.getElementById('color-selection');
    const colorButtons = document.getElementById('color-buttons');
    if (!colorSelection || !colorButtons) return;
    
    const myPlayer = state.players.find(p => p.player_id === playerId);
    if (!myPlayer) {
        colorSelection.style.display = 'none';
        return;
    }
    
    // Zobraz výběr barev pouze pokud hra neprobíhá a hráč ještě nemá barvu
    if (state.status === 'waiting' && (!myPlayer.color || state.available_colors && state.available_colors.length > 0)) {
        colorSelection.style.display = 'block';
        colorButtons.innerHTML = '';
        
        const allColors = state.all_colors || ['red', 'blue', 'green', 'yellow'];
        const usedColors = new Set(
            state.players
                .filter(p => p.player_id !== playerId)
                .map(p => p.color)
                .filter(Boolean)
        );
        
        allColors.forEach(color => {
            const isUsed = usedColors.has(color);
            const isSelected = myPlayer.color === color;
            
            const btn = document.createElement('button');
            btn.className = `color-btn ${isSelected ? 'selected' : ''}`;
            btn.style.backgroundColor = COLORS[color];
            btn.disabled = isUsed && !isSelected;
            btn.title = isUsed && !isSelected ? 'Barva je již obsazena' : `Vybrat ${color}`;
            
            btn.addEventListener('click', () => {
                if (!isUsed || isSelected) {
                    ws.send(JSON.stringify({ type: 'set_color', color: color }));
                }
            });
            
            colorButtons.appendChild(btn);
        });
    } else {
        colorSelection.style.display = 'none';
    }
}
```

### 7. Zpracování zpráv ze serveru

```javascript
function handleMessage(message) {
    switch (message.type) {
        case 'lobby_state':
            // Aktualizace stavu lobby
            updateLobby(message);
            
            // Přepnutí na lobby screen (pokud nejsme ve hře)
            const currentScreen = document.querySelector('.screen:not(.hidden)');
            const isOnGameScreen = currentScreen && currentScreen.id === 'game-screen';
            const isGameActive = message.status === 'playing' || message.status === 'finished';
            
            // Pokud hra probíhá a hráč je ve hře, nepřepínejme ho
            if (isGameActive && isOnGameScreen) {
                break;
            }
            
            // Jinak přepneme na lobby screen
            showScreen('lobby-screen');
            break;
        
        case 'game_state':
            // Hra začala - přepneme na game screen
            showScreen('game-screen');
            break;
        
        case 'leave_ok':
            // Úspěšné opuštění lobby
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('player_id');
            playerId = null;
            token = null;
            
            // Zavření WebSocket
            if (ws) {
                ws.onclose = null;
                ws.close();
                ws = null;
            }
            
            showScreen('login-screen');
            break;
        
        case 'error':
            // Chyba ze serveru
            showError(message.message || 'Nastala chyba');
            break;
    }
}
```

### 8. Utility funkce

```javascript
// Escape HTML (ochrana proti XSS)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Přepnutí obrazovky
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }
}

// Zobrazení chybové zprávy
function showError(message) {
    // Implementace podle potřeby
    console.error(message);
    alert(message); // Nebo vlastní error handling
}
```

---

## 🔌 WebSocket Komunikace

### Client → Server

#### Set Ready
```json
{
  "type": "set_ready",
  "ready": true
}
```

**Pole**:
- `type`: "set_ready"
- `ready`: Boolean (true = připraven, false = zrušit)

#### Leave Lobby
```json
{
  "type": "leave_lobby"
}
```

**Pole**:
- `type`: "leave_lobby"

### Server → Client

#### Lobby State
```json
{
  "type": "lobby_state",
  "status": "waiting",
  "players": [
    {
      "player_id": "uuid",
      "name": "Jméno hráče",
      "ready": false,
      "alive": true,
      "hand_size": 0
    }
  ],
  "can_start": false
}
```

**Pole**:
- `type`: "lobby_state"
- `status`: "waiting" | "playing" | "finished"
- `players`: Array of Player objects
- `can_start`: Boolean (true pokud všichni jsou připraveni a hra může začít)

**Player object**:
- `player_id`: UUID
- `name`: String
- `ready`: Boolean
- `alive`: Boolean
- `hand_size`: Number (počet karet v ruce)

#### Leave OK
```json
{
  "type": "leave_ok"
}
```

**Pole**:
- `type`: "leave_ok"

#### Error
```json
{
  "type": "error",
  "message": "Chybová zpráva"
}
```

---

## 📊 Stavy lobby

### 1. Waiting (Čekání)
- Hra neprobíhá
- Hráči se připojují
- Hráči se označují jako připravení
- Status: "Čekáme na hráče... (X/5)"

### 2. Ready to Start (Připraveno ke startu)
- Všichni hráči jsou připraveni
- Minimální počet hráčů je splněn
- Status: "Všichni jsou připraveni! Hra začne automaticky..."
- Hra se automaticky spustí

### 3. Playing (Probíhá hra)
- Hra probíhá
- Ready button je skrytý
- Status: "Probíhá hra"
- Hráči vidí, kdo je ve hře a kdo vypadl

### 4. Finished (Hra skončila)
- Hra skončila
- Status: "Hra skončila"
- Hráči mohou restartovat hru

---

## ✅ Checklist pro implementaci

### HTML struktura
- [ ] Header s nadpisem (`main-title`)
- [ ] Lobby screen kontejner (`lobby-screen`)
- [ ] Lobby box (`lobby-box`) s box-style styling
- [ ] Seznam hráčů (`players-list`)
- [ ] Tlačítko Připraven (`ready-btn`)
- [ ] Tlačítko Odejít (`leave-btn`)
- [ ] Status zpráva (`lobby-status`)
- [ ] Volitelné: Výběr barvy (`color-selection`, `color-buttons`)
- [ ] Volitelné: Tlačítko pro spuštění hry (`start-game-btn`)

### CSS styly
- [ ] Box-style komponenty (`.box`)
- [ ] CSS styly pro header a nadpis
- [ ] CSS styly pro lobby-box
- [ ] CSS styly pro player items
- [ ] CSS styly pro status message
- [ ] Responzivní design pro mobilní zařízení
- [ ] Volitelné: CSS styly pro výběr barvy

### JavaScript funkcionalita
- [ ] JavaScript inicializace pro kliknutí na nadpis (reload)
- [ ] JavaScript inicializace event listenerů
- [ ] Ready button handler
- [ ] Leave button handler
- [ ] Funkce `updateLobby()` pro aktualizaci seznamu hráčů
- [ ] Funkce `updateLobbyStatus()` pro aktualizaci status zprávy
- [ ] Volitelné: Funkce `updateColorSelection()` pro výběr barvy
- [ ] Zpracování `lobby_state` zprávy
- [ ] Zpracování `game_state` zprávy (přepnutí na game screen)
- [ ] Zpracování `leave_ok` zprávy
- [ ] Escape HTML pro ochranu proti XSS
- [ ] Skrytí/zobrazení ready button podle stavu hry
- [ ] Aktualizace textu ready button podle stavu hráče

---

## 🎯 Klíčové body

1. **Box-style komponenty**: Všechny komponenty používají konzistentní box-style design (bílé pozadí, border-radius, box-shadow)
2. **Nadpis (Header)**: Klikatelný nadpis, který obnoví stránku - společný pro všechny obrazovky
3. **Dynamická aktualizace**: Lobby se aktualizuje při každé změně (nový hráč, ready status)
4. **Stav hry**: Lobby se chová jinak během hry (skryje ready button, zobrazí jiný status)
5. **Ready mechanika**: Toggle ready status (připraven/zrušit)
6. **Automatický start**: Hra se spustí automaticky, když jsou všichni připraveni (nebo manuálně přes tlačítko)
7. **Leave funkcionalita**: Hráč může opustit lobby a vrátit se na login screen
8. **XSS ochrana**: Vždy použijte `escapeHtml()` pro uživatelské vstupy
9. **Výběr barvy**: Volitelně pro hry, které vyžadují výběr barvy hráče
10. **Responzivní design**: Optimalizace pro mobilní zařízení

---

## 🔧 Přizpůsobení pro vlastní projekt

### Změna textů
- Upravte nadpis lobby
- Změňte texty tlačítek
- Upravte status zprávy

### Změna stylů
- Upravte barvy (ready status, player items)
- Změňte velikosti a padding
- Přizpůsobte responzivní breakpointy

### Rozšíření funkcionality
- Přidejte maximální počet hráčů z konfigurace
- Přidejte admin funkce (odstranění hráče)
- Přidejte chat v lobby
- Přidejte možnost změny jména
- Přidejte možnost nastavení hry (počet hráčů, obtížnost)

### Vlastní player item layout
```javascript
// Můžete přidat další informace do player itemu
div.innerHTML = `
    <div class="player-item-left">
        <span class="player-name">${escapeHtml(player.name)}</span>
        ${player.is_super_power ? '<span class="admin-badge">👑</span>' : ''}
    </div>
    <div class="player-item-right">
        <span class="ready-status">${statusText}</span>
        ${player.hand_size !== undefined ? `<span class="hand-size">${player.hand_size} karet</span>` : ''}
    </div>
`;
```

---

## 📚 Související dokumentace

- [Login Page Template](./TEMPLATE_LOGIN_PAGE.md)
- [WebSocket komunikace](./ARCHITEKTURA_A_NAVOD_PRO_PODOBNE_APLIKACE.md#websocket-komunikace)
- [Frontend architektura](./ARCHITEKTURA_A_NAVOD_PRO_PODOBNE_APLIKACE.md#frontend-architektura)

