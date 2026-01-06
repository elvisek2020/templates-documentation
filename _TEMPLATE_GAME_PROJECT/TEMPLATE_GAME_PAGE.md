# Šablona: Game Page (Herní stránka)

## 📋 Přehled

Game page je hlavní obrazovka během hry. Zobrazuje všechny herní komponenty: balíček karet, seznam hráčů, chat, akční tlačítka a karty v ruce hráče.

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

### Základní struktura - Varianta 1: Karetní hry

```html
<!-- Game Screen -->
<div id="game-screen" class="screen hidden">
    <div class="game-container">
        <!-- Deck Info and Players Row -->
        <div class="deck-players-row">
            <!-- Deck Info Box -->
            <div class="box deck-info-box">
                <h3>Balíček</h3>
                <div id="deck-size" class="deck-size">-</div>
            </div>
            
            <!-- Players Container -->
            <div id="players-container" class="players-container"></div>
        </div>

        <!-- Actions Box -->
        <div class="box actions-box">
            <button id="draw-card-btn" class="btn-primary">Líznout kartu</button>
            <button id="restart-game-btn" class="btn-primary hidden">Začít novou hru</button>
        </div>

        <!-- Messages Box (Chat) -->
        <div class="box messages-box">
            <h3>Chat</h3>
            <div id="game-messages" class="messages"></div>
        </div>

        <!-- Hand Box (Karty v ruce) -->
        <div class="box hand-box">
            <h3>Tvoje karty</h3>
            <div id="my-hand" class="hand"></div>
        </div>
    </div>
</div>
```

### Základní struktura - Varianta 2: Deskové hry

```html
<!-- Game Screen -->
<div id="game-screen" class="screen hidden">
    <div class="game-container">
        <!-- Main Game Area -->
        <div class="game-main-area">
            <!-- Left Sidebar: Dice, Players, Statistics -->
            <div class="game-sidebar">
                <!-- Dice Box -->
                <div class="box dice-box">
                    <h3>Kostka</h3>
                    <div id="dice" class="dice">?</div>
                    <button id="roll-dice-btn" class="btn-primary" disabled>Hodit kostkou</button>
                </div>

                <!-- Players Box -->
                <div class="box players-box">
                    <h3>Hráči</h3>
                    <div id="players-container" class="players-container"></div>
                </div>

                <!-- Statistics Box -->
                <div class="box statistics-box">
                    <h3>Statistika</h3>
                    <div id="statistics-container" class="statistics-container"></div>
                </div>

                <!-- Solo Mode: End Game Button (volitelné) -->
                <div id="solo-end-game-box" class="box" style="display: none;">
                    <button id="end-game-btn" class="btn-secondary">Ukončit hru</button>
                </div>
            </div>

            <!-- Game Board Container -->
            <div class="box game-board-container">
                <div id="game-board" class="game-board">
                    <!-- Hrací plocha bude vykreslena JavaScriptem (SVG) -->
                </div>
            </div>
        </div>
    </div>
</div>
```

**Box-style komponenty**:
- Všechny komponenty používají třídu `.box` pro konzistentní vzhled
- Bílé pozadí, border-radius, box-shadow, padding
- Responzivní design pro mobilní zařízení

### Elementy a jejich účel

#### Společné elementy

| Element ID | Typ | Účel | Povinné |
|------------|-----|------|---------|
| `main-title` | h1 | Hlavní nadpis aplikace (v headeru) | ✅ |
| `game-screen` | div | Kontejner pro celou herní obrazovku | ✅ |
| `game-container` | div | Hlavní kontejner pro všechny herní komponenty | ✅ |

#### Varianta 1: Karetní hry

| Element ID | Typ | Účel | Povinné |
|------------|-----|------|---------|
| `deck-info-box` | div | [BOX] Box s informacemi o balíčku | ✅ |
| `deck-size` | div | Zobrazení počtu karet v balíčku | ✅ |
| `players-container` | div | Kontejner pro seznam hráčů | ✅ |
| `actions-box` | div | [BOX] Box s akčními tlačítky | ✅ |
| `draw-card-btn` | button | Tlačítko pro líznutí karty | ✅ |
| `restart-game-btn` | button | Tlačítko pro restart hry | ✅ |
| `messages-box` | div | [BOX] Box s chatem | ✅ |
| `game-messages` | div | Kontejner pro zprávy v chatu | ✅ |
| `hand-box` | div | [BOX] Box s kartami v ruce | ✅ |
| `my-hand` | div | Kontejner pro karty v ruce hráče | ✅ |

#### Varianta 2: Deskové hry

| Element ID | Typ | Účel | Povinné |
|------------|-----|------|---------|
| `game-main-area` | div | Hlavní oblast s herní plochou a sidebarem | ✅ |
| `game-sidebar` | div | Sidebar vlevo s boxy | ✅ |
| `dice-box` | div | [BOX] Box s kostkou | ✅ |
| `dice` | div | Zobrazení hodnoty kostky | ✅ |
| `roll-dice-btn` | button | Tlačítko pro hození kostkou | ✅ |
| `players-box` | div | [BOX] Box se seznamem hráčů | ✅ |
| `players-container` | div | Kontejner pro seznam hráčů | ✅ |
| `statistics-box` | div | [BOX] Box se statistikami | ✅ |
| `statistics-container` | div | Kontejner pro statistiky | ✅ |
| `game-board-container` | div | [BOX] Box s herní deskou | ✅ |
| `game-board` | div | Herní deska (SVG) | ✅ |
| `solo-end-game-box` | div | [BOX] Box s tlačítkem pro ukončení hry (solo) | ❌ |
| `end-game-btn` | button | Tlačítko pro ukončení hry (solo) | ❌ |

