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

# 1) migrace a úklid: zůstává JEDINÝ autostart (Run klíč ElzaMost). Odstraní se jen to, co zjevně patří mostu:
#    soubory ve složce Po spuštění (ElzaMost*, elza-most*, spustit-most*), jiné hodnoty Run/RunOnce odkazující na elza-most a naplánované úlohy s názvem nebo akcí mostu.
#    Důvod (0.88.1): starý autostart se spuštěním ve viditelném okně (např. spustit-most.cmd) držel port a po zavření okna přestala být dostupná AI.
$vzor = '(?i)elza-?most|spustit-most'
$start = [Environment]::GetFolderPath('Startup')
foreach ($f in @(Get-ChildItem -LiteralPath $start -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -match $vzor })) {
  Remove-Item -Force -LiteralPath $f.FullName; $Zmeny += "odstraněn autostart $($f.FullName)"
}
$f2 = Join-Path $D 'elza-most-skryty.vbs'; if (Test-Path $f2) { Remove-Item -Force $f2; $Zmeny += "smazáno $f2" }
foreach ($rk in @('HKCU:\Software\Microsoft\Windows\CurrentVersion\Run', 'HKCU:\Software\Microsoft\Windows\CurrentVersion\RunOnce')) {
  $pp = Get-ItemProperty -Path $rk -ErrorAction SilentlyContinue
  if ($pp) { foreach ($n in @($pp.PSObject.Properties | Where-Object { $_.Name -notlike 'PS*' -and -not ($_.Name -eq 'ElzaMost' -and $rk -eq $RunKlic) -and ([string]$_.Value) -match $vzor })) {
    Remove-ItemProperty -Path $rk -Name $n.Name -ErrorAction SilentlyContinue; $Zmeny += "odstraněn autostart $rk\$($n.Name)" } }
}
try {
  foreach ($t in @(Get-ScheduledTask -ErrorAction Stop | Where-Object { $_.TaskName -match $vzor -or (($_.Actions | ForEach-Object { $_.Execute + ' ' + $_.Arguments }) -join ' ') -match $vzor })) {
    Unregister-ScheduledTask -TaskName $t.TaskName -TaskPath $t.TaskPath -Confirm:$false -ErrorAction Stop; $Zmeny += "odstraněna naplánovaná úloha $($t.TaskName)"
  }
} catch { Zapis ('úklid naplánovaných úloh nešel: ' + $_.Exception.Message) }

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

# 6) běžící instance. Most může běžet i odjinud (spustit-most.cmd ze sdílené složky, starý autostart) a ve viditelném okně; takový se ukončí a spustí se jediný skrytý.
#    Ukončují se jen procesy powershell.exe se skriptem elza-most.ps1 a okna cmd.exe se spustit-most.cmd; instalátor (elza-most-instalace.ps1) se nikdy netýká.
function BeziMost(){
  if (-not (Test-Path $PidSoubor)) { return $null }
  $id = 0; if (-not [int]::TryParse((Get-Content $PidSoubor -Raw).Trim(), [ref]$id)) { return $null }
  $pr = Get-CimInstance Win32_Process -Filter "ProcessId=$id" -ErrorAction SilentlyContinue
  if ($pr -and $pr.Name -eq 'powershell.exe' -and $pr.CommandLine -like ('*' + $Ps + '*')) { return $id }
  return $null
}
function VsechnyMosty(){
  @(Get-CimInstance Win32_Process -Filter "Name='powershell.exe' OR Name='cmd.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.ProcessId -ne $PID -and $_.CommandLine -and (($_.Name -eq 'powershell.exe' -and $_.CommandLine -match '(?i)elza-most\.ps1') -or ($_.Name -eq 'cmd.exe' -and $_.CommandLine -match '(?i)spustit-most')) })
}
function Viditelny($procId){ $q = Get-Process -Id $procId -ErrorAction SilentlyContinue; return ($q -and $q.MainWindowHandle -ne 0) }
$id = BeziMost
$vse = @(VsechnyMosty)
$cizi = @($vse | Where-Object { $_.ProcessId -ne $id })
$vid = ($id -and (Viditelny $id)) -or (@($vse | Where-Object { $_.Name -eq 'powershell.exe' -and (Viditelny $_.ProcessId) }).Count -gt 0)
if ($cizi.Count -or $vid -or ($id -and $zmenaSkriptu)) {
  $ukonceno = @($vse | ForEach-Object { [int]$_.ProcessId })
  if ($ukonceno.Count) { Stop-Process -Id $ukonceno -Force -ErrorAction SilentlyContinue; Start-Sleep 2 }
  $Zmeny += ('ukončen most nebo jeho okno (PID ' + ($ukonceno -join ', ') + ')' + $(if ($vid) { ', běžel ve viditelném okně' } else { '' }))
  $id = $null
}
if (-not $id) {
  Start-Process powershell.exe -WindowStyle Hidden -ArgumentList @('-NoProfile','-ExecutionPolicy','RemoteSigned','-WindowStyle','Hidden','-File',('"' + $Ps + '"'))
  $Zmeny += 'most spuštěn skrytě'
}

if ($Zmeny.Count) { Zapis ($Zmeny -join '; '); $Zmeny | ForEach-Object { Write-Host " - $_" } } else { Write-Host 'Vše aktuální, žádná změna.' }

# 7) funkční HTTP, ne samotný otevřený port
$ok = $false
$kod = (Get-Content $TokenSoubor -Raw).Trim()
for ($i = 0; $i -lt 10 -and -not $ok; $i++) {
  try {
    $odp = Invoke-RestMethod -TimeoutSec 2 -Uri 'http://127.0.0.1:47321/stav' -Headers @{'x-elza-kod'=$kod; Origin='https://tomaskrejh.github.io'}
    $ok = $odp.most -eq 4
  } catch { Start-Sleep -Milliseconds 500 }
}
if ($ok) { Write-Host 'OVERENO: most 4 odpovida na 127.0.0.1:47321.' -ForegroundColor Green
  $nov = BeziMost; if ($nov -and (Viditelny $nov)) { Write-Host 'POZOR: most bezi ve viditelnem okne (Windows ignoruje skryti). Okno nezavirejte, nebo ho minimalizujte; hlaste nazev terminalu.' -ForegroundColor Yellow; Zapis 'most má viditelné okno i po skrytém spuštění' } }
else { Write-Host "CHYBA: most 4 neodpovida. Log: $Log" -ForegroundColor Red; exit 1 }
try { Set-Clipboard $kod; Write-Host 'Token je ve schránce: v aplikaci AI nastavení → Lokální most ho vložte (Ctrl+V).' } catch { Write-Host "Token je v souboru $TokenSoubor" }
