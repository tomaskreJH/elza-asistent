# Ověření Plánu fází na ostrých datech (2026-11-23, 0.54.0 → 0.54.1)
Ověřeno v aplikaci přihlášené firemním účtem, modul Plán fází, šablona Kontrola OZO PO (pilot).

## Výsledek
- Modul se načte bez chyb, lidé 65 osob z kopie Zamestnanec, Gantt i kapacita fungují.
- Uložené plány: žádné. Normy pro pilot: žádné (počítá se z odhadu vedoucího). Kvalifikace: žádné. Záznamy reality: žádné.
- Reálná zakázka tedy zatím nemá v aplikaci plán ani měření, normy z měření zpřesnit nejde (pod 10 vzorků asistent záměrně nic nenavrhuje). Vymyšlená data se nezapisují.

## Opraveno v 0.54.1
- Stejná jména (Karásek Štěpán, Jelínková Ivana, Knapíková Barbora, Chvátalová Klára, Krejčí Karel) mají v závorce osobní číslo; dřív se při přiřazení a kvalifikaci zaměňovali.
- Brigádníci (Brigádník 1–4) jsou v seznamu lidí na konci.

## Postup pilotu (Tomáš nebo vedoucí, 10 minut + práce v terénu)
1. Plán fází → Uložit výchozí normy (jednou).
2. Lidé a školení → Naplnit základní data; v Plánu fází uložit kvalifikaci OZO PO / EPS technikům pilotu.
3. Typ Kontrola OZO PO, zadat skutečný počet hlásičů, ústředen, objektů a koeficienty, Navrhnout obsazení, Kód zakázky (Z-RRRR-NNN), Uložit plán.
4. Po každé fázi zapsat realitu (hodiny, jednotky, důvod odchylky nad 20 %).
5. Po 10 záznamech fáze schválit navrženou normu v tabulce Učení.
