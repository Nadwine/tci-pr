// worker loader found in index.html
var version = "v1.6"; // increase for new version will force all home-screen apps to update
var staticCacheName = version + "_tcihb_pwa-static";
var dynamicCacheName = version + "__tcihb_pwa-dynamic";

const DYNAMIC_CACHE_FILES = [
  "assets/index-b28e87ab.css",
  "/",
  "/src/client/entry-client.tsx",
  "/src/client/entry-server.tsx",
  "/src/client/Main.tsx",
  "/src/client/pages/Home.tsx"
];
const STATIC_CACHE_FILES = [];

// self.addEventListener("install", e => {
//   console.log("installing", e);

//   return self.skipWaiting(); // always activate updated SW immediately
// });

self.addEventListener("message", event => {
  // console.log(event);
  // console.log("received-event", event.type, event.data);
  // if (event.data && event.data.event === "clear-cache") {
  //   event.waitUntil(
  //     caches.keys().then(function (names) {
  //       for (let name of names) caches.delete(name);
  //     })
  //   );
  // }
});

// self.addEventListener("activate", function (event) {
//   console.log("activating /static/service-worker.js");
//   event.waitUntil(
//     caches.keys().then(function (cacheNames) {
//       return Promise.all(
//         cacheNames
//           .filter(function (cacheName) {
//             if (!cacheName.startsWith(staticCacheName) && !cacheName.startsWith(dynamicCacheName)) {
//               return true;
//             }
//           })
//           .map(function (cacheName) {
//             console.log("Removing old cache.", cacheName);
//             return caches.delete(cacheName);
//           })
//       );
//     })
//   );
// });

self.addEventListener("install", function (e) {
  console.log("install from service-worker.js triggered");
  e.waitUntil(
    Promise.all([caches.open(staticCacheName), caches.open(dynamicCacheName), self.skipWaiting()]).then(function (storage) {
      var static_cache = storage[0];
      var app_cache = storage[1];
      return Promise.all([static_cache.addAll(STATIC_CACHE_FILES), app_cache.addAll(DYNAMIC_CACHE_FILES)]);
    })
  );
});

self.addEventListener("activate", function (e) {
  console.log("activate from service-worker.js triggered");
  e.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheName !== dynamicCacheName && cacheName !== staticCacheName) {
              console.log("deleting", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  console.log("trying to get cached file");
  // find if its a match and use something like below
  // if (url.origin == location.origin && url.pathname == '/dog.svg') {
  //   event.respondWith(caches.match('/cat.svg'));
  // }
});
