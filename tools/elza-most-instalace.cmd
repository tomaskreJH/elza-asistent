@echo off
rem ELZA most - instalace pro uzivatele, bez spravce. Dvojklik.
rem Bezpecnost (0.73.9): zadne stahovani a spousteni skriptu z internetu (irm|iex), nic se nespousti primo
rem z OneDrive/sdilene slozky: skripty se nejdriv zkopiruji do %LOCALAPPDATA%\ElzaMost\instalace a spusti odtud.
setlocal
set "CIL=%LOCALAPPDATA%\ElzaMost\instalace"
if not exist "%CIL%" mkdir "%CIL%"
copy /y "%~dp0elza-most-instalace.ps1" "%CIL%\" >nul || (echo CHYBA: kopie instalatoru selhala & pause & exit /b 1)
copy /y "%~dp0elza-most.ps1" "%CIL%\" >nul || (echo CHYBA: kopie mostu selhala & pause & exit /b 1)
if not exist "%USERPROFILE%\.local\bin\claude.exe" where claude >nul 2>nul || (
  echo Claude CLI neni nainstalovan. Nainstalujte ho podle oficialniho navodu Anthropicu:
  echo https://docs.claude.com/en/docs/claude-code/setup
  echo Pak v okne Claude napiste /login a znovu spustte tento soubor.
)
powershell -NoProfile -ExecutionPolicy RemoteSigned -File "%CIL%\elza-most-instalace.ps1"
set "VYSLEDEK=%ERRORLEVEL%"
pause
exit /b %VYSLEDEK%
