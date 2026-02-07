# Šablona menu - Navigace v aplikaci

Tento dokument popisuje standardizovanou strukturu hlavní navigace (menu) a postup pro přidání nové položky. Použijte tyto vzory pro konzistentní menu napříč aplikací.

## 📋 Obsah

1. [Struktura menu](#struktura-menu)
2. [Anatomie položky menu](#anatomie-položky-menu)
3. [Přidání položky – vždy viditelná](#přidání-položky--vždy-viditelná)
4. [Přidání položky – podle modulu](#přidání-položky--podle-modulu)
5. [Přidání položky – jen pro role](#přidání-položky--jen-pro-role)
6. [Přidání položky – vlastní podmínka](#přidání-položky--vlastní-podmínka)
7. [Aktivní stav (active)](#aktivní-stav-active)
8. [Nový modul a route](#nový-modul-a-route)
9. [Best practices](#best-practices)

---

## Struktura menu

Menu se zobrazuje na **dvou místech** v základní šabloně (`base.html`):

| Místo | Kontejner | Třída položky | Popis |
|-------|------------|---------------|--------|
| **Desktop** | `<nav class="nav">` | `nav-item` | Horizontální pruh v hlavičce |
| **Mobil** | `<nav class="mobile-nav-links">` | `mobile-nav-item` | Boční panel (hamburger menu) |

**Pravidlo:** Každou novou položku je nutné přidat na **obou** místech, aby byla navigace konzistentní na všech zařízeních.

---

## Anatomie položky menu

Každá položka obsahuje:

- **URL** – `href` na cílovou stránku
- **Ikona** – emoji nebo ikona v `<span>`
- **Text** – viditelný label
- **Aktivní stav** – třída `active` podle aktuální cesty
- **Viditelnost** – volitelná podmínka (modul, role, vlastní logika)

### Minimální položka (desktop)

```html
<a href="/moje-stranka" class="nav-item {% if request.url.path == '/moje-stranka' %}active{% endif %}">
    <span>🆕</span> Moje stránka
</a>
```

### Minimální položka (mobil)

```html
<a href="/moje-stranka" class="mobile-nav-item {% if request.url.path == '/moje-stranka' %}active{% endif %}">
    <span>🆕</span> Moje stránka
</a>
```

---

## Přidání položky – vždy viditelná

Položka se zobrazí všem přihlášeným uživatelům. Vložte uvnitř bloku `{% if user %}`.

**Desktop** (`base.html` – sekce `<nav class="nav">`):

```html
<a href="/aktivity" class="nav-item {% if request.url.path == '/aktivity' %}active{% endif %}">
    <span>❤️</span> Aktivity
</a>
```

**Mobil** (`base.html` – sekce `<nav class="mobile-nav-links">`):

```html
<a href="/aktivity" class="mobile-nav-item {% if request.url.path == '/aktivity' %}active{% endif %}">
    <span>❤️</span> Aktivity
</a>
```

---

## Přidání položky – podle modulu

Položka se zobrazí pouze když je modul zapnutý v konfiguraci (např. v Admin). Předpokládá existenci `request.state.module_XYZ_enabled`.

**Desktop:**

```html
{% if request.state.module_kouc_enabled %}
<a href="/coach" class="nav-item {% if request.url.path == '/coach' %}active{% endif %}">
    <span>📅</span> Kouč
</a>
{% endif %}
```

**Mobil:**

```html
{% if request.state.module_kouc_enabled %}
<a href="/coach" class="mobile-nav-item {% if request.url.path == '/coach' %}active{% endif %}">
    <span>📅</span> Kouč
</a>
{% endif %}
```

**Poznámka:** Hodnoty `module_*_enabled` se obvykle načítají v middleware z databáze (např. `ModuleConfig`) a nastavují se do `request.state`.

---

## Přidání položky – jen pro role

Položka pouze pro administrátory (nebo jinou roli).

**Desktop:**

```html
{% if user.role.value == 'admin' %}
<a href="/admin" class="nav-item {% if '/admin' in request.url.path %}active{% endif %}">
    <span>⚙️</span> Admin
</a>
{% endif %}
```

**Mobil:**

```html
{% if user.role.value == 'admin' %}
<a href="/admin" class="mobile-nav-item {% if '/admin' in request.url.path %}active{% endif %}">
    <span>⚙️</span> Admin
</a>
{% endif %}
```

---

## Přidání položky – vlastní podmínka

Položka závislá na vlastní logice (např. existence aktivní medailové výzvy). Podmínka se nastavuje v middleware do `request.state`.

**Desktop:**

```html
{% if request.state.has_active_medal_challenge %}
<a href="/medals" class="nav-item {% if request.url.path == '/medals' %}active{% endif %}">
    <span>🏅</span> Medaile
</a>
{% endif %}
```

**Mobil:**

```html
{% if request.state.has_active_medal_challenge %}
<a href="/medals" class="mobile-nav-item {% if request.url.path == '/medals' %}active{% endif %}">
    <span>🏅</span> Medaile
</a>
{% endif %}
```

---

## Aktivní stav (active)

Třída `active` se přidá podle aktuální cesty tak, aby uživatel viděl zvýrazněnou položku.

| Typ stránky | Podmínka pro active |
|-------------|---------------------|
| Jedna přesná URL | `request.url.path == '/activities'` |
| Prefix (podstránky) | `'/admin' in request.url.path` |
| Výjimka (výzvy, ne admin) | `'/challenges' in request.url.path and '/admin' not in request.url.path` |

**Příklad – přesná shoda:**

```html
class="nav-item {% if request.url.path == '/coach' %}active{% endif %}"
```

**Příklad – prefix:**

```html
class="nav-item {% if '/admin' in request.url.path %}active{% endif %}"
```

---

## Nový modul a route

Pokud přidáváte novou stránku, která ještě nemá route:

### 1. Router

Soubor např. `app/routers/muj_modul.py`:

```python
"""Router pro stránku Můj modul"""
from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from app.db import get_db
from app.middleware import get_current_user
from app.templates_config import templates

router = APIRouter()

@router.get("/muj-modul", response_class=HTMLResponse)
async def muj_modul_page(request: Request, user=Depends(get_current_user)):
    if not user:
        return RedirectResponse(url="/login")
    return templates.TemplateResponse(
        "muj_modul.html",
        {"request": request, "user": user},
    )
```

### 2. Registrace v aplikaci

V `app/main.py`:

```python
from app.routers import ..., muj_modul
# ...
app.include_router(muj_modul.router)
```

### 3. Šablona stránky

`app/templates/muj_modul.html` – dědí od `base.html`, vyplní blok `content` dle [TEMPLATE_LAYOUT.md](./TEMPLATE_LAYOUT.md).

### 4. Položky v menu

Přidat položku na obou místech v `base.html` podle jednoho z vzorů výše (vždy viditelná / podle modulu / podle role / vlastní podmínka).

---

## Best practices

### 1. Dvojice desktop + mobil

**Vždy přidávejte položku na obou místech** – v `<nav class="nav">` i v `<nav class="mobile-nav-links">`. Text a ikona musí být shodné.

### 2. Ikony

Používejte **konzistentní emoji** nebo ikony (např. jeden emoji na položku). Příklady: 🏆 Výzvy, ❤️ Aktivity, 🏅 Medaile, ⭐ Úspěchy, 📅 Kouč, 🥗 Výživa, 📈 Metriky, ⚙️ Admin, 👤 Profil.

### 3. Pořadí položek

Zachovejte logické pořadí: hlavní funkce první, profil a Admin na konci. Desktop a mobil by měly mít stejné pořadí.

### 4. Aktivní stav

Používejte přesnou shodu (`== '/path'`) pro jednu stránku a prefix (`'/admin' in request.url.path`) pro sekce s podstránkami. Vyhněte se překrývajícím se podmínkám (např. výzvy vs. admin).

### 5. Viditelnost

- Položky závislé na konfiguraci: `request.state.module_*_enabled`
- Položky jen pro roli: `user.role.value == 'admin'`
- Vlastní logika: nastavte v middleware do `request.state` a používejte v šabloně

### 6. Přístupnost

- Odkazy v menu mají smysluplný text (ne jen ikona).
- Aktivní položka je vizuálně odlišená třídou `active` (styly v hlavním CSS).

---

## Shrnutí

Tato šablona menu poskytuje:

✅ **Jednotnou strukturu** položky (href, ikona, label, active)  
✅ **Vzory viditelnosti** (vždy / modul / role / vlastní podmínka)  
✅ **Konzistenci** desktop + mobil  
✅ **Pravidla pro aktivní stav** a pořadí položek  

Při přidávání nových položek do menu vždy upravte obě sekce v `base.html` a dodržujte tyto konvence.
