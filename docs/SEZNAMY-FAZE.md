# Seznamy Plánu fází (web Zakázky ELZA, verze 0.48.0)
Zakládá je tlačítko v aplikaci (Plán fází, dole: Založit chybějící seznamy), po vašem klepnutí. Textové sloupce jsou jednořádkový text (Param, Obsazeni, Start jsou víceřádkový text s JSON), názvy bez diakritiky, (I) = indexováno. Nic se nemaže, zrušené záznamy mají Stav = zruseno.
- **Osoba**: Title (osobní číslo, klíč osoby) (I), Jmeno, Email (I), Stav. Potvrzený e-mail osoby.
- **Kvalifikace**: Title (jméno), Email (I), Typ (I; OZO PO, OZO BOZP, Projekt, PZTS, EPS, Revizní technik), Platnost (datum, prázdné = bez omezení), Stav.
- **PlanFaze**: Title (kód zakázky), Typ (pilot / retez), Param (JSON: množství, koeficienty), Obsazeni (JSON: fáze → lidé), Start (JSON: fáze → pevný den), Stav. Jeden řádek na zakázku, uložení = úprava téhož řádku.
- **ZaznamFaze**: Title (kód:fáze:pořadí), Plan (kód zakázky) (I), Faze, Osoba, Hodiny, Jednotek, Den, Duvod, PlanH, Stav. Realita fáze, plán se po zápisu nemění.
- **Norma**: Title (typ:fáze), Typ (I), Faze, Fix, Per, Zdroj, VzorkuN, Stav. Přepisuje výchozí normu jen po schválení vedoucím.
Zápis obsazení jde do existujícího seznamu Obsazeni (Lidé a školení; docs/SEZNAMY-LIDE.md); ten se zde nezakládá.
