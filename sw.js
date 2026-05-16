// Anna Mai Race Bridge — Service Worker
// Caches the app shell for offline use

const CACHE_NAME = ‘anna-mai-v1’;
const CACHE_URLS = [
‘/AnnaMai/’,
‘/AnnaMai/index.html’,
‘/AnnaMai/manifest.json’,
];

// Install — cache app shell
self.addEventListener(‘install’, event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => {
return cache.addAll(CACHE_URLS);
}).then(() => self.skipWaiting())
);
});

// Activate — clean up old caches
self.addEventListener(‘activate’, event => {
event.waitUntil(
caches.keys().then(keys =>
Promise.all(
keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
)
).then(() => self.clients.claim())
);
});

// Fetch — serve from cache, fall back to network
// Network-first for API calls, cache-first for app shell
self.addEventListener(‘fetch’, event => {
const url = new URL(event.request.url);

// Always go network-first for external APIs (weather, tiles)
if (url.hostname !== self.location.hostname) {
event.respondWith(
fetch(event.request).catch(() => {
// If network fails and we have a cached response, use it
return caches.match(event.request);
})
);
return;
}

// Cache-first for app shell
event.respondWith(
caches.match(event.request).then(cached => {
if (cached) {
// Serve cached, update in background
fetch(event.request).then(response => {
if (response && response.status === 200) {
caches.open(CACHE_NAME).then(cache => {
cache.put(event.request, response);
});
}
}).catch(() => {});
return cached;
}
// Not in cache — fetch from network
return fetch(event.request).then(response => {
if (response && response.status === 200) {
const clone = response.clone();
caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
}
return response;
});
})
);
});
