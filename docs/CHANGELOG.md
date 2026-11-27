0.88.6 – Kalendář: skupiny k účtu a týmy z Lidé (2026-11-27): 1) Skupiny sdílených kalendářů se ukládaly jen do paměti jednoho prohlížeče, proto na jiném PC, telefonu nebo v jiném prohlížeči chyběly. Nově se ukládají k účtu do ZnalostElza (Druh kal_skupiny, Klic kal_skupiny:účet), platí všude; dřívější skupiny z prohlížeče se při prvním otevření převedou. 2) Tlačítko Seskupit podle týmů z Lidé: vlastník sdíleného kalendáře se spáruje s členem týmu (Clen, podle e-mailu, jinak jména) a doplní se název týmu; uloží se až po kontrole. Týmy se spravují v Lidé, kalendář je přebírá. 3) Návod: nová kapitola Kalendář (dosud chyběla), vazba v kapitole Lidé. 4) Ukázkový režim respektuje odkaz #v=obrazovka. Ověřeno: všechny node a Python testy, Kalendář v prohlížeči 1400 a 390 px.

0.88.5 – Opravy a Prioritní pošta (2026-11-27): 1) Klepnutí na zprávu v Prioritní poště (Můj den) otevře vlákno přímo ve čtecím panelu Pošty, odkaz Outlook ↗ zůstává. 2) Oprava: moduly četly přihlášeného uživatele přes window.acc, ale acc je v app.js deklarované přes let, takže bylo vždy prázdné. Nezapisovalo se Kdo/Schválil/Vedoucí (analyza, lidi, rano, proces), nefungovalo řazení „vaše nabídky nahoře“ (nabidky) ani me() v nocni, teren a zakaznik, a obsazenost kalendářů v Procesu se nikdy nečetla (window.m). 3) Pošta bez přihlášení (ukázka) místo technické chyby MSAL píše „Zařazení k případům se ukáže po přihlášení firemním účtem“. Ověřeno: všechny node a Python testy, Pošta v prohlížeči 1400 a 390 px.

0.88.4 – Kontrola a oprava (2026-11-27): integrity.json v 0.73.4 a 0.88.3 byl vygenerován z kopie s převedenými konci řádků (CRLF na Windows), otisky nesouhlasily se soubory na GitHubu (97 ze 102) a Strážce by hlásil změnu kódu. Přidán .gitattributes (* -text, bajtově přesné soubory), integrity.json přegenerován z LF. stable/vzhled.js sjednocen s kořenem. Pád vzhled.py („msal is not defined“) byl jen místní artefakt CRLF, SRI msal je správně (shoduje se s oficiálním 2.38.2).

0.88.3 – Verze bez změny funkcí (2026-11-27): nasazení stavu 0.88.2. Skica budovy se zatím nevkládá do e-mailu ani do nabídky; zadání Tomáše: skica patří do vytvořené nabídky podle vzoru konkurence (odloženo, dokud se neupřesní).

0.88.2 – Automatické přiřazení pošty podle kódu případu čte u zpráv bez kódu v náhledu celé znění (nejvýš 12 zpráv za běh, jen čtení, ochranná kontrola platí i pro celý text).

0.88.1 – Most (na pokyn „uprav most“ 2026-11-27): instalátor elza-most-instalace.ps1 nově 1) ukončí každý běžící most bez ohledu na cestu (např. spustit-most.cmd ze sdílené složky, starý autostart) i okna cmd se spustit-most; takový most držel port a po zavření viditelného okna přestala fungovat AI, 2) odstraní staré autostarty mostu (soubory ve složce Po spuštění, jiné hodnoty Run a RunOnce, naplánované úlohy s názvem nebo akcí mostu); zůstává jediný autostart, Run klíč ElzaMost se skrytým oknem, 3) restartuje most skrytě, pokud běžel ve viditelném okně, a upozorní, když Windows skrytí ignoruje. elza-most-overeni.ps1 hlásí jiné cesty mostu, viditelné okno, další autostarty a naplánované úlohy. elza-most.ps1 beze změny. Žádné VBS, Add-Type, EncodedCommand ani stahování a spouštění z internetu. Nic neověřeno na Windows (overeni.txt ze stanice rozhodne).

