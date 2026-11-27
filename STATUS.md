# STATUS (2026-11-27, verze 0.88.6)

## Co se udělalo
- Kalendář: skupiny sdílených kalendářů se ukládají k účtu (ZnalostElza, Druh kal_skupiny), ne jen do prohlížeče. Staré skupiny z prohlížeče se při prvním otevření převedou.
- Kalendář: tlačítko „Seskupit podle týmů z Lidé“ (vlastník kalendáře ↔ Clen podle e-mailu/jména → název týmu).
- Návod: nová kapitola Kalendář, vazba v kapitole Lidé.
- Ukázkový režim respektuje odkaz #v=obrazovka.
- Testy: node test/*.test.js, audit, 9 Python testů prochází; Kalendář ověřen v prohlížeči (1400, 390 px).

## Změněné soubory
- kalendar.js, centrum.js, app.js, boot.js, index.html, integrity.json, stable/ (app, boot, centrum, kalendar)
- docs/CHANGELOG.md, docs/STAV.md, docs/DALSI-KROKY.md, docs/NOVE-VLAKNO-PROMPT.md, STATUS.md

## Další krok pro další AI
1. Přihlášení Tomáše: v panelu prohlížeče si Microsoft účet nepamatuje (žádá e-mail a heslo); Tomáš se musí přihlásit sám.
2. Po přihlášení zjistit, co přesně „špatně funguje“ v kalendáři, a ověřit převod skupin a Seskupit podle týmů.
3. Ověřit 0.88.5 (Prioritní pošta, zápis Kdo/Schválil, kalendáře v Procesu) a 0.88.x na ostrých datech.
4. Skica odložena. Most a tools/ jen na „uprav most“.
