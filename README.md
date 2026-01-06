# Šablony pro webové aplikace

Kolekce univerzálních šablon a dokumentace pro vytváření standardizovaných webových aplikací.

## 📁 Struktura projektu

### `_TEMPLATES_WEB_APPLICATION/`
Šablony pro standardní webové aplikace (modulární systém s FastAPI, Tailwind CSS, HTMX).

**Soubory:**
- `README.md` - Přehled dokumentace a rychlý start
- `TEMPLATE_LAYOUT.md` - Šablona layoutu a struktury stránek
- `TEMPLATE_COMPONENTS.md` - Šablona UI komponent (tlačítka, formuláře, tabulky, atd.)
- `TEMPLATE_TECHNOLOGY.md` - Technologický stack a architektura

**Použití:** Pro vytváření standardních webových aplikací v modulárním systému.

---

### `_TEMPLATE_GAME_PROJECT/`
Šablony pro webové herní aplikace s real-time komunikací přes WebSocket.

**Soubory:**
- `README.md` - Přehled dokumentace a rychlý start
- `TEMPLATE_LOGIN_PAGE.md` - Šablona přihlašovací stránky
- `TEMPLATE_LOBBY_PAGE.md` - Šablona lobby stránky
- `TEMPLATE_GAME_PAGE.md` - Šablona herní stránky (2 varianty: karetní a deskové hry)

**Použití:** Pro vytváření multiplayer herních aplikací s WebSocket komunikací.

---

### `TEMPLATE_README.md`
Šablona README souboru pro nové projekty.

**Obsahuje:**
- Struktura dokumentace
- Deployment instrukce (Docker Compose)
- GitHub a CI/CD setup
- Technická dokumentace
- Best practices

**Použití:** Zkopírujte a upravte pro nový projekt.

---

### `TEMPLATE_GITHUB_PROJECT.md`
Šablona zadání pro Cursor pro práci s GitHubem a Docker Compose.

**Obsahuje:**
- Git inicializace
- GitHub Actions workflow (GHCR + multi-arch)
- Docker Compose konfigurace
- Deployment instrukce

**Použití:** Copy-paste zadání do Cursoru pro nastavení CI/CD pipeline.

---

## 🚀 Jak použít

### Pro webovou aplikaci

**Prompt pro Cursor:**
```
Použij šablonu z @_TEMPLATES_WEB_APPLICATION a vytvoř novou stránku podle TEMPLATE_LAYOUT.md. 
Použij komponenty z TEMPLATE_COMPONENTS.md a dodržuj konvence z README.md.
```

**Nebo pro konkrétní komponentu:**
```
Vytvoř [název komponenty] podle šablony z @_TEMPLATES_WEB_APPLICATION/TEMPLATE_COMPONENTS.md
```

---

### Pro herní aplikaci

**Prompt pro Cursor - Login stránka:**
```
Vytvoř login stránku podle šablony z @_TEMPLATE_GAME_PROJECT/TEMPLATE_LOGIN_PAGE.md
```

**Prompt pro Cursor - Lobby stránka:**
```
Vytvoř lobby stránku podle šablony z @_TEMPLATE_GAME_PROJECT/TEMPLATE_LOBBY_PAGE.md
```

**Prompt pro Cursor - Herní stránka:**
```
Vytvoř herní stránku podle šablony z @_TEMPLATE_GAME_PROJECT/TEMPLATE_GAME_PAGE.md. 
Použij [Varianta 1 pro karetní hry / Varianta 2 pro deskové hry]
```

---

### Pro nastavení GitHub projektu

**Prompt pro Cursor:**
```
Použij šablonu z @TEMPLATE_GITHUB_PROJECT.md a nastav GitHub Actions workflow a Docker Compose konfiguraci.
Nahraď všechny hodnoty v {} podle aktuálního projektu.
```

---

### Pro vytvoření README

**Prompt pro Cursor:**
```
Vytvoř README.md podle šablony z @TEMPLATE_README.md a uprav všechny placeholdery [v hranatých závorkách] 
podle aktuálního projektu.
```

---

## 📝 Poznámky

- Všechny šablony jsou navrženy pro konzistentní vzhled a chování
- Používají box-style komponenty pro jednotný design
- Jsou určeny pro opakované použití napříč projekty

