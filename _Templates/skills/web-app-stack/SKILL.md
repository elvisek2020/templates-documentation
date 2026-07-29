---
name: web-app-stack
description: Technologický stack a architektura standardizovaných webových aplikací — Python, FastAPI, Jinja2, HTMX, SQLite, modulární systém, OAuth2. Použij při zakládání nové webové aplikace, přidávání nového modulu, návrhu architektury, práci s databází nebo při rozhodování o technologiích a struktuře projektu.
---

# Technologický stack webové aplikace

Standardní stack pro všechny webové aplikace:

- **Backend**: Python + FastAPI, šablony Jinja2
- **Frontend**: HTML5, lokální CSS (`app.css`), HTMX pro dynamický obsah — žádný frontend framework
- **Databáze**: SQLite
- **Autentizace**: OAuth2 (detaily přihlašování řeší skill `web-app-auth`)
- **Architektura**: modulární systém — každá funkční oblast je samostatný modul
- **Deployment**: Docker (řeší skill `web-app-docker`)

## Postup

1. Před návrhem architektury nebo nového modulu si přečti [references/TEMPLATE_TECHNOLOGY.md](references/TEMPLATE_TECHNOLOGY.md) — obsahuje kompletní popis architektury, strukturu modulů, práci s databází a best practices.
2. Drž se zavedených vzorů z reference; konzistence má přednost před „čistším" přepisem.
3. Nepřidávej nové závislosti ani technologie, pokud je stack již nepokrývá — pokud je to nutné, výslovně na to upozorni.

## Klíčová pravidla

- Nové funkce přidávej jako moduly podle vzoru v referenci, ne jako zásahy napříč aplikací.
- Konfigurace přes proměnné prostředí, žádné tajné údaje natvrdo v kódu.
- UI vrstvu řeš podle skillu `web-app-ui` (standardní komponenty a styly).
