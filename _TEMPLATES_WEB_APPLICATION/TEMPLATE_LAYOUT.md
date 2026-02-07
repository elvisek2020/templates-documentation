# Šablona layoutu - Univerzální struktura stránek

Tento dokument popisuje standardizovanou strukturu layoutu a vzory stránek pro webové aplikace. Použijte tyto vzory pro zajištění konzistentního vzhledu a chování napříč všemi aplikacemi.

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

V `base.html` je hlavní obsah obalen kontejnerem s minimální výškou:

```html
<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
    <div class="content-area min-h-[55vh]">
        {% block content %}{% endblock %}
    </div>
</main>
```

Stránky tedy vkládají obsah do bloku `content`; šířka a padding jsou dány `main`.

### Minimální template

```html
{% extends "base.html" %}
{% block title %}{{ page_title or 'Název stránky' }}{% endblock %}

{% block content %}
<div class="max-w-7xl mx-auto">
  <!-- Hlavička stránky -->
  <div class="mb-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ page_title }}</h1>
        {% if page_description %}
        <p class="text-gray-600 mt-2">{{ page_description }}</p>
        {% endif %}
      </div>
      <div class="flex space-x-3">
        <!-- Navigační tlačítka -->
      </div>
    </div>
  </div>

  <!-- Hlavní obsah -->
  <section class="page-content-box bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[45vh]">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Nadpis sekce</h2>
    <!-- Obsah sekce -->
  </section>
</div>
{% endblock %}
```

**Poznámka:** `page_description` je volitelný – některé stránky (např. Nastavení, Přehled) mají jen nadpis `h1` bez druhého řádku.

### Maximální šířka kontejneru

**Vždy používejte:** `max-w-7xl mx-auto` pro vnitřní obsah stránky uvnitř `{% block content %}`.

```html
<div class="max-w-7xl mx-auto">
  <!-- Všechen obsah stránky -->
</div>
```

---

## Hlavička stránky

### Základní hlavička

```html
<div class="mb-8">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">{{ page_title }}</h1>
      {% if page_description %}
      <p class="text-gray-600 mt-2">{{ page_description }}</p>
      {% endif %}
    </div>
  </div>
</div>
```

### Hlavička pouze s nadpisem (bez popisu)

Na stránkách jako Přehled nebo Nastavení stačí jeden řádek:

```html
<div class="mb-8">
  <h1 class="text-3xl font-bold text-gray-900">{{ page_title }}</h1>
</div>
```

### Hlavička s navigačními tlačítky

```html
<div class="mb-8">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">{{ page_title }}</h1>
      <p class="text-gray-600 mt-2">{{ page_description }}</p>
    </div>
    <div class="flex space-x-3">
      <a href="/path/to/action" 
         class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Nová akce
      </a>
      <a href="/path/to/history" 
         class="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Historie
      </a>
    </div>
  </div>
</div>
```

### Hlavička s tlačítkem zpět

```html
<div class="mb-8">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">{{ page_title }}</h1>
      <p class="text-gray-600 mt-2">{{ page_description }}</p>
    </div>
    <a href="/path/to/back" 
       class="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Zpět
    </a>
  </div>
</div>
```

---

## Sekce a boxy

### Standardní box

**Základní struktura pro všechny sekce:**

```html
<section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
  <h2 class="text-lg font-semibold text-gray-900 mb-4">Nadpis sekce</h2>
  <!-- Obsah sekce -->
</section>
```

### Box s hlavičkou

```html
<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
  <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
    <h2 class="text-lg font-semibold text-gray-900">Nadpis</h2>
    <p class="text-sm text-gray-600 mt-1">Popis sekce</p>
  </div>
  <div class="p-6">
    <!-- Obsah -->
  </div>
</div>
```

### Box bez nadpisu

```html
<section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
  <!-- Obsah bez nadpisu -->
</section>
```

### Stránka Nastavení – mřížka vstupních karet

Stránka typu „Nastavení“ (výběr podmodulů) používá **mřížku 2 sloupce** a karty s pevnou velikostí **620×120 px**. Každá karta je odkaz s názvem a šipkou vpravo. Třída kontejneru: `page-content-box`.

