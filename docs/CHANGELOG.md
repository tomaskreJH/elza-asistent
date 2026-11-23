## 0.54.1 (2026-11-23) – ověření Plánu fází, příprava ESPO
- Plán fází: stejná jména lidí rozlišena osobním číslem (dřív se zaměňovali), brigádníci na konci seznamu.
- Ověření na ostrých datech: modul bez chyb, ale zatím bez uložených plánů, norem, kvalifikací a měření (docs/OVERENI-FAZI-2026-11-23.md).
- EspoCRM jen čtením: návrh přes čtecího API uživatele a tok do kopie v SharePointu, nezapojeno (docs/ESPO-CTENI.md).

## 0.54.0 (2026-11-23) – bezpečnost bez nákladů a základní data
- CSP bez 'unsafe-inline' pro skripty na všech stránkách (index, portál, průvodce): vložené skripty přesunuty do boot.js, app.js, mobil.js, pruvodce.js; inline atributy událostí v kódu nejsou.
- SRI otisk (sha384) u msal-browser.min.js v index.html i portal.html.
- Strážce: otisky nově zahrnují pruvodce.html a nové soubory; verze se čte z app.js (tools/hash.js, test/menu.test.js).
- Lidé a školení: tlačítko Naplnit základní data (týmy EPS, PZTS, OZO, REV a 6 druhů školení s výchozí platností; existující nemění).
- Plán fází: tlačítko Uložit výchozí normy, když šablona nemá normy v seznamu Norma.
- Návod a Průvodce aktualizovány.

## 0.53.1 (2026-11-23) – opravy z ověření na ostrých datech
- Oprava: moduly.js přepisoval window.MODS, takže moduly načtené dřív (Seznamy) se nezobrazily („modul se připravuje“). Nově se registrace slučují.
- Ověřeno přihlášeným vlastníkem na ostrých datech bez chyb: Ranní kontrola (19 nových poptávek), Analýza vstupu, Hlídání nabídek, Plán fází, Lidé a školení, Publikace do portálu; žádný modul už nehlásí chybějící seznam.

## 0.53.0 (2026-11-23) – sjednocené seznamy
- Nový seznamy.js: jeden zdroj pravdy pro všech 16 seznamů (sloupce, indexy, web). Lidé a školení, Plán fází, Analýza vstupu, Hlídání nabídek a Publikace do portálu z něj berou schéma a zakládají přes SEZ.create.
- Nový modul Správa → Seznamy: stav všech seznamů, tlačítko Založit vše chybějící, skript pro založení v přihlášeném SharePointu (když aplikace nemá AllSites.Manage).
- Založeny na ostrém webu: Osoba, Kvalifikace, PlanFaze, ZaznamFaze, Norma, Tym, Clen, SkoleniTyp, Skoleni, Obsazeni (Zakázky ELZA), Kontroly, ProfilZakaznika (PortalELZA2); sloupce ověřeny.
- Návod: kapitola Seznamy aplikace; Průvodce kap. 10 doplněn.

## 0.52.0 (2026-11-23) – kontrola a zjednodušení
- Oprava: čtení seznamů SharePointu po stránkách (dřív tiše jen prvních 500 položek), odstraněna duplicitní funkce list().
- Menu Moje práce srovnáno podle toku práce: denní práce, Případy a zakázky, Plánování a lidé; Ranní kontrola pod Můj den.
- Povýšení případu na zakázku otevře Složky zakázky s předvyplněným kódem a druhem.
- Bezpečnost: referrer no-referrer na všech stránkách, CSP Průvodce doplněna.
- Dokumentace: nový stručný STAV.md (historie v STAV-HISTORIE.md), přepsané DALSI-KROKY.md, zpráva docs/KONTROLA-2026-11-23.md. Návod: kapitoly Menu a Složky zakázky.

## 0.51.0 (2026-11-23)
- Nový modul Ranní kontrola (rano.js, menu Moje práce): přebírá z Copilotu naplánované úlohy „Ranní přehled dne“ (7:30) a „Ranní zpracování poptávek“ (8:00). Čte poštu od posledního pracovního dne a dnešní kalendář (jen čtení), z poptávek (bez blokovaných odesílatelů, jedna karta na vlákno) složí kartu: typ, technologie, jistota, OBJ/PR, co chybí, Předpoklady. Koncept odpovědi zadá klepnutím agentovi AG-POSTA (Úlohy). Test test/rano.test.js.
- Poznámka: úlohy v Copilotu zatím zůstávají zapnuté jako záloha, vypnout po ověření na ostrých datech.

