## 0.80.1 (2026-11-26) – Menší zápisy při synchronizaci firem
- Firma sleduje obchodní pole a příznak odstranění bez RowNo. U existujících firem posílá jen změněné hodnoty. Záznam, který zmizel ze zdroje, mění jen příznak odstranění. Nový ruční pokus nejdříve znovu porovná obě strany. Přehled uvádí počty podle polí.
- Zkontrolovat most rozliší dosažitelnou službu bez spárování, odmítnutý původ a chybějící odpověď místního portu.

## 0.80.0 (2026-11-26) – Směrování AI a navigace podle práce
- Codex nabízí GPT-6 Luna, GPT-6.2 Sol a GPT-6.2 Astra. Krátká práce volí Lunu, automatika nezapíná Astru. Při dostupném limitu nad 95 % se dražší živé volání odloží výslovnou chybou. Předvolby zachovávají poskytovatele. Stejná uložená volba platí pro Zkusit.
- Noční fronta zachovává vybraný nástroj a model včetně Codexu a odmítne nepodporované nastavení.
- Elzáčci ukazují skutečné nastavení a vstup do práce. Automatický výběr chatu volí instalované Elzáčky. Přehled řadí naléhavé kroky před souhrny, mapa zobrazuje vstupy a výstupy kolem vybraného uzlu a doplňkové položky jsou u souvisejícího modulu.

## 0.79.2 (2026-11-26) – Náhled pro každé shrnutí pošty
- Povinný náhled v Poště má pouze potvrzení pro právě otevřené vlákno a zamítnutí. Ověřeno v ostré Poště 0.79.1: pravidlový rozbor jednoho přečteného vlákna a otevření náhledu. Obsah vlákna nebyl předán modelu.
- Nastavení ranní kontroly je v rozbalovací části. Pole a tlačítko u nevyřízených zákaznických otázek jsou zarovnané na počítači i mobilu.

## 0.79.1 (2026-11-26) – Použitelná analýza pošty a klidnější Můj den
- Pošta nabízí základní analýzu vlákna bez modelu s návrhem dalšího kroku a s rozsahem podkladů. Shrnutí Elzáčkem vždy ukáže náhled s nástrojem před předáním obsahu.
- Analýza vstupu přidává kontrolu dostupnosti podkladů a seznam požadavků se stavem zdroje. Odborná kontrola obsahu a platnosti norem zůstává samostatným krokem.
- Můj den má další kroky nahoře a podrobnosti v rozbalovacích částech. V menu je jeden vstup k Návodu, kratší názvy Nabídek a Úvodního nastavení. Sjednoceny hlavní nadpisy, řady ovládacích prvků a okraje.

## 0.79.0 (2026-11-26) – Můj den a čitelné procesy
- Můj den vede po schválení přímo k poště, případům, zakázkám a práci na místě podle dostupných modulů. Chat a zadání úlohy mají společné rozbalovací místo.
- Procesy řadí kroky podle závislostí do etap. U kroku uvádějí stav, roli, nástroj a předpoklady. Smyčky a chybějící vazby jsou viditelné. Aktualizován Návod a Průvodce.

## 0.78.1 (2026-11-26) – Doplnění schématu seznamů
- Správa → Seznamy a skript pro SharePoint používají stejnou kontrolu. Doplňují chybějící seznamy, sloupce a indexy, zvládnou opakování po chybě a ověřují výsledek. Ukol zahrnuje pole ZavisiNa a Milnik pro plán zakázek.
- Ověřeno na testovacích datech včetně přerušeného zápisu, opakování a chybějícího indexu po zdánlivě úspěšném zápisu. Prošlo 22 testovacích souborů JavaScriptu, 7 prohlížečových testů a audit vazeb. Produkční schéma Ukol čeká na ověření.

## 0.78.0 (2026-11-25) – Jednotné měřáky limitů
- Tomáš: měřáky limitů sjednotit, malé, přehledné, nepřekážející, vždy všechny napojené AI. Jeden prvek (.mr v ai.js: název, procento, obnova, tenký pruh) a jedna sada AI.sada() (Claude 5 h a 7 dní, Codex okna, je-li napojen nebo už použit) se používá na třech místech: Můj den, menu pod názvem aplikace a AI nastavení; dřívější tři různé podoby (velké dlaždice, bloky v menu, kruhy) i jejich styly jsou smazané. Barva: zelená, oranžová od 80 %, červená od 95 %; nedostupné = pomlčka s důvodem v tooltipu, nikdy nula; klepnutí otevře AI nastavení. Doporučení při 80 % beze změny (nic se nepřepíná samo).
- Ověřeno: node test/*.test.js (nové případy měřáku), e2e-demo, vzhled, průvodce, audit. Neověřeno: vzhled na ostrém webu (prohlížeč přihlášen testovacím účtem?), Ollama není v měřácích (nemá limit).

