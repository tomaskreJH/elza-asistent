# STATUS (2026-11-27, verze 0.88.5)

## Co se udělalo
- Prioritní pošta v Můj den: klepnutí otevře vlákno přímo ve čtecím panelu Pošty (dříve jen Outlook). Ověřeno v prohlížeči (1400 i 390 px).
- Oprava skryté chyby: `window.acc` / `window.m` byly vždy prázdné (v app.js jsou `let`). Opraveno v 9 modulech: zápis Kdo/Schválil/Vedoucí, „vaše nabídky nahoře“, obsazenost kalendářů v Procesu, me() v nocni/teren/zakaznik.
- Pošta bez přihlášení ukazuje srozumitelnou větu místo chyby MSAL.
- Návod (centrum.js, Můj den) doplněn. Verze 0.88.5, ?v=170, stable a integrity.json aktuální.
- Testy: node test/*.test.js, tools/audit.js, všech 9 Python testů prochází.

## Změněné soubory
- posta.js, rano.js, analyza.js, lidi.js, nabidky.js, nocni.js, proces.js, teren.js, zakaznik.js, centrum.js, app.js, boot.js, index.html, integrity.json, stable/ (stejné soubory)
- docs/CHANGELOG.md, docs/STAV.md, docs/DALSI-KROKY.md, docs/NOVE-VLAKNO-PROMPT.md, STATUS.md

## Další krok pro další AI
1. Po přihlášení Tomáše ověřit na ostrých datech: Prioritní pošta → Pošta; Proces → obsazenost kalendářů; Nabídky → moje nahoře; zápisy Kdo/Schválil.
2. Ověřit 0.88.x (shoda pošty, poznámky, karta zákazníka, první odpověď), ladit váhy vazbaSkore.
3. Skica do nabídky odložena. Most a tools/ jen na „uprav most“.
