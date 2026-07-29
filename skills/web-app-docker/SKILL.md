---
name: web-app-docker
description: Kontejnerizace webové aplikace — Dockerfile (non-root uživatel, healthcheck, verze buildu), Docker Compose (dev i produkční varianta, volumes, env proměnné, přístup k databázi na hostu) a volitelně OAuth2 Proxy s Redis. Použij při vytváření nebo úpravě Dockerfile, docker-compose.yml, healthchecku, env konfigurace kontejneru nebo při nasazování aplikace do Dockeru.
---

# Docker pro webovou aplikaci

Kontejnerizace se řídí ověřenými vzory z reálných projektů.

## Postup

1. Před úpravou Dockerfile nebo Compose si přečti [references/TEMPLATE_DOCKER.md](references/TEMPLATE_DOCKER.md) — obsahuje kompletní Dockerfile, varianty docker-compose.yml, přístup k hostiteli, env proměnné a OAuth2 Proxy + Redis setup.
2. CI/CD pipeline (GitHub Actions, GHCR) řeší skill `github-project-setup`.

## Klíčová pravidla

- Aplikace v kontejneru běží pod **non-root** uživatelem.
- Dockerfile obsahuje `HEALTHCHECK`; endpoint musí odpovídat skutečnému endpointu aplikace.
- Verze buildu se propisuje do aplikace (zobrazuje se v zápatí z `version.json`).
- Interní port aplikace je standardně `8000`.
- Konfigurace přes proměnné prostředí, žádné tajné údaje v image ani v compose souboru.
- Volumes přidávej jen pokud jsou výslovně potřeba (persistentní data — SQLite, uploads).
- Pro DB na hostu použij vzor přístupu k hostiteli z reference.
