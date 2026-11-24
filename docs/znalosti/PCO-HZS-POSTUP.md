---
name: elza-eps-pco-hzs
description: "postup pro posouzení, nabídku, přípravu, dokumentaci, montáž, zkoušky a zákaznickou komunikaci při připojení elektrické požární signalizace (eps) prostřednictvím zařízení dálkového přenosu (zdp) na pult centralizované ochrany hzs. použít při dotazech zákazníků, poptávkách, obhlídkách, přípravě nabídek, kontrole podkladů, koordinaci servisní organizace eps, ozo po a hzs, přípravě žádosti, funkční zkoušce, ověřovacím provozu a uvedení do trvalého provozu."
---

# Připojení EPS na PCO HZS – pracovní postup ELZA

## 1. Základní pravidla

- Vystupovat jako odborný koordinátor připojení EPS na PCO HZS, nikoli pouze jako dodavatel vysílače ZDP.
- Vždy rozlišit odpovědnost:
  - provozovatel objektu / provozovatel EPS,
  - servisní organizace EPS,
  - OZO PO a zpracovatel PBŘ/DZP,
  - provozovatel přenosové cesty ELZY,
  - územně příslušný HZS kraje.
- Nezaměňovat EPS, ZDP, PCO, DPPC, KTPO, OPPO, DZP a PBŘ.
- Nepotvrzovat termín připojení, dokud nejsou prověřeny dokumentace, skutečný stav EPS, přístup JPO, generální klíč, KTPO, OPPO, přenosové cesty a součinnost servisní organizace EPS.
- Uvádět, že konkrétní podmínky a formuláře se mohou lišit podle územně příslušného HZS kraje.
- Cenové a časové údaje z historických zakázek nepovažovat za aktuální. Aktuální poplatky, formuláře a krajské podmínky vždy ověřit.

## 2. Povinné zdroje a pořadí ověřování

1. Načíst aktuální interní instrukce a pracovní stav ELZA ze SharePointu ELZA:
   - `Projekt/COPILOT-PROMPT.md`
   - `Projekt/STAV.md`
   - `Znalostni-zaklad/copilot/00-instrukce-agenta.md`
   - `Znalostni-zaklad/copilot/09-poptavky-pco-pd-elektro.md`
   - podle potřeby `04-zakazka.md`, `05-tym-terminy-cesty.md`, `03-komunikace.md`
   - podle potřeby `Projekt/INTAKE-TRIAGE-RUNBOOK.md`
2. Prohledat relevantní firemní poštu a dokumenty k danému objektu, kraji, zákazníkovi, ústředně EPS a předchozí komunikaci s HZS.
3. Použít aktuální připojovací podmínky územně příslušného HZS kraje.
4. Ověřit aktuální právní předpisy a oficiální dokumenty HZS, pokud odpověď závisí na jejich aktuálním znění.
5. Základní odborný rámec:
   - zákon č. 133/1985 Sb., o požární ochraně,
   - vyhláška č. 246/2001 Sb., o požární prevenci,
   - Pokyn GŘ HZS ČR č. 27/2023 a jeho metodika,
   - ČSN 73 0875,
   - ČSN 34 2710,
   - ČSN EN 54-21,
   - ČSN EN 54-23,
   - ČSN EN 50136-1,
   - další normy a závazné dokumenty uvedené v PBŘ nebo podmínkách HZS.
6. Necitovat obsah technických norem, který není dostupný v oprávněném zdroji. Uvést pouze ověřený požadavek a označení normy.

## 3. Vstupní triáž poptávky

Nejprve zjistit:

- název, adresa a účel objektu,
- územně příslušný HZS kraj,
- zda jde o nové připojení, změnu provozovatele přenosové cesty, rekonstrukci, rozšíření nebo obnovení připojení,
- zda objekt již je nebo byl připojen na PCO HZS,
- důvod připojení podle PBŘ nebo právních požadavků,
- typ a výrobce ústředny EPS,
- rozsah a stáří EPS,
- kdo je servisní organizace EPS,
- kdo je OZO PO a zpracovatel PBŘ/DZP,
- zda jsou instalovány KTPO, OPPO, tablo nebo paralelní signalizace,
- zda existuje generální klíč pro všechny střežené prostory,
- požadovaný termín připojení,
- zda má zákazník PBŘ, projekt EPS, skutečné provedení, DZP/operativní kartu a půdorysy DWG.

