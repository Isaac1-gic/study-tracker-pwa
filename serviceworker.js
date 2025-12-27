const CACHE_NAME = 'study-tracker-v4';
const CACHE_EXTERNAL_NAME = 'external-assets-cache-v3';
const STUDY_TAG = 'Daily-Study-Reminder';

const OFFLINE_URLS = [
  './',
  'index.html',
  'js/app.js',
  'style.css',
  'manifest.json',
  'icon-192.png',
  'icon1-512.png',
  'data.js',
  'all.min.css'
];

const EXTERNAL_HOSTS = [
  'cdn.tailwindcss.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

// --- 1. INSTALL: Force caching of all critical files ---
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Use addAll for reliability; it ensures all core files are stored
      return cache.addAll(OFFLINE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// --- 2. ACTIVATE: Clean old caches ---
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => (k !== CACHE_NAME && k !== CACHE_EXTERNAL_NAME) ? caches.delete(k) : null)
    )).then(() => self.clients.claim())
  );
});

// --- 3. FETCH: THE OFFLINE-FIRST STRATEGY (CRITICAL FIX) ---
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 1. Return from cache if found
      if (cachedResponse) return cachedResponse;

      // 2. If not in cache, try network
      return fetch(event.request).then(networkResponse => {
        // Cache external assets (Tailwind/Fonts) on the fly
        if (EXTERNAL_HOSTS.includes(url.hostname)) {
          return caches.open(CACHE_EXTERNAL_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      }).catch(() => {
       
        if (event.request.mode === 'navigate') {
          return caches.match('index.html') || caches.match('./');
        }
      });
    })
  );
});




self.addEventListener('sync', event => {
  if (event.tag === 'study-sync') {
    event.waitUntil(runBackgroundSync());
  }
});


