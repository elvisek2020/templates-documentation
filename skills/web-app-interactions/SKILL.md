---
name: web-app-interactions
description: Chování stránek webové aplikace — potvrzovací modal místo confirm(), toasty, lightbox fotek, přepínač světlého a tmavého režimu, zachování pozice scrollu, zapamatované rozbalené sekce, opakovatelné bloky formuláře, napovídání v poli a HTMX vzory (průběžné hledání, master–detail, částečné překreslení). Použij při psaní nebo úpravě app.js, při přidávání interaktivního chování na stránku, potvrzování akcí, práci s HTMX, průběžném hledání nebo když stránka potřebuje reagovat bez celého načtení.
---

# Chování stránky

Aplikace stojí na serverem renderovaném HTML. JavaScript jen doplňuje chování, které
HTML samo neumí — a dělá to **přes atributy v šabloně**, ne inicializací v každé stránce.
Hotový soubor je [references/reference_app.js](references/reference_app.js); zkopíruj ho
do `app/static/js/app.js` a načti v `base.html`:

```html
<script src="/static/js/app.js?v={{ app_version }}" defer></script>
```

## Kterou referenci číst

| Úkol | Reference |
|------|-----------|
| Potvrzení akce, toast, lightbox, scroll, rozbalené sekce, stepper, opakovatelné bloky, napovídání, přepínače motivu | [references/TEMPLATE_INTERACTIONS.md](references/TEMPLATE_INTERACTIONS.md) |
| Průběžné hledání, master–detail, částečné překreslení, indikátory, historie v prohlížeči | [references/TEMPLATE_HTMX.md](references/TEMPLATE_HTMX.md) |
| Hotový `app.js` | [references/reference_app.js](references/reference_app.js) |

## Přehled atributů

| Atribut | Co dělá |
|---------|---------|
| `data-confirm` na `<form>` | místo odeslání otevře potvrzovací modal |
| `data-keep-scroll` na `<form>` | po odeslání a návratu zůstane stránka na stejném místě |
| `data-remember-open` na `<details id="…">` | sekce si pamatuje, jestli byla rozbalená |
| `data-lightbox` / `data-lightbox-src` | otevře fotku v překryvu s listováním |
| `data-stepper` + `data-step` | pole s tlačítky − / + |
| `data-set-value` + `data-preset-group` | rychlé předvolby hodnoty |
| `data-file-list` na `.file-drop` | výpis vybraných souborů |
| `data-add-block` + `data-block-template` | opakovatelný blok formuláře |
| `data-suggest-url` na `<textarea>` | napovídání z číselníku při psaní |
| `data-theme-option`, `#layout-wide-toggle` | přepínače v zápatí |

## Klíčová pravidla

- **Nikdy `alert()`, `confirm()` ani `prompt()`.** Na potvrzení je `data-confirm`,
  na zpětnou vazbu `showNotification()`.
- Chování se přidává **delegovaným posluchačem na `document`**, ne `querySelector`
  při načtení stránky — jinak přestane fungovat na obsahu doplněném přes HTMX.
- Každá nová interakce = jeden `data-*` atribut a jedna funkce v `app.js`.
  Žádné `onclick` v šabloně kromě triviálního přepínání třídy na `body`.
- Práce s `localStorage` a `sessionStorage` vždy v `try/catch` — v privátním okně
  vyhodí výjimku a rozbila by zbytek skriptu.
- Preference zařízení (motiv, šířka, rozbalené sekce) patří do prohlížeče, ne do databáze.
- Co jde udělat bez JavaScriptu, udělej bez něj: rozbalovací menu přes `<details>`,
  odkaz místo `onclick`, formulář místo `fetch`.
- HTMX překresluje jen tu část, která se opravdu mění, a vrací hotové HTML — ne JSON,
  který by musel skládat prohlížeč.

## Související skilly

- Vzhled, třídy a HTML komponent → `web-app-ui`
- Routery, kontext šablon, filtry → `web-app-stack`
- Fotky a galerie (nahrávání, náhledy, DnD) → `web-app-media`

## Checklist

- [ ] Žádný `alert`/`confirm` v kódu
- [ ] Nové chování řízené `data-*` atributem, ne inline JS
- [ ] Funguje i po HTMX překreslení (delegovaný posluchač)
- [ ] `localStorage`/`sessionStorage` v `try/catch`
- [ ] Ověřeno klávesnicí (Escape zavírá, Tab prochází) i na dotykovém displeji
- [ ] Po změně `app.js` zvýšena verze v `app/static/version.json`
