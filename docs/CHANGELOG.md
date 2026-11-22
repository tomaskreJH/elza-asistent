# Changelog

## 0.21.0 (2026-11-22)
- Nový soubor `centrum.js` (root i `stable/`), index.html načítá modul `centrum`.
- **Přehled (velín)**: živé dlaždice (otevřené případy, po termínu, do 3 dnů, schvalování, úlohy pro agenty, zakázky, blokující čekání, nepřečtená pošta), seznam „Vyžaduje pozornost“, rozložení případů podle výsledku, zakázky podle fáze, postup vývoje. Dlaždice jsou proklikávací. Nahrazuje původní Přehled (počty seznamů).
- **Návod a AI nápověda**: interaktivní schéma toku (pošta → případ → zakázka → portál, AI vrstva), 13 kapitol s kroky a tlačítkem „Otevřít modul“, vyhledávání v návodu bez AI (s češtinou po kmenech) a tlačítko „Zeptat se AI“ (agent AG-ELZA dostane jen nalezené kapitoly). Plovoucí tlačítko `?` otevře kapitolu k aktuálnímu modulu.
- **Automatika**: automatická obnova přehledu (5 min), hlídač termínů s okénkem a volitelným upozorněním prohlížeče, automatické připojení pošty k případům (`window.pripadyAutoLink`), ranní souhrn (lokální i s AI), protokol běhu. Nastavení jen v prohlížeči uživatele, žádné nové seznamy.
- `ucet.js`: moduly navod a automatika jsou vždy dostupné všem rolím. `pripady.js`: vystavena funkce `pripadyAutoLink`.
- Menu: skupina Nápověda, položka Automatika ve Sledování, Přehled přejmenován na Přehled (velín).
- Ověřeno: syntaxe všech souborů, smoke test v ukázkovém režimu (?demo=1) bez chyb. Neověřeno: ostrá data ze SharePointu a skutečné volání AI po přihlášení.
