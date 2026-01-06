# Technologický stack - Architektura a technologie

Tento dokument popisuje technologický stack a architekturu používanou pro vývoj webových aplikací. Poskytuje přehled všech technologií, jejich účelu a způsobu použití.

## 📋 Obsah

1. [Přehled architektury](#přehled-architektury)
2. [Backend](#backend)
3. [Frontend](#frontend)
4. [Databáze](#databáze)
5. [Autentizace a autorizace](#autentizace-a-autorizace)
6. [Modulární systém](#modulární-systém)
7. [Deployment](#deployment)
8. [Best practices](#best-practices)

---

## Přehled architektury

### Obecná architektura

Projekt používá **modulární architekturu** s následujícími charakteristikami:

- **Backend:** Python s FastAPI frameworkem
- **Frontend:** Server-side rendering s Jinja2 templaty
- **Styling:** Tailwind CSS (utility-first CSS framework)
- **Interaktivita:** HTMX pro dynamické obsahy bez nutnosti psát JavaScript
- **Databáze:** SQLite (oddělené databáze per aplikace)
- **Autentizace:** OAuth2 proxy s integrací Entra ID

### Architektonické principy

- **Modularita:** Každá aplikace je samostatný modul
- **Konzistence:** Jednotný vzhled a chování napříč aplikacemi
- **Jednoduchost:** Minimální JavaScript, maximální využití server-side renderingu
- **Výkon:** Rychlé načítání, optimalizované dotazy
- **Škálovatelnost:** Snadné přidávání nových aplikací

---

## Backend

### Python

**Verze:** Python 3.8+

**Účel:**
- Hlavní programovací jazyk pro backend
- Zpracování business logiky
- Práce s databází
- API endpointy

**Klíčové vlastnosti:**
- Moderní syntaxe
- Bohatá ekosystém knihoven
- Snadná integrace s různými službami

### FastAPI

**Účel:** Moderní, rychlý webový framework pro Python

**Klíčové vlastnosti:**
- **Vysoký výkon:** Založen na Starlette a Pydantic
- **Automatická dokumentace:** OpenAPI/Swagger dokumentace
- **Type hints:** Podpora Python type hints
- **Asynchronní:** Podpora async/await
- **Validace:** Automatická validace requestů a response

**Základní struktura:**

```python
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from starlette.templating import Jinja2Templates

app = FastAPI()
templates = Jinja2Templates(directory="/app/templates")

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
```

**Výhody:**
- Rychlý vývoj
- Automatická validace
- Moderní API design
- Vynikající výkon

### Jinja2

**Účel:** Template engine pro server-side rendering

**Klíčové vlastnosti:**
- **Template inheritance:** Dědičnost šablon
- **Filtry:** Vlastní filtry pro formátování dat
- **Makro:** Opakovatelné části kódu
- **Kontext:** Předávání dat z backendu do frontendu

**Základní použití:**

```html
{% extends "base.html" %}
{% block title %}{{ page_title }}{% endblock %}

{% block content %}
<div class="max-w-7xl mx-auto">
  <h1>{{ page_title }}</h1>
  {% if items %}
    {% for item in items %}
      <div>{{ item.name }}</div>
    {% endfor %}
  {% endif %}
</div>
{% endblock %}
```

**Vlastní filtry:**

```python
def fmt_dt(dt_str: str) -> str:
    # Formátování data a času
    return dt.astimezone(ZoneInfo("Europe/Prague")).strftime("%d.%m.%Y %H:%M:%S")

templates.env.filters["fmt_dt"] = fmt_dt
```

**Výhody:**
- Čistá syntaxe
- Flexibilní
- Výkonný
- Bezpečný (automatické escapování)

---

## Frontend

### HTML5

**Účel:** Struktura webových stránek

**Klíčové vlastnosti:**
- Sémantické HTML elementy
- Accessibility (ARIA atributy)
- Responsive design (meta viewport)

**Best practices:**
- Používejte sémantické tagy (`<section>`, `<article>`, `<nav>`)
- Přidávejte `aria-labels` pro přístupnost
- Respektujte HTML5 standardy

### Tailwind CSS

**Účel:** Utility-first CSS framework

**Verze:** 2.2.19 (via CDN)

**Klíčové vlastnosti:**
- **Utility classes:** Rychlé stylování pomocí tříd
- **Responsive design:** Breakpointy (sm, md, lg, xl)
- **Konzistence:** Předdefinované barvy, spacing, typography
- **Customizace:** Možnost rozšíření v `app.css`

**Základní použití:**

```html
<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <h2 class="text-lg font-semibold text-gray-900 mb-4">Nadpis</h2>
  <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
    Tlačítko
  </button>
</div>
```

**Výhody:**
- Rychlý vývoj
- Konzistentní design
- Malá velikost (pouze použité třídy)
- Snadná údržba

**Custom CSS:**

Pro vlastní styly použijte `app/static/css/app.css`:

```css
/* Vlastní animace */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Vlastní komponenty */
.custom-component {
  /* Vlastní styly */
}
```

### HTMX

**Účel:** Moderní způsob přidávání interaktivity bez psaní JavaScriptu

**Verze:** 2.0.3

**Klíčové vlastnosti:**
- **AJAX requests:** HTTP requesty bez reloadu stránky
- **Partial updates:** Aktualizace částí stránky
- **Form handling:** Odesílání formulářů bez reloadu
- **WebSockets:** Podpora real-time komunikace

**Základní použití:**

```html
<!-- Automatické obnovení každých 5 sekund -->
<div hx-get="/path/to/status" 
     hx-trigger="load, every 5s" 
     hx-target="this" 
     hx-swap="innerHTML">
  Načítám...
</div>

<!-- Formulář s HTMX -->
<form hx-post="/path/to/submit"
      hx-target="#result"
      hx-swap="innerHTML">
  <input type="text" name="name">
  <button type="submit">Odeslat</button>
</form>
<div id="result"></div>
```

**Výhody:**
- Minimální JavaScript
- Jednoduchá implementace
- Vysoký výkon
- Progresivní enhancement

**HTMX atributy:**
- `hx-get`, `hx-post`, `hx-put`, `hx-delete` - HTTP metody
- `hx-trigger` - Kdy spustit request
- `hx-target` - Kam vložit výsledek
- `hx-swap` - Jak vložit výsledek

### JavaScript (minimální)

**Účel:** Pouze pro specifické funkce, které nelze řešit HTMX

**Použití:**
- Globální notifikační systém (`showNotification()`)
- Live clock
- Interaktivní komponenty (modaly, dropdowny)
- Custom logika

**Best practices:**
- Minimalizujte JavaScript
- Preferujte HTMX
- Používejte vanilla JavaScript (bez frameworků)
- Udržujte kód jednoduchý

---

## Databáze

### SQLite

**Účel:** Relační databáze pro ukládání dat

**Klíčové vlastnosti:**
- **Souborová databáze:** Každá databáze je samostatný soubor
- **Oddělené DB:** Každá aplikace má vlastní databázi
- **ACID:** Transakční integrita
- **WAL mode:** Write-Ahead Logging pro lepší výkon

**Struktura:**

```
data/
├── app.db              # Hlavní databáze (uživatelé, aplikace, oprávnění)
├── app1.db             # Databáze aplikace 1
├── app2.db             # Databáze aplikace 2
└── ...
```

**Výhody:**
- Jednoduchá správa
- Žádná konfigurace serveru
- Snadné zálohování (kopírování souboru)
- Vhodné pro střední zátěž

**Práce s databází:**

```python
import sqlite3

conn = sqlite3.connect('/app/data/app.db')
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute("SELECT * FROM users WHERE id = ?", (user_id,))
user = cur.fetchone()

conn.commit()
conn.close()
```

**Best practices:**
- Používejte prepared statements (ochrana proti SQL injection)
- Vždy commitujte transakce
- Používejte `row_factory` pro lepší práci s výsledky
- Zavírejte spojení po použití

---

## Autentizace a autorizace

### OAuth2 Proxy

**Účel:** Externí autentizace přes OAuth2

**Klíčové vlastnosti:**
- **Entra ID integrace:** Přihlášení přes Microsoft Entra ID
- **Session management:** Správa session na úrovni proxy
- **Headers:** Uživatelské informace v HTTP hlavičkách

**Flow:**
1. Uživatel přistupuje k aplikaci
2. OAuth2 proxy zkontroluje session
3. Pokud není přihlášen, přesměruje na přihlášení
4. Po přihlášení předá hlavičky s uživatelskými informacemi

**Hlavičky:**
- `X-Forwarded-User` - UPN uživatele
- `X-Forwarded-Email` - Email uživatele
- `X-Forwarded-Preferred-Username` - Preferované jméno
- `X-Forwarded-Groups` - Skupiny uživatele

**Session middleware:**

```python
from starlette.middleware.sessions import SessionMiddleware

app.add_middleware(
    SessionMiddleware,
    secret_key=os.environ.get("SESSION_SECRET"),
    https_only=True,
    same_site="lax",
)
```

### Autorizace

**Účel:** Kontrola oprávnění uživatelů

**Systém oprávnění:**
- **Admin:** Plná práva na všechny aplikace
- **Uživatel:** Přístup pouze k aplikacím s oprávněním
- **Aplikace:** Každá aplikace může mít vlastní logiku oprávnění

**Implementace:**

```python
from app.db import get_user

def check_access(user, app_slug):
    if user.is_admin:
        return True
    # Kontrola oprávnění pro konkrétní aplikaci
    return has_app_access(user.id, app_slug)
```

---

## Modulární systém

### Architektura modulů

Každá aplikace je samostatný modul s vlastní strukturou:

```
app/apps/[module_name]/
├── __init__.py          # Registrace modulu
├── routers.py          # FastAPI routy
├── db.py               # Databázové operace
├── models.py           # Datové modely
└── static/             # Statické soubory
```

### Registrace modulu

```python
from dataclasses import dataclass
from fastapi import APIRouter
from .routers import router

@dataclass
class AppModule:
    slug: str
    title: str
    router: APIRouter
    order: int
    assets_css: str = None
    assets_js: str = None

def register():
    return AppModule(
        slug="module_name",
        title="Název modulu",
        router=router,
        order=50,
        assets_css="module_name/css/app.css",
        assets_js="module_name/js/app.js"
    )
```

### Dynamické načítání

Moduly se načítají dynamicky z databáze:

```python
from registry import load_and_register_apps

apps_rows = fetch_all_apps_active()
registry = load_and_register_apps(app, apps_rows)

# Každý modul je automaticky zaregistrován
for slug, app_module in registry.items():
    app.include_router(app_module.router, prefix=f"/apps/{slug}")
```

**Výhody:**
- Snadné přidávání nových aplikací
- Nezávislost modulů
- Dynamické načítání CSS/JS
- Centralizovaná správa

---

## Deployment

### Docker

**Účel:** Kontejnerizace aplikace

**Struktura:**
- `Dockerfile` - Definice image
- `docker-compose.yml` - Orchestrace služeb
- Multi-stage build pro optimalizaci

**Základní struktura:**

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ /app/app/
COPY static/ /app/static/
COPY templates/ /app/templates/

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment proměnné

**Klíčové proměnné:**
- `DB_PATH` - Cesta k hlavní databázi
- `SESSION_SECRET` - Tajný klíč pro session
- `ADMIN_OID` - OID admin uživatele
- Aplikace-specifické proměnné

**Best practices:**
- Nikdy necommitujte citlivé údaje
- Používejte `.env` soubory pro lokální vývoj
- Dokumentujte všechny proměnné

---

## Best practices

### Backend

1. **Type hints:** Vždy používejte type hints
2. **Error handling:** Správné zacházení s chybami
3. **Validace:** Validujte všechny vstupy
4. **Security:** Ochrana proti SQL injection, XSS
5. **Logging:** Logujte důležité události

### Frontend

1. **Semantic HTML:** Používejte sémantické tagy
2. **Accessibility:** ARIA atributy, keyboard navigation
3. **Performance:** Optimalizace obrázků, lazy loading
4. **Responsive:** Mobile-first design
5. **Konzistence:** Dodržujte design systém

### Databáze

1. **Prepared statements:** Vždy používejte placeholdery
2. **Transactions:** Správné použití transakcí
3. **Indexy:** Optimalizace dotazů
4. **Zálohování:** Pravidelné zálohy
5. **Migrations:** Verzování změn schématu

### Bezpečnost

1. **Input validation:** Validace všech vstupů
2. **Output encoding:** Escapování výstupů
3. **HTTPS:** Vždy používejte HTTPS v produkci
4. **Secrets:** Bezpečné ukládání tajemství
5. **CORS:** Správná konfigurace CORS

---

## Shrnutí

Tento technologický stack poskytuje:

✅ **Moderní technologie** - FastAPI, Tailwind CSS, HTMX  
✅ **Vysoký výkon** - Asynchronní backend, optimalizovaný frontend  
✅ **Jednoduchost** - Minimální JavaScript, server-side rendering  
✅ **Modularita** - Snadné přidávání nových aplikací  
✅ **Konzistence** - Jednotný design systém  
✅ **Škálovatelnost** - Architektura připravená na růst  

Při vývoji nových aplikací vždy respektujte tento technologický stack a používejte doporučené best practices.

