// A unique name for your cache (update this if you change app shell files)
const CACHE_NAME = 'study-tracker-cache-v1';

// List of files required for the app to run offline (the "App Shell")
const urlsToCache = [
  './', // Caches the root path (index.html)
  'index.html',
  'js/app.js',
  'manifest.json',
  'icon-192.png',
  'icon-512.jpg',
  
  // External assets must also be explicitly cached if needed offline:
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap'
];

/* * -----------------------------------------------------
 * 1. INSTALL EVENT: Caches all essential App Shell files.
 * -----------------------------------------------------
 */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('[Service Worker] Opened cache and adding files...');
        return cache.addAll(urlsToCache).catch(error => {
            console.error('[Service Worker] Error caching some files:', error);
        });
      })
  );
});

/* * -----------------------------------------------------
 * 2. FETCH EVENT: Implements the Cache-First strategy.
 * -----------------------------------------------------
 */
self.addEventListener('fetch', function(event) {
  // Only handle requests for http/https, ignore chrome-extension:// etc.
  if (event.request.url.startsWith('http')) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        // 1. CACHE-FIRST: If the asset is found in the cache, return it immediately.
        if (response) {
          console.log('[Service Worker] Found in Cache:', event.request.url);
          return response;
        }

        // 2. NETWORK-FALLBACK: If not found in cache, fetch from the network.
        // The fetch request is cloned so the response can be stored in the cache.
        return fetch(event.request).then(function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }

            // Clone the response so we can use one for the cache and one for the browser.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                // Cache the newly fetched resource for future use.
                cache.put(event.request, responseToCache);
              });

            return response;
        });
      }).catch(function() {
          // If both cache and network fail (which happens when offline),
          // you could return a custom offline page here.
          console.log('[Service Worker] Cache and Network failed for:', event.request.url);
          // return caches.match('offline.html'); // Uncomment if you have an offline page
      })
    );
  }
});

/* * -----------------------------------------------------
 * 3. ACTIVATE EVENT: Cleans up old caches.
 * -----------------------------------------------------
 */
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // Delete any cache that is not the current version (CACHE_NAME)
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

/* * -----------------------------------------------------
 * 4. PERIODIC SYNC EVENT: The code that runs in the background.
 * -----------------------------------------------------
 */
self.addEventListener('periodicsync', function(event) {
    // Check the tag to ensure we run the correct task
    if (event.tag === 'Study-Reminder-Sync') {
        
        // event.waitUntil() ensures the Service Worker stays alive until this promise resolves.
        event.waitUntil(
            // Replace 'runBackgroundReminderLogic()' with your actual function 
            // that checks the study data and generates a Notification.
            runBackgroundReminderLogic() 
        );
    }
});

// A placeholder function for what the Service Worker should actually do
function runBackgroundReminderLogic() {
    // 1. Fetch data from IndexedDB or storage
    // 2. Check if the time/conditions for a study reminder have been met
    // 3. If so, display a notification:
    
    return self.registration.showNotification('Study Reminder', {
        body: 'It is time for your scheduled study session!',
        icon: 'icon-192.png',
        tag: 'study-reminder-alert'
    });
}
