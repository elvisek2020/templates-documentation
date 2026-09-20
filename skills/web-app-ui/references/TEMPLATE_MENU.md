# Hlavní menu

Navigace je na dvou místech v `base.html`: v hlavičce (desktop) a ve spodní liště (mobil).
Každá položka musí být na obou místech, jinak na telefonu zmizí.

## Obsah

1. [Pravidla](#pravidla)
2. [Hlavička — desktop](#hlavička--desktop)
3. [Spodní lišta — mobil](#spodní-lišta--mobil)
4. [Panel „Více“](#panel-více)
5. [Banner probíhající akce](#banner-probíhající-akce)
6. [Aktivní stav](#aktivní-stav)
7. [Přidání položky](#přidání-položky)

---

## Pravidla

- **Maximálně čtyři hlavní záložky.** Co se nevejde, patří do panelu „Více“ nebo do nastavení.
- Položky pojmenuj podle toho, co uživatel dělá („Vyřídit dnes“), ne podle tabulek („Fronta“).
- Název aplikace vlevo je odkaz na domovskou stránku, ne záložka.
- Aktivní stav řídí backend proměnnou `current_tab`, ne JavaScript ani URL v šabloně.
- Administrativní věci (nastavení, odhlášení) nejsou mezi hlavními záložkami — patří
  vpravo do hlavičky jako ikony a do panelu „Více“ na mobilu.
- Když aplikace běží pro jednoho uživatele bez přihlašování, skryj celé nastavení
  i odhlášení (`{% if not auth_disabled %}`).

---

## Hlavička — desktop

```html
<header class="header">
    <div class="header-inner">
        <div class="header-left">
            <a href="/" class="logo" title="{{ app_name }}">
                <span class="logo-mark">{{ icon('home', 20) }}</span>
                <span>{{ app_name }}</span>
            </a>
            <nav class="nav" aria-label="Hlavní navigace">
                <a href="/zakazky" class="nav-item {% if current_tab == 'zakazky' %}nav-item--active{% endif %}"
                   {% if current_tab == 'zakazky' %}aria-current="page"{% endif %}>{{ icon('list', 18) }}Zakázky</a>
                <a href="/kalendar" class="nav-item {% if current_tab == 'kalendar' %}nav-item--active{% endif %}">{{ icon('calendar', 18) }}Kalendář</a>
                <a href="/faktury" class="nav-item {% if current_tab == 'faktury' %}nav-item--active{% endif %}">{{ icon('file', 18) }}Faktury</a>
            </nav>
        </div>
        <div class="header-right">
            {% if not auth_disabled %}
            <span class="user-chip header-desktop-only" title="{{ current_user.email }}">{{ current_user.display_name or current_user.email }}</span>
            <a href="/settings" class="btn btn-ghost btn-icon header-desktop-only {% if current_tab == 'settings' %}is-on{% endif %}"
               title="Nastavení" aria-label="Nastavení">{{ icon('settings') }}</a>
            <a href="/auth/logout" class="btn btn-ghost btn-icon header-desktop-only" title="Odhlásit" aria-label="Odhlásit">{{ icon('logout') }}</a>
            {% endif %}
        </div>
    </div>
</header>
```

Záložka `.nav-item` má pevnou šířku 150 px a výšku 40 px, ikonu vlevo a text vpravo.
Pod 900 px se celé `.nav` i prvky s `.header-desktop-only` skrývají.

---

## Spodní lišta — mobil

Stejné položky jako v hlavičce plus tlačítko „Více“. Zobrazuje se pod 900 px.

```html
<nav class="tabbar" aria-label="Hlavní navigace">
    <a href="/zakazky" class="tabbar-item {% if current_tab == 'zakazky' %}is-active{% endif %}">{{ icon('list', 22) }}Zakázky</a>
    <a href="/kalendar" class="tabbar-item {% if current_tab == 'kalendar' %}is-active{% endif %}">{{ icon('calendar', 22) }}Kalendář</a>
    <a href="/faktury" class="tabbar-item {% if current_tab == 'faktury' %}is-active{% endif %}">{{ icon('file', 22) }}Faktury</a>
    <button type="button" class="tabbar-item {% if current_tab == 'settings' %}is-active{% endif %}"
            onclick="document.body.classList.add('mobile-nav-open')" aria-label="Další volby">{{ icon('menu', 22) }}Více</button>
</nav>
```

Lišta má čtyři sloupce — při jiném počtu uprav `grid-template-columns` u `.tabbar`
v app.css. `<body class="has-tabbar">` přidá obsahu spodní odsazení, aby lišta nic nepřekryla.

---

## Panel „Více“

Vysouvací panel zespodu s tím, co se do lišty nevešlo:

```html
<div class="mobile-nav-overlay" onclick="document.body.classList.remove('mobile-nav-open')"></div>
<div class="mobile-nav-panel" role="dialog" aria-label="Další volby">
    <div class="mobile-nav-header">
        <span class="mobile-nav-user">{% if not auth_disabled %}{{ current_user.email }}{% endif %}</span>
        <button type="button" class="btn btn-ghost btn-icon btn-sm"
                onclick="document.body.classList.remove('mobile-nav-open')" aria-label="Zavřít">{{ icon('x') }}</button>
    </div>
    <div class="mobile-nav-links">
        <a href="/zakazky/nova" class="mobile-nav-item">{{ icon('plus') }}Nová zakázka</a>
        {% if not auth_disabled %}
        <div class="mobile-nav-divider"></div>
        <a href="/settings" class="mobile-nav-item {% if current_tab == 'settings' %}active{% endif %}">{{ icon('settings') }}Nastavení</a>
        <a href="/auth/logout" class="mobile-nav-item">{{ icon('logout') }}Odhlásit</a>
        {% endif %}
    </div>
</div>
```

Panel se zavírá klepnutím mimo, křížkem i klávesou Escape (obstarává `app.js`).

---

## Banner probíhající akce

Pruh pod hlavičkou, který drží rozdělanou práci na očích — rozpracovaný záznam, běžící
import, otevřená směna. Na všech stránkách kromě té, kam vede.

```html
{% if active_job and current_tab != 'job' %}
<div class="action-banner">
    <a href="/prace/{{ active_job.id }}">
        <span class="pulse-dot" aria-hidden="true"></span>
        <span class="action-banner-title">Probíhá: <strong>{{ active_job.title }}</strong></span>
        <span class="action-banner-cta">Pokračovat {{ icon('arrow-right', 16) }}</span>
    </a>
</div>
{% endif %}
```

Data plní společná funkce kontextu stránky (`page_ctx`), ne jednotlivé routery — viz
skill `web-app-stack`.

---

## Aktivní stav

Router předá `current_tab`:

```python
return templates.TemplateResponse(
    "zakazky/list.html",
    page_ctx(request, current_tab="zakazky", items=items),
)
```

Podstránky patří pod nadřazenou záložku: detail i editace zakázky mají `current_tab="zakazky"`.
Číselníky a nastavení mají vlastní hodnotu, aby se žádná záložka nezvýrazňovala omylem.

---

## Přidání položky

1. Přidej odkaz do `.nav` v hlavičce.
2. Přidej stejný odkaz do `.tabbar` (a případně uprav počet sloupců v app.css).
3. Pokud se nevejde mezi čtyři, dej ji do panelu „Více“.
4. Ve všech routerech modulu nastav `current_tab`.
5. Zkontroluj na šířce 375 px, že se texty v liště nelámou.
