const CACHE_NAME = 'iccat-v3';
const DATA_CACHE_NAME = 'iccat-data-v3';

const urlsToCache = [
  '/',
  '/index.html',
  '/data.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Roboto+Mono:wght@400;500;700&display=swap'
];

const apiEndpointsToCache = [
  '/api/buildings',
  '/api/walkpaths',
  '/api/drivepaths',
  '/api/events',
  '/api/staff',
  '/api/floors',
  '/api/rooms'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(urlsToCache).catch(err => {
        console.warn('[SW] Some static assets failed to cache:', err);
        return Promise.resolve();
      });
    }).then(() => {
      return caches.open(DATA_CACHE_NAME);
    }).then((cache) => {
      console.log('[SW] Pre-caching API endpoints for offline use');
      return Promise.allSettled(
        apiEndpointsToCache.map(url =>
          fetch(url)
            .then(response => {
              if (response.ok) {
                console.log(`[SW] Cached ${url}`);
                return cache.put(url, response);
              } else {
                console.warn(`[SW] Failed to cache ${url}: HTTP ${response.status}`);
              }
            })
            .catch(err => {
              console.warn(`[SW] Failed to fetch ${url} (offline or error):`, err.message);
            })
        )
      ).then(results => {
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        console.log(`[SW] Pre-caching complete: ${successful} succeeded, ${failed} failed`);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log(`[SW] Serving ${url.pathname} from cache`);
            fetch(request)
              .then((response) => {
                if (response.status === 200) {
                  cache.put(request, response.clone());
                }
              })
              .catch(() => {});
            return cachedResponse;
          }
          
          console.log(`[SW] Fetching ${url.pathname} from network`);
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch((error) => {
              console.error(`[SW] Failed to fetch ${url.pathname}:`, error);
              throw error;
            });
        });
      })
    );
    return;
  }

  if (url.origin.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((response) => {
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(request).then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, DATA_CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
