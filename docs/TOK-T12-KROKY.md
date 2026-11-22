# Tok T12 Termíny kontrol: postup založení v Power Automate (krok za krokem)
Vlastník: Tomáš. Nic se nesmí poslat zákazníkovi; jen interní adresy.
1. Power Automate → Vytvořit → Naplánovaný cloudový tok, název „T12 Termíny kontrol“, opakování každý den 7:30 (pracovní dny).
2. Akce SharePoint „Získat položky“: web Zakázky ELZA, seznam Kontrola, filtr: PristiTermin le addDays(utcNow(),30).
3. Pro každou položku podmínka: počet dní do termínu je 30 nebo 7, nebo termín je po dnešku (po termínu).
4. Akce Outlook „Odeslat e-mail (V2)“ jen odpovědnému (pole Odpovedny) a na vlastní testovací adresu při zkoušce; předmět „Kontrola za X dní: název“.
5. Po termínu navíc e-mail vedoucímu (Tomáš).
6. Zkouška: spustit ručně, ověřit v Poště odeslané; teprve potom ponechat zapnuto.
Zákazníkovi se neposílá nic, dokud to Tomáš výslovně nezapne.