0.88.0 – Přiřazování pošty k případům a čtení e-mailů. 1) Každý e-mail se čte celý: otevřené vlákno dočte těla všech zpráv (nejvýš 8), Rozebrat přehled čte celé znění nejnovější zprávy každého vlákna (nejvýš 60), ranní analýza čte celé zprávy (nejvýš 80, 6000 znaků), dosud se používal jen náhled 255 znaků. 2) Bodovaná shoda místo „adresa musí být v klíčových slovech“ (vlakno.js vazbaSkore): kód, adresa odesílatele i dalších účastníků vlákna (od, komu, kopie), firemní doména, slova z názvu případu a klíčová slova v celém textu, dříve potvrzená rozhodnutí o odesílateli a poznámky; uzavřený případ má postih; návrh ukazuje body a důvody, předvybere se od 60 bodů. 3) Poznámky k vláknu se ukládají trvale do ZnalostElza (Druh poznamka_posty) a načítají se na všech zařízeních; z poznámky se učí i odesílatel (UCENI) a poznámky vstupují do shody. Testy: vlakno, poznamka-trvale.

0.87.1 – Oprava: poznámky k poště z doby před 0.82.2 (uložené u adresy odesílatele v elzaUceni a ve ZnalostElza) se po změně ukládání v 0.82.2 (26. 11. 23:06) v Poště přestaly ukazovat, ač nikam nezmizely. Pole Poznámka k vláknu je nyní nabídne, dokud vlákno nemá vlastní poznámku; uložením se přiřadí k vláknu. Test v test/poznamka-vlakna.test.js.

0.87.0 – Detail případu: blok Skica budovy z fotky zákazníka. Fotky se hledají ve složce objektu na webu Zakázky ELZA (Podklady objektu / Fotky a podklady od zákazníka), ne z portálu; co tam není, vloží člověk ručně. Kód OBJ se předvyplní z údajů případu. Nové SDL.blob (jen čtení souboru). Test test/skica.py.

0.86.0 – Skica budovy z fotky zákazníka (skica.js): u obrázkové přílohy v Poště tlačítko Skica budovy; kresba z hran fotky se vytvoří v prohlížeči (bez AI a bez nákladů, nic se neukládá ani neposílá) a jde stáhnout jako PNG. Testy: test/skica.test.js, test/skica.py. Fotka ze stránek zákazníka zatím nejde (viz DALSI-KROKY).

0.85.1 – Koncept první odpovědi upozorní, že zákazník zatím není v evidenci, a odkáže na Krok 0 (Kdo je zákazník). Obrázek budovy z portálu se u nové poptávky nepoužívá (objekt ještě neexistuje); jen u evidovaného objektu.

0.85.0 – V detailu případu je tlačítko Koncept první odpovědi zákazníkovi (blok Otázky zákazníka): krátký text na všechny dotazy, neodpovězené označené [DOPLNIT ODPOVĚĎ], doplňková zařízení podle TP a HŘ HZS označena jako dotaz, bez ceny, se strojově čitelným blokem ELZA-PROCES. Nic se neodesílá, obchod jen kopie na vědomí. Test v test/otazky.test.js.

0.84.0 – Detail případu ukazuje kartu Kdo je zákazník: upozornění (riziko, sleva) nahoře, dohody, historie, postupy, osoby a nabídky ze ZakaznikInfo a NabidkaEvid; jen čtení, při chybě čtení nic neblokuje. Test pokrývá escapování a vyřazené záznamy. Karta zatím není v konceptu nabídky.

0.83.0 – Můj den má pracovní karty a hlavní navigaci podle potvrzené role a povolených modulů. Přehled případů je osobní, týmové souhrny patří vedoucím. Výpadek profilu a deaktivované účty mají omezenou pracovní plochu, profil lze načíst znovu. Správa kontroluje duplicity, explicitní volbu role a aktivní stav. Sdílené kalendáře lze seskupit a zapínat nebo vypínat po skupinách. Přejímka je v docs/PREVZETI-FIRMA.md. Přepnutí skupin ignoruje opožděné načtení událostí. Po odhlášení se obnoví stránka a vyčistí stav otevřené relace.

0.82.2 – Pošta: poznámky jsou oddělené podle účtu a vlákna, lze je upravit a smazat i po přiřazení případu. Ukládají se v tomto prohlížeči. Historické poznámky evidované jen u odesílatele nelze bezpečně přiřadit konkrétnímu vláknu. Při rychlé změně výběru se opožděné načtení předchozího vlákna zahodí. Scénář filmu je rozšířen po realizaci a předání díla (docs/VIDEO-SCENAR-PCO.md).

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

