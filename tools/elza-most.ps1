# ELZA most – lokální pomocník pro ELZA asistenta (verze most 1)
# Spouští oficiální Claude CLI (předplatné, bez API klíče) a volitelně Ollamu.
# Bezpečnost: poslouchá jen na 127.0.0.1, přijme jen stránku ELZA asistenta (Origin),
# každé volání musí nést párovací kód. Claude běží bez nástrojů (jen text), nic na disku nemění.
# Spuštění: powershell -ExecutionPolicy Bypass -File elza-most.ps1   (bez správce)
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [Text.UTF8Encoding]::new($false); $OutputEncoding = [Text.UTF8Encoding]::new($false)
# Vypnout QuickEdit (klik do okna by most pozastavil)
try { Add-Type -Name K -Namespace W -MemberDefinition '[DllImport("kernel32.dll")] public static extern IntPtr GetStdHandle(int h); [DllImport("kernel32.dll")] public static extern bool GetConsoleMode(IntPtr h, out int m); [DllImport("kernel32.dll")] public static extern bool SetConsoleMode(IntPtr h, int m);'; $h=[W.K]::GetStdHandle(-10); $m=0; [void][W.K]::GetConsoleMode($h,[ref]$m); [void][W.K]::SetConsoleMode($h, ($m -band -bnot 0x40) -bor 0x80) } catch {}
$Port = 47321
$Povolene = @('https://tomaskrejh.github.io')
$Slozka = Join-Path $env:LOCALAPPDATA 'ElzaMost'
New-Item -ItemType Directory -Force -Path $Slozka | Out-Null
$KodSoubor = Join-Path $Slozka 'parovaci-kod.txt'
if (-not (Test-Path $KodSoubor)) {
  $b = New-Object byte[] 12; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
  ([BitConverter]::ToString($b) -replace '-','').ToLower() | Set-Content -Encoding ascii $KodSoubor
}
$Kod = (Get-Content $KodSoubor -Raw).Trim()
$Log = Join-Path $Slozka 'most.log'
function Zapis($t){ Add-Content -Path $Log -Value ((Get-Date -Format s) + ' ' + $t) }

$L = New-Object Net.HttpListener
$L.Prefixes.Add("http://127.0.0.1:$Port/")
$L.Start()
Write-Host "ELZA most běží na http://127.0.0.1:$Port"
Write-Host "Párovací kód (vložte jednou do ELZA asistenta → AI nastavení → Lokální most):"
Write-Host "  $Kod" -ForegroundColor Yellow
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
function MaOllamu(){ try { Invoke-RestMethod -TimeoutSec 2 'http://127.0.0.1:11434/api/tags' | Out-Null; $true } catch { $false } }

while ($L.IsListening) {
  $ctx = $L.GetContext(); $q = $ctx.Request
  try {
    $o = $q.Headers['Origin']
    if ($o -and -not ($Povolene -contains $o)) { Odpoved $ctx 403 @{chyba='Cizí stránka'}; Zapis "odmítnuto $o"; continue }
    if ($q.HttpMethod -eq 'OPTIONS') { Odpoved $ctx 200 @{ok=1}; continue }
    if ($q.Headers['x-elza-kod'] -ne $Kod) { Odpoved $ctx 401 @{chyba='Špatný párovací kód'}; continue }
    $cesta = $q.Url.AbsolutePath
    if ($cesta -eq '/stav') {
      $v = ''; if (MaClaude) { try { $v = (& $Cl --version 2>$null | Out-String).Trim() } catch {} }
      $m = @(); if (MaOllamu) { try { $m = (Invoke-RestMethod 'http://127.0.0.1:11434/api/tags').models | ForEach-Object { $_.name } } catch {} }
      Odpoved $ctx 200 @{most=1; pc=$env:COMPUTERNAME; claude=$v; ollama=$m}; continue
    }
    $sr = New-Object IO.StreamReader($q.InputStream, [Text.Encoding]::UTF8); $j = $sr.ReadToEnd() | ConvertFrom-Json
    if ($cesta -eq '/claude') {
      if (-not (MaClaude)) { Odpoved $ctx 500 @{chyba='Claude CLI není nainstalován (krok 1 v Návodu).'}; continue }
      $a = @('-p','--output-format','json','--max-turns','1','--disallowedTools','Bash,Edit,Write,WebFetch,WebSearch,NotebookEdit')
      if ($j.model) { $a += @('--model', [string]$j.model) }
      if ($j.system) { $a += @('--append-system-prompt', [string]$j.system) }
      $t0 = Get-Date
      $out = ([string]$j.prompt) | & $Cl @a 2>&1 | Out-String
      $r = $null; try { $r = $out | ConvertFrom-Json } catch {}
      Zapis ("claude " + [int]((Get-Date)-$t0).TotalSeconds + ' s')
      if ($r -and -not $r.is_error) { Odpoved $ctx 200 @{text=[string]$r.result; s=[int]((Get-Date)-$t0).TotalSeconds} }
      else { Odpoved $ctx 500 @{chyba=('Claude CLI: ' + $out.Substring(0,[Math]::Min(300,$out.Length)))} }
      continue
    }
    if ($cesta -eq '/ollama') {
      $body = @{model=[string]$j.model; stream=$false; messages=@(@{role='system';content=[string]$j.system},@{role='user';content=[string]$j.prompt})} | ConvertTo-Json -Depth 5
      $r = Invoke-RestMethod -Method Post -TimeoutSec 900 -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($body)) 'http://127.0.0.1:11434/api/chat'
      Odpoved $ctx 200 @{text=[string]$r.message.content}; continue
    }
    Odpoved $ctx 404 @{chyba='Neznámá cesta'}
  } catch { try { Odpoved $ctx 500 @{chyba=$_.Exception.Message} } catch {} }
}
