# Seznamy pro Lidé a školení (web Zakázky ELZA)
Zakládá je tlačítko v aplikaci (Lidé a školení → Založit chybějící seznamy), nebo ručně. Všechny textové sloupce jsou jednořádkový text, názvy bez diakritiky. Indexovat sloupce označené (I), kvůli limitu 5000 položek při filtrování. Nic se nemaže, zrušené záznamy mají Stav = zruseno.
- **Tym**: Title (kód, např. EPS) (I), Nazev, Vedouci, Stav.
- **Clen** (jedna řádka = člověk v týmu; stejný e-mail může být ve více týmech): Title (jméno) (I), Email (I), Tym (I), Role, Stav.
- **SkoleniTyp** (katalog: technologie, výrobce, ústředna, předpis): Title (kód, např. EPS-ESSER) (I), Nazev, Oblast, Tym (prázdné = všechny), PlatnostMesice (číslo), Stav.
- **Skoleni** (absolvovaná školení): Title (e-mail člověka) (I), Typ (kód) (I), Absolvovano (datum), PlatnostDo (datum) (I), Stav.
- **Obsazeni** (člověk na zakázce): Title (kód zakázky) (I), Tym (I), Email (I), Jmeno, VedouciAkce (ano/ne), Od, Do (datum), Stav.
Pravidla: na zakázce je právě jeden vedoucí akce; obsazenost se hlídá podle překryvu Od–Do; kvalifikace platí, pokud PlatnostDo pokrývá celé období zakázky.
Synchronizace zaměstnanců z číselníku v Implementaci365 (podle e-mailu, jen čtení zdroje) přijde až po odzkoušení se zákazníky.
## Náklady
Žádné: nic placeného, jen seznamy SharePointu ve stávající licenci M365, čtení po dávkách (malé objemy), žádný nový tok Power Automate, žádné AI volání, žádné API.
