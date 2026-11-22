## 0.41.0 (2026-11-22)
- Nevyhovující výsledek kontroly, zkoušky nebo revize: v portálu výrazné upozornění na Přehledu a červená karta v Kontroly a revize se závadami, doporučením a postupem (odstranění, nabídka, opakovaná kontrola). Tlačítka: Požádat o nabídku na odstranění (připraví e-mail kontaktu; nabídku zpracuje obchodní oddělení), Zkopírovat zadání pro AI zákazníka nebo dodavatele (vysvětlení, postup, otázky, text poptávky).
- Aplikace: Publikace do portálu doplněna o Výsledek (vyhovuje, s výhradami, nevyhovuje), Závady a Doporučení; nevyhovující nelze publikovat bez doporučení. Sloupce Vysledek, Zavady, Doporuceni v seznamu Kontroly (PortalELZA2).
- Postupy doplněny, test rozšířen, verze 0.41.0.

## 0.40.0 (2026-11-22)
- Portál: nové části Kontroly a revize (termíny se semaforem, protokol ke stažení podle kódu kontroly, všechny protokoly), Dokumenty rozdělené podle životního cyklu zakázky (Schválená dokumentace, Návody, Protokoly, Předávací dokumentace) s ukazatelem předávacího balíčku, Pomoc a poruchy (formulář s přípravou e-mailu kontaktu, nic se nezapisuje). Postupy doplněny.
- Aplikace: Správa → Publikace do portálu (portalpub.js): kontroly ze seznamu Kontrola (Zakázky ELZA, jen čtení) se po zaškrtnutí zveřejní do seznamu Kontroly na PortalELZA2; zápis kódem omezen na tento seznam, nic se nemaže.
- Konvence složek: knihovna Dokumenty na PortalELZA2 / kód zakázky / Dokumentace, Navody, Protokoly, Predani; protokol začíná kódem kontroly.
- Test test/portal-demo.py rozšířen, verze 0.40.0.

## 0.39.1 (2026-11-22)
- Portál zákazníka: nové moduly Dokumenty (soubory ze složky zakázky v knihovně Dokumenty webu PortalELZA2, jen čtení, odkaz otevře SharePoint podle práv zákazníka) a Postupy (šest výchozích postupů: průběh zakázky, schvalování, kontrola a revize, nahlášení poruchy, předání, změny; doplnění z volitelného seznamu Postupy na PortalELZA2: Title, Popis, Kroky po řádcích, Publikace). Ukázkový režim doplněn. Test test/portal-demo.py.

## 0.39.0 (2026-11-22)
- Nový modul Moje práce → Lidé a školení (lidi.js): týmy (EPS, PZTS, OZO PO, revizní technici), člověk může být ve více týmech; katalog školení (technologie, výrobce, ústředna) s platností v měsících; matice školení se semaforem, hlídač platnosti (30/60/90/180 dní); obsazení zakázky: tým, požadované kvalifikace, počet lidí, nabídka kandidátů podle platných školení a volnosti, právě jeden vedoucí akce na zakázku, vědomé přidělení i bez kvalifikace.
- Limity SharePointu: čtení po dávkách 500 podle Id (filtr Id gt, nikdy celý seznam najednou), indexované sloupce Title, Tym, Email, Typ, PlatnostDo; nic se nemaže (Stav=zruseno).
- Zápis kódem omezen na pět seznamů modulu na webu Zakázky ELZA. Tlačítko Založit chybějící seznamy (právo správy webu).
- Návod doplněn, test test/lidi-demo.py, verze 0.39.0 (root i stable).

## 0.38.1 (2026-11-22)
- Oprava: dávkový zápis používá sloveso MERGE, pojistka proti neshodě klíčů, modul vrací HTML.

## 0.38.0 (2026-11-22)
- Nový modul Správa → Synchronizace firem (firma.js): porovná zdroj ciselnik_firma (jen čtení, plní ho SQL) se seznamem Firma na ZakazkyELZA podle klíče Title (GUID), přidá nové, aktualizuje změněné, zmizelé jen označí Firma_Deleted. Ochrana: nespustí se, když má zdroj méně než 50 % záznamů cíle (probíhá nahrávání ze SQL). Hlídání stability zdroje (otisk ID/Title v prohlížeči). Volitelná denní automatika, když je aplikace otevřená. Zápis je kódem omezen na web ZakazkyELZA.

## 0.37.0 (2026-11-22)
- Nový portál zákazníka (portal.html, portal.js): čte jen zveřejněná data z webu PortalELZA2 podle práv přihlášeného zákazníka, nic nezapisuje. Moduly Přehled, Zakázky (osa milníků), Čekání, Termíny, Váš kontakt. Personalizace z volitelného seznamu ProfilZakaznika (barva, logo, uvítání, moduly, kontakt). Ukázkový režim portal.html?demo=1. Přihlášení vlastním redirectem přes stejnou registraci aplikace.

## 0.36.3 (2026-11-22)
- Ostré ověření: Smlouvy a kontroly (3 kontroly z kalendáře Kostka, semafor) a Gantt běží na živých datech bez chyb v konzoli.
- Nový podklad docs/TOK-T12-KROKY.md (postup založení toku T12).

# Změny
## 0.36.2 (2026-11-22)
- Oprava: milníky v Ganttu byly obří (kolize názvu třídy s oknem v graf.js).
## 0.36.1 (2026-11-22)
- Oprava: v Poště na počítači (šířka nad 800 px) se nezobrazoval text zprávy (CSS skrývalo tělo zprávy); na telefonu to fungovalo.
- Gantt přepracován: období 6 týdnů / 3 měsíce / 6 měsíců / vše (výchozí 3 měsíce), měsíce a týdny v záhlaví, svislá mřížka po týdnech, širší sloupec názvů, menší milníky s datem v samostatných řádcích, procenta v pruzích, najetí myší zvýrazní řádek.
## 0.36.0 (2026-11-22)
- Smlouvy a kontroly: Plán na 2 měsíce po týdnech, horizont Hlídače (30 dní / 2 měsíce / 3 měsíce, výchozí 2 měsíce).
- Termíny z kalendáře: načtení událostí (provozuschopnost, revize, kontrola) z Outlook kalendáře podle části názvu (Kostka) na 2 měsíce a založení Kontrol bez duplicit.
- Návod doplněn, verze 0.36.0 (root i stable).
## 0.35.0 (2026-11-22)
- Smlouvy a kontroly: import z Excelu (Smlouvy, Technologie, Kontroly, Úkoly; vložení z schránky, záhlaví bez ohledu na diakritiku, kontrola dat před zápisem).
- Hlídač kontrol: tlačítko založí odpovědnému úkol ke kontrolám do 30 dní i po termínu, bez duplicit.
- Test test/import.test.js; Návod doplněn.
## 0.34.0 (2026-11-22)
- Na webu Zakázky ELZA založeny seznamy Ukol, Smlouva, Technologie, Kontrola (přihlášený účet vlastníka, schéma v SEZNAMY-PLAN.md).
- Semafor kontrol a revizí v Přehledu (velín: dlaždice a upozornění) i v Můj den.
- Gantt: závislosti úkolů (pole Závisí na, značky a varování při kolizi termínů).
- Návod doplněn, verze 0.34.0 (root i stable).