### Dynamicky generované elementy

#### Varianta 1: Karetní hry
- **Player cards**: Každý hráč je zobrazen jako `<div class="player-card">` v `players-container`
- **Cards**: Každá karta je zobrazena jako `<div class="card">` v `my-hand`
- **Messages**: Každá zpráva je zobrazena jako `<div class="message">` v `game-messages`

#### Varianta 2: Deskové hry
- **Player cards**: Každý hráč je zobrazen jako `<div class="player-card">` v `players-container`
- **Statistics items**: Každá statistika je zobrazena jako `<div class="stat-item">` v `statistics-container`
- **Game pieces**: Figurky jsou vykresleny jako SVG elementy v `game-board`

---

## 📐 Struktura stránky (Layout)

### Varianta 1: Karetní hry (např. Výbušná koťátka)

#### Desktop layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  Header (Nadpis aplikace - klikatelný)                              │
├─────────────────────────────────────────────────────────────────────┤
│  Game Screen                                                         │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  [BOX] Deck Info Box        │  Players Container (flex: 1)    │  │
│  │  - Balíček                  │  [BOX] Player Card 1            │  │
│  │  - Počet karet               │  [BOX] Player Card 2            │  │
│  │  (200px)                     │  [BOX] Player Card 3            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  [BOX] Actions Box                                            │  │
│  │  - Tlačítko "Líznout kartu"                                   │  │
│  │  - Tlačítko "Začít novou hru" (skryté během hry)             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  [BOX] Messages Box (Chat)                                    │  │
│  │  - Seznam zpráv (max-height: 200px, scrollable)               │  │
│  │  - Nejnovější zprávy nahoře                                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  [BOX] Hand Box (Tvoje karty) - sticky bottom                 │  │
│  │  - Karty v ruce (scrollable, flex-wrap)                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

**Boxy v této variantě**:
1. **Deck Info Box** - Informace o balíčku karet
2. **Player Cards** - Karty jednotlivých hráčů (v Players Container)
3. **Actions Box** - Akční tlačítka
4. **Messages Box** - Chat se zprávami
5. **Hand Box** - Karty v ruce hráče

#### Mobilní layout

```
┌─────────────────────┐
│  Header             │
├─────────────────────┤
│  Game Screen        │
│  ┌───────────────┐  │
│  │[BOX] Deck    │  │
│  │(90px)        │  │
│  ├───────────────┤  │
│  │Players (flex)│  │
│  │[BOX] P1 [P2] │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │[BOX] Actions  │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │[BOX] Chat     │  │
│  │(150px)        │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │[BOX] My Hand  │  │
│  │(scrollable)   │  │
│  └───────────────┘  │
└─────────────────────┘
```

### Varianta 2: Deskové hry (např. Člověče, nezlob se)

#### Desktop layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  Header (Nadpis aplikace - klikatelný)                              │
├─────────────────────────────────────────────────────────────────────┤
│  Game Screen                                                         │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Game Main Area                                                │  │
│  │  ┌──────────────┐  ┌──────────────────────────────────────┐   │  │
│  │  │[BOX] Dice    │  │                                      │   │  │
│  │  │- Kostka      │  │  [BOX] Game Board Container          │   │  │
│  │  │- Tlačítko    │  │  - Herní deska (SVG)                 │   │  │
│  │  │              │  │  - Figurky                           │   │  │
│  │  ├──────────────┤  │  - Vycentrovaný uprostřed            │   │  │
│  │  │[BOX] Players │  │                                      │   │  │
│  │  │- Seznam      │  │                                      │   │  │
│  │  │  hráčů       │  │                                      │   │  │
│  │  ├──────────────┤  │                                      │   │  │
│  │  │[BOX] Stats   │  │                                      │   │  │
│  │  │- Statistika  │  │                                      │   │  │
│  │  │              │  │                                      │   │  │
│  │  │(Sidebar)     │  │  (Game Board)                        │   │  │
│  │  │(250px)       │  │  (flex: 1)                           │   │  │
│  │  └──────────────┘  └──────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

**Boxy v této variantě**:
1. **Dice Box** - Kostka a tlačítko pro hození
2. **Players Box** - Seznam hráčů s jejich stavy
3. **Statistics Box** - Statistiky hry
4. **Game Board Container** - Herní deska (SVG) s figurkami
5. **Solo Mode End Game Box** - Volitelné tlačítko pro ukončení hry v solo režimu

#### Mobilní layout

```
┌─────────────────────┐
│  Header             │
├─────────────────────┤
│  Game Screen        │
│  ┌───────────────┐  │
│  │[BOX] Game     │  │
│  │Board (top)    │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │[BOX] Dice     │  │
│  ├───────────────┤  │
│  │[BOX] Players  │  │
│  ├───────────────┤  │
│  │[BOX] Stats    │  │
│  │(Sidebar)      │  │
│  └───────────────┘  │
└─────────────────────┘
```

**Poznámka**: Na mobilu se layout mění - herní deska je nahoře, sidebar s boxy je pod ní.

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

### 1. Game Container

```css
.game-container {
    width: 100%;
}

/* Pro deskové hry s padding-top pro nadpis */
.game-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 20px;
    padding-top: 100px; /* Místo pro nadpis */
    overflow: auto;
}
```

### 2. Deck Info Box (Varianta 1: Karetní hry)

