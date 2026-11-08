/* Schicht-Cockpit: macht die Seite installierbar und zeigt sie ohne Internet aus dem Zwischenspeicher.
   Die Seite selbst wird immer zuerst frisch geladen; Kurs- und Wetterabrufe laufen direkt ins Netz. */
const CACHE = "cockpit-v1";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "./icon-192.png"])).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.mode !== "navigate") return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put("./", copy)); return r; })
      .catch(() => caches.match("./"))
  );
});
