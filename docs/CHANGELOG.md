## 0.78.1 (2026-11-26) – Doplnění schématu seznamů
- Správa → Seznamy a skript pro SharePoint používají stejnou kontrolu. Doplňují chybějící seznamy, sloupce a indexy, zvládnou opakování po chybě a ověřují výsledek. Ukol zahrnuje pole ZavisiNa a Milnik pro plán zakázek.
- Ověřeno na testovacích datech včetně přerušeného zápisu, opakování a chybějícího indexu po zdánlivě úspěšném zápisu. Prošlo 22 testovacích souborů JavaScriptu, 7 prohlížečových testů a audit vazeb. Produkční schéma Ukol čeká na ověření.

## 0.78.0 (2026-11-25) – Jednotné měřáky limitů
- Tomáš: měřáky limitů sjednotit, malé, přehledné, nepřekážející, vždy všechny napojené AI. Jeden prvek (.mr v ai.js: název, procento, obnova, tenký pruh) a jedna sada AI.sada() (Claude 5 h a 7 dní, Codex okna, je-li napojen nebo už použit) se používá na třech místech: Můj den, menu pod názvem aplikace a AI nastavení; dřívější tři různé podoby (velké dlaždice, bloky v menu, kruhy) i jejich styly jsou smazané. Barva: zelená, oranžová od 80 %, červená od 95 %; nedostupné = pomlčka s důvodem v tooltipu, nikdy nula; klepnutí otevře AI nastavení. Doporučení při 80 % beze změny (nic se nepřepíná samo).
- Ověřeno: node test/*.test.js (nové případy měřáku), e2e-demo, vzhled, průvodce, audit. Neověřeno: vzhled na ostrém webu (prohlížeč přihlášen testovacím účtem?), Ollama není v měřácích (nemá limit).