**Popis**: Box zobrazující informace o dobíracím balíčku karet.

```css
.deck-players-row {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.deck-info-box {
    flex-shrink: 0;
    width: 200px !important;
    min-width: 200px !important;
    max-width: 200px !important;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: white !important;
    border-radius: 12px !important;
    padding: 15px !important;
    margin: 0 !important;
    border: 3px solid #ddd !important;
    box-shadow: none !important;
    box-sizing: border-box;
}

.deck-info-box h3 {
    margin-bottom: 10px;
    color: #667eea;
    font-size: 1.1em;
    margin-top: 0;
}

.deck-size {
    font-size: 1.5em;
    font-weight: bold;
    color: #333;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 8px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}
```

### 3. Players Container (Varianta 1: Karetní hry)

**Popis**: Kontejner pro zobrazení karet jednotlivých hráčů. Každý hráč je zobrazen jako box-style player card.

```css
.players-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    flex: 1;
}

.player-card {
    background: white;
    border-radius: 12px;
    padding: 15px !important;
    width: 200px !important;
    min-width: 200px !important;
    max-width: 200px !important;
    border: 3px solid #ddd !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    text-align: center;
    transition: all 0.3s;
}

.player-card.current {
    border-color: #667eea !important;
    background: #e7f0ff;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.player-card.dead {
    opacity: 0.6;
    background: #f5f5f5;
    border-color: #999 !important;
}

.player-card .player-name {
    font-weight: bold;
    font-size: 1.1em;
    color: #333;
    margin-bottom: 8px;
}

.player-card .hand-size {
    color: #666;
    font-size: 0.9em;
    margin-top: 8px;
}

.player-card .player-turns {
    font-size: 0.85em;
    color: #667eea;
    margin-top: 4px;
}
```

### 4. Actions Box (Varianta 1: Karetní hry)

**Popis**: Box obsahující akční tlačítka pro hru (líznutí karty, restart hry).

```css
.actions-box {
    margin-bottom: 20px;
    text-align: center;
}

.actions-box .btn-primary {
    margin: 5px;
    width: auto;
    min-width: 150px;
}

.actions-box .btn-primary.hidden {
    display: none;
}
```

### 5. Messages Box (Chat) - Varianta 1: Karetní hry

**Popis**: Box zobrazující herní zprávy a chat. Nejnovější zprávy jsou nahoře.

```css
.messages-box {
    margin-bottom: 20px;
}

.messages-box h3 {
    margin-bottom: 15px;
    color: #667eea;
}

.messages {
    max-height: 200px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
    display: flex;
    flex-direction: column; /* Nejnovější zprávy na začátku */
    scroll-behavior: auto;
    align-items: stretch;
}

.message {
    padding: 10px;
    margin: 5px 0;
    border-radius: 8px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    gap: 10px;
}

.message.success {
    background: #d4edda;
    color: #155724;
}

.message.error {
    background: #f8d7da;
    color: #721c24;
}

.message.died {
    background: #f5c6cb;
    color: #721c24;
}

.message.defused {
    background: #cce5ff;
    color: #004085;
}

.message .message-time {
    font-size: 0.85em;
    color: #666;
    white-space: nowrap;
}

.message .message-text {
    flex: 1;
}
```

### 6. Hand Box (Karty v ruce) - Varianta 1: Karetní hry

**Popis**: Box zobrazující karty v ruce hráče. Sticky bottom (přilepené dole), scrollovatelné.

```css
.hand-box {
    margin-bottom: 0;
    position: sticky;
    bottom: 0;
    background: white;
    z-index: 150;
    margin-top: 0;
}

.hand-box h3 {
    margin-bottom: 15px;
    color: #667eea;
}

.hand {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    overflow-x: auto;
    padding-bottom: 10px;
}
```

### 7. Card Styles (Varianta 1: Karetní hry)

**Popis**: Styly pro karty v ruce hráče. Každá karta je box-style element s hover efekty.

```css
.card {
    width: 120px;
    height: 170px;
    background: white;
    border: 3px solid #ddd;
    border-radius: 10px;
    padding: 10px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    border-color: #667eea;
}

.card.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.card .card-title {
    font-weight: bold;
    font-size: 0.9em;
    text-align: center;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.2;
    margin-bottom: 5px;
}

.card .card-description {
    font-size: 0.75em;
    text-align: center;
    color: rgba(0,0,0,0.7);
    display: none;
    opacity: 0;
    transition: opacity 0.3s;
    margin-top: auto;
}

.card.has-image {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.card.has-image .card-title {
    background: rgba(255,255,255,0.9);
    padding: 4px;
    border-radius: 4px;
}
```

### 8. Barvy karet podle typu

```css
.card-type-exploding_kitten {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    border-color: #d63031;
    color: white;
}

.card-type-defuse {
    background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
    border-color: #00a085;
    color: white;
}

.card-type-skip {
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
    border-color: #0984e3;
    color: white;
}

.card-type-attack {
    background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
    border-color: #e84393;
    color: white;
}

.card-type-shuffle {
    background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);
    border-color: #e17055;
    color: white;
}

.card-type-see_future {
    background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
    border-color: #6c5ce7;
    color: white;
}

.card-type-favor {
    background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
    border-color: #fdcb6e;
    color: #2d3436;
}

.card-type-nope {
    background: linear-gradient(135deg, #dfe6e9 0%, #b2bec3 100%);
    border-color: #b2bec3;
    color: #2d3436;
}

.card-type-reverse {
    background: linear-gradient(135deg, #ff7675 0%, #d63031 100%);
    border-color: #d63031;
    color: white;
}
```

