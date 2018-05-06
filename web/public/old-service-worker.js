"use strict";
var precacheConfig = [
    ["/index.html", "42c1a997ae38248dc0e971480567a259"],
    ["/static/css/main.13d24b42.css", "beedc2b4b6b095f1566cc0ab52f9c28d"],
    ["/static/media/logo.7679d720.svg", "7679d720ecf8fd564e8181c4d9d9da9d"],
    [
      "/static/media/roboto-v19-latin-ext_latin_cyrillic_cyrillic-ext-500.0fd5e04d.eot",
      "0fd5e04d61481c25b85bdfc9ecd4fab4",
    ],
    [
      "/static/media/roboto-v19-latin-ext_latin_cyrillic_cyrillic-ext-500.195fe20b.ttf",
      "195fe20b1907ffaf6f0ad6429997a0d5",
    ],
    [
      "/static/media/roboto-v19-latin-ext_latin_cyrillic_cyrillic-ext-500.6b235824.svg",
      "6b235824a45f55c12ecc6fb364b3293c",
    ],
    [
      "/static/media/roboto-v19-latin-ext_latin_cyrillic_cyrillic-ext-500.6f69d99b.woff2",
      "6f69d99b9b0706a2a955ed42d64742a1",
    ],
    [
      "/static/media/roboto-v19-latin-ext_latin_cyrillic_cyrillic-ext-500.851a2b5a.woff",
      "851a2b5a8394eb1b868678bfd31a1a8a",
    ],
    [
      "/static/media/roboto-v19-latin-ext_latin_cyrillic_cyrillic-ext-700.74bc6165.ttf",
      "74bc6165dc68714ccaa88f5c64656b1c",
    ],
    [
      "/static/media/roboto-v19-latin-ext_latin_cyrillic_cyrillic-ext-700.7dfb39b7.eot",
      "7dfb39b7b728dd6cfaa2d4b27ea389d6",
    ],
    [
      "/static/media/roboto-v19-latin-ext_latin_cyrillic_cyrillic-ext-700.90b12e16.svg",
      "90b12e163d7a549300a7577bbf01c2fe",
    ],
    [
      "/static/media/roboto-v19-latin-ext_latin_cyrillic_cyrillic-ext-700.cf654de4.woff",
      "cf654de4c5d988526828f731f299d30a",
    ],
    [
      "/static/media/roboto-v19-latin-ext_latin_cyrillic_cyrillic-ext-700.f3501dc6.woff2",
      "f3501dc6e4b56028379328ddd8f0129f",
    ],
    [
      "/static/media/roboto-v19-latin-ext_latin_cyrillic_cyrillic-ext-regular.0d984aca.ttf",
      "0d984acaec916c225c012f27d0c56a91",
    ],
    [
      "/static/media/roboto-v19-latin-ext_latin_cyrillic_cyrillic-ext-regular.3ce3e2e3.svg",
      "3ce3e2e315625e0955240b145c85c682",
    ],
    [
      "/static/media/roboto-v19-latin-ext_latin_cyrillic_cyrillic-ext-regular.5ea30813.eot",
      "5ea308130680132126f4f73c0d7b73f9",
    ],
    [
      "/static/media/roboto-v19-latin-ext_latin_cyrillic_cyrillic-ext-regular.95493600.woff2",
      "9549360090baf2eb8b25d3a9708fc19d",
    ],
    [
      "/static/media/roboto-v19-latin-ext_latin_cyrillic_cyrillic-ext-regular.a91ad097.woff",
      "a91ad097d24828af724d4fee36a063ed",
    ],
  ],
  cacheName =
    "sw-precache-v3-sw-precache-webpack-plugin-" +
    (self.registration ? self.registration.scope : ""),
  ignoreUrlParametersMatching = [/^utm_/],
  addDirectoryIndex = function (e, t) {
    var a = new URL(e);
    return "/" === a.pathname.slice(-1) && (a.pathname += t), a.toString();
  },
  cleanResponse = function (t) {
    return t.redirected
      ? ("body" in t ? Promise.resolve(t.body) : t.blob()).then(function (e) {
          return new Response(e, {
            headers: t.headers,
            status: t.status,
            statusText: t.statusText,
          });
        })
      : Promise.resolve(t);
  },
  createCacheKey = function (e, t, a, i) {
    var r = new URL(e);
    return (
      (i && r.pathname.match(i)) ||
        (r.search +=
          (r.search ? "&" : "") +
          encodeURIComponent(t) +
          "=" +
          encodeURIComponent(a)),
      r.toString()
    );
  },
  isPathWhitelisted = function (e, t) {
    if (0 === e.length) return !0;
    var a = new URL(t).pathname;
    return e.some(function (e) {
      return a.match(e);
    });
  },
  stripIgnoredUrlParameters = function (e, a) {
    var t = new URL(e);
    return (
      (t.hash = ""),
      (t.search = t.search
        .slice(1)
        .split("&")
        .map(function (e) {
          return e.split("=");
        })
        .filter(function (t) {
          return a.every(function (e) {
            return !e.test(t[0]);
          });
        })
        .map(function (e) {
          return e.join("=");
        })
        .join("&")),
      t.toString()
    );
  },
  hashParamName = "_sw-precache",
  urlsToCacheKeys = new Map(
    precacheConfig.map(function (e) {
      var t = e[0],
        a = e[1],
        i = new URL(t, self.location),
        r = createCacheKey(i, hashParamName, a, /\.\w{8}\./);
      return [i.toString(), r];
    })
  );
