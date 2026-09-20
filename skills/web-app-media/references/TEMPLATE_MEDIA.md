# Fotky a soubory — modul `media`

## Obsah

1. [Závislosti a konfigurace](#závislosti-a-konfigurace)
2. [Tabulka](#tabulka)
3. [Nahrání](#nahrání)
4. [Doručení](#doručení)
5. [Titulní obrázek, pořadí, mazání](#titulní-obrázek-pořadí-mazání)
6. [Formulář a galerie v šabloně](#formulář-a-galerie-v-šabloně)
7. [Prohlížení fotek](#prohlížení-fotek)
8. [Chybové stavy](#chybové-stavy)
9. [Provoz](#provoz)

---

## Závislosti a konfigurace

```
pillow
python-multipart
```

```bash
DATA_DIR=/app/data                 # volume, ne image
MAX_UPLOAD_BYTES=10485760          # 10 MB
```

```python
DATA_DIR = Path(os.environ.get("DATA_DIR", "/app/data"))
MEDIA_DIR = DATA_DIR / "media"
```

---

## Tabulka

```sql
CREATE TABLE IF NOT EXISTS media (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    owner_id    INT NOT NULL,
    parent_id   INT NULL,               -- záznam, ke kterému fotka patří
    filename    VARCHAR(255) NOT NULL,  -- původní název od uživatele
    stored_path VARCHAR(500) NOT NULL,  -- cesta na disku (generovaný název)
    thumb_path  VARCHAR(500) NULL,
    mime_type   VARCHAR(80) NOT NULL,
    caption     VARCHAR(255) NULL,
    sort_order  INT NOT NULL DEFAULT 0,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_media_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_media_parent FOREIGN KEY (parent_id) REFERENCES zakazky(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
```

Titulní obrázek drž na nadřazeném záznamu (`cover_media_id`), ne příznakem u fotky —
jinak se dá omylem mít titulních víc.

---

## Nahrání

```python
ALLOWED = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
HEIC_TYPES = {"image/heic", "image/heif"}


def _detect_mime(data: bytes, declared: str | None) -> str | None:
    """Typ z prvních bajtů souboru — hlavičce od prohlížeče se nevěří."""
    if data[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    return declared if declared in ALLOWED else None


@router.post("/media/upload")
async def media_upload(
    request: Request,
    file: UploadFile = File(...),
    parent_id: int = Form(...),
    caption: str = Form(""),
    is_cover: str = Form(""),
):
    user = get_current_user(request)
    parent = db.query_one(
        "SELECT id, cover_media_id FROM zakazky WHERE id = :id AND owner_id = :uid",
        {"id": parent_id, "uid": user["id"]},
    )
    if not parent:
        return RedirectResponse("/zakazky", status_code=302)

    raw = await file.read()
    if len(raw) > settings.max_upload_bytes:
        return RedirectResponse(f"/zakazky/{parent_id}?err=size", status_code=302)

    declared = (file.content_type or "").lower()
    if declared in HEIC_TYPES or (file.filename or "").lower().endswith((".heic", ".heif")):
        return RedirectResponse(f"/zakazky/{parent_id}?err=heic", status_code=302)

    mime = _detect_mime(raw, declared)
    if mime not in ALLOWED:
        return RedirectResponse(f"/zakazky/{parent_id}?err=type", status_code=302)

    ext = ALLOWED[mime]
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    path = MEDIA_DIR / f"{uuid.uuid4().hex}{ext}"
    thumb_path = MEDIA_DIR / f"{uuid.uuid4().hex}_thumb{ext}"
    path.write_bytes(raw)

    # Zmenšení originálu + náhled. Když se obrázek nepodaří otevřít,
    # aspoň zůstane originál a náhled = originál.
    try:
        with Image.open(path) as img:
            img = img.convert("RGB") if img.mode not in ("RGB", "L") else img
            img.thumbnail((1200, 1200))
            img.save(path, quality=85)
            thumb = img.copy()
            thumb.thumbnail((400, 400))
            thumb.save(thumb_path, quality=80)
    except Exception:
        if not thumb_path.exists():
            thumb_path.write_bytes(raw)

    max_order = db.query_one(
        "SELECT COALESCE(MAX(sort_order), -1) AS m FROM media WHERE parent_id = :pid",
        {"pid": parent_id},
    )
    mid = db.execute(
        "INSERT INTO media (owner_id, parent_id, filename, stored_path, thumb_path, mime_type, caption, sort_order) "
        "VALUES (:uid, :pid, :fn, :sp, :tp, :mime, :cap, :so)",
        {
            "uid": user["id"], "pid": parent_id, "fn": file.filename or path.name,
            "sp": str(path), "tp": str(thumb_path), "mime": mime,
            "cap": caption or None, "so": int(max_order["m"]) + 1,
        },
    )

    # První fotka se stane titulní sama.
    if is_cover == "1" or not parent.get("cover_media_id"):
        db.execute("UPDATE zakazky SET cover_media_id = :mid WHERE id = :pid",
                   {"mid": mid, "pid": parent_id})

    return RedirectResponse(f"/zakazky/{parent_id}", status_code=302)
```

Proč zmenšovat: fotka z telefonu má klidně 8 MB a 4000 px. Po zmenšení na 1200 px
zabere desetinu a v aplikaci vypadá stejně.

HEIC z iPhonu Pillow bez doplňku neotevře — proto se odmítá s vlastní hláškou,
ne obecnou chybou. (Telefon obvykle umí nastavit „nejkompatibilnější“ formát.)

---

## Doručení

```python
@router.get("/media/{media_id}")
async def media_get(request: Request, media_id: int, thumb: int = 0):
    user = get_current_user(request)
    row = db.query_one(
        "SELECT * FROM media WHERE id = :id AND owner_id = :uid",
        {"id": media_id, "uid": user["id"]},
    )
    if not row:
        return RedirectResponse("/zakazky", status_code=302)
    path = row["thumb_path"] if thumb and row.get("thumb_path") else row["stored_path"]
    return FileResponse(path, media_type=row["mime_type"])
```

V šabloně: `/media/{{ m.id }}?thumb=1` v seznamu, `/media/{{ m.id }}` v detailu.

**Nemountuj složku s fotkami přes `StaticFiles`.** Šlo by je pak číst bez přihlášení.

---

## Titulní obrázek, pořadí, mazání

```python
@router.post("/media/{media_id}/cover")
async def media_set_cover(request: Request, media_id: int):
    user = get_current_user(request)
    row = db.query_one("SELECT * FROM media WHERE id = :id AND owner_id = :uid",
                       {"id": media_id, "uid": user["id"]})
    if row:
        db.execute("UPDATE zakazky SET cover_media_id = :mid WHERE id = :pid",
                   {"mid": media_id, "pid": row["parent_id"]})
    return RedirectResponse(f"/zakazky/{row['parent_id']}", status_code=302)


@router.post("/media/reorder")
async def media_reorder(request: Request):
    """Pořadí po přetažení — JSON se seznamem id ve výsledném pořadí."""
    user = get_current_user(request)
    data = await request.json()
    for order, media_id in enumerate(data.get("ids", [])):
        db.execute(
            "UPDATE media SET sort_order = :o WHERE id = :id AND owner_id = :uid",
            {"o": order, "id": int(media_id), "uid": user["id"]},
        )
    return JSONResponse({"ok": True})


@router.post("/media/{media_id}/delete")
async def media_delete(request: Request, media_id: int):
    user = get_current_user(request)
    row = db.query_one("SELECT * FROM media WHERE id = :id AND owner_id = :uid",
                       {"id": media_id, "uid": user["id"]})
    if not row:
        return RedirectResponse("/zakazky", status_code=302)

    db.execute("UPDATE zakazky SET cover_media_id = NULL WHERE cover_media_id = :mid",
               {"mid": media_id})
    db.execute("DELETE FROM media WHERE id = :id", {"id": media_id})

    for key in ("stored_path", "thumb_path"):
        if row.get(key):
            Path(row[key]).unlink(missing_ok=True)

    return RedirectResponse(f"/zakazky/{row['parent_id']}", status_code=302)
```

Pořadí smazáním „děr“ nevadí — řadí se podle `sort_order, id`.

---

## Formulář a galerie v šabloně

```html
<div class="gallery">
  <div class="media-gallery" id="media-gallery" data-parent-id="{{ item.id }}">
    {% for m in item.media %}
    <div class="media-tile {% if item.cover_media_id == m.id %}is-cover{% endif %}"
         data-media-id="{{ m.id }}" draggable="true">
      {% if item.cover_media_id == m.id %}<span class="badge-cover">Titulní</span>{% endif %}
      <a href="/media/{{ m.id }}" data-lightbox data-lightbox-src="/media/{{ m.id }}">
        <img src="/media/{{ m.id }}?thumb=1" alt="{{ m.caption or 'Fotka' }}" loading="lazy">
      </a>
      <div class="media-tile-actions">
        {% if item.cover_media_id != m.id %}
        <form method="post" action="/media/{{ m.id }}/cover">
          <button type="submit" class="btn btn-sm" aria-label="Nastavit jako titulní">{{ icon('star', 16) }}</button>
        </form>
        {% endif %}
        <form method="post" action="/media/{{ m.id }}/delete"
              data-confirm="Fotka bude trvale odstraněna." data-confirm-title="Smazat fotku?"
              data-confirm-ok="Smazat" data-confirm-danger>
          <button type="submit" class="btn btn-sm btn-danger-ghost" aria-label="Smazat fotku">{{ icon('trash', 16) }}</button>
        </form>
      </div>
    </div>
    {% endfor %}
  </div>

  <form method="post" action="/media/upload" enctype="multipart/form-data"
        class="media-dropzone" data-dropzone tabindex="0" role="button" aria-label="Přidat fotky">
    <input type="hidden" name="parent_id" value="{{ item.id }}">
    <input type="file" name="file" accept="image/jpeg,image/png,image/webp" multiple>
    {{ icon('camera', 28) }}
    <span>Přidat fotky</span>
    <span class="text-sm" style="font-weight:400">přetáhněte nebo klikněte</span>
    <label class="check-row" onclick="event.stopPropagation()">
      <input type="checkbox" name="is_cover" value="1" {% if not item.media %}checked{% endif %}>
      <span>jako titulní</span>
    </label>
  </form>
</div>
```

K formuláři patří [reference_media_gallery.js](reference_media_gallery.js): klepnutí
na dropzónu otevře výběr, více souborů se nahraje po jednom, dlaždice jdou přetahovat.

`accept` **bez** atributu `capture` — s ním telefon otevře rovnou fotoaparát a nejde
vybrat z galerie.

---

## Prohlížení fotek

Kliknutí na fotku ji otevře přes celou obrazovku — ne na nové kartě. Stačí na odkaz
přidat `data-lightbox` (viz galerie výše), zbytek obstará `app.js`.

Co uživatel dostane:

| Ovládání | Chování |
|----------|---------|
| Klik na fotku | otevře překryv s plnou velikostí |
| Šipky vlevo/vpravo v překryvu | předchozí / další fotka |
| Klávesy ← a → | totéž z klávesnice |
| Přejetí prstem | další nebo předchozí fotka (mobil) |
| Escape, křížek, klik mimo fotku | zavře překryv |
| Cmd/Ctrl/Shift + klik | nechá prohlížeči, fotka se otevře na nové kartě |

Listuje se **mezi všemi fotkami na stránce** — skript si je při otevření posbírá sám
a v rohu ukáže pořadí („2 / 7“). Když je fotka na stránce jediná, šipky i počitadlo
se skryjí. Adresa náhledu (`?thumb=1`) se automaticky převede na plnou velikost.

Do `base.html` patří tenhle blok (jednou pro celou aplikaci):

```html
<div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Náhled fotografie" hidden>
    <button type="button" class="lightbox-close" id="lightbox-close" aria-label="Zavřít">{{ icon('x', 22) }}</button>
    <button type="button" class="lightbox-nav lightbox-prev" id="lightbox-prev" aria-label="Předchozí fotka" hidden>{{ icon('chevron-left', 26) }}</button>
    <img id="lightbox-img" src="" alt="">
    <button type="button" class="lightbox-nav lightbox-next" id="lightbox-next" aria-label="Další fotka" hidden>{{ icon('chevron-right', 26) }}</button>
    <span class="lightbox-counter" id="lightbox-counter" hidden></span>
</div>
```

Kde co je: **obsluha** v `app.js` (skill `web-app-interactions`), **styly** `.lightbox*`
v `app.css` (skill `web-app-ui`). Tenhle skill řeší jen to, co se do překryvu dostane.

---

## Chybové stavy

Router přesměrovává s parametrem, šablona z něj udělá hlášku:

```html
{% set err = request.query_params.get('err') %}
{% if err == 'heic' %}{{ alert('error', 'Formát HEIC zatím není podporován. Převeďte fotku do JPEG, PNG nebo WebP.') }}
{% elif err == 'size' %}{{ alert('error', 'Soubor je příliš velký (max. 10 MB).') }}
{% elif err == 'type' %}{{ alert('error', 'Nepodporovaný typ souboru. Použijte JPEG, PNG nebo WebP.') }}
{% endif %}
```

Hláška musí říct, co s tím uživatel má udělat — ne jen „chyba nahrávání“.

---

## Provoz

- Složka s fotkami je **volume**, ne součást image. V Dockeru musí být zapisovatelná
  uživatelem, pod kterým aplikace běží (typicky UID 1000).
- Záloha = dump databáze **i** kopie volume. Samotný dump fotky neobsahuje.
- Velikost volume roste — při 1200 px a kvalitě 85 počítej s ~200–400 kB na fotku.
- Reverzní proxy musí povolit dost velké tělo požadavku (`client_max_body_size`),
  jinak nahrání skončí chybou proxy dřív, než dojde do aplikace.
