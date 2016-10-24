const CACHE_VERSION = 1;
const CURRENT_CACHES = {
  prefetch: 'window-cache-v' + CACHE_VERSION
};

self.addEventListener('install', event => {
  self.skipWaiting();

  let urlsToPrefetch = [
    './',
    './index.html',
    './service-worker.html',
    './assets/stylesheets/styles.css',
    './assets/javascripts/sw-client.js',
    './assets/images/Jurassic_Park_logo.jpg',
    './assets/images/offline-fallback.jpg'
  ];

  caches.open(CURRENT_CACHES.prefetch).then(cache => {
    return cache.addAll(urlsToPrefetch).catch(error => {
      console.log('Prefetching fails', error);
    });
  });
});

self.addEventListener('activate', event => {
  console.log('activate');
});

self.addEventListener('fetch', event => {
  if (event.request.url.match(/Jurassic_Park_logo/g) && !navigator.onLine) {
    let fallbackImage = new Request('./assets/images/offline-fallback.jpg');

    event.respondWith(
      caches.match(fallbackImage).then(response => {
        return response;
      }).catch(err => {
        console.error(err);
        fetch('./assets/images/offline-fallback.jpg').then(response => {
          return response;
        }).catch(function(err) {
          console.error('Match on cache failed', err);
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (!response) return null;

        var URL = response.url;

        if (!URL) return response;

        if ( !URL.match(/sw.js/g) && URL.match(location.host) ) {
          caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
            return cache.put(event.request, response.clone());
          });
        }

        return response || fetch(event.request);
      }).catch(function(err) {
        console.error('Match on cache failed', err);
        return fetch(event.request).catch((err) => {
          console.error('Fetch is not possible at moment', err);
        });
      })
    );
  }
});
