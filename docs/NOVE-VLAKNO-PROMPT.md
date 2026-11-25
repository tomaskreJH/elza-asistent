Tomáši, pokračuj na ELZA asistentovi (repozitář tomaskreJH/elza-asistent, verze 0.73.10). Řiď se docs/POSTUP-VYVOJ.md, načti docs/STAV.md, docs/DALSI-KROKY.md, docs/KONTROLA-2026-11-25.md a docs/CHANGELOG.md (0.73.9). ELZA je ženského rodu; Tomáše oslovuj jménem. Každou změnu ověř skutečně a napiš, co ověřeno bylo a co ne (přihlášení M365 v prohlížeči Claude otevírá vyskakovací okno, které musí klepnout Tomáš).

TRVALÁ ZÁSADA: aplikace musí být bezpečná a nesmí vyvolávat upozornění Microsoft Defenderu ani narušovat integritu firemního prostředí. Žádná persistence kromě jediného Run klíče mostu, žádné VBS/wscript/EncodedCommand/skryté launchery, žádné irm|iex ani Add-Type/DllImport, žádné výjimky ani vypínání Defenderu, žádné plošné ukončování procesů, nic ze složky OneDrive se nespouští přímo, skripty .ps1 s jedním BOM. Před každým commitem do tools/ to zkontroluj.

1) Nejdřív výsledky Tomášova ověření mostu a Pošty 0.73.9 (DALSI-KROKY nahoře); případné chyby oprav.
2) Pak body „Další vlákno“ v docs/DALSI-KROKY.md. Nabídky nedělá Tomáš, cenu určuje obchod (Radim). Testovací e-maily jen na tomaskre@gmail.com.

Po každé úpravě kódu zvyš verzi (app.js VER, ?v=, kopie do stable, node tools/hash.js), spusť testy, nasaď bez ptaní, na konci aktualizuj CHANGELOG, STAV, DALSI-KROKY, Návod a Průvodce a tento soubor.
