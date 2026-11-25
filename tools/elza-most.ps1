# ELZA most – lokální pomocník pro ELZA asistenta (verze most 2, 0.73.11)
# Spouští oficiální Claude CLI (předplatné, bez API klíče) a volitelně Ollamu.
# Bezpečnost: poslouchá jen na 127.0.0.1, přijme jen stránku ELZA asistenta (Origin),
# každé volání musí nést párovací kód. Claude běží bez nástrojů (jen text), nic na disku nemění.
# Instalace: tools/elza-most-instalace.cmd (autostart jen HKCU Run, bez VBS). Token: %LOCALAPPDATA%\ElzaMost\token
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [Text.UTF8Encoding]::new($false); $OutputEncoding = [Text.UTF8Encoding]::new($false)
$Port = 47321
$Povolene = @('https://tomaskrejh.github.io')
$Slozka = Join-Path $env:LOCALAPPDATA 'ElzaMost'
New-Item -ItemType Directory -Force -Path $Slozka | Out-Null
$TokenSoubor = Join-Path $Slozka 'token'
$Log = Join-Path $Slozka 'elza-most.log'
function Zapis($t){ Add-Content -Path $Log -Value ((Get-Date -Format s) + ' ' + $t) }
if (-not (Test-Path $TokenSoubor)) { Zapis 'CHYBA: chybí token, spusťte elza-most-instalace.cmd'; exit 1 }
$Kod = (Get-Content $TokenSoubor -Raw).Trim()
if ($Kod.Length -lt 43) { Zapis 'CHYBA: token je kratší než 32 bajtů, spusťte elza-most-instalace.cmd'; exit 1 }
# jediná instance (named mutex) + PID soubor pro instalátor
$Mutex = New-Object Threading.Mutex($false, 'Local\ElzaMost')
if (-not $Mutex.WaitOne(0)) { Zapis 'už běží jiná instance, končím'; exit 0 }
Set-Content -Encoding ascii -Path (Join-Path $Slozka 'elza-most.pid') -Value $PID
$PovoleneHost = @("127.0.0.1:$Port", "localhost:$Port")

$L = New-Object Net.HttpListener
$L.Prefixes.Add("http://127.0.0.1:$Port/")   # jen loopback, nikdy + / * / 0.0.0.0
$L.Start()
Write-Host "ELZA most běží na http://127.0.0.1:$Port"
Write-Host "Token pro aplikaci je v $TokenSoubor"
Zapis 'start'

function Odpoved($ctx, $code, $obj){
  $r = $ctx.Response; $o = $ctx.Request.Headers['Origin']
  if ($Povolene -contains $o) {
    $r.Headers['Access-Control-Allow-Origin'] = $o
    $r.Headers['Access-Control-Allow-Headers'] = 'content-type, x-elza-kod'
    $r.Headers['Access-Control-Allow-Methods'] = 'GET, POST'
    $r.Headers['Access-Control-Allow-Private-Network'] = 'true'
    $r.Headers['Vary'] = 'Origin'
  }
  $r.StatusCode = $code; $r.ContentType = 'application/json; charset=utf-8'
  $b = [Text.Encoding]::UTF8.GetBytes(($obj | ConvertTo-Json -Depth 6 -Compress))
  $r.ContentLength64 = $b.Length; $r.OutputStream.Write($b, 0, $b.Length); $r.OutputStream.Close(); $r.Close()
}
$Cl = (Get-Command claude -ErrorAction SilentlyContinue).Source
if (-not $Cl) { $x = Join-Path $env:USERPROFILE '.local\bin\claude.exe'; if (Test-Path $x) { $Cl = $x } }
function MaClaude(){ [bool]$Cl }
# Codex CLI: 1) na PATH, 2) cesta zapsaná v %LOCALAPPDATA%\ElzaMost\codex-cesta.txt, 3) běžná místa (npm, .local\bin), 4) balíček aplikace Codex (jen hledání souboru codex.exe, nic se nespouští ani nestahuje)
function NajdiCodex(){
  $c = (Get-Command codex -ErrorAction SilentlyContinue).Source; if ($c) { return $c }
  $cf = Join-Path $Slozka 'codex-cesta.txt'
  if (Test-Path $cf) { $p = (Get-Content $cf -Raw).Trim().Trim('"'); if ($p -and (Test-Path $p)) { return $p } }
  foreach ($p in @((Join-Path $env:APPDATA 'npm\codex.cmd'), (Join-Path $env:USERPROFILE '.local\bin\codex.exe'), (Join-Path $env:USERPROFILE '.codex\bin\codex.exe'))) { if (Test-Path $p) { return $p } }
  try {
    foreach ($pk in @(Get-AppxPackage -Name '*Codex*' -ErrorAction SilentlyContinue)) {
      if ($pk.InstallLocation) { $f = Get-ChildItem -Path $pk.InstallLocation -Recurse -Filter 'codex.exe' -Depth 5 -ErrorAction SilentlyContinue | Select-Object -First 1; if ($f) { return $f.FullName } }
    }
  } catch {}
  return $null
}
$Cx = NajdiCodex
function MaCodex(){ [bool]$Cx }
function MaOllamu(){ try { Invoke-RestMethod -TimeoutSec 2 'http://127.0.0.1:11434/api/tags' | Out-Null; $true } catch { $false } }

