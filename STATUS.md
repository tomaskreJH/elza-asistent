0.82.0 – ELZY asistentka v Poště automaticky ukazuje odhad typu zprávy z náhledu. Filtry a řazení se rozbalují pod hledáním, zprávu lze otevřít klávesnicí. Další krok: propojit prioritní zprávu v Můj den přímo s interním čtecím panelem.
Porovnání: Syniru ukazuje čekající práci na hlavní stránce, CliqSales vede k rozhodnutí na jednom místě. V demu ověřeno zobrazení automatických odhadů, rozbalení filtrů a otevření vlákna klávesou Enter při 390 i 1400 px. Výška filtru 44 a 36 px. Prošly JS testy, audit, vzhled a průvodce.
Při vizuální kontrole odhalen newsletter chybně označený jako zakázka. Pošta nyní pro štítky používá filtr hromadné pošty z ranní kontroly.
Změny: rano.js, app.js, vzhled.js, index.html, boot.js, posta.js, manifest.webmanifest, pruvodce.html, centrum.js, odpovídající stable, integrity.json a předávací dokumentace.

# Stav práce — ELZA 0.81.3

## Hotovo

- Vlastník má ve výchozím nastavení aktivní role Poptávky, Nabídka, PCO, EPS, Projekce, Servisní intervaly, Termíny, Projektové řízení a Smlouvy. Existující nastavení má přednost. Výchozí roli lze odebrat v daném prohlížeči.
- Pošta nabízí relevantní specialisty podle rozboru. Živé zpracování zákaznické pošty dál vyžaduje náhled.
- Stav předchozího pilotu a ranní automatizace zůstává v docs/DALSI-KROKY.md.

## Ověření

V ostré verzi 0.81.3 se pod účtem vlastníka zobrazilo všech devět pracovních rolí. Pošta u MAKRO zvolila specialistu PCO a nabídla také Elzáčka Nabídka. Model nad skutečnou poštou nebyl spuštěn. Prošly testy JavaScriptu a tři prohlížečové sady.

## Změněné soubory

- ai.js, posta.js, centrum.js, pruvodce.html, app.js, boot.js, index.html, integrity.json
- stable/ai.js, stable/posta.js, stable/centrum.js, stable/app.js
- test/elzacci.test.js, docs/CHANGELOG.md, docs/DALSI-KROKY.md, docs/NOVE-VLAKNO-PROMPT.md, docs/STAV.md, STATUS.md

## Další krok pro další AI

Ověř dostupnost rolí v ostré Poště a testuj jednotlivé předávky do pracovních kroků na smyšlených podkladech. Připoj připravené návrhy k Mému dni a ke správnému případu. Zachovej kontrolu vstupu a náhled skutečné pošty.
