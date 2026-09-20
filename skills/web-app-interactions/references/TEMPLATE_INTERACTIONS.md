# Chování stránky — vzory

Každý vzor je dvojice: kus HTML v šabloně a obsluha v `app.js` (už hotová
v [reference_app.js](reference_app.js)).

## Obsah

1. [Globální prvky v base.html](#globální-prvky-v-basehtml)
2. [Potvrzení akce](#potvrzení-akce)
3. [Toast](#toast)
4. [Zachování pozice na stránce](#zachování-pozice-na-stránce)
5. [Zapamatované rozbalené sekce](#zapamatované-rozbalené-sekce)
6. [Lightbox](#lightbox)
7. [Stepper a předvolby](#stepper-a-předvolby)
8. [Opakovatelné bloky formuláře](#opakovatelné-bloky-formuláře)
9. [Napovídání v textovém poli](#napovídání-v-textovém-poli)
10. [Motiv a šířka stránky](#motiv-a-šířka-stránky)
11. [Nezhasínání displeje](#nezhasínání-displeje)

---

## Globální prvky v base.html

Tyhle tři bloky jsou v `base.html` jednou a obsluhuje je `app.js`:

```html
<!-- toasty -->
<div id="notification-toast" class="toast-container" aria-live="polite"></div>

<!-- potvrzovací modal -->
<div id="confirm-overlay" class="modal-overlay" role="dialog" aria-modal="true"
     aria-labelledby="confirm-title" style="display:none">
    <div class="modal">
        <div class="modal-header"><div id="confirm-title" class="modal-title"></div></div>
        <div class="modal-body"><p id="confirm-message"></p></div>
        <div class="modal-footer">
            <button id="confirm-cancel" type="button" class="btn btn-outline" onclick="closeConfirm()">Zrušit</button>
            <button id="confirm-ok" type="button" class="btn btn-primary"></button>
        </div>
    </div>
</div>

<!-- lightbox -->
<div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Náhled fotografie" hidden>
    <button type="button" class="lightbox-close" id="lightbox-close" aria-label="Zavřít">{{ icon('x', 22) }}</button>
    <button type="button" class="lightbox-nav lightbox-prev" id="lightbox-prev" aria-label="Předchozí" hidden>{{ icon('chevron-left', 26) }}</button>
    <img id="lightbox-img" src="" alt="">
    <button type="button" class="lightbox-nav lightbox-next" id="lightbox-next" aria-label="Další" hidden>{{ icon('chevron-right', 26) }}</button>
    <span class="lightbox-counter" id="lightbox-counter" hidden></span>
</div>
```

---

## Potvrzení akce

```html
<form method="post" action="/zaznam/12/smazat"
      data-confirm="Záznam bude trvale smazán i s přílohami."
      data-confirm-title="Smazat záznam?"
      data-confirm-ok="Smazat"
      data-confirm-danger>
    <button class="btn btn-danger" type="submit">Smazat</button>
</form>
```

| Atribut | Význam |
|---------|--------|
| `data-confirm` | text dotazu (povinný) |
| `data-confirm-title` | nadpis, výchozí „Opravdu?“ |
| `data-confirm-ok` | popisek potvrzovacího tlačítka |
| `data-confirm-danger` | tlačítko bude červené |

Jak to funguje: posluchač zachytí `submit` v capture fázi, zruší ho a otevře modal.
Po potvrzení nastaví `data-confirmed` a odešle formulář znovu — proto se dotaz
neopakuje donekonečna. `e.submitter` se předává dál, takže funguje i formulář
s víc tlačítky (`name`/`value`).

Text piš konkrétně: co se stane a co se ztratí. Ne „Opravdu?“, ale
„Záznam bude trvale smazán i s přílohami.“

---

## Toast

```javascript
showNotification('Záznam byl uložen.', 'success');  // success | error | info
```

Na zprávy, které vzniknou po přesměrování ze serveru, použij parametr v URL
a vypiš je jako `alert` v šabloně (viz `web-app-ui`) — toast se hodí na akce
provedené v prohlížeči.

---

## Zachování pozice na stránce

Formulář, který odesílá jednu položku dlouhého seznamu (odškrtnutí, změna stavu):

```html
<form method="post" action="/polozka/{{ item.id }}/prepnout" data-keep-scroll>
    <button type="submit" class="shop-check">…</button>
</form>
```

Před odesláním se uloží `window.scrollY` do `sessionStorage` pod klíčem podle cesty,
po návratu se obnoví a klíč smaže. Bez toho seznam po každém kliknutí odskočí nahoru.

---

## Zapamatované rozbalené sekce

```html
<details class="card" id="hotove" data-remember-open>
    <summary class="card-header">Hotové položky ({{ done|length }})</summary>
    …
</details>
```

Stav se drží v `sessionStorage` podle cesty a `id`. Bez toho se sekce po každé akci
uvnitř zase zavře — klasická past u seznamů, kde formulář odeslání znovu načte stránku.

---

## Lightbox

```html
<!-- odkaz na plnou velikost, v odkazu náhled -->
<a href="/media/{{ m.id }}" data-lightbox data-lightbox-src="/media/{{ m.id }}">
    <img src="/media/{{ m.id }}?thumb=1" alt="{{ m.caption }}">
</a>

<!-- prvek, který není odkaz -->
<button type="button" class="recipe-head-zoom" data-lightbox-src="/media/{{ cover.id }}"
        aria-label="Zobrazit fotku">
    <img src="/media/{{ cover.id }}" alt="">
</button>
```

Chování: otevře překryv, posbírá všechny fotky na stránce a umožní listovat
(šipky, klávesy ←/→, přejetí prstem). Zavírá se křížkem, klikem mimo a klávesou Escape.
Cmd/Ctrl/Shift+klik nechá prohlížeči, takže fotka jde otevřít na nové kartě.

---

## Stepper a předvolby

```html
<div class="stepper" data-stepper>
    <button type="button" data-step="-1" aria-label="Snížit">{{ icon('minus', 18) }}</button>
    <input id="qty" type="number" name="qty" value="1" min="1" step="1" inputmode="numeric" aria-label="Počet">
    <span class="stepper-suffix">ks</span>
    <button type="button" data-step="1" aria-label="Zvýšit">{{ icon('plus', 18) }}</button>
</div>

<div class="chips" data-preset-group="qty">
    <button type="button" class="chip" data-set-value="1" data-target="qty">1×</button>
    <button type="button" class="chip" data-set-value="5" data-target="qty">5×</button>
</div>
```

`data-preset-group` ukazuje na `id` pole; předvolba odpovídající aktuální hodnotě
se sama zvýrazní. Krok respektuje `min` z pole.

---

## Opakovatelné bloky formuláře

Pro sekce, kterých může být víc (skupiny položek, přílohy, adresy):

```html
<div id="bloky" class="editor-list">
    {% for b in blocks %}
    <fieldset class="editor-block">
        <input type="hidden" name="block_id" value="{{ b.id or '' }}">
        <div class="editor-block-head">
            <input class="input input-sm editor-block-name" name="block_name" value="{{ b.name }}"
                   placeholder="Název bloku" aria-label="Název bloku">
            <button type="button" class="btn btn-ghost btn-icon btn-sm" data-remove-block
                    aria-label="Odebrat blok">{{ icon('trash', 16) }}</button>
        </div>
        <textarea class="input editor-area" name="block_text" rows="6">{{ b.text }}</textarea>
    </fieldset>
    {% endfor %}
</div>

<button type="button" class="btn btn-outline btn-sm mt-4"
        data-add-block="bloky" data-block-template="blok-sablona">{{ icon('plus', 16) }}Další blok</button>

<template id="blok-sablona">
    <fieldset class="editor-block">
        <input type="hidden" name="block_id" value="">
        <div class="editor-block-head">
            <input class="input input-sm editor-block-name" name="block_name" placeholder="Název bloku" aria-label="Název bloku">
            <button type="button" class="btn btn-ghost btn-icon btn-sm" data-remove-block aria-label="Odebrat blok">{{ icon('trash', 16) }}</button>
        </div>
        <textarea class="input editor-area" name="block_text" rows="6" aria-label="Obsah bloku"></textarea>
    </fieldset>
</template>
```

Na serveru přijdou pole jako **souběžné seznamy** — páruješ je podle pořadí:

```python
@router.post("/zaznam/{rid}/ulozit")
async def save(
    rid: int,
    block_id: list[str] = Form(default=[]),
    block_name: list[str] = Form(default=[]),
    block_text: list[str] = Form(default=[]),
):
    blocks = [
        {
            "id": int(block_id[i]) if block_id[i].strip().isdigit() else None,
            "name": block_name[i],
            "text": block_text[i],
        }
        for i in range(len(block_name))
    ]
```

Každý blok musí mít všechna tři pole (i prázdná), jinak se seznamy rozjedou.
Odebrání bloku smaže celý `fieldset`, takže pořadí zůstane v pořádku.
Blok s vyplněným obsahem se odebírá až po potvrzení.

---

## Napovídání v textovém poli

Pole, kde se píše víc řádků a názvy mají odpovídat číselníku:

```html
<textarea class="input editor-area" name="lines" rows="6"
          data-suggest-url="/ciselnik/suggest" autocomplete="off"></textarea>
```

Server dostane celý rozepsaný řádek a vrátí, co z něj je „předpona“ (množství,
kód, cokoli před názvem) a návrhy:

```python
@router.get("/ciselnik/suggest")
async def suggest(request: Request, line: str = ""):
    name = extract_name(line)          # z „2 kg hlad“ udělá „hlad“
    if len(name) < 2:
        return JSONResponse({"prefix": "", "items": []})
    idx = line.lower().rfind(name.lower())
    return JSONResponse({
        "prefix": line[:idx] if idx > 0 else "",
        "items": [{"name": row["name"]} for row in find_matches(name)[:6]],
    })
```

Klient doplní jen název, předponu nechá být — z „2 kg hlad“ vznikne „2 kg Hladká mouka“.
Ovládání: šipky nahoru/dolů, Enter nebo Tab potvrdí vybranou položku, Escape zavře.
**Enter bez vybrané položky musí udělat nový řádek** — jinak se v poli nedá psát.

---

## Motiv a šířka stránky

HTML přepínačů je v `web-app-ui` (TEMPLATE_FOOTER.md). Obsluha:

```javascript
setTheme('auto' | 'light' | 'dark');   // ukládá do localStorage
setWideLayout(true | false);           // třída layout-wide na body
```

Aby stránka při načtení neblikla, nastavuje se motiv inline skriptem v `<head>`
ještě před CSS-em zpracovaným obsahem — viz kostra `base.html`.

---

## Nezhasínání displeje

Hodí se, když uživatel u aplikace pracuje rukama (kuchyně, dílna, sklad):

```javascript
var wakeLock = null;

async function requestWakeLock() {
    var cb = document.getElementById('wake-lock-toggle');
    if (!cb || !cb.checked || !('wakeLock' in navigator)) return;
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', function () {
            wakeLock = null;
            if (document.visibilityState === 'visible' && cb.checked) requestWakeLock();
        });
    } catch (e) {
        // NotAllowedError → zkusit znovu po prvním doteku uživatele
    }
}

document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') requestWakeLock();
});
```

Na co si dát pozor:

- Zámek se ztrácí při **každém načtení stránky** — když krok postupu odesílá formulář,
  musí se o zámek požádat znovu při startu skriptu, ne jen po kliknutí na přepínač.
- Volbu si pamatuj v `localStorage`, jinak ji uživatel zapíná po každém kroku znovu.
- Funguje jen v zabezpečeném kontextu (HTTPS nebo localhost) a na viditelné stránce.
- V nástrojích s vestavěným prohlížečem se stránka tváří jako skrytá a zámek nejde
  získat — ověřuj na skutečném telefonu.
