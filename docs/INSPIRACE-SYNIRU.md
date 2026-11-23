# Inspirace ze Syniru pro ELZA asistenta (2026-11-23)

Zdroj: průchod beta 0.2.82 na PC + syniru.com (security, privacy, terms, changelog).
Zásada: nic nekopírujeme jako aplikaci, bereme jen to, co má Syniru lépe. Žádné nové moduly do ověření na ostrých datech, proto vše níže je úprava stávajících modulů.

## A. Design a UX (převzít hned)
1. **Spodní plovoucí lišta** (7 položek, ikona + popisek, aktivní = zvýrazněná „pilulka“). ELZA ji má na mobilu → sjednotit i na PC.
2. **Horní lišta rychlých nástrojů** (Úkoly, Kalendář, Šablony, Znalosti, Statistiky) jako **překryvné panely** nad aktuální stránkou – uživatel neztratí kontext.
3. **Rychlé přidání úkolu** v jednom řádku: text + datum + komu → Enter. Filtry Otevřené / Moje / Agentů / Hotové.
4. **Přehled = osobní uvítání**: „Dobrý večer, Tomáši“, datum, svátek, počty *právě pracuje / dnes hotovo / dnes už žádná úloha*. Pro „Sestavu moje“.
5. **Karta „První hotový výsledek“** – 3 očíslované kroky pro nového uživatele (onboarding kolegů).
6. **Blok „Čeká na vás“** – vše, co potřebuje moje schválení, na jednom místě s polem pro zadání práce.
7. **Pravý panel v chatu „Co agent ví“** (pokyny projektu, sdílené poznámky, historie) + **Aktivita** (jaké soubory/stránky agent použil). Přímo do AI dotazů u případu.
8. **„Připnout do spodní lišty“** u každé stránky – personalizace menu bez nastavování.
9. **Nastavení jako mřížka dlaždic** (ikona, název, jednořádkový popis) + přepínač **Normální / Pokročilý** režim (technika schovaná).
10. Tmavý skleněný styl s jednou akcentní barvou – použít s barvou ELZY, ne převzít tyrkys.

## B. Agenti a skilly (Elzáčci)
11. **Galerie agentů podle rolí** se skupinami (Kancelář, Obchod, Data, Technika). ELZA: Technik EPS, OZO PO, Revizní technik, Projektant, Obchod/poptávky, Hlídač termínů, Zápis z porady.
12. **„Popište agenta jednou větou“** → AI navrhne jméno, roli, pokyny a oprávnění, uživatel před uložením zkontroluje.
13. **Balíček pro roli** = agent + skilly s popisem *kdy se použijí* („U každé kontroly…“, „Když píšeš nabídku…“).
14. **Líné načítání skillů**: agent vidí jen názvy, celý postup načte až při potřebě → šetří tokeny. Použít pro sdílené postupy (PostupVerze).
15. **Postupy (řetězy agentů)**: práce jde od agenta k agentovi, kde chcete kontrolu, čeká na schválení; spouští se ručně nebo v čase. = náš proces případu s body schválení.
16. **Agenti se učí nové skilly sami, vy je schvalujete** – sedí na požadavek „učit se, starý postup nezapomenout“.
17. **Senior/junior**: hlavní agent rozdělí práci a kontroluje výsledky.

## C. Bezpečnost (doplnit do ochrana.js / straz.js)
18. Výchozí **režim schvalování akcí**, samostatný režim zapíná uživatel u každého agenta zvlášť.
19. Po práci **seznam změněných souborů s možností vrátit**.
20. **Obsah webu a výsledky nástrojů = data, ne pokyny** – napsat do Pravidel AI doslova.
21. Bez schválení nesmí: přihlašovací údaje, nasazení, platby, kontakt cizích služeb.
22. Přihlášení dělá vždy člověk (agent se zastaví).
23. Stránka **„Známá omezení“** – poctivě uvést, co chráněno není. Dát do nápovědy ELZY.

## D. Provoz
24. **Automatické zálohy** (interval, počet kopií, náhled zálohy) – pro nastavení ELZY v SharePointu verzování + export.
25. **Statistiky 7/30/90 dní**: kdo pracuje nejvíc, na čem, kdy → měření času a efektivity týmu.
26. **Hlídač webu** (dostupnost s upozorněním) – použít pro portál zákazníka a GitHub Pages.
27. **Promo**: počítadla Ke schválení / Naplánované / Odesláno / Vyžaduje pozornost – vzor pro frontu pošty i úloh.

## Nebrat
3D kancelář (efekt bez užitku pro techniky), avatary/portréty, kurzy krypto, citáty – kromě svátku.

## Stav zapracování
A1–A6, A8: 0.56.0. C18–C23: 0.57.0 (C19 vrácení jen u Úloh pro agenty). B15: 0.59.0 (Postupy v Úlohách). B11–B14: 0.58.0 (galerie, jedna věta, balíček role, líné načítání; B16 a B17 zatím ne).

## Pořadí zapracování (návrh)
1) A1–A6 + A8 (vzhled a Můj den) → 2) C18–C22 do Pravidel AI → 3) B11–B14 galerie Elzáčků → 4) B15 postupy se schválením → 5) D25 statistiky.
