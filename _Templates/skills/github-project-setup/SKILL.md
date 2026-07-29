---
name: github-project-setup
description: Nastavení GitHub projektu s CI/CD — git inicializace, GitHub Actions workflow pro multi-arch Docker build a push do GHCR, produkční docker-compose.yml a deployment sekce v README. Použij při zakládání repozitáře, nastavování CI/CD pipeline, GitHub Actions, workflow, GHCR, tagování images nebo přípravě nasazení přes Docker Compose.
---

# GitHub projekt s CI/CD (GHCR + Docker Compose)

Standardní pipeline: **GitHub → GHCR → Docker Compose → Production**. Hodnoty v `{}` nahraď podle projektu (`{PROJECT_NAME}`, `{GITHUB_OWNER}`, `{GITHUB_REPO}`, `{BRANCH}` obvykle `main`, `{REGISTRY}` obvykle `ghcr.io`, `{IMAGE_NAME}`).

## Než začneš — vyžádej si rozhodnutí

Pokud nejsou tyto body jasné, zastav se a zeptej se:

- GitHub repo public / private? Docker image public / private?
- Publikovaný port navenek (typicky `8080:8000`; interní port standardně `8000`)?
- Persistentní data — volume (SQLite / uploads) ano / ne?
- Nasazení za reverse proxy (NPM/Traefik/Caddy) — `proxy_network` ano / ne?

## A) Git inicializace

- Inicializuj git repo, pokud neexistuje; připrav `.gitignore` podle stacku; nastav branch.
- Remote: `git remote add origin git@github.com:{GITHUB_OWNER}/{GITHUB_REPO}.git` (SSH doporučeno, HTTPS alternativa).
- Do `.gitignore` **povinně** přidej lokální pomocné adresáře:

```gitignore
# Lokální pomocné adresáře – nikdy necommitovat
_backup/
_docs/
```

- Neměň aplikační logiku.

## B) GitHub Actions workflow

Vytvoř `.github/workflows/docker.yml`. Požadavky: push do `{BRANCH}` + `workflow_dispatch`, multi-arch build (`linux/amd64`, `linux/arm64`), login do GHCR přes `GITHUB_TOKEN`, tagy `latest` (jen default branch) a `sha-<commit>`, Actions na majorech s Node.js 24 runtime.

```yaml
name: Build and Push Docker Image

on:
  push:
    branches:
      - {BRANCH}
  workflow_dispatch:

permissions:
  contents: read
  packages: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v7

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v4

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v4
        with:
          registry: {REGISTRY}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v6
        with:
          images: {REGISTRY}/{GITHUB_OWNER}/{IMAGE_NAME}
          tags: |
            type=ref,event=branch
            type=sha,prefix=sha-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v7
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            BUILDKIT_INLINE_CACHE=1
```

Minimální majory Actions (Node 24, bez deprecation warningu): `actions/checkout@v7`, `docker/setup-buildx-action@v4`, `docker/login-action@v4`, `docker/metadata-action@v6`, `docker/build-push-action@v7`. Nepoužívej starší verze.

## C) Docker Compose (povinné standardy)

```yaml
services:
  app:
    # Pro vývoj použijte build:
    build:
      context: .
      dockerfile: Dockerfile
    # Pro produkci použijte image z GHCR:
    # image: {REGISTRY}/{GITHUB_OWNER}/{IMAGE_NAME}:latest
    container_name: {CONTAINER_NAME}
    hostname: {HOSTNAME}
    restart: unless-stopped
    ports:
      - "{PUBLIC_PORT}:8000"
    healthcheck:
      # Endpoint upravte podle aplikace (např. /health, /api/health, /)
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
```

- Pokud image neobsahuje `curl`, použij jiný healthcheck test (wget nebo vlastní script).
- Nepřidávej `volumes`, pokud nejsou výslovně vyžadovány.
- Za reverse proxy přidej:

```yaml
services:
  app:
    networks:
      - proxy_network

networks:
  proxy_network:
    external: true
```

## D) README — sekce Deployment

Doplň do `README.md`:

- **Vývoj (lokální build)**: aktivní `build` sekce; `docker compose up -d`, rebuild `docker compose up -d --build`.
- **Produkce (image z GHCR)**: zakomentovat `build`, odkomentovat `image`; spuštění `docker compose up -d`, update `docker compose pull && docker compose up -d`.
- **Private image**: poznámka o autentizaci vůči GHCR:

```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
```

## Povinné kontroly před dokončením

- [ ] Workflow obsahuje GHCR login + buildx
- [ ] Actions majory Node-24-kompatibilní (checkout@v7, setup-buildx@v4, login@v4, metadata@v6, build-push@v7)
- [ ] Image name konzistentní napříč workflow, docker-compose.yml a README.md
- [ ] Porty sedí mezi aplikací, compose mapováním a dokumentací
- [ ] Healthcheck endpoint odpovídá skutečnému endpointu aplikace
- [ ] Aplikační logika nezměněna
- [ ] `.gitignore` obsahuje `_backup/` a `_docs/`

## Výstup na konci

1. Seznam přidaných / upravených souborů
2. Co má uživatel udělat po `git push`
3. Co se stane automaticky (CI/CD)
4. Seznam otevřených „decision needed"

## Poznámky

- Image se reálně vytvoří až po `git push` — lokálně se jen připravuje konfigurace.
- Po prvním buildu nastav viditelnost image v GitHub Packages na Public (pokud má být veřejná).
