# Logbuch-Archiv, Format Version 1

Dieses Archiv enthält Naturbeobachtungen aus der App „Logbuch“. Es ist so gebaut,
dass Menschen und Programme (auch KI-Systeme) es ohne die App lesen können.
Alles darin sind offene, gewöhnliche Dateien: ZIP, JSON, Markdown, JPEG, WebM/MP4.

## Inhalt der ZIP-Datei

| Pfad | Inhalt |
|---|---|
| `LIESMICH.md` | diese Beschreibung |
| `logbuch.json` | alle Einträge, maschinenlesbar. Diese Datei ist maßgeblich. |
| `eintraege.md` | dieselben Einträge als lesbarer Text, chronologisch. Nur zum Lesen; beim Import wird sie ignoriert. |
| `medien/<eintrag-id>/<medien-id>.<endung>` | Fotos und Tonaufnahmen als normale Dateien |

## Grundsatz: Beobachtung und Deutung getrennt

Jeder Eintrag trennt **Beobachtung** (was wahrgenommen wurde: gesehen, gehört,
gerochen, gefühlt) von **Deutung** (Bestimmung, Vermutung, Erklärung).
Wer das Archiv auswertet, sollte diese Trennung respektieren:
`beobachtung` ist Rohmaterial, `deutung` ist eine vorläufige oder spätere
Interpretation und kann falsch sein. Eine Auswertung sollte neue Deutungen
als eigene Vorschläge kennzeichnen und die vorhandenen Texte nicht umschreiben.

## logbuch.json

```json
{
  "format": "logbuch-archiv",
  "version": 1,
  "exportiert": "2026-10-17T19:54:00+02:00",
  "exportiert_von": "Mira",
  "anzahl_eintraege": 1,
  "eintraege": [
    {
      "id": "3f0c2a8e-5b1d-4c7e-9a10-2b6f1d0e7c55",
      "erstellt": "2026-10-17T16:44:10+02:00",
      "geaendert": "2026-10-17T16:51:02+02:00",
      "zeitpunkt": "2026-10-17T16:44:00+02:00",
      "zeitzone": "Europe/Berlin",
      "autor": "Mira",
      "bearbeitet_von": "Mira",
      "ort": {
        "lat": 52.516275, "lon": 13.377704,
        "genauigkeit_m": 12, "hoehe_m": 118,
        "quelle": "gps", "name": "Hinterhof"
      },
      "beobachtung": "Drei Ameisenstraßen am Fuß der Mauer, eine führt in die Ritze unter dem Fallrohr.",
      "deutung": "Vermutlich Lasius niger.",
      "tags": ["ameisen", "hof"],
      "wetter": { "text": "bedeckt, windstill", "temperatur_c": 11, "quelle": "selbst" },
      "medien": [
        { "id": "a91e…", "typ": "foto", "mime": "image/jpeg", "bytes": 482113,
          "datei": "medien/3f0c2a8e-…/a91e….jpg" }
      ]
    }
  ]
}
```

### Auszüge

Ein Archiv kann ein **Auszug** sein: ausgewählte Einträge, bei denen beim Export
bewusst Angaben entfernt wurden. Dann steht oben in `logbuch.json` zusätzlich:

```json
"auszug": { "weggelassen": ["ort", "autor", "wetter"], "hinweis": "…" }
```

Mögliche Werte in `weggelassen`: `ort` (dann ist `ort` überall `null` und `zeitzone` fehlt),
`autor` (dann fehlen `autor`, `bearbeitet_von` und `exportiert_von`), `wetter` (dann ist
`wetter` `null`), `fotos`, `ton`. Fehlende Angaben in einem Auszug bedeuten also
„absichtlich nicht weitergegeben“, nicht „unbekannt“. Fotos in Auszügen sind neu
kodierte JPEGs ohne Metadaten; Ton ist WAV (mono, 32 kHz, 16 bit) ohne Metadaten.

### Felder eines Eintrags