Pokud informace chybí, připravit stručný seznam požadovaných podkladů. Nevyžadovat od zákazníka informace, které lze zjistit z již poskytnuté dokumentace nebo firemní komunikace.

## 4. Podklady vyžadované od zákazníka

Vyžádat podle situace:

- [ ] aktuální PBŘ včetně dodatků,
- [ ] závazné stanovisko HZS, je-li vyžadováno,
- [ ] projekt EPS: technickou zprávu a výkresovou část,
- [ ] dokumentaci skutečného provedení EPS,
- [ ] půdorysy objektu, ideálně DWG,
- [ ] seznam a číslování hlásičů, smyček, skupin a adresace,
- [ ] DZP nebo operativní kartu a údaj o projednání/schválení HZS,
- [ ] seznam PBZ a technologií ovládaných EPS,
- [ ] typ, výrobce, konfiguraci a dostupná rozhraní ústředny EPS,
- [ ] doklady o kontrolách provozuschopnosti EPS a souvisejících PBZ,
- [ ] údaje o KTPO, OPPO, tablu EPS a generálním klíči,
- [ ] kontakty na servisní organizaci EPS a OZO PO,
- [ ] identifikační a smluvní údaje provozovatele EPS,
- [ ] kontaktní osoby oprávněné převzít a zajistit objekt po zásahu,
- [ ] seznam prostor, do kterých nelze vstoupit generálním klíčem,
- [ ] informace o dostupné datové konektivitě a podmínkách IT zákazníka.

## 5. Kontrola při obhlídce

### 5.1 EPS a dokumentace

- [ ] Porovnat skutečný stav EPS s PBŘ, projektem a dokumentací skutečného provedení.
- [ ] Zaznamenat nezdokumentované hlásiče, smyčky, moduly, vazby a změny dispozice.
- [ ] Ověřit typ, umístění a technický stav ústředny EPS.
- [ ] Ověřit možnost kompatibilního připojení ZDP.
- [ ] Ověřit výstupy pro VŠEOBECNÝ POPLACH a PORUCHU.
- [ ] Ověřit požadovanou adresaci místa vzniku požáru.
- [ ] Ověřit vazby EPS na ostatní PBZ a technologie.
- [ ] Ověřit napájení, záložní zdroje a dostupnost provozní dokumentace.

### 5.2 Přístup jednotek PO

- [ ] Určit nástupní místo JPO.
- [ ] Projít celou trasu od příjezdu JPO k KTPO, OPPO a ústředně EPS.
- [ ] Ověřit příjezdovou komunikaci, brány, závory, oplocení a další zábrany.
- [ ] Ověřit otevření zábran při výpadku elektrické energie.
- [ ] Prakticky ověřit generální klíč na všech střežených a zásahově významných prostorech.
- [ ] Sepsat prostory nepřístupné generálním klíčem.
- [ ] Prověřit přístup do pronajatých nebo provozně oddělených částí.

### 5.3 KTPO

- [ ] Ověřit certifikované provedení a požadovaný typ vložky pro daný HZS kraj.
- [ ] Ověřit umístění u předpokládaného nástupu JPO.
- [ ] Ověřit obvyklou instalační výšku přibližně 1 až 1,5 m, dovolují-li to podmínky.
- [ ] Ověřit aktivaci KTPO pouze ústřednou EPS.
- [ ] Ověřit uložení správného generálního klíče.
- [ ] Ověřit optické výstražné zařízení kategorie B dle ČSN EN 54-23, jeho viditelnost z příjezdové komunikace a umístění zpravidla nad KTPO.

### 5.4 OPPO

- [ ] Ověřit certifikované provedení.
- [ ] Ověřit umístění uvnitř objektu poblíž zásahového vstupu.
- [ ] Ověřit dobrou viditelnost a snadnou přístupnost.
- [ ] Ověřit propojení, indikace a ovládací funkce.

### 5.5 ZDP a přenosové cesty

