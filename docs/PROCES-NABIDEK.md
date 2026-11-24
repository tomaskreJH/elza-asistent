# Proces nabídky a připojení objektu (0.71.0)
Zdroj: zadání Tomáše 2026-11-24. Kód: proces.js, test/proces.test.js, seznam ProcesStav.

## Zásady
- Každý případ jde jinak (obhlídka je někde potřeba, jinde ne); neměnný je jen **vstup a výsledek** každého kroku. Model proto drží kroky se závislostmi, ne pevný postup.
- **Čekání nic nezastaví.** Krok čeká jen na kroky, na kterých skutečně závisí (žádost úřadu na PBŘ, připojení na PCO na DZP, realizace na schválení nabídky). Vše ostatní jde dál.
- **Co nelze, nabídneme.** Chybí PBŘ, DZP, dokumentace zdolávání požáru, KTPO a OPPO: i když je zákazník na začátku nechtěl, ELZY je může zpracovat (projektant, OZO PO zaměstnanec). Zákazník s vlastním OZO PO: nabídka přijde, jen když to zdržuje.
- **Elzáčci přebírají práci obchodu.** Připraví koncept první nabídky, dotazy, odpověď podle role odesílatele, termín obhlídky a technika. **Cenu a obchodní podmínky určuje vždy obchod**; když Elzáčkovi chybí vstup (cena, rozhodnutí), úkol padne vedoucímu obchodníkovi (Radim) a obchodnímu oddělení. Nabídky nikdy nedělá Tomáš.
- **První nabídka je krátká a přehledná**: cena, 5 bodů „co bude potřeba dál“, odkaz na další kolo. Zákazník, který nás ve vyhodnocení podle paušálu nevybere, podmínky ani číst nemusí.
- **Zákazníkova AI čte i srovnává.** Nabídka proto nese strojově čitelný blok: že jde o vícekrokový proces, jaké kroky mohou přibýt (dokumentace, pasport, PBŘ, DZP), kdo je zajistí, na čem závisí a co ELZY nabízí. Zákazník (nebo jeho Elzáček) s námi začne jednat a ELZA mu v dalších fázích odpovídá za nás.
## Kroky (proces.js)
První nabídka → upřesnění po výběru → termín obhlídky (kalendář, technik) → obhlídka → dokumentace zdolávání, PBŘ, KTPO/OPPO, kontakty, ústředna, dvě přenosové cesty → žádost úřadu (po PBŘ) → DZP (po dokumentaci a žádosti) → konečná nabídka → montáž → připojení na PCO (až po DZP, montáži a přenosech).
## Kalendář a přidělení technika (kroky 6 a 4 simulace MAKRO)
navrhTechnika: výchozí technik volný → ponechat; obsazen → jiný technik skupiny (EPS) s nejmenším vytížením dne, vlastní akci není nutné posouvat; nikdo volný → tři náhradní termíny. Obsazenost čte Graph getSchedule (právo Calendars.Read.Shared); bez práva se kolegové berou jako volní a aplikace to řekne. Do kalendáře se nezapisuje.
## Hotovo 0.72.0
Zápis obhlídky do kalendáře (po potvrzení termínu zákazníkem, zkušebně jen do vlastního kalendáře, transactionId proti duplicitě, kalendář technika přes Calendars.ReadWrite.Shared, jinak pozvánka po potvrzení); Elzáček Nabídka (AG-NABIDKA, úloha do fronty, chybějící cena nebo odkaz = úkol obchodu, vedoucí Radim); automatické založení případu ze schránky elzy@ (Ranní kontrola).
## Zbývá
Odeslání zprávy po Náhledu před odesláním; nabídka z obhlídky v portálu; napojení kroků na Gantt a Elzáčky (kdo krok převezme); sloučení překrývajících se nabídkových modulů (docs/KONTROLA-2026-11-24.md); ověření na ostrých datech.
