# Dokumentace šablony pro webové aplikace

Tato složka obsahuje šablonu a dokumentaci pro standardizované webové aplikace: hlavní menu s klikacím nadpisem, záložky 150×40 px, zápatí s verzí z `version.json`, stránka nastavení s mřížkou karet 620×120 px, notifikace v pravém dolním rohu.

## 📁 Referenční styly (app.css)

V této složce je soubor **[reference_app.css](./reference_app.css)** – kopie hlavního stylesheetu aplikace. Obsahuje všechny třídy zmiňované v dokumentech (`.card`, `.btn`, `.form-group`, `.input`, `.page-header`, CSS proměnné v `:root` atd.).

- **Pro novou aplikaci:** zkopírujte `reference_app.css` do vašeho projektu jako `app/static/css/app.css` (nebo ekvivalentní cestu) a v `base.html` načtěte tento soubor.
- **Synchronizace:** referenční soubor může být občas aktualizován z reálné aplikace; při použití šablony v jiném repo jej můžete znovu zkopírovat nebo porovnat s vlastním `app.css`.

---

## 📚 Dokumenty

### [TEMPLATE_LAYOUT.md](./TEMPLATE_LAYOUT.md) - Šablona layoutu
Kompletní průvodce strukturou stránek a layoutem:
- Základní struktura stránky
- Hlavička stránky
- Sekce a boxy
- Layout vzory (jednoduchá stránka, více sekcí, dvousloupcový, formulář)
- Navigace
- Prázdný stav
- Best practices

**Začněte zde** při vytváření nové stránky.

### [TEMPLATE_COMPONENTS.md](./TEMPLATE_COMPONENTS.md) - Šablona komponent
Kompletní seznam všech standardizovaných UI komponent:
- Tlačítka (všechny typy a barvy)
- Formuláře (input, select, checkbox, radio, textarea)
- Tabulky
- Badge a statusy
- Karty
- Modaly
- Loading stavy
- Ikony
- Notifikace

**Použijte jako referenci** při hledání konkrétních komponent.

### [TEMPLATE_TECHNOLOGY.md](./TEMPLATE_TECHNOLOGY.md) - Technologický stack
Kompletní popis technologií a architektury:
- Přehled architektury
- Backend (Python, FastAPI, Jinja2)
- Frontend (HTML5, lokální CSS – app.css, HTMX)
- Databáze (SQLite)
- Autentizace a autorizace (OAuth2)
- Modulární systém
- Deployment (odkaz na Docker)
- Best practices

**Přečtěte si** pro pochopení technologického stacku.

### [TEMPLATE_DOCKER.md](./TEMPLATE_DOCKER.md) - Docker
Kontejnerizace a orchestrace (vychází z reálných projektů Nexus, Fit, Game):
- Dockerfile (non-root, healthcheck, WeasyPrint, verze buildu)
- Docker Compose (minimální varianta, image z registry, volumes pro vývoj)
- Přístup k hostiteli (DB na hostu), proměnné prostředí
- OAuth2 Proxy + Redis (volitelně)
- Best practices

**Použijte** při nasazování nebo úpravě Dockeru (build, compose, env).

### [TEMPLATE_MENU.md](./TEMPLATE_MENU.md) - Šablona menu
Průvodce hlavní navigací podle aktuálního designu:
- Klikací nadpis aplikace (odkaz na přehled), záložky 150×40 px
- Desktop (horizontální pruh) a mobil (vysouvací panel)
- Aktivní stav přes `current_tab` z backendu
- Blok uživatele, hamburger, podsekce jako karty na stránce nastavení

**Použijte** při přidávání nebo úpravě položek v hlavním menu.

### [TEMPLATE_FOOTER.md](./TEMPLATE_FOOTER.md) - Šablona zápatí
Průvodce zápatím stránky (footer):
- Aktuální struktura (třídy z app.css: ohraničení, kontejner, typografie)
- Verze z `app/static/version.json` → `app_version` v šabloně
- Rozšíření přes blok `footer`, varianty s odkazy
- Best practices

