# Zápatí

Zápatí nese verzi aplikace a uživatelské přepínače vzhledu. Je v `base.html` jednou,
stránky do něj nesahají (kromě volitelného bloku `footer`).

## Struktura

```html
<footer class="footer">
    <div class="container footer-inner">
        <p>{{ app_name }}{% if app_version %} · verze {{ app_version }}{% endif %}</p>

        <div class="theme-switch" role="group" aria-label="Motiv stránky">
            <button type="button" class="theme-option" data-theme-option="auto">{{ icon('settings', 14) }}<span>Systém</span></button>
            <button type="button" class="theme-option" data-theme-option="light">{{ icon('sun', 14) }}<span>Světlý</span></button>
            <button type="button" class="theme-option" data-theme-option="dark">{{ icon('moon', 14) }}<span>Tmavý</span></button>
        </div>

        <button type="button" class="theme-option footer-toggle" id="layout-wide-toggle"
                title="Širší stránka na velkém monitoru" aria-pressed="false">{{ icon('expand', 14) }}<span>Široká stránka</span></button>

        {% block footer %}{% endblock %}
    </div>
</footer>
```

Pod 420 px zůstanou v přepínači motivu jen ikony, pod 1100 px se tlačítko šířky skryje
(na úzkém displeji nemá efekt).

---

## Verze aplikace

Verze je jediné místo pravdy pro cache statických souborů.

`app/static/version.json`:

```json
{"version": "20260920.1148"}
```

Načte se jednou při startu a nastaví jako globální proměnná šablon:

```python
def _load_version() -> str:
    try:
        return str(json.loads(VERSION_JSON.read_text(encoding="utf-8")).get("version", ""))
    except Exception:
        return ""

templates.env.globals["app_version"] = _load_version()
```

Použití v `base.html`:

```html
<link rel="stylesheet" href="/static/css/app.css?v={{ app_version }}">
<script src="/static/js/app.js?v={{ app_version }}" defer></script>
```

**Pravidlo:** po každé změně `app.css` nebo `app.js` zvyš verzi (formát `RRRRMMDD.HHMM`).
Bez toho prohlížeč drží starý soubor a změny se neprojeví — ani tobě při testování.
Protože se hodnota čte při startu, po úpravě `version.json` musí aplikace proběhnout znovu.

---

## Přepínač motivu

Tři stavy: podle systému (výchozí), světlý, tmavý. Volba se ukládá do `localStorage`
a nastavuje se inline skriptem v `<head>`, aby stránka při načtení neblikla — viz
TEMPLATE_LAYOUT.md. Obsluhu tlačítek dělá `app.js` (skill `web-app-interactions`).

Aby ruční volba přebila systémové nastavení, jsou tmavé tokeny v paletě dvakrát:

```css
@media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) { /* tmavé tokeny */ }
}

:root[data-theme="dark"] { /* stejné tmavé tokeny */ }
```

Obě sady musí zůstat shodné — když měníš jednu, změň i druhou.

---

## Přepínač šířky

`#layout-wide-toggle` přepíná třídu `layout-wide` na `<body>`, která zvedne `--container`
z 1100 px na 1460 px. Ukládá se také do `localStorage`.

---

## Co do zápatí nepatří

- Navigace aplikace (je v hlavičce a ve spodní liště).
- Právní texty a kontakty u interních aplikací — jen zabírají místo.
- Cokoli, co se mění podle stránky; na to je blok `{% block footer %}`.

---

## Rozšíření

```html
{% block footer %}
<p class="text-sm"><a href="/changelog">Novinky ve verzi</a></p>
{% endblock %}
```