### 8. Game Main Area (Varianta 2: Deskové hry)

**Popis**: Hlavní oblast obsahující sidebar vlevo a herní desku uprostřed.

```css
.game-main-area {
    display: flex;
    gap: 20px;
    flex: 1;
    min-height: 0;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    position: relative;
}
```

### 9. Game Sidebar (Varianta 2: Deskové hry)

**Popis**: Sidebar vlevo obsahující boxy s kostkou, hráči a statistikami.

```css
.game-sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex-shrink: 0;
    width: 250px;
    min-width: 250px;
    max-width: 250px;
    position: relative;
    z-index: 2;
    align-self: center;
    margin-top: 0;
}
```

### 10. Dice Box (Varianta 2: Deskové hry)

**Popis**: Box zobrazující kostku a tlačítko pro hození.

```css
.dice-box {
    width: 100% !important;
    min-width: auto !important;
    max-width: 100% !important;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background: white !important;
    border-radius: 12px !important;
    padding: 15px !important;
    margin: 0 !important;
    border: 3px solid #ddd !important;
    box-shadow: none !important;
    box-sizing: border-box;
}

.dice-box h3 {
    margin-bottom: 10px;
    color: #667eea;
    font-size: 1.1em;
    margin-top: 0;
}

.dice-box .dice {
    width: 80px;
    height: 80px;
    border: 3px solid #667eea;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5em;
    font-weight: bold;
    background: white;
    color: #667eea;
    margin: 10px auto;
}
```

### 11. Players Box (Varianta 2: Deskové hry)

**Popis**: Box zobrazující seznam hráčů s jejich stavy.

```css
.players-box {
    margin-bottom: 0;
}

.players-box h3 {
    margin-bottom: 15px;
    color: #667eea;
    font-size: 1.1em;
    margin-top: 0;
    text-align: center;
}

.players-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.player-card {
    background: white;
    border-radius: 12px;
    padding: 12px !important;
    width: 100% !important;
    min-width: auto !important;
    max-width: 100% !important;
    border: 3px solid #ddd !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    text-align: center;
    transition: all 0.3s;
    box-sizing: border-box;
}

.player-card.current {
    border-color: #667eea !important;
    background: #e7f0ff;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
```

### 12. Statistics Box (Varianta 2: Deskové hry)

**Popis**: Box zobrazující statistiky hry.

```css
.statistics-box {
    margin-bottom: 0;
    margin-top: 20px;
}

.statistics-box h3 {
    margin-bottom: 15px;
    color: #667eea;
    font-size: 1.1em;
    margin-top: 0;
    text-align: center;
}

.statistics-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    background: #f5f5f5;
    border-radius: 6px;
    font-size: 0.95em;
}

.stat-label {
    color: #666;
    font-weight: 500;
}

.stat-value {
    color: #333;
    font-weight: bold;
}
```

### 13. Game Board Container (Varianta 2: Deskové hry)

**Popis**: Box obsahující herní desku (SVG). Vycentrovaný uprostřed obrazovky.

```css
.game-board-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    background: transparent;
    border: none;
    box-shadow: none;
    z-index: 1;
    width: auto;
    height: auto;
}

.game-board {
    width: auto;
    height: auto;
    background: transparent;
    border: none;
    border-radius: 0;
    position: relative;
    aspect-ratio: 1;
    max-width: min(calc(100vw - 290px), calc(100vh - 200px));
    max-height: min(calc(100vw - 290px), calc(100vh - 200px));
    width: min(calc(100vw - 290px), calc(100vh - 200px));
    height: min(calc(100vw - 290px), calc(100vh - 200px));
}
```

### 14. Responzivní design (mobilní zařízení)

```css
@media (max-width: 768px) {
    .game-container {
        width: 100%;
    }
    
    .deck-players-row {
        flex-direction: row !important;
        gap: 6px !important;
        margin-bottom: 8px !important;
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
    }
    
    .deck-info-box {
        width: 90px !important;
        min-width: 90px !important;
        max-width: 90px !important;
        padding: 6px !important;
        min-height: 60px !important;
    }
    
    .deck-info-box h3 {
        font-size: 0.7em !important;
        margin-bottom: 4px !important;
    }
    
    .deck-size {
        font-size: 0.75em !important;
        padding: 0 !important;
    }
    
    .players-container {
        gap: 6px !important;
        flex-direction: row !important;
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
    }
    
    .player-card {
        min-width: 90px !important;
        width: 90px !important;
        max-width: 90px !important;
        padding: 8px !important;
    }
    
    .hand-box {
        margin-bottom: 15px;
    }
    
    .hand {
        gap: 8px;
    }
    
    .card {
        width: 90px;
        height: 130px;
        padding: 8px;
    }
    
    .messages-box {
        margin-bottom: 15px;
    }
    
    .messages {
        max-height: 150px;
        font-size: 0.9em;
    }
    
    .message {
        padding: 8px;
        font-size: 0.9em;
    }
}
```

---

## 💻 JavaScript Logika

### 1. Hlavní funkce: updateGame()