async function runBackgroundSync() {
  userStudyData = {}
        db = null;
        requestURL = 'https://script.google.com/macros/s/AKfycbzIt9LUD3EXJbgSsPPMCVhmT-QN8DtX_HVENtE8cpxjztTHzK1fLA_LJKeC0yWENY82/exec';
        let requesting = 'GO';

        await asyncinitDB();
        await asyncloadData('labstudyTrackerData','onload');

        async function asyncsessionSave (){
                try{
                    const number_Of_Off_s = userStudyData.sessions.length;
                    if (number_Of_Off_s > 0){
                    
                        const number_Of_Clo_s = await asyncHTTPSrequest('sessionsSave',{
                            number_Of_Off_s: number_Of_Off_s,
                            tacks: 'number_Of_Clo_s'});
                            
                       
                        if(number_Of_Clo_s[1] < number_Of_Off_s && number_Of_Clo_s.length === 2){
                            let i = 1;
                            let sessionsArry = [];
                            let subject_TIDsArray = [];
                            userStudyData.subjects.forEach(subject =>{
                                if(subject.id !== 1){
                                    subject_TIDsArray.push({
                                        id: subject.id,
                                        completedHours: subject.completedHours,
                                    })
                                }else{
                                    subject_TIDsArray.push({
                                        id: subject.id,
                                        quesNumSolved: subject.quesNumSolved,
                                    });
                                };
                            });
                            for(const session of userStudyData.sessions){
                                if (i > number_Of_Clo_s[1]){
                                    sessionsArry.push(session);
                                }
                                i += 1;
                            };
                            if (sessionsArry.length > 0){
                            const sessionsToSave = JSON.stringify(sessionsArry);
                            const quizSessionUpdate = JSON.stringify(await asynccloudQuizSave());
                            const topicsToUpdate = JSON.stringify([subject_TIDsArray,asyncprocessesStudiedSessions()])
                            const is_saved = await asyncHTTPSrequest('sessionsSave',{
                                        tacks: sessionsToSave,
                                        tacks2: topicsToUpdate,
                                        tacks3: quizSessionUpdate
                                        });
                            
                            if(is_saved[1] === 'Session batch saved successfully.'){
                                userStudyData.studied = [];
                               
                                await asyncsaveData('labstudyTrackerData',userStudyData);
                                await asyncsaveData('QuizRates',[])
                            }
                                    
                                    }
                        }
                        else if (number_Of_Clo_s.length > 2){
                            //userStudyData.sessions.length = 0
                            number_Of_Clo_s[2].forEach(session =>{
                                userStudyData.sessions.unshift(session);
                            })
                            await asyncsaveData('labstudyTrackerData',userStudyData)
                        }
                    }
                }catch (e){
                    
                };

                async function asynccloudQuizSave() {
                    const quizRateArray = await asyncloadData('QuizRates') ?? [];
                    
                    return quizRateArray;
                };

                function asyncprocessesStudiedSessions(){
                    try{
                        const studiedDict = {}
                        userStudyData.studied.forEach(Element =>{
                            if (!studiedDict[Element[0]]){
                                studiedDict[Element[0]] = [];
                                studiedDict[Element[0]].push(Element[1]);
                            }else{
                                studiedDict[Element[0]].push(Element[1]) 
                            }
                        })
                        
                        return studiedDict;
                        }catch (error){
                            
                        }
                };

                async function asyncHTTPSrequest(action, params = {}, elementId){
                
                    if(requesting !== 'GO') {
                        
                        
                        return null;
                    
                    }

                    let payload = {
                    action: action 
                    };

                    
                    if(!(elementId === 'NOT')){
                    payload.user_ID = userStudyData.userInfo[0].userId;
                        payload.trust = userStudyData.userInfo[0].approved.toString();
                    };
                    
                    for(const key in params){
                    if(params.hasOwnProperty(key)){
                        payload[key] = params[key];
                    }
                    }

                        try{
                         
                          const response = await fetch(requestURL,{
                            method: 'POST', 
                            headers: {
                                'Content-Type': 'text/plain;charset=utf-8'
                            },
                            
                            body: JSON.stringify(payload) 
                          }); 


                    if(!response.ok){
                        return null;
                    }
                    const pureResponse = await response.json();
                    
                        
                    if(pureResponse[0] === false){
                        userStudyData = {};
                        await asyncsaveData('labstudyTrackerData',userStudyData);
                        
                    }
                    
                        if (pureResponse[1][1] === 'STOP'){
                            requesting = 'STOP';
                            await asyncsaveData('STOP',Date.now())
                        }


                        if ((pureResponse[1][0] !== requestURL && pureResponse[1][0].slice(0,35) === requestURL.slice(0,35))) {
                            
                            await asyncsaveData('URL',pureResponse[1][0]);
                            requestURL = pureResponse[1][0];
                            
                            
                        }

                        return pureResponse[0];
                    }catch (error) {
                        return null;
                    }
                        
                    
                }
            };

            function asyncinitDB() {
              return new Promise((resolve, reject) => {
                const openReq = indexedDB.open('StudyTrackerDB', 2);
                openReq.onupgradeneeded = e => {
                  db = e.target.result;
                  if (!db.objectStoreNames.contains('Data')) db.createObjectStore('Data');
                };
                openReq.onsuccess = e => {
                  db = e.target.result;
                 
                  resolve(db);
                };
                openReq.onerror = e => reject(e);
              });
            }

            
            function asyncloadData(KEY, onloadFlag) {
              return new Promise((resolve, reject) => {
                if (!db) return reject(new Error('DB not initialized'));
                const tx = db.transaction('Data', 'readonly');
                const store = tx.objectStore('Data');
                const req = store.get(KEY);
                req.onsuccess = e => {
                  const val = (e.target.result === undefined) ? null : e.target.result;
                  if (onloadFlag === 'onload') {
                    
                    userStudyData = val; 
                    
                  }
                  resolve(val);
                };
                req.onerror = e => reject(e.target.error || e);
              });
            }

            
            function asyncsaveData(KEY, dataToSave) {
              return new Promise((resolve, reject) => {
                if (!db) return reject(new Error('DB not initialized'));
                const tx = db.transaction('Data', 'readwrite');
                const store = tx.objectStore('Data');
                const req = store.put(dataToSave, KEY);
                req.onsuccess = () => resolve();
                req.onerror = e => reject(e.target.error || e);
              });
            }
}



self.addEventListener('message', event => {
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    showLocalNotification(event.data.payload);
  }
});

function showLocalNotification(data) {
  self.registration.showNotification(
    data.title || 'Study Tracker',
    {
      body: data.body || 'Reminder',
      tag: data.id || 'study',
      renotify: true,
      icon: 'icon1-512.png' || 'icon-192.png',
      badge: 'icon-192.png' || 'icon1-512.png',
      data: { url: './' }
    }
  );
}

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});


self.addEventListener('periodicsync', event => {
  if (event.tag === STUDY_TAG) {
    event.waitUntil(
      showLocalNotification({
        title: 'Daily Study Plan',
        body: 'Check your timetable'
      })
    );
  }
});
