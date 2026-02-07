# Šablona menu – Navigace v aplikaci

Tento dokument popisuje strukturu hlavní navigace (menu) podle aktuálního designu aplikace. Použijte tyto vzory pro konzistentní menu.

## 📋 Obsah

1. [Struktura menu](#struktura-menu)
2. [Klikací nadpis („domů“)](#klikací-nadpis-domů)
3. [Položky záložek – desktop](#položky-záložek--desktop)
4. [Položky záložek – mobil](#položky-záložek--mobil)
5. [Blok uživatele a hamburger](#blok-uživatele-a-hamburger)
6. [Aktivní stav (current_tab)](#aktivní-stav-current_tab)
7. [Přidání nové položky](#přidání-nové-položky)
8. [Best practices](#best-practices)

---

## Struktura menu

Menu se zobrazuje na **dvou místech** v `base.html`:

| Místo | Kontejner | Popis |
|-------|-----------|--------|
| **Desktop** | `<nav class="nav hidden lg:flex ...">` | Horizontální pruh v hlavičce, střed stránky |
| **Mobil** | `<nav id="mobile-menu" class="...">` | Boční panel (hamburger), fixed vpravo |

**Pravidlo:** Každou novou záložku je nutné přidat na **obou** místech se stejnými třídami a rozměry.

---

## Klikací nadpis („domů“)

První prvek v hlavičce není záložka „Přehled“, ale **klikací nadpis** aplikace (odkaz na přehled `/`).

- **Přihlášený uživatel:** nadpis je odkaz `<a href="/">` s textem názvu aplikace.
- **Nepřihlášený:** nadpis je obyčejný `<h1>` bez odkazu.

**Desktop – klikací nadpis:**

```html
{% if user %}
<a href="/" class="text-xl font-bold shrink-0 hover:text-blue-600 transition-colors {% if current_tab == 'dashboard' %}text-blue-600{% else %}text-gray-900{% endif %}" title="Přehled">{{ app_name }}</a>
{% else %}
<h1 class="text-xl font-bold text-gray-900 shrink-0">{{ app_name }}</h1>
{% endif %}
```

- Aktivní stav (na přehledu): `text-blue-600`.
- Neaktivní: `text-gray-900`, hover: `hover:text-blue-600`.

---

## Položky záložek – desktop

Záložky mají **pevnou velikost 150×40 px**, středově zarovnaný text. Aktivní záložka je modrá, neaktivní šedá s hover efektem.

**Třídy položky (desktop):**

- Kontejner: `inline-flex items-center justify-center w-[150px] h-[40px] rounded-lg text-sm font-medium transition-colors whitespace-nowrap`
- Aktivní: `bg-blue-600 text-white`
- Neaktivní: `bg-gray-100 text-gray-700 hover:bg-gray-200`

**Příklad – jedna položka (desktop):**

```html
<nav class="nav hidden lg:flex items-center gap-1.5 flex-1 justify-center min-w-0" aria-label="Hlavní navigace">
  <a href="/modul-a" class="nav-item inline-flex items-center justify-center w-[150px] h-[40px] rounded-lg text-sm font-medium transition-colors whitespace-nowrap {% if current_tab == 'modul_a' %}bg-blue-600 text-white{% else %}bg-gray-100 text-gray-700 hover:bg-gray-200{% endif %}">Modul A</a>
  <a href="/modul-b" class="nav-item inline-flex items-center justify-center w-[150px] h-[40px] rounded-lg text-sm font-medium transition-colors whitespace-nowrap {% if current_tab == 'modul_b' %}bg-blue-600 text-white{% else %}bg-gray-100 text-gray-700 hover:bg-gray-200{% endif %}">Modul B</a>
  <!-- ... další položky ... -->
  <a href="/settings" class="nav-item inline-flex items-center justify-center w-[150px] h-[40px] rounded-lg text-sm font-medium transition-colors whitespace-nowrap {% if current_tab == 'settings' %}bg-blue-600 text-white{% else %}bg-gray-100 text-gray-700 hover:bg-gray-200{% endif %}">Nastavení</a>
</nav>
```

**Poznámka:** Záložka „Přehled“ v menu není – přechod na přehled je přes klik na název aplikace. Některé sekce mohou být uvnitř stránky Nastavení (karty odkazující na podstránky).

---

## Položky záložek – mobil

Mobilní menu je **vysouvací panel** (fixed vpravo, šířka např. `w-64 max-w-[85vw]`). Položky mají stejnou velikost jako na desktopu: **150×40 px**.

**Struktura mobilního menu:**

- Overlay: `fixed inset-0 bg-gray-600 bg-opacity-50 z-40 hidden lg:hidden` (id např. `mobile-menu-overlay`).
- Panel: `fixed top-0 right-0 h-full w-64 max-w-[85vw] bg-white shadow-xl z-50 transform translate-x-full transition-transform duration-200 lg:hidden`.
- Hlavička panelu: „Menu“ + tlačítko zavřít (X).
- Obsah: stejné položky jako desktop, první položka = název aplikace (odkaz na `/`).

**Příklad – jedna položka (mobil):**

```html
<a href="/" class="mobile-nav-item flex items-center justify-center w-[150px] h-[40px] rounded-lg text-sm font-medium transition-colors {% if current_tab == 'dashboard' %}bg-blue-600 text-white{% else %}bg-gray-100 text-gray-700 hover:bg-gray-200{% endif %}">{{ app_name }}</a>
<a href="/modul-a" class="mobile-nav-item flex items-center justify-center w-[150px] h-[40px] rounded-lg text-sm font-medium transition-colors {% if current_tab == 'modul_a' %}bg-blue-600 text-white{% else %}bg-gray-100 text-gray-700 hover:bg-gray-200{% endif %}">Modul A</a>
<!-- ... -->
```

Otevírání/zavírání: tlačítko hamburger přidá/odebere třídu `translate-x-full` na panel a zobrazí/skryje overlay; při otevření `document.body.style.overflow = 'hidden'`, při zavření vráceno.

---

## Blok uživatele a hamburger

V hlavičce vpravo:

- **Blok uživatele:** jméno (např. `{{ user.display_name or user.username }}`) a odkaz „Odhlásit“. Kontejner např. `flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 shadow-sm`.
- **Hamburger tlačítko:** pouze na mobilu (`lg:hidden`), `aria-label="Otevřít menu"`. Klikem se otevře mobilní menu.

---

## Aktivní stav (current_tab)

Aktivní záložka se určuje podle **proměnné z backendu** `current_tab`, ne podle `request.url.path` v šabloně.

| current_tab   | Stránka / sekce      |
|---------------|----------------------|
| `dashboard`   | Přehled (/)          |
| `modul_a`     | První modul           |
| `modul_b`     | Druhý modul           |
| `settings`    | Nastavení (a podstránky) |

**Backend:** Při vykreslení stránky předat do šablony `current_tab` (např. `"modul_a"`). V FastAPI:

```python
return templates.TemplateResponse(
    "modul_a.html",
    {"request": request, "user": user, "current_tab": "modul_a", ...},
)
```

V šabloně pak `{% if current_tab == 'modul_a' %}bg-blue-600 text-white{% else %}...{% endif %}`.

---

## Přidání nové položky

1. **Backend:** Přidat route a v kontextu šablony vždy posílat `current_tab` (např. `"muj_modul"`).
2. **base.html – desktop:** Do `<nav class="nav ...">` vložit nový odkaz se stejnými třídami (`w-[150px] h-[40px]`, aktivní/neaktivní podle `current_tab`).
3. **base.html – mobil:** Do `<div class="p-4 flex flex-col gap-1">` v mobilním menu vložit stejnou položku (stejné třídy, stejný `current_tab`).
4. Pořadí položek na desktopu a v mobilu udržujte shodné.

---

## Best practices

1. **Dvojice desktop + mobil** – každou záložku přidat na obě místa se stejnou velikostí (150×40) a stejným aktivním stavem.
2. **Jednotná velikost** – všechny záložky `w-[150px] h-[40px]`, bez výjimek.
3. **Aktivní stav** – vždy z backendu (`current_tab`), ne počítat z URL v šabloně.
4. **Klikací nadpis** – přehled (dashboard) je dostupný přes název aplikace, ne přes samostatnou záložku „Přehled“.
5. **Sekce pod Nastavením** – některé položky mohou být karty na stránce Nastavení (`/settings`) místo záložek v hlavním menu.
6. **Přístupnost** – `aria-label` na nav a na tlačítku hamburger, u odkazů smysluplný text.

---

## Shrnutí

- **Klikací nadpis** (název aplikace) vede na přehled; záložka „Přehled“ v menu není.
- **Záložky** mají pevnou velikost **150×40 px**, aktivní stav podle `current_tab` z backendu.
- **Desktop i mobil** používají stejné styly položek; mobil = vysouvací panel s overlay.
- **Podsekce** lze umístit na stránku Nastavení jako karty (viz TEMPLATE_LAYOUT – mřížka vstupních karet).

Při úpravách menu vždy upravte obě sekce v `base.html` a předávejte `current_tab` z aplikace.
