const CACHE_NAME = "smart-object-explorer-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./species.html",
  "./manifest.json",
  "./camp2.jpg",
  "./Agastya logo.avif"
  // you can add "./icons/icon-192.png", "./icons/icon-512.png" too if you like
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => {
        console.warn("Cache addAll failed", err);
      });
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).catch(() => cached);
    })
  );
});
