# Changelog

## 0.30.0 (2026-11-22)
- **Založení zakázky z případu**: aplikace navrhne další volný kód (Z-RRRR-NNN podle zakázek na webu), hlídá tvar kódu a duplicitu a před založením upozorní, že se spustí tok T9 Kontrola ELZY (`zakazkyDalsiKod`).
- **Copilot**: hotová žádost správci se 7 oprávněními (docs/ZADOST-COPILOT.md) a kapitola Návodu „Copilot: žádost správci“.
- Neověřeno: ostré založení zakázky na živých datech (spustí T9, příjemce e-mailu je třeba předem zkontrolovat v Power Automate), mobil na skutečném telefonu, úklid testovacích dat.

## 0.29.0 (2026-11-22)
- **Bezpečnostní revize**: opravena díra v AI shrnutí vlákna pošty (HTML e-mailu se vkládalo do stránky aplikace, škodlivý e-mail mohl spustit kód; nyní DOMParser bez spuštění). Názvy skupin a položek menu ze SharePointu se escapují. Kód zakázky v OData filtru se ošetřuje. Odkazy ze SharePointu a kalendáře propustí jen https, mailto a tel (`surl`). Data pro AI nemohou předčasně ukončit blok `<data>`.
- **Bezpečnostní politika stránky (CSP)**: aplikace smí komunikovat jen s login.microsoftonline.com, graph.microsoft.com, elzycz.sharepoint.com a zvolenými AI službami; `referrer` se neodesílá. Knihovna přihlášení MSAL 2.38.2 je hostovaná přímo u aplikace (ověřená z npm), už se nenačítá z cizí CDN.
- **Případy → zakázka**: Povýšit na firemní zakázku nabídne založení zakázky rovnou v Zakázky ELZA (kód, typ, interní, čeká na kontrolu ELZY) a zapíše kód k případu (`zakazkyZaloz`).
- **Automatika**: ruční spuštění připojí poštu k případům hned (bez 5min zámku, čerstvá klíčová slova).
- **Kalendář na mobilu**: týdenní a měsíční mřížka už nepřetéká šířku 390 px.
- **Ukázkový režim**: moduly bez dat ukazují vysvětlení místo technické chyby.
- **Testy**: nový `test/e2e-demo.py` (všech 30 modulů, PC i mobil, stabilní i beta, hlídá chyby JS, přetékání a pokusy o odeslání pošty).
- **Ostrý test (tkrejci@elzy.cz, živý web)**: 30 modulů bez chyby a bez porušení CSP; celý běh případu WORK-20261122-0001 (založení, údaje, povýšení, zápis času, testovací e-mail sobě, automatické připojení pošty, uzavření s výsledkem). Založen seznam NastaveniAplikace, synchronizace nastavení a sdílené menu uloženy. Toky Power Automate T3, T4, T9, T10 zapnuté, poslední běhy úspěšné.
- Neověřeno: ostré založení zakázky z případu (spustilo by tok T9), volání Copilota (čeká souhlas správce).

## 0.28.0 (2026-11-22)
- Mobil: textová pole a výběry v Úlohách pro agenty a dalších modulech se na úzké šířce přizpůsobí šířce displeje; lišty tlačítek se zalamují.
- Synchronizace nastavení: při chybě 403 (aplikace nesmí zakládat seznamy) se zobrazí srozumitelné vysvětlení, nastavení zůstane v zařízení.
- Ostrý test (přihlášení tkrejci@elzy.cz): všech 29 modulů načteno bez chyby, zápis NAVOD.md do SharePointu ověřen.

## 0.27.0 (2026-11-22)
- Mobil: široké tabulky (Případy, Zakázky, Správa, Roadmapa a další) se na šířce do 800 px automaticky zobrazí jako karty s popisky sloupců; na počítači beze změny.

