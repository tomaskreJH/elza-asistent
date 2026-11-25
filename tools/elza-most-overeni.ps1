# ELZA most – ověření po instalaci (spouští elza-most-overeni.cmd). Nic nemění, jen čte a zapisuje výsledek.
# Výsledek: %LOCALAPPDATA%\ElzaMost\overeni.txt a vedle tohoto skriptu overeni.txt
$ErrorActionPreference = 'Continue'
$D = Join-Path $env:LOCALAPPDATA 'ElzaMost'
$U = 'http://127.0.0.1:47321'
$O = @{Origin = 'https://tomaskrejh.github.io'}
$out = @("ELZA most - overeni $(Get-Date -Format s) na $env:COMPUTERNAME (PowerShell $($PSVersionTable.PSVersion))")
function Krok($n, $ok, $t) { $script:out += ('{0} {1}: {2}' -f $(if ($ok) { 'OK  ' } else { 'CHYBA' }), $n, $t) }
function Kod($h) { try { $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 20 -Uri ($U + $h.c) -Headers $h.h; return @($r.StatusCode, $r.Content) } catch { $s = 0; try { $s = [int]$_.Exception.Response.StatusCode } catch {}; return @($s, $_.Exception.Message) } }
# 1) soubory a BOM
foreach ($f in 'elza-most.ps1','token') { Krok "soubor $f" (Test-Path (Join-Path $D $f)) (Join-Path $D $f) }
$b = [IO.File]::ReadAllBytes((Join-Path $D 'elza-most.ps1'))[0..5] -join ','
Krok 'BOM' ($b -like '239,187,191,*' -and $b -notlike '239,187,191,239,187,191*') $b
# 2) autostart: jediný Run klíč, žádné VBS ve Startup
$run = (Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run' -ErrorAction SilentlyContinue).ElzaMost
Krok 'Run klic' ([bool]$run) $run
$st = @(Get-ChildItem ([Environment]::GetFolderPath('Startup')) -Filter 'ElzaMost*' -ErrorAction SilentlyContinue)
Krok 'Startup bez ElzaMost' ($st.Count -eq 0) ($st.Name -join ', ')
# 3) proces
$pr = @(Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" | Where-Object { $_.CommandLine -like '*ElzaMost\elza-most.ps1*' })
Krok 'proces mostu' ($pr.Count -eq 1) ("pocet " + $pr.Count)
# 4) HTTP: bez tokenu 401, s tokenem 200, limity
$tok = (Get-Content (Join-Path $D 'token') -Raw).Trim()
$r = Kod @{c='/stav'; h=$O}; Krok 'bez tokenu = 401' ($r[0] -eq 401) $r[0]
$h = $O.Clone(); $h['x-elza-kod'] = $tok
$r = Kod @{c='/stav'; h=$h}; Krok 'stav s tokenem = 200' ($r[0] -eq 200) ([string]$r[1]).Substring(0,[Math]::Min(200,([string]$r[1]).Length))
$r = Kod @{c='/limity'; h=$h}; for ($i = 0; $i -lt 3 -and -not ([string]$r[1] -match '"ok":true'); $i++) { Start-Sleep 30; $r = Kod @{c='/limity'; h=$h} }; Krok 'limity' ($r[0] -eq 200 -and [string]$r[1] -match '"ok":true') ([string]$r[1]).Substring(0,[Math]::Min(250,([string]$r[1]).Length))
$cizi = @{Origin='https://example.com'; 'x-elza-kod'=$tok}
$r = Kod @{c='/stav'; h=$cizi}; Krok 'cizi stranka = 403' ($r[0] -eq 403) $r[0]
# 5) Defender: detekce za posledních 24 h (čtení, nic se nemění)
try {
  $det = @(Get-MpThreatDetection -ErrorAction Stop | Where-Object { $_.InitialDetectionTime -gt (Get-Date).AddDays(-1) })
  Krok 'Defender detekce 24 h' ($det.Count -eq 0) (($det | ForEach-Object { "$($_.ThreatID) $($_.Resources -join ' ')" }) -join ' | ')
} catch { Krok 'Defender detekce 24 h' $true ('nelze cist (' + $_.Exception.Message + '), zkontrolujte Historii ochrany') }
try { $ev = @(Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Windows Defender/Operational'; Id=1116,1117,1006,1015; StartTime=(Get-Date).AddDays(-1)} -ErrorAction Stop); Krok 'Defender udalosti 24 h' ($ev.Count -eq 0) (($ev | Select-Object -First 3 | ForEach-Object { $_.Message.Split("`n")[0..3] -join ' ' }) -join ' | ') } catch { Krok 'Defender udalosti 24 h' $true 'zadne' }
$txt = $out -join "`r`n"
$txt | Set-Content -Encoding UTF8 (Join-Path $D 'overeni.txt')
try { $txt | Set-Content -Encoding UTF8 (Join-Path $PSScriptRoot 'overeni.txt') } catch {}
$txt
