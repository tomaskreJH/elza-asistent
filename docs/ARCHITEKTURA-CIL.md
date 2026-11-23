# Cílová architektura ELZY (rozhodnutí 2026-11-23)
Podklad: čtení EspoCRM (jen čtení) a SharePointu, dokument "ELZA: cílový systém řízení zakázek, lidí a plánování".
1. **Nic se nekopíruje.** Staré CRM a stará dokumentace zůstávají jako archiv jen ke čtení. Nová struktura vzniká od nuly a nepřebírá fáze CRM jako složky. Přenos je výjimka, jen to, co se bude používat, a až po schválení po dávkách.
2. **Souborová struktura zůstává** (složky a soubory otevřené v jakémkoli programu): OBJxxxxx / PRxxxxxx / role dokumentu / typ. Trvalé dokumenty objektu (provoz, kontroly) leží u objektu. Pravidla: struktura.js, test: test/struktura.test.js.
3. **Role dokumentu:** vstup (od zákazníka, projektanta, úřadů), pracovní (tvoříme pro sebe), výstup (pro provedení, skutečné provedení, provozní, kontrolní, předání). Každý dokument nese objekt, zakázku, roli, typ, verzi, stav a platnost.
4. **Analýza vstupu** (analyza.js): pozná druh a technologii, navrhne postup, dokumenty a kvalifikace, upozorní na chybějící; zatím pravidlově, AI vrstva po souhlasu správce.
5. **Učení bez zapomínání:** postup má verze; zpětná vazba po krocích; po opakování návrh nové verze; schválením vznikne nová verze, stará zůstává v historii.
6. **Zdroje předpisů a norem** (stavební zákon, HZS, ČSN) doplňuje odborně vedoucí do pole zdroj u požadavku; Elza je nevypisuje z paměti a upozorní na požadavek bez zdroje.
7. **Měření času** z událostí (zahájení, příchod, hotovo), na úrovni týmu, oboru a firmy; ne hodnocení jednotlivců.
Další: docs/DALSI-KROKY.md.