- [ ] Určit bezpečné a servisně dostupné místo ZDP.
- [ ] Ověřit napájení a zálohování.
- [ ] Ověřit přenos signálu minimálně dvěma nezávislými cestami požadované kategorie.
- [ ] Ověřit datovou konektivitu a mobilní signál.
- [ ] Ověřit kabelovou trasu EPS–ZDP a požadavky PBŘ.
- [ ] Ověřit kompatibilitu ZDP s PCO příslušného HZS kraje.
- [ ] Ověřit možnost monitorování poruch a ztráty komunikace.

## 6. Výstupy po obhlídce

Vypracovat nebo zadat:

- [ ] zápis z obhlídky s fotografiemi, závadami, odpovědnostmi a termíny,
- [ ] definitivní rozsah nabídky ELZY a jasné výluky,
- [ ] projekt nebo technickou zprávu ZDP,
- [ ] aktualizaci projektu EPS nebo pasport skutečného stavu,
- [ ] aktualizaci PBŘ, pokud návrh nebo skutečnost není v souladu,
- [ ] plán střežených prostor se smyčkami/skupinami/hlásiči,
- [ ] DZP nebo operativní kartu, případně její aktualizaci,
- [ ] schéma příjezdu a přístupu JPO,
- [ ] vymezení prostor nepřístupných generálním klíčem,
- [ ] seznam kontaktních osob,
- [ ] žádost o připojení na PCO HZS,
- [ ] podklady pro smlouvu s HZS,
- [ ] plán funkčních zkoušek a odpovědnosti účastníků.

Dokumentace PBŘ, EPS, ZDP, DZP a skutečné provedení si musí vzájemně odpovídat. Při rozporu zastavit schvalování nebo montáž dotčené části a vyžádat opravu autorizovaným zpracovatelem.

## 7. Rozhodovací brány

### 7.1 Nabídka

Závaznou realizační nabídku připravit až po obhlídce nebo po obdržení dostatečných podkladů. Pokud podklady chybí:

- nabídku označit jako předběžnou,
- uvést předpoklady,
- uvést výluky,
- oddělit ZDP a přenosovou službu od zásahů do EPS, KTPO, OPPO, PBŘ a DZP,
- upozornit na možné vícepráce po pasportizaci skutečného stavu.

### 7.2 Zahájení montáže

Montáž pustit pouze tehdy, když:

- [ ] skutečný stav EPS je známý,
- [ ] navržené řešení není v rozporu s PBŘ,
- [ ] jsou určena místa ZDP, KTPO a OPPO,
- [ ] je odsouhlasen zásahový vstup,
- [ ] je vyřešen generální klíč,
- [ ] je potvrzeno rozhraní se servisní organizací EPS,
- [ ] jsou potvrzeny hlavní a záložní přenosová cesta,
- [ ] jsou známé aktuální podmínky HZS kraje.

Fyzickou montáž lze provést před podpisem smlouvy s HZS pouze tehdy, pokud je technické řešení jednoznačné a nehrozí předělávky. Montáž sama neznamená připravenost k připojení.

### 7.3 Funkční zkouška HZS

Termín zkoušky potvrdit až po splnění:

- [ ] EPS bez známých závad ovlivňujících zkoušku,
- [ ] ZDP kompletní a nakonfigurované,
- [ ] obě přenosové cesty funkční,
- [ ] KTPO, optické zařízení a generální klíč funkční,
- [ ] OPPO funkční,
- [ ] správný přenos poplachu, poruchy a adresace,
- [ ] aktuální plán střežených prostor,
- [ ] DZP/operativní karta v požadovaném stavu,
- [ ] provozní kniha EPS a návod u ústředny,
- [ ] dokončené zkoušky vazeb PBZ,
- [ ] potvrzená účast servisní organizace EPS,
- [ ] přítomný zástupce provozovatele EPS oprávněný podepsat protokol,
- [ ] přítomný zástupce provozovatele přenosové cesty.

## 8. Součinnost a odpovědnosti

### Provozovatel objektu / EPS

