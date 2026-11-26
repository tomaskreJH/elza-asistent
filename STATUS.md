# Stav práce — ELZA 0.81.1

## Hotovo

- Přehled Pošty zobrazuje stav vazby ke každému vláknu a jeho důvod. U přiřazeného vlákna vede přímo do případu.
- Automatické přiřazení respektuje stávající vazbu a vyžaduje jednoznačný kód. Kontakt a objekt slouží jako návrhy k ověření.
- Návrh odpovědi vyžaduje otevřenou poslední dostupnou zákaznickou zprávu. Elzáček vidí text v náhledu a přiřazené číslo případu, pokud je dostupné.

## Ověření

Ostrý rozbor porovnal 46 vláken. MAKRO zobrazilo platnou vazbu WORK-20261124-0001 a u vlákna je dostupná příprava návrhu odpovědi. Automatické testy pokryly jeden kód, více kódů, společného zákazníka i nedostupná data. Prošly testy Chromu, vzhledu a Průvodce. Při ostrém ověření se model nad skutečnou poštou nespustil.

## Změněné soubory

- app.js, boot.js, index.html, integrity.json, posta.js, pripady.js, vlakno.js
- centrum.js, pruvodce.html, stable/app.js, stable/centrum.js, stable/posta.js, stable/pripady.js, stable/vlakno.js
- test/vlakno.test.js, docs/CHANGELOG.md, docs/STAV.md, docs/DALSI-KROKY.md, docs/NOVE-VLAKNO-PROMPT.md a STATUS.md

## Další krok pro další AI

Ověř přesnost návrhů na různých případech jednoho zákazníka. U rozpracované věci doplň rozdíl proti poslednímu potvrzenému stavu a podklady z časové osy. Živý návrh nad skutečným vláknem ověř po schválení náhledu.

## Upřesnění po ověření MAKRO

- Ověřená byla uložená vazba původního zákaznického vlákna. Samostatná oznámení z Espa s předmětem „Byli jste zmíněni ve streamu případu ZDP Makro ČB“ zobrazila stav bez nalezené vazby. V podkladech projektu je tento název spojen s PR001401.
- Pro oznámení z Espa je potřeba rozlišit typ zprávy, vyhledat kód nebo dohledat alias názvu v evidenci. Jednoznačný kód může připnout oznámení k existujícímu případu. Samotný název je důvod pro návrh k ověření.
- Směr pro Můj den: načíst dnešní kalendář, navrhnout pracovní okno a nahoře ukázat připravené návrhy ke kontrole a termíny do dalšího okna. Pod nimi seskupit zbytek podle případů a vypsat nejasné vazby. Pošta slouží pro detail. Schválený návrh blokace teprve zapíše termín do kalendáře.
- Pravidla řeší kalendář, identifikátory a seskupení. Elzáček čte kontext jen tam, kde je potřeba vyčíst změnu, navrhnout odpověď nebo sepsat chybějící podklady. Návrh rozpočtu potřebuje dohledatelný rozsah a ceny; neúplné vstupy se zobrazí odděleně.

Změněný soubor: STATUS.md. Další krok: pokrýt oznámení z Espa a ověřit pilotní frontu Můj den se třemi stavy „Ke kontrole“, „Rozpracované“ a „K dotřídění“.

## Pilot starší pošty a průběžný provoz

1. **Obnovit kontext zakázek.** Projít existující případy s EspoId, Aktivity případu a karty ZakaznikInfo. U MAKRO je vazba PR001401 a OBJ02666 doložená v poznámce případu a projektové dokumentaci. U ostatních zakázek teprve ověřit, co dřívější běhy skutečně uložily. Nevytvářet druhou evidenci.
2. **První třídění po dávkách.** Začít nepřiřazenými vlákny od nejnovějších, zobrazit pokrytí a navazovat od poslední zpracované dávky. Celé vlákno zkoumat při známkách pokračování či nejisté vazbě. Hledat související komunikaci podle kombinace konkrétního kontaktu, normalizovaného předmětu a identifikátoru objektu či zakázky. U návrhu ukázat důvod a zdroj. Jedna doména či jméno firmy nestačí.
3. **Denní provoz.** Můj den čte ranní kalendář a ukáže hotové návrhy a naléhavé položky. Běžná dávka se připraví před schváleným pracovním oknem, případně při prvním otevření ELZY na PC nebo NB. Po návratu do aplikace se zkontrolují změny od poslední úspěšné kontroly. Zpracované položky a návrhy vázat na identifikátor vlákna a poslední zpracovanou zprávu, aby PC a NB nezakládaly duplicity.
4. **Naléhavé během dne.** Při dostupném průběžném zdroji pošty se zobrazí hned položky s doloženým blízkým termínem, naléhavou závadou nebo čekajícím rozhodnutím. Kontextový rozbor a návrh odpovědi mají společný náhled a navazují na doložené dohody. Běh při zavřené aplikaci vyžaduje samostatný firemní spouštěč s oprávněním k poště. Do té doby zůstává průběžná kontrola v otevřené aplikaci jako návrh k implementaci.

Změněný soubor: STATUS.md. Další krok: ověřit dostupné vazby na aktivní zakázky a připravit první dávku nepřiřazených vláken s ukázkou důkazů pro vazbu. Ladit naléhavost na známých pracovních příkladech.

## Vydání 0.81.2 — první provozní kroky

- Pošta: týdenní dávky doručené pošty a návrat na poslední období v tomto prohlížeči.
- Espo: návrh vazby podle doloženého názvu z aktivit stejného případu, s kontrolou kódu PR.
- Můj den: nejbližší volných 25 minut a průběžná kontrola priorit, pokud je obrazovka otevřená a viditelná.
- Změněné soubory: app.js, boot.js, centrum.js, index.html, integrity.json, posta.js, pripady.js, pruvodce.html, rano.js, vlakno.js, stable/app.js, stable/centrum.js, stable/posta.js, stable/pripady.js, stable/rano.js, stable/vlakno.js, test/vlakno.test.js, test/rano.test.js, docs/CHANGELOG.md, docs/DALSI-KROKY.md, docs/NOVE-VLAKNO-PROMPT.md, docs/STAV.md a STATUS.md.
- Další AI: ověřit ostrá oznámení z Espa a pilotní dávku. Doplnit potvrzený návrh kalendářového bloku, sdílený bod pokračování a propojit připravené návrhy s případy v Mém dni.
