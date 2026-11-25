@echo off
rem ELZA most - instalace pro uzivatele, bez spravce. Dvojklik.
rem 1) nainstaluje Claude CLI (oficialni instalator Anthropicu), pokud chybi
rem 2) vse ostatni dela elza-most-instalace.ps1 (jediny autostart Run klic, bez VBS, idempotentne)
setlocal
if not exist "%USERPROFILE%\.local\bin\claude.exe" where claude >nul 2>nul || (
  powershell -NoProfile -ExecutionPolicy RemoteSigned -Command "irm https://claude.ai/install.ps1 | iex"
  echo Prihlaste se do Claude: v okne napiste /login, potvrdte v prohlizeci a pak /exit.
  start "Claude prihlaseni" /d "%USERPROFILE%" cmd /k ""%USERPROFILE%\.local\bin\claude.exe""
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0elza-most-instalace.ps1"
pause
