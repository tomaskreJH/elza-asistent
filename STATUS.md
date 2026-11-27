# STATUS (2026-11-27)

## Co se udělalo
- Nasazeno 0.88.3 (verze v app.js, ?v=168 v index.html a boot.js, stable/ synchronizováno, integrity.json přegenerován).
- Skica budovy odložena na jindy; zadání: vložit do nabídky podle vzoru konkurence, vzor zatím není v repozitáři.
- node test/*.test.js prochází, audit bez nálezů, e2e-demo a pruvodce procházejí. vzhled.py padá od 0.73.3 kvůli SRI msal (nezměněno).

## Změněné soubory
- app.js, boot.js, index.html, integrity.json, stable/app.js, stable/boot.js, docs/CHANGELOG.md, docs/STAV.md, docs/DALSI-KROKY.md, STATUS.md

## Další krok pro další AI
1. Opravit SRI msal (index.html nebo msal-browser.min.js), až Tomáš rozhodne, která verze je správná.
2. Po přihlášení Tomáše ověřit shodu, poznámky, kartu zákazníka a první odpověď na živých datech; ladit váhy vazbaSkore.
3. Skica: až Tomáš upřesní vzor nabídky, napojit do nabídky (ne do e-mailu).
4. Most a tools/ neupravovat bez pokynu „uprav most“.
