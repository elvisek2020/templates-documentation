# Šablona zápatí - Zápatí stránky

Tento dokument popisuje standardizovanou strukturu zápatí (footer) stránky. Použijte tyto vzory pro konzistentní zápatí napříč aplikací.

## 📋 Obsah

1. [Umístění a účel](#umístění-a-účel)
2. [Základní struktura](#základní-struktura)
3. [Minimální zápatí](#minimální-zápatí)
4. [Zápatí s verzí aplikace](#zápatí-s-verzí-aplikace)
5. [Zápatí s odkazem pro administrátory](#zápatí-s-odkazem-pro-administrátory)
6. [Zápatí s více odkazy](#zápatí-s-více-odkazy)
7. [Rozšíření přes blok](#rozšíření-přes-blok)
8. [Styly a konvence](#styly-a-konvence)
9. [Best practices](#best-practices)

---

## Umístění a účel

Zápatí se zobrazuje **jednou** v základní šabloně (`base.html`), pod hlavním obsahem (`<main>`).

| Vlastnost | Popis |
|-----------|--------|
| **Umístění** | Na konci stránky, pod `<main class="container">` |
| **Účel** | Informace o aplikaci, verze, odkazy (changelog, licence), copyright |
| **Viditelnost** | Na všech stránkách dědících od `base.html` |

**Pravidlo:** Zápatí je součástí `base.html`; jednotlivé stránky ho nemusí definovat, pokud nevyužívají blok pro rozšíření.

---

## Základní struktura

Zápatí používá sémantický element `<footer>` a kontejner pro zarovnání šířky s obsahem stránky.

### Kostra

```html
<footer class="footer">
    <div class="container">
        <!-- Obsah zápatí -->
    </div>
</footer>
```

**Poznámka:** Třída `.footer` a `.container` by měly být definované v hlavním CSS tak, aby zápatí mělo konzistentní vzhled (ohraničení, barva textu, padding) a šířku shodnou s `<main>`.

---

## Minimální zápatí

Jedna řádka textu, středově zarovnaná.

```html
<footer style="margin-top: 0; padding: 0.25rem 0; border-top: 1px solid var(--color-border); text-align: center; color: var(--color-text-light); font-size: 0.875rem; line-height: 1.2;">
    <div class="container" style="padding-top: 0.25rem; padding-bottom: 0.25rem;">
        <p style="margin: 0; padding: 0; line-height: 1.2;">
            Název aplikace • © 2025 Firma
        </p>
    </div>
</footer>
```

---

## Zápatí s verzí aplikace

Zobrazení čísla nebo názvu verze (proměnná z backendu, např. `app_version`).

```html
<footer style="margin-top: 0; padding: 0.25rem 0; border-top: 1px solid var(--color-border); text-align: center; color: var(--color-text-light); font-size: 0.875rem; line-height: 1.2;">
    <div class="container" style="padding-top: 0.25rem; padding-bottom: 0.25rem;">
        <p style="margin: 0; padding: 0; line-height: 1.2;">
            Název aplikace • Verze {{ app_version }}
        </p>
    </div>
</footer>
```

**Backend:** Do kontextu šablony předávat proměnnou `app_version` (např. z `app/version.py` nebo konfigurace).

---

## Zápatí s odkazem pro administrátory

Verze je pro všechny; pro administrátory je verze klikací a vede na changelog (nebo jinou stránku).

```html
<footer style="margin-top: 0; padding: 0.25rem 0; border-top: 1px solid var(--color-border); text-align: center; color: var(--color-text-light); font-size: 0.875rem; line-height: 1.2;">
    <div class="container" style="padding-top: 0.25rem; padding-bottom: 0.25rem;">
        <p style="margin: 0; padding: 0; line-height: 1.2; word-wrap: break-word; overflow-wrap: break-word;">
            🤖 Web poháněn umělou inteligencí • Powered by MND •
            {% if user and user.role.value == 'admin' %}
            <a href="/changelog" style="color: inherit; text-decoration: underline;">Verze {{ app_version }}</a>
            {% else %}
            Verze {{ app_version }}
            {% endif %}
        </p>
    </div>
</footer>
```

**Pravidlo:** Odkaz neměnit barvu (zachovat `color: inherit`), pouze podtržení pro zviditelnění.

---

## Zápatí s více odkazy

Více textových bloků nebo odkazů oddělených oddělovačem (např. `•`).

```html
<footer style="margin-top: 0; padding: 0.25rem 0; border-top: 1px solid var(--color-border); text-align: center; color: var(--color-text-light); font-size: 0.875rem; line-height: 1.2;">
    <div class="container" style="padding-top: 0.25rem; padding-bottom: 0.25rem;">
        <p style="margin: 0; padding: 0; line-height: 1.2;">
            <a href="/changelog" style="color: inherit; text-decoration: underline;">Changelog</a>
            •
            <a href="/privacy" style="color: inherit; text-decoration: underline;">Ochrana soukromí</a>
            •
            Verze {{ app_version }}
        </p>
    </div>
</footer>
```

### Více řádků

```html
<footer style="margin-top: 0; padding: 0.5rem 0; border-top: 1px solid var(--color-border); text-align: center; color: var(--color-text-light); font-size: 0.875rem; line-height: 1.4;">
    <div class="container" style="padding-top: 0.25rem; padding-bottom: 0.25rem;">
        <p style="margin: 0 0 0.25rem 0; padding: 0;">
            Název aplikace • Powered by Firma
        </p>
        <p style="margin: 0; padding: 0;">
            <a href="/changelog" style="color: inherit; text-decoration: underline;">Verze {{ app_version }}</a>
        </p>
    </div>
</footer>
```

---

## Rozšíření přes blok

Má-li mít konkrétní stránka v zápatí vlastní obsah (např. dodatečné odkazy), v `base.html` umístěte volitelný blok uvnitř `<footer>`:

```html
<footer class="footer" ...>
    <div class="container" ...>
        <p ...>
            <!-- Běžný obsah zápatí -->
        </p>
        {% block footer %}{% endblock %}
    </div>
</footer>
```

Ve stránce pak lze doplnit vlastní řádek nebo odkaz:

```html
{% extends "base.html" %}
{% block content %}...{% endblock %}
{% block footer %}
<p style="margin: 0.5rem 0 0 0; padding: 0; font-size: 0.75rem;">
    <a href="/moje-stranka/dokumentace" style="color: inherit; text-decoration: underline;">Dokumentace</a>
</p>
{% endblock %}
```

**Použití:** Pouze tam, kde je potřeba stránkově specifický obsah v zápatí; jinak stačí jednotné zápatí v `base.html`.

---

## Styly a konvence

### Doporučené vlastnosti zápatí

| Vlastnost | Doporučení | Důvod |
|-----------|------------|--------|
| **Ohraničení** | `border-top: 1px solid var(--color-border)` | Vizuální oddělení od obsahu |
| **Barva textu** | `color: var(--color-text-light)` nebo ekvivalent | Sekundární důležitost |
| **Velikost písma** | `font-size: 0.875rem` (14px) | Menší než hlavní text |
| **Zarovnání** | `text-align: center` | Jednoduchý středový vzhled |
| **Padding** | Malý (např. `0.25rem`–`0.5rem`) | Kompaktní zápatí |
| **Odkazy** | `color: inherit; text-decoration: underline` | Konzistence s barvou zápatí |

### Kontejner

Používejte stejný kontejner jako pro hlavní obsah (`container`), aby šířka a padding odpovídaly layoutu stránky.

---

## Best practices

### 1. Jednotné zápatí v base.html

Zápatí definujte **jednou** v `base.html`. Všechny stránky dědící od `base.html` ho automaticky zobrazí. Nepřepisujte celé zápatí v potomkovských šablonách, pokud to není nutné.

### 2. Verze z backendu

Verzi předávejte z aplikace (např. `app_version` v kontextu šablony). Nepište verzi natvrdo do HTML.

### 3. Podmíněný obsah

Obsah závislý na roli (např. odkaz na changelog jen pro adminy) řešte přes `{% if user and user.role.value == 'admin' %}` v šabloně. Nepředávat citlivé údaje jen do zápatí.

### 4. Odkazy v zápatí

Odkazy v zápatí nechte vizuálně decentní (barva děděná ze zápatí, podtržení). Vyhněte se výrazným tlačítkům nebo primárním barvám.

### 5. Délka textu

Text v zápatí udržujte krátký. Pro dlouhé texty (právní podmínky, licence) odkažte na samostatnou stránku.

### 6. Responzivita

Používejte `word-wrap: break-word; overflow-wrap: break-word` u odstavce, aby dlouhé řetězce (např. verze) na malých obrazovkách nezlomily layout.

### 7. Přístupnost

Odkazy v zápatí měly mít smysluplný text (ne jen „zde“). Pro čistě dekorativní text není nutné přidávat další ARIA atributy.

---

## Shrnutí

Tato šablona zápatí poskytuje:

✅ **Jednotné umístění** v `base.html` pod `<main>`  
✅ **Vzory** od minimálního textu po verzi a podmíněné odkazy  
✅ **Konzistentní styly** (ohraničení, barva, velikost písma)  
✅ **Volitelný blok** `{% block footer %}` pro rozšíření na konkrétních stránkách  
✅ **Pravidla** pro verzi, odkazy a responzivní text  

Při úpravách zápatí upravujte vždy `base.html` a dodržujte tyto konvence pro jednotný vzhled aplikace.
