// Service Worker for Quran Verse Widget PWA
const CACHE_NAME = 'quran-verse-widget-v1.0.0';
const STATIC_CACHE = 'quran-static-v1.0.0';
const DYNAMIC_CACHE = 'quran-dynamic-v1.0.0';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/moon.png',
  '/icon-1.png',
  '/icon-2.png',
  '/icon-3.png',
  '/icon-4.png',
  '/icon-5.png',
  '/favicon.ico',
  'https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&family=Quicksand:wght@300..700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^https:\/\/api\.alquran\.cloud\/v1\/ayah\/random/
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Failed to cache static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests (Quran verses)
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE)
        .then(cache => {
          return cache.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                console.log('Service Worker: Serving cached API response');
                // Return cached response but also update cache in background
                fetch(request)
                  .then(response => {
                    if (response.ok) {
                      cache.put(request, response.clone());
                    }
                  })
                  .catch(() => {
                    // Network failed, but we have cached response
                  });
                return cachedResponse;
              } else {
                // No cached response, fetch from network
                return fetch(request)
                  .then(response => {
                    if (response.ok) {
                      cache.put(request, response.clone());
                    }
                    return response;
                  })
                  .catch(error => {
                    console.log('Service Worker: Network failed, no cached response');
                    // Return a fallback response for API failures
                    return new Response(
                      JSON.stringify({
                        error: 'Network unavailable',
                        message: 'Please check your internet connection'
                      }),
                      {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: { 'Content-Type': 'application/json' }
                      }
                    );
                  });
              }
            });
        })
    );
    return;
  }

  // Handle static files
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            console.log('Service Worker: Serving cached static file');
            return cachedResponse;
          }

          return fetch(request)
            .then(response => {
              // Don't cache non-successful responses
              if (!response.ok) {
                return response;
              }

              // Cache successful responses
              const responseClone = response.clone();
              caches.open(STATIC_CACHE)
                .then(cache => {
                  cache.put(request, responseClone);
                });

              return response;
            })
            .catch(error => {
              console.log('Service Worker: Network failed for', request.url);
              
              // Return offline page for navigation requests
              if (request.mode === 'navigate') {
                return caches.match('/index.html');
              }
              
              // For other requests, let them fail
              throw error;
            });
        })
    );
  }
});

// Background sync for when connection is restored
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(
      // Perform any background tasks here
      Promise.resolve()
    );
  }
});

// Push notifications (for future use)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-96.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'View Verse',
          icon: '/icon-96.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icon-96.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle app updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
