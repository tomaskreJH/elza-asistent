# Stav ELZA asistenta
Verze 0.64.1 (root i stable), 2026-11-24. Novinka: vzhled ověřený na ostrém webu a opravený (přihlášení, pruhy nahoře, dolní část menu bez duplicit), Nastavení jako dlaždice, panel Co agent ví u Úloh, úklid pozůstatků (CHANGELOG). Historie stavů: docs/STAV-HISTORIE.md, změny: docs/CHANGELOG.md.

## Cíl (měřítko každé změny)
Jedna přehledná aplikace, ve které pracovník ELZY začne den (Můj den), vyřídí poštu a případy, plánuje zakázky a lidi a nic nemusí kopírovat jinam. Technici mají být co nejvíc u zákazníka, zákazník v portálu „může klidně spát“. Bezpečnost má přednost před pohodlím, pohodlí před funkcemi navíc. Nic placeného navíc, CRM a stará dokumentace jen čtení.

## Co funguje (ověřeno)
- Přihlášení M365, 30+ modulů na ostrých datech bez chyb (0.29.0, 0.45.1), mobil a PWA, sdílené menu a nastavení přes SharePoint.
- Případy od založení po uzavření s automatickým připojením pošty; synchronizace firem (7 967) a zaměstnanců (106 řádků = 65 osob).
- Toky Power Automate T3, T4, T9, T10 zapnuté; T12 Termíny kontrol zapnutý v testovacím režimu (e-mail jen Tomášovi, 0.55.1).
- Automatické testy: test/*.test.js, test/*.py (demo, falešný SharePoint) – vše prochází.

- Hranice AI agentů (0.57.0): režim schvalování, změny s vrácením u Úloh, pravidla C20–C22, Známá omezení v Návodu; v ukázkovém režimu a testech ověřeno, na ostrých datech ne.
- Postupy se schválením (0.59.0): řetěz agentů v Úlohách, kontrola u zvolených kroků a vždy u posledního, ruční nebo časový start; ověřeno testem (test/postup.test.js), na ostrých datech ne (seznam PostupRetez se zakládá ve Správa → Seznamy).
- Elzáčci podle rolí (0.58.0): galerie, agent jednou větou, balíčky rolí a líné načítání postupů v AI nastavení a Úlohách; ověřeno testem a v ukázkovém režimu, na ostrých datech ne (seznam ElzacekDef se zakládá ve Správa → Seznamy).
- Vzhled v barvách ELZY, spodní lišta, rychlé nástroje a nový Můj den (0.56.0, vzhled.js); ostrá data neověřena (jen ukázkový režim).

- Profil firmy, Znalosti s oprávněním a Náhled před odesláním (0.61.0): ověřeno testem (test/kontext.test.js) a v ukázkovém režimu, na ostrých datech ne (seznam ZnalostElza se zakládá ve Správa → Seznamy).

- Rychlá odpověď, eskalace, poznatek po běhu a statistiky D25 (0.62.0): ověřeno testem (test/rychle.test.js); fronta Úloh na ostrých datech zatím běží beze změny schématu, poznatky se ukládají do ZnalostElza (seznam se zakládá ve Správa → Seznamy).

- Vzhled bez plovoucích prvků a Úsilí/Co smí u Elzáčka (0.63.0): ověřeno testy a na ostrém webu ve vestavěném prohlížeči Clauda (počítač i mobil); nalezené chyby opraveny v 0.64.0.

- Nastavení jako dlaždice a panel Co agent ví u Úloh (0.64.0): ověřeno testem (test/vzhled.py) a v ukázkovém režimu; na ostrém webu po nasazení ověřit klepnutím (první úkol dalšího vlákna).

## Hotovo v kódu, čeká na ostré ověření nebo klepnutí Tomáše
- Všech 16 seznamů založeno a sloupce ověřeny (0.53.0); přehled a zakládání ve Správa → Seznamy (seznamy.js = jeden zdroj schémat). Moduly načtou ostrá data bez chyb (0.53.1). Základní data se naplní klepnutím: Lidé a školení → Naplnit základní data, Plán fází → Uložit výchozí normy (0.54.0); členy týmů doplnit podle e-mailu.
- Ranní kontrola na ostrých datech běží (0.53.1); po týdnu souběhu vypnout dvě ranní úlohy v Copilotu (nahrazuje ranní úlohy Copilotu; ty zůstávají jako záloha do ověření).
- Strážce: po nasazení 0.64.1 schválit nové otisky ve štítku 🛡 (do té doby je AI zablokovaná; poplach před 0.64.0 vznikl změnou kódu beze změny verze).
- Portál zákazníka: přihlášení skutečného zákazníka neověřeno.
- Plán fází ověřen na ostrých datech (0.54.1): funguje, ale pilot nemá plán ani měření; postup v docs/OVERENI-FAZI-2026-11-23.md.
- Složky zakázky (0.55.0): ověření a založení cílové knihovny a přenos starých souborů po dávkách se schválením; neověřeno na ostrém webu (první dávku pustí Tomáš).
- EspoCRM jen čtením: návrh hotový (docs/ESPO-CTENI.md), čeká na adresu ESPO a čtecího API uživatele od správce ESPO.

## Bezpečnost
CSP na všech stránkách (object-src none, base-uri self, od 0.52.0 i referrer no-referrer), pošta v sandboxu bez skriptů a bez vzdálených obrázků, escapování všech dat, ochrana vložených pokynů (ochrana.js), Strážce integrity kódu (straz.js, integrity.json), sdílené blokace. Přístup k datům řídí práva SharePointu. Přenos šifruje HTTPS, data v M365 šifruje Microsoft, aplikace nic neukládá mimo SharePoint. GitHub 2FA a ochrana větve main zapnuty (2026-11-23). Od 0.54.0 CSP bez 'unsafe-inline' pro skripty (vložené skripty v boot.js, app.js, mobil.js, pruvodce.js) a SRI otisk u msal-browser. Styly zatím 'unsafe-inline' (nízké riziko).

## Čeká mimo aplikaci
Pravidla AI: vlastník otevře Pravidla AI → Nová verze (doplněk C18–C22 je předvyplněn), uloží a schválí; pak všem vyskočí okno s potvrzením.
Souhlas správce pro Copilot (docs/ZADOST-COPILOT.md); žádost pro Claude Desktop na PC odpadá (rozhodnutí 2026-11-24: zápis jde přes aplikaci a frontu Úloh), rozšíření T12 na odpovědné osoby (po výslovném ano), test na skutečném telefonu.

## Kontrola 2026-11-23 (0.52.0)
Viz docs/KONTROLA-2026-11-23.md.
