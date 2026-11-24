# Noční běhy přes ElzaMost (0.69.0)
Cíl: využít předplatné Claude a výkon PC i v době, kdy je nepotřebujete, bez ručního kopírování.

Tok: Noční běhy (aplikace) → řádek v seznamu NocniFronta (SharePoint, Stanice = název počítače nebo *) → pumpa na stanici (při otevření aplikace a každých 10 min) předá úlohu mostu (POST /fronta) → most ji v nočním okně (výchozí 22 až 6 h) spustí přes Claude CLI nebo Ollamu → výsledek se při další pumpě uloží do řádku (stav hotovo) → vy ho ráno přijmete nebo zahodíte (Čeká na vás).

Stanice: každý počítač s mostem (PC, NB, odložená stanice) bere jen úlohy pro svůj název nebo pro „první dostupnou“. Fronta v mostu přežije restart (fronta.json), běží i při zavřené aplikaci; výsledky se do SharePointu zapíšou, až se aplikace na stanici otevře.
Bezpečnost: stejná jako u mostu (jen 127.0.0.1, párovací kód); Claude bez nástrojů, jen text; zadání prochází ochranou vložených pokynů; výsledek nic neodešle, schvaluje ho člověk.
Pořadí využití: úlohy s Ollamou nespotřebují limit Claude; při 80 % limitu Claude se běžná volání přepnou na Haiku, při 95 % na Ollamu.
Omezení: jedna úloha najednou na stanici; dlouhá úloha blokuje odpovědi mostu aplikaci (v noci vadit nemá); obrázky přes ComfyUI zatím ne.
