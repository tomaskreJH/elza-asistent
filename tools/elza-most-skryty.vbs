' ELZA most - spusteni bez viditelneho okna (pouziva se pri startu Windows)
Set sh = CreateObject("WScript.Shell")
d = sh.ExpandEnvironmentStrings("%LOCALAPPDATA%") & "\ElzaMost\elza-most.ps1"
sh.Run "powershell -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File """ & d & """", 0, False
