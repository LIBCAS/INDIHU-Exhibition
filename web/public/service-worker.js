self.addEventListener("install", (e) => {
  console.log("install SW");
  e.waitUntil(
    caches
      .keys()
      .then((cacheKeys) => {
        return Promise.all(
          cacheKeys.map((cacheKey) => caches.delete(cacheKey))
        );
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", (e) => {
  console.log("activate SW!");
  e.waitUntil(
    self.clients.claim().then(() => {
      return new Promise((resolve, _reject) => {
        resolve();
      });
    })
  );
});