## 0.26.0 (2026-11-22)
- Mobilní rozhraní: horní lišta, spodní navigace (Můj den, Případy, Pošta, Kalendář, Více), výsuvné menu, dotykové prvky, safe-area; pošta na mobilu po jednom okně (složky, seznam, čtení, zpět); PWA (manifest, ikona, přidání na plochu).
- Menu přehlednější: skupiny jako rozbalovací sekce s počtem položek, výchozí rozbalena jen aktuální skupina.
- Nový nastaveni.js: osobní nastavení (téma, menu, podpis, řazení pošty, kalendář, limit AI) se synchronizuje přes SharePoint (seznam NastaveniAplikace, řádek user:e-mail, vyhrává novější změna), obnova při návratu do aplikace. Kanál a API klíče zůstávají na zařízení.
- Návod: kapitola Mobil, tablet a více zařízení.

## 0.25.0 (2026-11-22)
- **Moje menu, vlastník**: nová sekce „Kdo co vidí (role)“ (matice položek a rolí z RoleAplikace, jen čtení, odkaz do Správy). Funkce `rmFill`.
- Ostrý test živého webu po přihlášení: 30 modulů načteno bez chyby JS, Zakázky, Přehled (velín, portál: 2 zakázky, 1 osoba ke schválení), Správa a Moje menu ověřeny na ostrých datech. Uložení sdíleného menu do SharePointu neověřeno (zápis blokován), seznam NastaveniAplikace zatím neexistuje.
- Návod: kapitola Menu doplněna. Verze 0.25.0, `?v=32`.

## 0.24.1 (2026-11-22)
- **Oprava (nalezeno ostrým testem živého webu)**: `zakazky.js` při načtení padal na `SP is not defined` (modul Zakázky se nezaregistroval); adresa portálu je nyní pevná konstanta. Verze 0.24.1, `?v=31`.

## 0.24.0 (2026-11-22)
- **Sdílené menu dokončeno (BL-084 až BL-087, druhá část)**: vlastník nastavuje pořadí skupin i pořadí položek ve skupině šipkami ↑ ↓; tabulka Skupiny ukazuje i nově vytvořené skupiny. Zamčené položky (Můj den, Návod, Moje menu, Správa) zůstávají na místě. Nové funkce `build`, pole `iord`.
- **Odolnost**: `norm0` při načtení zahodí poškozená data, neznámé položky a špatné typy, aplikace se kvůli chybnému seznamu NastaveniAplikace nerozbije.
- **Test**: `test/menu.test.js` (spuštění `node test/menu.test.js`) ověřuje výchozí menu, pořadí skupin a položek, přesuny, očistu dat, přejmenování i chování editoru.
- Návod: kapitola Menu doplněna o pořadí. Verze 0.24.0, `?v=30`.
- Neověřeno bez přihlášení: zápis a čtení seznamu NastaveniAplikace v SharePointu.

## 0.23.0 (2026-11-22)
- **Vazby případ, zakázka a portál ELZA**: v detailu případu blok „Zakázka a portál“ (fáze, stav portálu, tlačítka Otevřít zakázku a portál zákazníka); v detailu zakázky odkaz zpět na případ, odkaz na portál (`/sites/PortalELZA2`) a nový Pohled zákazníka (náhled zveřejněných položek, počet osob s přístupem). Seznam zakázek ukazuje počet zakázek ke zveřejnění. Nové funkce: `zakazkyFind`, `zakazkyOpen`, `zakazkyBox`, `pripadOtevri`.
- **Přehled (velín)**: dlaždice Zakázky na portálu, Ke zveřejnění, Osoby zákazníka ke schválení; v seznamu Vyžaduje pozornost upozornění z portálu.
- **Sdílené menu (BL-084 až BL-087, první část)**: vlastník v Moje menu přesouvá položky mezi skupinami, přejmenovává skupiny a skrývá položky všem; uloženo ve SharePointu (seznam NastaveniAplikace, založí se sám při prvním uložení). Role a moduly uživatelů se dál upravují ve Správě.
- Návod: doplněny kapitoly Případy, Zakázky a portál, Menu. Verze 0.23.0, `?v=29`.
- Ověřeno jen syntaxí a testem skládání menu; zápis do SharePointu a čtení zakázek čeká na ostrý test po přihlášení.

