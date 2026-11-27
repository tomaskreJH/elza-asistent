# STATUS (2026-11-27)

## Co se udělalo
- Repozitář aktualizován na origin/main (`git fetch` + `git pull --ff-only`), verze 0.88.2.
- Přečteny docs/POSTUP-VYVOJ.md, STAV.md, DALSI-KROKY.md, NOVE-VLAKNO-PROMPT.md.
- Základní kontrola: všechny `node test/*.test.js` prochází, `node tools/audit.js` bez nálezů.
- Žádný kód nezměněn. Nic nebylo nasazeno.

## Proč se nic dalšího nedělá
- Ověření funkcí na živých datech (shoda, poznámky, karta zákazníka, první odpověď, skica) vyžaduje přihlášení Tomáše. Bez něj to v tomto vlákně nejde.
- Ladění vah shody a pilot jedné poptávky potřebují reálná vlákna pošty.
- Vložení skicy do konceptu odpovědi (a do konceptu v Outlooku) není jen text: skica je obrázek vytvořený v prohlížeči, do konceptu by se musela připojit jako příloha přes Graph (zápis do Mail.ReadWrite). Nebylo rozhodnuto, zda se fotka zákazníka smí dávat do konceptu. Čeká na rozhodnutí Tomáše.

## Změněné soubory
- STATUS.md (nový)

## Další krok pro další AI
1. Po přihlášení Tomáše ověřit na ostrých datech: Pošta → vlákno → Návrh vazby se skóre; porovnat s tím, co Tomáš zařadil; podle výsledku ladit váhy v `vazbaSkore` (pripady.js / posta.js).
2. Rozhodnout s Tomášem, jestli skica jde do konceptu jako příloha (Graph draft s přílohou). Až pak implementovat a přidat test.
3. Pilot jedné poptávky (MAKRO) od návrhu odpovědi po koncept v Outlooku.
4. Most (`tools/`, elza-most) neupravovat bez výslovného „uprav most“. Čekat na overeni.txt ze stanic.
