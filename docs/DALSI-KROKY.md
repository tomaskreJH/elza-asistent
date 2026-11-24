# Další kroky (po 0.73.1)
**Hotovo 0.73.1:** schválení verze jedním klepnutím, příčina „limity nedostupné“ (vypršelý token, most ho obnoví; spustit znovu elza-most-instalace.cmd), nastavení ranní analýzy (docs/RANO-ANALYZA-NAVRH.md), zásada Zpět (docs/ZPET-ZASADA.md). Zpět doplnit všude, kde chybí. Lokální model (Ollama, Flux na obrázky) připravit, až bude čas.
**Nové od Tomáše (2026-11-24):** důkladná ranní analýza s doporučením a přiloženou komunikací (po souhlasu správce pro Copilot; dnes pravidlově), dohledání neznámých zákazníků mimo systém (jen jako návrh k ověření), příprava zápisu do Outlooku (kategorie/složka) místo zápisu, vrácení akce (Zpět u přiřazení pošty), aktualizace taháním dolů jen na aktuální obrazovce; jednoduchost a intuitivnost: každá obrazovka má říct, co dělat dál.
**Tomáš (do 5 minut, jediné ruční kroky):** (1) Správa → Seznamy → Založit chybějící (Zaznam, ProcesStav); (2) ve štítku 🛡 schválit otisky 0.72.0; (3) schránka elzy@ se NEČTE (rozhodnutí 2026-11-24, přepínač CTI_SDILENOU v rano.js, zapnout až po vyladění); pro zápis do kalendáře technika podle potřeby souhlas s Calendars.ReadWrite.Shared.
**Další vlákno:** (1) ostré ověření: uložení fotek a záznamu činnosti na MAKRO (OBJ + PR), getSchedule, zápis do kalendáře zkušebně, Elzáček Nabídka přes frontu a most; (2) fotka z e-mailu zákazníka jedním klepnutím do složky objektu (příloha v Poště, zdroj zakaznik); (3) sloučení nabídkových modulů podle docs/KONTROLA-2026-11-24.md; (4) odeslání zprávy po Náhledu před odesláním; (5) 0c: ÚZSVM a FW/RE k MAKRO.
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
