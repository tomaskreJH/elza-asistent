# EspoCRM jen čtením (bod C)
Stav 2026-11-23 (0.54.1): připraveno, nezapojeno. Aplikace do ESPO nic nezapisuje a nebude.

## Co už funguje bez napojení
- Případ má pole „ID v ESPO“; pošta s tímto ID se připojí k případu sama, ID je v hledání.

## Jak napojit (jediná bezpečná a bezplatná cesta)
1. Správce ESPO založí uživatele typu **API** s rolí jen pro čtení (Účty, Kontakty, Případy, Smlouvy: Read = all, Create/Edit/Delete = no). Klíč vytváří a uchovává jen správce, do aplikace ani chatu se nevkládá.
2. Tok Power Automate (HTTP GET na /api/v1/Case, /Account, /Contract s klíčem v zabezpečeném vstupu toku) jednou denně přepíše kopii do seznamů EspoPripad, EspoObjekt, EspoSmlouva na webu ZakazkyELZA.
3. Aplikace čte jen tyto kopie (žádná nová doména v CSP, klíč nikdy v prohlížeči). Teprve potom se schéma doplní do seznamy.js a zobrazení do Případů a Zakázek (žádný nový modul).

## Proč ne přímo z prohlížeče
API klíč by byl v prohlížeči každého uživatele a ESPO by muselo povolit CORS; to je proti pravidlu „bezpečnost před pohodlím“.

## Co je potřeba od Tomáše
Adresu ESPO a rozhodnutí, kdo jako správce ESPO založí čtecího API uživatele. Bez toho se dál nepokračuje.
