# Návrh: Nabídky a osoby zákazníka (zákaznický portál, PortalELZA2)
Stav: návrh k odsouhlasení, nic se nezakládá. Seznamy a sloupce vytvoří aplikace až po tvém "ano".
## Seznam Nabidky
Title (číslo nabídky), Zakazka (kód Z-RRRR-NNN), Pripad (WORK-…), Polozky (JSON: zboží, množství, cena), Profese (výběr), Stav (Návrh, Zveřejněno, Schváleno zákazníkem, Zamítnuto, Potvrzeno ELZY), PlatnostDo, ZverejnilKdo.
## Seznam OsobyZakaznika
Title (jméno), Zakaznik, Email, Role (zadavatel, schvalovatel, jen čtení), Stav (Čeká na potvrzení ELZY, Aktivní, Zrušena), PotvrdilKdo (pracovník ELZY s případem).
## Pravidla
Zákazník osoby navrhuje, aktivní jsou až po potvrzení pracovníkem ELZY. Schválení nabídky zákazníkem potvrzuje pracovník ELZY. Cenu nabídek řeší obchodní oddělení, aplikace ji jen eviduje. Nic se zákazníkovi neodesílá bez výslovného ano.
## Otevřené otázky
Přesné názvy sloupců na PortalELZA2 (ověřit v SharePointu před založením).
