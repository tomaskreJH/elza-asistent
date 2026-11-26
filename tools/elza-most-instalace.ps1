# ELZA most – instalace pro uživatele, bez správce (volá ji elza-most-instalace.cmd)
# Jediný autostart: HKCU Run "ElzaMost" -> powershell -WindowStyle Hidden -File (bez skriptovacích obálek).
# Idempotentní: nic nepřepisuje, pokud je vše aktuální. Defender se nenastavuje.
$ErrorActionPreference = 'Stop'
# zdroj = místní kopie, kterou připravil elza-most-instalace.cmd (nic se nespouští přímo z OneDrive/sdílené složky)
$Zdroj = $PSScriptRoot
$D = Join-Path $env:LOCALAPPDATA 'ElzaMost'
$Ps = Join-Path $D 'elza-most.ps1'
$PidSoubor = Join-Path $D 'elza-most.pid'
$TokenSoubor = Join-Path $D 'token'
$Log = Join-Path $D 'elza-most.log'
$RunKlic = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'
$RunHodnota = 'powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -WindowStyle Hidden -File "' + $Ps + '"'
$Zmeny = @()
New-Item -ItemType Directory -Force -Path $D | Out-Null
function Zapis($t){ Add-Content -Path $Log -Value ((Get-Date -Format s) + ' instalace: ' + $t) }

# 1) migrace staré verze (VBS ve Startup a v instalaci)
foreach ($f in @((Join-Path ([Environment]::GetFolderPath('Startup')) 'ElzaMost.vbs'),
                 (Join-Path ([Environment]::GetFolderPath('Startup')) 'ElzaMost.cmd'),
                 (Join-Path $D 'elza-most-skryty.vbs'))) {
  if (Test-Path $f) { Remove-Item -Force $f; $Zmeny += "smazáno $f" }
}

# 2) kopie skriptu jen při rozdílném hashi
$zmenaSkriptu = $false
$src = Join-Path $Zdroj 'elza-most.ps1'
if (-not (Test-Path $Ps) -or (Get-FileHash $src).Hash -ne (Get-FileHash $Ps).Hash) {
  Copy-Item -Force $src $Ps; $zmenaSkriptu = $true; $Zmeny += 'zkopírován elza-most.ps1'
}

# 3) token (32 bajtů, CSPRNG), soubor jen pro aktuálního uživatele
if (-not (Test-Path $TokenSoubor)) {
  $b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
  [Convert]::ToBase64String($b).TrimEnd('=').Replace('+','-').Replace('/','_') | Set-Content -Encoding ascii -NoNewline $TokenSoubor
  $sid = [Security.Principal.WindowsIdentity]::GetCurrent().User.Value
  & icacls $TokenSoubor /inheritance:r /grant:r "*${sid}:(R,W)" | Out-Null
  $Zmeny += 'vygenerován nový token'
}
$stary = Join-Path $D 'parovaci-kod.txt'; if (Test-Path $stary) { Remove-Item -Force $stary; $Zmeny += 'smazán starý párovací kód' }

# 4) Run klíč: zapsat jen když se liší
$akt = (Get-ItemProperty -Path $RunKlic -Name ElzaMost -ErrorAction SilentlyContinue).ElzaMost
if ($akt -ne $RunHodnota) { Set-ItemProperty -Path $RunKlic -Name ElzaMost -Value $RunHodnota; $Zmeny += 'zapsán Run klíč ElzaMost' }

# 5) PATH uživatele pro claude
$h = Join-Path $env:USERPROFILE '.local\bin'; $p = [Environment]::GetEnvironmentVariable('Path','User')
if (-not (($p -split ';') -contains $h)) { [Environment]::SetEnvironmentVariable('Path',(($p+';'+$h).Trim(';')),'User'); $Zmeny += 'PATH doplněn' }

# 6) běžící instance: ukončit jen podle PID souboru a jen když jde opravdu o elza-most.ps1
function BeziMost(){
  if (-not (Test-Path $PidSoubor)) { return $null }
  $id = 0; if (-not [int]::TryParse((Get-Content $PidSoubor -Raw).Trim(), [ref]$id)) { return $null }
  $pr = Get-CimInstance Win32_Process -Filter "ProcessId=$id" -ErrorAction SilentlyContinue
  if ($pr -and $pr.Name -eq 'powershell.exe' -and $pr.CommandLine -like ('*' + $Ps + '*')) { return $id }
  return $null
}
# migrace: stará verze nepsala PID soubor. Port drží http.sys (PID 4), proto hledáme powershell.exe
# s přesnou cestou k instalovanému skriptu (ne obecný filtr) a ukončíme jen ty.
function StaryMost(){
  $cesta = $Ps.ToLower()
  @(Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.ProcessId -ne $PID -and $_.CommandLine -and $_.CommandLine.ToLower().Contains($cesta) } |
    ForEach-Object { [int]$_.ProcessId })
}
$id = BeziMost
if (-not $id) { $st = @(StaryMost); if ($st.Count) { Stop-Process -Id $st; Start-Sleep 2; $Zmeny += ('ukončena stará verze mostu (PID ' + ($st -join ', ') + ')') } }
if ($id -and $zmenaSkriptu) { Stop-Process -Id $id; Start-Sleep 1; $id = $null; $Zmeny += 'ukončena stará instance' }
if (-not $id) {
  Start-Process powershell.exe -WindowStyle Hidden -ArgumentList @('-NoProfile','-ExecutionPolicy','RemoteSigned','-WindowStyle','Hidden','-File',('"' + $Ps + '"'))
  $Zmeny += 'most spuštěn'
}

if ($Zmeny.Count) { Zapis ($Zmeny -join '; '); $Zmeny | ForEach-Object { Write-Host " - $_" } } else { Write-Host 'Vše aktuální, žádná změna.' }

# 7) funkční HTTP, ne samotný otevřený port
$ok = $false
$kod = (Get-Content $TokenSoubor -Raw).Trim()
for ($i = 0; $i -lt 10 -and -not $ok; $i++) {
  try {
    $odp = Invoke-RestMethod -TimeoutSec 2 -Uri 'http://127.0.0.1:47321/stav' -Headers @{'x-elza-kod'=$kod; Origin='https://tomaskrejh.github.io'}
    $ok = $odp.most -eq 3
  } catch { Start-Sleep -Milliseconds 500 }
}
if ($ok) { Write-Host 'OVERENO: most 3 odpovida na 127.0.0.1:47321.' -ForegroundColor Green }
else { Write-Host "CHYBA: most 3 neodpovida. Log: $Log" -ForegroundColor Red; exit 1 }
try { Set-Clipboard $kod; Write-Host 'Token je ve schránce: v aplikaci AI nastavení → Lokální most ho vložte (Ctrl+V).' } catch { Write-Host "Token je v souboru $TokenSoubor" }
