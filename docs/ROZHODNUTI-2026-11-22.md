# Rozhodnutí a úvahy, vlákno 2026-11-22 (večer)
## DEC-045 Týmy, lidé, školení (modul Lidé a školení, 0.39.0)
- Vedoucí má pod sebou týmy (EPS, PZTS, OZO PO, revizní technici). Člověk může být ve více týmech: řádek Clen = člověk v týmu, identita podle e-mailu. Důvod: jednoduché, bez vazebních tabulek, pozdější synchronizace z Implementace365 podle e-mailu.
- Kvalifikace jsou katalog SkoleniTyp (technologie, výrobce, ústředna, předpis) s platností v měsících a záznam Skoleni (kdo, co, kdy, platnost do). Obsazení zakázky dvoukrokově: tým a počet, potom lidé podle platnosti školení k datu konce zakázky a volnosti (překryv Od–Do). Na zakázce je právě jeden vedoucí akce (vynuceno v aplikaci).
- Vědomé přidělení i bez kvalifikace je možné jen zaškrtnutím (vedoucí odpovídá), aby aplikace nebrzdila práci, ale nic se nestalo omylem.
- Nic se nemaže, jen Stav=zruseno (dohledatelnost a bezpečnost).
## DEC-046 Limity SharePointu
- Seznamy se nikdy nečtou celé: dávky po 500 podle Id (filtr Id gt, řazení podle Id), indexované sloupce (Title, Tym, Email, Typ, PlatnostDo). Velké seznamy (Firma, 7 967) jen po částech nebo z lokální mezipaměti, obdoba kolekcí z Power Apps. Zápis po jedné položce nebo dávkách.
## DEC-047 Portál zákazníka (0.39.1 až 0.41.0)
- Životní cyklus dokumentů: složka zakázky v knihovně Dokumenty (PortalELZA2) s podsložkami Dokumentace, Navody, Protokoly, Predani; dokumenty vznikají od začátku zakázky a předávací balíček je to, co je naplněno na konci (ukazatel x ze 4).
- Kontroly: seznam Kontroly na PortalELZA2 je zveřejněná kopie, zdroj Kontrola (Zakázky ELZA) se jen čte; zveřejňuje se zaškrtnutím. Protokol se páruje podle kódu kontroly na začátku názvu souboru.
- Help desk zatím e-mailem připraveným z formuláře (portál nic nezapisuje, zákazník má jen čtení). Zápis do seznamu Pozadavek a tok T13 čekají na rozhodnutí o oprávnění portálu.
- Nevyhovující výsledek: výrazné upozornění, závady, doporučení, postup, tlačítko žádost o nabídku (e-mail kontaktu; cenu řeší obchod) a zadání pro AI zákazníka. Nelze zveřejnit bez doporučení. Kdy sami nabídnout neumíme: doporučení nebo AI zadání pomůže zákazníkovi problém řešit.
- Přehled (velín) ukazuje školení po platnosti a vypršení do 90 dní (0.41.1).
## Náklady
Nic placeného: seznamy SharePointu v licenci M365, žádné AI volání, žádné nové toky, žádné API.
## Blokováno, čeká na člověka
- Založení seznamů (Tym, Clen, SkoleniTyp, Skoleni, Obsazeni na Zakázky ELZA; Kontroly na PortalELZA2): zakládání na ostrém webu mi automatický režim zablokoval, proto tlačítka v aplikaci (Lidé a školení, Publikace do portálu).
- Oprávnění portálu pro zápis zákazníka; přihlášení skutečného zákazníka; souhlas správce pro Copilot.
## Další krok
Viz docs/DALSI-KROKY.md body 7 až 10 a docs/NOVE-VLAKNO-PROMPT.md.