# --- volání modelů (společné pro okamžité volání i noční frontu) ---
function SpustClaude($a, $prompt){
  $ef = Join-Path $Slozka 'claude-chyba.txt'
  $pr = Join-Path $env:TEMP 'elza-most-prazdno'; if (-not (Test-Path $pr)) { New-Item -ItemType Directory -Path $pr | Out-Null }
  $ErrorActionPreference = 'Continue'
  Push-Location $pr
  try { $out = ([string]$prompt) | & $Cl @a 2>$ef | Out-String } finally { Pop-Location }
  $ErrorActionPreference = 'Stop'
  if (-not $out.Trim() -and (Test-Path $ef)) { $out = Get-Content $ef -Raw }
  $r = $null; try { $r = $out | ConvertFrom-Json } catch {}
  return @{r=$r; out=$out}
}
function ZavolejClaude($model, $system, $prompt){
  if (-not (MaClaude)) { return @{ok=$false; chyba='Claude CLI není nainstalován (krok 1 v Návodu).'} }
  $t0 = Get-Date
  # lehký režim (0.69.8): bez nástrojů, bez nastavení a CLAUDE.md, prázdná složka, vlastní krátký systémový prompt = méně vstupních tokenů; selže-li, použije se dřívější úplný režim
  $zaklad = @('-p','--output-format','json','--max-turns','1','--strict-mcp-config')
  $lehky = $zaklad + @('--tools','""','--disable-slash-commands','--no-session-persistence','--setting-sources','user','--system-prompt',$(if ($system) { [string]$system } else { 'Jsi asistent firmy ELZY. Odpovídej česky, stručně a věcně.' }))
  $plny = $zaklad + @('--disallowedTools','Bash,Edit,Write,WebFetch,WebSearch,NotebookEdit')
  if ($system) { $plny += @('--append-system-prompt', [string]$system) }
  if ($model) { $lehky += @('--model', [string]$model); $plny += @('--model', [string]$model) }
  $rezim = 'lehky'
  $x = SpustClaude $lehky $prompt
  if (-not ($x.r -and -not $x.r.is_error)) { $rezim = 'plny'; Zapis ('lehký režim selhal, jedu úplně: ' + $x.out.Substring(0,[Math]::Min(120,$x.out.Length))); $x = SpustClaude $plny $prompt }
  $r = $x.r; $out = $x.out
  $s = [int]((Get-Date)-$t0).TotalSeconds
  Zapis ("claude $model $rezim $s s")
  $script:LimCas = [datetime]::MinValue
  if ($r -and -not $r.is_error) {
    $ti = 0; $to = 0; $usd = 0
    try { $ti = [int]$r.usage.input_tokens + [int]$r.usage.cache_read_input_tokens + [int]$r.usage.cache_creation_input_tokens; $to = [int]$r.usage.output_tokens } catch {}
    try { $usd = [double]$r.total_cost_usd } catch {}
    return @{ok=$true; text=[string]$r.result; s=$s; usage=@{vstup=$ti; vystup=$to; usd=$usd; rezim=$rezim}}
  }
  return @{ok=$false; chyba=('Claude CLI: ' + $out.Substring(0,[Math]::Min(300,$out.Length)))}
}
function ZavolejOllamu($model, $system, $prompt){
  $body = @{model=[string]$model; stream=$false; messages=@(@{role='system';content=[string]$system},@{role='user';content=[string]$prompt})} | ConvertTo-Json -Depth 5
  $r = Invoke-RestMethod -Method Post -TimeoutSec 900 -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($body)) 'http://127.0.0.1:11434/api/chat'
  $ti = 0; $to = 0; try { $ti = [int]$r.prompt_eval_count; $to = [int]$r.eval_count } catch {}
  return @{ok=$true; text=[string]$r.message.content; usage=@{vstup=$ti; vystup=$to; usd=0}}
}