- dodat dokumentaci a smluvní údaje,
- umožnit přístup do všech prostor,
- zajistit generální klíč,
- určit aktuální kontaktní osoby,
- zajistit osobu schopnou dostavit se k objektu v časovém limitu stanoveném smlouvou/podmínkami HZS,
- zajistit náhradní opatření při odstavení EPS nebo přenosu,
- hradit smluvní poplatky a případné náklady za plané výjezdy.

### Servisní organizace EPS

- potvrdit kompatibilitu a rozhraní,
- naprogramovat výstupy a adresaci,
- realizovat zásahy do EPS, KTPO, OPPO a vazeb, pokud nejsou v rozsahu ELZY,
- provést potřebné kontroly a funkční zkoušky,
- účastnit se závěrečné zkoušky.

### OZO PO / zpracovatel PBŘ a DZP

- posoudit soulad řešení s PBŘ,
- aktualizovat PBŘ, DZP nebo operativní kartu,
- stanovit náhradní organizační opatření,
- projednat dokumentaci s HZS, pokud je to součástí zakázky.

### ELZY jako provozovatel přenosové cesty

- navrhnout a zdokumentovat ZDP,
- dodat a nakonfigurovat schválené zařízení,
- zajistit hlavní a záložní přenosovou cestu,
- koordinovat nastavení přenosu na PCO HZS,
- účastnit se funkční zkoušky,
- zajistit monitoring, servis a předepsané kontroly ZDP dle smlouvy.

### HZS kraje

- posoudit žádost a podmínky připojení,
- určit konkrétní požadavky kraje, klíčový systém a případné doplnění dokumentace,
- připravit smlouvu nebo zápis o připojení,
- provést nebo vyhodnotit funkční zkoušku a ověřovací provoz,
- rozhodnout o přechodu do trvalého provozu.

## 9. Uvedení do provozu

Postupovat v tomto pořadí:

1. dokončit instalaci a interní zkoušky,
2. dokončit a sjednotit dokumentaci,
3. podat kompletní žádost a přílohy,
4. uzavřít smlouvu nebo zápis o připojení podle postupu HZS,
5. provést funkční zkoušku,
6. podepsat akceptační protokol,
7. zahájit ověřovací provoz,
8. odstranit zjištěné závady,
9. po úspěšném ověřovacím provozu přejít do trvalého provozu,
10. předat provozní dokumentaci a nastavit pravidelné kontroly, servis a aktualizaci kontaktů.

## 10. Stop body

Nepotvrzovat připravenost k připojení, pokud:

- chybí PBŘ nebo je zjevně neaktuální,
- skutečný stav EPS neodpovídá dokumentaci,
- chybí dokumentace skutečného provedení nebo použitelný plán střežených prostor,
- není dořešena DZP/operativní karta,
- není funkční generální klíč pro požadované prostory,
- není jasný příjezd a vstup JPO,
- nefunguje KTPO, OPPO nebo optická signalizace,
- není dostupná servisní organizace EPS,
- nejsou dokončeny vazby EPS na PBZ,
- není vyřešena adresace,
- nejsou funkční dvě nezávislé přenosové cesty,
- PBŘ, EPS, ZDP, DZP a skutečnost si odporují,
- nejsou určeny odpovědné kontaktní osoby provozovatele.

## 11. Jak odpovídat zákazníkovi

### 11.1 Styl

- Psát česky, stručně, věcně a srozumitelně.
- Vysvětlit, co potřebujeme, proč to potřebujeme, kdo to zajistí a co bude následovat.
- Nepřenášet na zákazníka interní zkratky bez vysvětlení.
- Nevytvářet dojem, že samotná montáž ZDP automaticky znamená připojení na PCO HZS.
- Neuvádět neověřené právní závěry, ceny ani pevné termíny.
- U termínu vysvětlit závislosti: dokumentace, stanovisko HZS, servis EPS, montáž, zkouška a ověřovací provoz.
- Jasně oddělit povinný požadavek, doporučení ELZY a pracovní předpoklad.

### 11.2 Standardní struktura odpovědi

