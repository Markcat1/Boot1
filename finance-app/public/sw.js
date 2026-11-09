self.addEventListener('install', function (event) {
  console.log('Service Worker: Installing');
  event.waitUntil(
    caches.open('finance-app-cache-v1').then(function (cache) {
      return cache.addAll(['/']);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});