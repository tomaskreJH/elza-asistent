Elzo, pokračuj na ELZA asistentovi (repozitář tomaskreJH/elza-asistent, verze 0.69.11). Řiď se docs/POSTUP-VYVOJ.md, načti docs/STAV.md a docs/DALSI-KROKY.md (nahoře CHYBA 1 a CHYBA 2).
Cíl vlákna: opravit a ověřit dvě otevřené chyby ostrého ověření, žádné nové moduly.
1) Noční fronta: nf5 zůstává u mostu „ceka“, úlohu most nespustí. Najdi příčinu (log mostu %LOCALAPPDATA%\ElzaMost, shoda nainstalovaného ps1 s tools/elza-most.ps1; Tomáš pomůže jen s přístupem ke složce), oprav, ověř na ostrém webu (Pustit frontu hned, výsledek hotovo, nocChyba).
2) AI záznam: volání Zkusit se nezapisuje a tabulka nemá model, režim (lehky/plny) a tokeny. Oprav a ověř vstupní tokeny výrazně pod 20 000.
3) Pak 0c: ÚZSVM v Případech (Nová poptávka), FW/RE e-maily k MAKRO, texty e-mailů v Interním stavu PCO; model podle Úsilí; portál; skrytý start mostu.
Testovací e-maily jen na tomaskre@gmail.com. Po každé úpravě kódu zvyš verzi (app.js VER, ?v= v index.html a boot.js, kopie do stable, node tools/hash.js), nasaď bez ptaní, na konci vše aktualizuj a dej krátký prompt dalšího vlákna.
