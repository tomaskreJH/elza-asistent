# Měření fází zakázek a odhady času (návrh, verze 0.45.0-plán, 2026-11-23)

Cíl: začít od nuly. Odhad času vychází z množství práce, ne z kalendáře. Každá fáze se od prvního dne měří a výsledky slouží k úpravě norem. Plán a realita jsou dva oddělené záznamy; plán se po schválení nemění.

## 1. Pojmy
- **Typ zakázky** (např. Kontrola OZO PO, Revize EPS, Zkouška PZTS, Projekt slaboproud).
- **Šablona fází** pro typ: pořadí fází, role, závislosti, potřebná školení.
- **Jednotka práce**: co se počítá (zařízení, hlásič, ústředna, metr kabelu, místnost, dokument).
- **Norma**: čas na jednu jednotku dané fáze a typu, s uvedeným zdrojem (`odhad vedoucího` / `naměřeno` / `schváleno AI návrhem`) a datem.
- **Koeficient**: násobek pro přístup, dojezd, výšku a složitost objektu.
- **Plán fáze**: vypočtený čas = množství × norma × koeficienty; vznikne při schválení zakázky.
- **Záznam fáze**: skutečný začátek, konec, odpracované hodiny, skutečně provedené množství, osoba a důvod odchylky (z číselníku).

## 2. Výpočet odhadu
`čas fáze = (množství jednotek × norma) × Π koeficientů + pevná část (příprava, protokol)`

Odhad se zobrazuje jako rozsah: optimistický, pravděpodobný a pesimistický. Vstupní normy jsou označeny jako `odhad vedoucího` a dokud nejsou ověřeny měřením, asistent je tak prezentuje.

## 3. Sběr dat od prvního dne
- Každá fáze se zapisuje na telefonu jedním klepnutím: Začít, Hotovo, počet provedených jednotek.
- Při odchylce (plán vs. realita větší než 20 %) se vyžaduje důvod z číselníku: přístup, chybějící podklad, porucha, nový požadavek zákazníka, počasí, jiné.
- Záznamy se ukládají do SharePointu, ne do prohlížeče; nic se neodesílá ven.
- Zápis doplňuje a potvrzuje člověk; AI jen navrhuje.

## 4. Učení (až po datech)
- Po deseti dokončených fázích daného typu asistent navrhne úpravu normy: nová hodnota, medián a rozptyl, počet vzorků.
- Změna normy se zapíše jen po schválení vedoucím; původní hodnota zůstává v historii.
- Pod deset vzorků se nenavrhuje nic, jen se zobrazuje počet.

## 5. Směrování lidí
- Kapacita člověka = pracovní doba − dovolená − školení − ostatní přiřazení.
- Úkol se přiřadí jen člověku s potřebnou rolí a školením a volnou kapacitou. Návrh ukazuje důvod a alternativu.
- Přesun člověka na jinou fázi nebo zakázku: dopad na termíny, přetížení a hodiny se spočítá před zápisem; zápis až po potvrzení.

## 6. Měření a přehledy (pro vedoucího, ne hodnocení jednotlivců)
- Přesnost odhadu (plán vs. realita) podle typu a fáze.
- Vytížení týmu a přetížení v čase.
- Počet přesunů a důvody odchylek.
- Průměrná doba fází podle typu zakázky a objektu.

## 7. Pilot: Kontrola OZO PO
Pilot je zvolen proto, že množství práce se dá dobře počítat (počet hlásičů a místností, počet objektů, počet ústředen). Vstupní normy níže jsou pracovní odhady vedoucího k potvrzení a nejsou to naměřené hodnoty.

| Fáze | Jednotka | Výchozí norma (odhad) | Poznámka |
|---|---|---|---|
| Příprava a podklady | zakázka | 0,5 h pevně | dokumentace, plán objektu |
| Přístup a vstup do objektu | objekt | 0,25 h | koeficient podle výšky a přístupu |
| Kontrola hlásičů | hlásič | 0,05 h | měření a zápis |
| Kontrola ústředny | ústředna | 0,5 h | včetně zálohy a logu |
| Protokol a předání | zakázka | 0,75 h pevně | protokol, podpis, odeslání po ano |

Koeficienty (vstupní): výška nad 3,5 m ×1,2; obtížný přístup ×1,3; více než 5 podlaží ×1,15. Všechny hodnoty se upravují v aplikaci a každá úprava se zapisuje do historie.

## 8. Seznamy na SharePointu (web ELZA-asistent)
Návrh schématu, zatím nezaložený (založení musí potvrdit vlastník v aplikaci):

- **SablonaFaze**: Title (typ zakázky), Poradi, Faze, Role, Zavisi (text), Skoleni, Aktivni.
- **Norma**: Title (kód normy), Typ, Faze, Jednotka, Hodnota (h na jednotku), Pevna (h), Zdroj (odhad vedoucího / naměřeno / schváleno), VzorkuN, DatumUpravy, UpravilUzivatel.
- **Koeficient**: Title, Typ, Podminka, Nasobek.
- **ZaznamFaze**: Title (ID zakázky + fáze), Zakazka, Faze, Osoba, Zacatek, Konec, Hodiny, Jednotek (provedeno), Plan (h), Odchylka (%), Duvod, Poznamka.
- **DuvodOdchylky**: Title (kód), Popis, Aktivni.

Vazby: ZaznamFaze.Zakazka → Zakázky ELZA; Norma.Typ a SablonaFaze.Typ shodují se číselníkem typů zakázek. Osoby z Lidé a školení.

## 9. Co se zatím nemění
- Kód aplikace se v tomto kroku nemění (jen dokumentace). Měření a zápis fází přijdou v dalším vlákně jako verze 0.45.0.
- Žádný zápis do ostrých zakázek ani do ostrých seznamů; zakládání seznamů až po potvrzení.

## 10. Otevřené body
- Potvrdit vstupní normy pilotu (vedoucí OZO PO).
- Potvrdit číselník důvodů odchylek.
- Rozhodnout, zda se záznamy berou i z kalendáře Kostka (jen pro čas, ne pro obsah).
