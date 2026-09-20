# Kostra samostatné aplikace

Vzor pro aplikaci, která běží sama za reverzní proxy a má vlastní přihlášení
(Magic Link / PassKey — skill `web-app-auth`). Pro portál s moduly za OAuth2 proxy
platí [TEMPLATE_TECHNOLOGY.md](TEMPLATE_TECHNOLOGY.md).

## Obsah

1. [Struktura projektu](#struktura-projektu)
2. [Vstupní bod](#vstupní-bod-appmainpy)
3. [Konfigurace](#konfigurace-appconfigpy)
4. [Databázová vrstva](#databázová-vrstva-appdbpy)
5. [Šablonovací vrstva](#šablonovací-vrstva-apptemplates_enginepy)
6. [Kontext stránky](#kontext-stránky-appcommonpy)
7. [Modul](#modul-appappsmodul)
8. [Souběžné úpravy](#souběžné-úpravy)
9. [Verze a cache](#verze-a-cache)
10. [Pravidla](#pravidla)

---

## Struktura projektu

```
app/
├── main.py              # FastAPI, middleware, registrace routerů, /health
├── config.py            # konfigurace z proměnných prostředí
├── db.py                # spojení, helpery, schéma, seedy
├── common.py            # page_ctx — společný kontext šablon
├── templates_engine.py  # Jinja2, globální proměnné, filtry
├── textutil.py          # normalizace textu pro hledání (fold)
├── apps/                # moduly aplikace
│   ├── auth/            # routers.py (+ middleware.py)
│   ├── <oblast>/        # routers.py, db.py
│   └── …
├── templates/
│   ├── base.html
│   ├── _icons.html      # makro ikon
│   ├── _macros.html     # alert, empty_state, …
│   └── <oblast>/        # list.html, detail.html, _partial.html
└── static/
    ├── css/app.css
    ├── js/app.js
    └── version.json
data/                    # nahrané soubory (mimo image)
tests/                   # pytest — hlavně čistá logika
```

Jeden modul = jedna oblast (uživatelské pojmenování, ne tabulka). Každý má `routers.py`
a podle potřeby `db.py`. Žádný gigantický router, žádná logika v šablonách.

---

## Vstupní bod (`app/main.py`)

```python
"""Vstupní bod aplikace."""
from __future__ import annotations

import logging
import os

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from starlette.middleware.sessions import SessionMiddleware

from app.apps.auth.middleware import AuthMiddleware
from app.apps.auth.routers import router as auth_router
from app.apps.zakazky.routers import router as zakazky_router
from app.config import DATA_DIR, STATIC_DIR, settings
from app.db import get_engine, init_db

logging.basicConfig(
    level=getattr(logging, settings.log_level, logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("app")

app = FastAPI(title=settings.app_name, docs_url=None, redoc_url=None)

app.add_middleware(AuthMiddleware)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.session_secret,
    https_only=not settings.dev_mode,
    same_site="lax",
    max_age=settings.session_timeout_hours * 3600,
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "microphone=(), geolocation=()"
    return response


app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

app.include_router(auth_router)
app.include_router(zakazky_router)


@app.on_event("startup")
async def startup():
    os.makedirs(DATA_DIR, exist_ok=True)
    try:
        init_db()
    except Exception:
        logger.exception("init_db selhal — aplikace běží, ale DB nemusí být připravená")


@app.get("/health")
async def health():
    """Healthcheck pro Docker i reverzní proxy — ověřuje i databázi."""
    try:
        with get_engine().connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception:
        logger.exception("Health check: databáze nedostupná")
        return JSONResponse(status_code=503, content={"status": "error", "database": "disconnected"})


@app.get("/")
async def root():
    return RedirectResponse(url="/zakazky", status_code=302)
```

Pozor na `Permissions-Policy`: když aplikace fotí (`<input type="file" accept="image/*">`),
**nesmí** být `camera=()`.

---

## Konfigurace (`app/config.py`)

Všechno z prostředí, žádná tajemství v kódu. Konfigurace se ověřuje při startu,
ne až za provozu:

```python
class Config:
    def __init__(self) -> None:
        self.app_name = os.environ.get("APP_NAME", "Aplikace")
        self.dev_mode = _bool(os.environ.get("DEV_MODE"), default=True)
        self.log_level = os.environ.get("LOG_LEVEL", "INFO").upper()

        secret = os.environ.get("SESSION_SECRET", "").strip()
        if not secret:
            if not self.dev_mode:
                raise RuntimeError("SESSION_SECRET musí být nastaven v produkci.")
            logging.getLogger("app.config").warning(
                "SESSION_SECRET není nastaven – používá se nebezpečný výchozí klíč (jen pro DEV)."
            )
            secret = "dev-insecure-secret-change-me-32chars"
        if len(secret) < 32 and not self.dev_mode:
            raise RuntimeError("SESSION_SECRET musí mít alespoň 32 znaků.")
        self.session_secret = secret

        self.db_host = os.environ.get("DB_HOST", "127.0.0.1")
        # … další proměnné …

    @property
    def db_url(self) -> str:
        from urllib.parse import quote_plus
        pwd = quote_plus(self.db_password)
        return (f"mysql+pymysql://{self.db_user}:{pwd}@{self.db_host}:{self.db_port}/"
                f"{self.db_name}?charset={self.db_charset}")


settings = Config()
```

Vzorový `.env.example` patří do repozitáře, `.env` do `.gitignore`.

---

## Databázová vrstva (`app/db.py`)

**SQLite** pro jednoduchou aplikaci, **externí MariaDB**, když databázi spravuje server
a nemá běžet v kontejneru. Rozhraní je v obou případech stejné — SQLAlchemy Core
(žádné ORM, žádné modely):

```python
from sqlalchemy import create_engine, text

_engine = None

def get_engine():
    global _engine
    if _engine is None:
        _engine = create_engine(
            settings.db_url,
            pool_pre_ping=True,      # spojení se ověří, nespadne po výpadku DB
            pool_size=settings.db_pool_size,
            max_overflow=max(2, settings.db_pool_size),
            pool_recycle=3600,       # MariaDB zavírá nečinná spojení
            future=True,
        )
    return _engine


def query_all(sql: str, params: dict | None = None) -> list[dict]:
    with get_engine().connect() as conn:
        return [dict(r) for r in conn.execute(text(sql), params or {}).mappings().all()]


def query_one(sql: str, params: dict | None = None) -> dict | None:
    with get_engine().connect() as conn:
        row = conn.execute(text(sql), params or {}).mappings().first()
        return dict(row) if row else None


def execute(sql: str, params: dict | None = None) -> int:
    """Vrací lastrowid u INSERT, jinak počet dotčených řádků."""
    with get_engine().begin() as conn:
        result = conn.execute(text(sql), params or {})
        return int(result.lastrowid) if result.lastrowid else result.rowcount
```

Schéma drž jako seznam `CREATE TABLE IF NOT EXISTS` příkazů a pouštěj při startu:

```python
SCHEMA_STATEMENTS = [
    """
    CREATE TABLE IF NOT EXISTS zakazky (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        owner_id     INT NOT NULL,
        title        VARCHAR(255) NOT NULL,
        title_folded VARCHAR(255) NOT NULL,   -- pro hledání bez diakritiky
        lock_version INT NOT NULL DEFAULT 1,  -- souběžné úpravy
        created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_zakazky_owner (owner_id),
        CONSTRAINT fk_zakazky_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """,
]


def init_db() -> None:
    with get_engine().begin() as conn:
        for stmt in SCHEMA_STATEMENTS:
            conn.execute(text(stmt))
    _migrate()        # přidání sloupců u existujících instalací
    _seed_defaults()  # číselníky, výchozí uživatel
```

Pravidla:

- Vždy pojmenované parametry (`:id`), nikdy skládání SQL řetězcem.
- Hledání bez diakritiky: ukládej vedle textu i „složený“ tvar (`title_folded`)
  a hledej v něm. Funkce `fold()` v `textutil.py` odstraní diakritiku a převede na malá.
- Mazání řeš cizími klíči (`ON DELETE CASCADE`), ne ručním úklidem v kódu.
- Pozor, co na čem visí: když na řádku závisí nahraný soubor, `CASCADE` ho smaže taky.

---

## Šablonovací vrstva (`app/templates_engine.py`)

Jedno místo, kde se nastavují globální proměnné a filtry:

```python
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))

templates.env.globals["app_name"] = settings.app_name
templates.env.globals["app_version"] = _load_version()      # z static/version.json
templates.env.globals["auth_disabled"] = settings.auth_disabled


def fmt_qty(value) -> str:
    """2.0 → „2“, 0.5 → „0,5“ — české desetinné čárky."""
    ...

def fmt_date(value, with_weekday: bool = True) -> str:
    """date → „so 19. září“."""
    ...

def cz_plural(count: int, one: str, few: str, many: str) -> str:
    """1 položka / 2–4 položky / 5+ položek."""
    if count == 1:
        return f"{count} {one}"
    if 2 <= count <= 4:
        return f"{count} {few}"
    return f"{count} {many}"


templates.env.filters["qty"] = fmt_qty
templates.env.filters["cz_date"] = fmt_date
templates.env.filters["cz_plural"] = cz_plural
```

Formátování čísel, dat a skloňování **patří do filtrů**, ne do šablon ani routerů.
Šablona pak píše `{{ items|length|cz_plural('položka', 'položky', 'položek') }}`.

---

## Kontext stránky (`app/common.py`)

Co potřebuje `base.html` na každé stránce, sestav jednou:

```python
def page_ctx(request: Request, **kwargs) -> dict:
    user = getattr(request.state, "current_user", None)
    ctx = {
        "request": request,
        "current_user": user,
        "active_job": active_job_for(user["id"]) if user else None,  # banner probíhající akce
        "hide_chrome": False,
    }
    ctx.update(kwargs)
    return ctx
```

Router pak vrací:

```python
return templates.TemplateResponse(
    "zakazky/list.html",
    page_ctx(request, current_tab="zakazky", items=items, q=q),
)
```

Nikdy neskládej kontext ručně v každém routeru — jinak někde chybí `current_tab`
nebo banner a projeví se to až na jedné podstránce.

---

## Modul (`app/apps/<modul>/`)

```python
"""Zakázky — seznam, detail, editor."""
from fastapi import APIRouter, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse

from app.apps.auth.middleware import get_current_user
from app.apps.zakazky import db as zak_db
from app.common import page_ctx
from app.templates_engine import templates

router = APIRouter(tags=["zakazky"])


@router.get("/zakazky", response_class=HTMLResponse)
async def list_page(request: Request, q: str = ""):
    user = get_current_user(request)
    items = zak_db.search(user["id"], q=q)
    # Průběžné hledání překresluje jen výsledky (skill web-app-interactions).
    template = "zakazky/_results.html" if request.headers.get("HX-Request") else "zakazky/list.html"
    return templates.TemplateResponse(template, page_ctx(request, current_tab="zakazky", items=items, q=q))


@router.post("/zakazky/{item_id}/smazat")
async def delete(request: Request, item_id: int):
    user = get_current_user(request)
    zak_db.delete(item_id, user["id"])
    return RedirectResponse("/zakazky", status_code=302)
```

Pravidla modulu:

- Každý dotaz filtruje na vlastníka (`owner_id`) — nikdy nespoléhej jen na to,
  že se uživatel k cizímu id „nedostane“.
- Po POSTu vždy přesměruj (`302`), ať se formulář nedá odeslat obnovením stránky.
- SQL patří do `db.py` modulu, router jen volá a předává do šablony.

---

## Souběžné úpravy

Když může stejný záznam upravovat víc zařízení (mobil v terénu + počítač), použij
verzi řádku. Formulář posílá verzi, kterou načetl:

```python
def update_item(item_id: int, owner_id: int, *, title: str, lock_version: int | None = None):
    row = get_item(item_id, owner_id)
    if not row:
        return False, "Záznam nenalezen."
    if lock_version is not None and int(row["lock_version"]) != int(lock_version):
        return False, "conflict"
    db.execute(
        "UPDATE zakazky SET title = :t, lock_version = lock_version + 1 "
        "WHERE id = :id AND owner_id = :uid",
        {"t": title, "id": item_id, "uid": owner_id},
    )
    return True, None
```

Router při konfliktu nepřepisuje data potichu, ale nechá uživatele vybrat:

```python
ok, err = update_item(...)
if err == "conflict":
    return RedirectResponse(f"/zakazky/{item_id}/upravit?conflict=1", status_code=302)
```

Šablona pak zobrazí `alert` s volbou „ponechat verzi ze serveru“ / „uložit moji“.

---

## Verze a cache

`app/static/version.json` drží verzi statických souborů:

```json
{"version": "20260920.1148"}
```

Načítá se **jednou při startu** do `app_version` a přidává se k CSS a JS jako `?v=`.
Po změně `app.css` nebo `app.js` verzi zvyš, jinak prohlížeč drží starý soubor.
Protože se čte při startu, musí aplikace po změně proběhnout znovu.

---

## Pravidla

- Konfigurace z prostředí, tajemství nikdy v kódu ani v šabloně.
- Žádné ORM — SQL je vidět, parametry jsou pojmenované.
- Formátování do filtrů, kontext stránky do `page_ctx`, SQL do `db.py`.
- Nové závislosti jen když je stack nepokrývá, a výslovně to zmiň.
- Testy piš na čistou logiku (parsování, výpočty, formátování); routery se testují ručně
  v prohlížeči, protože jejich hodnota je v HTML, ne v návratové hodnotě.
- UI řeší `web-app-ui`, chování `web-app-interactions`, přihlášení `web-app-auth`,
  běh v kontejneru `web-app-docker`.
