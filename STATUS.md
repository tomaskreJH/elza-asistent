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
