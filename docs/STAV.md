# Stav ELZA asistenta
Verze 0.46.0 (root i stable). Nový modul Plán fází (faze.js): odhad z množství práce, plán podle pracovní doby lidí, plán vs. realita, učení norem; zatím bez ukládání do SharePointu. Moduly: Můj den, Případy, Zakázky, Gantt a termíny, Smlouvy a kontroly, Pošta, Kalendář, Úlohy pro agenty, AI, Znalosti, Sledování (Přehled-velín, Roadmapa, Procesy, Stav systému, Hledat, Automatika), Správa (Moje menu, sdílené menu, přehled rolí), Nápověda. Mobilní rozhraní a PWA, osobní nastavení synchronizované přes SharePoint (seznam NastaveniAplikace založen 2026-11-22).
Bezpečnost (0.29.0): CSP, MSAL u aplikace, pošta v izolovaném okně bez skriptů, escapování dat ze SharePointu, odkazy jen https/mailto/tel, odesílání pošty jen přes potvrzení. Přístup k datům řídí práva SharePointu, role v aplikaci jen zobrazení. API klíče AI jen v prohlížeči zařízení.
Ověřeno (0.29.0, 2026-11-22, Browser 2, tkrejci@elzy.cz): 30 modulů na ostrých datech bez chyby a bez porušení CSP; běh případu WORK-20261122-0001 od založení po uzavření včetně automatického připojení e-mailu; synchronizace nastavení a uložení sdíleného menu; toky Power Automate T3, T4, T9, T10 zapnuté a úspěšné. Automatický test test/e2e-demo.py: 30 modulů, PC i mobil 390 px, oba kanály, bez chyby.
Toky Power Automate (vlastník Tomáš): T3 Vstup zákazníka (Dotazy, Schválení), T3 Kontakty od zákazníka, T4 Připomínky čekání (pracovní dny 7:30), T9 Kontrola ELZY (Outlook), T10 Přístupy a uvítání (pracovní dny 7:30). Pracují nad portálem a Zakázky ELZA; běh případu v aplikaci zatím žádný tok nepoužívá.
Čeká: souhlas správce pro Copilot (žádost hotová v docs/ZADOST-COPILOT.md, AI v aplikaci zatím nevolá), ostré založení zakázky z případu (spouští T9), test na skutečném telefonu, automatika při zavřené aplikaci.
Mobil (0.31.0): Pošta, Kalendář, Případy, Zakázky ověřeny emulací 375 px na ostrých datech; skutečný telefon zatím ne. Návrhy: docs/NABIDKY-NAVRH.md, docs/AUTOMATIKA-NAVRH.md.
Průvodce (0.32.0): pruvodce.html, samoběžná prezentace toku. Architektura portálu se smluvními zákazníky, help deskem a Ganttem: docs/PORTAL-ARCHITEKTURA.md (návrh).

Plán (0.33.0): plan.js, Gantt (úkoly, milníky, po zakázkách i po lidech), časová osa případu, Smlouvy a kontroly se semaforem. Čeká na založení seznamů Ukol, Smlouva, Technologie, Kontrola na webu Zakázky ELZA (docs/SEZNAMY-PLAN.md); v ukázkovém režimu běží s vymyšlenými daty.

0.34.0: seznamy Ukol, Smlouva, Technologie, Kontrola na webu Zakázky ELZA existují (založeno 2026-11-22, prázdné). Semafor kontrol v Přehledu a Můj den, závislosti úkolů v Ganttu. Neověřeno na živém webu s daty (seznamy jsou prázdné); tok T12, help desk T13 a portálové přihlášení z adres zákazníka zatím nejsou. Gmail soukromá schránka pro vzorce firemní pošty nepřispěla (jen soukromé a systémové zprávy); firemní tok je v Outlooku.

0.35.0: import z Excelu a Hlídač kontrol ve Smlouvy a kontroly (ověřeno testem parsování a demo e2e, na živých datech zatím ne – seznamy jsou prázdné). Zbývá: tok T12, portál, T13, vzorce z Outlooku.

0.36.0: plán kontrol na 2 měsíce po týdnech, horizont Hlídače, načtení termínů z Outlook kalendáře (Kostka). Ověřeno testy a demo e2e; na živých datech zatím ne (kalendář Jan Kostka je v Outlooku, ne v Google Kalendáři; konektor Microsoft 365 v Claudovi není připojen).

0.36.1: oprava pošty na PC (skrytý text zprávy) a nový vzhled Gantta (období, měsíce, mřížka, čitelné milníky).

0.36.3: ostře ověřeno čtením (Smlouvy a kontroly, Gantt, bez chyb). Zápis úkolů z Hlídače kontrol do ostrého SharePointu nespuštěn (zablokováno bezpečnostní kontrolou, čeká na Tomášův pokyn v aplikaci).

