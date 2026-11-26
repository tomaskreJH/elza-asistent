# ELZA most – lokální pomocník pro ELZA asistenta (verze most 3)
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
try { $VlastniMutex = $Mutex.WaitOne(0) } catch [Threading.AbandonedMutexException] { $VlastniMutex = $true }
if (-not $VlastniMutex) { Zapis 'už běží jiná instance, končím'; exit 0 }
Set-Content -Encoding ascii -Path (Join-Path $Slozka 'elza-most.pid') -Value $PID
$PovoleneHost = @("127.0.0.1:$Port", "localhost:$Port")

$L = New-Object Net.HttpListener
$L.Prefixes.Add("http://127.0.0.1:$Port/")   # jen loopback, nikdy + / * / 0.0.0.0

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
$Cl = (Get-Command claude.exe -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1).Source
if (-not $Cl) { $x = Join-Path $env:USERPROFILE '.local\bin\claude.exe'; if (Test-Path $x -PathType Leaf) { $Cl = $x } }
function NajdiCodex(){
  $c = (Get-Command codex.exe -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1).Source
  if ($c) { return $c }
  $cf = Join-Path $Slozka 'codex-cesta.txt'
  if (Test-Path $cf) {
    $p = (Get-Content $cf -Raw).Trim().Trim('"')
    if ($p -and [IO.Path]::GetFileName($p) -ieq 'codex.exe' -and (Test-Path -LiteralPath $p -PathType Leaf)) { return $p }
  }
  foreach ($p in @((Join-Path $env:USERPROFILE '.local\bin\codex.exe'), (Join-Path $env:USERPROFILE '.codex\bin\codex.exe'))) {
    if (Test-Path $p -PathType Leaf) { return $p }
  }
  $npm = Join-Path $env:APPDATA 'npm\node_modules\@openai\codex'
  if (Test-Path $npm) {
    $f = Get-ChildItem -LiteralPath $npm -Recurse -Filter 'codex.exe' -Depth 8 -File -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($f) { return $f.FullName }
  }
  try {
    foreach ($pk in @(Get-AppxPackage -Name '*Codex*' -ErrorAction SilentlyContinue)) {
      if (-not $pk.InstallLocation) { continue }
      $p = Join-Path $pk.InstallLocation 'app\resources\codex.exe'
      if (Test-Path $p -PathType Leaf) { return $p }
    }
  } catch {}
  return $null
}
$Cx = NajdiCodex

function ArgumentWindows([string]$hodnota){
  # .NET ve Windows PowerShellu 5.1 nemá ArgumentList. Každý argument uzavřeme do uvozovek podle pravidel Windows CRT.
  $hodnota = $hodnota -replace '(\\*)"', '$1$1\"' -replace '(\\+)$', '$1$1'
  return '"' + $hodnota + '"'
}
function SpustModel($program, $argumenty, $prompt, $slozka, $sekundy){
  $info = New-Object Diagnostics.ProcessStartInfo
  $info.FileName = $program
  $info.Arguments = ($argumenty | ForEach-Object { ArgumentWindows $_ }) -join ' '
  $info.WorkingDirectory = $slozka
  $info.UseShellExecute = $false
  $info.CreateNoWindow = $true
  $info.RedirectStandardInput = $true
  $info.RedirectStandardOutput = $true
  $info.RedirectStandardError = $true
  $info.StandardOutputEncoding = [Text.Encoding]::UTF8
  $info.StandardErrorEncoding = [Text.Encoding]::UTF8
  $p = New-Object Diagnostics.Process
  $p.StartInfo = $info
  $cas = [Diagnostics.Stopwatch]::StartNew()
  $spusten = $false
  try {
    $spusten = $p.Start()
    if (-not $spusten) { throw 'CLI se nepodařilo spustit.' }
    $vystup = $p.StandardOutput.ReadToEndAsync()
    $chyby = $p.StandardError.ReadToEndAsync()
    # BaseStream zapisuje UTF-8 bez záhlaví i ve Windows PowerShellu 5.1.
    $data = [Text.Encoding]::UTF8.GetBytes([string]$prompt)
    $zapis = $p.StandardInput.BaseStream.WriteAsync($data, 0, $data.Length)
    $limit = $sekundy * 1000
    if (-not $zapis.Wait($limit)) { return @{timeout=$true} }
    $p.StandardInput.Close()
    if (-not $p.WaitForExit([Math]::Max(0, ($limit - [int]$cas.ElapsedMilliseconds)))) { return @{timeout=$true} }
    if (-not [Threading.Tasks.Task]::WaitAll([Threading.Tasks.Task[]]@($vystup, $chyby), [Math]::Max(0, ($limit - [int]$cas.ElapsedMilliseconds)))) { return @{timeout=$true} }
    return @{timeout=$false; kod=$p.ExitCode; vystup=$vystup.Result; chyby=$chyby.Result}
  } finally {
    if ($spusten -and -not $p.HasExited) { try { $p.Kill() } catch {} }
    $p.Dispose()
  }
}

