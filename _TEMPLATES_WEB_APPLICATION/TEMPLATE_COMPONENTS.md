# Šablona komponent - Univerzální UI komponenty

Tento dokument obsahuje kompletní seznam všech standardizovaných UI komponent. Použijte tyto komponenty pro zajištění konzistentního vzhledu a chování napříč všemi aplikacemi.

## 📦 Obsah

1. [Tlačítka](#tlačítka)
2. [Formuláře](#formuláře)
3. [Tabulky](#tabulky)
4. [Badge a statusy](#badge-a-statusy)
5. [Karty](#karty)
6. [Modaly](#modaly)
7. [Loading stavy](#loading-stavy)
8. [Ikony](#ikony)
9. [Notifikace](#notifikace)

---

## Tlačítka

### Primární tlačítko (hlavní akce)
```html
<button class="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
  Uložit
</button>
```

### Sekundární tlačítko (zpět, zrušit)
```html
<button class="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">
  Zpět
</button>
```

### Destruktivní tlačítko (smazat)
```html
<button class="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
  Smazat
</button>
```

### Úspěšné tlačítko (vytvořit, potvrdit)
```html
<button class="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
  Vytvořit
</button>
```

### Akční tlačítko (editovat, detail)
```html
<button class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
  Editovat
</button>
```

### Tlačítko s ikonou
```html
<button class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
  </svg>
  Přidat
</button>
```

### Malé tlačítko (v tabulkách)
```html
<button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
  Akce
</button>
```

### Tlačítko jako odkaz
```html
<a href="/path/to/page" 
   class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
  Otevřít
</a>
```

---

## Formuláře

### Jednotná šablona formulářů

Pro konzistentní vzhled používejte tuto šablonu pro všechny formuláře v aplikaci (např. formuláře v nastavení, přihlášení, CRUD entity).

**Zásady:**
- **Jeden řádek = popisek + input** — label vlevo, input vpravo na stejném řádku (ne pod sebou).
- **Stejná šířka inputů** — formulář zabírá celou šířku boxu (`w-full`), inputy v druhém sloupci mají stejnou délku.
- **Stejná výška** — všechny textové inputy a select mají pevnou výšku `h-[2.5rem]`, aby dropdown nebyl vizuálně menší.
- **Tlačítka vpravo** — řádek s tlačítky Zrušit / Uložit je zarovnaný doprava (`w-full flex justify-end gap-3 pt-4`).

**Struktura řádku (pole):**
```html
<div class="grid grid-cols-[minmax(0,11rem)_1fr] gap-4 items-center">
  <label for="id_pole" class="text-sm font-medium text-gray-700">Popisek *</label>
  <input type="text" id="id_pole" name="pole"
         class="w-full px-3 py-2 h-[2.5rem] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
         placeholder="…">
</div>
```

**Select (dropdown)** — stejná výška a vzhled jako input, vlastní šipka (bez nativního menšího vzhledu):
```html
<div class="grid grid-cols-[minmax(0,11rem)_1fr] gap-4 items-center">
  <label for="role" class="text-sm font-medium text-gray-700">Role</label>
  <select id="role" name="role" class="w-full px-3 py-2 h-[2.5rem] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white appearance-none cursor-pointer" style="background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%236b7280%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 1.25rem; padding-right: 2rem;">
    <option value="a">Možnost A</option>
    <option value="b">Možnost B</option>
  </select>
</div>
```

**Textarea** — popisek a textarea na jednom řádku, textarea může být víceřádková; zarovnání nahoru:
```html
<div class="grid grid-cols-[minmax(0,11rem)_1fr] gap-4 items-start">
  <label for="note" class="text-sm font-medium text-gray-700 pt-2">Poznámka</label>
  <textarea id="note" name="note" rows="3" placeholder="…"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"></textarea>
</div>
```

**Formulář a tlačítka:**
```html
<form method="post" action="…" class="space-y-5 w-full">
  <!-- řádky polí podle výše -->
  <div class="w-full flex justify-end gap-3 pt-4">
    <a href="…" class="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">Zrušit</a>
    <button type="submit" class="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">Uložit</button>
  </div>
</form>
```

**Příklad použití:** formuláře uživatelů, nastavení, přihlášení a další entity; použijte tam, kde má být konzistentní layout (label vlevo, input vpravo).

---

### Text input
```html
<div>
  <label for="field_name" class="block text-sm font-medium text-gray-700 mb-2">Label</label>
  <input type="text" id="field_name" name="field_name" 
         class="w-full px-3 py-2 border border-gray-300 rounded-lg h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
         placeholder="Placeholder text">
</div>
```

### Textarea
```html
<div>
  <label for="field_name" class="block text-sm font-medium text-gray-700 mb-2">Label</label>
  <textarea id="field_name" name="field_name" rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Placeholder text"></textarea>
</div>
```

### Select
```html
<div>
  <label for="field_name" class="block text-sm font-medium text-gray-700 mb-2">Label</label>
  <select id="field_name" name="field_name" 
          class="w-full px-3 py-2 border border-gray-300 rounded-lg h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
    <option value="">Vyberte možnost</option>
    <option value="1">Možnost 1</option>
    <option value="2">Možnost 2</option>
  </select>
</div>
```

### Checkbox
```html
<label class="flex items-center">
  <input type="checkbox" name="field_name" 
         class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
  <span class="ml-2 text-sm text-gray-700">Text checkboxu</span>
</label>
```

### Radio button
```html
<div class="flex space-x-4">
  <label class="flex items-center">
    <input type="radio" name="field_name" value="value1"
           class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
    <span class="ml-2 text-sm text-gray-700">Možnost 1</span>
  </label>
  <label class="flex items-center">
    <input type="radio" name="field_name" value="value2"
           class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
    <span class="ml-2 text-sm text-gray-700">Možnost 2</span>
  </label>
</div>
```

### Number input
```html
<div>
  <label for="field_name" class="block text-sm font-medium text-gray-700 mb-2">Label</label>
  <input type="number" id="field_name" name="field_name" min="0" max="100"
         class="w-full px-3 py-2 border border-gray-300 rounded-lg h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
</div>
```

### Date input
```html
<div>
  <label for="field_name" class="block text-sm font-medium text-gray-700 mb-2">Label</label>
  <input type="date" id="field_name" name="field_name"
         class="w-full px-3 py-2 border border-gray-300 rounded-lg h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
</div>
```

### Formulář s grid layoutem
```html
<form method="post" action="/path/to/submit" class="space-y-6">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label for="field1" class="block text-sm font-medium text-gray-700 mb-2">Pole 1</label>
      <input type="text" id="field1" name="field1" 
             class="w-full px-3 py-2 border border-gray-300 rounded-lg h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
    </div>
    <div>
      <label for="field2" class="block text-sm font-medium text-gray-700 mb-2">Pole 2</label>
      <input type="text" id="field2" name="field2" 
             class="w-full px-3 py-2 border border-gray-300 rounded-lg h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
    </div>
  </div>
  
  <div class="flex justify-end space-x-3">
    <a href="/path/to/back" 
       class="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">
      Zrušit
    </a>
    <button type="submit" 
            class="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
      Uložit
    </button>
  </div>
</form>
```

### Formulář s HTMX
```html
<form hx-post="/path/to/submit"
      hx-target="#result"
      hx-swap="innerHTML"
      class="space-y-6">
  <!-- Formulářová pole -->
  <button type="submit" 
          class="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
    <span class="htmx-indicator animate-spin -ml-1 mr-3 h-4 w-4 text-white">
      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    Odeslat
  </button>
</form>
<div id="result"></div>
```

---

## Tabulky

### Základní tabulka
```html
<div class="overflow-x-auto">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sloupec 1</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sloupec 2</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sloupec 3</th>
        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akce</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Hodnota 1</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Hodnota 2</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Hodnota 3</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
          <div class="flex justify-end space-x-2">
            <button class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">Editovat</button>
            <button class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Smazat</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Tabulka s prázdným stavem
```html
{% if items %}
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <!-- Tabulka -->
    </table>
  </div>
{% else %}
  <div class="text-center py-12">
    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">Žádné položky</h3>
    <p class="text-gray-600 mb-6">Zatím zde nejsou žádné položky k zobrazení.</p>
    <a href="/path/to/new" 
       class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
      Přidat první položku
    </a>
  </div>
{% endif %}
```

---

## Badge a statusy

### Status badge - Úspěch
```html
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  Aktivní
</span>
```

### Status badge - Chyba
```html
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
  Neaktivní
</span>
```

### Status badge - Varování
```html
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
  Čeká
</span>
```

### Status badge - Info
```html
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
  Běží
</span>
```

### Status indikátor (tečka)
```html
<!-- Úspěch -->
<span class="inline-block w-3 h-3 rounded-full bg-green-500"></span>

<!-- Chyba -->
<span class="inline-block w-3 h-3 rounded-full bg-red-500"></span>

<!-- Varování -->
<span class="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
```

---

## Karty

### Základní karta
```html
<a href="/path/to/item"
   class="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 overflow-hidden">
  <div class="p-6 pb-4">
    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
      <span class="text-2xl">📁</span>
    </div>
    <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Název karty</h3>
  </div>
  <div class="px-6 pb-6">
    <p class="text-sm text-gray-600 leading-relaxed">Popis karty</p>
  </div>
  <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 group-hover:bg-blue-50 transition-colors">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">Otevřít</span>
      <svg class="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </div>
  </div>
</a>
```

### Grid karet
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <!-- Karty -->
</div>
```

### Karta vstupu v Nastavení (odkaz na podsekci)

Používá se na stránce nastavení pro odkaz na podmodul. Pevná velikost **620×120 px**, text velký (`text-2xl`), vpravo šipka. Mřížka 2 sloupce – viz [TEMPLATE_LAYOUT.md](./TEMPLATE_LAYOUT.md).

```html
<a href="/settings/podmodul-1" class="flex items-center px-6 py-4 w-[620px] h-[120px] bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors text-left">
  <span class="text-2xl font-medium text-gray-900">Podmodul 1</span>
  <svg class="w-6 h-6 ml-auto text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
</a>
```

- Kontejner mřížky: `page-content-box grid grid-cols-2 gap-4 min-h-[45vh]`.

---

## Modaly

### Základní modal struktura
```html
<!-- Modal overlay -->
<div id="modal-id" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 hidden">
  <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
    <!-- Modal header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Nadpis modalu</h3>
      <button onclick="closeModal('modal-id')" class="text-gray-400 hover:text-gray-600">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    
    <!-- Modal body -->
    <div class="mb-4">
      <!-- Obsah modalu -->
    </div>
    
    <!-- Modal footer -->
    <div class="flex justify-end space-x-3">
      <button onclick="closeModal('modal-id')" 
              class="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">
        Zavřít
      </button>
      <button class="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
        Uložit
      </button>
    </div>
  </div>
</div>

<script>
function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

// Zavřít modal na ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('[id$="-modal"]').forEach(modal => {
      if (!modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
      }
    });
  }
});
</script>
```

### Modal s HTMX
```html
<div id="modal-id" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 hidden">
  <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
    <div id="modal-content">
      <!-- Obsah se načte přes HTMX -->
    </div>
  </div>
</div>

<script>
function openModal(modalId, url) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('hidden');
  if (url) {
    htmx.ajax('GET', url, {target: '#' + modalId + '-content', swap: 'innerHTML'});
  }
}
</script>
```

---

## Loading stavy

### HTMX loading indikátor
```html
<span class="htmx-indicator animate-spin -ml-1 mr-3 h-4 w-4 text-white">
  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
</span>
```

### Loading text
```html
<div class="text-gray-600">Načítám...</div>
```

### HTMX auto-refresh
```html
<div hx-get="/path/to/status" 
     hx-trigger="load, every 5s" 
     hx-target="this" 
     hx-swap="innerHTML">
  <div class="text-gray-600">Načítám...</div>
</div>
```

---

## Ikony

### Přidat
```html
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
</svg>
```

### Editovat
```html
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
</svg>
```

### Smazat
```html
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
</svg>
```

### Zpět
```html
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
</svg>
```

### Historie/Čas
```html
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
</svg>
```

### Zavřít
```html
<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
</svg>
```

### Informace
```html
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
</svg>
```

---

## Notifikace

### Globální notifikační systém

V `base.html` je definovaný prvek `#notification-toast` a funkce `showNotification(message, type)`. Notifikace se zobrazí v pravém dolním rohu, po cca 4 s zmizí.

**Umístění a styly (base.html):**

- Kontejner: `id="notification-toast"`, třídy `fixed bottom-4 right-4 z-[100] max-w-sm hidden`, role `status`, `aria-live="polite"`.
- Barvy podle typu: `success` → zelená (`bg-green-600`), `error` → červená (`bg-red-600`), výchozí `info` → modrá (`bg-blue-600`).

**Použití:**

```javascript
// Úspěšná notifikace
showNotification('Operace byla úspěšně dokončena', 'success');

// Chybová notifikace
showNotification('Došlo k chybě při zpracování', 'error');

// Info notifikace (výchozí)
showNotification('Informační zpráva', 'info');
```

Používejte `showNotification()` místo `alert()` pro konzistentní UX.

### Použití v formuláři

```html
<form method="post" action="/path/to/submit" 
      onsubmit="setTimeout(() => showNotification('Položka byla vytvořena', 'success'), 100)">
  <!-- Formulář -->
</form>
```

### Použití s HTMX

```html
<form hx-post="/path/to/submit"
      hx-target="#result"
      hx-swap="innerHTML"
      hx-on::after-request="showNotification('Operace dokončena', 'success')">
  <!-- Formulář -->
</form>
```

---

## Shrnutí

Tento dokument obsahuje všechny standardizované komponenty používané v projektu. Při vytváření nových aplikací vždy používejte tyto komponenty pro zajištění konzistentního vzhledu a chování.

**Klíčové principy:**
- ✅ Vždy používejte standardní barvy a velikosti
- ✅ Přidávejte `transition-colors` k interaktivním prvkům
- ✅ Respektujte spacing a padding konvence
- ✅ Používejte konzistentní ikony
- ✅ Dodržujte přístupnost (aria-labels, focus stavy)
- ✅ Používejte `showNotification()` místo `alert()`