**Použijte** při úpravě nebo rozšíření zápatí v `base.html`.

## 🚀 Rychlý start

### 1. Vytvoření nové stránky

1. Otevřete [TEMPLATE_LAYOUT.md](./TEMPLATE_LAYOUT.md)
2. Zkopírujte příslušný layout vzor
3. Upravte podle potřeby
4. Použijte komponenty z [TEMPLATE_COMPONENTS.md](./TEMPLATE_COMPONENTS.md)

### 2. Použití komponent

1. Otevřete [TEMPLATE_COMPONENTS.md](./TEMPLATE_COMPONENTS.md)
2. Najděte požadovanou komponentu
3. Zkopírujte kód
4. Upravte podle potřeby

### 3. Kontrola konzistence

- ✅ Používáte standardní třídy tlačítek (`.btn`, `.btn-primary`, `.btn-outline`)?
- ✅ Dodržujete strukturu boxů (třída `.card`, příp. `.page-content-box`)?
- ✅ Máte správnou hlavičku stránky (`.page-header`, h1, volitelný popis)?
- ✅ Používáte `showNotification()` místo `alert()`?
- ✅ Hlavní obsah je v kontejneru (`.container` v base.html)?
- ✅ Interaktivní prvky mají přechody definované v app.css?
- ✅ Záložky v menu 150×40 px; aktivní stav přes `current_tab` / aktivní třída z backendu?

## 📋 Checklist pro novou stránku

- [ ] Hlavní obsah respektuje kontejner z base.html
- [ ] Hlavička stránky má správnou strukturu (page-header, page-title)
- [ ] Sekce používají standardní box (třída `.card` z app.css)
- [ ] Používám standardní komponenty z TEMPLATE_COMPONENTS.md
- [ ] Formuláře mají validaci
- [ ] Destruktivní akce mají potvrzení
- [ ] Používám `showNotification()` pro zpětnou vazbu
- [ ] Respektuji spacing a třídy z app.css

## 🎨 Klíčové principy

### Konzistence
- Všechny stránky musí vypadat a chovat se stejně
- Používejte pouze standardní komponenty
- Dodržujte barevné schéma

### Jednoduchost
- Používejte jednoduché, čisté komponenty
- Vyhněte se zbytečným animacím a efektům
- Respektujte whitespace

### Přístupnost
- Používejte sémantické HTML
- Přidávejte aria-labels kde je potřeba
- Zajišťujte keyboard navigation

### Performance
- Používejte HTMX pro dynamické obsahy
- Minimalizujte JavaScript
- Optimalizujte obrázky

## 📖 Struktura dokumentů

```
_TEMPLATES_WEB_APPLICATION/
├── README.md                 # Tento soubor – přehled dokumentace
├── reference_app.css         # Referenční styly – zkopírujte do app/static/css/app.css
├── TEMPLATE_LAYOUT.md        # Šablona layoutu a struktury stránek
├── TEMPLATE_COMPONENTS.md    # Šablona komponent UI
├── TEMPLATE_TECHNOLOGY.md    # Technologický stack a architektura
├── TEMPLATE_DOCKER.md       # Docker (Dockerfile, Compose, OAuth2)
├── TEMPLATE_MENU.md          # Šablona menu a navigace
└── TEMPLATE_FOOTER.md        # Šablona zápatí stránky
```

## ❓ Otázky?

Pokud máte otázky nebo potřebujete pomoc:
1. Zkontrolujte příslušný dokument v této složce
2. Podívejte se na existující aplikace jako referenci
3. Kontaktujte autora projektu

---

**Poznámka:** Tato šablona je navržena tak, aby byla univerzální a použitelná pro standardizaci všech webových aplikací v projektu. Při vytváření nových stránek vždy dodržujte tyto konvence.
