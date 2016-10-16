(function () {
  applicationCache.onobsolete = function(event) {
    alert("applicationCache obsolete!");
    console.log("obsolted cache", event.type);
  };

  applicationCache.onnoupdate = function (event) {
    console.info("applicationCache updated!");
  };

  applicationCache.onupdateready = function (event) {
    console.info("applicationCache update ready!");
  };

  applicationCache.onchecking = function (event) {
    console.log("applicationCache checking...", event.type);
  };

  applicationCache.ondownloading = function (event) {
    console.log("downloading...", event.type);
  };

  applicationCache.onprogress = function (event) {
    console.info("loaded:", (event.loaded / event.total) * 100, "%");
  };

  applicationCache.oncached = function (event) {
    console.log("cached!", event.type);
  };
})();