1. Potvrdit pochopení objektu a požadovaného výsledku.
2. Uvést, co je potřeba dodat před obhlídkou.
3. Popsat, co ELZY zkontroluje na místě.
4. Uvést, jaké dokumentace nebo úpravy mohou vzniknout.
5. Vymezit součinnost investora, servisu EPS, OZO PO, ELZY a HZS.
6. Popsat podmínky montáže a připojení.
7. Navrhnout konkrétní další krok.

### 11.3 Vzor stručné odpovědi na novou poptávku

> Dobrý den,
>
> děkujeme za poptávku připojení EPS objektu na PCO HZS. Pro první posouzení prosíme o zaslání aktuálního PBŘ, projektu a dokumentace skutečného provedení EPS, půdorysů ideálně ve formátu DWG, informace o typu ústředny EPS, stávajícím KTPO/OPPO, generálním klíči a aktuální DZP nebo operativní kartě.
>
> Následně provedeme obhlídku, při které ověříme skutečný stav EPS, možnosti připojení ZDP, přístup jednotek PO, rozsah generálního klíče, umístění KTPO a OPPO, přenosové cesty a potřebnou součinnost servisní organizace EPS.
>
> Po obhlídce upřesníme rozsah dodávky, nutné úpravy a dokumentaci. Montáž a termín připojení lze závazně stanovit až po ověření souladu skutečného stavu s PBŘ a podmínkami příslušného HZS kraje.
>
> Prosíme proto nejprve o zaslání dostupných podkladů a návrh termínu obhlídky.

### 11.4 Vzor odpovědi při chybějících podkladech

> Dobrý den,
>
> z dodaných podkladů zatím nelze bezpečně určit úplný rozsah připojení EPS na PCO HZS. Chybí zejména [doplnit]. Bez těchto informací můžeme připravit pouze orientační nabídku s výhradou změny po obhlídce a kontrole skutečného stavu.
>
> Doporučujeme nejprve provést obhlídku a pasportizaci EPS. Současně je potřeba zapojit servisní organizaci EPS a OZO PO, protože mohou být nutné úpravy EPS, KTPO/OPPO, PBŘ nebo DZP.
>
> Po doplnění podkladů připravíme seznam konkrétních kroků, odpovědností a realistický harmonogram.

### 11.5 Vzor přípravy na funkční zkoušku

> Dobrý den,
>
> před potvrzením termínu funkční zkoušky je potřeba dokončit a ověřit ZDP včetně obou přenosových cest, KTPO, generální klíč, OPPO, přenos poplachu, poruchy a adresace, aktuální plán střežených prostor a požadovanou DZP/operativní kartu.
>
> Zkoušky se musí účastnit zástupce provozovatele EPS oprávněný podepsat protokol, ELZY jako provozovatel přenosové cesty a doporučeně servisní organizace EPS. Termín potvrdíme po společné kontrole připravenosti.

## 12. Výstupní formáty

Podle požadavku vytvořit jeden z těchto výstupů:

- stručný e-mail zákazníkovi,
- checklist podkladů před obhlídkou,
- checklist obhlídky,
- zápis z obhlídky s úkoly a odpovědnostmi,
- rozsah cenové nabídky a výluky,
- harmonogram připojení,
- checklist připravenosti na funkční zkoušku,
- interní souhrn rizik zakázky.

U checklistu používat krátké položky a oddělit stav `splněno / chybí / zajišťuje / termín`. U e-mailu nabídnout maximálně dvě až tři jasně odlišné varianty pouze tehdy, když uživatel žádá o návrh textu bez určeného tónu.

## 13. Kontrola kvality před odesláním

Před odesláním ověřit:

- [ ] byl určen příslušný HZS kraj,
- [ ] jsou právní a krajské podmínky aktuální,
- [ ] jsou odděleny ověřené skutečnosti, interní zkušenost a pracovní předpoklady,
- [ ] jsou jasné odpovědnosti jednotlivých stran,
- [ ] nejsou slíbeny neověřené termíny nebo ceny,
- [ ] zákazník ví, co má dodat jako další krok,
- [ ] nechybí servisní organizace EPS a OZO PO,
- [ ] je řešen generální klíč, KTPO, OPPO, DZP a dvě přenosové cesty,
- [ ] je upozorněno na nutnost souladu PBŘ, EPS, ZDP, DZP a skutečného stavu.
