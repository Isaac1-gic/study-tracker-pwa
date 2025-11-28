// A unique name for your cache (update this if you change app shell files)
const CACHE_NAME = 'study-tracker-cache-v1';
// NEW: Dedicated cache for third-party files (CDNs, Google Fonts, etc.)
const CACHE_EXTERNAL_NAME = 'external-assets-cache-v1';

// List of files required for the app to run offline (the "App Shell")
const urlsToCache = [
  './', // Caches the root path (index.html)
  'index.html',
  'js/app.js',
  'manifest.json',
  'icon-192.png',
  'icon-512.jpg',
  'all.min.css',
  'style.css',// Old asset

  // Existing External Font
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap',

  // --- NEW Assets for Gemini UI and PDF ---
  'html2pdf.bundle.min.js',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'
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
        // Caching all local and critical external assets
        return cache.addAll(urlsToCache).catch(error => {
            console.error('[Service Worker] Error caching some files:', error);
        });
      })
  );
});

/* * -----------------------------------------------------
 * 2. FETCH EVENT: Implements the Cache-First strategy with dynamic external caching.
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

        // 2. NETWORK-FALLBACK & DYNAMIC CACHING: If not found, fetch from network and cache.
        return fetch(event.request).then(function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200) {
                return response;
            }
            
            // Check if the response is cacheable (type 'basic' for same-origin, 'opaque' for cross-origin)
            if(response.type !== 'basic' && response.type !== 'opaque') {
                return response;
            }

            // Determine which cache to use
            let cacheToUse = CACHE_NAME;
            
            // NEW: If the URL is external, use the external cache
            if (!event.request.url.includes(location.origin)) {
                cacheToUse = CACHE_EXTERNAL_NAME;
            }

            // Clone the response so we can use one for the cache and one for the browser.
            const responseToCache = response.clone();

            caches.open(cacheToUse)
              .then(function(cache) {
                // Cache the newly fetched resource for future use.
                cache.put(event.request, responseToCache);
              });

            return response;
        });
      }).catch(function() {
          // If both cache and network fail (which happens when offline),
          console.log('[Service Worker] Cache and Network failed for:', event.request.url);
          // return caches.match('offline.html'); 
      })
    );
  }
});

/* * -----------------------------------------------------
 * 3. ACTIVATE EVENT: Cleans up old caches.
 * -----------------------------------------------------
 */
self.addEventListener('activate', function(event) {
  // UPDATED: Whitelist now includes the new external cache name.
  const cacheWhitelist = [CACHE_NAME, CACHE_EXTERNAL_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // Delete any cache that is not on the whitelist
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
 * 4. PERIODIC SYNC EVENT: The code that runs in the background. (PRESERVED)
 * -----------------------------------------------------
 */
self.addEventListener('periodicsync', function(event) {
    // Check the tag to ensure we run the correct task
    if (event.tag === 'Study-Reminder-Sync') {
        
        // event.waitUntil() ensures the Service Worker stays alive until this promise resolves.
        event.waitUntil(
            // This function is preserved from your original code.
            runBackgroundReminderLogic() 
        );
    }
});

// A placeholder function for what the Service Worker should actually do (PRESERVED)
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


