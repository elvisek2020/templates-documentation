---
name: web-app-ui
description: Standardizované UI webových aplikací — design systém app.css (dvě palety, světlý i tmavý režim), layout stránek, komponenty (tlačítka, formuláře, tabulky, karty, modaly, prázdné stavy), hlavní menu včetně mobilní lišty a zápatí. Použij při vytváření nebo úpravě jakékoli stránky, Jinja2/HTML šablony, komponenty, formuláře, tabulky, menu, zápatí nebo CSS ve webové aplikaci, aby vzhled a chování odpovídaly zavedenému design systému.
---

# UI webové aplikace

Všechny stránky stojí na jediném lokálním stylesheetu `app/static/css/app.css`. Nevymýšlej
vlastní třídy ani inline styly — používej třídy z [references/reference_app.css](references/reference_app.css).
Když komponenta chybí, přidej ji **do app.css** (a do náhledové stránky), ne do šablony.

## Založení aplikace: paleta + základ

Design systém je rozdělený na paletu (barvy, písma, stíny) a základ (struktura a komponenty).
Při zakládání projektu vyber paletu a spoj soubory do `app.css`:

```bash
# firemní / interní nástroj
cat theme_corporate.css reference_app.css > app/static/css/app.css

# osobní / domácí aplikace
cat theme_personal.css  reference_app.css > app/static/css/app.css
```

| Paleta | Vzhled | Kdy |
|--------|--------|-----|
| `theme_corporate.css` | neutrální povrchy, modrý akcent, systémová písma | evidence, administrace, interní nástroje, reporty |
| `theme_personal.css` | teplý papír, terakotový akcent, patkové nadpisy (Fraunces) | receptáře, deníky, rodinné a hobby aplikace |

Vlastní barva aplikace = změna tří tokenů (`--color-primary`, `--color-primary-hover`,
`--color-primary-soft`) ve světlé i obou tmavých variantách. Nic jiného se nepřebarvuje.

## Kterou referenci číst

| Úkol | Reference |
|------|-----------|
| Nová stránka, `base.html`, hlavička stránky, sekce, dvousloupcový layout, master–detail, prázdný stav | [references/TEMPLATE_LAYOUT.md](references/TEMPLATE_LAYOUT.md) |
| Konkrétní komponenta — tlačítka, formuláře, tabulky, seznamy, badge, modal, toast, ikony | [references/TEMPLATE_COMPONENTS.md](references/TEMPLATE_COMPONENTS.md) |
| Hlavní menu, mobilní spodní lišta, panel „Více“, banner probíhající akce, aktivní záložka | [references/TEMPLATE_MENU.md](references/TEMPLATE_MENU.md) |
| Zápatí, verze aplikace, přepínač motivu a šířky stránky | [references/TEMPLATE_FOOTER.md](references/TEMPLATE_FOOTER.md) |
| Dostupné třídy a tokeny | [references/reference_app.css](references/reference_app.css) |
| Vizuální kontrola všech komponent | [references/preview.html](references/preview.html) |

## Klíčová pravidla

- **Barvy jen přes tokeny.** V šablonách ani v aplikační části app.css nesmí být `#hex`
  ani `rgb()` — vždy `var(--color-…)`. Jinak se rozbije tmavý režim.
- **Tmavý režim je povinný.** Každá nová komponenta musí fungovat ve světlém i tmavém;
  ověř v `preview.html` přepínačem v zápatí.
- **Žádný Tailwind ani utility framework.** Jen třídy z app.css a pár utilit na konci souboru.
- Obsah stránky patří do `.container`; každá stránka má `.page-header` s `h1.page-title`.
- Sekce obsahu jsou `.card`. Nepoužívej `div` se stíny „nastylované ručně“.
- Tlačítka: `.btn` + varianta. Dotykové cíle minimálně 44 px (drží `--btn-height`).
- Hlavní menu: nejvýš čtyři záložky na desktopu, spodní lišta na mobilu, aktivní stav z `current_tab`.
- Destruktivní akce se potvrzují modalem (`data-confirm`), ne `confirm()`.
  Zpětná vazba přes `showNotification()`, ne `alert()`.
- Sémantické HTML, `aria-label` u ikonových tlačítek, viditelný focus (`:focus-visible`).
- Dynamický obsah přes HTMX, vlastní JavaScript co nejmíň.
- **Po změně app.css zvyš verzi** v `app/static/version.json` — CSS i JS se načítají
  s `?v=`, jinak prohlížeč drží starou verzi.

## Související skilly

- Chování stránky (toasty, potvrzovací modal, přepínač motivu, HTMX vzory, `app.js`) → `web-app-interactions`
- Architektura, moduly, šablonovací vrstva, filtry → `web-app-stack`
- Přihlašovací stránky a správa PassKey → `web-app-auth`
- Fotky, galerie, náhledy → `web-app-media`

## Checklist před dokončením

- [ ] Použity jen třídy z app.css, žádné inline styly s barvami
- [ ] Stránka má `.page-header` s `h1.page-title`
- [ ] Sekce v `.card`, akce v `.page-actions` nebo `.card-footer`
- [ ] Ikonová tlačítka mají `aria-label`
- [ ] Vyzkoušeno ve světlém i tmavém režimu a na šířce 375 px
- [ ] Po zásahu do app.css doplněna komponenta do `preview.html` a zvýšena verze
