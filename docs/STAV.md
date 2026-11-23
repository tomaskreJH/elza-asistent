# Stav ELZA asistenta
Verze 0.55.0 (root i stable), 2026-11-23. Historie stavů: docs/STAV-HISTORIE.md, změny: docs/CHANGELOG.md.

## Cíl (měřítko každé změny)
Jedna přehledná aplikace, ve které pracovník ELZY začne den (Můj den), vyřídí poštu a případy, plánuje zakázky a lidi a nic nemusí kopírovat jinam. Technici mají být co nejvíc u zákazníka, zákazník v portálu „může klidně spát“. Bezpečnost má přednost před pohodlím, pohodlí před funkcemi navíc. Nic placeného navíc, CRM a stará dokumentace jen čtení.

## Co funguje (ověřeno)
- Přihlášení M365, 30+ modulů na ostrých datech bez chyb (0.29.0, 0.45.1), mobil a PWA, sdílené menu a nastavení přes SharePoint.
- Případy od založení po uzavření s automatickým připojením pošty; synchronizace firem (7 967) a zaměstnanců (106 řádků = 65 osob).
- Toky Power Automate T3, T4, T9, T10 zapnuté.
- Automatické testy: test/*.test.js, test/*.py (demo, falešný SharePoint) – vše prochází.

## Hotovo v kódu, čeká na ostré ověření nebo klepnutí Tomáše
- Všech 16 seznamů založeno a sloupce ověřeny (0.53.0); přehled a zakládání ve Správa → Seznamy (seznamy.js = jeden zdroj schémat). Moduly načtou ostrá data bez chyb (0.53.1). Základní data se naplní klepnutím: Lidé a školení → Naplnit základní data, Plán fází → Uložit výchozí normy (0.54.0); členy týmů doplnit podle e-mailu.
- Ranní kontrola na ostrých datech běží (0.53.1); po týdnu souběhu vypnout dvě ranní úlohy v Copilotu (nahrazuje ranní úlohy Copilotu; ty zůstávají jako záloha do ověření).
- Strážce: schválit základ otisků ve štítku 🛡 po nasazení.
- Portál zákazníka: přihlášení skutečného zákazníka neověřeno.
- Plán fází ověřen na ostrých datech (0.54.1): funguje, ale pilot nemá plán ani měření; postup v docs/OVERENI-FAZI-2026-11-23.md.
- Složky zakázky (0.55.0): ověření a založení cílové knihovny a přenos starých souborů po dávkách se schválením; neověřeno na ostrém webu (první dávku pustí Tomáš).
- EspoCRM jen čtením: návrh hotový (docs/ESPO-CTENI.md), čeká na adresu ESPO a čtecího API uživatele od správce ESPO.

## Bezpečnost
CSP na všech stránkách (object-src none, base-uri self, od 0.52.0 i referrer no-referrer), pošta v sandboxu bez skriptů a bez vzdálených obrázků, escapování všech dat, ochrana vložených pokynů (ochrana.js), Strážce integrity kódu (straz.js, integrity.json), sdílené blokace. Přístup k datům řídí práva SharePointu. Přenos šifruje HTTPS, data v M365 šifruje Microsoft, aplikace nic neukládá mimo SharePoint. GitHub 2FA a ochrana větve main zapnuty (2026-11-23). Od 0.54.0 CSP bez 'unsafe-inline' pro skripty (vložené skripty v boot.js, app.js, mobil.js, pruvodce.js) a SRI otisk u msal-browser. Styly zatím 'unsafe-inline' (nízké riziko).

## Čeká mimo aplikaci
Souhlas správce pro Copilot (docs/ZADOST-COPILOT.md), tok T12 pro automatiku při zavřené aplikaci, test na skutečném telefonu.

## Kontrola 2026-11-23 (0.52.0)
Viz docs/KONTROLA-2026-11-23.md.
