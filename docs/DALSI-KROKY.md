# Další kroky (po 0.65.1) – v tomto pořadí
0. **Hotovo v 0.65.1:** ověření 0.64.1 na ostrém webu, porovnání galerie Syniru s katalog.js, bod 7 (Ranní kontrola v Můj den, Znalosti podle rolí).
0b. **Tomáš, 2 minuty:** schválit otisky 0.65.1 ve štítku 🛡 (do té doby je AI zablokovaná). Pak ověřit na ostrém webu sekci Ranní kontrola v Můj den.
0c. **Připojení EPS na PCO HZS:** přidat Elzáčka z Galerie (AI nastavení), pustit ho na 2–3 skutečné poptávky nebo zakázky (PCO HZS JHC, DPPC ELZY) a porovnat výstup se skutečností; rozdíly zapsat jako poznatky a upravit katalog.js (AG-PCO) a docs/znalosti/PCO-HZS-*.md. Navazuje šablona Interní stav zakázky (15) jako pohled v Případech.

1. **Tomáš, 15 minut:** (žádost správci o Claude Desktop odpadá, zápis jde přes aplikaci); Správa → Seznamy → Založit chybějící (ElzacekDef, PostupRetez, ZnalostElza); v AI nastavení zkontrolovat Profil firmy; v AI nastavení přidat z Galerie Elzáčky, které chceš; schválit otisky 🛡 verze 0.55.0; Složky zakázky → Ověřit nebo založit cílovou knihovnu a zkusit jednu dávku starých souborů; Lidé a školení → Naplnit základní data; Plán fází → Uložit výchozí normy; kvalifikace technikům pilotu; doplnit členy týmů (e-mail); po týdnu souběhu vypnout v Copilotu dvě ranní úlohy.
2. **Pilot Plánu fází na reálné zakázce** podle docs/OVERENI-FAZI-2026-11-23.md (plán s kódem zakázky, realita po fázích); normy zpřesnit po 10 záznamech.
3. **EspoCRM jen čtením:** Tomáš dodá adresu ESPO a kdo založí čtecího API uživatele (docs/ESPO-CTENI.md); pak tok do kopie v SharePointu a zobrazení v Případech a Zakázkách.
4. **B hotovo v kódu (0.55.0):** po první ostré dávce zpřesnit návrh typů (HINT v struktura.js) podle souborů, které zůstaly nerozpoznané.
5. **Tok T12 hotov v testovacím režimu (0.55.1):** Hlídač kontrol běží denně 7:30, e-mail jen Tomášovi. Zbývá po tvém ano: příjemci (sloupec Odpovedny v Kontroly), e-mail vedoucímu po termínu; Ranní kontrola a Hlídání nabídek zůstávají v aplikaci.
6. **Portál:** přihlášení skutečného zákazníka, ProfilZakaznika, schvalování a help desk (T13).
7. **Zjednodušení hotovo v 0.65.1** (Ranní kontrola v Můj den, Znalosti podle rolí).
8. **AI po souhlasu správce (Copilot)**, pravidlové rozpoznání zůstává jako záloha.
9. **Zapracování inspirace ze Syniru (docs/INSPIRACE-SYNIRU.md):** krok 1 (A1–A6, A8) hotov v 0.56.0, krok 2 (C18–C23) hotov v 0.57.0 (zbývá schválit novou verzi Pravidel AI v aplikaci), krok 3 (B11–B14 Elzáčci podle rolí) hotov v 0.58.0 (Správa → Seznamy → Založit chybějící, ať se vlastní Elzáčci sdílejí). krok 4 (B15 postupy se schválením, řetěz agentů v Úlohách) hotov v 0.59.0. Další v pořadí: 5) D25 statistiky. A7 a A9 (pravý panel „Co agent ví“, nastavení jako dlaždice) hotovo v 0.64.0.
10. Bezpečnost dál (volitelně): styly bez 'unsafe-inline' (inline style= přesunout do tříd).

Čeká na Tomáše mimo aplikaci: příjemci T9 jen testovací adresy, telefon, ZADOST-COPILOT, úklid testovacích dat, adresa ESPO.
Nové seznamy: přidat jen do seznamy.js, Správa → Seznamy je založí. Vložené skripty do HTML nepatří (CSP je zablokuje), kód jen do .js souborů.
