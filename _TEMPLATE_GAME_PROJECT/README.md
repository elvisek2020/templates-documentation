# Dokumentace šablony pro webové herní aplikace

Tato složka obsahuje univerzální šablonu a dokumentaci pro vytváření standardizovaných webových herních aplikací s real-time komunikací přes WebSocket.

## 📚 Dokumenty

### [TEMPLATE_LOGIN_PAGE.md](./TEMPLATE_LOGIN_PAGE.md) - Šablona přihlašovací stránky

Kompletní průvodce přihlašovací stránkou:

- HTML struktura s box-style komponentami
- CSS styly včetně responzivního designu
- JavaScript logika (validace, WebSocket připojení)
- WebSocket komunikace (join, reconnect)
- SessionStorage management
- Verze aplikace (načítání z JSON)
- Error handling

**Začněte zde** při vytváření nové herní aplikace.

### [TEMPLATE_LOBBY_PAGE.md](./TEMPLATE_LOBBY_PAGE.md) - Šablona lobby stránky

Kompletní průvodce lobby stránkou:

- HTML struktura s box-style komponentami
- CSS styly včetně responzivního designu
- JavaScript logika (ready toggle, leave, aktualizace lobby)
- WebSocket komunikace (set_ready, leave_lobby, lobby_state)
- Dynamická aktualizace hráčů
- Volitelná funkcionalita (výběr barvy, manuální start)
- Stavy lobby (waiting, ready, playing, finished)

**Použijte** pro vytvoření lobby před začátkem hry.

### [TEMPLATE_GAME_PAGE.md](./TEMPLATE_GAME_PAGE.md) - Šablona herní stránky

Kompletní průvodce hlavní herní stránkou:

- **Varianta 1: Karetní hry** - Layout pro karetní hry
- **Varianta 2: Deskové hry** - Layout pro deskové hry
- HTML struktura pro obě varianty
- Detailní CSS styly pro všechny komponenty
- JavaScript logika (updateGame, updatePlayers, updateMyHand, addMessage)
- WebSocket komunikace (draw_card, play_card, restart_game, game_state)
- Interakce s kartami (desktop hover, mobilní tap)
- Chat systém
- Responzivní design

**Použijte** pro vytvoření hlavní herní obrazovky.

## 🚀 Rychlý start

### 1. Vytvoření nové herní aplikace

1. Otevřete [TEMPLATE_LOGIN_PAGE.md](./TEMPLATE_LOGIN_PAGE.md)
2. Zkopírujte HTML strukturu pro login screen
3. Zkopírujte CSS styly
4. Zkopírujte JavaScript logiku
5. Upravte podle potřeby (název aplikace, barvy, atd.)

### 2. Vytvoření lobby stránky

1. Otevřete [TEMPLATE_LOBBY_PAGE.md](./TEMPLATE_LOBBY_PAGE.md)
2. Zkopírujte HTML strukturu pro lobby screen
3. Zkopírujte CSS styly
4. Zkopírujte JavaScript logiku
5. Upravte podle potřeby

### 3. Vytvoření herní stránky

1. Otevřete [TEMPLATE_GAME_PAGE.md](./TEMPLATE_GAME_PAGE.md)
2. Vyberte variantu podle typu hry:
   - **Varianta 1** pro karetní hry
   - **Varianta 2** pro deskové hry
3. Zkopírujte HTML strukturu
4. Zkopírujte CSS styly
5. Zkopírujte JavaScript logiku
6. Upravte podle potřeby

### 4. Kontrola konzistence

- ✅ Používáte box-style komponenty (`.box` třída)?
- ✅ Máte správný header s klikatelným nadpisem?
- ✅ Používáte správné WebSocket zprávy?
- ✅ Máte implementovaný reconnect mechanismus?
- ✅ Používáte `escapeHtml()` pro ochranu proti XSS?
- ✅ Máte responzivní design pro mobilní zařízení?

## 📋 Checklist pro implementaci

### Login Page

- [ ] Header s nadpisem (`main-title`)
- [ ] Login screen kontejner (`login-screen`)
- [ ] Login box (`login-box`) s box-style styling
- [ ] Input pole pro jméno (`player-name`)
- [ ] Tlačítko pro přihlášení (`join-btn`)
- [ ] Error message element (`login-error`)
- [ ] WebSocket připojení
- [ ] Reconnect funkcionalita
- [ ] SessionStorage management
- [ ] Verze aplikace (volitelné)

### Lobby Page

- [ ] Header s nadpisem (`main-title`)
- [ ] Lobby screen kontejner (`lobby-screen`)
- [ ] Lobby box (`lobby-box`) s box-style styling
- [ ] Seznam hráčů (`players-list`)
- [ ] Tlačítko Připraven (`ready-btn`)
- [ ] Tlačítko Odejít (`leave-btn`)
- [ ] Status zpráva (`lobby-status`)
- [ ] Aktualizace lobby při změnách
- [ ] WebSocket komunikace (set_ready, leave_lobby)

### Game Page

- [ ] Header s nadpisem (`main-title`)
- [ ] Game screen kontejner (`game-screen`)
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
- [ ] JavaScript funkce (updateGame, updatePlayers, updateMyHand)
- [ ] WebSocket komunikace (draw_card, play_card, restart_game)
- [ ] Interakce s kartami/figurkami

