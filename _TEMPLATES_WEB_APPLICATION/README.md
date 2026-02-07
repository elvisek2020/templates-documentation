# Dokumentace šablony pro webové aplikace

Tato složka obsahuje šablonu a dokumentaci pro standardizované webové aplikace: hlavní menu s klikacím nadpisem, záložky 150×40 px, zápatí s verzí z `version.json`, stránka nastavení s mřížkou karet 620×120 px, notifikace v pravém dolním rohu.

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
- Frontend (HTML5, Tailwind CSS, HTMX)
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
- Aktuální struktura (Tailwind: border-t, max-w-7xl, text-sm text-gray-500)
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

- ✅ Používáte standardní barvy tlačítek?
- ✅ Dodržujete strukturu boxů (`bg-white rounded-xl shadow-sm border border-gray-200 p-6`, příp. `page-content-box`)?
- ✅ Máte správnou hlavičku stránky (h1, volitelný page_description)?
- ✅ Používáte `showNotification()` místo `alert()`?
- ✅ Máte `max-w-7xl mx-auto` pro hlavní obsah?
- ✅ Přidáváte `transition-colors` k interaktivním prvkům?
- ✅ Záložky v menu 150×40 px; aktivní stav přes `current_tab` z backendu?

## 📋 Checklist pro novou stránku

- [ ] Používám `max-w-7xl mx-auto` pro hlavní obsah
- [ ] Hlavička stránky má správnou strukturu
- [ ] Sekce používají standardní box (`bg-white rounded-xl shadow-sm border border-gray-200 p-6`)
- [ ] Používám standardní komponenty z TEMPLATE_COMPONENTS.md
- [ ] Formuláře mají validaci
- [ ] Destruktivní akce mají potvrzení
- [ ] Používám `showNotification()` pro zpětnou vazbu
- [ ] Přidávám `transition-colors` k interaktivním prvkům
- [ ] Respektuji spacing konvence (`mb-6` mezi sekcemi)

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