```javascript
function updateGame(state) {
    // Zobrazení/skrytí tlačítka pro restart
    const restartBtn = document.getElementById('restart-game-btn');
    if (restartBtn) {
        if (state.status === 'finished') {
            restartBtn.classList.remove('hidden');
            // Skryjeme tlačítko líznutí během dokončené hry
            const drawBtn = document.getElementById('draw-card-btn');
            if (drawBtn) drawBtn.style.display = 'none';
        } else {
            restartBtn.classList.add('hidden');
            // Zobrazíme tlačítko líznutí během hry
            const drawBtn = document.getElementById('draw-card-btn');
            if (drawBtn) drawBtn.style.display = '';
        }
    }
    
    // Zajištění, že chat zůstane scrollovaný na začátku
    const messagesDiv = document.getElementById('game-messages');
    if (messagesDiv) {
        messagesDiv.scrollTop = 0;
    }
    
    // Aktualizace velikosti balíčku
    const deckSizeDiv = document.getElementById('deck-size');
    if (deckSizeDiv && state.draw_pile_size !== undefined) {
        deckSizeDiv.textContent = `${state.draw_pile_size} karet`;
    }
    
    // Přidání indikátoru směru do boxíku s dobíracím balíčkem
    const deckInfoBox = document.querySelector('.deck-info-box');
    if (deckInfoBox) {
        // Odstranění starého indikátoru
        const oldIndicator = deckInfoBox.querySelector('.direction-indicator');
        if (oldIndicator) {
            oldIndicator.remove();
        }
        
        // Přidání nového indikátoru směru
        const directionIndicator = document.createElement('div');
        directionIndicator.className = 'direction-indicator';
        directionIndicator.style.cssText = 'margin-top: 8px; padding: 6px; background: rgba(102, 126, 234, 0.1); border-radius: 6px; text-align: center; font-weight: bold; color: #667eea; font-size: 14px;';
        directionIndicator.innerHTML = `Směr: ${state.reverse_direction ? '⬅️ Dozadu' : '➡️ Dopředu'}`;
        deckInfoBox.appendChild(directionIndicator);
    }
    
    // Aktualizace hráčů
    updatePlayers(state.players, state.current_player_id, state.pending_turns || {}, state.reverse_direction || false);
    
    // Aktualizace ruky
    const myPlayer = state.players.find(p => p.player_id === playerId);
    if (myPlayer) {
        if (!myPlayer.hand) {
            myPlayer.hand = [];
        }
        updateMyHand(myPlayer.hand, state.current_player_id === playerId, state.can_nope || false);
    }
    
    // Aktualizace tlačítek
    const isMyTurn = state.current_player_id === playerId;
    const drawBtn = document.getElementById('draw-card-btn');
    if (drawBtn) {
        drawBtn.disabled = !isMyTurn;
    }
}
```

### 2. Aktualizace hráčů: updatePlayers()

```javascript
function updatePlayers(players, currentPlayerId, pendingTurns = {}, reverseDirection = false) {
    const container = document.getElementById('players-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    players.forEach(player => {
        const div = document.createElement('div');
        div.className = `player-card ${player.player_id === currentPlayerId ? 'current' : ''} ${!player.alive ? 'dead' : ''}`;
        
        // Zobrazení počtu tahů, pokud má hráč pending_turns
        const turns = pendingTurns[player.player_id] || 0;
        const turnsDisplay = turns > 0 ? `${turns} tah${turns > 1 ? 'y' : turns === 1 ? '' : 'ů'}` : '';
        
        div.innerHTML = `
            <div class="player-name">${escapeHtml(player.name)}</div>
            ${turnsDisplay ? `<div class="player-turns" style="font-size: 0.85em; color: #667eea; margin-top: 4px;">${turnsDisplay}</div>` : ''}
            <div class="hand-size">Karet: ${player.hand_size}</div>
            ${!player.alive ? '<div style="color: red; margin-top: 5px;">Mrtvý</div>' : ''}
        `;
        container.appendChild(div);
    });
}
```

### 3. Aktualizace ruky: updateMyHand()

