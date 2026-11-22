# Architektura: ELZA asistent + zákaznický portál (návrh 2026-11-22)
Stav: návrh k odsouhlasení. Nahrazuje NABIDKY-NAVRH.md (ten je jeho podmnožinou).

## 1. Princip
Jeden řetězec dat, tři vrstvy, žádné kopie:
**Zákazník → Smlouva/Technologie → Případ → Zakázka → Úkoly (dílčí práce) → Milníky (co vidí zákazník)**.
- Asistent (interní) vidí vše do úrovně úkolu a člověka.
- Portál (zákazník) vidí jen milníky, stav, termíny, dokumenty označené „zveřejnit“ a své požadavky.
- Pošta, aktivity, čas a AI se vážou vždy na nejnižší známý uzel (úkol > zakázka > případ > zákazník).

## 2. Entity a místo uložení
| Entita | Web SharePointu | Klíč | Vazby |
|---|---|---|---|
| Zakaznik | Zakázky ELZA | ZAK-NNN | IČO, adresa |
| OsobaZakaznika | Zakázky ELZA | e-mail | Zakaznik; rozsah: celá firma / konkrétní zakázka; role |
| Smlouva | Zakázky ELZA | SML-RRRR-NNN | Zakaznik, platnost, typ servisu |
| Technologie | Zakázky ELZA | TEC-NNN | Smlouva, objekt, typ (EPS, EZS, PCO, elektro…), výrobce |
| Kontrola (plán) | Zakázky ELZA | – | Technologie, druh (revize, kontrola provozuschopnosti, servis), perioda, příští termín, předpis |
| Pripad | ELZA-asistent (Fronta práce) | WORK-… | Zakaznik, volitelně Smlouva/Technologie, pošta |
| Zakazka | Zakázky ELZA | Z-RRRR-NNN | Pripad, Zakaznik, kontaktní osoby zakázky |
| Ukol | Zakázky ELZA | – | Zakazka, řešitel, od–do, závislost, Milnik |
| Milnik | Zakázky ELZA | – | Zakazka, název (např. „Technická dokumentace“), % hotovo = souhrn úkolů, zveřejnit ano/ne |
| Pozadavek (help desk) | Portál ELZY | REQ-… | Zakaznik, Technologie/Zakazka, stav, SLA → zakládá Případ |
| Schvaleni | Portál ELZY | – | Zakazka/Nabidka/Osoba, kdo navrhl, kdo potvrdil v ELZY |
| Nabidka | Zakázky ELZA | – | Zakazka/Pripad; cenu vede obchod |
| Dokument | knihovna zakázky | – | Zakazka, Milnik, verze, zveřejnit ano/ne |

## 3. Dva režimy portálu
1. **Smluvní zákazník (trvalý přístup)**: přihlášení z adres (e-mailů/domén), které si sám spravuje; každá nová osoba = Schválení, aktivní až po potvrzení odpovědným pracovníkem ELZY. Vidí: své technologie, kalendář kontrol a revizí (semafor: v termínu / do 30 dní / po termínu), protokoly, help desk.
2. **Zakázkový přístup**: osoba vázaná jen na konkrétní zakázku (kontakty se liší zakázku od zakázky). Vidí jen tu zakázku.

## 4. Co zákazník v portálu dělá
- Help desk: nový požadavek (porucha, dotaz, objednávka) → automaticky Případ v asistentovi s vazbou na technologii; zákazník vidí stav a odpovědi.
- Zakázky a případy: vývoj (Gantt milníků), na co se čeká (na zákazníka / na ELZY), požadavky a jejich historie, dokumenty ke zveřejnění.
- Editace: doplnění údajů, připomínky, žádost o nový kontakt nebo změnu rozsahu → vše přes Schválení.
- Schvaluje: nabídky, předávací protokoly, změny; ELZY potvrzuje.

## 5. Gantt: dvě úrovně stejných dat
- **Asistent**: úkoly po lidech (Novák TZ, Dvořák výkresy, Krejčí kontrola), závislosti, vytížení člověka napříč zakázkami.
- **Portál**: tytéž úkoly sečtené do milníků (např. „Technická dokumentace 60 %“). Zákazník nevidí jména a interní poznámky.
- Případ bez zakázky má jednodušší časovou osu: první komunikace → nabídka → rozhodnutí.
- Kontroly a revize ze smluv se zobrazují na stejné ose jako zakázky (jeden kalendář termínů).

## 6. Toky (Power Automate, vlastník Tomáš)
- T3 Vstup zákazníka: Požadavek/Schválení z portálu → Případ / úkol pro odpovědného.
- T4 Připomínky čekání; T9 Kontrola ELZY (nová zakázka); T10 Přístupy a uvítání (po potvrzení osoby).
- **Nový T12 Termíny kontrol**: denně z plánu Kontrol → 30/7 dní před termínem upozornění odpovědnému (a zákazníkovi až po zapnutí), po termínu červeně v portálu i velínu.
- **Nový T13 Help desk**: Požadavek → Případ + potvrzení přijetí zákazníkovi (až po schválení textu).

## 7. Bezpečnost
Práva řídí SharePoint (jedna skupina na zákazníka, osoba zakázky jen na položky zakázky). Interní pole (jména řešitelů, čas, poznámky, ceny) jsou jen na webu Zakázky ELZA, do portálu jde jen výběr přes tok. Nic se neodešle bez potvrzení pracovníkem ELZY.

## 8. Pořadí realizace (vlákna)
1. Seznamy Ukol a Milnik + Gantt v asistentovi (Zakázky a Případy).
2. Smlouva, Technologie, Kontrola + kalendář termínů a T12.
3. Portál: přihlášení z adres, osoby a Schválení, Gantt milníků.
4. Help desk + T13.
5. Nabídky (evidence, cenu vede obchod).
