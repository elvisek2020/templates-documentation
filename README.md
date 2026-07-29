# Design systém webových aplikací — Agent Skills

Kolekce agent skills, které drží konzistentní vzhled, architekturu a provozní vzory napříč projekty: FastAPI + Jinja2 + HTMX + app.css, autentizace, SMTP a CI/CD přes GHCR. Po instalaci do Cursoru nebo Claude Code se skill aktivuje podle kontextu práce — nemusíte šablony ručně přikládat do promptu.

## Struktura

```
.
├── README.md
└── skills/
    ├── web-app-ui/
    ├── web-app-stack/
    ├── web-app-auth/
    ├── web-app-smtp/
    ├── web-app-docker/
    └── github-project-setup/
```

| Skill | Oblast |
|-------|--------|
| `web-app-ui` | Stránky, komponenty, menu, footer, styly z app.css |
| `web-app-stack` | Technologický stack a architektura (FastAPI, HTMX, SQLite, moduly) |
| `web-app-auth` | Přihlášení — Magic Link + PassKey/WebAuthn |
| `web-app-smtp` | Odesílání e-mailů (aiosmtplib, TLS/STARTTLS) |
| `web-app-docker` | Dockerfile a Docker Compose aplikace |
| `github-project-setup` | Git init, GitHub Actions, GHCR, deployment |

## Instalace

Nejdřív si nastavte cílovou složku podle editoru a base URL:

```bash
# Claude Code:
DEST=~/.claude/skills

# Cursor:
DEST=~/.cursor/skills

# Společné pro curl instalaci jednotlivých skills:
BASE=https://raw.githubusercontent.com/elvisek2020/templates-documentation/main/skills
```

**Poznámky:**

- Složka `~/.cursor/skills` zatím nemusí existovat — příkazy ji vytvoří. Nepleťte si ji s `~/.cursor/skills-cursor`, kde má Cursor vlastní vestavěné skilly a při aktualizaci je přepisuje.
- Cursor čte i `~/.claude/skills`, takže kdo má oba editory, vystačí si s jednou instalací do `~/.claude/skills`.
- Claude Code po instalaci restartujte — skilly se načítají při startu.

### Všechny skills najednou (doporučeno)

```bash
git clone --depth 1 https://github.com/elvisek2020/templates-documentation.git /tmp/templates-skills
mkdir -p "$DEST"
cp -R /tmp/templates-skills/skills/. "$DEST/"
rm -rf /tmp/templates-skills
```

### Jednotlivé skills přes curl

**web-app-ui** (stránky, komponenty, menu, footer, styly):

```bash
mkdir -p "$DEST/web-app-ui/references"
curl -fsSL "$BASE/web-app-ui/SKILL.md" -o "$DEST/web-app-ui/SKILL.md"
for f in TEMPLATE_LAYOUT.md TEMPLATE_COMPONENTS.md TEMPLATE_MENU.md TEMPLATE_FOOTER.md reference_app.css; do
  curl -fsSL "$BASE/web-app-ui/references/$f" -o "$DEST/web-app-ui/references/$f"
done
```

**web-app-stack** (technologický stack a architektura):

```bash
mkdir -p "$DEST/web-app-stack/references"
curl -fsSL "$BASE/web-app-stack/SKILL.md" -o "$DEST/web-app-stack/SKILL.md"
curl -fsSL "$BASE/web-app-stack/references/TEMPLATE_TECHNOLOGY.md" -o "$DEST/web-app-stack/references/TEMPLATE_TECHNOLOGY.md"
```

**web-app-auth** (Magic Link + PassKey/WebAuthn):

```bash
mkdir -p "$DEST/web-app-auth/references"
curl -fsSL "$BASE/web-app-auth/SKILL.md" -o "$DEST/web-app-auth/SKILL.md"
curl -fsSL "$BASE/web-app-auth/references/TEMPLATE_AUTH.md" -o "$DEST/web-app-auth/references/TEMPLATE_AUTH.md"
```

**web-app-smtp** (odesílání e-mailů):

```bash
mkdir -p "$DEST/web-app-smtp/references"
curl -fsSL "$BASE/web-app-smtp/SKILL.md" -o "$DEST/web-app-smtp/SKILL.md"
curl -fsSL "$BASE/web-app-smtp/references/TEMPLATE_SMTP.md" -o "$DEST/web-app-smtp/references/TEMPLATE_SMTP.md"
```

**web-app-docker** (Dockerfile, Docker Compose):

```bash
mkdir -p "$DEST/web-app-docker/references"
curl -fsSL "$BASE/web-app-docker/SKILL.md" -o "$DEST/web-app-docker/SKILL.md"
curl -fsSL "$BASE/web-app-docker/references/TEMPLATE_DOCKER.md" -o "$DEST/web-app-docker/references/TEMPLATE_DOCKER.md"
```

**github-project-setup** (GitHub Actions, GHCR, deployment):

```bash
mkdir -p "$DEST/github-project-setup"
curl -fsSL "$BASE/github-project-setup/SKILL.md" -o "$DEST/github-project-setup/SKILL.md"
```

## Použití

Po instalaci stačí v Cursoru nebo Claude Code pracovat normálně — agent si skill načte podle úkolu:

- úprava stránky / komponenty / stylů → `web-app-ui`
- nový modul, architektura, stack → `web-app-stack`
- přihlášení, magic link, passkey → `web-app-auth`
- SMTP / e-maily → `web-app-smtp`
- Dockerfile / Compose → `web-app-docker`
- GitHub Actions / GHCR / CI/CD → `github-project-setup`

## Poznámky

- Skills jsou self-contained: detailní šablony jsou uvnitř `skills/*/references/`.
- Původní markdown šablony jsou lokálně v `_backup/` (ignorováno gitem, nesdílí se).
