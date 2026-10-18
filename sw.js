/* Service Worker: macht das Logbuch offline nutzbar.
   - App-Dateien: beim Installieren gespeichert; danach zuerst aus dem Speicher,
     im Hintergrund aktualisiert, wenn Netz da ist.
   - Schriften (Google Fonts) und Kartenkacheln (OpenStreetMap): werden beim
     ersten Laden gespeichert und dann offline wiederverwendet. So ist eine
     Gegend, die du einmal mit Netz angesehen hast, im Wald noch da.
   - Alles andere (z. B. Wetter) geht direkt ins Netz.
   Bei Änderungen an der App VERSION erhöhen, damit Geräte die neue Fassung holen. */
const VERSION = 'logbuch-v7';
const APP = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];
const FREMD = 'logbuch-fremd';      // Schriften
const KACHELN = 'logbuch-kacheln';  // Kartenkacheln
const MAX_KACHELN = 3000;           // etwa 40–60 MB

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(VERSION).then(c => c.addAll(APP)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', ev => {
  ev.waitUntil(caches.keys()
    .then(namen => Promise.all(namen.filter(n => n.startsWith('logbuch-v') && n !== VERSION).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', ev => {
  const req = ev.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    // App-Dateien: sofort aus dem Speicher, im Hintergrund auffrischen
    ev.respondWith(caches.open(VERSION).then(async cache => {
      const alt = await cache.match(req, { ignoreSearch: true });
      const neu = fetch(req).then(r => { if (r.ok) cache.put(req, r.clone()); return r; }).catch(() => null);
      return alt || (await neu) || cache.match('./index.html');
    }));
    return;
  }

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    ev.respondWith(zuerstGespeichert(FREMD, req));
    return;
  }

  if (url.hostname === 'tile.openstreetmap.org') {
    ev.respondWith(zuerstGespeichert(KACHELN, req, MAX_KACHELN));
  }
});

async function zuerstGespeichert(name, req, max) {
  const cache = await caches.open(name);
  const alt = await cache.match(req);
  if (alt) return alt;
  try {
    const r = await fetch(req);
    if (r.ok || r.type === 'opaque') {
      await cache.put(req, r.clone());
      if (max) aufraeumen(cache, max);
    }
    return r;
  } catch (e) {
    return new Response('', { status: 504, statusText: 'offline' });
  }
}

/* Älteste Kacheln entfernen, wenn es zu viele werden */
async function aufraeumen(cache, max) {
  const schluessel = await cache.keys();
  for (let i = 0; i < schluessel.length - max; i++) await cache.delete(schluessel[i]);
}
