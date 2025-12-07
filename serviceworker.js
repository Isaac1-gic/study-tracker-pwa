// serviceworker.js

// --- CONFIGURATION ---
const CACHE_NAME = 'study-tracker-v1'; // Increment this version when you update app files!
const CACHE_EXTERNAL_NAME = 'external-assets-cache-v1'; // For third-party assets
const STUDY_TAG = 'Dairy-Study-Remainder';

// List of files to cache for offline access (App Shell)
const OFFLINE_URLS = [
    '/',
    '/index.html',
    '/js/app.js',
    '/data.js', 
    '/style.css',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    '/all.min.css' 
];

// --- 1. INSTALLATION: Cache the App Shell ---
self.addEventListener('install', function(event) {
    console.log('[Service Worker] Install Event: Caching assets.');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('[Service Worker] Pre-caching app shell.');
                
                // We map over the URLs to handle them individually. 
                // This helps identify which specific file fails if one does.
                return Promise.all(
                    OFFLINE_URLS.map(url => {
                        return fetch(url).then(response => {
                            if (!response.ok) {
                                throw new Error(`Request for ${url} failed with status ${response.status}`);
                            }
                            return cache.put(url, response);
                        }).catch(error => {
                            console.error(`[Service Worker] Failed to cache ${url}:`, error);
                        });
                    })
                );
            })
            .then(() => self.skipWaiting()) // Activate immediately
    );
});

// --- 2. ACTIVATION: Clean up old caches ---
self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activate Event: Clearing old caches.');
    const cacheWhitelist = [CACHE_NAME, CACHE_EXTERNAL_NAME];

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Take control of all clients immediately
    );
});

// --- 3. FETCH: Cache First Strategy with External Handling ---
self.addEventListener('fetch', function(event) {
    // Only intercept HTTP/S requests (ignore chrome-extension://, etc.)
    if (!event.request.url.startsWith('http')) return;

    const requestUrl = new URL(event.request.url);

    // SPECIAL CASE: Tailwind CDN or other external assets requiring no-cors
    if (requestUrl.hostname === 'cdn.tailwindcss.com' || requestUrl.hostname === 'fonts.googleapis.com' || requestUrl.hostname === 'fonts.gstatic.com') {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) return cachedResponse;

                // Fetch with no-cors for opaque caching
                return fetch(event.request, { mode: 'no-cors' })
                    .then(response => {
                        return caches.open(CACHE_EXTERNAL_NAME).then(cache => {
                            cache.put(event.request, response.clone());
                            return response;
                        });
                    });
            })
        );
        return; // Exit function for this special case
    }

    // STANDARD STRATEGY: Cache First, then Network
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // 1. Return cached response if found
            if (response) {
                return response;
            }

            // 2. Fetch from network
            return fetch(event.request).then(function(networkResponse) {
                // Check if we received a valid response
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                // 3. Cache the new file for next time
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(function() {
                // Network failed and not in cache? 
                // Optional: Return a custom offline page here if navigation request
                // if (event.request.mode === 'navigate') { return caches.match('/offline.html'); }
            });
        })
    );
});

// --- 4. MESSAGING: Handle local notifications from App ---
self.addEventListener('message', event => {
    const { type, payload } = event.data || {};
    if (type === 'SHOW_NOTIFICATION') {
        showLocalNotification(payload);
    }
});

function showLocalNotification(rem) {
    const title = rem.title || 'Study Reminder';
    const options = {
        body: rem.body || '',
        tag: rem.id,
        renotify: true,
        data: { id: rem.id, timeISO: rem.timeISO }, // Store data for click handler
        icon: '/icon-512.png',
        badge: '/icon-192.png'
    };
    self.registration.showNotification(title, options);
}

// --- 5. NOTIFICATION CLICK HANDLER ---
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
            // If the app is open, focus it
            if (clients && clients.length) {
                const client = clients[0];
                client.focus();
                client.postMessage({ type: 'NOTIFICATION_CLICK', payload: event.notification.data });
            } else {
                // If app is closed, open it
                self.clients.openWindow('/');
            }
        })
    );
});

// --- 6. PERIODIC SYNC (Background Logic) ---
self.addEventListener('periodicsync', event => {
    if (event.tag === 'reminder-sync') {
        event.waitUntil(runBackgroundReminderLogic());
    }
});

// Placeholder for background logic
async function runBackgroundReminderLogic() {
    // In a real scenario, you'd read IndexedDB here to check for missed reminders.
    // For now, this just confirms the sync fired.
    console.log('[Service Worker] Periodic Sync fired.');
    
    /* Example logic:
    const db = await openDB(); 
    const reminders = await getReminders(db);
    reminders.forEach(rem => { if(shouldFire(rem)) showLocalNotification(rem); });
    */
}
