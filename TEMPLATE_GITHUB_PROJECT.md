# Template: Práce s GitHubem v Cursoru (Docker Compose)

Tento dokument je **rozšířená šablona zadání pro Cursor** pro běžný provoz:
**GitHub → GHCR → Docker Compose → Production**.

Používej ji jako **copy-paste zadání do Cursoru**. Hodnoty v `{}` nahraď podle projektu.

---

## 0) Kontext

Projekt: `{PROJECT_NAME}`  
GitHub repo: `{GITHUB_OWNER}/{GITHUB_REPO}`  
Default branch: `{BRANCH=main}`  
Tech stack: `{STACK=python/docker/js/…}`  

Registry: `{REGISTRY=ghcr.io}`  
Image name: `{IMAGE_NAME}`  
Image visibility: `{PUBLIC/PRIVATE}`  

Cíl nasazení: **Docker Compose**  
Nasazení za reverse proxy (NPM/Traefik/Caddy): `{YES/NO}`  

---

## 1) Úkoly pro Cursor

### A) Git inicializace + práce s repozitářem
- Inicializuj git repo, pokud ještě neexistuje.
- Připrav `.gitignore` odpovídající `{STACK}`.
- Nastav branch `{BRANCH}`.
- Nastav remote (SSH nebo HTTPS podle preferencí):
  ```bash
  # SSH (doporučeno):
  git remote add origin git@github.com:{GITHUB_OWNER}/{GITHUB_REPO}.git
  
  # Nebo HTTPS:
  git remote add origin https://github.com/{GITHUB_OWNER}/{GITHUB_REPO}.git
  ```
- Neprováděj žádné změny aplikační logiky.

---

### B) GitHub Actions – standardní workflow (GHCR + multi-arch)

Vytvoř nebo zkontroluj:
```
.github/workflows/docker.yml
```

Workflow **musí**:
- běžet při `push` do `{BRANCH}`
- podporovat **multi-arch build**:
  - `linux/amd64`
  - `linux/arm64`
- používat:
  - `docker/setup-buildx-action`
  - `docker/build-push-action`
- provést login do GHCR pomocí `GITHUB_TOKEN`
- obsahovat permissions:
  ```yaml
  permissions:
    contents: read
    packages: write
  ```
- tagovat image:
  - `latest`
  - `sha-${{ github.sha }}`
- **volitelně** umožnit ruční spuštění:
  ```yaml
  workflow_dispatch:
  ```

Image name:
```text
{REGISTRY}/{GITHUB_OWNER}/{IMAGE_NAME}
```

---

### C) Docker Compose (runtime – POVINNÉ STANDARDY)

Uprav nebo vytvoř `docker-compose.yml` tak, aby splňoval **povinné položky**:

```yaml
services:
  app:
    image: {REGISTRY}/{GITHUB_OWNER}/{IMAGE_NAME}:latest
    container_name: {CONTAINER_NAME}
    hostname: {HOSTNAME}
    restart: unless-stopped
    ports:
      - "{PUBLIC_PORT}:8000"
    healthcheck:
      # Upravte endpoint podle vaší aplikace (např. /health, /api/health, /)
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
      # Poznámka: Pokud image neobsahuje curl, použijte jiný test (např. wget nebo vlastní healthcheck script)
```
```

Pokud je aplikace nasazena **za reverse proxy** (NPM/Traefik/Caddy), přidej do service:

```yaml
services:
  app:
    # ... ostatní konfigurace ...
    networks:
      - proxy_network

networks:
  proxy_network:
    external: true
```

❗ Nepoužívej `build:` – vždy `image:`  
❗ Nepřidávej `volumes`, pokud to není výslovně vyžadováno

---

### D) README – Deployment & provoz

Do `README.md` doplň nebo zkontroluj sekci **Deployment**:

Musí obsahovat:
- nasazení pomocí **Docker Compose**
- použití `docker-compose.yml`
- spuštění:
  ```bash
  docker compose up -d
  ```
- update:
  ```bash
  docker compose pull
  docker compose up -d
  ```
- rollback na konkrétní verzi:
  V `docker-compose.yml` změňte image tag:
  ```yaml
  services:
    app:
      image: {REGISTRY}/{GITHUB_OWNER}/{IMAGE_NAME}:sha-<commit-sha>
  ```
  Poté spusťte:
  ```bash
  docker compose up -d
  ```

Pokud je image **PRIVATE**, přidej poznámku:
- nutnost autentizace vůči GHCR
- použití PAT (Personal Access Token) nebo Docker login:
  ```bash
  echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
  ```

---

## 2) .gitignore – POVINNÉ DOPLNĚNÍ

Do `.gitignore` **musí být přidáno**:

```gitignore
# Lokální pomocné adresáře – nikdy necommitovat
_backup/
_docs/
```

Tyto adresáře slouží pouze pro:
- lokální zálohy
- pracovní poznámky
- dočasné exporty

Nikdy **nesmí skončit v repozitáři**.

---

## 3) Decision needed (VYŽÁDEJ SI PŘED ZMĚNAMI)

Pokud nejsou tyto body jasně definované, **zastav se a vyžádej rozhodnutí**:

- Je GitHub repo **public / private**?
- Je Docker image **public / private**?
- Jaký port má být publikovaný navenek?
  - typicky `8080:8000`
- Potřebujeme persistentní data?
  - volume (SQLite / uploads) **ANO / NE**
- Bude aplikace nasazena za reverse proxy (NPM/Traefik/Caddy)?
  - `proxy_network` **ANO / NE**
- Interní port aplikace:
  - standardně `8000`

---

## 4) Povinné kontroly

Před dokončením zkontroluj:
- ✅ workflow obsahuje GHCR login + buildx
- ✅ image name je konzistentní:
  - workflow
  - docker-compose.yml
  - README.md
- ✅ porty sedí mezi:
  - aplikací (interní port)
  - docker-compose.yml (mapování portů)
  - dokumentací (README.md)
- ✅ healthcheck endpoint odpovídá skutečnému endpointu aplikace
- ✅ nebyla změněna aplikační logika
- ✅ .gitignore obsahuje `_backup/` a `_docs/`

---

## 5) Výstup, který má Cursor dodat

Na konci vždy:
1. Seznam přidaných / upravených souborů
2. Co má uživatel udělat po `git push`
3. Co se stane automaticky (CI/CD)
4. Seznam otevřených „decision needed“

---

## 6) Poznámky

- Cursor **nevytváří Docker image** – pouze připraví konfiguraci.
- Image se reálně vytvoří až po `git push` na GitHub.
- Tato šablona je určena pro **opakované použití napříč projekty**.
- Po prvním buildu je potřeba nastavit viditelnost image v GitHub Packages na **Public** (pokud má být veřejná).
- Pro private images je nutné nastavit autentizaci vůči GHCR před pull (viz sekce D).
- Docker Compose lze použít na jakémkoli systému podporujícím Docker (Linux, macOS, Windows, Synology, atd.).
