# Žádost správci M365: povolení Copilotu pro aplikaci ELZA asistent

Komu: správce Microsoft 365 ELZY. Od: Tomáš Krejčí. Cíl: aby AI v aplikaci ELZA asistent mohla volat Microsoft 365 Copilot Chat API (v ceně licence Copilot, nic placeného navíc).

## Co prosím udělat
V Entra ID (Aplikace podniku / Registrace aplikací) otevřít registraci aplikace ELZA asistent a udělit souhlas správce (Grant admin consent) pro tato delegovaná oprávnění Microsoft Graph:

1. Sites.Read.All
2. Mail.Read
3. People.Read.All
4. OnlineMeetingTranscript.Read.All
5. Chat.Read
6. ChannelMessage.Read.All
7. ExternalItem.Read.All

## Proč a jaká jsou omezení
- Všechna oprávnění jsou delegovaná: aplikace vidí jen to, co už vidí přihlášený uživatel. Žádný přístup navíc.
- Jen čtení. Aplikace přes tato oprávnění nic nezapisuje ani neodesílá.
- Uživatel musí mít licenci Microsoft 365 Copilot.
- Aplikace běží jako webová stránka s CSP, komunikuje jen s Microsoftem, SharePointem ELZY a AI službou, kterou si uživatel zvolí.

## Ověření po schválení
Tomáš v aplikaci otevře AI nastavení, u agenta zvolí nástroj Copilot a pošle testovací dotaz.
