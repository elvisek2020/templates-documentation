---
name: web-app-media
description: Fotografie a soubory ve webové aplikaci — nahrávání (i přímo z fotoaparátu), kontrola typu a velikosti, zmenšení a náhledy přes Pillow, doručení jen přihlášenému uživateli, galerie s přetahováním, titulní obrázek a mazání. Použij při implementaci nebo úpravě nahrávání fotek, obrázkové galerie, náhledů, titulního obrázku, ukládání souborů nebo jejich doručování.
---

# Fotky a soubory

Soubory se ukládají **na disk do volume**, v databázi je jen záznam s cestou. Doručuje je
aplikace, ne statický server — jinak by byly veřejně dostupné komukoli, kdo uhodne URL.

## Kterou referenci číst

| Úkol | Reference |
|------|-----------|
| Nahrávání, kontrola typu, zmenšení, náhledy, doručení, titulní obrázek, mazání | [references/TEMPLATE_MEDIA.md](references/TEMPLATE_MEDIA.md) |
| Galerie v prohlížeči — dropzóna, hromadné nahrání, přetahování dlaždic | [references/reference_media_gallery.js](references/reference_media_gallery.js) |
| Prohlížení fotek přes celou obrazovku (šipky, klávesnice, přejetí prstem) | sekce „Prohlížení fotek“ v [references/TEMPLATE_MEDIA.md](references/TEMPLATE_MEDIA.md) |

## Klíčová pravidla

- **Typ souboru poznávej z obsahu**, ne z přípony ani z `Content-Type` od prohlížeče.
- Velikost omez konfigurací (`MAX_UPLOAD_BYTES`) a kontroluj ji před zápisem na disk.
- Název souboru na disku generuj (`uuid4`), původní jméno ulož jen do databáze —
  jinak si uživatel zapíše cokoli do cesty.
- Každý obrázek ulož ve dvou velikostech: zmenšený originál a náhled. Seznamy
  a galerie načítají náhled, detail plnou velikost.
- Doručení jde přes routu, která ověří přihlášení **i vlastníka** záznamu.
- Mazání souboru na disku dělej až po smazání řádku, a ošetři, že soubor už nemusí být.
- Pozor na cizí klíče: když je fotka navázaná na řádek s `ON DELETE CASCADE`,
  smaže se s ním — počítej s tím při úpravách nadřazeného záznamu.
- `Permissions-Policy` v aplikaci **nesmí** zakazovat `camera`, jinak nejde fotit z mobilu.
- Volume s fotkami není v záloze databáze — zálohuj obojí.

## Související skilly

- Vzhled galerie, dlaždice, dropzóna → `web-app-ui`
- Lightbox a chování v prohlížeči → `web-app-interactions`
- Modul, konfigurace, databázová vrstva → `web-app-stack`
- Volume a oprávnění v kontejneru → `web-app-docker`

## Checklist

- [ ] Typ ověřen z hlavičky souboru, velikost před zápisem
- [ ] Název na disku generovaný, původní jen v DB
- [ ] Uloženy dvě velikosti (zmenšený originál + náhled)
- [ ] Doručovací routa kontroluje přihlášení i vlastníka
- [ ] Chybové stavy mají srozumitelnou hlášku (velký soubor, nepodporovaný formát)
- [ ] Ověřeno nahrání z telefonu (fotoaparát i galerie)
