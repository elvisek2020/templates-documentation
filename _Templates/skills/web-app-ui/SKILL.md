---
name: web-app-ui
description: Standardizované UI webových aplikací — layout stránek, komponenty (tlačítka, formuláře, tabulky, karty, modaly), hlavní menu, zápatí a styly z app.css. Použij při vytváření nebo úpravě jakékoli stránky, Jinja2/HTML šablony, komponenty, formuláře, tabulky, menu, footeru nebo CSS ve webové aplikaci, aby vzhled a chování odpovídaly zavedenému design systému.
---

# UI webové aplikace

Všechny stránky používají jednotný design systém postavený na lokálním stylesheetu `app.css`. Nikdy nevymýšlej vlastní styly ani třídy — vždy použij existující třídy z [references/reference_app.css](references/reference_app.css) (`.card`, `.btn`, `.form-group`, `.input`, `.page-header`, CSS proměnné v `:root`).

## Kterou referenci číst

| Úkol | Reference |
|------|-----------|
| Nová stránka, struktura layoutu, hlavička, sekce, dvousloupcový layout, prázdný stav | [references/TEMPLATE_LAYOUT.md](references/TEMPLATE_LAYOUT.md) |
| Konkrétní komponenta — tlačítka, formuláře, tabulky, badge, karty, modaly, loading, ikony, notifikace | [references/TEMPLATE_COMPONENTS.md](references/TEMPLATE_COMPONENTS.md) |
| Přidání nebo úprava položky v hlavním menu, mobilní navigace, aktivní stav záložky | [references/TEMPLATE_MENU.md](references/TEMPLATE_MENU.md) |
| Úprava nebo rozšíření zápatí, verze z `version.json` | [references/TEMPLATE_FOOTER.md](references/TEMPLATE_FOOTER.md) |
| Dostupné CSS třídy a proměnné | [references/reference_app.css](references/reference_app.css) |

Pokud projekt ještě nemá `app.css`, zkopíruj `references/reference_app.css` do `app/static/css/app.css` a načti ho v `base.html`.

## Klíčová pravidla

- Hlavní obsah patří do kontejneru `.container` z `base.html`.
- Každá stránka má hlavičku `.page-header` s `h1` (`.page-title`) a volitelným popisem.
- Sekce obsahu jsou v boxech — třída `.card` (příp. `.page-content-box`).
- Tlačítka: `.btn` + varianta (`.btn-primary`, `.btn-outline`, …). Žádné vlastní styly tlačítek.
- Zpětná vazba uživateli přes `showNotification()`, nikdy `alert()`.
- Záložky v menu mají 150×40 px; aktivní stav řídí backend přes `current_tab`.
- Destruktivní akce vyžadují potvrzení; formuláře mají validaci.
- Sémantické HTML, aria-labels, keyboard navigation.
- Dynamický obsah přes HTMX, minimum vlastního JavaScriptu.

## Checklist před dokončením

- [ ] Použity pouze standardní třídy z app.css (žádné nové ad-hoc styly)
- [ ] Hlavička stránky má správnou strukturu (`.page-header`, `.page-title`)
- [ ] Sekce používají `.card`
- [ ] Notifikace přes `showNotification()`
- [ ] Responzivní chování odpovídá vzorům v TEMPLATE_LAYOUT.md
