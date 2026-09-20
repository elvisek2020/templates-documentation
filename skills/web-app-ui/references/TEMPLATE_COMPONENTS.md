# Komponenty

Katalog komponent z `app.css`. Všechny fungují ve světlém i tmavém režimu a v obou paletách.
Vizuální podobu si ověř v [preview.html](preview.html).

## Obsah

1. [Ikony](#ikony)
2. [Tlačítka](#tlačítka)
3. [Rozbalovací menu](#rozbalovací-menu)
4. [Formuláře](#formuláře)
5. [Speciální vstupy](#speciální-vstupy)
6. [Zprávy a stavy](#zprávy-a-stavy)
7. [Badge, chip, štítek](#badge-chip-štítek)
8. [Tabulky a seznamy](#tabulky-a-seznamy)
9. [Záložky uvnitř stránky](#záložky-uvnitř-stránky)
10. [Modal a toast](#modal-a-toast)
11. [Průběh](#průběh)

---

## Ikony

Ikony jsou inline SVG přes Jinja makro v `app/templates/_icons.html` — žádná externí
knihovna, žádné načítání písma.

```html
{% from "_icons.html" import icon %}

{{ icon('plus') }}              {# výchozí 20 px #}
{{ icon('trash', 16) }}         {# jiná velikost #}
{{ icon('check', 18, 'mr-2') }} {# doplňková třída #}
```

Makro (zkráceně):

```html
{%- macro icon(name, size=20, cls='') -%}
<svg class="icon {{ cls }}" width="{{ size }}" height="{{ size }}" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
     stroke-linejoin="round" aria-hidden="true" focusable="false">
{%- if name == 'plus' -%}<path d="M12 5v14M5 12h14"/>
{%- elif name == 'check' -%}<path d="M20 6 9 17l-5-5"/>
{%- endif -%}
</svg>
{%- endmacro -%}
```

Pravidla: ikona je vždy `aria-hidden`, význam nese text tlačítka nebo `aria-label`.
Ikona dědí barvu (`currentColor`) — nikdy jí barvu nenastavuj napevno.

---

## Tlačítka

```html
<button class="btn btn-primary">Hlavní akce</button>
<button class="btn btn-secondary">Zvýrazněná vedlejší</button>
<button class="btn btn-outline">Vedlejší akce</button>
<button class="btn btn-ghost">Nenápadná akce</button>
<button class="btn btn-danger">Smazat</button>
<button class="btn btn-danger-ghost">Smazat (v menu)</button>

<button class="btn btn-primary btn-lg">Velké (hlavní CTA)</button>
<button class="btn btn-outline btn-sm">Malé (v řádku, v kartě)</button>
<button class="btn btn-primary btn-block">Na celou šířku</button>

<button class="btn btn-ghost btn-icon" aria-label="Smazat">{{ icon('trash') }}</button>
<a href="/detail" class="btn btn-outline">{{ icon('arrow-right', 18) }}Odkaz jako tlačítko</a>
```

| Varianta | Kdy |
|----------|-----|
| `btn-primary` | právě jedna hlavní akce na stránce nebo v kartě |
| `btn-outline` | vedlejší akce vedle hlavní |
| `btn-ghost` | akce, která nemá poutat (zrušit, ikonová tlačítka) |
| `btn-secondary` | akce v rámci obsahu, která má být vidět, ale není hlavní |
| `btn-danger` | destruktivní potvrzení |

Pravidla:

- Text tlačítka je sloveso s předmětem: „Uložit zakázku“, ne „OK“.
- Ikonové tlačítko vždy s `aria-label` a `title`.
- Destruktivní akce potvrzuj modalem (`data-confirm`, skill `web-app-interactions`).
- Nikdy nepiš `style="background: …"` — od toho jsou varianty.

---

## Rozbalovací menu

Bez JavaScriptu, přes `<details>`:

```html
<details class="dropdown">
  <summary class="btn btn-ghost btn-icon" aria-label="Další akce">{{ icon('more') }}</summary>
  <div class="dropdown-menu">
    <a class="menu-item" href="/upravit">{{ icon('edit', 18) }}Upravit</a>
    <form method="post" action="/duplikovat">
      <button class="menu-item" type="submit">{{ icon('copy', 18) }}Duplikovat</button>
    </form>
    <div class="menu-divider"></div>
    <form method="post" action="/smazat" data-confirm="Záznam bude trvale smazán."
          data-confirm-title="Smazat?" data-confirm-ok="Smazat" data-confirm-danger>
      <button class="menu-item menu-item--danger" type="submit">{{ icon('trash', 18) }}Smazat</button>
    </form>
  </div>
</details>
```

Zavření při kliknutí mimo a klávesou Escape obstarává `app.js`.

---

## Formuláře

```html
<div class="form-group">
  <label class="form-label" for="name">Název</label>
  <input class="input" id="name" name="name" required maxlength="255" placeholder="např. Objednávka 2026/01">
  <p class="form-hint">Nápověda, co se do pole píše.</p>
</div>

<div class="form-group">
  <label class="form-label" for="note">Poznámka <span class="optional">(volitelné)</span></label>
  <textarea class="input" id="note" name="note" rows="4"></textarea>
</div>

<div class="form-group">
  <label class="form-label" for="state">Stav</label>
  <select class="input" id="state" name="state">
    <option value="new">Nová</option>
  </select>
</div>

<!-- dva sloupce, na mobilu pod sebou -->
<div class="form-grid">
  <div class="form-group">…</div>
  <div class="form-group">…</div>
  <div class="form-group span-2">…</div>
</div>

<!-- zaškrtávací pole a přepínače -->
<label class="check-row">
  <input type="checkbox" name="active" value="1" checked>
  <span>Aktivní záznam</span>
</label>

<!-- pole s tlačítkem vedle -->
<form method="post" action="/pridat" class="input-group">
  <input class="input" name="value" placeholder="Nová hodnota" required>
  <button class="btn btn-outline" type="submit">{{ icon('plus', 18) }}Přidat</button>
</form>

<!-- akce formuláře -->
<div class="form-actions">
  <button type="submit" class="btn btn-primary">Uložit</button>
  <a href="/zpet" class="btn btn-ghost">Zrušit</a>
</div>
```

Pravidla:

- Každé pole má `<label class="form-label">` s `for`; skrytý popisek jen `.visually-hidden`,
  nikdy úplně bez popisku.
- Nepovinná pole označ `<span class="optional">(volitelné)</span>`, ne hvězdičkami u povinných.
- Validaci nech na prohlížeči (`required`, `type`, `min`, `maxlength`) a doplň ji serverem.
- Placeholder je příklad, ne náhrada popisku.

---

## Speciální vstupy

**Vyhledávací pole** (ikona uvnitř):

```html
<label class="search-field">
  <span class="visually-hidden">Hledat</span>
  {{ icon('search', 18) }}
  <input class="input" type="search" name="q" value="{{ q }}" placeholder="Hledat…" autocomplete="off">
</label>
```

**Volba jako karta** — když má volba popis nebo je jich málo a mají být vidět:

```html
<div class="choice-list">
  <label class="choice-card">
    <input type="checkbox" name="parts" value="1" checked>
    <span class="choice-card-text">
      <span class="choice-card-title">Základní část</span>
      <span class="choice-card-meta">Doplňující vysvětlení</span>
    </span>
  </label>
</div>
```

**Číselník s tlačítky** (lepší než `type=number` na mobilu):

```html
<div class="stepper" data-stepper>
  <button type="button" data-step="-1" aria-label="Snížit">{{ icon('minus', 18) }}</button>
  <input type="number" name="qty" value="1" min="1" step="1" inputmode="numeric" aria-label="Počet">
  <span class="stepper-suffix">ks</span>
  <button type="button" data-step="1" aria-label="Zvýšit">{{ icon('plus', 18) }}</button>
</div>

<!-- rychlé předvolby k číselníku -->
<div class="chips" data-preset-group="qty">
  <button type="button" class="chip" data-set-value="1" data-target="qty">1×</button>
  <button type="button" class="chip" data-set-value="5" data-target="qty">5×</button>
</div>
```

Menší varianta: `.stepper.stepper--sm`. Obsluhu `data-stepper` dělá `app.js`.

**Nahrání souboru** (dropzóna):

```html
<label class="file-drop" data-file-list="soubory">
  <input type="file" name="files" accept=".md,.csv" multiple required>
  <span class="file-drop-icon">{{ icon('upload', 26) }}</span>
  <span class="file-drop-title">Přetáhněte soubory sem, nebo klikněte</span>
  <span class="file-drop-hint">CSV nebo Markdown · max. 2 MB</span>
</label>
<ul class="file-list" id="soubory" aria-live="polite"></ul>
```

---

## Zprávy a stavy

Makro `alert` v `app/templates/_macros.html`:

```html
{% from "_macros.html" import alert %}

{{ alert('success', 'Záznam byl uložen.') }}
{{ alert('error', 'Uložení se nezdařilo.') }}
{{ alert('warn', 'Zkontrolujte údaje.') }}
{{ alert('info', 'Změny se projeví po obnovení.') }}

{# s obsahem a akcí #}
{% call alert('warn') %}
  <strong>Záznam byl mezitím změněn.</strong> Vyberte, kterou verzi ponechat.
  <div class="alert-actions">
    <button class="btn btn-sm btn-outline">Ponechat cizí</button>
    <button class="btn btn-sm btn-primary">Uložit moji</button>
  </div>
{% endcall %}
```

Prázdný stav:

```html
{% from "_macros.html" import empty_state %}
{% call empty_state('search', 'Nic jsme nenašli', 'Zkuste jiné slovo.') %}
  <a href="/seznam" class="btn btn-outline">Zrušit filtr</a>
{% endcall %}
```

Rozdíl: `alert` je reakce na akci, `empty_state` je stav obrazovky. Krátkou zpětnou vazbu
(uloženo, zkopírováno) řeš toastem, ne alertem přes půl stránky.

---

## Badge, chip, štítek

```html
<span class="badge">Neutrální</span>
<span class="badge badge--accent">Zvýrazněný</span>
<span class="badge badge--success">{{ icon('check', 12) }}Hotovo</span>
<span class="badge badge--warn">Ke kontrole</span>
<span class="badge badge--error">Chyba</span>

<!-- filtr: odkaz nebo tlačítko -->
<div class="chips">
  <a href="/seznam" class="chip chip--active">Vše</a>
  <a href="/seznam?filtr=moje" class="chip">{{ icon('heart', 16) }}Moje</a>
</div>

<!-- štítek s možností odebrat -->
<span class="tag">štítek
  <form method="post" action="/stitek/1/smazat">
    <button type="submit" class="tag-remove" aria-label="Odebrat štítek">{{ icon('x', 14) }}</button>
  </form>
</span>
```

`badge` je stav (needituje se), `chip` je volba (klikací), `tag` je štítek u záznamu.

---

## Tabulky a seznamy

Tabulka pro data s více sloupci:

```html
<div class="table-wrap">
  <table class="table">
    <thead><tr><th>Název</th><th>Stav</th><th>Datum</th></tr></thead>
    <tbody>
      <tr>
        <td>Záznam</td>
        <td><span class="badge badge--success">Aktivní</span></td>
        <td>20. 9. 2026</td>
      </tr>
    </tbody>
  </table>
</div>
```

Seznam řádků — lepší než tabulka tam, kde má řádek akci nebo se čte na mobilu:

```html
<div class="card">
  <ul class="list-rows">
    <li><a class="list-row" href="/detail/1">
      <span class="link-icon">{{ icon('file', 20) }}</span>
      <span class="list-row-main">
        <span class="list-row-title">Název záznamu</span>
        <span class="list-row-meta">Doplňující informace</span>
      </span>
      {{ icon('chevron-right', 18) }}
    </a></li>
    <li class="list-row">
      <span class="list-row-main">
        <span class="list-row-title">Řádek s akcí</span>
      </span>
      <form method="post" action="/smazat/2">
        <button class="btn btn-ghost btn-icon btn-sm" aria-label="Smazat">{{ icon('trash', 18) }}</button>
      </form>
    </li>
  </ul>
</div>
```

Na mobilu tabulky nad tři sloupce nefungují — použij seznam řádků nebo karty.

---

## Záložky uvnitř stránky

```html
<nav class="tabs" aria-label="Sekce záznamu">
  <a href="?tab=prehled" class="tabs-item tabs-item--active">Přehled</a>
  <a href="?tab=historie" class="tabs-item">Historie</a>
</nav>
```

Hlavní navigaci aplikace tímhle neřeš — na to je `.nav` a spodní lišta (TEMPLATE_MENU.md).

---

## Modal a toast

Obě komponenty jsou v `base.html` jednou a obsluhuje je `app.js`:

```html
<!-- potvrzení destruktivní akce: stačí atributy na formuláři -->
<form method="post" action="/smazat"
      data-confirm="Záznam bude trvale smazán i s přílohami."
      data-confirm-title="Smazat záznam?"
      data-confirm-ok="Smazat"
      data-confirm-danger>
  <button class="btn btn-danger" type="submit">Smazat</button>
</form>
```

```javascript
// krátká zpětná vazba
showNotification('Záznam byl uložen.', 'success');   // success | error | info
```

Vlastní modal (mimo potvrzování) skládej ze stejných tříd:

```html
<div class="modal-overlay">
  <div class="modal">
    <div class="modal-header"><div class="modal-title">Nadpis</div></div>
    <div class="modal-body">Obsah</div>
    <div class="modal-footer">
      <button class="btn btn-outline">Zrušit</button>
      <button class="btn btn-primary">Potvrdit</button>
    </div>
  </div>
</div>
```

Nikdy `alert()`, `confirm()` ani `prompt()` — vypadají cize a nejdou stylovat.

---

## Průběh

```html
<div class="cluster">
  <div class="progress" style="flex:1">
    <div class="progress-bar" style="width: {{ done * 100 // total }}%"></div>
  </div>
  <span class="text-sm text-muted">{{ done }} / {{ total }}</span>
</div>
```

Šířku pruhu počítej v šabloně ze skutečných dat; je to jediný případ, kdy je inline styl
v pořádku (hodnota je proměnná, ne vzhled).
