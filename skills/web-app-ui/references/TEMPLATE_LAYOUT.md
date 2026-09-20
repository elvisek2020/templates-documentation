# Layout stránek

Struktura `base.html` a vzory jednotlivých stránek. Styly jsou výhradně z `app.css`
(žádný Tailwind ani jiný utility framework).

## Obsah

1. [Kostra base.html](#kostra-basehtml)
2. [Minimální stránka](#minimální-stránka)
3. [Hlavička stránky](#hlavička-stránky)
4. [Sekce a karty](#sekce-a-karty)
5. [Rozvržení obsahu](#rozvržení-obsahu)
6. [Master–detail](#masterdetail)
7. [Akce na konci stránky](#akce-na-konci-stránky)
8. [Prázdný stav](#prázdný-stav)
9. [Přihlašovací stránky](#přihlašovací-stránky)
10. [Responzivita](#responzivita)

---

## Kostra base.html

Jedna šablona drží hlavičku, menu, mobilní lištu, zápatí a globální prvky (toast, modal).
Stránky plní jen `{% block content %}`.

```html
{% from "_icons.html" import icon %}
{%- set show_chrome = current_user and not hide_chrome -%}
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>{% block title %}{{ app_name }}{% endblock %}</title>
    <link rel="stylesheet" href="/static/css/app.css?v={{ app_version }}">
    <script>
        // Zvolený motiv nastavit ještě před vykreslením (jinak stránka blikne).
        try {
            var t = localStorage.getItem('theme');
            if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
        } catch (e) {}
    </script>
    <script src="https://unpkg.com/htmx.org@2.0.3"></script>
    <script src="/static/js/app.js?v={{ app_version }}" defer></script>
    {% block head %}{% endblock %}
</head>
<body class="{% if show_chrome %}has-tabbar{% endif %} {% block body_class %}{% endblock %}">
    <script>
        try {
            if (localStorage.getItem('layout-wide') === '1') document.body.classList.add('layout-wide');
        } catch (e) {}
    </script>

    {% if show_chrome %}
    <header class="header">
        <div class="header-inner">
            <div class="header-left">
                <a href="/" class="logo" title="{{ app_name }}">
                    <span class="logo-mark">{{ icon('home', 20) }}</span>
                    <span>{{ app_name }}</span>
                </a>
                <nav class="nav" aria-label="Hlavní navigace">
                    {# položky viz TEMPLATE_MENU.md #}
                </nav>
            </div>
            <div class="header-right">
                <span class="user-chip header-desktop-only">{{ current_user.email }}</span>
                <a href="/settings" class="btn btn-ghost btn-icon header-desktop-only" aria-label="Nastavení">{{ icon('settings') }}</a>
            </div>
        </div>
    </header>

    {# volitelně: banner probíhající akce — viz TEMPLATE_MENU.md #}
    {# mobilní spodní lišta a panel „Více“ — viz TEMPLATE_MENU.md #}
    {% endif %}

    <main class="main-content {% block main_class %}{% endblock %}">
        {% if show_chrome %}<div class="container {% block container_class %}{% endblock %}">{% endif %}
            {% block content %}{% endblock %}
        {% if show_chrome %}</div>{% endif %}
    </main>

    {% if show_chrome %}
    <footer class="footer">
        {# verze + přepínač motivu a šířky — viz TEMPLATE_FOOTER.md #}
    </footer>
    {% endif %}

    {# globální prvky obsluhované app.js — viz skill web-app-interactions #}
    <div id="notification-toast" class="toast-container" aria-live="polite"></div>
    <div id="confirm-overlay" class="modal-overlay" role="dialog" aria-modal="true" style="display:none">…</div>

    {% block scripts %}{% endblock %}
</body>
</html>
```

**Proč tak:**

- `show_chrome` vypne hlavičku i zápatí na přihlašovací stránce a ve fokusovaných režimech
  (`hide_chrome=True` z routeru).
- `has-tabbar` přidá dole odsazení, aby mobilní lišta nepřekryla obsah.
- Inline skripty v `<head>` a na začátku `<body>` nastaví motiv a šířku dřív, než se stránka
  vykreslí. Bez nich stránka při načtení blikne.
- `?v={{ app_version }}` u CSS a JS řeší cache. Verze se čte z `app/static/version.json`
  při startu aplikace — po změně statických souborů ji musíš zvýšit.

---

## Minimální stránka

```html
{% extends "base.html" %}
{% from "_icons.html" import icon %}
{% block title %}Název stránky — {{ app_name }}{% endblock %}

{% block content %}
<div class="page-header">
  <div class="page-header-text">
    <h1 class="page-title">Název stránky</h1>
    <p class="page-description">Jedna věta, co na stránce uživatel udělá.</p>
  </div>
  <div class="page-header-actions">
    <a href="/neco/nove" class="btn btn-primary">{{ icon('plus', 18) }}Nový záznam</a>
  </div>
</div>

<section class="card">
  <div class="card-header"><h2 class="card-title">Sekce</h2></div>
  <div class="card-body">
    …
  </div>
</section>
{% endblock %}
```

---

## Hlavička stránky

```html
<!-- jen nadpis -->
<div class="page-header">
  <div class="page-header-text">
    <h1 class="page-title">Nastavení</h1>
  </div>
</div>

<!-- nadpis, popis a akce vpravo -->
<div class="page-header">
  <div class="page-header-text">
    <h1 class="page-title">Zakázky</h1>
    <p class="page-description">{{ items|length }} otevřených zakázek</p>
  </div>
  <div class="page-header-actions">
    <a href="/export" class="btn btn-outline btn-sm">{{ icon('download', 16) }}Export</a>
    <a href="/zakazky/nova" class="btn btn-primary">{{ icon('plus', 18) }}Nová zakázka</a>
  </div>
</div>

<!-- odkaz zpět nad hlavičkou (detail, editace) -->
<a href="/zakazky" class="back-link">{{ icon('arrow-left', 16) }}Zakázky</a>
```

Akce v hlavičce jsou ty, které se týkají celé stránky. Akce nad jedním záznamem patří
k záznamu, ne sem.

---

## Sekce a karty

```html
<!-- karta s hlavičkou a patičkou -->
<section class="card">
  <div class="card-header">
    <div>
      <h2 class="card-title">Fakturační údaje</h2>
      <p class="card-subtitle">Zobrazí se na faktuře.</p>
    </div>
    <a href="#" class="btn btn-ghost btn-icon btn-sm" aria-label="Upravit">{{ icon('edit', 16) }}</a>
  </div>
  <div class="card-body">…</div>
  <div class="card-footer">
    <button class="btn btn-primary">Uložit</button>
    <a href="/zpet" class="btn btn-ghost">Zrušit</a>
  </div>
</section>

<!-- sekce bez karty (nadpis nad obsahem) -->
<section class="section">
  <h2 class="section-title">Poslední aktivita <span class="section-count">(12)</span></h2>
  …
</section>
```

Karty pod sebou oddělíš `.stack` / `.stack-lg` na rodiči, ne ručními `margin`:

```html
<div class="stack-lg">
  <section class="card">…</section>
  <section class="card">…</section>
</div>
```

---

## Rozvržení obsahu

```html
<!-- mřížka karet (rozcestník, dlaždice) -->
<div class="card-grid">
  <article class="card">…</article>
  <article class="card">…</article>
</div>

<!-- dva sloupce s postranním panelem (mřížka .detail-layout níže) -->
<div class="detail-layout">
  <aside class="card detail-side">…</aside>
  <div class="stack">…</div>
</div>

<!-- řádek prvků, který se sám zalomí -->
<div class="cluster">
  <button class="btn btn-outline btn-sm">Filtr</button>
  <span class="badge">Stav</span>
</div>
```

`.detail-layout` je hotová mřížka 4 : 7, která se pod 900 px složí pod sebe.
`.detail-side` drží postranní panel při scrollu na místě (na mobilu se chování vypne).

Jiný poměr sloupců si uprav v aplikační části app.css:

```css
.detail-layout--wide-side {
    grid-template-columns: minmax(320px, 1fr) minmax(0, 1fr);
}
```

---

## Master–detail

Seznam vlevo, detail vpravo, na mobilu se střídají. Detail překresluje HTMX (viz
`web-app-interactions`), bez JavaScriptu funguje jako obyčejné odkazy.

```html
<div class="split-layout {% if selected %}has-selection{% endif %}">
  <div class="card split-list">
    <div class="split-search">
      <label class="search-field">
        <span class="visually-hidden">Hledat</span>
        {{ icon('search', 18) }}
        <input class="input" type="search" name="q" value="{{ q }}" placeholder="Hledat…">
      </label>
    </div>

    <div id="item-list" class="split-items">
      {% for item in items %}
      <a class="split-item {% if selected and selected.id == item.id %}is-selected{% endif %}"
         href="/polozky/{{ item.id }}"
         hx-get="/polozky/{{ item.id }}" hx-target="#item-detail" hx-swap="outerHTML" hx-push-url="true">
        <span class="split-item-main">
          <span class="split-item-name">{{ item.name }}</span>
          <span class="split-item-meta">{{ item.category }}</span>
        </span>
        {{ icon('chevron-right', 16) }}
      </a>
      {% endfor %}
    </div>

    <form method="post" action="/polozky/nova" class="split-add">…</form>
  </div>

  <div id="item-detail" class="split-detail">
    {% if selected %}
    <div class="split-detail-head">
      <a href="/polozky" class="back-link split-back">{{ icon('arrow-left', 16) }}Zpět na seznam</a>
      <div>
        <h2 class="split-detail-title">{{ selected.name }}</h2>
        <p class="text-sm text-muted">Doplňující údaj</p>
      </div>
      <button class="btn btn-outline btn-sm">Akce</button>
    </div>
    <div class="split-detail-cols">
      <section class="card">…</section>
      <section class="card">…</section>
    </div>
    {% else %}
    <div class="card">
      {# prázdný stav „Vyberte položku“ #}
    </div>
    {% endif %}
  </div>
</div>
```

`.split-back` je vidět jen na úzkém displeji, kde se seznam skrývá.

---

## Akce na konci stránky

U delších formulářů dej tlačítka natvrdo na konec stránky:

```html
<div class="page-actions">
  <button type="submit" class="btn btn-primary btn-lg">{{ icon('check', 20) }}Uložit</button>
  <a href="/zpet" class="btn btn-ghost btn-lg">Zrušit</a>
</div>
```

`.sticky-actions` (plovoucí lišta nad obsahem) použij jen tam, kde uživatel pracuje dlouho
a potřebuje uložit kdykoli — třeba kontrola importu. Na běžném formuláři překáží.

---

## Prázdný stav

Prázdný stav vysvětlí, co se stane, a nabídne první krok:

```html
{% from "_macros.html" import empty_state %}

<div class="card">
  {% call empty_state('cart', 'Seznam je prázdný', 'Přidejte položky z plánu nebo ručně.') %}
    <a href="/plan" class="btn btn-primary">{{ icon('calendar', 18) }}Otevřít plán</a>
  {% endcall %}
</div>
```

Rozlišuj dva různé prázdné stavy:

| Situace | Text | Akce |
|---------|------|------|
| Zatím nic nevzniklo | „Sbírka je zatím prázdná“ | vytvořit první záznam |
| Filtr nic nenašel | „Nic jsme nenašli“ | zrušit filtr |

---

## Přihlašovací stránky

Bez hlavičky a zápatí (`hide_chrome`), obsah je vycentrovaný:

```html
<div class="auth-container">
  <div class="card auth-card">
    <div class="card-body">
      <div class="auth-logo">
        <span class="logo-mark">{{ icon('home', 28) }}</span>
        <div>
          <h1 class="auth-title">{{ app_name }}</h1>
          <p class="auth-subtitle">Krátký podtitul</p>
        </div>
      </div>
      <form method="post" action="/auth/login">…</form>
      <div class="divider-text">nebo</div>
      <button class="btn btn-outline btn-block btn-lg">Druhá možnost</button>
    </div>
  </div>
</div>
```

Detaily přihlášení řeší skill `web-app-auth`.

---

## Responzivita

| Šířka | Co se mění |
|-------|-----------|
| < 640 px | jeden sloupec, tlačítka v `.page-actions` na celou šířku, karty s menším odsazením |
| < 900 px | skryje se hlavní menu v hlavičce, zobrazí se spodní lišta; master–detail se střídá |
| ≥ 900 px | dvousloupcové layouty, postranní panely `position: sticky` |
| ≥ 1100 px | plná šířka `--container`; přepínač širší stránky v zápatí |

Pravidla:

- Testuj 375, 768 a 1440 px a obě varianty motivu.
- Nikdy nepiš pevné šířky v px do šablon — od toho jsou mřížky a `--container`.
- Dotykové cíle minimálně 44 px; u ikonových tlačítek `.btn-icon` (drží poměr stran).
- Vodorovné scrollování je chyba; dlouhé tabulky obal `.table-wrap`.
