# Seznam Zamestnanec (web Zakázky ELZA)
Kopie číselníku ciselnik_zamestnanec (Implementace365). Zdroj se jen čte, nikdy se do něj nezapisuje. Založeno 2026-11-23 přihlášenou relací vlastníka přímo na SharePointu, protože tlačítko v aplikaci potřebuje oprávnění AllSites.Manage (souhlas správce, který se nežádá).
Sloupce: Title (GUID ze zdroje, klíč, indexovaný), Zamestnanec_OsCislo (text, indexovaný, neunikátní), Zamestnanec_PrijmeniJmeno (text), Agenda_ID (text), Zamestnanec_Deleted (ano/ne), RowNo (číslo, ID ve zdroji).
Synchronizace: Správa → Synchronizace zaměstnanců (jen AllSites.Write, žádný souhlas správce navíc). Zdroj má 106 záznamů, Deleted ve zdroji je text.
Náklady: žádné.