## 0.21.0 (2026-11-22)
- Nový soubor `centrum.js` (root i `stable/`), index.html načítá modul `centrum`.
- **Přehled (velín)**: živé dlaždice (otevřené případy, po termínu, do 3 dnů, schvalování, úlohy pro agenty, zakázky, blokující čekání, nepřečtená pošta), seznam „Vyžaduje pozornost“, rozložení případů podle výsledku, zakázky podle fáze, postup vývoje. Dlaždice jsou proklikávací. Nahrazuje původní Přehled (počty seznamů).
- **Návod a AI nápověda**: interaktivní schéma toku (pošta → případ → zakázka → portál, AI vrstva), 13 kapitol s kroky a tlačítkem „Otevřít modul“, vyhledávání v návodu bez AI (s češtinou po kmenech) a tlačítko „Zeptat se AI“ (agent AG-ELZA dostane jen nalezené kapitoly). Plovoucí tlačítko `?` otevře kapitolu k aktuálnímu modulu.
- **Automatika**: automatická obnova přehledu (5 min), hlídač termínů s okénkem a volitelným upozorněním prohlížeče, automatické připojení pošty k případům (`window.pripadyAutoLink`), ranní souhrn (lokální i s AI), protokol běhu. Nastavení jen v prohlížeči uživatele, žádné nové seznamy.
- `ucet.js`: moduly navod a automatika jsou vždy dostupné všem rolím. `pripady.js`: vystavena funkce `pripadyAutoLink`.
- Menu: skupina Nápověda, položka Automatika ve Sledování, Přehled přejmenován na Přehled (velín).
- Ověřeno: syntaxe všech souborů, smoke test v ukázkovém režimu (?demo=1) bez chyb. Neověřeno: ostrá data ze SharePointu a skutečné volání AI po přihlášení.

## 0.21.1 (2026-11-22)
- Role vlastnik vidí vždy všechny moduly (nová funkce hned zapnutá při vývoji); přidáno docs/POSTUP-VYVOJ.md a docs/NOVE-VLAKNO-PROMPT.md.

## 0.22.0 (2026-11-22)
- **Menu**: skupiny s podskupinami (Moje práce: Práce, Komunikace; AI: Použití; Znalosti: Předpisy a trh, Postupy a nástroje, Vazby). Nový modul **Moje menu** (Správa): každý si odškrtne viditelné položky (jen vzhled, uloženo v prohlížeči, tlačítko Obnovit vše). Modul `menu` je dostupný všem rolím.
- **Opakované úlohy pro agenty** (`ulohy.js`): volba Jednorázově/denně/týdně/měsíčně, značka `[OPAKOVAT:…]` v zadání; po schválení nebo zamítnutí a uplynutí periody založí aplikace další úlohu ve stavu Nová (`window.ulohyRepeat`, volá ji Automatika, přepínač „Opakované úlohy“, výchozí zapnuto). Bez nového seznamu a bez placeného API. Plánované spouštění při zavřené aplikaci zůstává nevyřešeno (viz DALSI-KROKY).
- **Návod**: tlačítko „Uložit návod do SharePointu“ vygeneruje NAVOD.md z kapitol (jeden zdroj pravdy) a zapíše ho do Shared Documents/Projekt; při neúspěchu soubor stáhne. Nové kapitoly Opakované úlohy, Menu, Návod ke stažení.
- Ověřeno: syntaxe, smoke test v ukázkovém režimu bez chyb. Neověřeno: zápis NAVOD.md do SharePointu (cesta knihovny), ostrá data, volání AI.

## 0.31.0 (2026-11-22)
- Povýšení případu na zakázku: potvrzení nově vyžaduje kontrolu příjemců toku T9 (jen testovací adresy u testovacího případu). Návod aktualizován.
- Ověřeno v živé aplikaci (vestavěný prohlížeč, 375 px, účet Tomáš Krejčí): Pošta, Kalendář, Případy, Zakázky bez přetékání a bez chyb JS.
- Nové návrhy k odsouhlasení: docs/NABIDKY-NAVRH.md (seznamy Nabidky a OsobyZakaznika), docs/AUTOMATIKA-NAVRH.md (tok T11 / plánovaná relace).
