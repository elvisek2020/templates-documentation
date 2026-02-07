# Docker – kontejnerizace a orchestration

Tento dokument popisuje standardní Docker setup pro webové aplikace založené na FastAPI + Jinja2. Vychází z produkčního nasazení a lze ho přizpůsobit konkrétnímu projektu (přidat balíčky, služby, env proměnné).

## 📋 Obsah

1. [Přehled](#přehled)
2. [Dockerfile](#dockerfile)
3. [Docker Compose](#docker-compose)
4. [Proměnné prostředí](#proměnné-prostředí)
5. [OAuth2 Proxy (volitelně)](#oauth2-proxy-volitelně)
6. [Best practices](#best-practices)

---

## Přehled

- **Aplikace běží jako non-root uživatel** (UID 1000) – na hostiteli musí být adresář `./data` vlastněný `1000:1000`.
- **Healthcheck** zajišťuje detekci nefunkčního kontejneru.
- **Compose** může obsahovat jen aplikaci, nebo aplikaci + OAuth2 proxy + Redis podle potřeby.

**Struktura souborů:**

```
project/
├── Dockerfile
├── docker-compose.yml      # případně docker-compose.override.yml pro dev
├── .env                    # necommitujte – citlivé údaje
├── requirements.txt
├── app/
└── data/                   # volume pro SQLite a další data
```

---

## Dockerfile

Zobecněný Dockerfile pro FastAPI aplikaci s Jinja2. Pro konkrétní projekty doplňte do `RUN apt-get install` další balíčky (např. `libsmbclient` pro SMB, `unixodbc` + `tdsodbc` pro MS SQL).

```dockerfile
# Dockerfile – FastAPI + Jinja2 (šablona)
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Non-root user (UID 1000) – na hostiteli: chown -R 1000:1000 ./data
RUN useradd -u 1000 -ms /bin/bash appuser && \
    apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        sqlite3 \
        curl \
        && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY app /app
RUN mkdir -p /app/data && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers", "--forwarded-allow-ips", "*"]
```

**Poznámky:**

- `main:app` předpokládá vstupní modul `app/main.py` s proměnnou `app`. Upravte podle struktury projektu (např. `app.main:app`).
- Pro aplikace za reverse proxy jsou důležité `--proxy-headers` a `--forwarded-allow-ips`.
- Další systémové balíčky (SMB, ODBC, diagnostika): přidejte je do řádku `apt-get install` a zdokumentujte v README projektu.

**Verze aplikace:** Verze se zobrazuje v zápatí (proměnná `app_version` v šablonách). Dva přístupy:

1. **Soubor `app/static/version.json` v repozitáři** – obsahuje např. `{"version": "20260207.2010"}`. Aplikace při startu soubor načte a předá verzi do šablon (globální proměnná). Soubor lze měnit ručně před releasem. Viz [TEMPLATE_FOOTER.md](./TEMPLATE_FOOTER.md).

2. **Generování při buildu image** – verze podle data/času buildu:

```dockerfile
# Před USER appuser, pokud používáte non-root
RUN python3 -c "import datetime; v = datetime.datetime.now().strftime('v.%Y%m%d.%H%M'); open('/app/static/version.json', 'w').write('{\"version\": \"' + v + '\"}')"
```

V obou případech je soubor dostupný na `/static/version.json`; backend ho načte při startu a nastaví např. `templates.env.globals["app_version"]`.

**WeasyPrint (generování PDF):** Pokud aplikace používá WeasyPrint, přidejte do `apt-get install`:

```dockerfile
libpango-1.0-0 libpangoft2-1.0-0 libgobject-2.0-0 libcairo2 \
libgdk-pixbuf-xlib-2.0-0 shared-mime-info
```

---

## Docker Compose

Základní compose pouze pro aplikaci (bez OAuth2). Síť může zůstat defaultní nebo být externí (např. `proxy_network` pro společnou proxy).

### Minimální varianta (jen aplikace)

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: my_app
    hostname: my_app
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    env_file:
      - .env
    environment:
      - PYTHONUNBUFFERED=1
      - TZ=${TZ:-Europe/Prague}
      - SESSION_SECRET=${SESSION_SECRET}
      - DB_PATH=${DB_PATH:-/app/data/app.db}
    volumes:
      - ./data:/app/data
    # networks:
    #   - proxy_network

# networks:
#   proxy_network:
#     external: true
```

### Přístup k hostiteli (DB na hostu)

Když databáze nebo jiná služba běží na hostu (např. MySQL), kontejner k ní může přistoupit přes `host.docker.internal`. Na Linuxu je potřeba přidat:

```yaml
services:
  app:
    # ...
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

V aplikaci pak např. `MYSQL_HOST=host.docker.internal`.

### Volumes pro vývoj

Pro vývoj bez stálého přestavování image lze namountovat i zdrojové složky (live úpravy bez rebuildu):

```yaml
volumes:
  - ./data:/app/data
  - ./app/static:/app/app/static
  - ./app/templates:/app/app/templates
```

Cesty uvnitř kontejneru závisí na struktuře projektu (zde předpoklad `WORKDIR /app` a kód v `/app/app`).

### Úplně minimální varianta (jen image + port)

Když aplikace nepotřebuje env, volumes ani build (např. jednoduchá hra nebo demo), stačí image z registry a mapování portu:

```yaml
services:
  app:
    image: ghcr.io/vase-org/vase-repo:latest
    container_name: my-app
    ports:
      - "80:8000"
    restart: unless-stopped
```

Aplikace pak běží na portu 80 hostitele. Pro více služeb, env nebo data přidejte podle ostatních sekcí.

### Build vs. image z registry (produkce)

Pro vývoj používejte `build: context: .`. Pro produkci lze přepnout na image z registry (GHCR, Docker Hub):

```yaml
# build:
#   context: .
#   dockerfile: Dockerfile
image: ghcr.io/vase-org/vase-repo:latest
```

### Proměnné v Compose

- **Povinné:** `SESSION_SECRET` (a další dle aplikace).
- **Volitelné s výchozí hodnotou:** `TZ`, `DB_PATH`.
- Citlivé hodnoty držte v `.env` a necommitujte je.

---

## Proměnné prostředí

Typické proměnné pro šablonu aplikace:

| Proměnná       | Povinné | Výchozí            | Popis |
|----------------|---------|--------------------|--------|
| `SESSION_SECRET` | ano   | —                  | Tajný klíč pro session (middleware). |
| `DB_PATH`      | ne      | `/app/data/app.db` | Cesta k hlavní SQLite databázi. |
| `TZ`           | ne      | `Europe/Prague`    | Časová zóna. |
| `ADMIN_OID`    | dle app | —                  | OID administrátora (Entra ID). |

Pro konkrétní projekty doplňte (SMTP, LDAP, Azure, API klíče atd.) a zdokumentujte v README nebo v tomto souboru.

**Příklad `.env.example` (commitujte, bez reálných hodnot):**

```env
TZ=Europe/Prague
SESSION_SECRET=change-me-min-32-chars
DB_PATH=/app/data/app.db
```

---

## OAuth2 Proxy (volitelně)

Pokud je aplikace chráněná OAuth2 proxy (např. Entra ID), přidejte do Compose služby `oauth2-proxy` a `redis` a připojte je ke stejné síti jako aplikace. Aplikace by měla mít `depends_on: - oauth2-proxy`, proxy pak `depends_on: - oauth2-redis`, aby kontejnery startovaly ve správném pořadí.

**Zjednodušený příklad:**

```yaml
services:
  app:
    # ... jako výše ...
    depends_on:
      - oauth2-proxy
    networks:
      - proxy_network

  oauth2-proxy:
    image: quay.io/oauth2-proxy/oauth2-proxy:v7.12.0
    restart: unless-stopped
    depends_on:
      - oauth2-redis
    env_file: .env
    environment:
      - OAUTH2_PROXY_PROVIDER=${OAUTH2_PROXY_PROVIDER:-azure}
      - OAUTH2_PROXY_AZURE_TENANT=${OAUTH2_PROXY_AZURE_TENANT}
      - OAUTH2_PROXY_CLIENT_ID=${OAUTH2_PROXY_CLIENT_ID}
      - OAUTH2_PROXY_CLIENT_SECRET=${OAUTH2_PROXY_CLIENT_SECRET}
      - OAUTH2_PROXY_REDIRECT_URL=${OAUTH2_PROXY_REDIRECT_URL}
      - OAUTH2_PROXY_OIDC_ISSUER_URL=${OAUTH2_PROXY_OIDC_ISSUER_URL}
      - OAUTH2_PROXY_UPSTREAMS=http://app:8000
      - OAUTH2_PROXY_SESSION_STORE_TYPE=redis
      - OAUTH2_PROXY_REDIS_CONNECTION_URL=redis://oauth2-redis:6379
      - OAUTH2_PROXY_COOKIE_SECRET=${OAUTH2_PROXY_COOKIE_SECRET}
      - OAUTH2_PROXY_HTTP_ADDRESS=0.0.0.0:4180
      # Volitelně: delší platnost cookie a timeouty pro dlouhé requesty
      # - OAUTH2_PROXY_COOKIE_EXPIRE=168h
      # - OAUTH2_PROXY_COOKIE_REFRESH=1h
      # - OAUTH2_PROXY_UPSTREAM_TIMEOUT=300s
      # - OAUTH2_PROXY_PROXY_TIMEOUT=300s
    networks:
      - proxy_network

  oauth2-redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: ["redis-server", "--appendonly", "yes"]
    networks:
      - proxy_network

networks:
  proxy_network:
    external: true
```

**Poznámky:**

- Název služby aplikace v `OAUTH2_PROXY_UPSTREAMS` musí odpovídat názvu služby v Compose (zde `app`).
- Pro lokální přístup k proxy (bez reverse proxy) lze zveřejnit port: `ports: - "4180:4180"`.
- Pro dlouhé requesty (např. generování reportů) zvyšte `OAUTH2_PROXY_UPSTREAM_TIMEOUT` a `OAUTH2_PROXY_PROXY_TIMEOUT`.
- Cookie: `OAUTH2_PROXY_COOKIE_EXPIRE` (platnost), `OAUTH2_PROXY_COOKIE_REFRESH` (obnovení) dle potřeby.

---

## Best practices

1. **Non-root:** Kontejner neběží jako root; data v `./data` vlastněte na hostiteli jako `1000:1000`.
2. **Healthcheck:** Používejte jednoduchý HTTP check (curl na `/` nebo `/health`).
3. **Secrets:** Do repozitáře nepatří `.env` s reálnými hesly; používejte `.env.example`.
4. **Build vs image:** Pro vývoj `build: context: .`; pro produkci lze použít image z registry (např. GHCR).
5. **Proxy:** Za reverse proxy používejte v uvicorn `--proxy-headers` a `--forwarded-allow-ips`.
6. **Python:** `PYTHONDONTWRITEBYTECODE=1` a `PYTHONUNBUFFERED=1` v Dockerfile zlepšují chování v kontejneru.

---

## Shrnutí

- **Dockerfile:** Python 3.12-slim, non-root UID 1000, minimálně `ca-certificates`, `sqlite3`, `curl`; podle potřeby doplnit další balíčky.
- **Compose:** Služba aplikace s healthcheckem, volumes pro `./data`, env z `.env`.
- **OAuth2:** Volitelně samostatné služby `oauth2-proxy` + Redis a sdílená síť.

Pro detailní technologický stack (FastAPI, Jinja2, databáze, autentizace) viz [TEMPLATE_TECHNOLOGY.md](./TEMPLATE_TECHNOLOGY.md).