function ZavolejClaude($model, $system, $prompt){
  if (-not $Cl) { return @{ok=$false; chyba='Most nenašel Claude CLI. Instalace je v Návodu.'} }
  if ($model -and $model -notmatch '^[A-Za-z0-9._-]{1,80}$') { return @{ok=$false; chyba='Neplatný název modelu Claude.'} }
  $t0 = Get-Date
  $pr = Join-Path $env:TEMP 'elza-most-prazdno'
  [IO.Directory]::CreateDirectory($pr) | Out-Null
  $instrukce = if ($system) { [string]$system } else { 'Jsi asistent firmy ELZY. Odpovídej česky, stručně a věcně.' }
  $a = @('-p','--output-format','json','--max-turns','1','--strict-mcp-config','--tools','','--disable-slash-commands','--no-session-persistence','--setting-sources','user','--system-prompt',$instrukce)
  if ($model) { $a += @('--model',[string]$model) }
  $x = SpustModel $Cl $a $prompt $pr 90
  $s = [int]((Get-Date)-$t0).TotalSeconds
  Zapis ("claude $model $s s")
  if ($x.timeout) { return @{ok=$false; http=504; chyba='Claude nedokončil volání do 90 sekund.'} }
  $r = $null
  try { $r = $x.vystup | ConvertFrom-Json } catch {}
  if ($x.kod -eq 0 -and $r -and -not $r.is_error) {
    $ti = [int]$r.usage.input_tokens + [int]$r.usage.cache_read_input_tokens + [int]$r.usage.cache_creation_input_tokens
    return @{ok=$true; text=[string]$r.result; s=$s; usage=@{vstup=$ti; vystup=[int]$r.usage.output_tokens; usd=[double]$r.total_cost_usd; rezim='lehky'}}
  }
  if (($r.result + ' ' + $x.chyby) -match '429|rate.limit|usage.limit|hit.your.limit') { return @{ok=$false; http=429; chyba='Claude hlásí dosažený limit předplatného.'} }
  return @{ok=$false; chyba='Claude CLI úlohu nedokončil. Zkontrolujte stav předplatného a přihlášení přímo v Claude CLI.'}
}
function ZavolejOllamu($model, $system, $prompt){
  $body = @{model=[string]$model; stream=$false; messages=@(@{role='system';content=[string]$system},@{role='user';content=[string]$prompt})} | ConvertTo-Json -Depth 5
  $r = Invoke-RestMethod -Method Post -TimeoutSec 90 -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($body)) 'http://127.0.0.1:11434/api/chat'
  return @{ok=$true; text=[string]$r.message.content; usage=@{vstup=[int]$r.prompt_eval_count; vystup=[int]$r.eval_count; usd=0}}
}

