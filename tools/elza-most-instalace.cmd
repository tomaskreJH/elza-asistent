@echo off
rem ELZA most – instalace pro uživatele, bez správce. Dvojklik.
rem 1) nainstaluje Claude CLI (oficiální instalátor Anthropicu, jen pro tohoto uživatele)
rem 2) zkopíruje most do %LOCALAPPDATA%\ElzaMost a zapne ho po přihlášení do Windows
setlocal
set D=%LOCALAPPDATA%\ElzaMost
mkdir "%D%" 2>nul
copy /y "%~dp0elza-most.ps1" "%D%\elza-most.ps1" >nul
copy /y "%~dp0elza-most-skryty.vbs" "%D%\elza-most-skryty.vbs" >nul
if not exist "%USERPROFILE%\.local\bin\claude.exe" where claude >nul 2>nul || powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://claude.ai/install.ps1 | iex"
rem 1b) prida %USERPROFILE%\.local\bin do PATH uzivatele (bez spravce), aby prikaz claude fungoval i po restartu
powershell -NoProfile -Command "$h=$env:USERPROFILE+'\.local\bin'; $p=[Environment]::GetEnvironmentVariable('Path','User'); if (-not (($p -split ';') -contains $h)) { [Environment]::SetEnvironmentVariable('Path',(($p+';'+$h).Trim(';')),'User') }"
del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\ElzaMost.cmd" 2>nul
copy /y "%D%\elza-most-skryty.vbs" "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\ElzaMost.vbs" >nul
echo.
echo Hotovo. Ted se jednou prihlaste do Claude predplatnym: otevre se okno, napiste /login a potvrdte v prohlizeci, pak /exit.
echo V okne vyberte Yes, I trust this folder, napiste /login, potvrdte v prohlizeci a pak /exit.
start "Claude prihlaseni" /d "%USERPROFILE%" cmd /k ""%USERPROFILE%\.local\bin\claude.exe""
wscript "%D%\elza-most-skryty.vbs"
echo Parovaci kod je v souboru %D%\parovaci-kod.txt (v aplikaci ho vlozte jednou; most bezi skryte, bez okna).
pause