## 🎨 Klíčové principy

### Box-style design

- Všechny komponenty používají konzistentní box-style design
- Bílé pozadí, border-radius 12px, box-shadow, padding 25px
- Responzivní design pro mobilní zařízení

### Společný header

- Klikatelný nadpis aplikace (`main-title`)
- Obnoví stránku při kliknutí
- Společný pro všechny obrazovky (login, lobby, game)

### WebSocket komunikace

- Real-time komunikace mezi klientem a serverem
- Reconnect mechanismus pro obnovení spojení
- Token systém pro identifikaci hráče
- SessionStorage pro ukládání tokenu a player_id

### Screen management

- Třída `.screen` pro všechny obrazovky
- Třída `.hidden` pro skrývání obrazovek
- Funkce `showScreen()` pro přepínání obrazovek

### Bezpečnost

- Vždy používejte `escapeHtml()` pro uživatelské vstupy
- Validace na klientovi i serveru
- Token systém pro autentizaci

### Responzivní design

- Optimalizace pro mobilní zařízení
- Touch-friendly tlačítka (min-height: 44px)
- Flexibilní layouty s flexbox/grid

## 🔌 WebSocket komunikace

### Přehled zpráv

#### Login Page

- **Client → Server**: `join`, `reconnect`
- **Server → Client**: `join_ok`, `reconnect_ok`, `error`

#### Lobby Page

- **Client → Server**: `set_ready`, `leave_lobby`
- **Server → Client**: `lobby_state`, `leave_ok`, `error`

#### Game Page

- **Client → Server**: `draw_card`, `play_card`, `restart_game`
- **Server → Client**: `game_state`, `card_played`, `player_died`, `game_end`, `card_drawn`, a další herně-specifické zprávy

**Detailní specifikace** všech zpráv najdete v příslušných template souborech.

## 📖 Struktura dokumentů

```
_TEMPLATE_GAME_PROJECT/
├── README.md                    # Tento soubor - přehled dokumentace
├── TEMPLATE_LOGIN_PAGE.md      # Šablona přihlašovací stránky
├── TEMPLATE_LOBBY_PAGE.md      # Šablona lobby stránky
└── TEMPLATE_GAME_PAGE.md       # Šablona herní stránky (2 varianty)
```

## 🎯 Typy her

### Karetní hry (Varianta 1)

Vhodné pro všechny typy karetních her, které vyžadují:

- Balíček karet (deck)
- Karty v ruce hráče (hand)
- Chat se zprávami
- Seznam hráčů s jejich stavy

**Charakteristiky:**

- Layout optimalizovaný pro zobrazení karet
- Interaktivní karty s hover efekty
- Dynamické aktualizace balíčku a ruky
- Chat pro komunikaci mezi hráči

### Deskové hry (Varianta 2)

Vhodné pro všechny typy deskových her, které vyžadují:

- Herní desku (SVG)
- Kostku nebo jiný náhodný prvek
- Figurky nebo herní prvky
- Statistiky hry
- Sidebar s informacemi

**Charakteristiky:**

- Layout s herní deskou uprostřed
- Sidebar s informacemi o hráčích a statistikách
- SVG vykreslení herní plochy
- Interaktivní prvky pro pohyb figurek

## ✅ Best practices

### HTML

- Používejte sémantické HTML elementy
- Vždy přidávejte `id` atributy pro JavaScript
- Používejte box-style komponenty (`.box` třída)

### CSS

- Respektujte box-style design systém
- Používejte responzivní breakpointy
- Optimalizujte pro touch zařízení

### JavaScript

- Vždy používejte `escapeHtml()` pro uživatelské vstupy
- Správně spravujte WebSocket životní cyklus
- Implementujte reconnect mechanismus
- Používejte SessionStorage pro perzistenci

### WebSocket

- Validujte všechny zprávy na serveru
- Implementujte error handling
- Používejte token systém pro autentizaci
- Zajistěte reconnect funkcionalitu

## 🔧 Přizpůsobení pro vlastní projekt

### Změna textů

- Upravte nadpisy a texty tlačítek
- Změňte chybové zprávy
- Přizpůsobte zprávy v chatu

### Změna stylů

- Upravte barvy (primární barva: `#667eea`)
- Změňte velikosti a padding
- Přizpůsobte responzivní breakpointy
- Upravte barvy karet (pro karetní hry)

### Rozšíření funkcionality

- Přidejte admin funkce
- Přidejte spectator mode
- Přidejte možnost změny jména
- Přidejte nastavení hry
- Přidejte zvukové efekty
- Přidejte animace

## ❓ Otázky?

Pokud máte otázky nebo potřebujete pomoc:

1. Zkontrolujte příslušný template dokument v této složce
2. Podívejte se na existující herní aplikace jako referenci
3. Kontaktujte autora projektu

---

**Poznámka:** Tato šablona je navržena tak, aby byla univerzální a použitelná pro standardizaci všech webových herních aplikací v projektu. Při vytváření nových herních aplikací vždy dodržujte tyto konvence.