# --- noční fronta (úlohy předané aplikací, běží i bez otevřené aplikace) ---
$FrontaSoubor = Join-Path $Slozka 'fronta.json'
$NastSoubor = Join-Path $Slozka 'noc-nastaveni.json'
function Rozbal($x){ foreach ($a in @($x)) { if ($a -is [System.Array]) { Rozbal $a } elseif ($null -ne $a) { $a } } }
function NactiFrontu(){ if (Test-Path $FrontaSoubor) { try { return @(Rozbal (Get-Content $FrontaSoubor -Raw -Encoding UTF8 | ConvertFrom-Json)) } catch { $script:NocChyba = 'fronta: ' + $_.Exception.Message } }; return @() }
function UlozFrontu($a){
  $docasny = $FrontaSoubor + '.tmp'
  try {
    ConvertTo-Json -InputObject @($a) -Depth 6 | Set-Content -Encoding UTF8 $docasny
    if ([IO.File]::Exists($FrontaSoubor)) { [IO.File]::Replace($docasny,$FrontaSoubor,[NullString]::Value) }
    else { [IO.File]::Move($docasny,$FrontaSoubor) }
  } finally { Remove-Item -LiteralPath $docasny -Force -ErrorAction SilentlyContinue }
}
function NactiNast(){ $n = @{od=22; do=6; zapnuto=$true}; if (Test-Path $NastSoubor) { try { $x = Get-Content $NastSoubor -Raw | ConvertFrom-Json; $n = @{od=[int]$x.od; do=[int]$x.do; zapnuto=[bool]$x.zapnuto} } catch {} }; return $n }
function VNoci(){ $n = NactiNast; if (-not $n.zapnuto) { return $false }; $h = (Get-Date).Hour; if ($n.od -gt $n.do) { return ($h -ge $n.od -or $h -lt $n.do) } else { return ($h -ge $n.od -and $h -lt $n.do) } }
$script:Ted = $false; $script:NocChyba = ''; $script:NocCas = [datetime]::MinValue
# --- ChatGPT (Codex) na předplatném (0.77.0): oficiální Codex CLI přihlášený ChatGPT účtem; bez API klíče, bez čtení tokenu ---
# Běží v prázdné dočasné složce, jen pro čtení (--sandbox read-only), bez ukládání záznamu (--ephemeral); text se bere ze souboru -o, tokeny z události turn.completed (--json).
# Codex CLI nelze, na rozdíl od Claude, spustit úplně bez nástrojů: proto zadání výslovně zakazuje příkazy a Pravidla AI (C23) a ochrana vložených pokynů platí stejně.
function ZavolejCodex($model, $system, $prompt){
  if (-not $Cx) { return @{ok=$false; chyba='Most nenašel program codex. Je-li Codex nainstalován (aplikace Codex), zapište úplnou cestu k codex.exe do souboru %LOCALAPPDATA%\ElzaMost\codex-cesta.txt a restartujte most; jinak ho nainstalujte (Návod) a přihlaste příkazem codex login.'} }
  $t0 = Get-Date
  $pr = Join-Path $env:TEMP 'elza-most-prazdno-codex'
  [IO.Directory]::CreateDirectory($pr) | Out-Null
  $vf = Join-Path $pr ('odpoved-' + [guid]::NewGuid().ToString('N') + '.txt')
  $a = @('--ask-for-approval','never','exec','--json','--ephemeral','--skip-git-repo-check','--sandbox','read-only','-o',$vf)
  $m = [string]$model
  if ($m -and $m -notmatch '^[A-Za-z0-9._-]{1,80}$') { return @{ok=$false; chyba='Neplatný název modelu Codex.'} }
  if ($m) { $a += @('-m',$m) }
  $a += '-'
  $text = '[SYSTÉM]' + [Environment]::NewLine + [string]$system + [Environment]::NewLine + 'Nespouštěj žádné příkazy, nečti ani nezapisuj žádné soubory, nepoužívej síť. Odpověz jen textem.' + [Environment]::NewLine + [Environment]::NewLine + '[ZADÁNÍ]' + [Environment]::NewLine + [string]$prompt
  try {
    $x = SpustModel $Cx $a $text $pr 90
    if ($x.timeout) { return @{ok=$false; http=504; chyba='Codex nedokončil volání do 90 sekund.'} }
    $odp = ''; if (Test-Path $vf) { $odp = [string](Get-Content $vf -Raw -Encoding UTF8) }
  } finally {
    Remove-Item -LiteralPath $vf -Force -ErrorAction SilentlyContinue
  }
  $s = [int]((Get-Date)-$t0).TotalSeconds
  Zapis ("codex $m $s s")
  $ti = 0; $to = 0
  foreach ($ln in ($x.vystup -split "`n")) {
    if ($ln -match '"turn\.completed"') { try { $j = $ln | ConvertFrom-Json; $ti = [int]$j.usage.input_tokens; $to = [int]$j.usage.output_tokens + [int]$j.usage.reasoning_output_tokens } catch {} }
  }
  if ($x.kod -eq 0 -and $odp.Trim()) { return @{ok=$true; text=$odp.Trim(); s=$s; usage=@{vstup=$ti; vystup=$to; usd=0; rezim='codex'}} }
  if (($x.vystup + ' ' + $x.chyby) -match '429|rate.limit|usage.limit|hit.your.limit') { return @{ok=$false; http=429; chyba='Codex hlásí dosažený limit předplatného.'} }
  return @{ok=$false; chyba='Codex CLI úlohu nedokončil. Ověřte vybraný model, přihlášení a limity přímo v Codexu.'}
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

function Diagnostika(){
  $m = @()
  try { $m = @((Invoke-RestMethod -TimeoutSec 2 'http://127.0.0.1:11434/api/tags').models | ForEach-Object { $_.name }) } catch {}
  return @{ollama=$m; limity=(LimityCodex)}
}
# V obou runspacech jsou jen funkce z tohoto souboru. HTTP smyčka nikdy nečeká na CLI ani na diagnostiku.
$StavWorkeru = [Management.Automation.Runspaces.InitialSessionState]::CreateDefault()
foreach ($nazev in @('ArgumentWindows','SpustModel','ZavolejClaude','ZavolejCodex','ZavolejOllamu','Zapis','OknoTxt','LimityCodex','Diagnostika')) {
  $definice = (Get-Item "Function:\$nazev").ScriptBlock.ToString()
  $StavWorkeru.Commands.Add([Management.Automation.Runspaces.SessionStateFunctionEntry]::new($nazev,$definice))
}
foreach ($nazev in @('Cl','Cx','Log','ErrorActionPreference')) {
  $StavWorkeru.Variables.Add([Management.Automation.Runspaces.SessionStateVariableEntry]::new($nazev,(Get-Variable $nazev -ValueOnly),''))
}
$ModelRunspace = [RunspaceFactory]::CreateRunspace($StavWorkeru)
$DiagRunspace = [RunspaceFactory]::CreateRunspace($StavWorkeru)
$ModelRunspace.Open()
$DiagRunspace.Open()

function SpustPraci($runspace, $funkce, $argumenty){
  $ps = [PowerShell]::Create()
  $ps.Runspace = $runspace
  $null = $ps.AddCommand($funkce)
  foreach ($argument in $argumenty) { $null = $ps.AddArgument($argument) }
  try { return @{ps=$ps; operace=$ps.BeginInvoke()} } catch { $ps.Dispose(); throw }
}
function VysledekPrace($prace){
  try {
    $zaznamy = $prace.ps.EndInvoke($prace.operace)
    if ($zaznamy.Count -ne 1) { throw 'Práce nevrátila očekávaný výsledek.' }
    return $zaznamy[0]
  } finally { $prace.ps.Dispose() }
}
function SpustModelNaPozadi($tool, $u, $ctx){
  $funkce = switch ($tool) { 'codex' { 'ZavolejCodex' } 'ollama' { 'ZavolejOllamu' } default { 'ZavolejClaude' } }
  $prace = SpustPraci $ModelRunspace $funkce @([string]$u.model,[string]$u.system,[string]$u.prompt)
  $prace.ctx = $ctx
  $prace.id = $u.id
  $script:ModelPrace = $prace
}
function DokonciModel(){
  if (-not $script:ModelPrace -or -not $script:ModelPrace.operace.IsCompleted) { return }
  $prace = $script:ModelPrace
  $script:ModelPrace = $null
  try { $r = VysledekPrace $prace } catch {
    Zapis ('chyba práce: ' + $_.Exception.GetType().Name)
    $r = @{ok=$false; chyba='Spojení s poskytovatelem AI selhalo. Zkontrolujte jeho přihlášení nebo dostupnost.'}
  }
  if ($prace.ctx) {
    try {
      if ($r.ok) { Odpoved $prace.ctx 200 @{text=$r.text; s=$r.s; usage=$r.usage} }
      else { $http = if ($r.http) { $r.http } else { 500 }; Odpoved $prace.ctx $http @{chyba=$r.chyba} }
    } catch { Zapis 'klient ukončil čekání na model' }
    return
  }
  $f = @(NactiFrontu)
  foreach ($x in $f) {
    if ($x.id -ne $prace.id) { continue }
    $x.konec = (Get-Date -Format s)
    if ($r.ok) { $x.stav = 'hotovo'; $x.text = $r.text; $x.usage = $r.usage } else { $x.stav = 'chyba'; $x.chyba = $r.chyba }
  }
  UlozFrontu $f
}
function Nocni(){
  if ($script:ModelPrace -or -not ($script:Ted -or (VNoci))) { return }
  $f = @(NactiFrontu)
  $u = $f | Where-Object { $_.stav -eq 'ceka' } | Select-Object -First 1
  if (-not $u) { $script:Ted = $false; return }
  $u.stav = 'bezi'
  UlozFrontu $f
  try { SpustModelNaPozadi $u.tool $u $null } catch {
    $u.stav = 'chyba'; $u.chyba = 'Nešlo zahájit práci modelu.'; $u.konec = (Get-Date -Format s)
    UlozFrontu $f
    throw
  }
}

# Úloha přerušená restartem není automaticky účtována znovu.
$f = @(NactiFrontu)
$prerusene = @($f | Where-Object { $_.stav -eq 'bezi' })
foreach ($u in $prerusene) { $u.stav = 'chyba'; $u.chyba = 'Most se restartoval během práce.'; $u.konec = (Get-Date -Format s) }
if ($prerusene.Count) { UlozFrontu $f }
$Diag = @{ollama=@(); limity=@{ok=$false; duvod='Most teprve načítá místní údaje Codexu.'}}
$DiagDalsi = [datetime]::MinValue
$DiagPrace = $null
$script:ModelPrace = $null
$L.Start()
Zapis 'start most 3'
$Cekani = $L.GetContextAsync()
while ($L.IsListening) {
  try {
    DokonciModel
    if (((Get-Date) - $script:NocCas).TotalSeconds -ge 3) { $script:NocCas = Get-Date; Nocni }
    if ($DiagPrace -and $DiagPrace.operace.IsCompleted) {
      try { $Diag = VysledekPrace $DiagPrace } finally { $DiagPrace = $null; $DiagDalsi = (Get-Date).AddSeconds(45) }
    }
    if (-not $DiagPrace -and (Get-Date) -ge $DiagDalsi) {
      $DiagDalsi = (Get-Date).AddSeconds(45)
      $DiagPrace = SpustPraci $DiagRunspace 'Diagnostika' @()
    }
  } catch { $script:NocChyba = 'Most nemohl dokončit úlohu nebo diagnostiku.'; Zapis ('most: ' + $_.Exception.GetType().Name) }
  if (-not $Cekani.Wait(150)) { continue }
  $ctx = $Cekani.Result; $Cekani = $L.GetContextAsync(); $q = $ctx.Request
  try {
    $o = $q.Headers['Origin']
    if (-not ($PovoleneHost -contains [string]$q.Headers['Host'])) { Odpoved $ctx 403 @{chyba='Neplatný Host'}; Zapis ('odmítnut Host ' + $q.Headers['Host']); continue }
    if ($o -and -not ($Povolene -contains $o)) { Odpoved $ctx 403 @{chyba='Cizí stránka'}; Zapis "odmítnuto $o"; continue }
    if ($q.HttpMethod -eq 'OPTIONS') { Odpoved $ctx 200 @{ok=1}; continue }
    if ($q.Headers['x-elza-kod'] -cne $Kod) { Odpoved $ctx 401 @{chyba='Neplatný token'}; Zapis 'odmítnuto: neplatný token'; continue }
    $cesta = $q.Url.AbsolutePath
    if ($cesta -eq '/stav') {
      $n = NactiNast
      $v = if ($Cl) { 'nalezen' } else { '' }
      $cv = if ($Cx) { 'nalezen' } else { '' }
      Odpoved $ctx 200 @{most=3; pracuje=[bool]$script:ModelPrace; nocChyba=$script:NocChyba; pc=$env:COMPUTERNAME; claude=$v; codex=$cv; ollama=$Diag.ollama; noc=$n}; continue
    }
    if ($cesta -eq '/limity') { Odpoved $ctx 200 @{ok=$false; duvod='Limity předplatného jsou v Claude CLI pod /usage.'}; continue }
    if ($cesta -eq '/limity-codex') { Odpoved $ctx 200 $Diag.limity; continue }
    if ($cesta -eq '/fronta' -and $q.HttpMethod -eq 'GET') {
      $s = @(NactiFrontu | ForEach-Object { @{id=$_.id; stav=$_.stav; tool=$_.tool; model=$_.model; konec=$_.konec} })
      Odpoved $ctx 200 @{ulohy=$s; vNoci=(VNoci)}; continue
    }
    if ($cesta -eq '/fronta/vysledky') {
      $s = @(NactiFrontu | Where-Object { $_.stav -eq 'hotovo' -or $_.stav -eq 'chyba' } | ForEach-Object { @{id=$_.id; stav=$_.stav; text=$_.text; chyba=$_.chyba; usage=$_.usage; konec=$_.konec; model=$_.model; tool=$_.tool} })
      Odpoved $ctx 200 @{vysledky=$s}; continue
    }
    $modeloveCesty = @('/claude','/codex','/ollama')
    if ($cesta -notin ($modeloveCesty + @('/fronta','/fronta/potvrdit','/fronta/nastaveni'))) { Odpoved $ctx 404 @{chyba='Neznámá cesta'}; continue }
    if ($q.HttpMethod -ne 'POST') { Odpoved $ctx 405 @{chyba='Použijte POST.'}; continue }
    if ($q.ContentLength64 -le 0 -or $q.ContentLength64 -gt 8388608) { Odpoved $ctx 413 @{chyba='Velikost požadavku musí být známá a nejvýše 8 MiB.'}; continue }
    if ($cesta -in $modeloveCesty -and $script:ModelPrace) { Odpoved $ctx 409 @{chyba='Most právě zpracovává jinou úlohu. Zopakujte požadavek po dokončení.'}; continue }
    $sr = [IO.StreamReader]::new($q.InputStream, [Text.Encoding]::UTF8)
    try {
      $telo = $sr.ReadToEndAsync()
      if (-not $telo.Wait(1000)) { $ctx.Response.Abort(); continue }
      try { $j = $telo.Result | ConvertFrom-Json } catch { Odpoved $ctx 400 @{chyba='Neplatný JSON.'}; continue }
    } finally { $sr.Dispose() }
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
    if (-not $j.prompt) { Odpoved $ctx 400 @{chyba='Chybí zadání pro model.'}; continue }
    SpustModelNaPozadi ($cesta.Substring(1)) $j $ctx
  } catch {
    Zapis ('chyba požadavku: ' + $_.Exception.GetType().Name)
    try { Odpoved $ctx 500 @{chyba='Most nemohl zpracovat požadavek.'} } catch {}
  }
}
