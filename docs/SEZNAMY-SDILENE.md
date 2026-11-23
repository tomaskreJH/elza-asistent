# Seznamy sdíleného ukládání (web Zakázky ELZA, verze 0.50.0)
Zakládá je tlačítko v příslušném modulu po klepnutí vlastníka. Názvy bez diakritiky, (I) = indexováno. Nic se nemaže.
- **PostupVerze** (Analýza vstupu): Title (postup@vN) (I), Postup (I), Verze, Data (JSON celého postupu včetně historie), Stav, Schvalil.
- **PostupZaznam**: Title (postup:krok), Postup (I), Verze, Krok, Akce (ok, upraveno, vynechano, pridano), Text, Kdo, Kdy, Stav (nove, zpracovano).
- **NabidkaEvid** (Hlídání nabídek): Title (číslo nabídky) (I), Zakazka (I), Zakaznik, Odeslano (RRRR-MM-DD), Odpoved, Stav (I; odeslana, odpoved, bez_odpovedi), Odpovedny (I; e-mail), Pripomenuto (0, 5, 14, 30), Poznamka.
Složky zakázky nezakládají seznam, jen složky v knihovně (výchozí Shared Documents/Zakazky na webu Zakázky ELZA; cestu lze změnit v modulu).
