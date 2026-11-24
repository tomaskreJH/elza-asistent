# Další kroky (po 0.64.1) – v tomto pořadí
0. **Syniru do 24. 12. 2026 (beta):** hotovo v 0.61.0 až 0.64.0 (profil firmy, Znalosti, náhled, Recepce, rychlá odpověď, statistiky, úsilí a co smí, vzhled bez plovoucích prvků ověřený na ostrém webu, Nastavení jako dlaždice, panel Co agent ví u Chatu i Úloh). Zbývá jediné: porovnat pokyny agentů galerie Syniru s katalog.js (docs/SYNIRU-ANALYZA-2026-11-24.md kap. 2).
0b. **Ověřit 0.64.1 na ostrém webu** po klepnutí Tomáše: schválit otisky ve štítku 🛡, pak ve vestavěném prohlížeči Clauda projít Nastavení (Normální a Pokročilý), Úlohy (panel Co agent ví vpravo) a menu na mobilu.

1. **Tomáš, 15 minut:** (žádost správci o Claude Desktop odpadá, zápis jde přes aplikaci); Správa → Seznamy → Založit chybějící (ElzacekDef, PostupRetez, ZnalostElza); v AI nastavení zkontrolovat Profil firmy; v AI nastavení přidat z Galerie Elzáčky, které chceš; schválit otisky 🛡 verze 0.55.0; Složky zakázky → Ověřit nebo založit cílovou knihovnu a zkusit jednu dávku starých souborů; Lidé a školení → Naplnit základní data; Plán fází → Uložit výchozí normy; kvalifikace technikům pilotu; doplnit členy týmů (e-mail); po týdnu souběhu vypnout v Copilotu dvě ranní úlohy.
2. **Pilot Plánu fází na reálné zakázce** podle docs/OVERENI-FAZI-2026-11-23.md (plán s kódem zakázky, realita po fázích); normy zpřesnit po 10 záznamech.
3. **EspoCRM jen čtením:** Tomáš dodá adresu ESPO a kdo založí čtecího API uživatele (docs/ESPO-CTENI.md); pak tok do kopie v SharePointu a zobrazení v Případech a Zakázkách.
4. **B hotovo v kódu (0.55.0):** po první ostré dávce zpřesnit návrh typů (HINT v struktura.js) podle souborů, které zůstaly nerozpoznané.
5. **Tok T12 hotov v testovacím režimu (0.55.1):** Hlídač kontrol běží denně 7:30, e-mail jen Tomášovi. Zbývá po tvém ano: příjemci (sloupec Odpovedny v Kontroly), e-mail vedoucímu po termínu; Ranní kontrola a Hlídání nabídek zůstávají v aplikaci.
6. **Portál:** přihlášení skutečného zákazníka, ProfilZakaznika, schvalování a help desk (T13).
7. **Zjednodušení:** sloučit Ranní kontrolu do Můj den, nepoužívané moduly Znalostí skrýt pro ostatní role.
8. **AI po souhlasu správce (Copilot)**, pravidlové rozpoznání zůstává jako záloha.
9. **Zapracování inspirace ze Syniru (docs/INSPIRACE-SYNIRU.md):** krok 1 (A1–A6, A8) hotov v 0.56.0, krok 2 (C18–C23) hotov v 0.57.0 (zbývá schválit novou verzi Pravidel AI v aplikaci), krok 3 (B11–B14 Elzáčci podle rolí) hotov v 0.58.0 (Správa → Seznamy → Založit chybějící, ať se vlastní Elzáčci sdílejí). krok 4 (B15 postupy se schválením, řetěz agentů v Úlohách) hotov v 0.59.0. Další v pořadí: 5) D25 statistiky. A7 a A9 (pravý panel „Co agent ví“, nastavení jako dlaždice) hotovo v 0.64.0.
10. Bezpečnost dál (volitelně): styly bez 'unsafe-inline' (inline style= přesunout do tříd).

Čeká na Tomáše mimo aplikaci: příjemci T9 jen testovací adresy, telefon, ZADOST-COPILOT, úklid testovacích dat, adresa ESPO.
Nové seznamy: přidat jen do seznamy.js, Správa → Seznamy je založí. Vložené skripty do HTML nepatří (CSP je zablokuje), kód jen do .js souborů.