```html
<div class="page-content-box grid grid-cols-2 gap-4 min-h-[45vh]">
  <a href="/settings/podmodul-1" class="flex items-center px-6 py-4 w-[620px] h-[120px] bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors text-left">
    <span class="text-2xl font-medium text-gray-900">Podmodul 1</span>
    <svg class="w-6 h-6 ml-auto text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
  </a>
  <a href="/settings/podmodul-2" class="flex items-center px-6 py-4 w-[620px] h-[120px] bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors text-left">
    <span class="text-2xl font-medium text-gray-900">Podmodul 2</span>
    <svg class="w-6 h-6 ml-auto text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
  </a>
</div>
```

- Kontejner: `page-content-box grid grid-cols-2 gap-4 min-h-[45vh]`.
- Karta: `flex items-center`, `w-[620px] h-[120px]`, `rounded-xl`, text `text-2xl font-medium`, šipka vpravo (`ml-auto shrink-0`).

### Více boxů vedle sebe

```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Sekce 1</h2>
    <!-- Obsah -->
  </section>
  <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Sekce 2</h2>
    <!-- Obsah -->
  </section>
</div>
```

---

## Layout vzory

### Jednoduchá stránka s jednou sekcí

```html
{% extends "base.html" %}
{% block title %}{{ page_title }}{% endblock %}

{% block content %}
<div class="max-w-7xl mx-auto">
  <!-- Hlavička -->
  <div class="mb-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ page_title }}</h1>
        <p class="text-gray-600 mt-2">{{ page_description }}</p>
      </div>
    </div>
  </div>

  <!-- Hlavní sekce -->
  <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <!-- Obsah -->
  </section>
</div>
{% endblock %}
```

### Stránka s více sekcemi

```html
{% extends "base.html" %}
{% block title %}{{ page_title }}{% endblock %}

{% block content %}
<div class="max-w-7xl mx-auto">
  <!-- Hlavička -->
  <div class="mb-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ page_title }}</h1>
        <p class="text-gray-600 mt-2">{{ page_description }}</p>
      </div>
    </div>
  </div>

  <!-- Sekce 1 -->
  <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Sekce 1</h2>
    <!-- Obsah -->
  </section>

  <!-- Sekce 2 -->
  <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Sekce 2</h2>
    <!-- Obsah -->
  </section>
</div>
{% endblock %}
```

### Dvousloupcový layout

```html
{% extends "base.html" %}
{% block title %}{{ page_title }}{% endblock %}

{% block content %}
<div class="max-w-7xl mx-auto">
  <!-- Hlavička -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">{{ page_title }}</h1>
    <p class="text-gray-600 mt-2">{{ page_description }}</p>
  </div>

  <!-- Dvousloupcový obsah -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Levý sloupec -->
    <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Levý sloupec</h2>
      <!-- Obsah -->
    </section>

    <!-- Pravý sloupec -->
    <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Pravý sloupec</h2>
      <!-- Obsah -->
    </section>
  </div>
</div>
{% endblock %}
```

### Stránka s formulářem

```html
{% extends "base.html" %}
{% block title %}{{ page_title }}{% endblock %}

{% block content %}
<div class="max-w-7xl mx-auto">
  <!-- Hlavička -->
  <div class="mb-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ page_title }}</h1>
        <p class="text-gray-600 mt-2">{{ page_description }}</p>
      </div>
      <a href="/path/to/back" 
         class="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Zpět
      </a>
    </div>
  </div>

  <!-- Formulář -->
  <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <form method="post" action="/path/to/submit" class="space-y-6">
      <!-- Formulářová pole -->
      
      <div class="flex justify-end space-x-3">
        <a href="/path/to/back" 
           class="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">
          Zrušit
        </a>
        <button type="submit" 
                class="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Uložit
        </button>
      </div>
    </form>
  </section>
</div>
{% endblock %}
```

---

## Navigace

### Tabs jako tlačítka (v obsahu stránky)

Pro záložky uvnitř stránky (ne hlavní menu):

