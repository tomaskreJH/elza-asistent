# Žádost pro správce: aplikace Claude na PC a NB (Ing. Tomáš Krejčí)

**Co chci:** nainstalovat oficiální aplikaci Claude (Anthropic) na svá firemní PC a NB. Používám ji na stávajícím předplatném Claude, nic se nedokupuje.

**Na co:** vývoj a správa firemního ELZA asistenta (GitHub, SharePoint ELZY), práce s dokumenty a poštou v jednom okně místo prohlížeče. Aplikace pracuje jen se složkami, které jí výslovně povolím, a každou akci ven (odeslání, nasazení) schvaluji.

**Jaká práva:** jen běžná uživatelská. Nežádám správce počítače ani neomezená práva.

| Položka | Potřeba | Poznámka |
|---|---|---|
| Instalace Claude Desktop pro aktuálního uživatele | ano | Instalátor ze stránky claude.ai/download jde nainstalovat i bez práv správce. |
| Odchozí HTTPS na `*.claude.ai`, `*.anthropic.com`, `*.claude.com` | ano | Přihlášení a samotná práce. |
| Automatické aktualizace aplikace | ano | Bezpečnostní opravy. Lze vypnout politikou `disableAutoUpdates` a nasazovat MSIX vlastním plánem. |
| Funkce Windows „Virtual Machine Platform“ + instalace MSIX pro celé zařízení | volitelně | Jen pro práci se soubory přímo v počítači (Cowork). Jednorázový krok správce; bez něj aplikace funguje, jen bez této části. |
| Microsoft 365, Graph, SharePoint | nic nového | ELZA asistent dál běží pod mým účtem a jeho právy. |

**Bezpečnost:** data ELZY zůstávají v M365; aplikace nečte nic mimo povolené složky; hesla nikam nezadává; přihlášení dělám vždy já. Nasazení pro více PC je možné centrálně (Intune/SCCM, balíček MSIX).

Zdroj: support.claude.com, článek „Deploy Claude Desktop for Windows“.
