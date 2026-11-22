# Postup vývoje ELZA asistenta (stálá pravidla, platí pro každé vlákno)
1. Každý běh začíná načtením docs/STAV.md, DALSI-KROKY.md a paměti projektu; bez ptaní, samostatně, bez přerušení.
2. Na konci KAŽDÉHO běhu je vše aktuální: kód, verze (index.html VER, ?v=), docs/CHANGELOG.md, STAV.md, DALSI-KROKY.md, kapitoly Návodu a AI nápovědy v centrum.js (GUIDE) i procesy a roadmapa. Funkce bez aktualizovaného návodu není hotová.
3. Každá nová funkce je hned zapnutá (pro vlastníka a vývoj se nic neskrývá; hide() pro roli vlastnik vždy false). Pro ostatní role se zapíná v Správě až při uvedení do provozu.
4. Nasazuje se rovnou (commit do main, root i stable), bez ptaní.
5. Šetřit limity a tokeny: číst jen potřebné části, nevypisovat celé soubory, nespouštět zbytečné agenty.
6. Nové kroky vždy v novém vlákně. Na konci vlákna: uložit, uzavřít, dát krátký prompt dalšího vlákna (docs/NOVE-VLAKNO-PROMPT.md) a aktualizovat ho.
7. Nic placeného navíc, nic se neodešle bez výslovného ano, osobní věci do firemní aplikace nepatří.
