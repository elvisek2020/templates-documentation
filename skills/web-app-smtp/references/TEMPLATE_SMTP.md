# SMTP – odesílání e-mailů

Tento dokument popisuje standardní konfiguraci pro odesílání e-mailů přes SMTP pomocí knihovny `aiosmtplib`. Pokrývá přímý TLS (port 465), STARTTLS (port 587) a interní servery s vlastním certifikátem.

**Závislost:** `aiosmtplib` – přidat do `requirements.txt`.

---

## 📋 Obsah

1. [Konfigurace v .env](#konfigurace-v-env)
2. [Config třída](#config-třída)
3. [Odesílání e-mailu](#odesílání-e-mailu)
4. [Přehled parametrů aiosmtplib](#přehled-parametrů-aiosmtplib)
5. [Best practices](#best-practices)

---

## Konfigurace v .env

```env
# === SMTP ===
SMTP_HOST=smtp.example.com      # hostname nebo IP SMTP serveru
SMTP_PORT=587                   # 587 = STARTTLS, 465 = přímý TLS, 25 = nešifrovaný
SMTP_USER=uzivatel@example.com
SMTP_PASSWORD=heslo
SMTP_FROM_EMAIL=noreply@example.com
SMTP_FROM_NAME=Název Aplikace
SMTP_USE_TLS=false              # true = přímý TLS (port 465), false = bez přímého TLS
SMTP_STARTTLS=true              # true = STARTTLS (port 587), false = bez STARTTLS
SMTP_VERIFY_CERTS=true          # false = ignorovat SSL certifikát (interní servery, self-signed)
```

**Typické kombinace:**

| Scénář | PORT | USE_TLS | STARTTLS | VERIFY_CERTS |
|--------|------|---------|----------|--------------|
| Firemní SMTP na portu 587 (STARTTLS) | 587 | false | true | true |
| Firemní SMTP s IP adresou / self-signed cert | 587 | false | true | **false** |
| Gmail / O365 / SendGrid | 587 | false | true | true |
| SMTPS (přímý TLS) | 465 | **true** | false | true |
| Nešifrovaný interní relay | 25 | false | false | false |

---

## Config třída

```python
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SMTP_HOST: str  = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int  = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str  = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "")
    SMTP_FROM_NAME: str  = os.getenv("SMTP_FROM_NAME", "Aplikace")
    SMTP_USE_TLS: bool      = os.getenv("SMTP_USE_TLS", "false").lower() == "true"
    SMTP_STARTTLS: bool     = os.getenv("SMTP_STARTTLS", "true").lower() == "true"
    SMTP_VERIFY_CERTS: bool = os.getenv("SMTP_VERIFY_CERTS", "true").lower() == "true"

config = Config()
```

---

## Odesílání e-mailu

### Základní funkce

```python
import aiosmtplib
from email.message import EmailMessage
from config import config


async def send_email(to: str, subject: str, body_text: str, body_html: str = None):
    """
    Odešle e-mail přes SMTP.
    Pokud SMTP_HOST není nastaven, vypíše zprávu do logu (dev mode).
    """
    if not config.SMTP_HOST:
        print(f"[SMTP] Would send to {to}: {subject}")
        return

    msg = EmailMessage()
    msg["From"]    = f"{config.SMTP_FROM_NAME} <{config.SMTP_FROM_EMAIL}>"
    msg["To"]      = to
    msg["Subject"] = subject
    msg.set_content(body_text)

    if body_html:
        msg.add_alternative(body_html, subtype="html")

    try:
        await aiosmtplib.send(
            msg,
            hostname=config.SMTP_HOST,
            port=config.SMTP_PORT,
            username=config.SMTP_USER,
            password=config.SMTP_PASSWORD,
            use_tls=config.SMTP_USE_TLS,
            start_tls=config.SMTP_STARTTLS,
            validate_certs=config.SMTP_VERIFY_CERTS,
        )
    except Exception as e:
        print(f"[SMTP] Error sending to {to}: {e}")
        raise
```

### Jinja2 HTML šablona e-mailu

```python
from jinja2 import Environment, FileSystemLoader

_jinja_env = Environment(loader=FileSystemLoader("templates"))


def render_email_template(template_name: str, **context) -> str:
    """Renderuje Jinja2 šablonu e-mailu do HTML stringu."""
    tmpl = _jinja_env.get_template(f"email/{template_name}")
    return tmpl.render(**context)


async def send_email_from_template(to: str, subject: str, template: str, **ctx):
    body_html = render_email_template(template, **ctx)
    # Textový fallback — jednoduchý strip HTML tagů nebo vlastní text
    body_text = subject
    await send_email(to, subject, body_text, body_html)
```

**Použití:**
```python
await send_email_from_template(
    to="user@firma.cz",
    subject="Přihlašovací odkaz",
    template="magic_link.html",
    link="https://app.firma.cz/auth/verify?token=...",
    expiry_minutes=15,
)
```

---

## Přehled parametrů aiosmtplib

| Parametr | Typ | Popis |
|----------|-----|-------|
| `hostname` | `str` | Hostname nebo IP SMTP serveru |
| `port` | `int` | Port (587, 465, 25) |
| `username` | `str` | Přihlašovací jméno |
| `password` | `str` | Heslo |
| `use_tls` | `bool` | `True` = přímý TLS od začátku (SMTPS, port 465) |
| `start_tls` | `bool` | `True` = STARTTLS po připojení (port 587) |
| `validate_certs` | `bool` | `False` = ignorovat chyby SSL certifikátu (self-signed, IP) |
| `timeout` | `int` | Timeout v sekundách (výchozí: 60) |

> ⚠️ `use_tls` a `start_tls` nelze nastavit na `True` zároveň.

---

## Best practices

1. **Nikdy necommitujte hesla** — vždy přes `.env` a proměnné prostředí.
2. **Dev mode** — pokud `SMTP_HOST` není nastaven, logujte zprávu místo chyby; link nebo obsah vypište do stdout.
3. **`validate_certs=False` pouze na interních serverech** — pro produkci s veřejným SMTP nechte `true`.
4. **HTML + textový fallback** — vždy posílejte obojí (`set_content` + `add_alternative`); čtečky bez HTML zobrazí plain text.
5. **Jinja2 šablony e-mailů** — ukládejte do `app/templates/email/`; base šablona s inline CSS (e-mailové klienty ignorují `<style>`).
6. **Chyby logujte, nevracejte uživateli detail** — SMTP chyba nesmí odhalit konfiguraci; zobrazte generickou hlášku.
