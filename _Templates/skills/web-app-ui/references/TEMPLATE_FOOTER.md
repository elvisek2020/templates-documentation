# Šablona zápatí – Zápatí stránky

Tento dokument popisuje strukturu zápatí (footer) podle aktuálního designu aplikace. Zápatí je součástí `base.html`; styly jsou v lokálním CSS (app.css) nebo inline dle potřeby.

## 📋 Obsah

1. [Umístění a účel](#umístění-a-účel)
2. [Aktuální struktura](#aktuální-struktura)
3. [Verze aplikace](#verze-aplikace)
4. [Rozšíření přes blok](#rozšíření-přes-blok)
5. [Varianty a doplňky](#varianty-a-doplňky)
6. [Best practices](#best-practices)

---

## Umístění a účel

Zápatí se zobrazuje **jednou** v základní šabloně (`base.html`), pod hlavním obsahem (`<main>`).

| Vlastnost   | Popis |
|------------|--------|
| **Umístění** | Na konci stránky, pod `<main>`, před uzavíracím `</body>` |
| **Účel**     | Název aplikace, verze (z `version.json`), volitelně odkazy |
| **Viditelnost** | Na všech stránkách dědících od `base.html` |

Jednotlivé stránky zápatí nemusí definovat; rozšíření jen tam, kde je potřeba vlastní obsah (blok `footer`).

---

## Aktuální struktura

Zápatí má **ohraničení shora**, **středový text**, **menší písmo** a **barvu textu** z designu (např. `var(--color-text-light)` z app.css).

```html
<footer class="footer" style="margin-top: 0; padding: 0.25rem 0; border-top: 1px solid var(--color-border); text-align: center; color: var(--color-text-light); font-size: 0.875rem;">
    <div class="container">
        <p style="margin: 0;">{{ app_name }}{% if app_version %} • Verze {{ app_version }}{% endif %}</p>
        {% block footer %}{% endblock %}
    </div>
</footer>
```

**Poznámka:** Třída `.footer` a `.container` by měly být definované v hlavním CSS (app.css) tak, aby zápatí mělo konzistentní vzhled a šířku shodnou s `<main>`. Alternativně lze použít inline styly jako v příkladu.

Název aplikace předávejte z backendu (např. `app_name`). Verze se zobrazí pouze pokud backend předá `app_version`.

---

## Verze aplikace

Verze se načítá z **souboru `app/static/version.json`** a backend ji předá do šablon jako `app_version`.

**Formát version.json:**

```json
{
  "version": "20260207.2010"
}
```

**Backend (příklad – FastAPI):** Při startu aplikace načíst `version.json` (např. z `STATIC_DIR / "version.json"`), přečíst pole `version` a nastavit globální proměnnou šablon:

```python
# Načtení verze ze souboru (s fallbackem)
def _load_version() -> str:
    try:
        if VERSION_JSON.exists():
            data = json.loads(VERSION_JSON.read_text(encoding="utf-8"))
            return data.get("version", "0.1.0")
    except (json.JSONDecodeError, OSError):
        pass
    return "0.1.0"

APP_VERSION = _load_version()
templates.env.globals["app_version"] = APP_VERSION
```

V šabloně pak stačí `{% if app_version %} • Verze {{ app_version }}{% endif %}`. Verzi **nepište natvrdo** do HTML; vždy z backendu (z `version.json` nebo ekvivalentu).

**Docker/build:** Při sestavování image lze `version.json` vygenerovat (např. z data buildu) nebo ponechat v repozitáři a měnit ručně. Viz [TEMPLATE_DOCKER.md](./TEMPLATE_DOCKER.md).

---

## Rozšíření přes blok

Pro stránkově specifický obsah v zápatí slouží blok `{% block footer %}` uvnitř `<footer>`.

V `base.html`:

```html
<footer class="footer" style="…">
    <div class="container">
        <p style="margin: 0;">{{ app_name }}{% if app_version %} • Verze {{ app_version }}{% endif %}</p>
        {% block footer %}{% endblock %}
    </div>
</footer>
```

V konkrétní stránce:

```html
{% extends "base.html" %}
{% block content %}...{% endblock %}
{% block footer %}
<p style="margin-top: 0.5rem; font-size: 0.75rem;">
    <a href="/moje-stranka/dokumentace" style="color: inherit; text-decoration: underline;">Dokumentace</a>
</p>
{% endblock %}
```

Používejte jen tam, kde je opravdu potřeba dodatečný obsah v zápatí; jinak stačí jednotné zápatí v `base.html`.

---

## Varianty a doplňky

### Zápatí s odkazem (např. changelog)

Pro administrátory lze verzi zobrazit jako odkaz:

```html
<p style="margin: 0;">
    {{ app_name }} •
    {% if user and user.role.value == 'admin' %}
    <a href="/changelog" style="color: inherit; text-decoration: underline;">Verze {{ app_version }}</a>
    {% else %}
    Verze {{ app_version }}
    {% endif %}
</p>
```

Odkazy v zápatí nechte decentní (barva děděná, podtržení), ne primární tlačítka.

### Více odkazů

Oddělovač např. `•`:

```html
<p style="margin: 0;">
    <a href="/changelog" style="color: inherit; text-decoration: underline;">Changelog</a>
    •
    <a href="/privacy" style="color: inherit; text-decoration: underline;">Ochrana soukromí</a>
    •
    Verze {{ app_version }}
</p>
```

---

## Best practices

1. **Jednotné zápatí v base.html** – definujte zápatí jednou v `base.html`; v potomcích ho nepřepisujte celé, jen rozšiřujte blokem `footer`.
2. **Verze z backendu** – vždy z `app_version` (načteno z `version.json` nebo ekvivalentu), nikdy natvrdo v HTML.
3. **Stejný kontejner jako main** – použijte třídu `.container` (nebo stejné styly jako má `<main>`) pro vizuální sladění s obsahem.
4. **Odkazy decentní** – barva děděná ze zápatí, podtržení; vyhněte se výrazným tlačítkům.
5. **Krátký text** – dlouhé právní texty řešte odkazem na samostatnou stránku.
6. **Responzivita** – u dlouhých řetězců (verze) lze přidat zlom řádku nebo `word-break` v app.css.

---

## Shrnutí

- **Umístění:** `base.html`, pod `<main>`, styly z app.css nebo inline: ohraničení shora, padding, kontejner (`.container`), středový text, menší písmo, barva textu (`var(--color-text-light)`).
- **Verze:** z `app/static/version.json` → backend předá `app_version` do šablon; zobrazení `{% if app_version %} • Verze {{ app_version }}{% endif %}`.
- **Rozšíření:** volitelný blok `{% block footer %}` pro stránkově specifický obsah.
- Při úpravách zápatí upravujte vždy `base.html` a dodržujte konzistenci s hlavním obsahem (šířka, barvy, typografie).
