// serviceworker.js

const CACHE_NAME = 'study-tracker-v1';
const study_Tag = 'Dairy-Study-Remainder';

// List of files to cache for offline access.
// Add any other CSS/JS files or font files you use here.
// serviceworker.js

// Update these paths to include the repository name
const OFFLINE_URLS = [
    '/study-tracker-pwa/', // Base path entry for the start URL
    '/study-tracker-pwa/Home.html',
    '/study-tracker-pwa/index.html',
    '/study-tracker-pwa/js/app.js',
    '/study-tracker-pwa/manifest.json',
    '/study-tracker-pwa/icon-192.png',
    '/study-tracker-pwa/icon-512.png',
];


// --- 1. INSTALLATION: Cache the necessary files ---
self.addEventListener('install', function(event) {
    console.log('[Service Worker] Install Event: Caching assets.');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('[Service Worker] Pre-caching all app shells.');
                return cache.addAll(OFFLINE_URLS);
            })
    );
});

// --- 2. ACTIVATION: Clean up old caches ---
self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activate Event: Clearing old caches.');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// --- 3. FETCH: Serve files from cache first, then fall back to network ---
self.addEventListener('fetch', function(event) {
    // Only intercept HTTP/S requests
    if (event.request.url.startsWith('http')) {
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    // No cache match - fetch from network
                    return fetch(event.request);
                })
        );
    }
});

// --- 4. PERIODIC BACKGROUND SYNC: The Offline/Background Reminder Logic ---

// This listener is woken up by the browser when a registered periodic sync is due.
self.addEventListener('periodicsync', function(event) {
    if (event.tag === study_Tag) {
        console.log(`[Service Worker] Periodic Sync Fired for: ${study_Tag}`);
        
        // This ensures the worker stays alive until the reminder is displayed.
        event.waitUntil(checkAndDisplayReminder());
    }
});

// Reminder Logic Implementation
function checkAndDisplayReminder() {
    const today = new Date().toDateString();

    // Check IndexedDB to prevent showing the reminder multiple times today.
    // **NOTE:** You must implement the IndexedDB code on the client side (app.js)
    // to store the study timetable and the last check date.
    
    // PSEUDO CODE: In a real app, you would fetch today's plan from IndexedDB/localStorage.
    // For this example, we show a generic reminder.
    
    const reminderTitle = 'Your Daily Study Plan 📚';
    
    // You can pull the study plan for the current day from the "Timetable" section
    // of your 'index.html' file and store it in IndexedDB when the user is online.
    const studyPlanBody = 'Review your Calculus notes and work on the English Composition.';
    
    const options = {
        body: studyPlanBody,
        icon: '/study-tracker-pwa/icon-192.png', // CRITICAL: Update this
        badge: '/study-tracker-pwa/icon-192.png', // CRITICAL: Update this
        data: {
            url: '/index.html#timetable', // Go directly to the timetable tab
            date: today
        },
        actions: [
            { action: 'open_plan', title: 'Open Timetable' },
            { action: 'snooze', title: 'Snooze (1h)' }
        ]
    };
    
    // Display the notification to the user's phone's native notification center
    return self.registration.showNotification(reminderTitle, options)
        .then(() => {
            // PSEUDO CODE: Update IndexedDB with today's date so it doesn't fire again
            // putInIndexedDB('lastReminderDate', today); 
        })
        .catch(error => {
            console.error('[Service Worker] Failed to display notification:', error);
        });
}


// --- PSEUDO-CODE FOR INDEXEDDB IN app.js ---

const DB_NAME = 'StudyDataDB';
const DB_VERSION = 1;
const STORE_NAME = 'Timetable';

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onupgradeneeded = function(e) {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };

        request.onsuccess = function(e) {
            resolve(e.target.result);
        };

        request.onerror = function(e) {
            reject('Database error: ' + e.target.error.name);
        };
    });
}

// Function to save the daily study plan when the user is online
async function saveStudyPlan(day, taskList) {
    const db = await openDatabase();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Store data structure: {id: "Monday", tasks: ["Review A", "Solve B"]}
    store.put({ id: day, tasks: taskList }); 
}

// Example of how you would call this in your app.js (when the timetable tab is loaded):
// const mondayTasks = ['Review this week class exercises', 'Your style']; 
// saveStudyPlan('Monday', mondayTasks);

// --- 5. NOTIFICATION CLICK: Handling user interaction with the notification ---

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click received.');

    event.notification.close();
    const targetURL = event.notification.data.url || '/index.html';

    event.waitUntil(
        clients.matchAll({ type: 'window' })
        .then(function(clientList) {
            // Look for an existing app window and focus it
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url.includes(targetURL) && 'focus' in client) {
                    return client.focus();
                }
            }
            // If no existing window, open a new one to the target URL
            if (clients.openWindow) {
                return clients.openWindow(targetURL);
            }
        })
    );
});