```html
<div class="flex space-x-2 mb-6">
  <a href="/path/to/tab1" 
     class="px-4 py-2 {% if current_tab == 'tab1' %}bg-blue-600 text-white{% else %}bg-gray-100 text-gray-700 hover:bg-gray-200{% endif %} font-medium rounded-lg transition-colors">
    Tab 1
  </a>
  <!-- ... -->
</div>
```

**Hlavní navigace v hlavičce** má pevnou velikost tlačítek 150×40 px a je popsána v [TEMPLATE_MENU.md](./TEMPLATE_MENU.md).

### Navigační tlačítka v hlavičce

```html
<div class="flex space-x-3">
  <a href="/path/to/new" 
     class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
    </svg>
    Nová položka
  </a>
  <a href="/path/to/history" 
     class="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">
    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    Historie
  </a>
</div>
```

---

## Prázdný stav

### Standardní prázdný stav

```html
<div class="text-center py-12">
  <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    </svg>
  </div>
  <h3 class="text-lg font-medium text-gray-900 mb-2">Žádné položky</h3>
  <p class="text-gray-600 mb-6">Zatím zde nejsou žádné položky k zobrazení.</p>
  <a href="/path/to/new" 
     class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
    Přidat první položku
  </a>
</div>
```

### Prázdný stav v boxu

```html
<section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  {% if items %}
    <!-- Obsah s položkami -->
  {% else %}
    <div class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M..."></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Žádné položky</h3>
      <p class="text-gray-600 mb-6">Zatím zde nejsou žádné položky k zobrazení.</p>
      <a href="/path/to/new" 
         class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
        Přidat první položku
      </a>
    </div>
  {% endif %}
</section>
```

---

## Best practices

### 1. Maximální šířka

**Vždy používejte:** `max-w-7xl mx-auto` pro hlavní obsah

```html
<div class="max-w-7xl mx-auto">
  <!-- Všechen obsah -->
</div>
```

### 2. Spacing mezi sekcemi

**Standardní spacing:** `mb-6` mezi sekcemi

```html
<section class="... mb-6">Sekce 1</section>
<section class="... mb-6">Sekce 2</section>
<section class="...">Sekce 3</section>
```

### 3. Hlavička stránky

**Vždy obsahuje:**
- Nadpis: `text-3xl font-bold text-gray-900`
- Popis: `text-gray-600 mt-2`
- Volitelně navigační tlačítka vpravo

### 4. Sekce

**Standardní struktura:**
- Bílý box: `bg-white rounded-xl shadow-sm border border-gray-200`
- Padding: `p-6`
- Margin bottom: `mb-6`
- Nadpis sekce: `text-lg font-semibold text-gray-900 mb-4`

### 5. Transitions

**Vždy přidávejte:** `transition-colors` k interaktivním prvkům

```html
<button class="... transition-colors hover:bg-blue-700">
<a href="..." class="... transition-colors hover:bg-gray-200">
```

### 6. Responsivní design

**Používejte grid s breakpointy:**
- `grid-cols-1` - mobil
- `md:grid-cols-2` - tablet
- `lg:grid-cols-3` - desktop

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Položky -->
</div>
```

### 7. Konzistentní názvy

- **Titulky stránek:** Používejte pouze název na hlavní stránce
- **Podstránky:** Formát "Hlavní název - Podnázev" v `_title`
- **Sekce:** Používejte `text-lg font-semibold` pro nadpisy sekcí

### 8. Prázdný stav

**Vždy zobrazujte prázdný stav:**
- Když není žádný obsah
- S ikonou, nadpisem, popisem a akčním tlačítkem
- Uvnitř sekce nebo jako samostatná sekce

---

## Shrnutí

Tato šablona layoutu poskytuje:

✅ **Konzistentní strukturu** všech stránek  
✅ **Standardizované sekce** a boxy  
✅ **Univerzální vzory** pro různé typy stránek  
✅ **Best practices** pro kvalitní layout  

Při vytváření nových stránek vždy dodržujte tyto konvence pro zajištění jednotného vzhledu napříč celým systémem.

