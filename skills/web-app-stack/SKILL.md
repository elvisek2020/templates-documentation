---
name: web-app-stack
description: Technologický stack a architektura webových aplikací — FastAPI, Jinja2, HTMX, SQLite nebo externí MariaDB přes SQLAlchemy Core, modulární struktura app/apps, kontext šablon, české filtry, souběžné úpravy a verzování statických souborů. Použij při zakládání nové webové aplikace, přidávání nového modulu, návrhu architektury, práci s databází nebo při rozhodování o technologiích a struktuře projektu.
---

# Technologický stack webové aplikace

Společný základ všech aplikací:

- **Backend**: Python + FastAPI, šablony Jinja2
- **Frontend**: HTML5, lokální `app.css`, HTMX — žádný frontend framework
- **Databáze**: SQLite, nebo externí MariaDB; přístup přes SQLAlchemy Core (bez ORM)
- **Architektura**: moduly v `app/apps/<oblast>/` (`routers.py` + `db.py`)
- **Provoz**: Docker za reverzní proxy (skill `web-app-docker`)

## Dva typy aplikací

| Typ | Kdy | Reference |
|-----|-----|-----------|
| **Samostatná aplikace** — vlastní přihlášení, vlastní databáze, statické registrování routerů | běžný případ: evidence, nástroj, osobní aplikace | [references/TEMPLATE_APP_SKELETON.md](references/TEMPLATE_APP_SKELETON.md) |
| **Portál s moduly** — aplikace se načítají dynamicky, přihlášení řeší OAuth2 proxy před aplikací | vnitrofiremní portál se sadou modulů | [references/TEMPLATE_TECHNOLOGY.md](references/TEMPLATE_TECHNOLOGY.md) |

Nevíš-li, jde o samostatnou aplikaci.

## Postup

1. Přečti si referenci podle typu aplikace (tabulka výše) dřív, než začneš psát kód.
2. Drž zavedené vzory — konzistence má přednost před „čistším“ přepisem.
3. Nové závislosti přidávej jen tehdy, když je stack nepokrývá, a výslovně to zmiň.

## Klíčová pravidla

- Nová funkce = nový modul podle vzoru, ne zásahy napříč aplikací.
- Konfigurace z proměnných prostředí; tajemství nikdy v kódu. Kontroluj ji při startu
  (chybějící `SESSION_SECRET` v produkci = pád, ne tichý výchozí klíč).
- SQL s pojmenovanými parametry, dotazy vždy filtrované na vlastníka záznamu.
- Hledání bez diakritiky přes „složený“ sloupec (`*_folded`), ne přes `LIKE` na originále.
- Formátování čísel, dat a skloňování řeš Jinja filtry, ne v routerech ani v šablonách.
- Společný kontext šablon skládej jednou (`page_ctx`), ne v každém routeru zvlášť.
- Po POSTu přesměruj (302), ať obnovení stránky akci nezopakuje.
- Souběžné úpravy řeš verzí řádku (`lock_version`) a nabídni uživateli volbu,
  ne tiché přepsání.
- Po změně statických souborů zvyš verzi v `app/static/version.json`.

## Související skilly

- Vzhled a komponenty → `web-app-ui`
- Chování stránky a HTMX vzory → `web-app-interactions`
- Přihlášení (Magic Link, PassKey) → `web-app-auth`
- Odesílání e-mailů → `web-app-smtp`
- Kontejner a provoz → `web-app-docker`, CI/CD → `github-project-setup`
