# Tok T12 Termíny kontrol: postup založení v Power Automate (krok za krokem)
Vlastník: Tomáš. Nic se nesmí poslat zákazníkovi; jen interní adresy.
1. Power Automate → Vytvořit → Naplánovaný cloudový tok, název „T12 Termíny kontrol“, opakování každý den 7:30 (pracovní dny).
2. Akce SharePoint „Získat položky“: web Zakázky ELZA, seznam Kontrola, filtr: PristiTermin le addDays(utcNow(),30).
3. Pro každou položku podmínka: počet dní do termínu je 30 nebo 7, nebo termín je po dnešku (po termínu).
4. Akce Outlook „Odeslat e-mail (V2)“ jen odpovědnému (pole Odpovedny) a na vlastní testovací adresu při zkoušce; předmět „Kontrola za X dní: název“.
5. Po termínu navíc e-mail vedoucímu (Tomáš).
6. Zkouška: spustit ručně, ověřit v Poště odeslané; teprve potom ponechat zapnuto.
Zákazníkovi se neposílá nic, dokud to Tomáš výslovně nezapne.

## Stav 2026-11-23 (0.55.1)
Tok založen a zapnut: Recurrence 7:30 (denně) → SharePoint Získat položky (PortalELZA2, Kontroly, filtr PristiTermin le dnes+30 dní) → Poslat e-mail (V2) jen tkrejci@elzy.cz. Zkušební běh prošel. Seznam Kontroly nemá sloupec Odpovedny; před rozesíláním je třeba sloupec přidat (seznamy.js) a výslovné ano. Dosud bez podmínky na 30/7 dní a bez smyčky po položkách (e-mail jde i při prázdném výsledku).
