## 0.47.0 (2026-11-23)
- Průvodce (pruvodce.html) rozšířen na 14 slidů: živá simulace toku dat (16 kroků, kdo vstupuje: skript, tok, AI, skill, člověk; záznamy v SharePointu vznikají průběžně, souhrn ukazuje, že AI sama nezapsala nic), srovnání skriptu, toku, AI agenta a skillu, cesta dotazu AI přes ochranu, tok dat od SQL po portál, interaktivní plán fází na dotek, ukázka zablokovaného podvodného e-mailu, hotovo a co čeká. Vymyšlená data. Test: python3 test/pruvodce.py.
- Nový modul Osoby (osoby.js): klíč osoby je osobní číslo, 106 řádků Zamestnanec se skládá na osoby bez duplicit, návrh e-mailu příjmení@elzy.cz, kvalifikace s platností. Test: node test/osoby.test.js.
- Plán fází: pole Typ zakázky (pilot Kontrola OZO PO, Celý řetěz zakázky se 8 fázemi a požadovanou kvalifikací), lidé jako osoby bez duplicit; oprava mapování množství na jednotky fází.
- Návod: nová kapitola Osoby a kvalifikace, rozšířené kapitoly Plán fází a Grafický průvodce.

## 0.46.0 (2026-11-23)
- Nový modul Synchronizace zaměstnanců (zamestnanec.js, Správa): kopie číselníku ciselnik_zamestnanec (Implementace365, jen čtení) do seznamu Zamestnanec na Zakázky ELZA. Klíč Title (GUID), osobní číslo se opakuje a klíčem není. Tlačítka Založit seznam a Synchronizovat teď, denní automatika, pojistky proti nahrávání zdroje a proti duplicitám. window.zamestnanci() je sdílený zdroj lidí.
- Plán fází bere lidi z kopie zaměstnanců (výchozích 8 h, kvalifikace neověřena do naplnění Lidé a školení); bez kopie zůstávají ukázková data.

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

