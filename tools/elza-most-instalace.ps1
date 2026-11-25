# ELZA most – instalace pro uživatele, bez správce (volá ji elza-most-instalace.cmd)
# Jediný autostart: HKCU Run "ElzaMost" -> powershell -WindowStyle Hidden -File (bez skriptovacích obálek).
# Idempotentní: nic nepřepisuje, pokud je vše aktuální. Defender se nenastavuje.
$ErrorActionPreference = 'Stop'
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
Unblock-File $Ps -ErrorAction SilentlyContinue

# 3) token (32 bajtů, CSPRNG), soubor jen pro aktuálního uživatele
if (-not (Test-Path $TokenSoubor)) {
  $b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
  [Convert]::ToBase64String($b).TrimEnd('=').Replace('+','-').Replace('/','_') | Set-Content -Encoding ascii -NoNewline $TokenSoubor
  & icacls $TokenSoubor /inheritance:r /grant:r "$($env:USERDOMAIN)\$($env:USERNAME):(R,W)" | Out-Null
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
$id = BeziMost
if ($id -and $zmenaSkriptu) { Stop-Process -Id $id; Start-Sleep 1; $id = $null; $Zmeny += 'ukončena stará instance' }
if (-not $id) {
  Start-Process powershell.exe -WindowStyle Hidden -ArgumentList @('-NoProfile','-ExecutionPolicy','RemoteSigned','-WindowStyle','Hidden','-File',('"' + $Ps + '"'))
  $Zmeny += 'most spuštěn'
}

if ($Zmeny.Count) { Zapis ($Zmeny -join '; '); $Zmeny | ForEach-Object { Write-Host " - $_" } } else { Write-Host 'Vše aktuální, žádná změna.' }

# 7) ověření
$ok = $false
for ($i = 0; $i -lt 10 -and -not $ok; $i++) { Start-Sleep 1; try { (New-Object Net.Sockets.TcpClient('127.0.0.1',47321)).Close(); $ok = $true } catch {} }
if ($ok) { Write-Host 'OVERENO: most bezi na 127.0.0.1:47321.' -ForegroundColor Green }
else { Write-Host "CHYBA: most nebezi. Log: $Log" -ForegroundColor Red; if (Test-Path $Log) { Get-Content $Log -Tail 10 } }
try { Get-Content $TokenSoubor -Raw | Set-Clipboard; Write-Host 'Token je ve schránce: v aplikaci AI nastavení → Lokální most ho vložte (Ctrl+V).' } catch { Write-Host "Token je v souboru $TokenSoubor" }