```javascript
function updateMyHand(hand, isMyTurn, canNope = false) {
    const handDiv = document.getElementById('my-hand');
    if (!handDiv) return;
    
    // DŮLEŽITÉ: Výbušné koťátko se NESMÍ zobrazit v ruce - filtrujeme ho
    const filteredHand = hand.filter(card => card.type !== 'EXPLODING_KITTEN');
    
    // Seřazení karet podle typu
    const sortedHand = [...filteredHand].sort((a, b) => {
        const typeOrder = {
            'DEFUSE': 0,
            'EXPLODING_KITTEN': 1,
            'SKIP': 2,
            'ATTACK': 3,
            'SHUFFLE': 4,
            'SEE_FUTURE': 5,
            'FAVOR': 6,
            'NOPE': 7,
            'REVERSE': 8
        };
        
        const orderA = typeOrder[a.type] !== undefined ? typeOrder[a.type] : 999;
        const orderB = typeOrder[b.type] !== undefined ? typeOrder[b.type] : 999;
        
        if (orderA !== orderB) {
            return orderA - orderB;
        }
        
        return (a.title || '').localeCompare(b.title || '');
    });
    
    handDiv.innerHTML = '';
    sortedHand.forEach(card => {
        const cardDiv = document.createElement('div');
        const cardTypeClass = `card-type-${card.type.toLowerCase()}`;
        
        // NOPE karta je aktivní, pokud je náš tah NEBO pokud lze použít NOPE
        const isCardActive = isMyTurn || (card.type === 'NOPE' && canNope);
        cardDiv.className = `card ${cardTypeClass} ${!isCardActive ? 'disabled' : ''}`;
        cardDiv.dataset.cardId = card.id;
        cardDiv.dataset.cardType = card.type;
        
        // Pokud má karta obrázek, použijeme ho jako pozadí
        if (card.asset_path) {
            cardDiv.style.backgroundImage = `url(${card.asset_path})`;
            cardDiv.style.backgroundSize = 'cover';
            cardDiv.style.backgroundPosition = 'center';
            cardDiv.style.backgroundRepeat = 'no-repeat';
            cardDiv.classList.add('has-image');
        }
        
        cardDiv.innerHTML = `
            <div class="card-title">${escapeHtml(card.title)}</div>
            <div class="card-description">${escapeHtml(card.description)}</div>
        `;
        
        if (isCardActive) {
            // Desktop - hover zobrazí popis
            cardDiv.addEventListener('mouseenter', () => {
                const desc = cardDiv.querySelector('.card-description');
                if (desc) {
                    desc.style.display = 'block';
                    setTimeout(() => desc.style.opacity = '1', 10);
                }
            });
            cardDiv.addEventListener('mouseleave', () => {
                const desc = cardDiv.querySelector('.card-description');
                if (desc) {
                    desc.style.opacity = '0';
                    setTimeout(() => desc.style.display = 'none', 300);
                }
            });
            
            // Mobilní - dlouhý tap zobrazí/skryje popis
            let touchStartTime = 0;
            let longPressTimeout = null;
            
            cardDiv.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                longPressTimeout = setTimeout(() => {
                    cardDiv.classList.toggle('show-description');
                    e.preventDefault();
                }, 500);
            });
            
            cardDiv.addEventListener('touchend', (e) => {
                const touchDuration = Date.now() - touchStartTime;
                clearTimeout(longPressTimeout);
                
                // Krátký tap (< 500ms) - zahrajeme kartu
                if (touchDuration < 500 && !cardDiv.classList.contains('show-description')) {
                    playCard(card);
                }
            });
            
            cardDiv.addEventListener('touchcancel', () => {
                clearTimeout(longPressTimeout);
            });
            
            // Desktop - kliknutí na kartu
            cardDiv.addEventListener('click', (e) => {
                if (e.target.classList.contains('card-description')) {
                    return;
                }
                if (!('ontouchstart' in window)) {
                    playCard(card);
                }
            });
        }
        
        handDiv.appendChild(cardDiv);
    });
}
```

### 4. Přidání zprávy do chatu: addMessage()

```javascript
function addMessage(text, type = '') {
    const messagesDiv = document.getElementById('game-messages');
    if (!messagesDiv) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    // Přidání času
    const now = new Date();
    const timeStr = now.toLocaleTimeString('cs-CZ', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    
    // Datum a text na jeden řádek
    messageDiv.innerHTML = `
        <span class="message-time">${timeStr}</span>
        <span class="message-text">${escapeHtml(text)}</span>
    `;
    
    // Přidání na začátek kontejneru (nejnovější zpráva nahoře)
    if (messagesDiv.firstChild) {
        messagesDiv.insertBefore(messageDiv, messagesDiv.firstChild);
    } else {
        messagesDiv.appendChild(messageDiv);
    }
    
    // Scroll na začátek (kde jsou nejnovější zprávy)
    messagesDiv.scrollTop = 0;
}
```

### 5. Zahraní karty: playCard()

```javascript
function playCard(card) {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    
    // Speciální karty vyžadují cílového hráče
    if (card.type === 'FAVOR') {
        pendingFavorCard = card;
        showFavorModal();
    } else {
        ws.send(JSON.stringify({
            type: 'play_card',
            card_id: card.id
        }));
    }
}
```

### 6. Event listenery pro tlačítka

```javascript
// Draw card button
document.getElementById('draw-card-btn')?.addEventListener('click', () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: 'draw_card' }));
});

// Restart game button
document.getElementById('restart-game-btn')?.addEventListener('click', () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: 'restart_game' }));
});
```

### 7. Zpracování zpráv ze serveru

```javascript
function handleMessage(message) {
    switch (message.type) {
        case 'game_state':
            currentGameState = message;
            showScreen('game-screen');
            updateGame(message);
            break;
        
        case 'card_played':
            addMessage(`${message.player_name} zahrál kartu ${getCardTypeName(message.card_type)}`, 'success');
            // Aktualizace ruky pro NOPE karty
            if (currentGameState) {
                currentGameState.can_nope = message.can_nope || false;
                const myPlayer = currentGameState.players.find(p => p.player_id === playerId);
                if (myPlayer) {
                    updateMyHand(myPlayer.hand || [], currentGameState.current_player_id === playerId, currentGameState.can_nope || false);
                }
            }
            break;
        
        case 'player_died':
            addMessage(`💀 ${message.player_name} zemřel!`, 'died');
            break;
        
        case 'game_end':
            addMessage(`🎉 ${message.winner_name} vyhrál hru!`, 'success');
            const restartBtn = document.getElementById('restart-game-btn');
            if (restartBtn) {
                restartBtn.classList.remove('hidden');
            }
            break;
        
        case 'card_drawn':
            addMessage('Lízl jsi kartu: ' + message.card.title, 'success');
            break;
        
        case 'exploding_kitten_defused':
            if (message.player_id === playerId) {
                addMessage('🛡️ Přežil jsi Výbušné koťátko pomocí Zneškodni!', 'defused');
            } else {
                addMessage(`🛡️ ${message.player_name} přežil Výbušné koťátko pomocí Zneškodni!`, 'defused');
            }
            break;
    }
}
```

---

## 🔌 WebSocket Komunikace

### Client → Server

#### Draw Card
```json
{
  "type": "draw_card"
}
```

#### Play Card
```json
{
  "type": "play_card",
  "card_id": "id",
  "target_player_id": "id"  // Volitelné (pro FAVOR)
}
```

