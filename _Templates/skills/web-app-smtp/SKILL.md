---
name: web-app-smtp
description: Odesílání e-mailů z webové aplikace přes aiosmtplib — konfigurace SMTP v .env (STARTTLS, přímý TLS, self-signed certifikáty), odesílací funkce a Jinja2 šablony e-mailů. Použij při implementaci nebo ladění odesílání e-mailů, SMTP konfigurace, notifikačních e-mailů nebo magic link e-mailů.
---

# SMTP odesílání e-mailů

E-maily se odesílají asynchronně přes **aiosmtplib**, konfigurace je výhradně v `.env`.

## Postup

1. Před implementací si přečti [references/TEMPLATE_SMTP.md](references/TEMPLATE_SMTP.md) — obsahuje Config třídu, přehled všech parametrů, odesílací funkci (plain text + HTML) a renderování Jinja2 šablon e-mailů.
2. Typické kombinace portů: `587` = STARTTLS, `465` = přímý TLS, interní relay = bez šifrování (jen v izolované síti).

## Klíčová pravidla

- Veškerá SMTP konfigurace (host, port, TLS režim, credentials) přes proměnné prostředí — nikdy natvrdo v kódu.
- Každý e-mail má plain text i HTML variantu (HTML fallback na plain text).
- V dev módu e-maily neodesílej, jen je zaloguj.
- Chyby odesílání loguj včetně příčiny, ale neblokuj hlavní flow aplikace.
- Ignorování SSL certifikátu (`self-signed`) povol jen explicitní env proměnnou, nikdy jako default.
