# Seznamy pro Gantt, smlouvy a kontroly (web Zakázky ELZA)
Aplikace seznam nezakládá sama (nemá oprávnění správy webu). Dokud seznam chybí, modul to napíše a nespadne. Sloupce (názvy bez diakritiky, jak je čte aplikace):
- **Ukol**: Title (název), KodZakazky (text, např. Z-2026-014), Resitel (text), Od (datum), Do (datum), Hotovo (číslo 0–100), ZavisiNa (text), Milnik (text), Poznamka (víc řádků).
- **Smlouva**: Title (SML-RRRR-NNN), Zakaznik (text), Od, Do (datum), TypServisu (text), Odpovedny (text).
- **Technologie**: Title (TEC-NNN), Smlouva (text, kód smlouvy), Objekt, Typ (EPS, EZS, PCO, hromosvod…), Vyrobce.
- **Kontrola**: Title, Technologie (text, kód), Druh (revize / kontrola provozuschopnosti / servis), PeriodaMesice (číslo), PristiTermin (datum), PosledniKontrola (datum), Predpis (text), Odpovedny (text).
- **Milniky** už existuje (Title, TerminPlan, TerminOdhad, Stav, Publikace, KodZakazky).
Zápis jde přes oprávnění AllSites.Write přihlášeného uživatele, takže stačí, aby měl na webu právo upravovat položky.
