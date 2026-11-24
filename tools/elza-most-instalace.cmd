@echo off
rem ELZA most – instalace pro uživatele, bez správce. Dvojklik.
rem 1) nainstaluje Claude CLI (oficiální instalátor Anthropicu, jen pro tohoto uživatele)
rem 2) zkopíruje most do %LOCALAPPDATA%\ElzaMost a zapne ho po přihlášení do Windows
setlocal
set D=%LOCALAPPDATA%\ElzaMost
mkdir "%D%" 2>nul
copy /y "%~dp0elza-most.ps1" "%D%\elza-most.ps1" >nul
where claude >nul 2>nul || powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://claude.ai/install.ps1 | iex"
> "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\ElzaMost.cmd" echo @start "" /min powershell -NoProfile -WindowStyle Minimized -ExecutionPolicy Bypass -File "%D%\elza-most.ps1"
echo.
echo Hotovo. Ted se jednou prihlaste do Claude predplatnym: otevre se okno, napiste /login a potvrdte v prohlizeci, pak /exit.
start "Claude prihlaseni" cmd /k "%USERPROFILE%\.local\bin\claude.exe"
start "" /min powershell -NoProfile -ExecutionPolicy Bypass -File "%D%\elza-most.ps1"
echo Parovaci kod je v souboru %D%\parovaci-kod.txt (zobrazi se i v okne mostu).
pause