# --- skutečné limity předplatného Claude (stejný zdroj jako /usage v Claude CLI; neoficiální, při změně vrátí ok=false) ---
$script:LimCas = [datetime]::MinValue; $script:LimVal = @{ok=$false}; $script:LimDo = [datetime]::MinValue; $script:LimPosl = @{ok=$false}
function LimityZavolej(){
  $f = Join-Path $env:USERPROFILE '.claude\.credentials.json'
  if (-not (Test-Path $f)) { return @{ok=$false; duvod='soubor s přihlášením Claude nenalezen (v okně Claude napište /login).'} }
  $o = (Get-Content $f -Raw | ConvertFrom-Json).claudeAiOauth
  $tok = [string]$o.accessToken
  $u = Invoke-RestMethod -TimeoutSec 8 -Uri 'https://api.anthropic.com/api/oauth/usage' -Headers @{Authorization=("Bearer $tok"); 'anthropic-beta'='oauth-2025-04-20'}
  $tok = $null
  return @{ok=$true; pet=@{pct=[double]$u.five_hour.utilization; konec=[string]$u.five_hour.resets_at}; tyden=@{pct=[double]$u.seven_day.utilization; konec=[string]$u.seven_day.resets_at}}
}
function Limity(){
  # 429 = služba limitů si žádá klid: po dobu Retry-After (výchozí 5 min) se na ni neptáme a vracíme poslední známé hodnoty
  if ((Get-Date) -lt $script:LimDo) { return $script:LimVal }
  # limity se mění pomalu: úspěch se drží 10 min (+ náhodných 0-60 s, aby se stanice na jednom účtu nesešly), neúspěch 60 s
  $ttl = if ($script:LimVal.ok) { 600 + (Get-Random -Maximum 60) } else { 60 }
  if (((Get-Date) - $script:LimCas).TotalSeconds -lt $ttl) { return $script:LimVal }
  $script:LimCas = Get-Date; $script:LimVal = @{ok=$false; duvod='neznámá chyba'}
  try { $script:LimVal = LimityZavolej; $script:LimPosl = $script:LimVal }
  catch {
    $m = $_.Exception.Message
    if ($m -match '429') {
      $ra = 300; try { $v = [int]$_.Exception.Response.Headers['Retry-After']; if ($v -gt 0) { $ra = [Math]::Min(900, $v) } } catch {}
      $script:LimDo = (Get-Date).AddSeconds($ra)
      if ($script:LimPosl.ok) { $script:LimVal = @{ok=$true; zastarale=$true; pet=$script:LimPosl.pet; tyden=$script:LimPosl.tyden} }
      else { $script:LimVal = @{ok=$false; duvod=('Služba limitů Claude žádá klid (429), další pokus za ' + $ra + ' s.')} }
      Zapis ('limity: 429, pauza ' + $ra + ' s')
      return $script:LimVal
    }
    # platnost přístupového tokenu je krátká a obnovuje ji jen Claude CLI při použití: jedno nejlevnější volání ji obnoví a pokus se zopakuje
    if ((MaClaude) -and ($m -match '401|403|nauthor|xpired')) {
      Zapis ('limity: token vypršel, obnovuji drobným voláním Claude (' + $m + ')')
      try { $null = SpustClaude @('-p','--output-format','json','--max-turns','1','--tools','""','--no-session-persistence','--model','haiku') 'ok'; $script:LimVal = LimityZavolej }
      catch { $script:LimVal = @{ok=$false; duvod=('přihlášení Claude vypršelo a obnovení se nepodařilo: ' + $_.Exception.Message + ' (v okně Claude napište /login).')} }
    } else { $script:LimVal = @{ok=$false; duvod=('Claude neodpovídá na dotaz o limitech: ' + $m)} }
    Zapis ('limity nedostupné: ' + $script:LimVal.duvod)
  }
  return $script:LimVal
}

