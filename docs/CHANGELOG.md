## 0.45.1 (2026-11-23)
- Plán fází: oprava vzhledu v aplikaci na PC (třídy gt, gr, gl kolidovaly se styly Ganttu v plan.js, přejmenovány na fgt, fgr, fgl; zaškrtávací pole). Ověřeno na živém webu po přihlášení.

## 0.45.0 (2026-11-23)
- Nový modul Plán fází (faze.js, menu Moje práce): odhad času z množství práce × norma × koeficienty jako rozsah (zužuje se s počtem vzorků), plánování fází podle pracovní doby, dovolené a školení lidí, rozdělení hodin mezi více lidí, okamžitý dopad přesunu člověka na termín předání, varování při chybějícím školení, tlačítko Navrhnout obsazení, zápis reality (hodiny, jednotky, důvod odchylky nad 20 %), pruh reality pod plánem, kapacita lidí po dnech, učení norem po 10 vzorcích se schválením. Pilot Kontrola OZO PO se vstupními odhady vedoucího. Data zatím jen v okně; seznamy SablonaFaze, Norma, Koeficient, ZaznamFaze, DuvodOdchylky zatím nezaloženy (docs/MERENI-FAZI-NAVRH.md). Návod: kapitola Plán fází.

## 0.44.2 – dokumentace měření fází (2026-11-23)
- Návrh měření fází zakázek a odhadů času (docs/MERENI-FAZI-NAVRH.md): šablony fází, jednotky práce, normy a koeficienty, zápis skutečnosti od prvního dne, učení po deseti vzorcích, směrování podle kapacity, schéma seznamů na SharePointu, pilot Kontrola OZO PO se vstupními odhady k potvrzení. Kód se nemění, verze zůstává 0.44.2.

## 0.44.2 (2026-11-23)
- Skrytý text: varuje se jen tehdy, když ve skrytém prvku (display:none, nulové písmo, bílá na bílé) je pokyn pro AI; běžný skrytý náhled zprávy, prázdné odstavce, mezery, průhlednost a bílý text na barevném pozadí už neplaší. Neviditelné značkové znaky (ASCII smuggling) se hlídají zvlášť, obousměrné značky a nulová šířka v běžném textu ne.

## 0.44.1 (2026-11-23)
- Oprava: ochrana chybně hlásila běžné e-maily z Outlooku (značka meta http-equiv) jako útok a blokovala odesílatele. Značka odstraněna ze vzorů, dřívější chybné blokace a incidenty se samy smažou, vlastní doména @elzy.cz se nikdy automaticky neblokuje. Test s typickým Outlook e-mailem.

## 0.44.0 (2026-11-23)
- Strážce (straz.js): kontrola integrity kódu (otisky + integrity.json, tools/hash.js), alarm a zámek AI i odesílání při neschválené změně, sdílený seznam blokovaných, incidentů a naučených vzorů přes SharePoint, učení ze vložených ukázek, detekce spustitelného kódu v obsahu zpráv. Návod: kapitola Strážce.

## 0.43.0 (2026-11-23)
- Ochrana vstupů (ochrana.js): hlídač vložených pokynů v poště a textech pro AI, okamžité upozornění, blokace odesílatele, záznam a seznam blokovaných (štítek 🛡), ochranné pravidlo u každého dotazu na AI. Test test/ochrana.test.js. Návrh a hranice: docs/OCHRANA-NAVRH.md.
- Můj den: Hlídané termíny (kontroly, školení), označení podezřelé pošty.
- Lidé a školení: Hlídač platnosti → tlačítko Založit úkoly ke školením (do Ganttu, bez duplicit; window.planUkoly).
- Publikace do portálu: nevyhovující kontrola bez vyřešené nabídky automaticky založí úkol „Nabídka nápravy“ pro obchod.

