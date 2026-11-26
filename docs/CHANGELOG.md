0.82.1 – V AI záznamu doplněn graf měsíčních počtů volání a chyb podle nástroje. Galerie Elzáčků zachová svislou pozici po přidání nebo odebrání. Inspirace: AI_TOM, náklady uvádí odhady a u PCO popisuje fáze a odpovědné osoby. Připraven scénář videa docs/VIDEO-SCENAR-PCO.md.

0.82.0 – ELZY asistentka v Poště automaticky ukazuje odhad typu zprávy z náhledu. Filtry a řazení se rozbalují pod hledáním, zprávu lze otevřít klávesnicí. Další krok: propojit prioritní zprávu v Můj den přímo s interním čtecím panelem.

## 0.81.3 (2026-11-26) – Pracovní Elzáčci dostupní vlastníkovi

Devět balíčků role je dostupných vlastníkovi bez přidávání z Galerie. Nastavení stávajících rolí má přednost. Pošta nabízí více specialistů a před předáním pošty zobrazí náhled.

## 0.81.2 (2026-11-26) – Pilot starší pošty a pracovní okno

Pošta umožňuje procházet sedmidenní dávky s uloženým obdobím. Oznámení z Espa navrhnou případ podle doloženého názvu. Můj den při otevření a průběžně během zobrazení ukazuje prioritní doručené zprávy a nabídne 25 minut podle kalendáře.

## 0.81.1 (2026-11-26) – Pošta nejdřív ověřuje vazbu k případu

Přehled u každého vlákna ukáže stav vazby a důvod. Jednoznačný kód případu nebo zakázky umožňuje automatické přiřazení. Shoda kontaktu či objektu je návrh k posouzení. Po otevření zákaznické zprávy lze přes Elzáčka připravit návrh odpovědi s ohledem na potvrzenou vazbu.

## 0.81.0 (2026-11-26) – Přehled více vláken a Elzáčci v Poště

Rozebrat přehled roztřídí načtená vlákna podle aktuálního filtru. Výsledek otevře celé vlákno s volbou aktivního specialisty a povinným náhledem. Karta PCO v komunikaci uvádí nalezené zmínky a otevřené otázky odděleně od potvrzeného stavu případu.

## 0.80.9 (2026-11-26) – Úpravy odpovědí přímo v případu

Detail případu zobrazuje otázky zákazníka. Odpověď a její kanál lze zapsat i později upravit v existující položce SharePointu. Chyba oprávnění nebo chybějící položka se zobrazí přímo u formuláře. Správa seznamů rozlišuje právo zápisu položek a správu schématu.

## 0.80.8 (2026-11-26) – Otázky z přeposlaných vláken

Rozbor hledá v načtených zprávách prvního externího odesílatele. Zachovává odrážky z HTML a najde i požadavky typu „potvrzení“ a „specifikaci“ bez otazníku. Při prázdném výsledku Pošta vysvětlí, jak načíst zprávy k opakování rozboru.

## 0.80.7 (2026-11-26) – Otázky z Pošty a zápis hovoru

V přiřazeném vlákně lze zkontrolovat a přidat nalezené otázky z načtených plných zpráv původního odesílatele. Již evidované otázky se při opakovaném přidání přeskočí. Zapsat hovor přidá poznámku a minuty do časové osy případu a připomene nezodpovězené otázky.

## 0.80.6 (2026-11-26) – Přímý přechod z Pošty do případu

Po otevření přiřazeného vlákna vede tlačítko Otevřít případ rovnou do jeho detailu a průběhu komunikace.

## 0.80.5 (2026-11-26) – Oprava otevření AI nastavení

AI nastavení zobrazí okna Claude, pro která má platná čísla. Otevře se i při samotném týdenním odečtu z mostu.

## 0.80.4 (2026-11-26) – Týdenní zůstatek AI a návrat odečtu Claude

Most 4 ukládá čas obnovy a procento z události běžné odpovědi Claude Code. Přehled se obnovuje místně při přihlášení a po dokončení běhu. V menu pod hlavními zkratkami jsou pouze týdenní zůstatky. Zelená značí běžný stav, oranžová nejvýše 20 % zbývá a červená nejvýše 5 %. Podrobnosti jsou v AI nastavení.

## 0.80.3 (2026-11-26) – Připojení a limity AI v menu

Menu, Můj den a AI nastavení sdílejí jeden přehled. Odečty se načítají při přihlášení a po výsledku AI bez časovače. U předplatného Claude lze uložit ruční stav z /usage pro 5 hodin a 7 dní s časem obnovy. U Codexu je uvedené stáří dostupného místního odečtu. U placených API se zobrazuje odhad vůči měsíčnímu stropu ELZY.

## 0.80.2 (2026-11-26) – Funkční kontrola lokálního mostu během práce

Most 3 odděluje obsluhu HTTP od práce modelu a diagnostiky. Stav je dostupný i při běhu noční úlohy. Most obslouží jeden model najednou. Claude a Codex dostanou na odpověď 90 sekund. Nedokončená úloha po restartu se označí jako přerušená, aby se model znovu nespustil.

Instalátor ověřuje autentizovanou HTTP odpověď. Zachovává ochranu Windows a RemoteSigned. Most už nečte přihlašovací soubor Claude a neobnovuje limity zkušebním voláním. Stav využití je k dispozici v Claude pod /usage. V ELZE lze rozlišit nepřístupný most, neplatné párování a obsazený model.

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