# --- noční fronta (úlohy předané aplikací, běží i bez otevřené aplikace) ---
$FrontaSoubor = Join-Path $Slozka 'fronta.json'
$NastSoubor = Join-Path $Slozka 'noc-nastaveni.json'
function Rozbal($x){ foreach ($a in @($x)) { if ($a -is [System.Array]) { Rozbal $a } elseif ($null -ne $a) { $a } } }
function NactiFrontu(){ if (Test-Path $FrontaSoubor) { try { return @(Rozbal (Get-Content $FrontaSoubor -Raw -Encoding UTF8 | ConvertFrom-Json)) } catch { $script:NocChyba = 'fronta: ' + $_.Exception.Message } }; return @() }
function UlozFrontu($a){ ConvertTo-Json -InputObject @($a) -Depth 6 | Set-Content -Encoding UTF8 $FrontaSoubor }
function NactiNast(){ $n = @{od=22; do=6; zapnuto=$true}; if (Test-Path $NastSoubor) { try { $x = Get-Content $NastSoubor -Raw | ConvertFrom-Json; $n = @{od=[int]$x.od; do=[int]$x.do; zapnuto=[bool]$x.zapnuto} } catch {} }; return $n }
function VNoci(){ $n = NactiNast; if (-not $n.zapnuto) { return $false }; $h = (Get-Date).Hour; if ($n.od -gt $n.do) { return ($h -ge $n.od -or $h -lt $n.do) } else { return ($h -ge $n.od -and $h -lt $n.do) } }
$script:Ted = $false; $script:NocChyba = ''; $script:NocCas = [datetime]::MinValue
# --- ChatGPT (Codex) na předplatném (0.77.0): oficiální Codex CLI přihlášený ChatGPT účtem; bez API klíče, bez čtení tokenu ---
# Běží v prázdné dočasné složce, jen pro čtení (--sandbox read-only), bez ukládání záznamu (--ephemeral); text se bere ze souboru -o, tokeny z události turn.completed (--json).
# Codex CLI nelze, na rozdíl od Claude, spustit úplně bez nástrojů: proto zadání výslovně zakazuje příkazy a Pravidla AI (C23) a ochrana vložených pokynů platí stejně.
function ZavolejCodex($model, $system, $prompt){
  if (-not (MaCodex)) { return @{ok=$false; chyba='Most nenašel program codex. Je-li Codex nainstalován (aplikace Codex), zapište úplnou cestu k codex.exe do souboru %LOCALAPPDATA%\ElzaMost\codex-cesta.txt a restartujte most; jinak ho nainstalujte (Návod) a přihlaste příkazem codex login.'} }
  $t0 = Get-Date
  $pr = Join-Path $env:TEMP 'elza-most-prazdno-codex'; if (-not (Test-Path $pr)) { New-Item -ItemType Directory -Path $pr | Out-Null }
  $vf = Join-Path $pr ('odpoved-' + [guid]::NewGuid().ToString('N') + '.txt')
  $a = @('exec','--json','--ephemeral','--skip-git-repo-check','--sandbox','read-only','-o',$vf)
  $m = [string]$model; if ($m -and $m -match '^[A-Za-z0-9._-]{1,40}$') { $a += @('-m',$m) }
  $a += '-'
  $text = '[SYSTÉM]' + [Environment]::NewLine + [string]$system + [Environment]::NewLine + 'Nespouštěj žádné příkazy, nečti ani nezapisuj žádné soubory, nepoužívej síť. Odpověz jen textem.' + [Environment]::NewLine + [Environment]::NewLine + '[ZADÁNÍ]' + [Environment]::NewLine + [string]$prompt
  $ErrorActionPreference = 'Continue'
  Push-Location $pr
  $ef = Join-Path $Slozka 'codex-chyba.txt'
  try { $out = $text | & $Cx @a 2>$ef | Out-String } finally { Pop-Location }
  $ErrorActionPreference = 'Stop'
  $s = [int]((Get-Date)-$t0).TotalSeconds
  $odp = ''; if (Test-Path $vf) { $odp = (Get-Content $vf -Raw -Encoding UTF8); Remove-Item $vf -Force -ErrorAction SilentlyContinue }
  Zapis ("codex $m $s s")
  $ti = 0; $to = 0
  foreach ($ln in ($out -split "`n")) {
    if ($ln -match '"turn\.completed"') { try { $j = $ln | ConvertFrom-Json; $ti = [int]$j.usage.input_tokens; $to = [int]$j.usage.output_tokens + [int]$j.usage.reasoning_output_tokens } catch {} }
  }
  if ($odp.Trim()) { return @{ok=$true; text=$odp.Trim(); s=$s; usage=@{vstup=$ti; vystup=$to; usd=0; rezim='codex'}} }
  $e = ''; if (Test-Path $ef) { $e = (Get-Content $ef -Raw) }
  $x = ($out + ' ' + $e).Trim(); if ($x.Length -gt 300) { $x = $x.Substring(0,300) }
  return @{ok=$false; chyba=('Codex CLI: ' + $x + ' (přihlášení: příkaz codex login, účet ChatGPT).')}
}
# Limity Codexu: jen čtení posledního záznamu Codex CLI (~/.codex/sessions); formát není oficiálně zdokumentován, proto při nenalezení ok=false, nikdy nula
function OknoTxt($min){ $m = [int]$min; if ($m -ge 1440) { return ([string][Math]::Round($m/1440) + ' dní') } elseif ($m -ge 60) { return ([string][Math]::Round($m/60) + ' h') } else { return ([string]$m + ' min') } }
function LimityCodex(){
  $d = Join-Path $env:USERPROFILE '.codex\sessions'
  if (-not (Test-Path $d)) { return @{ok=$false; duvod='Codex CLI zatím nic nezapsal (spusťte codex a přihlaste se: codex login).'} }
  $f = Get-ChildItem -Path $d -Recurse -Filter 'rollout-*.jsonl' -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 5
  foreach ($x in $f) {
    $r = $null
    try { $r = Get-Content -Path $x.FullName -Tail 400 -Encoding UTF8 -ErrorAction Stop | Where-Object { $_ -match '"rate_limits"' } | Select-Object -Last 1 } catch {}
    if (-not $r) { continue }
    try {
      $o = $r | ConvertFrom-Json; $rl = $o.payload.rate_limits; if (-not $rl) { $rl = $o.rate_limits }
      if (-not $rl) { continue }
      $now = [DateTimeOffset]::UtcNow
      $w = @{}
      foreach ($k in @('primary','secondary')) {
        $v = $rl.$k; $pct = $null; $konec = ''; $okno = ''
        if ($v) {
          $okno = OknoTxt $v.window_minutes
          try { $e = [DateTimeOffset]::FromUnixTimeSeconds([long]$v.resets_at); $konec = $e.ToString('o'); if ($e -gt $now) { $pct = [double]$v.used_percent } } catch {}
        }
        $w[$k] = @{pct=$pct; konec=$konec; okno=$okno}
      }
      return @{ok=$true; pet=$w['primary']; tyden=$w['secondary']; stari=$x.LastWriteTime.ToString('d. M. HH:mm')}
    } catch {}
  }
  return @{ok=$false; duvod='v záznamech Codex CLI nejsou údaje o limitech (zatím žádné spuštění, nebo se změnil formát).'}
}

