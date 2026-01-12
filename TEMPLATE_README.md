# [Název aplikace]

[Krátký popis aplikace - co to je a k čemu slouží]

## 📋 Popis

[Detailnější popis aplikace - co dělá, pro koho je určena, hlavní charakteristiky]

## ✨ Funkce

- ✅ [Hlavní funkce 1]
- ✅ [Hlavní funkce 2]
- ✅ [Hlavní funkce 3]
- ✅ [Hlavní funkce 4]

## 📖 Použití

[Obecný popis použití aplikace - základní workflow, hlavní kroky, jak začít]

### Základní workflow

1. **[Krok 1]**: [Popis co uživatel dělá]
2. **[Krok 2]**: [Popis co uživatel dělá]
3. **[Krok 3]**: [Popis co uživatel dělá]

[Poznámka: Pro herní aplikace můžete přidat sekci "Herní pravidla" nebo "Jak hrát" zde, ale obecně to není součást šablony]

## 🚀 Deployment

### Předpoklady

- Docker a Docker Compose
- [Další předpoklady, pokud jsou potřeba]

### Docker Compose

Aplikace je připravena pro spuštění pomocí Docker Compose. Soubor `docker-compose.yml` obsahuje veškerou potřebnou konfiguraci.

#### Spuštění

```bash
docker compose up -d --build
```

Aplikace bude dostupná na `http://localhost` (port 80 je mapován na port 8000 v kontejneru) - [upravit podle potřeby]

#### Konfigurace

Aplikace je konfigurována pomocí `docker-compose.yml`:

```yaml
services:
  app:
    # Pro vývoj použijte build:
    build:
      context: .
      dockerfile: Dockerfile
    # Pro produkci použijte image z GHCR:
    # image: ghcr.io/[username]/[repo-name]:latest
    container_name: [název-kontejneru]
    hostname: [název-hostname]
    restart: unless-stopped
    ports:
      - "80:8000"
    environment:
      - PYTHONUNBUFFERED=1
      - LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR, CRITICAL
    # Pro produkci přidejte síťovou konfiguraci:
    # networks:
    #   core:
    #     ipv4_address: 172.20.0.xxx

# Pro produkci odkomentujte:
# networks:
#   core:
#     external: true
```

#### Update aplikace

```bash
docker compose pull
docker compose up -d
```

### GitHub Container Registry (GHCR)

Aplikace je dostupná jako Docker image z GitHub Container Registry:

- **Latest**: `ghcr.io/[username]/[repo-name]:latest`
- **Konkrétní commit**: `ghcr.io/[username]/[repo-name]:sha-<commit-sha>`

Image je **veřejný** (public), takže není potřeba autentizace pro pull.

---

## 🔧 Technická dokumentace

### 🏗️ Architektura

[Popis architektury aplikace - jak je postavena, jaké má charakteristiky]

- **[Charakteristika 1]**: [Popis]
- **[Charakteristika 2]**: [Popis]
- **[Charakteristika 3]**: [Popis]

### Technický stack

**Backend:**

- FastAPI (Python 3.11+)
- WebSockets pro real-time komunikaci
- Uvicorn jako ASGI server
- Python logging s konfigurovatelnou úrovní

**Frontend:**

- [Vanilla JavaScript / React / Vue / atd.]
- HTML5 + CSS3
- WebSocket API
- [Další technologie]

**Deployment:**

- Docker
- Docker Compose

### 📁 Struktura projektu

```
[název-projektu]/
├── app/
│   ├── __init__.py
│   ├── models.py              # Datové modely
│   ├── logic.py               # Business logika / Herní logika
│   └── [další soubory]
├── static/
│   ├── index.html             # Hlavní HTML stránka
│   ├── style.css              # Styly
│   ├── app.js                 # Frontend JavaScript
│   └── [další soubory]
├── main.py                    # FastAPI aplikace + WebSocket endpoint
├── requirements.txt           # Python závislosti
├── Dockerfile                 # Docker image definice
├── docker-compose.yml         # Docker Compose konfigurace
└── README.md                  # Tato dokumentace
```

### 🔧 API dokumentace

#### WebSocket endpoint

**URL**: `ws://localhost/ws` (nebo `ws://localhost:8000/ws` při lokálním vývoji)

Detailní popis API zpráv najdete v dokumentaci aplikace (pokud existuje složka `_docs/`) nebo v kódu aplikace.

### 💻 Vývoj

#### Přidání nových funkcí

1. **Backend změny**:
2. **Frontend změny**:

   - UI logika: `static/app.js`
   - HTML struktura: `static/index.html`
   - Styly: `static/style.css` (používejte box-style komponenty)

#### Debugging

- Nastavte `LOG_LEVEL=DEBUG` v `docker-compose.yml` pro detailní logy
- Server loguje všechny důležité události s timestampy
- Frontend loguje chyby do konzole prohlížeče

#### Úroveň logování (`LOG_LEVEL`)

- `DEBUG` - zobrazí všechny logy včetně detailních debug informací (vývoj)
- `INFO` - zobrazí informační logy (výchozí, vhodné pro testování)
- `WARNING` - zobrazí pouze varování a chyby (doporučeno pro produkci)
- `ERROR` - zobrazí pouze chyby (minimální logování)
- `CRITICAL` - zobrazí pouze kritické chyby

Pro produkci doporučujeme nastavit `LOG_LEVEL=WARNING` nebo `LOG_LEVEL=ERROR`.

### 🎨 UI/UX

Aplikace používá **box-style komponenty** pro konzistentní vzhled:

- Všechny komponenty mají boxový vzhled s rámečky
- Konzistentní barvy a rozestupy
- Responzivní design
- [Přidejte další UI charakteristiky specifické pro vaši aplikaci]

### 🐛 Známé problémy

Pokud existují známé problémy nebo omezení, uveďte je zde. Jinak tuto sekci odstraňte nebo nechte prázdnou.

### 📚 Další zdroje

- [FastAPI dokumentace](https://fastapi.tiangolo.com/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Docker dokumentace](https://docs.docker.com/)
- [GitHub Actions dokumentace](https://docs.github.com/en/actions)

## 📄 Licence

Tento projekt je vytvořen pro vzdělávací účely.

---

## 🤝 Contributing

Pokud projekt přijímá příspěvky, přidejte zde instrukce pro přispěvatele. Jinak tuto sekci odstraňte.

[Kde se nachází logika]: `[cesta/k_souboru]`
[Další místa]: `[cesta/k_souboru]`
