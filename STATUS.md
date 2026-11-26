0.82.2 – Pošta: poznámky jsou oddělené podle účtu a vlákna, lze je upravit a smazat i po přiřazení případu. Ukládají se v tomto prohlížeči. Historické poznámky evidované jen u odesílatele nelze bezpečně přiřadit konkrétnímu vláknu. Při rychlé změně výběru se opožděné načtení předchozího vlákna zahodí. Scénář filmu je rozšířen po realizaci a předání díla (docs/VIDEO-SCENAR-PCO.md).
Změněné soubory: posta.js, pripady.js, app.js, boot.js, index.html, centrum.js, jejich kopie ve stable, integrity.json, test/poznamka-vlakna.test.js, docs/VIDEO-SCENAR-PCO.md a předávací dokumentace. Další krok: ověřit opravu na dvou produkčních vláknech stejného odesílatele, potom skupiny kalendářů a návaznost od nabídky po předání.
Test: oddělení účtů a vláken v JS, zápis, načtení a smazání v ukázkové Poště stable i beta. Editor je dostupný i při chybě načítání seznamu případů.

0.82.1 – V AI záznamu doplněn graf měsíčních počtů volání a chyb podle nástroje. Galerie Elzáčků zachová svislou pozici po přidání nebo odebrání. Inspirace: AI_TOM, náklady uvádí odhady a u PCO popisuje fáze a odpovědné osoby. Připraven scénář videa docs/VIDEO-SCENAR-PCO.md.
Změněné soubory: ai.js, stable/ai.js, app.js, stable/app.js, boot.js, stable/boot.js, index.html, centrum.js, stable/centrum.js, integrity.json, docs/VIDEO-SCENAR-PCO.md, docs/CHANGELOG.md, docs/STAV.md, docs/DALSI-KROKY.md, docs/NOVE-VLAKNO-PROMPT.md a STATUS.md. Další krok: ověřit a opravit hlášený přenos poznámek mezi vlákny, potom navázat skupinami kalendářů. Scénář rozlišuje hotové a plánované funkce.

# Rozpracováno 26. 11. 2026

Tomáš nahlásil přenesení poznámky mezi e-maily a nemožnost ji upravit. Příčinu a dotčené uložiště je třeba ověřit na konkrétních záznamech, zatím nebyla opravena. Pravidlové odhady z verze 0.82.0 nejsou učením z poznámek. Učení postupů v analyza.js sbírá úpravy kroků a po opakování navrhuje změnu postupu, kterou člověk schvaluje.

Další požadavky: skupiny kalendářů techniků, přibližné měření práce, obecné fáze bez předpokladu hlásičů, přehledné AI nastavení a zachování pozice po přidání Elzáčka, jména a avatary, skutečný Brand, vazby Elzáčků a postupů, grafická mapa a grafy AI nákladů. Prověřit původní artefakt Claude a přehled AI_TOM. Veřejné načtení artefaktu selhalo, nutno ověřit v přihlášeném prohlížeči.

Změněný soubor v tomto běhu: STATUS.md. Kód ani nasazení se nezměnily.

Další krok: dohledat zdroj a identitu poznámek, bezpečně opravit vazbu a editaci s regresním testem, poté navázat ostatními požadavky.

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