function Nocni(){
  if (-not ($script:Ted -or (VNoci))) { return }
  $f = @(NactiFrontu); $i = -1
  for ($k = 0; $k -lt $f.Count; $k++) { if ($f[$k].stav -eq 'ceka') { $i = $k; break } }
  if ($i -lt 0) { $script:Ted = $false; return }
  $u = $f[$i]; $u.stav = 'bezi'; UlozFrontu $f; Zapis ('noc: spouštím ' + $u.id + ' ' + $u.tool + ' ' + $u.model)
  try {
    if ($u.tool -eq 'ollama') { $r = ZavolejOllamu $u.model $u.system $u.prompt } elseif ($u.tool -eq 'codex') { $r = ZavolejCodex $u.model $u.system $u.prompt } else { $r = ZavolejClaude $u.model $u.system $u.prompt }
  } catch { $r = @{ok=$false; chyba=$_.Exception.Message} }
  $f = @(NactiFrontu)
  foreach ($x in $f) { if ($x.id -eq $u.id) {
    $x.konec = (Get-Date -Format s)
    if ($r.ok) { $x.stav = 'hotovo'; $x.text = $r.text; $x.usage = $r.usage } else { $x.stav = 'chyba'; $x.chyba = $r.chyba }
  } }
  UlozFrontu $f
}

