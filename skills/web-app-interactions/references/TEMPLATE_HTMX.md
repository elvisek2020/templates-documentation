# HTMX vzory

HTMX se používá tam, kde by celé načtení stránky zahodilo kontext — rozepsané hledání,
vybranou položku, pozici na stránce. Server vrací **hotové HTML**, ne JSON.

## Obsah

1. [Princip](#princip)
2. [Průběžné hledání](#průběžné-hledání)
3. [Master–detail](#masterdetail)
4. [Živý náhled formuláře](#živý-náhled-formuláře)
5. [Indikátor načítání](#indikátor-načítání)
6. [Historie v prohlížeči](#historie-v-prohlížeči)
7. [Na co si dát pozor](#na-co-si-dát-pozor)

---

## Princip

Stránku rozděl na **celou šablonu** a **partial**, který se překresluje. Router vrátí
podle hlavičky `HX-Request` buď jedno, nebo druhé:

```python
@router.get("/polozky", response_class=HTMLResponse)
async def item_list(request: Request, q: str = ""):
    user = get_current_user(request)
    items = search_items(user["id"], q=q)
    # Průběžné hledání překresluje jen výsledky, ne celou stránku.
    template = "polozky/_results.html" if request.headers.get("HX-Request") else "polozky/list.html"
    return templates.TemplateResponse(template, page_ctx(request, current_tab="polozky", items=items, q=q))
```

Partial `polozky/_results.html` obsahuje **kořenový prvek s `id`**, který HTMX vymění:

```html
{# _results.html — samostatně, aby šel překreslit #}
<div id="item-results">
  {% if items %}
    <div class="card-grid">…</div>
  {% else %}
    {# prázdný stav #}
  {% endif %}
</div>
```

Celá stránka partial jen vloží:

```html
{% include "polozky/_results.html" %}
```

Tím je jistota, že obě cesty (s JS i bez) vykreslují totéž.

---

## Průběžné hledání

```html
<form method="get" action="/polozky" class="toolbar" role="search"
      hx-get="/polozky" hx-target="#item-results" hx-swap="outerHTML"
      hx-trigger="input changed delay:250ms from:find input[name='q'], search from:find input[name='q']"
      hx-push-url="true" hx-indicator="#search-indicator">
    <label class="search-field">
        <span class="visually-hidden">Hledat</span>
        {{ icon('search', 18) }}
        <input class="input" type="search" name="q" value="{{ q }}" placeholder="Hledat…" autocomplete="off">
        <span class="search-spinner htmx-indicator" id="search-indicator" aria-hidden="true"></span>
    </label>
    <noscript><button type="submit" class="btn btn-primary">Hledat</button></noscript>
</form>

{% include "polozky/_results.html" %}
```

- `delay:250ms` — bez prodlevy se posílá dotaz na každé písmeno.
- `changed` — nic se neposílá, když se hodnota nezměnila (např. šipky).
- `from:find input[name='q']` — posluchač je na formuláři, ale spouští ho jen pole.
  Díky tomu se odešlou i skryté filtry ve formuláři.
- `hx-swap="outerHTML"` vymění celý `#item-results` včetně obalu.
- `<noscript>` nechá stránku funkční bez JavaScriptu.

Kurzor zůstane v poli, protože se pole nepřekresluje — je mimo vyměněný blok.
Nikdy nedávej hledací pole dovnitř `hx-target`.

---

## Master–detail

Seznam vlevo, detail vpravo (HTML viz `web-app-ui`, TEMPLATE_LAYOUT.md):

```html
<a class="split-item" href="/polozky/{{ item.id }}"
   hx-get="/polozky/{{ item.id }}" hx-target="#item-detail" hx-swap="outerHTML" hx-push-url="true">…</a>
```

Router pro detail vrací partial jen pro HTMX, jinak celou stránku se zvýrazněnou položkou:

```python
@router.get("/polozky/{item_id}", response_class=HTMLResponse)
async def item_detail(request: Request, item_id: int, q: str = ""):
    ctx = _page_ctx(request, q, selected_id=item_id)
    if not ctx["selected"]:
        return RedirectResponse("/polozky", status_code=302)
    template = "polozky/_detail.html" if request.headers.get("HX-Request") else "polozky/list.html"
    return templates.TemplateResponse(template, ctx)
```

Díky tomu funguje odkaz po zkopírování, tlačítko zpět i obnovení stránky.
Zvýraznění vybrané položky v seznamu dělá `app.js` (seznam se nepřekresluje).

Formuláře uvnitř detailu nech normální (POST + redirect). Po uložení se načte celá
stránka s vybranou položkou — je to jednodušší než řešit překreslení a uživatel
rozdíl nepozná.

---

## Živý náhled formuláře

Když uživatel píše strukturovaný text a chce vidět, jak mu ho aplikace rozumí:

```html
<form method="post" action="/zaznam/ulozit"
      hx-post="/zaznam/nahled" hx-target="#preview" hx-swap="outerHTML"
      hx-trigger="input changed delay:400ms from:find textarea">
    …
    <div id="preview">{% include "zaznam/_preview.html" %}</div>
</form>
```

Endpoint `/zaznam/nahled` **nic neukládá**, jen vrátí partial s tím, co parser rozpoznal.
Drž ho bez vedlejších účinků, ať se dá volat při každém písmenu.

---

## Indikátor načítání

```css
.search-spinner {
    opacity: 0;
    transition: opacity 0.15s;
}

.htmx-request .search-spinner,
.search-spinner.htmx-request {
    opacity: 1;
    animation: spin 0.7s linear infinite;
}
```

HTMX přidává třídu `htmx-request` na prvek uvedený v `hx-indicator` (jinak na ten,
který požadavek spustil). Indikátor zobrazuj až po ~200 ms, u rychlé odpovědi jen bliká.

---

## Historie v prohlížeči

- `hx-push-url="true"` zapíše adresu do historie — používej u hledání i u výběru
  položky, ať jde sdílet odkaz a funguje tlačítko zpět.
- HTMX si ukládá snímek stránky; po návratu zpět vloží obsah zpátky bez dotazu na server.
- Adresa musí odpovídat tomu, co vrací server při přímém načtení. Když `hx-get`
  posílá filtry, musí je stejná routa umět zpracovat i bez HTMX.

---

## Na co si dát pozor

- **Posluchače v `app.js` dávej na `document`** (delegovaně). Kód navěšený při načtení
  stránky na konkrétní prvky po překreslení přestane fungovat.
- Partial musí mít kořenový prvek s `id`, jinak `hx-swap="outerHTML"` nemá co vyměnit.
- Nepoužívej HTMX na akce, které mění data a mají skončit přesměrováním — obyčejný
  POST + redirect je průhlednější a nerozbije historii.
- Nevracej JSON, který by šablonoval prohlížeč. Jediná výjimka jsou našeptávače
  a podobné doplňky, kde se opravdu skládá jen text.
- Otestuj chování bez JavaScriptu: formulář musí mít `action` a `method`, odkaz `href`.
