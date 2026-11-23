# Stav ELZA asistenta
Verze 0.52.0 (root i stable), 2026-11-23. Historie stavů: docs/STAV-HISTORIE.md, změny: docs/CHANGELOG.md.

## Cíl (měřítko každé změny)
Jedna přehledná aplikace, ve které pracovník ELZY začne den (Můj den), vyřídí poštu a případy, plánuje zakázky a lidi a nic nemusí kopírovat jinam. Technici mají být co nejvíc u zákazníka, zákazník v portálu „může klidně spát“. Bezpečnost má přednost před pohodlím, pohodlí před funkcemi navíc. Nic placeného navíc, CRM a stará dokumentace jen čtení.

## Co funguje (ověřeno)
- Přihlášení M365, 30+ modulů na ostrých datech bez chyb (0.29.0, 0.45.1), mobil a PWA, sdílené menu a nastavení přes SharePoint.
- Případy od založení po uzavření s automatickým připojením pošty; synchronizace firem (7 967) a zaměstnanců (106 řádků = 65 osob).
- Toky Power Automate T3, T4, T9, T10 zapnuté.
- Automatické testy: test/*.test.js, test/*.py (demo, falešný SharePoint) – vše prochází.

## Hotovo v kódu, čeká na ostré ověření nebo klepnutí Tomáše
- Založit seznamy klepnutím: PostupVerze, PostupZaznam (Analýza vstupu), NabidkaEvid (Hlídání nabídek), PlanFaze, ZaznamFaze, Norma, Osoba, Kvalifikace (Plán fází), Tym, Clen, SkoleniTyp, Skoleni, Obsazeni (Lidé a školení), Kontroly a ProfilZakaznika (portál).
- Ranní kontrola (nahrazuje ranní úlohy Copilotu; ty zůstávají jako záloha do ověření).
- Strážce: schválit základ otisků ve štítku 🛡 po nasazení.
- Portál zákazníka: přihlášení skutečného zákazníka neověřeno.

## Bezpečnost
CSP na všech stránkách (object-src none, base-uri self, od 0.52.0 i referrer no-referrer), pošta v sandboxu bez skriptů a bez vzdálených obrázků, escapování všech dat, ochrana vložených pokynů (ochrana.js), Strážce integrity kódu (straz.js, integrity.json), sdílené blokace. Přístup k datům řídí práva SharePointu. Zbývá: CSP bez unsafe-inline, GitHub 2FA a ochrana větve main (Tomáš).

## Čeká mimo aplikaci
Souhlas správce pro Copilot (docs/ZADOST-COPILOT.md), tok T12 pro automatiku při zavřené aplikaci, test na skutečném telefonu.

## Kontrola 2026-11-23 (0.52.0)
Viz docs/KONTROLA-2026-11-23.md.
