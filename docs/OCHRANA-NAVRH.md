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