#### Restart Game
```json
{
  "type": "restart_game"
}
```

### Server → Client

#### Game State
```json
{
  "type": "game_state",
  "status": "playing",
  "current_player_id": "uuid",
  "pending_turns": { "uuid": 1 },
  "draw_pile_size": 20,
  "can_nope": false,
  "reverse_direction": false,
  "players": [
    {
      "player_id": "uuid",
      "name": "Jméno",
      "alive": true,
      "hand_size": 5,
      "hand": [...]  // Pouze pro aktuálního hráče
    }
  ]
}
```

#### Card Played
```json
{
  "type": "card_played",
  "player_id": "uuid",
  "player_name": "Jméno",
  "card_type": "ATTACK",
  "result": { ... },
  "can_nope": true
}
```

#### Player Died
```json
{
  "type": "player_died",
  "player_id": "uuid",
  "player_name": "Jméno"
}
```

#### Game End
```json
{
  "type": "game_end",
  "winner_id": "uuid",
  "winner_name": "Jméno"
}
```

---

## 📦 Sekce stránky - Detailní popis

### Varianta 1: Karetní hry

#### 1. [BOX] Deck Info Box (Balíček)

**Účel**: Zobrazuje informace o dobíracím balíčku karet

**Elementy**:
- `deck-size`: Počet karet v balíčku
- `direction-indicator`: Směr tahu (dynamicky přidáno)

**Aktualizace**:
- Aktualizuje se při každém `game_state`
- Zobrazuje `draw_pile_size` ze serveru

**Box-style**: Bílé pozadí, border-radius 12px, box-shadow, padding 15px

#### 2. Players Container (Hráči)

**Účel**: Zobrazuje seznam všech hráčů ve hře jako box-style player cards

**Informace pro každého hráče**:
- Jméno
- Počet karet v ruce (`hand_size`)
- Počet zbývajících tahů (`pending_turns`)
- Status (živý/mrtvý)
- Zvýraznění aktuálního hráče (`current` třída)

**Styly**:
- `current`: Zvýrazní aktuálního hráče (modrý border, gradient pozadí)
- `dead`: Zobrazí mrtvého hráče s nižší opacity

**Box-style**: Každý player card je box-style element (200px šířka, min-height 120px)

#### 3. [BOX] Actions Box (Akce)

**Účel**: Obsahuje akční tlačítka pro hru

**Tlačítka**:
- `draw-card-btn`: Líznutí karty (aktivní pouze na tah hráče)
- `restart-game-btn`: Restart hry (zobrazí se pouze po skončení hry)

**Stavy**:
- `draw-card-btn`: Disabled, pokud není tah hráče
- `restart-game-btn`: Skrytý během hry, zobrazí se po skončení

**Box-style**: Bílé pozadí, sticky top, z-index 200

#### 4. [BOX] Messages Box (Chat)

**Účel**: Zobrazuje herní zprávy a chat

**Vlastnosti**:
- Scrollovatelný (max-height: 200px)
- Nejnovější zprávy nahoře (`flex-direction: column`)
- Automatický scroll na začátek při nové zprávě
- Barevné typy zpráv (success, error, died, defused)

**Formát zprávy**:
```
[Čas] Text zprávy
```

**Box-style**: Bílé pozadí, border-radius 12px, padding 25px

#### 5. [BOX] Hand Box (Karty v ruce)

**Účel**: Zobrazuje karty v ruce hráče

**Vlastnosti**:
- Sticky bottom (přilepené dole)
- Scrollovatelné (horizontálně, flex-wrap)
- Karty seřazené podle typu
- Aktivní/deaktivní karty podle tahu

**Interakce s kartami**:
- **Desktop**: Hover zobrazí popis, kliknutí zahraje kartu
- **Mobilní**: Dlouhý tap (500ms) zobrazí popis, krátký tap zahraje kartu

**Filtrování**:
- Výbušné koťátko se NESMÍ zobrazit v ruce

**Box-style**: Bílé pozadí, sticky bottom, z-index 150

### Varianta 2: Deskové hry

#### 1. Game Main Area

**Účel**: Hlavní oblast obsahující sidebar vlevo a herní desku uprostřed

**Layout**: Flexbox s gap 20px, sidebar fixní šířka 250px, game board flex: 1

#### 2. Game Sidebar

**Účel**: Sidebar vlevo obsahující všechny boxy s informacemi

**Boxy v sidebaru**:
- Dice Box
- Players Box
- Statistics Box
- Solo Mode End Game Box (volitelné)

**Layout**: Flexbox column s gap 20px, fixní šířka 250px

#### 3. [BOX] Dice Box (Kostka)

**Účel**: Zobrazuje kostku a tlačítko pro hození

**Elementy**:
- `dice`: Zobrazení hodnoty kostky (1-6 nebo "?")
- `roll-dice-btn`: Tlačítko pro hození kostkou

**Stavy**:
- `roll-dice-btn`: Disabled, pokud není tah hráče

**Box-style**: Bílé pozadí, border-radius 12px, padding 15px, border 3px solid #ddd

#### 4. [BOX] Players Box (Hráči)

**Účel**: Zobrazuje seznam všech hráčů ve hře

**Informace pro každého hráče**:
- Jméno
- Barva hráče (barevný indikátor)
- Status (ve hře, vyhrál)
- Zvýraznění aktuálního hráče (`current` třída)

**Styly**:
- `current`: Zvýrazní aktuálního hráče (modrý border, světle modré pozadí)

