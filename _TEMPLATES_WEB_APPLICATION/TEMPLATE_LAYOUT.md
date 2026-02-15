# Šablona layoutu - Univerzální struktura stránek

Tento dokument popisuje standardizovanou strukturu layoutu a vzory stránek pro webové aplikace. Použijte tyto vzory pro zajištění konzistentního vzhledu a chování napříč všemi aplikacemi.

**Styling:** Aplikace používá **lokální CSS** – soubor `app/static/css/app.css`. Nepoužívá se Tailwind ani jiný utility framework. V příkladech používejte třídy z app.css: `.container`, `.card`, `.card-header`, `.card-body`, `.page-header`, `.page-title`, `.btn`, `.btn-primary`, `.btn-outline` atd.

## 📋 Obsah

1. [Základní struktura stránky](#základní-struktura-stránky)
2. [Hlavička stránky](#hlavička-stránky)
3. [Sekce a boxy](#sekce-a-boxy)
4. [Layout vzory](#layout-vzory)
5. [Navigace](#navigace)
6. [Prázdný stav](#prázdný-stav)
7. [Best practices](#best-practices)

---

## Základní struktura stránky

### Kontejner obsahu v base.html

V `base.html` je hlavní obsah obalen kontejnerem (třída `.container` z app.css):

```html
<main class="container">
    {% block content %}{% endblock %}
</main>
```

Stránky tedy vkládají obsah do bloku `content`; šířka a padding jsou dány `main` / `.container`.

### Minimální template

```html
{% extends "base.html" %}
{% block title %}{{ page_title or 'Název stránky' }}{% endblock %}

{% block content %}
<div class="page-header">
  <div>
    <h1 class="page-title">{{ page_title }}</h1>
    {% if page_description %}
    <p class="page-subtitle">{{ page_description }}</p>
    {% endif %}
  </div>
  <div style="display: flex; gap: 0.75rem;">
    <!-- Navigační tlačítka: .btn .btn-primary atd. -->
  </div>
</div>

<div class="card">
  <div class="card-header">
    <h2 class="card-title">Nadpis sekce</h2>
  </div>
  <div class="card-body">
    <!-- Obsah sekce -->
  </div>
</div>
{% endblock %}
```

**Poznámka:** `page_description` je volitelný – některé stránky mají jen nadpis. Třídy `.page-header`, `.page-title`, `.page-subtitle`, `.card`, `.card-header`, `.card-body` jsou definované v app.css.

### Kontejner obsahu

Hlavní obsah stránky je uvnitř `<main class="container">` v base.html. V bloku `content` používejte sekce s třídou `.card` pro boxy; šířku řeší kontejner v base.html.

---

## Hlavička stránky

### Základní hlavička

```html
<div class="page-header">
  <div>
    <h1 class="page-title">{{ page_title }}</h1>
    {% if page_description %}
    <p class="page-subtitle">{{ page_description }}</p>
    {% endif %}
  </div>
</div>
```

### Hlavička pouze s nadpisem (bez popisu)

Na stránkách jako Přehled nebo Nastavení stačí jeden řádek:

```html
<div class="page-header">
  <h1 class="page-title">{{ page_title }}</h1>
</div>
```

### Hlavička s navigačními tlačítky

```html
<div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
  <div>
    <h1 class="page-title">{{ page_title }}</h1>
    <p class="page-subtitle">{{ page_description }}</p>
  </div>
  <div style="display: flex; gap: 0.75rem;">
    <a href="/path/to/action" class="btn btn-primary">Nová akce</a>
    <a href="/path/to/history" class="btn btn-secondary">Historie</a>
  </div>
  </div>
</div>
```

### Hlavička s tlačítkem zpět

```html
<div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
  <div>
    <h1 class="page-title">{{ page_title }}</h1>
    <p class="page-subtitle">{{ page_description }}</p>
  </div>
  <a href="/path/to/back" class="btn btn-outline btn-sm">← Zpět</a>
</div>
```

---

## Sekce a boxy

### Standardní box

**Základní struktura pro všechny sekce** – použijte třídu `.card` z app.css:

```html
<div class="card">
  <h2 class="card-title">Nadpis sekce</h2>
  <div class="card-body">
    <!-- Obsah sekce -->
  </div>
</div>
```

### Box s hlavičkou

```html
<div class="card">
  <div class="card-header">
    <h2 class="card-title">Nadpis</h2>
    <p class="page-subtitle" style="margin-top: 0.25rem;">Popis sekce</p>
  </div>
  <div class="card-body">
    <!-- Obsah -->
  </div>
</div>
```

### Box bez nadpisu

```html
<div class="card">
  <div class="card-body">
    <!-- Obsah bez nadpisu -->
  </div>
</div>
```

### Stránka Nastavení – mřížka vstupních karet

Stránka typu „Nastavení“ (výběr podmodulů) používá **mřížku 2 sloupce** a karty s pevnou velikostí **620×120 px**. Každá karta je odkaz s názvem a šipkou vpravo. V app.css definujte např. `.settings-grid` a `.settings-card`.

```html
<div class="settings-grid page-content-box">
  <a href="/settings/podmodul-1" class="settings-card">
    <span class="settings-card-title">Podmodul 1</span>
    <span class="settings-card-arrow">→</span>
  </a>
  <a href="/settings/podmodul-2" class="settings-card">
    <span class="settings-card-title">Podmodul 2</span>
    <span class="settings-card-arrow">→</span>
  </a>
</div>
```

- Kontejner: `.settings-grid` (grid 2 sloupce, gap), `.page-content-box` pro minimální výšku.
- Karta: `.settings-card` (620×120 px, flex, hover), `.settings-card-title`, `.settings-card-arrow`.

### Více boxů vedle sebe

```html
<div class="card-grid">
  <div class="card">
    <h2 class="card-title">Sekce 1</h2>
    <div class="card-body"><!-- Obsah --></div>
  </div>
  <div class="card">
    <h2 class="card-title">Sekce 2</h2>
    <div class="card-body"><!-- Obsah --></div>
  </div>
</div>
```

V app.css: `.card-grid` (např. `display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;` a na mobilu jeden sloupec).

---

## Layout vzory

### Jednoduchá stránka s jednou sekcí

```html
{% extends "base.html" %}
{% block title %}{{ page_title }}{% endblock %}

{% block content %}
<div class="page-header">
  <h1 class="page-title">{{ page_title }}</h1>
  {% if page_description %}<p class="page-subtitle">{{ page_description }}</p>{% endif %}
</div>

<div class="card">
  <div class="card-body">
    <!-- Obsah -->
  </div>
</div>
{% endblock %}
```

### Stránka s více sekcemi

```html
{% extends "base.html" %}
{% block title %}{{ page_title }}{% endblock %}

{% block content %}
<div class="page-header">
  <h1 class="page-title">{{ page_title }}</h1>
  {% if page_description %}<p class="page-subtitle">{{ page_description }}</p>{% endif %}
</div>

<div class="card">
  <h2 class="card-title">Sekce 1</h2>
  <div class="card-body"><!-- Obsah --></div>
</div>

<div class="card">
  <h2 class="card-title">Sekce 2</h2>
  <div class="card-body"><!-- Obsah --></div>
</div>
{% endblock %}
```

### Dvousloupcový layout

```html
{% extends "base.html" %}
{% block title %}{{ page_title }}{% endblock %}

{% block content %}
<div class="page-header">
  <h1 class="page-title">{{ page_title }}</h1>
  {% if page_description %}<p class="page-subtitle">{{ page_description }}</p>{% endif %}
</div>

<div class="card-grid">
  <div class="card">
    <h2 class="card-title">Levý sloupec</h2>
    <div class="card-body"><!-- Obsah --></div>
  </div>
  <div class="card">
    <h2 class="card-title">Pravý sloupec</h2>
    <div class="card-body"><!-- Obsah --></div>
  </div>
</div>
{% endblock %}
```

### Stránka s formulářem

```html
{% extends "base.html" %}
{% block title %}{{ page_title }}{% endblock %}

{% block content %}
<div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
  <div>
    <h1 class="page-title">{{ page_title }}</h1>
    {% if page_description %}<p class="page-subtitle">{{ page_description }}</p>{% endif %}
  </div>
  <a href="/path/to/back" class="btn btn-outline btn-sm">← Zpět</a>
</div>

<div class="card">
  <div class="card-body">
    <form method="post" action="/path/to/submit">
      <!-- form-group pole dle TEMPLATE_COMPONENTS -->
      <div class="form-actions">
        <a href="/path/to/back" class="btn btn-outline">Zrušit</a>
        <button type="submit" class="btn btn-primary">Uložit</button>
      </div>
    </form>
  </div>
</div>
{% endblock %}
```

---

## Navigace

### Tabs jako tlačítka (v obsahu stránky)

Pro záložky uvnitř stránky (ne hlavní menu). V app.css definujte např. `.tabs` (flex, gap) a `.tabs-item`, `.tabs-item--active` (vzhled tlačítka / aktivní stav):

```html
<div class="tabs">
  <a href="/path/to/tab1" class="tabs-item {% if current_tab == 'tab1' %}tabs-item--active{% endif %}">Tab 1</a>
  <a href="/path/to/tab2" class="tabs-item {% if current_tab == 'tab2' %}tabs-item--active{% endif %}">Tab 2</a>
</div>
```

**Hlavní navigace v hlavičce** má pevnou velikost tlačítek 150×40 px a je popsána v [TEMPLATE_MENU.md](./TEMPLATE_MENU.md).

### Navigační tlačítka v hlavičce

```html
<div style="display: flex; gap: 0.75rem;">
  <a href="/path/to/new" class="btn btn-primary">Nová položka</a>
  <a href="/path/to/history" class="btn btn-secondary">Historie</a>
</div>
```

(Případně definujte v app.css třídu např. `.page-header-actions` pro flex a gap.)

---

## Prázdný stav

V app.css lze definovat třídu `.empty-state` (středovaný blok, ikona, nadpis, text, tlačítko).

### Standardní prázdný stav

```html
<div class="empty-state">
  <div class="empty-state-icon"><!-- ikona nebo obrázek --></div>
  <h3 class="empty-state-title">Žádné položky</h3>
  <p class="empty-state-text">Zatím zde nejsou žádné položky k zobrazení.</p>
  <a href="/path/to/new" class="btn btn-primary">Přidat první položku</a>
</div>
```

### Prázdný stav v boxu

```html
<div class="card">
  <div class="card-body">
    {% if items %}
      <!-- Obsah s položkami -->
    {% else %}
      <div class="empty-state">
        <div class="empty-state-icon"><!-- ikona --></div>
        <h3 class="empty-state-title">Žádné položky</h3>
        <p class="empty-state-text">Zatím zde nejsou žádné položky k zobrazení.</p>
        <a href="/path/to/new" class="btn btn-primary">Přidat první položku</a>
      </div>
    {% endif %}
  </div>
</div>
```

---

## Best practices

1. **Kontejner** – Hlavní obsah je v `<main class="container">` v base.html; v bloku `content` nepřepisujte šířku, kontejner ji určuje.
2. **Hlavička** – Používejte `.page-header`, `.page-title`, `.page-subtitle`; volitelně navigační tlačítka `.btn` vpravo.
3. **Sekce** – Jedna sekce = jeden `.card` s `.card-title` a `.card-body`; více boxů vedle sebe = `.card-grid` + `.card`.
4. **Formuláře** – Třídy `.form-group`, `.form-label`, `.input`, `.form-actions`, `.btn` (viz TEMPLATE_COMPONENTS).
5. **Prázdný stav** – Třída `.empty-state` (v app.css) s ikonou, nadpisem, textem a tlačítkem `.btn btn-primary`.
6. **Transitions** – Interaktivní prvky (tlačítka, odkazy) mají přechody definované v app.css u `.btn` a příbuzných tříd.
7. **Responzivita** – Mřížky (`.card-grid`, `.settings-grid`) definujte v app.css s media queries dle potřeby.
8. **Konzistentní názvy** – Titulky stránek a sekcí předávejte z backendu; pro nadpisy sekcí používejte `.card-title`.

---

## Shrnutí

Tato šablona layoutu poskytuje:

✅ **Konzistentní strukturu** všech stránek  
✅ **Standardizované sekce** a boxy  
✅ **Univerzální vzory** pro různé typy stránek  
✅ **Best practices** pro kvalitní layout  

Při vytváření nových stránek vždy dodržujte tyto konvence pro zajištění jednotného vzhledu napříč celým systémem.

