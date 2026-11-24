# Data jako největší hodnota firmy (zásada Tomáše, 2026-11-24)
Fotky a podklady nevznikají jen na obhlídkách. Vznikají při **jakékoli činnosti pro zákazníka** (obhlídka, montáž, servis, kontrola, revize, školení, hovor) a přicházejí i **od zákazníka** (fotka k posouzení, upřesnění, dotaz). Každý krok se dokumentuje, aby sloužil: servisu, kontrolám a revizím za pět let, analýze efektivity, návrhu zrychlení, hledání chyb a **hledání příležitostí** (dnes připojení na hasiče, příště kamery, BOZP). Kdo u zákazníka nabízí jinou službu, nemusí jezdit ani žádat podklady, které už získalo jiné oddělení: koordinátorem je ELZA.

## Co se ukládá (modul Na místě, zaznam.js, 0.72.0)
- **Fotky**: do trvalých podkladů objektu `OBJ/Podklady objektu/Fotodokumentace z činností` (fotka od zákazníka `…/Fotky a podklady od zákazníka`); obhlídka zůstává v `OBJ/PR/2 Pracovní/…`. Název nese objekt, druh činnosti, pořadí a datum, nic se nepřepisuje.
- **Strojově čitelný záznam** `zaznam_<druh>_v1_<datum>.json` (schema elza-zaznam-1) ve složce `Záznamy činností`: zakázka, zákazník, objekt, druh, zdroj (technik, zákazník, e-mail), kdo, kdy, technologie, popis, minuty, nalezené příležitosti. Čitelný i bez aplikace.
- **Řádek v seznamu Zaznam** (Správa → Seznamy → Založit chybějící): základ analýz. Zápis do časové osy případu (Aktivity) nese čas.
- Klíč, který vše spojuje: **OBJ (objekt) + technologie + zakázka (PR / WorkId)**.

## Příležitosti
Pravidlový návrh z textu činnosti a odpovědí „chybí“: kamery, kontrola vstupu a zabezpečení, BOZP (výhled), požární ochrana (PBŘ, dokumentace, OZO PO), modernizace EPS, revize elektro, PCO. Jde jen o **návrh**; tlačítko Předat obchodu založí úkol (rozhoduje obchod, vedoucí Radim). BOZP zatím nenabízíme, ale podklady a zájem se sbírají už teď.

## Analýza (Přehled uložených záznamů)
Počty činností, průměrný čas a fotky podle druhu, technologie, odkud data jsou, kolik příležitostí vzniklo, činnosti bez fotek. Cíl: vidět, kde to jede samo a kde vázne.

## Dál
Fotka z e-mailu zákazníka jedním klepnutím do složky objektu (příloha v Poště), napojení kroků procesu a Gantta, hodnocení příležitostí AI, hlídání „zákazník poslal fotku a nikdo neodpověděl“.
