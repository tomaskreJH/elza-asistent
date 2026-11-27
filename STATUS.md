# STATUS (2026-11-27, verze 0.88.4)

## Co se udělalo
- Celková kontrola aplikace (zpráva docs/KONTROLA-2026-11-27.md).
- Opraveno kritické: integrity.json byl generován z CRLF kopie a nesouhlasil se soubory na GitHubu. Přidán .gitattributes (`* -text`), otisky přegenerovány.
- stable/vzhled.js sjednocen s kořenem. Opraveno chybné tvrzení o SRI msal v docs.
- Verze 0.88.4 (?v=169). Všechny node i Python testy procházejí, audit bez nálezů.

## Změněné soubory
- .gitattributes (nový), app.js, boot.js, index.html, integrity.json, stable/app.js, stable/boot.js, stable/vzhled.js
- docs/CHANGELOG.md, docs/STAV.md, docs/DALSI-KROKY.md, docs/NOVE-VLAKNO-PROMPT.md, docs/KONTROLA-2026-11-27.md, STATUS.md

## Další krok pro další AI
1. Po přihlášení Tomáše ověřit 0.88.x na živých datech (shoda, poznámky, karta zákazníka, první odpověď); ladit váhy vazbaSkore.
2. Pilot jedné poptávky (MAKRO).
3. Skica do nabídky: odloženo, dokud Tomáš neupřesní vzor nabídky.
4. Most a tools/ jen na „uprav most“; čekat na overeni.txt ze stanic.
5. Na Windows vždy generovat integrity.json z bajtově přesných souborů (.gitattributes to zajišťuje).
