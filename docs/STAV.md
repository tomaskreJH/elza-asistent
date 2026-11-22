# Stav ELZA asistenta
Verze 0.36.1 (root i stable). Moduly: Můj den, Případy, Zakázky, Gantt a termíny, Smlouvy a kontroly, Pošta, Kalendář, Úlohy pro agenty, AI, Znalosti, Sledování (Přehled-velín, Roadmapa, Procesy, Stav systému, Hledat, Automatika), Správa (Moje menu, sdílené menu, přehled rolí), Nápověda. Mobilní rozhraní a PWA, osobní nastavení synchronizované přes SharePoint (seznam NastaveniAplikace založen 2026-11-22).
Bezpečnost (0.29.0): CSP, MSAL u aplikace, pošta v izolovaném okně bez skriptů, escapování dat ze SharePointu, odkazy jen https/mailto/tel, odesílání pošty jen přes potvrzení. Přístup k datům řídí práva SharePointu, role v aplikaci jen zobrazení. API klíče AI jen v prohlížeči zařízení.
Ověřeno (0.29.0, 2026-11-22, Browser 2, tkrejci@elzy.cz): 30 modulů na ostrých datech bez chyby a bez porušení CSP; běh případu WORK-20261122-0001 od založení po uzavření včetně automatického připojení e-mailu; synchronizace nastavení a uložení sdíleného menu; toky Power Automate T3, T4, T9, T10 zapnuté a úspěšné. Automatický test test/e2e-demo.py: 30 modulů, PC i mobil 390 px, oba kanály, bez chyby.
Toky Power Automate (vlastník Tomáš): T3 Vstup zákazníka (Dotazy, Schválení), T3 Kontakty od zákazníka, T4 Připomínky čekání (pracovní dny 7:30), T9 Kontrola ELZY (Outlook), T10 Přístupy a uvítání (pracovní dny 7:30). Pracují nad portálem a Zakázky ELZA; běh případu v aplikaci zatím žádný tok nepoužívá.
Čeká: souhlas správce pro Copilot (žádost hotová v docs/ZADOST-COPILOT.md, AI v aplikaci zatím nevolá), ostré založení zakázky z případu (spouští T9), test na skutečném telefonu, automatika při zavřené aplikaci.
Mobil (0.31.0): Pošta, Kalendář, Případy, Zakázky ověřeny emulací 375 px na ostrých datech; skutečný telefon zatím ne. Návrhy: docs/NABIDKY-NAVRH.md, docs/AUTOMATIKA-NAVRH.md.
Průvodce (0.32.0): pruvodce.html, samoběžná prezentace toku. Architektura portálu se smluvními zákazníky, help deskem a Ganttem: docs/PORTAL-ARCHITEKTURA.md (návrh).

Plán (0.33.0): plan.js, Gantt (úkoly, milníky, po zakázkách i po lidech), časová osa případu, Smlouvy a kontroly se semaforem. Čeká na založení seznamů Ukol, Smlouva, Technologie, Kontrola na webu Zakázky ELZA (docs/SEZNAMY-PLAN.md); v ukázkovém režimu běží s vymyšlenými daty.

0.34.0: seznamy Ukol, Smlouva, Technologie, Kontrola na webu Zakázky ELZA existují (založeno 2026-11-22, prázdné). Semafor kontrol v Přehledu a Můj den, závislosti úkolů v Ganttu. Neověřeno na živém webu s daty (seznamy jsou prázdné); tok T12, help desk T13 a portálové přihlášení z adres zákazníka zatím nejsou. Gmail soukromá schránka pro vzorce firemní pošty nepřispěla (jen soukromé a systémové zprávy); firemní tok je v Outlooku.

0.35.0: import z Excelu a Hlídač kontrol ve Smlouvy a kontroly (ověřeno testem parsování a demo e2e, na živých datech zatím ne – seznamy jsou prázdné). Zbývá: tok T12, portál, T13, vzorce z Outlooku.

0.36.0: plán kontrol na 2 měsíce po týdnech, horizont Hlídače, načtení termínů z Outlook kalendáře (Kostka). Ověřeno testy a demo e2e; na živých datech zatím ne (kalendář Jan Kostka je v Outlooku, ne v Google Kalendáři; konektor Microsoft 365 v Claudovi není připojen).

0.36.1: oprava pošty na PC (skrytý text zprávy) a nový vzhled Gantta (období, měsíce, mřížka, čitelné milníky).
