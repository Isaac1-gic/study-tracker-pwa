// serviceworker.js

// --- CONFIGURATION ---
const CACHE_NAME = 'study-tracker-v3';
const CACHE_EXTERNAL_NAME = 'external-assets-cache-v1';
const STUDY_TAG = 'Dairy-Study-Remainder';

// List of files to cache for offline access.
// Ensure these paths match your actual file structure exactly.
const OFFLINE_URLS = [
    '/',
    '/index.html',
    '/js/app.js',
    '/style.css',
    '/manifest.json',
    '/icon-192.png',
    '/icon1-512.png',
    '/data.js',
    '/all.min.css',
    // External Assets (Fonts, CSS)
    'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'
];

// --- 1. INSTALLATION: Cache the App Shell ---
self.addEventListener('install', function(event) {
    console.log('[Service Worker] Install Event: Starting...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('[Service Worker] Caching App Shell');
                // We use map/promise.all to cache what we can, logging failures without stopping everything
                return Promise.all(
                    OFFLINE_URLS.map(url => {
                        return fetch(url, { mode: 'no-cors' }).then(response => {
                            return cache.put(url, response);
                        }).catch(error => {
                            console.warn(`[Service Worker] Failed to cache ${url}:`, error);
                        });
                    })
                );
            })
            .then(() => self.skipWaiting())
    );
});

// --- 2. ACTIVATION: Clean up old caches ---
self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activated. Cleaning old caches.');
    const cacheWhitelist = [CACHE_NAME, CACHE_EXTERNAL_NAME];

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// --- 3. FETCH: Cache First Strategy ---
self.addEventListener('fetch', function(event) {
    if (!event.request.url.startsWith('http')) return;

    const requestUrl = new URL(event.request.url);

    // Special handling for External Assets (Tailwind, Fonts)
    if (requestUrl.hostname === 'cdn.tailwindcss.com' || 
        requestUrl.hostname === 'fonts.googleapis.com' || 
        requestUrl.hostname === 'fonts.gstatic.com') {
        
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) return cachedResponse;
                return fetch(event.request, { mode: 'no-cors' })
                    .then(response => {
                        return caches.open(CACHE_EXTERNAL_NAME).then(cache => {
                            cache.put(event.request, response.clone());
                            return response;
                        });
                    });
            })
        );
        return;
    }

    // Standard Cache-First for App Shell
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request).then(function(networkResponse) {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, responseToCache);
                });
                return networkResponse;
            }).catch(error => {
                // Optional: Return a custom offline page here if needed
                // console.log('[Service Worker] Fetch failed (Offline):', event.request.url);
            });
        })
    );
});

// --- 4. MESSAGING: Handle 'SHOW_NOTIFICATION' from Client ---
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        showLocalNotification(event.data.payload);
    }
});

function showLocalNotification(rem) {
    const title = rem.title || 'Study Tracker';
    
    // FIX: Ensure tag is valid. Use ID, or fallback to a generic tag.
    // The browser requires a tag if 'renotify' is true.
    const notificationTag = rem.id || 'study-tracker-general';

    const options = {
        body: rem.body || 'You have a study reminder.',
        tag: notificationTag,
        renotify: true,
        data: { 
            id: rem.id, 
            timeISO: rem.timeISO,
            url: 'index.html' // URL to open on click
        },
        icon: 'icon-192.png', 
        badge: 'icon-512.png'
    };

    self.registration.showNotification(title, options);
}

// --- 5. NOTIFICATION CLICK: Focus App ---
self.addEventListener('notificationclick', event => {
    event.notification.close();
    const targetURL = event.notification.data.url || 'index.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (const client of clientList) {
                if (client.url.includes(targetURL) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetURL);
            }
        })
    );
});

// --- 6. PERIODIC SYNC: Background Logic ---
self.addEventListener('periodicsync', event => {
    if (event.tag === STUDY_TAG) {
        event.waitUntil(runBackgroundReminderLogic());
    }
});

async function runBackgroundReminderLogic() {
    // Logic to check IndexedDB and fire notification would go here
    // For now, we fire a generic reminder to prove it works
    const now = new Date();
    return showLocalNotification({
        id: 'periodic-' + Date.now(),
        title: 'Daily Study Plan',
        body: 'Don\'t forget to check your timetable for today!',
        timeISO: now.toISOString()
    });
}
