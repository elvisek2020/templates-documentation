# Šablona autentizace — Magic Link & PassKey

> **Tento soubor je zdroj pravdy pro vše kolem login page a auth stránek.**
> Pokud upravuješ nebo stavíš login page, hledej zde — nemusíš otevírat nic dalšího.
>
> | Co hledáš | Kde to je |
> |---|---|
> | CSS definice auth tříd (`.auth-container`, `.auth-card`, …) | [Sekce CSS definice](#css-definice-pro-auth-stránky) v tomto souboru |
> | Vizuální popis login page prvek po prvku | [Sekce Vizuální popis](#přihlašovací-stránka--vizuální-popis) v tomto souboru |
> | Hotový HTML kód login page | [Sekce HTML](#přihlašovací-stránka--html) v tomto souboru |
> | Stránka po odeslání magic linku (`/auth/check-email`) | [Sekce Potvrzení e-mailu](#potvrzení-odeslání-e-mailu) v tomto souboru |
> | Backend routes (`/auth/login`, `/auth/verify`, …) | [Sekce Backend](#backend--auth-routes) v tomto souboru |
> | PassKey JS funkce (`passkeyLogin`, `passkeyRegister`) | [Sekce JavaScript](#javascript--passkey-funkce) v tomto souboru |
> | Správa PassKey v nastavení uživatele | [Sekce Správa PassKey](#správa-passkey-uživatelské-nastavení) v tomto souboru |
> | Standardní layout stránek (mimo auth) | [TEMPLATE_LAYOUT.md](./TEMPLATE_LAYOUT.md) |
> | Referenční CSS soubor | [reference_app.css](./reference_app.css) |

Aplikace podporuje dva způsoby přihlášení: **Magic Link** (přihlašovací odkaz e-mailem) a **PassKey** (WebAuthn — biometrie, bezpečnostní klíč, PIN zařízení).

**Závislosti:**
- CSS třídy v `app/static/css/app.css` — definice viz [sekce CSS definice](#css-definice-pro-auth-stránky) níže
- JS funkce `passkeyLogin()` a `passkeyRegister()` z `app/static/js/app.js`
- Backend: FastAPI routes v `app/portal/auth_routes.py` a `app/portal/passkey_routes.py`

---

## 📋 Obsah

1. [CSS definice pro auth stránky](#css-definice-pro-auth-stránky)
2. [Přihlašovací stránka — vizuální popis](#přihlašovací-stránka--vizuální-popis)
3. [Přihlašovací stránka — HTML](#přihlašovací-stránka--html)
4. [Potvrzení odeslání e-mailu](#potvrzení-odeslání-e-mailu)
5. [Chybová zpráva při přihlášení](#chybová-zpráva-při-přihlášení)
6. [Správa PassKey (uživatelské nastavení)](#správa-passkey-uživatelské-nastavení)
7. [Backend — Auth routes](#backend--auth-routes)
8. [Backend — PassKey routes](#backend--passkey-routes)
9. [JavaScript — PassKey funkce](#javascript--passkey-funkce)
10. [Best practices](#best-practices)

---

## CSS definice pro auth stránky

Všechny níže uvedené CSS třídy **musí být přítomny v `app/static/css/app.css`**. Jsou také součástí `reference_app.css`. Bez nich auth stránky nebudou vypadat správně.

```css
/* Auth stránky */
.auth-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
}

.auth-card {
    max-width: 400px;
    width: 100%;
}

.auth-title {
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 0.5rem;
    color: var(--color-text);
}

.auth-subtitle {
    text-align: center;
    color: var(--color-text-light);   /* #6b7280 */
    margin-bottom: 1.5rem;
    font-size: 0.9375rem;
}

/* Alert — inline chybové / informační zprávy */
.alert          { padding: 0.75rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1rem; font-size: 0.875rem; line-height: 1.5; }
.alert--error   { background: rgba(239, 68, 68, 0.1);   color: #991b1b; border: 1px solid rgba(239, 68, 68, 0.2); }
.alert--success { background: rgba(16, 185, 129, 0.1);  color: #065f46; border: 1px solid rgba(16, 185, 129, 0.2); }
.alert--info    { background: rgba(59, 130, 246, 0.1);  color: #1e40af; border: 1px solid rgba(59, 130, 246, 0.2); }
```

Ostatní potřebné třídy (`.card`, `.card-body`, `.form-group`, `.form-label`, `.input`, `.btn`, `.btn-outline`, `.btn-primary`) jsou standardní součástí `app.css` / `reference_app.css`.

---

## Přihlašovací stránka — vizuální popis

Přesný popis toho, jak stránka **musí vypadat** (na základě referenční implementace `mnd-mcp-gateway`):

### Celková kompozice

- **Pozadí stránky:** světle šedá (`#f9fafb` via `--color-bg`), celá stránka
- **Karta:** bílá, maximální šířka **400 px**, horizontálně i vertikálně vycentrovaná (min-height 60vh)
- **Karta — styl:** border-radius 12px, border 1px solid `#d1d5db`, box-shadow, padding 2rem (z třídy `.card`)
- Navigační lišta aplikace je přítomna nahoře (z `base.html`), ale je minimální / prázdná — login stránka ji neovlivňuje

### Obsah karty (shora dolů)

1. **Logo** — obrázek `/static/images/logo.png`, výška 80 px, `width: auto`, horizontálně vycentrováno, margin-bottom 1rem
2. **Subtitle** — třída `.auth-subtitle`: text „Přihlaste se pomocí e-mailu nebo passkey", vycentrovaný, šedý (`#6b7280`), margin-bottom 1.5rem
   - ⚠️ Login page **nepoužívá** `.auth-title` (nadpis `h1`) — jen subtitle
3. **Chybová zpráva** (podmíněně) — třída `.alert.alert--error`: světle červené pozadí, tmavě červený text, zobrazí se pouze pokud backend předá proměnnou `error`
4. **Label e-mailu** — třída `.form-label`, text „E-mailová adresa", **vycentrovaný** (`text-align: center; display: block;`), weight 500
5. **Email input** — třída `.input`, full-width (`width: 100%`), placeholder „vas@mnd.cz" (nebo dle domény), `type="email"`, `required`, `autofocus`
6. **Tlačítko Magic Link** — třída `.btn.btn-outline`, full-width (`style="width: 100%"`), text „Odeslat přihlašovací odkaz"
   - Styl: průhledné pozadí, border 1px solid `#d1d5db`, text `#1f2937`, border-radius 8px
7. **Oddělovač** — text „nebo", malý (`font-size: 0.875rem`), šedý (`var(--color-text-light)`), vycentrovaný, margin-top 1.5rem, margin-bottom 1rem
8. **Tlačítko PassKey** — třída `.btn.btn-primary`, full-width, flex s ikonou a textem „Přihlásit se pomocí PassKey"
   - Styl: modrý background (`#3b82f6`), bílý text, border-radius 8px, SVG ikona vlevo (20×20 px)
   - **Zobrazí se jen pokud prohlížeč podporuje WebAuthn** (`window.PublicKeyCredential`) — výchozí stav je `display: none`

### SVG ikona na PassKey tlačítku

```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 10v4"/>
  <path d="M7 15h10"/>
  <rect x="2" y="6" width="20" height="12" rx="2"/>
</svg>
```

### Zápatí stránky

Zápatí pochází z `base.html` (viz `TEMPLATE_FOOTER.md`), není součástí `login.html`.

---

## Přihlašovací stránka — HTML

Stránka `/auth/login` — kombinuje Magic Link formulář a PassKey tlačítko.

```html
{% extends "base.html" %}
{% block title %}Přihlášení — {{ app_name }}{% endblock %}

{% block content %}
<div class="auth-container">
  <div class="card auth-card">
    <div class="card-body">

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 1rem;">
        <img src="/static/images/logo.png" alt="{{ app_name }}" style="height: 80px; width: auto;">
      </div>

      <!-- Subtitle — login page nepoužívá auth-title (h1), jen subtitle -->
      <p class="auth-subtitle">Přihlaste se pomocí e-mailu nebo passkey</p>

      <!-- Chybová zpráva (zobrazí se jen pokud backend předá proměnnou error) -->
      {% if error %}
      <div class="alert alert--error">{{ error }}</div>
      {% endif %}

      <!-- Magic Link formulář -->
      <form method="post" action="/auth/login">
        <div class="form-group">
          <label for="email" class="form-label" style="text-align: center; display: block;">
            E-mailová adresa
          </label>
          <input type="email" id="email" name="email" class="input"
                 placeholder="vas@firma.cz" required autofocus>
        </div>
        <button type="submit" class="btn btn-outline" style="width: 100%;">
          Odeslat přihlašovací odkaz
        </button>
      </form>

      <!-- PassKey sekce — výchozí stav: skrytá; zobrazí se JS detekcí WebAuthn -->
      <div id="passkey-login-section" style="display: none; margin-top: 1.5rem;">
        <div style="text-align: center; margin-bottom: 1rem; color: var(--color-text-light); font-size: 0.875rem;">
          nebo
        </div>
        <button type="button" class="btn btn-primary"
                style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem;"
                onclick="passkeyLogin(document.getElementById('email').value)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 10v4"/><path d="M7 15h10"/>
            <rect x="2" y="6" width="20" height="12" rx="2"/>
          </svg>
          Přihlásit se pomocí PassKey
        </button>
      </div>

    </div>
  </div>
</div>

<script>
// Zobrazí PassKey sekci pokud prohlížeč podporuje WebAuthn.
// Rozšířená detekce: zkusí isConditionalMediationAvailable, fallback na samotný PublicKeyCredential.
if (window.PublicKeyCredential) {
    if (PublicKeyCredential.isConditionalMediationAvailable) {
        PublicKeyCredential.isConditionalMediationAvailable().then(function() {
            document.getElementById('passkey-login-section').style.display = 'block';
        });
    }
    document.getElementById('passkey-login-section').style.display = 'block';
}
</script>
{% endblock %}
```

**Poznámky k implementaci:**
- Login page **nepoužívá** `.auth-title` (žádný `<h1>`) — pouze `.auth-subtitle`
- Pole `email` slouží zároveň jako vstup pro Magic Link i jako hint pro PassKey (`passkeyLogin(email)`)
- PassKey sekce je skrytá `display: none` a zobrazí se až po ověření `window.PublicKeyCredential`
- JS detekce: primárně `isConditionalMediationAvailable`, okamžitě za tím i přímý fallback — PassKey tlačítko se zobrazí v každém podporovaném prohlížeči
- Po úspěšném přihlášení backend přesměruje na výchozí stránku (např. `/dashboard` nebo `/admin/modules`)

---

## Potvrzení odeslání e-mailu

Stránka `/auth/check-email` — zobrazí se po odeslání magic link e-mailu.

```html
{% extends "base.html" %}
{% block title %}Zkontrolujte email — {{ app_name }}{% endblock %}

{% block content %}
<div class="auth-container">
  <div class="card auth-card">
    <div class="card-body" style="text-align: center;">

      <!-- Ikona (emoji nebo SVG) -->
      <div style="font-size: 3rem; margin-bottom: 1rem;">📧</div>

      <h1 class="auth-title">Zkontrolujte email</h1>
      <p class="auth-subtitle">
        Odeslali jsme přihlašovací odkaz na <strong>{{ email }}</strong>.
      </p>
      <p class="text-muted">
        Odkaz je platný {{ expiry_minutes | default(15) }} minut.
      </p>

      <a href="/auth/login" class="btn btn-outline" style="margin-top: 1rem;">
        Zpět na přihlášení
      </a>

    </div>
  </div>
</div>
{% endblock %}
```

**Proměnné z backendu:**
- `email` — adresa, na kterou byl odkaz odeslán
- `expiry_minutes` — platnost odkazu v minutách (výchozí: 15)

---

## Chybová zpráva při přihlášení

Chyby (neplatný odkaz, expirovaný token, zakázaný účet) se zobrazují přes `alert--error` přímo na přihlašovací stránce.

```html
{% if error %}
<div class="alert alert--error">{{ error }}</div>
{% endif %}
```

Příklady chybových zpráv z backendu:
- `"Neplatný nebo expirovaný přihlašovací odkaz."`
- `"Váš účet není aktivní. Kontaktujte administrátora."`
- `"Přihlašování pomocí passkey selhalo."`

CSS třída `.alert--error` je definována v `app.css`.

---

## Správa PassKey (uživatelské nastavení)

Stránka `/dashboard/settings` — umožňuje uživateli registrovat a mazat passkeys.

```html
{% extends "base.html" %}
{% block title %}Nastavení — {{ app_name }}{% endblock %}

{% block content %}
<div class="page-header">
  <div>
    <h1 class="page-title">Nastavení</h1>
    <p class="page-subtitle">Zabezpečení a správa přihlašování.</p>
  </div>
</div>

<div class="card">
  <div class="card-header" style="display: flex; align-items: center; justify-content: space-between;">
    <h2 class="card-title">PassKey</h2>
    <!-- Tlačítko se zobrazí jen pokud prohlížeč podporuje WebAuthn -->
    <button type="button" class="btn btn-primary"
            id="passkey-register-btn"
            style="display: none;"
            onclick="passkeyRegister()">
      Zaregistrovat nový passkey
    </button>
  </div>
  <div class="card-body" id="passkey-list">
    {% include "dashboard/partials/passkey_list.html" %}
  </div>
</div>

<script>
if (window.PublicKeyCredential) {
    document.getElementById('passkey-register-btn').style.display = '';
}
</script>
{% endblock %}
```

### Partial: seznam passkeys

Soubor `dashboard/partials/passkey_list.html` — vrací HTMX target `#passkey-list` po smazání:

```html
{% if passkeys %}
<div class="table-wrap">
  <table class="table">
    <thead>
      <tr>
        <th>Zařízení</th>
        <th>Vytvořeno</th>
        <th style="text-align: right;">Akce</th>
      </tr>
    </thead>
    <tbody>
      {% for pk in passkeys %}
      <tr>
        <td class="font-medium">{{ pk.device_name }}</td>
        <td class="text-muted">{{ pk.created_at | fmt_dt }}</td>
        <td style="text-align: right;">
          <button class="btn btn-danger btn-sm"
                  hx-delete="/dashboard/settings/passkeys/{{ pk.id }}"
                  hx-target="#passkey-list"
                  hx-swap="innerHTML"
                  hx-confirm="Opravdu smazat tento passkey?">
            Smazat
          </button>
        </td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>
{% else %}
<p class="text-muted">
  Žádné registrované passkeys.
  Klikněte na „Zaregistrovat nový passkey" pro přidání.
</p>
{% endif %}
```

**Jak to funguje:**
- Po kliknutí Smazat HTMX odešle `DELETE` na backend
- Backend smaže passkey a vrátí aktualizovaný partial
- HTMX nahradí `#passkey-list` novým obsahem

---

## Backend — Auth routes

Soubor `app/portal/auth_routes.py`, prefix `/auth`:

| Metoda | Endpoint | Popis |
|--------|----------|-------|
| `GET` | `/auth/login` | Zobrazení přihlašovací stránky |
| `POST` | `/auth/login` | Odeslání magic link e-mailu |
| `GET` | `/auth/verify` | Ověření magic link tokenu z URL (`?token=...`) |
| `POST` | `/auth/logout` | Odhlášení (zrušení session cookie) |

**Příklad handleru pro magic link:**

```python
@router.post("/login")
async def login_post(
    request: Request,
    email: str = Form(...),
    db: AsyncSession = Depends(get_db),
):
    # Ověření e-mailu, vytvoření MagicLink záznamu, odeslání e-mailu
    # Přesměrování na /auth/check-email?email=...
    ...

@router.get("/verify")
async def verify_token(
    request: Request,
    token: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    # Ověření tokenu, nastavení session cookie, přesměrování
    ...
```

**Session cookie** se nastavuje přes `request.session["user_id"] = user.id` (middleware `SessionMiddleware` s `SESSION_SECRET`).

---

## Backend — PassKey routes

Soubor `app/portal/passkey_routes.py`, prefix `/auth/passkey`:

| Metoda | Endpoint | Popis |
|--------|----------|-------|
| `POST` | `/auth/passkey/register-options` | Generuje WebAuthn registration options |
| `POST` | `/auth/passkey/register` | Dokončí registraci passkey (uloží credential) |
| `GET` | `/auth/passkey/user-has-passkey` | Vrací `{"has_passkey": bool}` |
| `POST` | `/auth/passkey/login-options` | Generuje WebAuthn authentication options |
| `POST` | `/auth/passkey/login` | Ověří passkey a přihlásí uživatele |

**Knihovna:** `webauthn` (py_webauthn) — instalace `pip install webauthn`.

**Konfigurace v .env:**
```
WEBAUTHN_RP_ID=firma.cz           # doména bez protokolu
WEBAUTHN_RP_NAME=Název Aplikace   # zobrazovaný název
```

**Mazání passkey:**

```python
# V dashboard_routes.py nebo passkey_routes.py
@router.delete("/dashboard/settings/passkeys/{passkey_id}")
async def delete_passkey(
    passkey_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    user = await get_current_user(request, db)
    # Ověřit vlastnictví, smazat, vrátit partial
    ...
```

---

## JavaScript — PassKey funkce

Funkce jsou definované v `app/static/js/app.js` a automaticky dostupné na všech stránkách.

### `passkeyLogin(email)`

Spustí WebAuthn authentication flow. Volá se z přihlašovací stránky.

```javascript
async function passkeyLogin(email) {
    // 1. Získá authentication options z /auth/passkey/login-options
    // 2. Zavolá navigator.credentials.get(options)
    // 3. Odešle výsledek na /auth/passkey/login
    // 4. Při úspěchu přesměruje (backend vrátí redirect)
    // 5. Při chybě zobrazí showNotification('Chyba', 'error')
}
```

### `passkeyRegister()`

Spustí WebAuthn registration flow. Volá se ze stránky nastavení.

```javascript
async function passkeyRegister() {
    // 1. Získá registration options z /auth/passkey/register-options
    // 2. Zavolá navigator.credentials.create(options)
    // 3. Odešle výsledek na /auth/passkey/register
    // 4. HTMX aktualizuje seznam passkeys (#passkey-list)
    // 5. Zobrazí showNotification('PassKey zaregistrován', 'success')
}
```

**Detekce podpory WebAuthn:**

```javascript
if (window.PublicKeyCredential) {
    // Prohlížeč podporuje WebAuthn — zobrazit PassKey tlačítko
    document.getElementById('passkey-section').style.display = 'block';
}
```

---

## Best practices

1. **Oddělené layouty** — Auth stránky rozšiřují `base.html`, ale nepoužívají `.page-header` ani standardní obsah; centrovat přes `.auth-container`.
2. **E-mail jako sdílené pole** — Jedno `<input id="email">` slouží oběma metodám (Magic Link i PassKey hint); neduplicovat vstupy.
3. **Podmíněné zobrazení PassKey** — Vždy ověřit `window.PublicKeyCredential` před zobrazením PassKey sekce; některé prohlížeče nebo kontexty (HTTP, embedded) WebAuthn nepodporují.
4. **Chyby na přihlašovací stránce** — Chybové zprávy zobrazovat přímo na `/auth/login` přes `{% if error %}`, ne jako samostatnou stránku.
5. **Platnost magic linku** — Výchozí platnost 15 minut; hodnotu načítat z konfigurace (`MAGIC_LINK_EXPIRY_MINUTES`), ne hardcoded.
6. **HTTPS** — WebAuthn funguje pouze na HTTPS (nebo `localhost`). Na HTTP passkey tlačítko nebude fungovat.
7. **Jedno tlačítko pro registraci** — Tlačítko "Zaregistrovat nový passkey" skrýt přes `display: none` a zobrazit až po ověření podpory WebAuthn; uživatelé bez podpory tlačítko neuvidí.
8. **Správa passkeys** — Uživatel může mít více passkeys (různá zařízení); každý je identifikován `device_name` a datem vytvoření; mazání s potvrzením `hx-confirm`.
