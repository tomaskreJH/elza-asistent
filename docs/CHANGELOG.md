## 0.44.1 (2026-11-23)
- Oprava: ochrana chybně hlásila běžné e-maily z Outlooku (značka meta http-equiv) jako útok a blokovala odesílatele. Značka odstraněna ze vzorů, dřívější chybné blokace a incidenty se samy smažou, vlastní doména @elzy.cz se nikdy automaticky neblokuje. Test s typickým Outlook e-mailem.

## 0.44.0 (2026-11-23)
- Strážce (straz.js): kontrola integrity kódu (otisky + integrity.json, tools/hash.js), alarm a zámek AI i odesílání při neschválené změně, sdílený seznam blokovaných, incidentů a naučených vzorů přes SharePoint, učení ze vložených ukázek, detekce spustitelného kódu v obsahu zpráv. Návod: kapitola Strážce.

## 0.43.0 (2026-11-23)
- Ochrana vstupů (ochrana.js): hlídač vložených pokynů v poště a textech pro AI, okamžité upozornění, blokace odesílatele, záznam a seznam blokovaných (štítek 🛡), ochranné pravidlo u každého dotazu na AI. Test test/ochrana.test.js. Návrh a hranice: docs/OCHRANA-NAVRH.md.
- Můj den: Hlídané termíny (kontroly, školení), označení podezřelé pošty.
- Lidé a školení: Hlídač platnosti → tlačítko Založit úkoly ke školením (do Ganttu, bez duplicit; window.planUkoly).
- Publikace do portálu: nevyhovující kontrola bez vyřešené nabídky automaticky založí úkol „Nabídka nápravy“ pro obchod.