## 0.50.0 (2026-11-23)
- Nová společná vrstva sdilene.js (SDL): čtení po dávkách, zápis jen do popsaných seznamů, zakládání seznamů a složek po klepnutí; nic se nemaže.
- A: Analýza vstupu sdílí postupy a zpětnou vazbu celému týmu (seznamy PostupVerze a PostupZaznam na webu Zakázky ELZA, zakládá tlačítko), druhé zařízení načte sdílené verze; schválení výchozího postupu a doplnění zdroje předpisu nebo normy u požadavku odborně vedoucím (nová verze, stará v historii); zpracovaná zpětná vazba se označí.
- B: nový modul Složky zakázky (slozky.js, STRUKTURA.plan): při vzniku zakázky založí složky OBJ / PR / role / typ a trvalé složky objektu Provoz a Kontroly; jen nové složky, cílová knihovna nastavitelná (výchozí Shared Documents/Zakazky); odkaz z Analýzy vstupu.
- D: nový modul Hlídání nabídek (nabidky.js, seznam NabidkaEvid): připomínky po 5, 14 a 30 dnech, fronta podle odpovědné osoby, připomenutí založí úkol, po 30 dnech návrh uzavření jako bez odpovědi; zákazníkovi se nic neposílá.
- Testy: test/sdilene.py (falešný SharePoint), test/nabidky.test.js. Návod: kapitoly Analýza vstupu, Složky zakázky, Hlídání nabídek. Průvodce: slide Hotovo.

## 0.49.0 (2026-11-23)
- Nová souborová struktura dokumentace (struktura.js, docs/ARCHITEKTURA-CIL.md): OBJxxxxx / PRxxxxxx / role dokumentu / typ, trvalé dokumenty u objektu, názvy bez diakritiky s verzí a datem, návrh typu ze starého názvu, povinné dokumenty při předání. Nic se nekopíruje ze staré struktury.
- Nový modul Analýza vstupu (Moje práce): z textu pozná technologii a druh, navrhne postup, dokumenty s cílovou složkou, kvalifikaci a upozornění. Postupy se učí: zpětná vazba po krocích, po třech stejných úpravách návrh nové verze, schválením vznikne nová verze a stará zůstává v historii. Zatím pravidlově bez AI a se zpětnou vazbou v zařízení (sdílený seznam bude v dalším kroku).
- Test: test/struktura.test.js. Návod: nová kapitola Analýza vstupu. Průvodce: aktualizovaný slide Hotovo.

## 0.48.0 (2026-11-23)
- Plán fází se ukládá do SharePointu (web Zakázky ELZA): plán zakázky (PlanFaze), záznamy reality (ZaznamFaze), schválené normy (Norma), potvrzené e-maily osob (Osoba) a kvalifikace s platností (Kvalifikace). Seznamy zakládá tlačítko Založit chybějící seznamy po klepnutí; v ukázkovém režimu se nic nezapisuje. Schéma: docs/SEZNAMY-FAZE.md.
- Kvalifikace napojená na obsazení: plán varuje, když osoba fázi nesmí dělat nebo jí kvalifikace skončí dřív než fáze; tlačítko Zapsat obsazení do Lidé a školení přenese plán po lidech do seznamu Obsazeni (po potvrzení souhrnu, jeden vedoucí akce, staré obsazení téhož kódu se označí jako zrušené).
- Gantt s přetahováním: fázi lze přetáhnout myší nebo prstem na jiný den (pevný začátek 📌, dopad na předání se ukáže hned, dřív než skončí předchozí fáze to nejde); Zrušit ruční posuny. Kalendář plánu začíná pondělím aktuálního týdne a dnešním dnem (dřív pevné datum), 4 týdny.
- Test: test/faze-store.py (falešný SharePoint v paměti: založení seznamů, kvalifikace, plán uložit/načíst bez duplicit, obsazení s potvrzením, přetažení fáze).
- Návod: rozšířeny kapitoly Plán fází a Osoby a kvalifikace; Průvodce: aktualizovaný slide Hotovo a co dál.

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

