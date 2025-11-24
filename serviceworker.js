const CACHE_NAME = 'study-tracker-v5';
const study_Tag = 'Dairy-Study-Remainder';

// CRITICAL: All paths must include the repository name for GitHub Pages
const OFFLINE_URLS = [
    '/study-tracker-pwa/', // Base path entry for the start URL
    '/study-tracker-pwa/index.html',
    '/study-tracker-pwa/js/app.js',
    '/study-tracker-pwa/manifest.json',
    '/study-tracker-pwa/icon-192.png',
    '/study-tracker-pwa/icon1-512.png'
];


// --- 1. INSTALLATION: Cache the necessary files ---
self.addEventListener('install', function(event) {
    console.log('[Service Worker] Install Event: Starting caching process.');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('[Service Worker] Attempting to pre-cache all required assets.');
                return cache.addAll(OFFLINE_URLS)
                    .then(() => {
                        console.log('[Service Worker] All assets successfully cached.');
                    })
                    .catch(error => {
                        console.error('[Service Worker] Cache addition failed. Check for 404s in OFFLINE_URLS:', error);
                        // A single 404 here will cause the installation to fail silently!
                    });
            })
    );
});

// --- 2. ACTIVATION: Clean up old caches ---
self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activate Event: Cleaning up old caches.');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            ).then(() => {
                console.log('[Service Worker] Activation complete. Ready to handle fetch requests.');
            });
        })
    );
});

// --- 3. FETCH: Serve files from cache first, then fall back to network ---
self.addEventListener('fetch', function(event) {
    // Only intercept HTTP/S requests, ignoring devtools/extensions
    if (event.request.url.startsWith('http')) {
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {
                    if (response) {
                        // console.log('[Service Worker] Serving from cache:', event.request.url);
                        return response; // Cache hit - return response
                    }
                    // console.log('[Service Worker] Fetching from network:', event.request.url);
                    return fetch(event.request); // No cache match - fetch from network
                })
        );
    }
});

// --- 4. PERIODIC BACKGROUND SYNC: The Offline/Background Reminder Logic ---
self.addEventListener('periodicsync', function(event) {
    if (event.tag === study_Tag) {
        console.log(`[Service Worker] Periodic Sync Fired for tag: ${study_Tag}`);
        event.waitUntil(checkAndDisplayReminder());
    }
});

function checkAndDisplayReminder() {
    console.log('[Service Worker] Attempting to show study reminder notification.');
    const today = new Date().toDateString();
    
    const reminderTitle = 'Your Daily Study Plan 📚';
    const studyPlanBody = 'Review your Calculus notes and work on the English Composition.';
    
    const options = {
        body: studyPlanBody,
        // CRITICAL: Notification icons MUST use the absolute path
        icon: '/study-tracker-pwa/icon-192.png', 
        badge: '/study-tracker-pwa/icon-192.png', 
        data: {
            url: '/study-tracker-pwa/index.html#timetable', 
            date: today
        },
        actions: [
            { action: 'open_plan', title: 'Open Timetable' },
            { action: 'snooze', title: 'Snooze (1h)' }
        ]
    };
    
    return self.registration.showNotification(reminderTitle, options)
        .catch(error => {
            console.error('[Service Worker] Failed to display notification:', error);
        });
}


// --- 5. NOTIFICATION CLICK: Handling user interaction with the notification ---
self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click received. Action:', event.action);
    event.notification.close();
    // Default URL must also be absolute for GitHub Pages
    const targetURL = event.notification.data.url || '/study-tracker-pwa/index.html';

    event.waitUntil(
        clients.matchAll({ type: 'window' })
        .then(function(clientList) {
            // ... (focus existing window logic) ...
            if (clients.openWindow) {
                return clients.openWindow(targetURL);
            }
        })
    );
});









