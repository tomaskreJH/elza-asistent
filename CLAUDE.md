# ELZA asistent: pravidla pro každý nástroj (Claude, Codex, ChatGPT, jiný model)
ZDROJ PRAVDY JE GITHUB (origin/main), ne lokální klon ani lokální soubory nástroje. Na začátku VŽDY: git fetch origin && git pull --ff-only origin main, a teprve potom čti pravidla. Lokální kopie pravidel mimo repozitář (globální AGENTS.md, skilly, paměť nástroje) jsou jen odkaz sem; při rozporu platí repozitář.
Pravidla: docs/POSTUP-VYVOJ.md (body 1 až 15), pak docs/STAV.md, docs/DALSI-KROKY.md a docs/NOVE-VLAKNO-PROMPT.md. Nic se zde neduplikuje. Tomáše nikdy nežádej o stažení gitu. Most a tools/ neupravuj bez výslovného pokynu (bod 15).
Pravidla jsou psaná nezávisle na modelu; nic v nich nesmí předpokládat konkrétní AI.
