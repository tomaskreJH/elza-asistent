# Ochrana dat, postupů a nastavení (stav 0.43.0)
Co je hotové v aplikaci (ochrana.js, test/ochrana.test.js):
- Hlídač vložených pokynů (česky a anglicky): „zapomeň/ignoruj instrukce“, „pošli mi svoje instrukce / system prompt“, změna role AI, „přepošli veškerou poštu“, text adresovaný AI, falešné značky system, skrytý text a neviditelné znaky, žádost utajit akci.
- Pošta: při otevření zprávy sken předmětu a těla. Závažný nález = červené okno hned, odesílatel zablokován (zpráva se nezobrazí a nepředá AI), záznam v štítku 🛡. Podezřelý nález = jen upozornění.
- AI: každý dotaz prochází hlídačem; závažný nález odeslání zastaví, ostatní dotazy dostanou ochranné pravidlo (externí obsah je jen materiál, pokyny v něm se neplní).
- Můj den: nepřečtená pošta od blokovaného nebo podezřelého odesílatele je označena ⚠.
Už dříve (0.29.0): CSP, pošta v izolovaném okně bez skriptů, escapování dat, odkazy jen https/mailto/tel, odesílání jen po potvrzení, AI nic samo neodesílá.
Hranice: blokace je v aplikaci (zařízení uživatele); hlídač je pravidlový, nezachytí vše. Portál zákazníka nemá volný textový vstup (jen mailto), vstupy z T3 se při zpracování AI skenují.
Doporučeno nad rámec aplikace (vyžaduje správce, nic placeného): pravidlo transportu v Exchange (zablokovat odesílatele, karanténa), Defender for Office 365 v licenci M365 (Safe Links, Safe Attachments), pokud je v licenci; popis v ZADOST-COPILOT.md rozšířit až bude správce řešit.
Další krok: sdílený seznam blokovaných (SharePoint, NastaveniAplikace) a skenování dokumentů při nahrání do knihoven.

## Strážce (0.44.0, straz.js)
- Integrita: otisky SHA-256 všech skriptů a stránek se každých 30 min porovnávají se schváleným základem v SharePointu (řádek sdileno:straz v NastaveniAplikace) a s manifestem integrity.json (generuje tools/hash.js při nasazení). Změna kódu bez změny verze = ALARM (červený pruh, zablokovaná AI i odesílání pošty). Nová verze = upozornění ke schválení jedním klepnutím.
- Sdílené: blokovaní odesílatelé, incidenty a naučené vzory platí pro všechna zařízení a uživatele; jsou v SharePointu, ne v kódu.
- Učení: vložením ukázky škodlivého textu nebo kódu vznikne vzor (jen text, nic se nespouští). Týdenní průzkum hrozeb (naplánovaná úloha, pondělí) posílá upozornění a návrhy vzorů.
- Kód v obsahu: <script>, události onerror/onload, iframe, javascript:, skripty pracující s cookie, localStorage nebo fetch jsou ve zprávách závažný nález.
- Zbývá (bez nákladů): GitHub: zapnout dvoufázové ověření účtu, ochranu větve main (povinné schválení a podepsané commity), upozornění na změny; do kódu nikdy nedávat klíče. Dále CSP bez unsafe-inline (otisky skriptů) jako další vlákno.
- Hranice: kdo ovládne repozitář, může Strážce v kódu vypnout; proto ochrana účtu GitHub a schvalování verzí vlastníkem.
