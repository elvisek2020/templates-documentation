# Šablona zápatí – Zápatí stránky

Tento dokument popisuje strukturu zápatí (footer) podle aktuálního designu aplikace. Zápatí je součástí `base.html` a používá Tailwind CSS.

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

Zápatí používá **Tailwind třídy**: ohraničení shora, středový text, menší písmo, šedá barva.

```html
<footer class="border-t border-gray-200 mt-auto py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
        <p class="m-0">{{ app_name }}{% if app_version %} • Verze {{ app_version }}{% endif %}</p>
        {% block footer %}{% endblock %}
    </div>
</footer>
```

**Třídy:**

- `footer`: `border-t border-gray-200` – oddělení od obsahu; `mt-auto` – přitlačení dolů při flex layoutu; `py-4` – vertikální padding.
- Vnitřní `div`: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` – stejná šířka a padding jako hlavní obsah; `text-center text-sm text-gray-500`.
- Odstavec: `m-0` – nulové margin.

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
<footer class="border-t border-gray-200 mt-auto py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
        <p class="m-0">{{ app_name }}{% if app_version %} • Verze {{ app_version }}{% endif %}</p>
        {% block footer %}{% endblock %}
    </div>
</footer>
```

V konkrétní stránce:

```html
{% extends "base.html" %}
{% block content %}...{% endblock %}
{% block footer %}
<p class="mt-2 text-xs text-gray-400">
    <a href="/moje-stranka/dokumentace" class="text-inherit underline">Dokumentace</a>
</p>
{% endblock %}
```

Používejte jen tam, kde je opravdu potřeba dodatečný obsah v zápatí; jinak stačí jednotné zápatí v `base.html`.

---

## Varianty a doplňky

### Zápatí s odkazem (např. changelog)

Pro administrátory lze verzi zobrazit jako odkaz:

```html
<p class="m-0">
    {{ app_name }} •
    {% if user and user.role.value == 'admin' %}
    <a href="/changelog" class="text-inherit underline">Verze {{ app_version }}</a>
    {% else %}
    Verze {{ app_version }}
    {% endif %}
</p>
```

Odkazy v zápatí nechte decentní (`text-inherit` nebo `text-gray-500`, podtržení), ne primární tlačítka.

### Více odkazů

Oddělovač např. `•`:

```html
<p class="m-0">
    <a href="/changelog" class="text-inherit underline">Changelog</a>
    •
    <a href="/privacy" class="text-inherit underline">Ochrana soukromí</a>
    •
    Verze {{ app_version }}
</p>
```

---

## Best practices

1. **Jednotné zápatí v base.html** – definujte zápatí jednou v `base.html`; v potomcích ho nepřepisujte celé, jen rozšiřujte blokem `footer`.
2. **Verze z backendu** – vždy z `app_version` (načteno z `version.json` nebo ekvivalentu), nikdy natvrdo v HTML.
3. **Stejný kontejner jako main** – `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` pro vizuální sladění s obsahem.
4. **Odkazy decentní** – barva děděná ze zápatí, podtržení; vyhněte se výrazným tlačítkům.
5. **Krátký text** – dlouhé právní texty řešte odkazem na samostatnou stránku.
6. **Responzivita** – u dlouhých řetězců (verze) lze přidat `break-words` na odstavci.

---

## Shrnutí

- **Umístění:** `base.html`, pod `<main>`, třídy Tailwind: `border-t border-gray-200 mt-auto py-4`, kontejner `max-w-7xl mx-auto`, `text-center text-sm text-gray-500`.
- **Verze:** z `app/static/version.json` → backend předá `app_version` do šablon; zobrazení `{% if app_version %} • Verze {{ app_version }}{% endif %}`.
- **Rozšíření:** volitelný blok `{% block footer %}` pro stránkově specifický obsah.
- Při úpravách zápatí upravujte vždy `base.html` a dodržujte konzistenci s hlavním obsahem (šířka, barvy, typografie).
