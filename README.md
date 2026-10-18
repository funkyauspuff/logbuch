# Logbuch

Private Naturbeobachtungen, offline, ohne Server und ohne Konto.

Du schreibst auf, was du wahrnimmst. Das Logbuch hält Zeit und Standort fest,
nimmt Fotos und Ton auf und zeigt alle Orte auf einer Karte, filterbar nach Tags
(zum Beispiel `#essbar`). **Beobachtung** und **Deutung** sind getrennte Felder:
erst das Wahrgenommene, die Interpretation darf später kommen.

## Eigenschaften

- **Privat**: Alle Daten bleiben im Browser-Speicher (IndexedDB) des Geräts. Es gibt keinen Server.
- **Offline**: Nach dem ersten Öffnen funktioniert alles ohne Netz (Service Worker).
  Kartenkacheln einer Gegend, die du einmal mit Netz angesehen hast, bleiben gespeichert.
  Ohne Kacheln zeigt die Karte ein Gradnetz mit Maßstab.
- **Archiv**: Export als gewöhnliche ZIP-Datei mit `logbuch.json`, `eintraege.md`,
  `LIESMICH.md` und den Mediendateien. Lesbar ohne die App, von Menschen und KI-Systemen.
  Siehe [ARCHIVFORMAT.md](ARCHIVFORMAT.md).
- **Zusammenführen**: Archive mehrerer Geräte oder Personen lassen sich laden.
  Einträge werden über ihre UUID erkannt; die neuere Fassung gewinnt; Löschungen übertragen sich.
- **Auszüge**: Ausgewählte Einträge lassen sich ohne Ort, Namen und Wetter weitergeben; Fotos und Ton werden dabei von Metadaten befreit.
- **Sparsam**: Fotos werden standardmäßig auf 2048 px verkleinert (abschaltbar).
- **Keine Abhängigkeiten**: eine HTML-Datei mit eigenem JavaScript. Karte und ZIP sind selbst geschrieben.

## Aufbau

```
index.html              die ganze App: HTML, CSS und JavaScript in einer Datei,
                        kommentiert und in nummerierte Abschnitte gegliedert
ARCHIVFORMAT.md         Formatbeschreibung des Archivs (liegt jedem Archiv als LIESMICH.md bei)
sw.js                   Service Worker für den Offline-Betrieb
manifest.webmanifest    App-Beschreibung für „Zum Startbildschirm hinzufügen“
icon.svg, icon-*.png    Symbole
LICENSE                 MIT-Lizenz
```

## Installieren

Die App läuft unter https://funkyauspuff.github.io/logbuch/

1. Die Adresse auf dem Handy einmal mit Internet öffnen.
2. „Zum Startbildschirm hinzufügen“ bzw. „App installieren“ wählen.
3. Fertig. Danach startet das Logbuch wie eine App und braucht kein Netz mehr.

Jedes Gerät hat seinen eigenen Speicher. Daten wandern nur über Archive zwischen Geräten.

**Wichtig:** Der Browser kann Website-Daten löschen, etwa beim „Browserdaten löschen“
oder wenn das Gerät sehr voll ist. Unter *Archiv* lässt sich der Speicher als
dauerhaft markieren. Trotzdem: regelmäßig ein Archiv sichern.

Geräte ohne GPS (viele Tablets) finden ihren Standort nur mit WLAN. Ohne Netz lässt
sich der Ort dort von Hand eintragen oder auf der Karte wählen.

Eine eigene Kopie: Repository forken, unter *Settings → Pages* „Deploy from a branch“,
`main` und `/ (root)` wählen.

## Ändern

Die App ist bewusst eine einzige Datei (`index.html`) ohne Build-Schritt und ohne
Abhängigkeiten. Die Abschnitte des Skripts sind an seinem Anfang aufgelistet.

- Nach jeder Änderung in `sw.js` die `VERSION` erhöhen, damit installierte Geräte
  die neue Fassung laden.
- Die Formatbeschreibung steht zweimal: als `ARCHIVFORMAT.md` und eingebettet in
  `index.html` (im `<script type="text/markdown" id="archivformat">`). Beide gleich halten.
- Wird das Archivformat erweitert: neue Felder optional halten, unbekannte Felder
  beim Lesen erhalten, `version` nur bei inkompatiblen Änderungen erhöhen.

## Entstehung

Das Logbuch ist im Gespräch mit Claude (Anthropic) entstanden. Idee, Anforderungen
und der Grundsatz, Beobachtung und Deutung zu trennen, stammen von uns; der Code
wurde von Claude geschrieben und von uns auf Handy und Tablet getestet.
