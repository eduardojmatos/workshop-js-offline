const CACHE_VERSION = 1;
const CURRENT_CACHES = {
  prefetch: 'window-cache-v' + CACHE_VERSION
};

self.addEventListener('install', event => {
  let urlsToPrefetch = [
    '',
    'index.html',
    'application-cache.html',
    'service-worker.html',
    'assets/stylesheets/styles.css',
    'assets/javascripts/sw-client.js',
    'assets/javascripts/application-cache.js',
    'assets/images/Jurassic_Park_logo.jpg',
    'assets/images/offline-fallback.jpg'
  ];

  urlsToPrefetch = urlsToPrefetch.map(url => `./../../${url}`);

  event.waitUntil(
    caches.open(CURRENT_CACHES.prefetch).then(cache => {
      return cache.addAll(urlsToPrefetch).then(() => {
        self.skipWaiting();
      }).catch(error => {
        console.log('Prefetching fails', error);
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.open(CURRENT_CACHES.prefetch).then(cache => {
        return cache.keys().then(keys => {
          return cache.match(keys[0]).then(response => {
            if (response) {
              return response;
            }

            throw Error(`Cache ${cache} is empty`);
          })
        });
      }).catch(error => {
        console.warn(`This URL ${event.request.url} is not on current cache`, error);
        return fetch(event.request);
      })
    )
  }
});