| Feld | Bedeutung |
|---|---|
| `id` | UUID. Bleibt über alle Geräte und Archive gleich. Schlüssel beim Zusammenführen. |
| `erstellt`, `geaendert` | ISO 8601 mit Zeitzonen-Versatz. `geaendert` entscheidet beim Zusammenführen. |
| `zeitpunkt` | Wann die Beobachtung stattfand (kann vom Anlegen abweichen). ISO 8601 mit Versatz. |
| `zeitzone` | IANA-Name der Zeitzone des Geräts, z. B. `Europe/Berlin`. |
| `autor` | Wer den Eintrag angelegt hat (frei gewählter Name auf dem Gerät). |
| `bearbeitet_von` | Wer zuletzt geändert hat. |
| `ort` | `null` oder ein Objekt: `lat`, `lon` in Dezimalgrad WGS 84 (wie GPS und OpenStreetMap); `genauigkeit_m` = vom Gerät gemeldeter Radius der Unsicherheit in Metern; `hoehe_m` = Höhe über dem Ellipsoid, falls gemeldet, sonst `null`; `quelle` = `"gps"` (vom Gerät gemessen), `"hand"` (eingetippt oder korrigiert) oder `"karte"` (nachträglich auf der Karte gewählt, z. B. ein bekannter Ort aus der Erinnerung; `genauigkeit_m` ist dann aus dem Kartenmaßstab geschätzt); `name` = freier Ortsname. |
| `beobachtung` | Freitext. Das Wahrgenommene. |
| `deutung` | Freitext, darf leer sein. Interpretation. |
| `tags` | Liste von Schlagwörtern, klein geschrieben, ohne `#`, Leerzeichen als `-`. |
| `wetter` | `null` oder `text`, `temperatur_c`, `quelle`. `quelle` ist `"selbst"` (selbst wahrgenommen) oder `"open-meteo"` (Modellwert eines Wetterdienstes für den Ort, nicht vor Ort gemessen). |
| `medien` | Liste der angehängten Dateien: `id`, `typ` (`"foto"` oder `"ton"`), `mime`, `bytes`, `datei` (Pfad im Archiv). |
| `geloescht` | Nur vorhanden, wenn `true`: Der Eintrag wurde gelöscht. Er bleibt als „Grabstein“ mit `id`, `erstellt`, `geaendert` erhalten, damit sich das Löschen beim Zusammenführen auf andere Geräte überträgt. Grabsteine bei der Auswertung überspringen. |

Unbekannte zusätzliche Felder sollen beim Lesen ignoriert und beim Schreiben möglichst erhalten werden.

## Zusammenführen (Merge)

1. Einträge werden über `id` erkannt. Nichts wird doppelt angelegt.
2. Gibt es eine `id` nur auf einer Seite, wird der Eintrag übernommen.
3. Gibt es sie auf beiden Seiten, gewinnt die Fassung mit dem späteren `geaendert`.
   Bei Gleichstand bleibt die vorhandene Fassung.
4. Medien werden über ihre `id` erkannt und nur kopiert, wenn sie fehlen.
5. Ein neuerer Grabstein (`geloescht: true`) löscht den Eintrag und seine Medien.

## Hinweise für die Auswertung

- Fotos werden in der App standardmäßig auf höchstens 2048 Pixel Kantenlänge
  verkleinert und als JPEG gespeichert. Dabei gehen EXIF-Daten verloren.
  Ort und Zeit stehen deshalb immer in `logbuch.json`, nicht im Bild.
- Tonaufnahmen werden, soweit das Gerät es zulässt, ohne Rauschunterdrückung,
  Echounterdrückung und automatische Lautstärke aufgenommen, damit das
  Geräusch möglichst unverändert bleibt. Meist WebM/Opus oder MP4/AAC.
- Die ZIP-Datei ist unkomprimiert („stored“). Jedes ZIP-Programm kann sie öffnen.
  Die App liest beim Import auch ZIP-Dateien, die mit Kompression neu gepackt wurden,
  und auch eine einzelne `logbuch.json` ohne Medien.
