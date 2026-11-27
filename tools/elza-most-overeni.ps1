# ELZA most – ověření po instalaci (spouští elza-most-overeni.cmd). Nic nemění, jen čte a zapisuje výsledek.
# Výsledek: %LOCALAPPDATA%\ElzaMost\overeni.txt a vedle tohoto skriptu overeni.txt
$ErrorActionPreference = 'Continue'
$D = Join-Path $env:LOCALAPPDATA 'ElzaMost'
$U = 'http://127.0.0.1:47321'
$O = @{Origin = 'https://tomaskrejh.github.io'}
$out = @("ELZA most - overeni $(Get-Date -Format s) na $env:COMPUTERNAME (PowerShell $($PSVersionTable.PSVersion))")
function Krok($n, $ok, $t) { $script:out += ('{0} {1}: {2}' -f $(if ($ok) { 'OK  ' } else { 'CHYBA' }), $n, $t) }
function Kod($h) { try { $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 3 -Uri ($U + $h.c) -Headers $h.h; return @($r.StatusCode, $r.Content) } catch { $s = 0; try { $s = [int]$_.Exception.Response.StatusCode } catch {}; return @($s, $_.Exception.Message) } }
# 1) soubory a BOM
foreach ($f in 'elza-most.ps1','token') { Krok "soubor $f" (Test-Path (Join-Path $D $f)) (Join-Path $D $f) }
$b = [IO.File]::ReadAllBytes((Join-Path $D 'elza-most.ps1'))[0..5] -join ','
Krok 'BOM' ($b -like '239,187,191,*' -and $b -notlike '239,187,191,239,187,191*') $b
# 2) autostart: jediný Run klíč, žádné VBS ve Startup
$run = (Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run' -ErrorAction SilentlyContinue).ElzaMost
Krok 'Run klic' ([bool]$run) $run
$st = @(Get-ChildItem ([Environment]::GetFolderPath('Startup')) -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '(?i)elza-?most|spustit-most' })
Krok 'Startup bez ElzaMost' ($st.Count -eq 0) ($st.Name -join ', ')
# 3) proces: právě jeden, skrytý (bez viditelného okna), žádný jiný autostart
$pr = @(Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" | Where-Object { $_.CommandLine -like '*ElzaMost\elza-most.ps1*' })
Krok 'proces mostu' ($pr.Count -eq 1) ("pocet " + $pr.Count)
$jiny = @(Get-CimInstance Win32_Process -Filter "Name='powershell.exe' OR Name='cmd.exe'" | Where-Object { $_.CommandLine -and ($_.CommandLine -match '(?i)elza-most\.ps1|spustit-most') -and $_.CommandLine -notlike '*ElzaMost\elza-most.ps1*' })
Krok 'zadny jiny most (jina cesta)' ($jiny.Count -eq 0) ('pocet ' + $jiny.Count)
$vid = @($pr | Where-Object { $p = Get-Process -Id $_.ProcessId -ErrorAction SilentlyContinue; $p -and $p.MainWindowHandle -ne 0 })
Krok 'bez viditelneho okna' ($vid.Count -eq 0) ('viditelnych oken: ' + $vid.Count)
$jineRun = @((Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run','HKCU:\Software\Microsoft\Windows\CurrentVersion\RunOnce' -ErrorAction SilentlyContinue).PSObject.Properties | Where-Object { $_.Name -notlike 'PS*' -and $_.Name -ne 'ElzaMost' -and ([string]$_.Value) -match '(?i)elza-?most|spustit-most' })
Krok 'zadny dalsi Run autostart' ($jineRun.Count -eq 0) (($jineRun | ForEach-Object { $_.Name }) -join ', ')
$ul = @(try { Get-ScheduledTask -ErrorAction Stop | Where-Object { $_.TaskName -match '(?i)elza-?most' } } catch { @() })
Krok 'zadna naplanovana uloha mostu' ($ul.Count -eq 0) (($ul | ForEach-Object { $_.TaskName }) -join ', ')
# 4) HTTP: bez tokenu 401, s tokenem 200, limity
$tok = (Get-Content (Join-Path $D 'token') -Raw).Trim()
$r = Kod @{c='/stav'; h=$O}; Krok 'bez tokenu = 401' ($r[0] -eq 401) $r[0]
$h = $O.Clone(); $h['x-elza-kod'] = $tok
$r = Kod @{c='/stav'; h=$h}
$stav = $null
if ($r[0] -eq 200) { try { $stav = $r[1] | ConvertFrom-Json } catch {} }
Krok 'stav s tokenem = 200, most 4' ($r[0] -eq 200 -and $stav.most -eq 4) ('HTTP ' + $r[0] + ', verze ' + $stav.most)
if ($stav) {
  $out += ('INFO Claude CLI: ' + $(if ($stav.claude) { $stav.claude } else { 'nenalezen' }))
  $out += ('INFO Codex CLI: ' + $(if ($stav.codex) { $stav.codex } else { 'nenalezen' }))
}
$cizi = @{Origin='https://example.com'; 'x-elza-kod'=$tok}
$r = Kod @{c='/stav'; h=$cizi}; Krok 'cizi stranka = 403' ($r[0] -eq 403) $r[0]
# 5) Defender: pouze místní události vztahující se k mostu, včetně pravidel ASR
$filtr = @{LogName='Microsoft-Windows-Windows Defender/Operational'; Id=1116,1117,1006,1015,1121,1122; StartTime=(Get-Date).AddDays(-1)}
try {
  $ev = @(Get-WinEvent -FilterHashtable $filtr -ErrorAction Stop | Where-Object { $_.Message -match '(?i)\bELZA[- ]?most\b' })
  Krok 'mistni Defender 24 h' ($ev.Count -eq 0) ('udalosti mostu: ' + $ev.Count)
} catch {
  if ($_.FullyQualifiedErrorId -like 'NoMatchingEventsFound*') { Krok 'mistni Defender 24 h' $true 'zadne odpovidajici udalosti' }
  else { $out += 'NEOVERENO mistni Defender 24 h: protokol nelze precist' }
}
$out += 'INFO overeni pokryva mistni protokol Windows, zaznamy tenantu necte.'
$txt = $out -join "`r`n"
$txt | Set-Content -Encoding UTF8 (Join-Path $D 'overeni.txt')
try { $txt | Set-Content -Encoding UTF8 (Join-Path $PSScriptRoot 'overeni.txt') } catch {}
$txt
