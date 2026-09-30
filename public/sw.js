/* Cache same-origin shell assets only. Custom logos and QR contents stay out. */
const CACHE = `qr-genr8-shell-v1`;
const BASE = new URL(`./`, self.location.href);

self.addEventListener(`install`, () => {
    self.skipWaiting();
});

self.addEventListener(`activate`, (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys.filter((key) => key.startsWith(`qr-genr8-shell-`) && key !== CACHE)
                .map((key) => caches.delete(key)),
        )).then(() => self.clients.claim()),
    );
});

self.addEventListener(`fetch`, (event) => {
    const request = event.request;
    const url = new URL(request.url);
    if (request.method !== `GET` || url.origin !== BASE.origin) return;
    if (!url.pathname.startsWith(BASE.pathname) || url.search) return;

    if (request.mode === `navigate`) {
        event.respondWith(
            fetch(request).then((response) => {
                if (response.ok) {
                    const copy = response.clone();
                    event.waitUntil(caches.open(CACHE).then((cache) => cache.put(BASE.href, copy)));
                }
                return response;
            }).catch(async () => (await caches.match(BASE.href)) || Response.error()),
        );
        return;
    }

    if (!/\.(js|css|png|svg|woff2)$/.test(url.pathname)) return;
    event.respondWith(
        caches.match(request).then((cached) => cached || fetch(request).then((response) => {
            if (response.ok) {
                const copy = response.clone();
                event.waitUntil(caches.open(CACHE).then((cache) => cache.put(request, copy)));
            }
            return response;
        })),
    );
});