function setOfCachedUrls(e) {
  return e
    .keys()
    .then(function (e) {
      return e.map(function (e) {
        return e.url;
      });
    })
    .then(function (e) {
      return new Set(e);
    });
}
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches
      .open(cacheName)
      .then(function (i) {
        return setOfCachedUrls(i).then(function (a) {
          return Promise.all(
            Array.from(urlsToCacheKeys.values()).map(function (t) {
              if (!a.has(t)) {
                var e = new Request(t, { credentials: "same-origin" });
                return fetch(e).then(function (e) {
                  if (!e.ok)
                    throw new Error(
                      "Request for " +
                        t +
                        " returned a response with status " +
                        e.status
                    );
                  return cleanResponse(e).then(function (e) {
                    return i.put(t, e);
                  });
                });
              }
            })
          );
        });
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
}),
  self.addEventListener("activate", function (e) {
    var a = new Set(urlsToCacheKeys.values());
    e.waitUntil(
      caches
        .open(cacheName)
        .then(function (t) {
          return t.keys().then(function (e) {
            return Promise.all(
              e.map(function (e) {
                if (!a.has(e.url)) return t.delete(e);
              })
            );
          });
        })
        .then(function () {
          return self.clients.claim();
        })
    );
  }),
  self.addEventListener("fetch", function (t) {
    if ("GET" === t.request.method) {
      var e,
        a = stripIgnoredUrlParameters(
          t.request.url,
          ignoreUrlParametersMatching
        ),
        i = "index.html";
      (e = urlsToCacheKeys.has(a)) ||
        ((a = addDirectoryIndex(a, i)), (e = urlsToCacheKeys.has(a)));
      var r = "/index.html";
      !e &&
        "navigate" === t.request.mode &&
        isPathWhitelisted(["^(?!\\/__).*"], t.request.url) &&
        ((a = new URL(r, self.location).toString()),
        (e = urlsToCacheKeys.has(a))),
        e &&
          t.respondWith(
            caches
              .open(cacheName)
              .then(function (e) {
                return e.match(urlsToCacheKeys.get(a)).then(function (e) {
                  if (e) return e;
                  throw Error(
                    "The cached response that was expected is missing."
                  );
                });
              })
              .catch(function (e) {
                return (
                  console.warn(
                    'Couldn\'t serve response for "%s" from cache: %O',
                    t.request.url,
                    e
                  ),
                  fetch(t.request)
                );
              })
          );
    }
  });
