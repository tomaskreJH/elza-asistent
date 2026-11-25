@echo off
rem ELZA most - rucni spusteni s viditelnou chybou
powershell -NoExit -NoProfile -ExecutionPolicy RemoteSigned -File "%~dp0elza-most.ps1"
pause
