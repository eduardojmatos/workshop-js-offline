(function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./assets/javascripts/sw.js', {scope: './assets/javascripts/'}).then((event) => {
      console.log('Service Worker registered!');
    }).catch((error) => {
      console.warn('Service Worker not registered', error);
    });
  }
})();
