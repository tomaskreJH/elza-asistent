# Claude CLI v aplikaci přes lokální most (0.68.0)
Cíl: Elzáčci běží na předplatném Claude (oficiální Claude CLI), bez API klíče a bez globálního správce. Stejný most umí Ollamu (lokální modely, zdarma).

## Jak to funguje
Aplikace (https://tomaskrejh.github.io) → http://127.0.0.1:47321 (ElzaMost, PowerShell, tools/elza-most.ps1) → `claude -p` nebo Ollama 127.0.0.1:11434 → text zpět.

## Bezpečnost
- Poslouchá jen 127.0.0.1, ne síť. Přijme jen Origin ELZA asistenta (CORS + Private Network Access).
- Každé volání nese párovací kód (náhodných 24 znaků, %LOCALAPPDATA%\ElzaMost\parovaci-kod.txt, v aplikaci jen localStorage).
- Claude běží s --max-turns 1, bez připojených služeb MCP (--strict-mcp-config) a se zakázanými nástroji (Bash, Edit, Write, WebFetch, WebSearch): jen čte zadání a vrací text.
- Platí všechny vrstvy aplikace: Pravidla AI, ochrana vložených pokynů, náhled před odesláním, záznam AIZaznam. CSP povoluje jen http://127.0.0.1:47321.
- Instalace jen pro uživatele (%LOCALAPPDATA%, složka Po spuštění), bez správce.

## Omezení
- Most musí běžet na počítači, kde je aplikace otevřená (PC a NB zvlášť); na mobilu ne.
- Limity předplatného služby neposkytují přes API: přehled v AI nastavení je ruční.
- Živý stav běhu: „AI pracuje…“ dokud most neodpoví; fronta pro noční běhy (Ollama, obrázky) je další krok.
