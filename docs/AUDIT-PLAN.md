# Audit vazeb, duplicit a aktuálnosti (plán, 0.71.0)
Cíl: méně oprav, víc posunu. Audit jede automaticky a levně, nic nemění a běží před každým nasazením.
1. **Automaticky (hotovo):** `node tools/audit.js` kontroluje menu ↔ moduly ↔ Návod ↔ boot ↔ stable a duplicitní položky menu. Stav 0.71.0: bez nálezů.
2. **Samostatné vlákno (jednou):** projít Návod (GUIDE v centrum.js) a AI nápovědu proti skutečným funkcím; najít duplicity funkcí (Případy × Analýza vstupu × Proces nabídky × Hlídání nabídek se překrývají v nabídkách); sloučit tam, kde dělají totéž.
3. **Vazby dat:** případ → zakázka → složky → fáze → Gantt → portál; ověřit klíče (WorkId, kód zakázky, OBJ, PR) a že každý seznam z seznamy.js má čtenáře i zapisovatele.
4. **Aktuálnost:** texty Návodu a Průvodce vs. verze; zastaralé body v docs/DALSI-KROKY.md (body 00–000 jsou staré) smazat.
5. Výstup: docs/KONTROLA-RRRR-MM-DD.md; opravy jen kritické, ostatní do backlogu, ať nestojí tokeny.

## Stav 0.72.0
Bod 1 hotov a běží, body 2–5 provedeny jednou (docs/KONTROLA-2026-11-24.md); sloučení nabídkových modulů čeká na ostrá data.
