# Další kroky (po 0.72.0)
**Tomáš (do 5 minut, jediné ruční kroky):** (1) Správa → Seznamy → Založit chybějící (Zaznam, ProcesStav); (2) ve štítku 🛡 schválit otisky 0.72.0; (3) pro čtení schránky elzy@ a zápis do kalendáře technika podle potřeby dát souhlas s právy Mail.Read.Shared a Calendars.ReadWrite.Shared (aplikace při chybějícím právu napíše, co chybí, a nic nezapíše).
**Další vlákno:** (1) ostré ověření: uložení fotek a záznamu činnosti na MAKRO (OBJ + PR), getSchedule, zápis do kalendáře zkušebně, auto-případ z elzy@ (jen testovací poptávka z tomaskre@gmail.com), Elzáček Nabídka přes frontu a most; (2) fotka z e-mailu zákazníka jedním klepnutím do složky objektu (příloha v Poště, zdroj zakaznik); (3) sloučení nabídkových modulů podle docs/KONTROLA-2026-11-24.md; (4) odeslání zprávy po Náhledu před odesláním; (5) 0c: ÚZSVM a FW/RE k MAKRO.
**Dlouhodobě (backlog):**
1. Pilot Plánu fází na reálné zakázce (docs/OVERENI-FAZI-2026-11-23.md), normy zpřesnit po 10 záznamech.
2. EspoCRM jen čtením (docs/ESPO-CTENI.md), čeká na adresu a čtecího API uživatele.
3. Složky zakázky: první ostrá dávka přenosu starých souborů (pustí Tomáš), zpřesnit HINT v struktura.js.
4. Tok T12: příjemci (Odpovedny), e-mail vedoucímu po termínu, jen po výslovném ano.
5. Portál zákazníka: přihlášení skutečného zákazníka, ProfilZakaznika, schvalování, help desk (T13).
6. AI přes Copilot po souhlasu správce (docs/ZADOST-COPILOT.md); pravidlové rozpoznání zůstává zálohou.
7. Inspirace ze Syniru: docs/INSPIRACE-SYNIRU.md (kroky 1–4 hotovy, další podle rozboru).
8. Bezpečnost: styly bez 'unsafe-inline'.
9. Využití dat (docs/DATOVY-KAPITAL.md): hodnocení příležitostí AI, hlídání „zákazník poslal fotku a nikdo neodpověděl“.
Nové seznamy: jen do seznamy.js, Správa → Seznamy je založí; modul, který do seznamu zapisuje, ho musí popsat přes SDL.def. Vložené skripty do HTML nepatří (CSP), kód jen do .js souborů.
