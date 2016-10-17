(function () {
  const appCache = applicationCache;

  appCache.onobsolete = function(event) {
    console.log('obsoleted cache', event.type);
  };

  appCache.onnoupdate = function (event) {
    console.info('appCache updated!');
  };

  appCache.onupdateready = function (event) {
    console.info('appCache update ready!');
  };

  appCache.onchecking = function (event) {
    console.log('appCache checking...', event.type);
  };

  appCache.ondownloading = function (event) {
    console.log('downloading...', event.type);
  };

  appCache.onprogress = function (event) {
    console.info('loaded:', (event.loaded / event.total) * 100, '%');
  };

  appCache.oncached = function (event) {
    console.log('cached!', event.type);
  };

  const checkStatus = (status) => {
    if (status === appCache.UPDATEREADY) {
      appCache.swapCache();
    }

    if (status === appCache.IDLE) {
      window.location.reload();
      return;
    }

    setTimeout(() => {
      checkStatus(appCache.status);
    }, 250);
  };

  /*
   * Updating cache event
   */
  const updateCacheButton = document.querySelector('#update-cache');

  updateCacheButton.addEventListener('click', (event) => {
    appCache.update();
    checkStatus(appCache.status);
  });
})();