$Cekani = $L.GetContextAsync()
while ($L.IsListening) {
  # fronta se kontroluje každé 3 s bez ohledu na to, zda přicházejí dotazy (0.69.12; dřív jen při 3 s ticha)
  if (((Get-Date) - $script:NocCas).TotalSeconds -ge 3) { $script:NocCas = Get-Date; try { Nocni } catch { $script:NocChyba = $_.Exception.Message; Zapis ('noc: ' + $_.Exception.Message) } }
  if (-not $Cekani.Wait(1000)) { continue }
  $ctx = $Cekani.Result; $Cekani = $L.GetContextAsync(); $q = $ctx.Request
  try {
    $o = $q.Headers['Origin']
    if (-not ($PovoleneHost -contains [string]$q.Headers['Host'])) { Odpoved $ctx 403 @{chyba='Neplatný Host'}; Zapis ('odmítnut Host ' + $q.Headers['Host']); continue }
    if ($o -and -not ($Povolene -contains $o)) { Odpoved $ctx 403 @{chyba='Cizí stránka'}; Zapis "odmítnuto $o"; continue }
    if ($q.HttpMethod -eq 'OPTIONS') { Odpoved $ctx 200 @{ok=1}; continue }
    if ($q.Headers['x-elza-kod'] -cne $Kod) { Odpoved $ctx 401 @{chyba='Neplatný token'}; Zapis 'odmítnuto: neplatný token'; continue }
    $cesta = $q.Url.AbsolutePath
    if ($cesta -eq '/stav') {
      $v = ''; if (MaClaude) { try { $v = (& $Cl --version 2>$null | Out-String).Trim() } catch {} }
      $m = @(); if (MaOllamu) { try { $m = (Invoke-RestMethod 'http://127.0.0.1:11434/api/tags').models | ForEach-Object { $_.name } } catch {} }
      $n = NactiNast
      $cv = ''; if (MaCodex) { try { $cv = (& $Cx --version 2>$null | Out-String).Trim() } catch {} }
      Odpoved $ctx 200 @{most=2; nocChyba=$script:NocChyba; pc=$env:COMPUTERNAME; claude=$v; codex=$cv; ollama=$m; noc=@{od=$n.od; do=$n.do; zapnuto=$n.zapnuto}}; continue
    }
    if ($cesta -eq '/limity') { Odpoved $ctx 200 (Limity); continue }
    if ($cesta -eq '/limity-codex') { Odpoved $ctx 200 (LimityCodex); continue }
    if ($cesta -eq '/fronta' -and $q.HttpMethod -eq 'GET') {
      $s = @(NactiFrontu | ForEach-Object { @{id=$_.id; stav=$_.stav; tool=$_.tool; model=$_.model; konec=$_.konec} })
      Odpoved $ctx 200 @{ulohy=$s; vNoci=(VNoci)}; continue
    }
    if ($cesta -eq '/fronta/vysledky') {
      $s = @(NactiFrontu | Where-Object { $_.stav -eq 'hotovo' -or $_.stav -eq 'chyba' } | ForEach-Object { @{id=$_.id; stav=$_.stav; text=$_.text; chyba=$_.chyba; usage=$_.usage; konec=$_.konec; model=$_.model; tool=$_.tool} })
      Odpoved $ctx 200 @{vysledky=$s}; continue
    }
    $sr = New-Object IO.StreamReader($q.InputStream, [Text.Encoding]::UTF8); $j = $sr.ReadToEnd() | ConvertFrom-Json
    if ($cesta -eq '/fronta') {
      $f = @(NactiFrontu); $pridano = 0
      foreach ($u in @($j.ulohy)) {
        if (-not $u.id -or -not $u.prompt) { continue }
        if ($f | Where-Object { $_.id -eq $u.id }) { continue }
        $t = 'claude'; if ([string]$u.tool -eq 'ollama') { $t = 'ollama' } elseif ([string]$u.tool -eq 'codex') { $t = 'codex' }
        $f += @{id=[string]$u.id; tool=$t; model=[string]$u.model; system=[string]$u.system; prompt=[string]$u.prompt; stav='ceka'; text=''; chyba=''; konec=''; usage=$null}; $pridano++
      }
      UlozFrontu $f
      if ($j.ted) { $script:Ted = $true }
      Odpoved $ctx 200 @{pridano=$pridano}; continue
    }
    if ($cesta -eq '/fronta/potvrdit') {
      $ids = @($j.ids | ForEach-Object { [string]$_ })
      UlozFrontu @(NactiFrontu | Where-Object { -not (($ids -contains $_.id) -and ($_.stav -eq 'hotovo' -or $_.stav -eq 'chyba')) })
      Odpoved $ctx 200 @{ok=1}; continue
    }
    if ($cesta -eq '/fronta/nastaveni') {
      $od = [Math]::Max(0,[Math]::Min(23,[int]$j.od)); $do = [Math]::Max(0,[Math]::Min(23,[int]$j.do))
      ConvertTo-Json -InputObject @{od=$od; do=$do; zapnuto=[bool]$j.zapnuto} | Set-Content -Encoding UTF8 $NastSoubor
      Odpoved $ctx 200 @{ok=1}; continue
    }
    if ($cesta -eq '/claude') {
      $r = ZavolejClaude $j.model $j.system $j.prompt
      if ($r.ok) { Odpoved $ctx 200 @{text=$r.text; s=$r.s; usage=$r.usage} } else { Odpoved $ctx 500 @{chyba=$r.chyba} }
      continue
    }
    if ($cesta -eq '/codex') {
      $r = ZavolejCodex $j.model $j.system $j.prompt
      if ($r.ok) { Odpoved $ctx 200 @{text=$r.text; s=$r.s; usage=$r.usage} } else { Odpoved $ctx 500 @{chyba=$r.chyba} }
      continue
    }
    if ($cesta -eq '/ollama') {
      $r = ZavolejOllamu $j.model $j.system $j.prompt
      Odpoved $ctx 200 @{text=$r.text; usage=$r.usage}; continue
    }
    Odpoved $ctx 404 @{chyba='Neznámá cesta'}
  } catch { try { Odpoved $ctx 500 @{chyba=$_.Exception.Message} } catch {} }
}
