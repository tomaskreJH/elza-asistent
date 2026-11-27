# STATUS (2026-11-27, verze 0.88.7)

## Co se udělalo
- Kalendář: příčina chybějících událostí kolegů byla HTTP 429 (Microsoft omezil souběžné požadavky). graf.js: max 4 požadavky současně, opakování při 429/503/504 podle Retry-After. Srozumitelné důvody u chyb kalendáře.
- Synchronizace osobního nastavení (NastaveniAplikace) rozumí klíčům s účtem (výběr a skupiny kalendářů, vypnuté role, období dávek pošty) a nově synchronizuje ranní analýzu, základ složek, moje Elzáčky, automatiku a náhled. Stará data z prohlížeče se nahrají k účtu.
- Zrušeno souběžné ukládání skupin do ZnalostElza z 0.88.6 (jedno řešení).
- Návod: synchronizace a kalendář aktualizovány.
- Testy: node, audit, 9 Python, Playwright ověření 429 a synchronizace.

## Změněné soubory
- graf.js, nastaveni.js, kalendar.js, centrum.js, app.js, boot.js, index.html, integrity.json, stable/ (stejné)
- docs/CHANGELOG.md, docs/STAV.md, docs/DALSI-KROKY.md, docs/NOVE-VLAKNO-PROMPT.md, STATUS.md

## Další krok pro další AI
1. Po přihlášení Tomáše ověřit kalendář (bez 429) a synchronizaci na druhém zařízení.
2. Zvážit převod místních verzí postupů v Analýze (elzaPostupVerze/Zaznamy) do ZnalostElza.
3. Ostatní moduly volající Graph přímo (pripady.js gg, rano) zatím nejdou přes omezovač souběhu; převést na GR.req, pokud se objeví 429 i jinde.
4. Skica odložena. Most a tools/ jen na „uprav most“.
