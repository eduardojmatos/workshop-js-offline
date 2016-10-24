(function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((event) => {
      console.log('Service Worker registered!');
    }).catch((error) => {
      console.warn('Service Worker not registered', error);
    });
  }
})();
