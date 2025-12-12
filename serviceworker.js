// serviceworker.js

// --- CONFIGURATION ---
const CACHE_NAME = 'study-tracker-v1';
const CACHE_EXTERNAL_NAME = 'external-assets-cache-v1'; 
const STUDY_TAG = 'Dairy-Study-Remainder';


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
        }).then(() => self.clients.claim()) 
    );
});

// --- 3. FETCH: Cache First Strategy with External Handling ---
self.addEventListener('fetch', function(event) {
    // Only intercept HTTP/S requests (ignore chrome-extension://, etc.)
    if (!event.request.url.startsWith('https')) return;

    const requestUrl = new URL(event.request.url);

    
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
        return; 
    }

    
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
            }).catch(function() {
                
            });
        })
    );
});


self.addEventListener('message', event => {
    const { type, payload } = event.data || {};
    if (type === 'SHOW_NOTIFICATION') {
        showLocalNotification(payload);
    }
});

function showLocalNotification(rem) {
    const title = rem.title || 'Study Reminder';
    console.log(rem)
    const options = {
        body: rem.body || 'Solve MAths everday',
        tag: rem.tag,
        renotify: true,
        data: { id: rem.id, timeISO: rem.timeISO }, 
        icon: '/icon-192.png',
        badge: '/icon-520.png'
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


async function runBackgroundReminderLogic() {
   
}

 window.addEventListener('load', async function () {
            try {
                await initDB();

                // Load User Data
                await loadData('labstudyTrackerData', 'onload');

                
                

               
                day = 1000 * 60 * 60 * 24;
                if (userStudyData.userInfo && userStudyData.userInfo.length > 0) {
                    const user_plan = userStudyData.userInfo[0];
                    daysPassed = Math.abs(parseInt((new Date(today).getTime() - user_plan.fMEdate[0]) / day) - 1);
                    
                    const dateDate = user_plan.fMEdate;
                    now = Date.now();
                    const daysToGo = Math.abs(parseInt((new Date(today).getTime() - dateDate[2]) / day));
                    
                    if (!(dateDate[1] < now && dateDate[2] > now)) {
                        showMessage('Account deactivated. Please renew subscription.', 'error', 5);
                        showLocalNotification({ id: 'r' + Date.now(), title: 'Study Tracker', body: 'Account deactivated.' });
                        await saveData('labstudyTrackerData',{})
                    } else if (daysToGo <= 5) {
                        showMessage(`Only ${daysToGo} days remaining. Sync online to backup data.`, 'warning', 5);
                    }

                    
                }

                

            } catch (e) {
               
            }
        });
