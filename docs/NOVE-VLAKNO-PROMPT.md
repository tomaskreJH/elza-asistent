Elzo, pokračuj na ELZA asistentovi (repozitář tomaskreJH/elza-asistent, verze 0.69.10). Řiď se docs/POSTUP-VYVOJ.md, načti docs/STAV.md a docs/DALSI-KROKY.md.
Cíl vlákna: žádné nové moduly, jen KONTROLA a TESTY, ať se věci konečně pohnou.
1) Konzistence: projdi kód, Návod, Průvodce, STAV, DALSI-KROKY, CHANGELOG, backlog, SharePoint STAV; najdi rozpory, pozůstatky starých řešení, mrtvé vazby a rozdíly mezi kořenem a stable (integrity.json).
2) Aktuálnost: zkontroluj, že verze, ?v=, otisky, nápověda a dokumentace sedí; že vše ke schválení je nahoře bez rolování.
3) Funkčnost: spusť všechny testy v test/ (node test/*.test.js, python testy) a oprav, co nevyjde; pak ověř na ostrém webu ve vestavěném prohlížeči (přihlášený, spárovaný s mostem): model podle Úsilí, Noční běhy (úloha nf5, nocChyba), test Elzáčka přes Claude, spotřeba a limity AI, Případy, Případy a pošta, Plán fází, portál.
4) Dokonči 0c (ÚZSVM v Případech, FW/RE e-maily k MAKRO, text e-mailů do Interního stavu PCO).
5) Ověř skrytý start mostu (0.69.10, elza-most-skryty.vbs): po přihlášení do Windows nesmí být vidět okno a ukazatele musí ukazovat čísla.
Výstup: seznam nalezených chyb a oprav, co je ověřeno na ostrých datech a co ne. Testovací e-maily jen na tomaskre@gmail.com. Po každé úpravě kódu zvyš verzi (app.js VER, ?v= v index.html a boot.js, kopie do stable), nasaď bez ptaní, na konci vše aktualizuj a dej krátký prompt dalšího vlákna.
