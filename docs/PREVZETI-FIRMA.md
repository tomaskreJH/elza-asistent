# Ověření před předáním kolegům

Verze 0.83.0 přidává potvrzené pracovní role na stránku Můj den. Karty vybírá z modulů povolených pro roli a pro účet. Můj den zobrazuje vlastní případy a čte jen povolené pracovní oblasti. Načtení stránky samo nepřiřazuje poštu.

## První přihlášení

1. Vlastník zkontroluje existující položku v Uživatelé a moduly. Potvrdí jednoznačný přihlašovací e-mail, roli a aktivní stav. Výběr modulů zůstává v rámci této role.
2. Kolega se přihlásí vlastním účtem. V průvodci potvrdí pravidla AI, zkontroluje roli, vybere moduly a povolí potřebný přístup k poště nebo kalendáři.
3. Kolega ověří hlavní kartu své role a otevře jeden běžný pracovní záznam. Před potvrzením zápisu zkontroluje, do kterého seznamu a položky se ukládá.
4. Vlastník ověří pod účtem kolegy dostupné seznamy a zakázky v Microsoft 365. Personalizace nabídky a skrytí obrazovek nenahrazují oprávnění SharePointu, Outlooku ani portálu.
5. Včas ověřte pravidla AI a dostupnost použitého poskytovatele. Nové otisky vydání schvaluje vlastník ve Strážci.

## Scénáře přejímky

| Role | První karta podle povolených modulů | Ověření v provozu |
|---|---|---|
| Technik | Na místě | Zobrazí jen dostupné zakázky. Otevře formulář záznamu, uloží do schválené existující položky. |
| Obchod | Vyřídit poptávky | Otevře vlákno, projde rozbor a vazbu k případu, vytvoří koncept nabídky. |
| Projektant | Otevřít projekt | Otevře zakázku, ověří přístup k dokumentaci a používanému plánu fází. |
| Vedoucí | Zkontrolovat termíny zakázek | Načte termíny a přehled týmu, ověří případ a jeho další krok. |
| OZO PO | Zkontrolovat termíny kontrol | Ověří seznam kontrol a dostupnost záznamu v terénu. |

Aplikace umožňuje pojmenovat skupiny sdílených kalendářů a skupinu zobrazit či skrýt najednou. Nastavení skupin se ukládá pro účet v konkrétním prohlížeči.

Firemní přejímka je hotová až po ověření běžných kolegových účtů a potřebných oprávnění na skutečných datech. Vývojová kontrola používá ukázkové účty a simulovaná rozhraní.