**Box-style**: Bílé pozadí, border-radius 12px, padding 25px

#### 5. [BOX] Statistics Box (Statistika)

**Účel**: Zobrazuje statistiky hry

**Informace**:
- Počet hodů kostkou
- Počet tahů
- Další statistiky podle typu hry

**Box-style**: Bílé pozadí, border-radius 12px, padding 25px

#### 6. [BOX] Game Board Container (Herní deska)

**Účel**: Obsahuje herní desku (SVG) s figurkami

**Vlastnosti**:
- Vycentrovaný uprostřed obrazovky (absolute positioning)
- Responzivní velikost (min z viewport width/height)
- Aspect ratio 1:1
- SVG vykreslení herní plochy

**Interakce**:
- Kliknutí na figurky pro pohyb
- Animace pohybu figurek

**Box-style**: Transparentní pozadí, bez borderu a box-shadow (pouze kontejner pro SVG)

---

## ✅ Checklist pro implementaci

### HTML struktura
- [ ] Header s nadpisem (`main-title`)
- [ ] Game screen kontejner (`game-screen`)
- [ ] Game container (`game-container`)
- [ ] **Varianta 1 (Karetní hry)**:
  - [ ] Deck Info Box (`deck-info-box`)
  - [ ] Players Container (`players-container`)
  - [ ] Actions Box (`actions-box`)
  - [ ] Messages Box (`messages-box`)
  - [ ] Hand Box (`hand-box`)
- [ ] **Varianta 2 (Deskové hry)**:
  - [ ] Game Main Area (`game-main-area`)
  - [ ] Game Sidebar (`game-sidebar`)
  - [ ] Dice Box (`dice-box`)
  - [ ] Players Box (`players-box`)
  - [ ] Statistics Box (`statistics-box`)
  - [ ] Game Board Container (`game-board-container`)

### CSS styly
- [ ] Box-style komponenty (`.box`)
- [ ] CSS styly pro header a nadpis
- [ ] CSS styly pro všechny boxy podle varianty
- [ ] Responzivní design pro mobilní zařízení
- [ ] Volitelné: CSS styly pro SVG herní desku (Varianta 2)

### JavaScript funkcionalita
- [ ] JavaScript inicializace pro kliknutí na nadpis (reload)
- [ ] Funkce `updateGame()` pro aktualizaci celé stránky
- [ ] Funkce `updatePlayers()` pro aktualizaci seznamu hráčů
- [ ] **Varianta 1**:
  - [ ] Funkce `updateMyHand()` pro aktualizaci karet v ruce
  - [ ] Funkce `addMessage()` pro přidání zprávy do chatu
  - [ ] Event listenery pro karty (click, touch)
  - [ ] Filtrování výbušných koťátek z ruky
  - [ ] Seřazení karet podle typu
- [ ] **Varianta 2**:
  - [ ] Funkce pro aktualizaci kostky
  - [ ] Funkce pro aktualizaci statistik
  - [ ] Funkce pro vykreslení herní desky (SVG)
  - [ ] Event listenery pro kostku
  - [ ] Event listenery pro figurky
- [ ] Event listenery pro tlačítka
- [ ] Zpracování `game_state` zprávy
- [ ] Zpracování dalších zpráv ze serveru
- [ ] Escape HTML pro ochranu proti XSS

---

## 🎯 Klíčové body

1. **Box-style komponenty**: Všechny komponenty používají konzistentní box-style design (bílé pozadí, border-radius, box-shadow)
2. **Nadpis (Header)**: Klikatelný nadpis, který obnoví stránku - společný pro všechny obrazovky
3. **Dvě varianty layoutu**: 
   - **Varianta 1 (Karetní hry)**: Deck Info, Players, Actions, Messages, Hand Box
   - **Varianta 2 (Deskové hry)**: Sidebar (Dice, Players, Statistics) + Game Board
4. **Dynamická aktualizace**: Všechny komponenty se aktualizují při každém `game_state`
5. **Stav hry**: Různé chování podle stavu (playing, finished)
6. **Interaktivní prvky**: Různé interakce pro desktop a mobil (karty, kostka, figurky)
7. **Chat** (Varianta 1): Nejnovější zprávy nahoře, barevné typy
8. **Responzivní design**: Optimalizace pro mobilní zařízení - layout se mění (sidebar pod herní plochou)
9. **XSS ochrana**: Vždy použijte `escapeHtml()` pro uživatelské vstupy
10. **SVG herní deska** (Varianta 2): Herní deska je vykreslena jako SVG s figurkami

---

## 🔧 Přizpůsobení pro vlastní projekt

### Změna textů
- Upravte nadpisy sekcí
- Změňte texty tlačítek
- Upravte zprávy v chatu

### Změna stylů
- Upravte barvy karet
- Změňte velikosti komponent
- Přizpůsobte responzivní breakpointy

### Rozšíření funkcionality
- Přidejte animace při zahraní karty
- Přidejte zvukové efekty
- Přidejte možnost změny jména během hry
- Přidejte možnost opustit hru
- Přidejte spectator mode

---

## 📚 Související dokumentace

- [Login Page Template](./TEMPLATE_LOGIN_PAGE.md)
- [Lobby Page Template](./TEMPLATE_LOBBY_PAGE.md)
- [WebSocket komunikace](./ARCHITEKTURA_A_NAVOD_PRO_PODOBNE_APLIKACE.md#websocket-komunikace)
- [Frontend architektura](./ARCHITEKTURA_A_NAVOD_PRO_PODOBNE_APLIKACE.md#frontend-architektura)

