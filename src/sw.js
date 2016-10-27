const CACHE_VERSION = 1;
const CURRENT_CACHES = {
  ondemand: 'ondemand-v' + CACHE_VERSION
};

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  console.info(':::: Handling fetch event for', event.request.url);

  event.respondWith(
    fetch(event.request).then((response) => {
      if (!response) throw new Error('It\'s imposible');

      if (!isASafeURL(event.request.url) || !isASafeRequest(event.request)) return response;

      caches.open(CURRENT_CACHES.ondemand).then((cache) => {
        return cache.put(event.request, response.clone()).then(() => response);
      });

      return Promise.resolve(response.clone());
    }).catch((error) => {
      console.error('Fetching failed:', error);
      return Promise.reject(error);
    })
  );
});

const isASafeURL = (url) => {
 if (
     url.startsWith('chrome-extension') ||
     !url.match(location.origin)
    ) {
   return false;
 }

 return true;
}

const isASafeRequest = (request) => {
  if ( request.method !== 'GET' ) {
    return false;
  }

  return true;
}
