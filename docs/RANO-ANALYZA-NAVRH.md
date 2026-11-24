# Ranní analýza nezávislá na modelu (návrh 0.73.1)
Zadání Tomáše 2026-11-24: ranní analýza musí být nastavitelná a nezávislá na modelu (Claude předplatné přes ElzaMost, lokální model na tomto PC, pravidlová záloha) a spuštěná tak, aby v 7:30 bylo hotovo.

## Hotovo v 0.73.1
- Nastavení v Můj den → Ranní kontrola: model (automaticky / pravidlová / Claude / lokální), „hotovo do“ (7:30), nejpozdější start (rano.js: rnLoad, rnSave, rnZmer, rnStart, rnModel; test/rano.test.js).
- Plán: start = hotovo − (1,5 × naměřená doba modelu + 10 min). Doba se průměruje (rnZmer), aby ji nepřepsal jeden výkyv.

## Další krok (nový běh)
1. Úloha „ranní analýza“ jako položka noční fronty (nocni.js) s nejpozdějším startem; most ji spustí sám (bez otevřené aplikace), výsledek čeká v Čeká na vás.
2. Každý běh zapíše naměřenou dobu a model (rnZmer) a do AI záznamu; selže-li model, použije se další v pořadí Claude → lokální → pravidla.
3. Obsah analýzy: poptávky, doporučení, přiložená komunikace, návrh zařazení; nic se neodesílá ani nezapisuje bez potvrzení a každý krok má Zpět.

## Lokální model (až bude čas, zapsat do plánu)
- Ollama už most umí (tools/elza-most.ps1, /stav vrací seznam modelů). Zbývá vybrat model pro češtinu, připravit systémový prompt, pravidla (docs/znalosti), skilly a znalosti firmy (ZnalostElza) a změřit dobu běhu.
- Obrázky: lokálně Flux (např. přes ComfyUI), nejdřív ověřit výkon grafické karty a velikost modelu; zařadit do noční fronty vedle textových úloh. Nic placeného navíc.
