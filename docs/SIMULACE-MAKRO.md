# Simulace případu MAKRO (WORK-20261124-0001), 2026-11-24
Zdroj: ostrá konverzace (jen čtení). Nálezy a návrh automatizace; komentáře Tomáše se doplní sem.
1. 11. 9. poptávka od zákazníka na společnou schránku elzy@ (recepce) → 14. 9. přeposláno řediteli, Tomášovi a Radimovi. Nález: případ vznikl až 24. 11. z poslední zprávy, vznik má být první zpráva. Návrh: ELZA zakládá případ ze společné schránky hned a přiřadí odpovědného.
2. 15. 9. ředitel postrčí obchod („zadej někomu odpověď a prezentaci“). Nález: role odesílatele se nerozlišovala; od 0.70.1 je vidět (ředitel / obchod / vedoucí techniků / zákazník).
3. Obchod pošle nabídku (paušál + montáž, požadavky, dotazy k instalaci) na základě ústního vysvětlení Tomáše. Návrh: ELZA ze šablony PCO připraví obchodu konceptu nabídky a seznam dotazů; cenu dělá obchod.
4. 13. 11. zákazník vybere ELZY, ptá se na upřesnění a další náklady → Tomáš volá. Nález: telefonát je vidět jen v e-mailu obchodu. Návrh: tlačítko Zapsat hovor (kdo, výsledek, co má obchod poslat) jako záznam v časové ose.
5. 13. 11. Tomáš předá obchodu výsledek hovoru: dokumentaci zdolávání požáru si zajistí zákazník, servis PS mají, nemají KTP ani OPPO, typ ústředny nezjištěn. Interní stav PCO to čte (❌ KTPO, OPPO).
6. 20. 11. obchod přepošle termín obhlídky; 23. 11. Tomáš kvůli kolizi v kalendáři (čtvrtek) pošle technika Jana Kostku, zákazník 24. 11. potvrdí středu 25. 11. 9:00. Nález: Obhlídka byla chybně ✅ (opraveno na ⏳ v 0.70.1). Návrh: ELZA při návrhu termínu zkontroluje kalendář Tomáše i techniků, navrhne rozhodnutí posunout / jiný technik a po potvrzení zákazníka zapíše termín do kalendáře Kostky.
7. 25. 11. obhlídka: modul Na obhlídce (0.70.0) → zpráva zákazníkovi, úkol pro obchod. Další: fotky do složky zakázky, nabídka obchodu ještě na místě, portál.
8. Po obhlídce: ELZA ověří úplnost podkladů (PBŘ, DZP, kontakty, dvě přenosové cesty) a navrhne další krok.

## Stav automatizace po 0.71.0
Krok 3 (koncept nabídky, cenu doplňuje obchod), 4 (Zapsat hovor), 6 (kalendář a přidělení technika, bez zápisu do kalendáře), 2 (koncept odpovědi podle role), 7 (fotky do složky) a 8 (ověření podkladů: fakta a závislosti v Procesu nabídky) jsou v modulu Proces nabídky; krok 1 (založení případu ze společné schránky) a zápis do kalendáře zbývají. Zadání Tomáše k obchodu a procesu: docs/PROCES-NABIDEK.md.