0.37.0: kostra portálu zákazníka (portal.html). Datové moduly beze změny (Prehled, Milniky, Cekani na PortalELZA2). Přístup zákazníkům dává stávající tok T10 po potvrzení kontaktu, žádný nový postup ani globální správce. Neověřeno: přihlášení skutečného zákazníka (hostitelský účet) a seznam ProfilZakaznika (zatím neexistuje, použijí se výchozí hodnoty). Seznam ProfilZakaznika: Title, Email (více adres oddělených čárkou), Nazev, Barva (#rrggbb), Logo (https), Uvitani, Moduly (prehled,zakazky,cekani,terminy,kontakt), KontaktJmeno, KontaktEmail, KontaktTelefon.

Firmy (2026-11-22): seznam Firma na webu ZakazkyELZA je kopie číselníku ciselnik_firma (Implementace365), 7 967 položek, stejné sloupce (Firma_Kod, Firma_Nazev, Firma_ICO, Firma_Email, Firma_Misto, Firma_PSC, Firma_Ulice, Firma_Deleted; RowNo = ID ve zdroji). Zdroj se jen čte, nikdy se do něj nezapisuje. 33 kódů se ve zdroji opakuje, kód není jedinečný klíč. Další synchronizace jen jednosměrně zdroj → Firma.

0.38.0: Synchronizace firem. Zjištění ze zdroje (2026-11-22): 7 967 řádků, ID 688806–696772 vzniklo hromadně 19. 11., Firma_Modify a Agenda_ID prázdné, Title je jedinečný GUID (klíč), Firma_Kod a Kod+IČO nejsou jedinečné. Čeká se na noční aktualizaci ze SQL: otisk uložen 22. 11. 21:48 v prohlížeči (localStorage firmaSnapshot); po ní v modulu uvidíš, zda se Title a ID drží. První synchronizace opraví RowNo (při kopírování bylo omylem ID ze zdroje).
0.38.1: při kopírování firem jsem do Firma.Title omylem zapsal ID ze zdroje místo GUID; porovnání to odhalilo (Synchronizace firem by vytvořila duplicity), Title opraven jednorázově na GUID a modul má pojistku (odmítne synchronizaci, když se klíče shodují u méně než 50 % záznamů).
2026-11-22 22:30: první synchronizace Firma proběhla (7 966 oprav RowNo), porovnání zdroj/Firma po ní 0 / 0 / 0. Denní automatika je vypnutá, zapne se po rozhodnutí o způsobu kontroly.

0.39.0: modul Lidé a školení (týmy, školení s platností, obsazení zakázek s jedním vedoucím akce), seznamy Tym, Clen, SkoleniTyp, Skoleni, Obsazeni na Zakázky ELZA (docs/SEZNAMY-LIDE.md). Čtení po dávkách bez limitu 5000. Neověřeno na ostrých datech, dokud nejsou seznamy založeny a naplněny; synchronizace zaměstnanců z Implementace365 později.

0.39.1: portál čte živá data z PortalELZA2 (Prehled, Milniky, Cekani, Dokumenty; v nich jsou zatím testovací zakázky TEST-001 až 003, ZK0001, DEMO-001). Přidány Dokumenty a Postupy. Přihlášení skutečného zákazníka stále neověřeno (ověřeno účtem pracovníka).

0.40.0: portál má Kontroly a revize, Dokumenty podle životního cyklu (předávací balíček), Pomoc a poruchy (e-mail), Postupy; Správa → Publikace do portálu. Help desk jako zápis do seznamu (Pozadavek, tok T13) čeká na rozhodnutí o oprávnění portálu. Seznam Kontroly na PortalELZA2 se zakládá tlačítkem v aplikaci (zatím nezaloženo). Seznamy Lidé a školení také nezaloženy.

0.41.0: upozornění zákazníka na nevyhovující výsledek (portál + Publikace do portálu). Navazuje docs/NABIDKY-NAVRH.md (seznam Nabidky, osoby zákazníka): nabídky zpracovává obchodní oddělení, aplikace je jen eviduje; automatické založení poptávky (případ) a upozornění e-mailem čekají na rozhodnutí o oprávnění portálu a tok T13.

0.41.1: semafor školení v Přehledu; rozhodnutí DEC-045 až DEC-047 v docs/ROZHODNUTI-2026-11-22.md.

0.42.0: protokol a nabídka nápravy odcházejí společně (DEC-048).

0.43.0: ochrana proti vloženým pokynům (docs/OCHRANA-NAVRH.md), Hlídané termíny v Můj den, úkoly ke školením, úkol obchodu při nevyhovující kontrole. Neověřeno na ostrých datech (ostrý test pošty s podezřelým e-mailem na testovací adresu; zápis úkolů klepne Tomáš). Seznamy Lidé a školení a Kontroly na PortalELZA2 stále nezaloženy.

0.44.0: Strážce kódu a sdílená ochrana (docs/OCHRANA-NAVRH.md). Čeká: první schválení základu otisků ve štítku 🛡 (po nasazení), ověření na živém webu, GitHub 2FA a ochrana větve (vlastník).

Vlákno 2026-11-23 večer uzavřeno ve verzi 0.45.1; nic nerozpracováno. Zadáno na další vlákno: zaměstnanci z ciselnik_zamestnanec (bod 13). Pozn.: ostrá kontrola 0.45.1 proběhla v prohlížeči přihlášeném testovacím účtem do portálu; verze 0.45.1 čeká na schválení vlastníkem ve štítku 🛡.


0.46.0 (2026-11-23): Synchronizace zaměstnanců (zamestnanec.js). Zdroj ciselnik_zamestnanec: 106 záznamů, Title jedinečný GUID, OsCislo se opakuje u 33, Agenda_ID 1 až 3, Deleted vždy 0. Plán fází bere lidi z kopie. Seznam Zamestnanec zakládá tlačítko ve Správě; první synchronizaci spustit v aplikaci a po ní schválit verzi ve štítku 🛡.

Pozn. 2026-11-23: dřívější věta „osobní číslo není klíč“ platí jen pro řádek; jako klíč osoby se osobní číslo hodí (stejný člověk ve více agendách), viz DALSI-KROKY 13b.
