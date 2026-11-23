# Stav ELZA asistenta
Verze 0.53.1 (root i stable), 2026-11-23. Historie stavů: docs/STAV-HISTORIE.md, změny: docs/CHANGELOG.md.

## Cíl (měřítko každé změny)
Jedna přehledná aplikace, ve které pracovník ELZY začne den (Můj den), vyřídí poštu a případy, plánuje zakázky a lidi a nic nemusí kopírovat jinam. Technici mají být co nejvíc u zákazníka, zákazník v portálu „může klidně spát“. Bezpečnost má přednost před pohodlím, pohodlí před funkcemi navíc. Nic placeného navíc, CRM a stará dokumentace jen čtení.

## Co funguje (ověřeno)
- Přihlášení M365, 30+ modulů na ostrých datech bez chyb (0.29.0, 0.45.1), mobil a PWA, sdílené menu a nastavení přes SharePoint.
- Případy od založení po uzavření s automatickým připojením pošty; synchronizace firem (7 967) a zaměstnanců (106 řádků = 65 osob).
- Toky Power Automate T3, T4, T9, T10 zapnuté.
- Automatické testy: test/*.test.js, test/*.py (demo, falešný SharePoint) – vše prochází.

## Hotovo v kódu, čeká na ostré ověření nebo klepnutí Tomáše
- Všech 16 seznamů založeno a sloupce ověřeny (0.53.0); přehled a zakládání ve Správa → Seznamy (seznamy.js = jeden zdroj schémat). Moduly načtou ostrá data bez chyb (0.53.1). Zbývá naplnit data: týmy, školení, normy pilotu.
- Ranní kontrola na ostrých datech běží (0.53.1); po týdnu souběhu vypnout dvě ranní úlohy v Copilotu (nahrazuje ranní úlohy Copilotu; ty zůstávají jako záloha do ověření).
- Strážce: schválit základ otisků ve štítku 🛡 po nasazení.
- Portál zákazníka: přihlášení skutečného zákazníka neověřeno.

## Bezpečnost
CSP na všech stránkách (object-src none, base-uri self, od 0.52.0 i referrer no-referrer), pošta v sandboxu bez skriptů a bez vzdálených obrázků, escapování všech dat, ochrana vložených pokynů (ochrana.js), Strážce integrity kódu (straz.js, integrity.json), sdílené blokace. Přístup k datům řídí práva SharePointu. Přenos šifruje HTTPS, data v M365 šifruje Microsoft, aplikace nic neukládá mimo SharePoint. Zbývá: GitHub 2FA a ochrana větve main (největší riziko: kdo má účet GitHub, mění kód), vynucené MFA pro firemní účty (správce), CSP bez unsafe-inline, SRI u msal.

## Čeká mimo aplikaci
Souhlas správce pro Copilot (docs/ZADOST-COPILOT.md), tok T12 pro automatiku při zavřené aplikaci, test na skutečném telefonu.

## Kontrola 2026-11-23 (0.52.0)
Viz docs/KONTROLA-2026-11-23.md.
