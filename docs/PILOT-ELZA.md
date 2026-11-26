# Pilot ELZY 0.80.0

## Kam pro práci

| Oblast | Hlavní vstupy | Další obrazovky a jejich účel |
|---|---|---|
| Denní práce | Můj den, Pošta, Případy, Kalendář, Úlohy | Na místě pro techniky, Nabídky pro obchod, Analýza vstupu pro podklady, Zakázky pro realizaci, Smlouvy a kontroly pro servis |
| Plánování | Gantt a termíny, Plán fází, Lidé a školení | Gantt pracuje s úkoly konkrétních zakázek, Plán fází s kapacitou a odhadem, Lidé a školení s týmy a platností |
| Zakázky | Zakázky | Složky zakázky a Publikace do portálu jsou pod nadpisem Zakázky |
| AI | Elzáčci, Chat s agentem, AI nastavení | V AI nastavení jsou Pravidla AI, AI směrování a AI záznam a náklady. Pod Úlohami jsou Noční běhy |
| Znalosti | Právo a normy, Skilly | Pod Skilly jsou Postupy, Prompty, Foto příkazy, Brand a Trh a konkurence. Postupy zde popisují dovednosti, Procesy v Přehledu návaznost práce |
| Sledování | Přehled, Hledat vše | Pod Přehledem jsou Procesy, Mapa vazeb, Roadmapa, Stav systému a Automatika |
| Správa | Nastavení, Synchronizace firem, Synchronizace zaměstnanců | Pod Nastavením jsou Úvodní nastavení, Moje menu, Uživatelé a moduly a Seznamy |
| Nápověda | Návod a AI nápověda | Jeden vstup pod menu, uvnitř pracovní cesta od pošty po publikaci do portálu |

Související vstupy jsou pod nadpisem a respektují nastavení modulů. Jestliže hlavní obrazovka není pro roli dostupná, samostatně povolená podřízená položka může zůstat v menu. Odkazy a identifikátory rolí zůstávají funkční i u přesunutých položek.

Mapa už zobrazuje každou vazbu jen v příslušném směru s její podmínkou. Přehled ukazuje naléhavé položky před souhrny. Roadmapa obsahuje stav vývoje a v Přehledu je na ni odkaz.

## Elzáčci v provozu

| Vstup | Co se děje | Jak ověřit |
|---|---|---|
| Pošta → Analyzovat vlákno | Klasifikace pravidly okamžitě, bez modelu. Shrnutí je samostatná volba a má jednorázový náhled. | Použít přečtené vlákno pro pravidla. Pro živý model začít syntetickým testem v AI nastavení |
| Elzáčci → Chat | Seznam ukazuje nastaveného poskytovatele a model. Automatický výběr podle slov používá jen dostupné definice pro chat | Otevřít konkrétního Elzáčka a položit neškodný vzorový dotaz |
| Úlohy pro agenty | Evidence práce a schválení výsledku. Založený řádek čeká na svého zpracovatele | Ověřit převzetí položky, vrácení výsledku a stav K schválení |
| Noční běhy | Zařazují práci pro vybranou stanici přes most. Přenášejí zvolený model Claude, Codex či Ollama | Ověřit přijetí na konkrétní stanici a následné převzetí textového výsledku |
| Galerie | Dává k dispozici šablony pro přidání | Katalog šablon sám úlohy nespouští |

Codex používá Lunu pro krátká zadání a Sol jako běžnou automatickou volbu. Astra je výslovná volba. Změna předvolby nepřesouvá zadání k jinému poskytovateli. Je-li naměřený limit nejméně 95 %, živá zkouška nebo požadavek mimo Lunu se zastaví. Chybějící měření se zobrazuje jako nedostupné. Přesné úsilí v Codex CLI určuje konfigurace stanice. [Oficiální modely pro Codex](https://learn.chatgpt.com/docs/models)

## Stav ověření

- Hotovo v kódu: výběr modelu a sjednocení zkoušky s uloženou volbou, předání parametrů do noční fronty, navigace a zobrazení vazeb.
- Ověřeno na stanici: GPT-6 Luna přes Codex CLI vrátila odpověď na vzorový dotaz bez firemních dat. Stanice u přímé zkoušky použila vysoké úsilí. Pro měření úspory je potřeba změřit stejnou práci se stejným úsilím.
- Ověřeno v přihlášené ELZE: 100 souborů na GitHub Pages sedělo s manifestem. Verze 0.80.0 byla schválena ve Strážci, po načtení zůstalo schválení uložené. Mapa obsahovala 52 uzlů. Poštovní Elzáček má v Tomášově profilu uloženou předvolbu Levnější (GPT-6 Luna).
- Čeká: zkouška poštovního Elzáčka z ostré aplikace skončila na chybějícím párování. Na zkoušené stanici lokální port mostu neodpověděl. Živá odpověď Elzáčka a výsledek noční úlohy se ověří po spuštění a spárování mostu. Zkouška neodeslala poštu.
- Čeká před rozšířením mezi kolegy: jeden projitý případ pod běžnou rolí, ověřené oprávnění a zpracovatel Úloh. [Další kroky](DALSI-KROKY.md)
