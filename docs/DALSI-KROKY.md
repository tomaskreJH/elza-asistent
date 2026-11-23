# Další kroky (po 0.55.1) – v tomto pořadí
1. **Tomáš, 15 minut:** schválit otisky 🛡 verze 0.55.0; Složky zakázky → Ověřit nebo založit cílovou knihovnu a zkusit jednu dávku starých souborů; Lidé a školení → Naplnit základní data; Plán fází → Uložit výchozí normy; kvalifikace technikům pilotu; doplnit členy týmů (e-mail); po týdnu souběhu vypnout v Copilotu dvě ranní úlohy.
2. **Pilot Plánu fází na reálné zakázce** podle docs/OVERENI-FAZI-2026-11-23.md (plán s kódem zakázky, realita po fázích); normy zpřesnit po 10 záznamech.
3. **EspoCRM jen čtením:** Tomáš dodá adresu ESPO a kdo založí čtecího API uživatele (docs/ESPO-CTENI.md); pak tok do kopie v SharePointu a zobrazení v Případech a Zakázkách.
4. **B hotovo v kódu (0.55.0):** po první ostré dávce zpřesnit návrh typů (HINT v struktura.js) podle souborů, které zůstaly nerozpoznané.
5. **Tok T12 hotov v testovacím režimu (0.55.1):** Hlídač kontrol běží denně 7:30, e-mail jen Tomášovi. Zbývá po tvém ano: příjemci (sloupec Odpovedny v Kontroly), e-mail vedoucímu po termínu; Ranní kontrola a Hlídání nabídek zůstávají v aplikaci.
6. **Portál:** přihlášení skutečného zákazníka, ProfilZakaznika, schvalování a help desk (T13).
7. **Zjednodušení:** sloučit Ranní kontrolu do Můj den, nepoužívané moduly Znalostí skrýt pro ostatní role.
8. **AI po souhlasu správce (Copilot)**, pravidlové rozpoznání zůstává jako záloha.
9. Bezpečnost dál (volitelně): styly bez 'unsafe-inline' (inline style= přesunout do tříd).

Čeká na Tomáše mimo aplikaci: příjemci T9 jen testovací adresy, telefon, ZADOST-COPILOT, úklid testovacích dat, adresa ESPO.
Nové seznamy: přidat jen do seznamy.js, Správa → Seznamy je založí. Vložené skripty do HTML nepatří (CSP je zablokuje), kód jen do .js souborů.
