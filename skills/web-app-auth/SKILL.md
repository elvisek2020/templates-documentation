---
name: web-app-auth
description: Autentizace ve webových aplikacích — Magic Link přihlášení e-mailem a PassKey/WebAuthn, včetně auth layoutu a správy přihlašovacích klíčů. Použij při implementaci nebo úpravě přihlášení, loginu, registrace, magic linku, passkeys, WebAuthn nebo správy přihlašovacích metod uživatele.
---

# Autentizace webové aplikace

Standardní přihlašování má dvě metody: **Magic Link** (e-mail s jednorázovým tokenem) a **PassKey/WebAuthn**. Obě sdílejí jedno e-mailové pole na přihlašovací stránce.

## Postup

1. Před implementací si přečti [references/TEMPLATE_AUTH.md](references/TEMPLATE_AUTH.md) — obsahuje kompletní flow, backend routes, JS funkce (`passkeyLogin`, `passkeyRegister`) a HTML struktury.
2. Přihlašovací stránky používají auth layout: centrovaná karta bez navigace (`.auth-container`, `.auth-card`).
3. Odesílání magic link e-mailů řeší skill `web-app-smtp`.

## Klíčová pravidla

- Magic Link flow: formulář → odeslání e-mailu s tokenem → ověření tokenu → session.
- Tokeny jsou jednorázové a časově omezené.
- WebAuthn funguje jen přes HTTPS — v kódu detekuj dostupnost WebAuthn API a bez ní PassKey UI skryj.
- Správa passkeys (registrace, přejmenování, smazání) patří na stránku nastavení uživatele.
- Validuj vstupy na klientovi i serveru; chyby loguj, ale uživateli vracej obecné hlášky (žádné prozrazování existence účtu).
- Žádné tajné údaje natvrdo — konfigurace přes proměnné prostředí.
