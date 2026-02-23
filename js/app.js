//THE DOM ELEMENTS
document.getElementById('togM').addEventListener('click',()=>{
    toggleMenu();
})

document.getElementById('forP').addEventListener('click',()=>{
    document.getElementById('login').classList.remove('active');
    document.getElementById('reLogin').classList.add('active');
})

document.getElementById('creaA').addEventListener('click',()=>{
    document.getElementById('login').classList.remove('active');
    startRedirect_SignIn();
})

document.getElementById('studySubject').addEventListener('focus',()=>{
   document.getElementById('MissedTopic').style.display = 'block'; 
   document.getElementById('myowntopic').style.display = 'block';
})

document.getElementById('missedT').addEventListener('focus',()=>{
  updateMissedStudyTopicDropdown();  
})

document.getElementById('studyDate').addEventListener('click',()=>{
    document.getElementById('studyDate').max = today;    
})

document.getElementById('myowntopic').addEventListener('focus',()=>{
    updateStudyTopicDropdown();
})

document.getElementById('swiH').addEventListener('click',()=>{
    switchTab('track')
})

document.getElementById('swiP').addEventListener('click',()=>{
    switchTab('progress');
})

document.getElementById('swiR').addEventListener('click',()=>{
    switchTab('review');
})

document.getElementById('swiW').addEventListener('click',()=>{
    switchTab('report');
})

document.getElementById('swiC').addEventListener('click',()=>{
    switchTab('group');
})

document.getElementById('swiG').addEventListener('click',()=>{
    switchTab('gic');
})

document.getElementById('swiU').addEventListener('click',()=>{
    switchTab('profile');
})

document.getElementById('swiA').addEventListener('click',()=>{
    switchTab('about');
})

document.getElementById('insT').addEventListener('click',()=>{
    installApp();
})
        
        
        let db = null;
        let daysPassed;
        let scrolled;
        let hoursExpected;
        let todaySubjectReminders = [];
        const today = new Date().toISOString().split('T')[0];
        let requestURL = 'https://script.google.com/macros/s/AKfycbxp11rUqcpJotJ9ne1xJmeGS1ClWhWCYyyhwkNcyp7RGyZkpo284PM6WsEg7XWjg6AL/exec';
        const ThisWeekMonday = lastMonday();
        const todaycheck = new Date().toISOString().split('T')[0];
        const forgotForm = document.getElementById('reLoginForm');
        const loginForm = document.getElementById('loginForm');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        let requesting = 'GO';            
        let userStudyData = {};
            



        let labChatsData = {
                        chats: [],
                        AIchats: [],
                        IDs: []
                    };

        let quizData = {
                            sessionTopic: [],
                            quizQuestions: [
                                {},
                                {},
                                {},
                                {},
                                {}
                                ]
                            };
        let thisWeekReport = {title: '',
                                        intro: '',
                                        body: '',
                                        conclunsion: '',
                                        yTubeQuery: [],
                                        date: 1763802160057
                            };
        let quotesAndSayings = [];
        let topics = {};
        let studyTopics = {};
        let subjectnames = {};
        let pathLink = labChatsData.chats;
        let timeStamp = Date.now();
		let SPACE_TIME = 5000;
        let deferredInstallPrompt = null;
		let installAsked = false;
	let NextMsg = 0
    let App_Locked;    
    const TARGET_SHARES = 10; 
    const MIN_TIME_SECONDS = 30; // Time user must spend "sharing" to count
    const PAGE_URL = "https://msce-g-tracker.netlify.app";
    let linkedID = 'Jamkaxqxw5';
    let sharesCount = parseInt(localStorage.getItem('myShareCount')) || 0;
    let lastClickTime = parseInt(localStorage.getItem('lastClickTime')) || 0;
    const lock = document.getElementById('locker-interface')
        
        
window.addEventListener('beforeinstallprompt', (e) => {    
	e.preventDefault();            
    deferredInstallPrompt = e;        
    maybeShowInstall();                 
});

function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone === true;
}

function maybeShowInstall() {
    if (isStandalone()) return;
    if (!deferredInstallPrompt) return;   
    if (installAsked) return;                    

    installAsked = true;
    document.getElementById('install-banner').style.display = 'block';
    setTimeout(() =>{
		 document.getElementById('install-banner').style.display = 'none'; }
    ,10000)
}


async function installApp() {
    if (!deferredInstallPrompt) return;

    deferredInstallPrompt.prompt(); 
    await deferredInstallPrompt.userChoice; 

    deferredInstallPrompt = null;
    document.getElementById('install-banner').style.display = 'none';
}

        
        
		


	 


function toggleMenu() {
    const menu = document.getElementById("menu");
    if(menu) menu.classList.toggle("active");
}
       
        
		
function startRedirect_SignIn() {
    const frame = document.getElementById("appFrame");
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    frame.classList.add('active');
    showMessage(`Please wait while loading form.`,'success')
    frame.src = "https://script.google.com/macros/s/AKfycby8ZckL482mclfpL8JbbCB8czNK_YkAg1pxSYQHScNx_50sMg8JlKZpEI79xgP4_itE/exec"; 
    document.getElementById("backToLogin").style.display = 'block';
}
           
            
            
			function splitTextForWaveEffect(selector) {
				
				const index = Math.random();
				const selectedQuote = quotesAndSayings[Math.floor(index*3)][Math.floor(index*100)]
				
				
				showMessage(selectedQuote,'sucess',10);
				
				const element = document.querySelector(selector);
				if (!element) return;
				
				const text = element.textContent;
				let newHTML = '';

				for (let i = 0; i < text.length; i++) {
					const char = text[i];
					if (char !== ' ') {
						
						newHTML += `<span class="wavy-letter" style="animation-delay: ${i * 0.05}s;">${char}</span>`;
					} else {
						newHTML += ' ';
					}
				}
				element.innerHTML = newHTML;
				
			}

            
           async function HTTPSrequest(action, params = {}, elementId){
                
				if(requesting !== 'GO') {
                    setTimeout(() =>{
                        showMessage(`You've reached your request Limit for today`,'error'
                       
                    )},20000)
                    
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
					await saveData('labstudyTrackerData',userStudyData);
					
				  }
                  console.log(pureResponse)
                    if (pureResponse[1][1] === 'STOP'){
                        requesting = 'STOP';
                        await saveData('STOP',Date.now())
                    }


					if ((pureResponse[1][0] !== requestURL && pureResponse[1][0].slice(0,35) === requestURL.slice(0,35))) {
						
						await saveData('URL',pureResponse[1][0]);
                        requestURL = pureResponse[1][0];
                        
						
					}

					return pureResponse[0];
				}catch (error) {
					return null;
				}
                     
                
			}
			
			async function loadPieChart(charts) {
				
				
				i = 0
				charts.forEach(chartDataUrl =>{
                    if (i ===0){
                        imgElement = document.getElementById('lineChartImage');
                    }else{
                        imgElement = document.getElementById('pieChartImage');
                    }
				if (typeof chartDataUrl === 'string' && chartDataUrl.startsWith('ERROR:')) {
					
					
					imgElement.alt = chartDataUrl; 
					showMessage('Chart unavailable. ', 'error');
					imgElement.style.display = 'none';
					return;
				}
				
				if (typeof chartDataUrl === 'string' && chartDataUrl.startsWith('data:image/png;base64,')) {
					// Set the Base64 Data URL as the image source
					imgElement.src = chartDataUrl;
					imgElement.style.display = 'block';
					
                    i += 1
				}
			})
			}

            async function cloudQuizSave(sessionID_Rate={}) {
                const quizRateArray = await loadData('QuizRates') ?? [];
                if(sessionID_Rate.id){
                    quizRateArray.push(sessionID_Rate);
                    await saveData('QuizRates',quizRateArray);
                }
                return quizRateArray;
            }
            



async function quizMaker(action) {
    const dropdown = document.getElementById('promptST');
    const textArea = document.getElementById('textprompt-ai');
    
    textArea.style.display = 'none';
    dropdown.style.display = 'block';

    if (action !== 'submit') {
        dropdown.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.textContent = "Select a previous session topic";
        placeholder.value = '';
        placeholder.disabled = true;
        placeholder.selected = true;
        dropdown.appendChild(placeholder);

        // Populate dropdown with past sessions
        userStudyData.sessions.slice().reverse().forEach(session => {
            const option = document.createElement('option');
            option.value = session.id;
            option.textContent = `${session.topic || 'No Topic'} (${session.date})`;
            
            
            quizData.sessionTopic.push({id: session.id, topic: session.topic, notes: session.notes}); 
            dropdown.appendChild(option);
        });
    } else {
        let selectedId = dropdown.value;
        if(!selectedId) showMessage('Please Select Quiz topic','error')
        const sessionMeta = quizData.sessionTopic.find(s => String(s.id) === String(selectedId));
        
        if (sessionMeta) {
            quizData.sessionTopic = [sessionMeta.id,sessionMeta.topic,sessionMeta.notes]
            const makeQuiz = await HTTPSrequest('makeQuiz', {
                topic: `${sessionMeta.topic}. ${sessionMeta.notes}`
            });
		selectedId = '';
            if (makeQuiz && makeQuiz[0]) {
                quizData.quizQuestions = makeQuiz[1];
                quiz('start',sessionMeta.topic);
            } else {
                showMessage("Failed to generate quiz. Try again.", 'error');
            }
        }
    }
}


function quiz(action,title) {
    
    document.getElementById('prompt-container-ai').style.display = 'none';
    
    const chatContainer = document.getElementById('AIchatsList');
    chatContainer.innerHTML = '';

    const quizContainer = document.createElement('form');
    quizContainer.id = 'quizForm';
    
    if(action !== 'answears'){
		const header = document.createElement('header');
		header.textContent = title+" Quiz Time!";
		quizContainer.appendChild(header);
	}

    let i = 1;
    quizData.quizQuestions.forEach(question => {
        const qBlock = document.createElement('div');
        qBlock.className = 'study-card'; 
        qBlock.style.background = '#fff';
        
        const qText = document.createElement('strong');
        qText.textContent = `${i}. ${question.question}`;
        qBlock.appendChild(qText);

        if (action !== 'answears') {
            const selection = document.createElement('select');
            selection.id = 'question' + i;
            selection.className = 'quiz-select';
            selection.required = true;

            const defOpt = document.createElement('option');
            defOpt.text = 'Select Answer';
            defOpt.value = '';
            defOpt.disabled = true;
            defOpt.selected = true;
            selection.add(defOpt);

            ['A', 'B', 'C', 'D'].forEach(opt => {
                if(question[opt]) {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = `${opt}. ${question[opt]}`;
                    selection.appendChild(option);
                }
            });
            qBlock.appendChild(selection);
        } else {
            // Show Answers
            const ansP = document.createElement('p');
            ansP.style.color = 'green';
            ansP.textContent = `✅ Correct: ${question.answear} - ${question[question.answear]}`;
            qBlock.appendChild(ansP);
        }
        quizContainer.appendChild(qBlock);
        i++;
    });

    if (action !== 'answears') {
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.textContent = "Submit Quiz";
        submitBtn.className = "login-btn"; // reuse style
        quizContainer.appendChild(submitBtn);
    } else {
        // Restore AI Interface
        document.getElementById('prompt-container-ai').style.display = 'block';
    }

    chatContainer.appendChild(quizContainer);

    if (action !== 'answears') {
        document.getElementById('quizForm').addEventListener('submit', function (e) {
            e.preventDefault();
            quizAdmin();
        });
    }
}


async function quizAdmin(){
                i = 1
                let totalmarks = 0;
                quizData.quizQuestions.forEach(quizQuestion =>{
                    const studentChoise = String(document.getElementById('question'+i).value.trim('.')[0]);
                    if (studentChoise === String(quizQuestion.answear)) {
                       
                       totalmarks += 2;
                    }
                    else{
                   
                    }
                    i +=1
                })
                document.getElementById('AIchatsList').innerHTML = ``;
                const Quizresultscont = document.getElementById('Quizresultscont');
                const adminfeedback = document.createElement('label')
                
                const overallRate = (totalmarks / 10) * 100;
                for (session of userStudyData.sessions){ 
                
                    if(String(session.id) === String(quizData.sessionTopic[0])){
						if (totalmarks > 0){
							const stars = Math.floor(totalmarks / 2); 	
							session.rate = '⭐'.repeat(stars);
							await cloudQuizSave({id: session.id,rate: session.rate});
                            await saveData('labstudyTrackerData',userStudyData);
						};
                        
                       
                    }
                };
                if (overallRate > 50) {
                    Quizresultscont.style = 'display: block;background-color: green;';
                    adminfeedback.textContent = `🏆NICE!!`
                }
                else{
                    Quizresultscont.style = 'display: block;background-color: red;';
                    adminfeedback.textContent = `🥇Review this topic before days.`
                }
                const Quizresults = document.getElementById('Quizresults');
                Quizresults.textContent = overallRate.toFixed(1) + '%';
                Quizresultscont.appendChild(adminfeedback)
                quiz('answears')
                
           
            }





function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}


            async function sessionSave (){
                try{
                    const number_Of_Off_s = userStudyData.sessions.length;
                    if (number_Of_Off_s > 0){
                    
                        const number_Of_Clo_s = await HTTPSrequest('sessionsSave',{
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
                            const quizSessionUpdate = JSON.stringify(await cloudQuizSave());
                            const topicsToUpdate = JSON.stringify([subject_TIDsArray,processesStudiedSessions()])
                            const is_saved = await HTTPSrequest('sessionsSave',{
                                        tacks: sessionsToSave,
                                        tacks2: topicsToUpdate,
                                        tacks3: quizSessionUpdate
                                        });
                            
                            if(is_saved[1] === 'Session batch saved successfully.'){
                                userStudyData.studied = [];
                               
                                await saveData('labstudyTrackerData',userStudyData);
                                await saveData('QuizRates',[])
                                setTimeout(() =>{
                                    showMessage('Data sync done','success');
                                },20000)
                            }
                                    
                                    }
                        }
                        else if (number_Of_Clo_s.length > 2){
                            //userStudyData.sessions.length = 0
                            number_Of_Clo_s[2].forEach(session =>{
                                userStudyData.sessions.unshift(session);
                            })
                            await saveData('labstudyTrackerData',userStudyData);
                            setTimeout(() =>{
                                    showMessage('Data sync done','success');
                                },20000); 
                        }


                    }
                }catch (e){
                    const reg = await navigator.serviceWorker.ready;
                    await reg.sync.register('study-sync')
                }
            }

function AIchatbox() {
    const chatContainer = document.getElementById('AIchatsList');
    chatContainer.innerHTML = '';


    const recentChatsSorted = [labChatsData.AIchats].sort((a, b) => new Date(b.chatId) - new Date(a.chatId)).slice(0, 25);
    
    labChatsData.AIchats.forEach(chat => {
        const sessionDiv = document.createElement('div');
        const time = new Date(chat.chatId).toLocaleTimeString();
        const me = (chat.senderId === userStudyData.userInfo[0].username);

        if (!me) {
            sessionDiv.className = 'message chat-card';
            const h4 = document.createElement('h4');
            h4.textContent = `${chat.senderId}    ${time}`;
            sessionDiv.appendChild(h4);

            
            if (Array.isArray(chat.prompt)) {
                chat.prompt.forEach(line => {
                    const p = document.createElement('p');
                    p.textContent = line;
                    sessionDiv.appendChild(p);
                });
            } else {
                const p = document.createElement('p');
                p.textContent = chat.prompt;
                sessionDiv.appendChild(p);
            }
        } else {
            sessionDiv.className = 'message mychat-card';
            const h4 = document.createElement('h4');
            h4.textContent = `You    ${time}`;
            const p = document.createElement('p');
            p.textContent = chat.prompt;
            
            sessionDiv.appendChild(h4);
            sessionDiv.appendChild(p);
        }
        chatContainer.appendChild(sessionDiv);
    });
}            

            

async function promptSwitch(kind = String) {
                const textarea = document.getElementById('textprompt-'+kind);
                
                const sendButton = document.getElementById('send-button-'+kind);
                let newMode;
                const modeButton = document.getElementById('mode-button');
                const modeDropdown = document.getElementById('mode-dropdown');
                const currentModeDisplay = document.getElementById('current-mode-'+kind);
                const HEADER_REMOVE = document.getElementById('headerR-'+kind);
                loading = document.getElementById('loading-'+kind);
                
                 // Toggle dropdown
				modeButton.addEventListener('click', (e) => {
				  e.stopPropagation();
				  
				  modeDropdown.style.display = 'block' 
				});
				 // Select mode
				modeDropdown.querySelectorAll('[data-mode]').forEach(el => {
				  el.addEventListener('click', () => {
					
					const m = el.getAttribute('data-mode');
					currentModeDisplay.textContent = m;
					modeDropdown.style.display = 'none';
				  });
				});

				// Close dropdown on outside click
				document.getElementById("prompt-container-ai").addEventListener('click', () => modeDropdown.style.display = 'none');
			
                
                // --- 1. Textarea Auto-Resize and Send Button Toggle ---

                // Function to resize the textarea height dynamically
                const resizeTextarea = () => {
                    // Reset height to collapse the scrollbar before calculation
                    textarea.style.height = 'auto';
                    
                    // Set the new height, clamped to a max height (15rem)
                    const newHeight = Math.min(textarea.scrollHeight, 15 * 16); // 15rem * 16px/rem
                    textarea.style.height = `${newHeight}px`;

                    // Enable/Disable Send button based on content
                    let isEmpty = textarea.value.trim().length === 0;
                    
                    if(currentModeDisplay.textContent === 'Quiz'){
						isEmpty = false;
						
					}
                    sendButton.disabled = isEmpty;

                    // Change button color based on state
                    if (isEmpty) {
                        sendButton.classList.remove('bg-[#8ab4f8]', 'text-white');
                        sendButton.classList.add('bg-[#343436]', 'text-[#7e7e7e]', 'opacity-50');
                    } else {
                        sendButton.classList.remove('bg-[#343436]', 'text-[#7e7e7e]', 'opacity-50');
                        sendButton.classList.add('bg-[#8ab4f8]', 'text-white');
                    }
                };

                // Attach event listener for input and change
                textarea.addEventListener('input', resizeTextarea);

                // --- 2. Mode Dropdown Interaction ---

                // Toggle dropdown visibility
                modeButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent the document listener from immediately closing it
                    const isVisible = modeDropdown.classList.toggle('opacity-0');
                    modeDropdown.classList.toggle('pointer-events-none');
                });

                // Handle mode selection from dropdown
                modeDropdown.addEventListener('click',  (e) => {
                    const modeElement = e.target;
                    if (modeElement.dataset.mode) {
                        newMode = modeElement.dataset.mode;
                        
                        // 1. Update the display label
                        currentModeDisplay.textContent = newMode;
                        
                        // 2. Hide the dropdown
                        modeDropdown.classList.add('opacity-0', 'pointer-events-none');
                        
                        if(newMode === "Question"){
							textarea.style = 'display: block';
							document.getElementById('promptST').style = 'display: none';
							textarea.placeholder = "Ask GIC AI any school question";
							
                        }else{
							textarea.placeholder = `Just require only thinking!! Nice quiz`;
							quizMaker();
							
						}
                    }
                });

                // Close dropdown when clicking anywhere else
                document.addEventListener('click', () => {
                    modeDropdown.classList.add('opacity-0', 'pointer-events-none');
                });


                // --- 3. Action Handlers (Example) ---

                sendButton.addEventListener('click', async () => {
                    const promptText = textarea.value.trim();
                    const currentMode = currentModeDisplay.textContent;
					const space_T = Date.now()
                    if (space_T - SPACE_TIME > CHAT_POLLING_INTERVAL && (promptText || currentMode === 'Quiz')) {
						SPACE_TIME = space_T;
                        textarea.value = '';
                        loading.classList.add('rotate');
                        loading.style.display = 'block';
                        
                        try {
                            if (currentMode === 'Quiz') {
                                await quizMaker('submit');
                            } else if (currentMode === 'Question' || currentMode === 'Chat') {
                                await chatPrompt(promptText, kind);
                            }
                        } finally {
                            loading.classList.remove('rotate');
                            loading.style.display = 'none';
                            textarea.value = '';
                            textarea.style.height = 'auto';
                            HEADER_REMOVE.style.display = 'none';
                        }
                       
                        resizeTextarea(); 
                    }
                });

                
                textarea.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault(); 
                        sendButton.click(); 
                    }
                });

                // Initial resize/check on load
                resizeTextarea();
            

                
            }

function showMessage(message, type, time) {
    let messageWindow = document.getElementById('message')
    let duration = (time && time !== 'static') ? time * 1000 : 3000;
    const now = Date.now()
    setTimeout(() =>{
		messageWindow.style.display = 'block';
		if (type === 'error') {
			document.getElementById('error_messaget').textContent = message;
			errorMessage.style.display = 'block';
			successMessage.style.display = 'none';
		} else {
			const quoteP = document.getElementById('quoteDisplay');
			if (quoteP) {
				quoteP.textContent = message;
				if (type === 'warn') {
					successMessage.style.background = 'yellow';
					successMessage.style.color = 'red';
				}else{
					successMessage.style.background = 'skyblue';
					successMessage.style.color = 'white';
				}
				successMessage.style.display = 'block';
				errorMessage.style.display = 'none';
			}
			
		}

		NextMsg = now + duration + 1000
		if (time !== 'static' && duration) {
			setTimeout(() => {
				successMessage.style.display = 'none';
				errorMessage.style.display = 'none';
				messageWindow.style.display = 'none';
			}, duration);
		}
	},NextMsg > now ? NextMsg - now : 0);
	
}

function startChatPolling(){
    const hour = new Date().getHours();
    const day = new Date().getDay();
    if (!((hour >= 17 && hour < 20) || (day === 6 || day === 0)))return
	const chatPath = ref(database,'groupChats')
	onChildAdded(chatPath, (snapshot) =>{
		const message = snapshot.val();
		chatSave(message,pathLink,'chats');
		chatbox()
	})  
}

function stopChatPolling(){
   
	const chatPath = ref(database,'groupChats')
	off(chatPath)
}

async function getChats(){
    try{
    let chats //= await HTTPSrequest('chats',{task: 'task',timeStamp: timeStamp});
    
                if (chats && chats.length > 0){
					
					timeStamp = chats[0].timeStamp;
					chatSave(chats,pathLink,'chats');
                        chatbox()
					}
    } catch (e){}
}            

function chatSave(prompt, type, AI) {
    if (AI !== 'chats') {
        const sender = AI ? 'GIC AI' : userStudyData.userInfo[0].username;
        if(!type.includes(prompt)){
                type.push({
                chatId: Date.now(),
                senderId: sender,
                prompt: prompt 
            });
        }
    } else {
		
        
           if(!labChatsData.IDs.includes(prompt.chatId) ) {
			    type.push(prompt); 
				labChatsData.IDs.push(prompt.chatId);
          }
           
       
    }
}

async function chatPrompt(text, kind) {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    if (kind === "ai") {
        pathLink = labChatsData.AIchats;
        chatSave(text, pathLink, false); 
        try {
            const answear = await HTTPSrequest('askQuestion', { question: text }, kind);
            if (answear && answear[0]) {
                chatSave(answear[1], pathLink, true); 
                AIchatbox();
            }
        } catch (error) {
            showMessage("Failed to send. Please try again.",'error');
        }
    } else {
        try {
			
            if (!((hour >= 17 && hour < 20) || (day === 6 || day === 0))) return;
            const messageData = {
                chatId: Date.now(),
                senderId: userStudyData.userInfo[0].username,
                prompt: text,
                timeStamp: typeof timeStamp !== 'undefined' ? timeStamp : Date.now()
            };

            const chatPath = ref(database,'groupChats')
			await push(chatPath,messageData)
        } catch (error) {
			console.error("Firebase error:", error);
            showMessage("Failed to send. Please try again.",'error');
        }
    }
}
       
            

            
            
            function scrollToBottom(divElement){
				if(!scrolled){
					scrolled = true;
					divElement.scrollTop = divElement.scrollHeight;
				}
			}

function chatbox() {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    const chatContainer = document.getElementById('chatsList');
    chatContainer.innerHTML = '';

    // Allow chat only between 5PM-8PM or Weekends (Sat/Sun)
    if ((hour >= 17 && hour < 20) || (day === 6 || day === 0)) {
        const recentChatsSorted = [labChatsData.chats].sort((a, b) => new Date(b.chatId) - new Date(a.chatId)).slice(0, 25);
        
        let i = 0;
        labChatsData.chats.forEach(chat => {
            const sessionDiv = document.createElement('div');
            const time = new Date(parseInt(chat.chatId)).toLocaleTimeString();
            const me = (chat.senderId === userStudyData.userInfo[0].username);
            if (!me) {
                sessionDiv.className = 'message chat-card';
                messager = chat.senderId;
            } else {
                sessionDiv.className = 'message mychat-card';
                messager = 'You';
            }

            // SAFE DOM CREATION (No innerHTML for user content to prevent XSS)
            const header = document.createElement('h4');
            header.textContent = `${messager}    ${time}`;
            
            const p = document.createElement('a');
            p.textContent = chat.prompt; 
            sessionDiv.appendChild(header);
            const urlReg = /https?:\/\/\S*\w/
            try{
				const matchUrl = chat.prompt.match(urlReg)[0].trim();
				if(matchUrl){
					p.href = matchUrl;
				}
			}
			catch(e){console.log(e)}
            sessionDiv.appendChild(p);
            chatContainer.appendChild(sessionDiv);
            
            
            i++;
        });
        scrollToBottom(chatContainer);
    } else {
        const sessionDiv = document.createElement('div');
        document.getElementById("prompt-container-chat").style.display = 'none';
        const time = new Date().toLocaleTimeString();
        sessionDiv.className = 'message reminder';
        sessionDiv.textContent = `GIC AI ${time}: Your friends are studying. Don't disturb them now. Chat opens 17:00-20:00.`;
        chatContainer.appendChild(sessionDiv);
    }

    if (labChatsData.chats.length > 60) {
        labChatsData.chats.shift(); 
    }
}

            async function weekendAnalysis(flag){
				let WeekReport;
                const savedReport = await loadData('report');
                
                    if (savedReport) {
						
						WeekReport = savedReport; 
						thisWeekReport = savedReport[1];
                    }
                    
                week = 24*60*60*1000*7
                todayTime = Date.now()
                const dayIndex = new Date(new Date()).getDay();
                oneWeek = Math.abs(ThisWeekMonday.getTime()-((week/7)*2));
                const lastReportTime = thisWeekReport.date;
               console.log(lastReportTime,WeekReport)
                if((dayIndex >= 5 || dayIndex === 0) && todayTime - lastReportTime >= week){
                    aiRequest = ['I am MSCE student.Belowe are what I have studied this week.Missed sessions are not only for this week just look on it`s date. These are planned hours on each session '+userStudyData.userInfo[0].hours_session+' hours.'];
                    let total_Hours = 0
                    userStudyData.sessions.forEach(session =>{
                        if(new Date(session.date).getTime() >= oneWeek){
                            
                            
                            let studied = `subject: ${subjectnames[session.subjectId]},Date: ${session.date}, hours spent: ${session.hours}, Quiz Admin rate: ${session.rate}, Notes for you to focus: ${session.notes}.`;
                            if(session.subjectId === 1){
                                studied = `subject: ${subjectnames[session.subjectId]},Date: ${session.date}, numberOfQuestSolved: ${session.numberOfQuestSolved}, Quiz Admin rate: ${session.rate}, Notes for you to focus: ${session.notes}.`;
                            }else{
                                total_Hours += session.hours;
                            }
                            
                            aiRequest.push(studied)
                        };
                    })
                    if (Object.keys(userStudyData.missedsubjects).length > 0){
                        aiRequest.push(`Total studied hours this week: ${total_Hours} out of these missed Subjects hours + ${total_Hours}. I have missed the following sesseions:`);
                        Object.keys(userStudyData.missedsubjects).forEach(key =>{
                            missedTopics = Object.entries(userStudyData.missedsubjects[key]).join('->')
                            if(missedTopics){
                            missedsubject = subjectnames[key]+'; '+missedTopics
                            aiRequest.push(missedsubject);}
                        }) 
                    } 
                    
                    
                    if (aiRequest.length > 1){
                        try{
                           
                            WReport = await HTTPSrequest('generateWeeklyReport',{
                            prompt: aiRequest,
                              
                            }); 
                            
                            if(WReport[0]){
								thisWeekReport = WReport[1];
								WeekReport = WReport;
								const response = await fetch(`https://img.youtube.com/vi/${thisWeekReport.yTubeQuery[0]}/hqdefault.jpg`);
								const Blod = await response.blob();
								const fileReader = new FileReader()
								fileReader.onloadend = async() =>{
									WReport[2].push(fileReader.result);
									thisWeekReport.date = Date.now();
									await saveData('report',WReport);
								};
								fileReader.readAsDataURL(Blod);
							}
                        }catch (error){
                            
                        }
                    }

            }
                    
                if(thisWeekReport.yTubeQuery.length > 1 && flag){       

                    try{
                        
                        
                        
                        document.getElementById('title').textContent = thisWeekReport.title;
                        document.getElementById('intro').textContent = thisWeekReport.intro;
                        document.getElementById('reportbody').textContent = thisWeekReport.body;
                        document.getElementById('concl').textContent = thisWeekReport.conclunsion;

                        const youtubeCont = document.getElementById('youtube');
                        youtubeCont.innerHTML = '';
                        youtubeCont.innerHTML = `<a href="https://www.youtube.com/watch?v=${thisWeekReport.yTubeQuery[0]}" target="_blank" rel="noopener noreferrer">
                                                <img src="${WeekReport[2][2] || "https://img.youtube.com/vi/"+thisWeekReport.yTubeQuery[0]+"/hqdefault.jpg"}" alt="YouTube Video" width='100%'>
                                                </a><p>${thisWeekReport.yTubeQuery[1]}</p><br>`
                                                
                        document.getElementById('InactiveHide').style.display = 'block';
                        
                    }catch {
                        showMessage("Failed to make report. Please try again.",'error');
                    }
                    loadPieChart(WeekReport[2])
                }else if (flag){
                   showMessage("We`ll give report after week. Please try again comming Friday - Sunday.",'error'); 
                }
            }

            function missedSubjects(){
                    today_long = new Date(); 
                      
                    try{
                        userStudyData.subjects.forEach(subject =>{
                            const topics = subject.tid;
                            const dates = Object.keys(topics);
                            missedTopics = {}
                            dates.forEach(date => {
                                const dt = new Date(date.slice(0,3)+ ' ' + date.slice(3,5)+' '+ date.slice(5));    
                                if (dt < today_long && !(dt.toLocaleDateString('en-GB') === today_long.toLocaleDateString('en-GB'))){
                                    missedTopics[date] = topics[date];
                                    
                                }
                            });
                            userStudyData.missedsubjects[subject.id] = missedTopics;
                        })
                    }catch (error){
                       
                    }

            }


function upDateProfile() {
    if (!userStudyData.userInfo[0]) return;
    const userDataInfo = userStudyData.userInfo[0];
    
    const container = document.getElementById('userDetails');
    container.innerHTML = ''; 

    const nameLabel = document.createElement('h4');
    nameLabel.textContent = `User: ${userDataInfo.username}`;
    container.appendChild(nameLabel);

    const linkLabel = document.createElement('p');
    linkLabel.textContent = `LinkedID: ${userDataInfo.linkID}`;
    container.appendChild(linkLabel);

    const shareID = document.createElement('a')
    shareID.href = '#userDetails'
    shareID.innerText = `Share your LinkedID: ${userDataInfo.linkID} to friends to earn if they'll use it and pay.`
    shareID.onclick = ()=>{
        App_Locked = document.getElementById('App_Locked')
        App_Locked.style.display = 'none'
        switchTab('locker-interface')

    }
    container.appendChild(shareID)

    const netC = document.createElement('header');
    netC.textContent = `Your Linking Freinds`;
    container.appendChild(netC)
   
    const canvas = document.createElement('canvas');
    canvas.id = 'myNetworkChart';
    canvas.style.width = '100%';
    canvas.style.height = '400px';
    container.appendChild(canvas);

    const chartData = {
        parent: { name: userDataInfo.linkID },
        children: userDataInfo.network || []
    };
    drawNetworkChart('myNetworkChart', chartData);
    Timetable();
}


			function drawNetworkChart(canvasId, data) {
				const canvas = document.getElementById(canvasId);
				if (!canvas || !data || !data.children || data.children.length === 0) return;
				
				const ctx = canvas.getContext('2d');
				canvas.width = canvas.offsetWidth || 700;
				canvas.height = 400;
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				const numChildren = data.children.length;
				const pR = 30, cR = 20, padding = 50;

				
				const pPos = { x: canvas.width / 2, y: 50 };

				
				const aW = canvas.width - 2 * padding;
				const startX = padding;
				const cY = canvas.height - 80;
				const cPositions = data.children.map((_, i) => ({
					x: startX + (aW / (numChildren - 1 || 1)) * i,
					y: cY
				}));

				
				ctx.strokeStyle = '#3b82f6';
				ctx.lineWidth = 1;
				ctx.beginPath();
				cPositions.forEach(cPos => {
					ctx.moveTo(pPos.x, pPos.y + pR);
					ctx.lineTo(cPos.x, cPos.y - cR);
				});
				ctx.stroke();

				
				const drawNode = (pos, radius, color, label, isParent) => {
					
					ctx.fillStyle = color;
					ctx.beginPath();
					ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
					ctx.fill();
					ctx.stroke();

					
					ctx.fillStyle = '#1f2937';
					ctx.font = '12px Arial';
					ctx.textAlign = 'center';
					const labelY = isParent ? pos.y + radius + 15 : pos.y - radius - 5;
					ctx.fillText(label, pos.x, labelY);
				};

				
				drawNode(pPos, pR, '#10b981', data.parent.name, true);

				
				data.children.forEach((child, i) => {
					const label = `${child}`;
					drawNode(cPositions[i], cR, '#f59e0b', label, false);
				});
			}

             async function switchTab(tabName) {
                
                try{
					if(!keyTrust()) return;
                    // Hide all tabs
                    document.querySelectorAll('.tab-content').forEach(tab => {
                        tab.classList.remove('active');
                    });
                    document.querySelectorAll('.nav-tab').forEach(tab => {
                        tab.classList.remove('active');
                    });

                    // Show selected tab
                    document.getElementById(tabName).classList.add('active');
                    event.target.classList.add('active');
                    document.getElementById("menu").classList.toggle("active");
                    if(tabName === 'group'){
						showMessage('Chat with friends to refresh brain but don`t waste your time','warn',5)
                        startChatPolling();
                    }
                    else{
                        stopChatPolling();
                    };

                    if(tabName === 'progress'){
                        updateProgress();
                    }
                    else if (tabName === 'gic'){
						showMessage('My goal is to help you to succes. PlEASE TRY MULTIPLE TIMES YOURSELF FIRST BEFORE ME.','warn',5);
					}
                    else if (tabName === 'review'){               
                        updateReview();
                    }
                    else if(tabName === 'report'){
                        weekendAnalysis(true)
                    }
                    else if(tabName == 'profile'){
						upDateProfile();
						const links = await HTTPSrequest('networkLinks');
						const userDataInfo = userStudyData.userInfo[0]
						if (links.length === 2 && userDataInfo.network.length !== links[0]){
							userDataInfo.network = links[1];
							await saveData('labstudyTrackerData',userStudyData)
						}
						
					}
                }catch{

                }
            }
            
         
function Timetable() {
    const rowscontainer = [
        document.getElementById('Monday'), document.getElementById('Tuesday'),
        document.getElementById('Wednesday'), document.getElementById('Thursday'),
        document.getElementById('Friday'), document.getElementById('Saturday'),
        document.getElementById('Sunday')
    ];
    
   
    rowscontainer.forEach(row => { if(row) row.innerHTML = ''; });

    const rows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    for (let i = 0; i < 5; i++) {
        const cell = document.createElement('td');
        cell.textContent = rows[i];
        if(rowscontainer[i]) rowscontainer[i].appendChild(cell);
        
        let subjectLimit = 1;
        userStudyData.subjects.forEach(subject => {
            if (subject.name !== 'Mathematics') {
                if (subject.days.includes(rows[i]) && subjectLimit <= userStudyData.userInfo[0].number_subjects_day) {
                    const cell1 = document.createElement('td');
                    cell1.textContent = subject.name;
                    if(rowscontainer[i]) rowscontainer[i].appendChild(cell1);
                    subjectLimit++;
                }
            }
        });
    }
    tableDiv = document.getElementById('table');
    tableDiv.scrollToRight = tableDiv.scrollWidth;
    
}
    

           
		

			
			function initDB() {
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

			
			function loadData(KEY, onloadFlag) {
			  return new Promise((resolve, reject) => {
				if (!db) return reject(new Error('DB not initialized'));
				const tx = db.transaction('Data', 'readonly');
				const store = tx.objectStore('Data');
				const req = store.get(KEY);
				req.onsuccess = e => {
				  const val = (e.target.result === undefined) ? null : e.target.result;
				  if (onloadFlag === 'onload') {
					
					userStudyData = val;
					try { updateDisplay();
							switchTab('track') } catch (err) {}
				  }
				  resolve(val);
				};
				req.onerror = e => reject(e.target.error || e);
			  });
			}

			
			function saveData(KEY, dataToSave) {
			  return new Promise((resolve, reject) => {
				if (!db) return reject(new Error('DB not initialized'));
				const tx = db.transaction('Data', 'readwrite');
				const store = tx.objectStore('Data');
				const req = store.put(dataToSave, KEY);
				req.onsuccess = () => resolve();
				req.onerror = e => reject(e.target.error || e);
			  });
			}

			


function keyTrust() {
    let is_Allowed = false;
    try {
        if (userStudyData.userInfo && userStudyData.userInfo[0]) {
            is_Allowed = (String(userStudyData.userInfo[0].approved) === 'true');
        }
    } catch (e) { is_Allowed = false; }

    if (!is_Allowed) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.getElementById('login').classList.add('active');
        const menuCont = document.getElementById('menu-container');
        if (menuCont) menuCont.style.display = 'none';
        return false;
    }
    
    const menuCont = document.getElementById('menu-container');
    if (menuCont) menuCont.style.display = 'block';
    return true;
}
            

        function processesStudiedSessions(){
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
        }

        // Log a study session
       
        const subjectSelected = document.getElementById('studySubject');
        subjectSelected.addEventListener('focusout', function(e){
            
            var studyHours = document.getElementById('studyHours');
            const subjectID = subjectSelected.value
            
            if (subjectID === '1'){
                studyHours.min = 4;
                studyHours.max = 24;
                studyHours.placeholder = 4;
                document.getElementById('hourslabel').textContent= `Number Of Questions Solved`;
            }else{
                studyHours.min = 1;
				studyHours.max = 3;
				studyHours.placeholder = 2;
				document.getElementById('hourslabel').textContent= `Hours Studied`;
            }
        })

        async function logStudySession() {
        
            const subjectId = document.getElementById('studySubject').value;
            const date = document.getElementById('studyDate').value;
            const hours = document.getElementById('studyHours').value;
            const notes = document.getElementById('studyNotes').value;
            const topicnotes = document.getElementById("myowntopic").value;
            const missedTopic = document.getElementById("missedT").value;
            
            
            
            if (subjectId && date && hours && !missedTopic) {
                topic = studyTopics[subjectId];
                if(topic){
                    
                    note = ". I've wrapped up studying some of: "+topic+" and "+topicnotes+". "+notes;

                }
                else{
                    topic = topicnotes;
                    note = "Today I've studied part of this topic: "+topic+". "+notes;
                } 
                if(subjectId === '1'){
                    userStudyData.sessions.push({
                        id: Date.now(),
                        subjectId: parseInt(subjectId),
                        date: date,
                        topic: topic,
                        numberOfQuestSolved: parseFloat(hours),
                        notes: note,
                        rate: 0
                    })
                    
					}
                else{
                    userStudyData.sessions.push({
                        id: Date.now(),
                        subjectId: parseInt(subjectId),
                        date: date,
                        topic: topic,
                        hours: parseFloat(hours),
                        notes: note,
                        rate: 0
                    }); 
                }
                if (studyTopics[subjectId])
                {
                    let subjectTopicsdict = 0;
                    userStudyData.subjects.some(subject =>{if(subject.id === parseInt(subjectId)){subjectTopicsdict = subject.tid}});
                    key = Object.keys(subjectTopicsdict).find(key => subjectTopicsdict[key] === topic);
                    
                    
                    userStudyData.studied.push([subjectId,key]) 
                    delete subjectTopicsdict[key];
                }

               
            }
            else if(missedTopic){
                topic = userStudyData.missedsubjects[subjectId][missedTopic];
                missedDate = new Date(missedTopic.slice(0,3)+' '+missedTopic.slice(3,5)+' '+missedTopic.slice(5)).toLocaleDateString('en-GB');
                if(subjectId == '1'){
                    userStudyData.sessions.push({
                        id: Date.now(),
                        subjectId: parseInt(subjectId),
                        date: date,
                        topic: topic,
                        numberOfQuestSolved: parseFloat(hours),
                        rate: 0,
                        notes: '. I\'ve covered some of: '+topic+' to be back on track for missing it earlier on: '+missedDate+". "+notes             
                        });  
                }else{                    
                    userStudyData.sessions.push({
                        id: Date.now(),
                        subjectId: parseInt(subjectId),
                        date: date,
                        topic: topic,
                        hours: parseFloat(hours),
                        rate: 0,
                        notes: '. I\'ve covered some of : '+topic+' to be back on track for missing it earlier on: '+missedDate+". "+notes             
                    });
                }
                        
                delete userStudyData.missedsubjects[subjectId][missedTopic];
                
                var subject = userStudyData.subjects.find(subject => subject.id === parseInt(subjectId))
                    
                        
                        //userStudyData['studied'] = []
                        userStudyData.studied.push([subjectId,missedTopic])
                        delete subject.tid[missedTopic];
                
            }
             // Update subject completed hours
                subject = userStudyData.subjects.find(s => s.id === parseInt(subjectId));
                if (subject) {
                    if(subjectId === '1'){
                        subject.quesNumSolved += parseFloat(hours);
                    }else{
                        if(studyTopics[subjectId] || topic !== topicnotes){
                            subject.completedHours += parseFloat(hours);
                        }
                        
                    }
                }
                

                document.getElementById('studyHours').value = '';
                document.getElementById('studyNotes').value = '';
                document.getElementById('studySubject').value   = '';
                document.getElementById("myowntopic").value = '';
                document.getElementById("missedT").value    = '';
                await saveData('labstudyTrackerData',userStudyData);
                splitTextForWaveEffect('#quoteDisplay');
                document.getElementById('missedT').style.display = 'block'
                document.getElementById('myowntopic').style.display = 'block'
                try{
					updateDisplay()
                    sessionSave();
                }catch{}

                
                
            
        }

        // Update home display
        function updateDisplay() {
				if (keyTrust()){
                    missedSubjects();
                    updateReminders();
                    updateStudySubjectDropdown();
                    processesStudiedSessions();
                }
            
        }


        function updateMissedStudyTopicDropdown() {
            try{
                const dropdown = document.getElementById('missedT');
                const subjectId = parseInt(document.getElementById('studySubject').value);
                dropdown.innerHTML = '';
                    missedSubjectTopicsdic = userStudyData.missedsubjects[subjectId]
                    if(!missedSubjectTopicsdic){
                        const option = document.createElement('option');
                        option.value = '';
                        option.disabled = true;
                        option.selected = true;
                        option.textContent = 'Select subject first';
                        dropdown.appendChild(option); 
                    }
                    subjectTopicsdic = Object.entries(missedSubjectTopicsdic);
                    if (subjectTopicsdic.length > 0){
                        document.getElementById('myowntopic').value = ''
                        document.getElementById('myowntopic').style.display = 'none'
                        const placeholder = document.createElement('option');
                        placeholder.textContent = 'Select missed topic...'
                        placeholder.value = '';
                        placeholder.disabled = true;
                        placeholder.selected = true;
                        dropdown.add(placeholder)
                        subjectTopicsdic.reverse().forEach(unit =>{
                        missedDate = new Date(unit[0].slice(0,3)+' '+unit[0].slice(3,5)+' '+unit[0].slice(5)).toDateString();                    
                        const option = document.createElement('option');
                        option.value = unit[0];
                        option.textContent = unit[1]+': '+missedDate;
                        dropdown.appendChild(option);
                    });
                    }
                    else{
                        document.getElementById('MissedTopic').style.display = 'none'
                        document.getElementById('myowntopic').style.display = 'block'
                    }
                }catch(e){
                    
                }
                
        }
        function updateStudyTopicDropdown() {
            try{
                const dropdown = document.getElementById('myowntopic');
                const subjectId = parseInt(document.getElementById('studySubject').value);
                dropdown.innerHTML = '';
                    subjectsel = 0
                    userStudyData.subjects.some(subject =>{if (subject.id === subjectId){subjectsel = subject.name; return true}});
                    subjectTopicsdic = topics[subjectsel];
                    if(!subjectTopicsdic){
                        const option = document.createElement('option');
                        option.value = '';
                        option.disabled = true;
                        option.selected = true;
                        option.textContent = 'Select subject first';
                        dropdown.appendChild(option);
                    }
                    subjectTopicsdic = Object.entries(subjectTopicsdic[0]);
                    const placeholder = document.createElement('option');
                        placeholder.textContent = 'Select topic you study on your wish'
                        placeholder.value = '';
                        placeholder.disabled = true;
                        placeholder.selected = true;
                        dropdown.add(placeholder)
                    subjectTopicsdic.reverse().forEach(unit =>{
                        unit = unit[1];
                        const option = document.createElement('option');
                        option.value = unit;
                        option.textContent = unit;
                        dropdown.appendChild(option);
                });
                document.getElementById('missedT').value = ''
                document.getElementById('MissedTopic').style.display = 'none'
            }catch(e){
                
            }
        }
        // Update study subject dropdown
        function updateStudySubjectDropdown() {
            try{
                const dropdown = document.getElementById('studySubject');
                dropdown.innerHTML = '';
                const placeholder = document.createElement('option');
                    placeholder.textContent = 'Select subject...'
                    placeholder.value = '';
                    placeholder.disabled = true;
                    placeholder.selected = true;
                    dropdown.add(placeholder)
                userStudyData.subjects.forEach(subject => {
                    const option = document.createElement('option');
                    option.value = subject.id;
                    option.textContent = subject.name;
                    dropdown.appendChild(option);
                });
            }catch (error){
                
            }
        }

        // Update progress display
        function updateProgress() {
            // Update stats
            const filteredSessions = userStudyData.sessions.filter(session => session.subjectId !== 1);
            const totalHours = filteredSessions.reduce((sum, session) => sum + session.hours, 0);
            document.getElementById('totalHours').textContent = totalHours.toFixed(1);
            const PaceRate = document.getElementById('CompletionRate')
            document.getElementById('subjectsCount').textContent = userStudyData.subjects.length;

           
            // Update progress bars
            const container = document.getElementById('progressList');
            container.innerHTML = '';

            userStudyData.subjects.forEach(subject => {
                let subjectiInfoArray = [subject.completedHours,subject.plannedHours,' hours ']
                if (subject.id === 1){
                    subjectiInfoArray = [subject.quesNumSolved,subject.plannedNumber,' questioans ']
                }
                    const progress = (subjectiInfoArray[0] / subjectiInfoArray[1]) * 100;
                    const card = document.createElement('div');
                    card.className = 'study-card';
                    card.innerHTML = `
                        <h3>${subject.name}</h3>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                        </div>
                        <p>${subjectiInfoArray[0]} / ${subjectiInfoArray[1]} ${subjectiInfoArray[2]} (${Math.min(progress, 100).toFixed(1)}%)</p>
                    `;
                
                container.appendChild(card);
            });

            // Update completion rate
             const filteredSubjects = userStudyData.subjects.filter(subject => subject.id !== 1);
            const total_Hourscompleted = filteredSubjects.reduce((sum, subject) => sum + subject.completedHours, 0);
            const totalPlanned = filteredSubjects.reduce((sum, subject) => sum + subject.plannedHours, 0);
           
            
            
            PaceRate.textContent = `Completion Rate: ${hoursExpected < 10 ? 'Expected': 'Slow'}`;
            
            const overallRate = totalPlanned > 0 ? (total_Hourscompleted / totalPlanned) * 100 : 0;
            document.getElementById('completionRate').textContent = overallRate.toFixed(1) + '%';
        }

        // Update reminders
        function updateReminders() {
            try{
                const container = document.getElementById('reminderList');
                const container2 = document.getElementById('mTRlist');
                container2.innerHTML = '';
                container.innerHTML = '';

                const today = new Date().toISOString().split('T')[0];
                
                const todaySessions = userStudyData.sessions.filter(session => session.date === today);
                const todaystopic = {};
                const subjectNames = {};

                // Check for subjects not studied today
                userStudyData.subjects.forEach(subject => {
                    const studiedToday = todaySessions.some(session => session.subjectId === subject.id);
                    const weekdays = {1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 6:'Sat',7:'Sun'}
                    dat = new Date();
                    day_no = dat.getDay();
                    
                    day = weekdays[day_no];
                    
                    bool = subject.days.includes(day);
                    subjectNames[subject.id] = subject.name;
                    try{
                    if(Object.entries(userStudyData.missedsubjects[subject.id]).length > 0){

                            currentDate = new Date()
                            
                            const msreminder = document.createElement('ul');
                            msreminder.style.borderRadius = '5px';
                            msreminder.style.background = 'brown';
                            msreminder.style.padding = '10px';
                            msreminder.style.margin = '5px 0';
                            msreminder.innerHTML = `📕 <strong>${subject.name}</strong>.<br>🔬 Can you please make up now for the study session you missed?`;
                            container2.appendChild(msreminder);
                        }
                    } catch (error){
                        
                    }
                    



                
                    if(bool){
                        
                    
                        if (!studiedToday) {
                            subjTopics = subject.tid;
                            currentDate = new Date()
                            const formattedDate = currentDate.toDateString('en-GB').split(' ').slice(1).join('');
                            todayTopic = subjTopics[formattedDate]
                            todaystopic[subject.id] = todayTopic;
                            todaySubjectReminders.push(subject.name);
                            let inner = `📔 Consider studying <strong>${subject.name}</strong> today.<br>🔬 Please spend at least half of your session on <strong>${todayTopic}</strong>.<br>✏ Spend the rest of time on your wish study area.`;
                            if(subject.id === 1){
                                inner = `📔 Solve <strong>${subject.name}</strong> everyday.<br>🔬 Please solve at least 4 questions on <strong>${todayTopic}</strong>.<br>✏ Spend the rest of time solving questions on your wish topics.`
                            }
                            let reminder = document.createElement('div');
                            reminder.style.padding = '10px';
                            reminder.style.margin = '5px 0';
                            reminder.style.background = '#ffeaa7';
                            reminder.style.borderRadius = '5px';
                            if (todayTopic){
                                reminder.innerHTML = inner;
                                container.appendChild(reminder);
                            }
                            else{
                                if(subject.plannedHours <= subject.completedHours){
                                    reminder.innerHTML = `🌟 Woow! you've finnished planned sessions for <strong>${subject.name}</strong> .<br>🔬 It's time for your random reviews.`;
                                    container.appendChild(reminder);
                                }
                            }
                            
                            

                            
                            
                                                                
                        }}
                    
                        
                });
                let date = new Date()
                const date_month = date.getMonth();
                if(container.children.length === 0 && [2,6,11].includes(date_month)){
                    reminder = document.createElement('div');
                    reminder.style.padding = '10px';
                    reminder.style.margin = '5px 0';
                    reminder.style.background = '#ffeaa7';
                    reminder.style.borderRadius = '5px';
                    reminder.innerHTML = `<strong>Exam Plan</strong>
                                            <p>Now you must be focusing much on your areas of weakness and depending on your Exam timetable.</p>
                                            <p>Stop following this app's topics planned. But still keeping entering data of topics you'll choose.</p>`
                  
                   container.appendChild(reminder);
                }
                
                if (!([2,6,11].includes(date_month)) && container.children.length === 0 && date.getDay() <= 6 && date.getDay() >=1) {
                    container.innerHTML = `<p>Great job! You\'re on track on today's subjects . Do the same tomorrow 🎉</p>`;
                }else{
                    createReminder('Study Tracker Reminders','Study these subjects today: '+todaySubjectReminders.join(', ')+'. Solve Maths everday like your cup of water.',new Date(new Date().getTime() + (1000*60)).toISOString())
                }
                if (container2.children.length > 0){
                    document.getElementById("missedTopicReminders").style.display ="block"
                    }
                    else{
                        document.getElementById('missedT').style.display = 'none'
                    }
                studyTopics = todaystopic;
                subjectnames = subjectNames;
            }catch (error){
                
            }
        }
        
        function lastMonday() {
            let d = new Date(new Date(today).getTime()-(60*60*1000*16));
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            return new Date(d.setDate(diff));
        }
       
        // Update review section
        function updateReview() {
            // Weekly feedback
            const feedbackContainer = document.getElementById('weeklyFeedback');
            const historyContainer = document.getElementById('studyHistory');

            if (userStudyData.sessions.length === 0) {
                feedbackContainer.innerHTML = '<p>Start logging your study sessions to see feedback and improvements!</p>';
                historyContainer.innerHTML = '<p>No study sessions recorded yet.</p>';
                return;
            }

            // Calculate weekly stats
            const oneWeekAgo = ThisWeekMonday;
            const rSessions = userStudyData.sessions.filter(session => 
                session.subjectId !== 1 
            );
            const recentSessions = rSessions.filter(session => 
                new Date(session.date) >= oneWeekAgo && new Date(session.date).getTime() > 1
            );

            const weeklyHours = recentSessions.reduce((sum, session) => sum + session.hours, 0);
            
            let feedback = `<h4>Last 7 Days Summary</h4>`;
            feedback += `<p>You studied <strong>${weeklyHours.toFixed(1)} hours</strong> this week.</p>`;

            if (weeklyHours < 15) {
                feedback += `<p style="color: #e74c3c;">💡 Suggestion: Try to increase your study time to at least 10 hours per week for better results.</p>`;
            } else if (weeklyHours > 25) {
                feedback += `<p style="color: #27ae60;">🌟 Excellent! You're putting in great effort. Remember to take breaks!</p>`;
            } else {
                feedback += `<p style="color: #27ae60;">👍 Good consistency! Keep up the regular study habits.</p>`;
            }

            feedbackContainer.innerHTML = feedback;

            // Study history
            historyContainer.innerHTML = '';
            const recentSessionsSorted = [...userStudyData.sessions].reverse();
            i = 0
            recentSessionsSorted.forEach(session => {
                const subject = userStudyData.subjects.find(s => s.id === session.subjectId);
                const sessionDiv = document.createElement('div');bool
                sessionDiv.className = 'study-card';
                
                hour = ['Hours: ',session.hours]
                if(session.subjectId === 1){
                    hour = ['Solved Questions: ',session.numberOfQuestSolved]
                }
                    sessionDiv.innerHTML = `
                        <h4>${subject ? subject.name : 'Unknown Subject'}</h4>
                        <p>Topic:${session.topic ? session.topic : 'Unknown Topic'}</p>
                        <p>Date: ${session.date}</p>
                        <p>${hour[0]}${hour[1]}</p>
                        <p>Quiz Admin rate: ${session.rate}</p>
                        <p id=${'Note'+i}></p>
                    `;
                
                historyContainer.appendChild(sessionDiv);
                document.getElementById('Note'+i).textContent = `Note: ${session.notes ? session.notes: ' '}`;
               
                i += 1
            });
        }



        // Set today's date as default in study log
        document.getElementById('studyDate').value = today;



    function getlastEptcDte(){
        let ExpectedHours = 0;
        const Session_Hours = userStudyData.userInfo[0].hours_session
        const Missed_Topics = Object.entries(userStudyData.missedsubjects)
        if(Missed_Topics.length*Session_Hours >= 10){
            ExpectedHours = 10;
        }else{
            for (i = 1;i <= Missed_Topics.length;i++){
                ExpectedHours += Object.keys(userStudyData.missedsubjects[i]).length
                if (ExpectedHours >= 10) break; 
            }
        }

        delete userStudyData.userInfo[0].ExpectedHours
        return ExpectedHours
    }

		

        window.addEventListener('load', async function () {
            try {
				

                await initDB();
				
                // Load User Data
                await loadData('labstudyTrackerData', 'onload');
                

               
                // Load Saved URL
                const cachedUrl = await loadData("URL");
                if (cachedUrl) {
                    requestURL = cachedUrl;
                   
                } 
                

                // requst limit
                const stopRequests = await loadData("STOP");
                if(stopRequests){
                    if(Date.now() - stopRequests < 24*60*60*1000) requesting = 'STOP';
                }

                // Calculations for Pace/Progress
                day = 1000 * 60 * 60 * 24;
                if (userStudyData.userInfo && userStudyData.userInfo.length > 0) {
                    const user_plan = userStudyData.userInfo[0];
                    
                    const dateDate = user_plan.fMEdate;
                    now = Date.now();
                    const daysToGo = Math.abs(parseInt((new Date(today).getTime() - dateDate[2]) / day));
                    
                    
                    if (!(dateDate[1] < now && dateDate[2] > now)) {
						userStudyData = {};
						await saveData('labstudyTrackerData', userStudyData)
                        showMessage('Account has been deactivated. Please renew subscription. Please start payment process. Pay using Airtel Money to +265980617390', 'error', 5);
                        const rem = createReminder('Account has been deactivated.','Please renew subscription or contact us. Please start payment process. Pay using Airtel Money to +265980617390',new Date(new Date().getTime() + (1000*60)).toISOString());
                        showLocalNotification(rem);
                        this.localStorage.clear()
                    } else if (daysToGo <= 5) {
                        if(daysToGo <= 1)updateLock()
                        showMessage(`Only ${daysToGo} days remaining.Please start payment process. Pay using Airtel Money to +265980617390. Get online to save data.`, 'error', 5);
                        const remS = createReminder('Account deactivation is pedding.',`Only ${daysToGo} days remaining. Get online to save your data else you will lose data or contact us. Please start payment process. Pay using Airtel Money to +265980617390`,new Date(new Date().getTime() + (1000*60)).toISOString());
                        showLocalNotification(remS);
                    }else if(daysToGo == 7){
                        updateLock()
                    }else localStorage.clear()
					
                    dateDate[1] = now;
                    hoursExpected = getlastEptcDte();
                    sessionSave();
                    weekendAnalysis();
                    
                }

				if (!isStandalone()) {
					maybeShowInstall();
				}
                await registerServiceWorker();
                await navigator.serviceWorker.ready;
                if (!navigator.serviceWorker.controller) {
					location.reload();
					return; 
				}
                
                await requestNotificationPermission();
                syncRemindersOnLoad();
                
                
				
            } catch (e) {
                
                if (quotesAndSayings.length === 0) quotesAndSayings = [["Knowledge is power."]];
            }
        });


        
        window.addEventListener('online',function (){
            sessionSave();
            weekendAnalysis();
        })
	    
   
        













       const trackForm = document.getElementById('form');
       trackForm.addEventListener('submit', function(e) {
                e.preventDefault();
                logStudySession();
            })

loginForm.addEventListener('submit', async function(e) { 
    e.preventDefault();
    const username = usernameInput.value;
    let password = passwordInput.value;
    
   
   
    
    // Basic validation
    if (!username || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    password = btoa(password)
    passwordInput.value = '';
    usernameInput.value = '';
    // Check credentials call GAS
    try {
        showMessage('Wait','success')
        const message = await HTTPSrequest('login', {
            email_username: username,
            password: password
        },'NOT');
		
       
        if (message && message[0] === true) {
            
            
            setTimeout(async () => {
               
                
                // 4. DATA ASSIGNMENT
                userStudyData = await { 
                    userInfo: message[1],
                    subjects: message[2],
                    missedsubjects: {},
                    sessions: [],
                    studied: []
                }
                await saveData('labstudyTrackerData',userStudyData);
				updateDisplay();
                showMessage(`Welcome ${username}!! You are now logged in.`, 'success',3);
                
                
                 // ... (UI state changes) ...
                document.getElementById('login').classList.remove('active');
                document.getElementById('track').classList.add('active');
                // Reset form
                loginForm.reset();
            }, 2000);
           
            
        } else {
           
            showMessage(message[1], 'error');
            passwordInput.value = '';
            passwordInput.focus();
        }
    } catch (error) {
        
        showMessage('Could not connect to the server. Check your internet connection.', 'error');
    };
    
});
   


            // Add some interactive effects
            document.querySelectorAll('.demo-account').forEach(account => {
                account.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateX(5px)';
                });
                
                account.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateX(0)';
                });
            });

            forgotForm.addEventListener('submit',async function(e) {
                e.preventDefault();
                const username = document.getElementById('reUserName').value;
                const phonenumber = document.getElementById('rePhoneNumber').value;
                const email = document.getElementById('reEmail').value;
                
                // Hide previous messages
                errorMessage.style.display = 'none';
                successMessage.style.display = 'none';
                
                // Basic validation
                if (!username || !phonenumber || !email) {
                    showMessage('Please fill in all fields', 'error');
                    return;
                }
                
                // Check credentials call GAS
                try {
                    const message = await HTTPSrequest('forgot_password', {
                        username: username,
                        phonenumber: phonenumber,
                        email: email
                    },'NOT');
                    //await sessionSave();
                
                    if (message && message[0] === true) { 
                        showMessage(message[1], 'success');
                        
                        
                        setTimeout(() => {
                        
                            showMessage(`Welcome ${username}! You are now logged in.`, 'success');
                            
                            // Reset form
                            loginForm.reset();
                        }, 2000);
                        
                    } else {
                        
                        showMessage(message[1], 'error');
                    }
                } catch (error) {
                    
                    showMessage('Could not connect to the server. Check your internet connection.', 'error');
                }
            });
            
           
            
            
            
            
let loading           
const stBt = document.getElementById('send-button-ai');   
document.getElementById('prompt-container-chat').addEventListener('click',function(){
	loading = document.getElementById('loading-chat');
	promptSwitch('chat')});
document.getElementById('prompt-container-ai').addEventListener('click', function(){
	loading = document.getElementById('loading-ai');
	promptSwitch('ai')});

                

    async function requestNotificationPermission() {
        if (!("Notification" in window)) throw new Error("Notifications not supported");
            const result = await Notification.requestPermission();
        if (!(result === 'granted')) throw new Error("Notification permission denied");
            return true;
    }

    
    async function registerServiceWorker() {
        if ('serviceWorker' in navigator){
            const reg = await navigator.serviceWorker.register('serviceworker.js', {scope: './'});
           
            if('periodicSync' in reg){
                try{
                    await reg.periodicSync.register('reminder-sync',{minInterval: 15 * 60 * 1000});
                    
                }catch(e){
                    
                }
            }
            return reg;
        }
        else{
            
        }
    }

    
    async function showLocalNotification(reminder) {
        navigator.serviceWorker.controller.postMessage({
		  type: 'SHOW_NOTIFICATION',
		  payload: reminder
		});

    }

    async function saveReminder(reminders = []) {
        //try{
            const todayReminders = await loadData('reminders') || [];
            let fireAt;
            const now = Date.now();
            if(!todayReminders.length === 0){
                fireAt = new Date(todayReminders[0].timeISO).getTime();
            }else{
                fireAt = now - 24*60*60*1000;
            }
            
            const ms = now - fireAt >= 4*60*60*1000;
            if(!ms) return;
            if(reminders[0].id){
                await saveData('reminders',reminders)
            }
            console.log('corrected')
        //}catch (e){}
    }

    
    function scheduleInPage(reminder) {
        const fireAt = new Date(reminder.timeISO).getTime();
        const now = Date.now();
        const ms = fireAt - now;
        if (ms < 0) return 'missed';
        reminder._timerId = setTimeout(() => {
            showLocalNotification(reminder);
            
        }, ms);
    }
    
   
    

   
    async function syncRemindersOnLoad() {
        try{
            const all = await loadData('reminders');
            all.forEach(rem =>{
                scheduleInPage(rem);
            })
        }catch(e){
            
        }
    }

    async function createReminder(title, body, timeISO, repeat=null) {
        const id = 'r-'+ Date.now();
		const report = await loadData('report');
		let img = ''
		if(report){
			const charts = report[2] || [];
			const random = Math.floor(Math.random()*3);
			img = charts[random] || '';
		}
		const imgArray = ['icon-192.png','icon1-512.png','icon1-512.png'];
		let iArray = [1,2];
		let rem;
		for (let i=0;i<3;i++){
			const response = await fetch(imgArray[i]);
			const Blod = await response.blob();
			const fileReader = new FileReader()
			fileReader.onloadend = () =>{
				console.warn(i,iArray);
				iArray[i] = fileReader.result;
				rem = {id,title,body,timeISO,repeat,img : img,icon: iArray[1],badge: iArray[0]};
				
			};
			fileReader.readAsDataURL(Blod)
		}
        saveReminder([rem]);
		syncRemindersOnLoad()
		return rem;
        
    }
    
    

   
    document.getElementsByName('share').forEach(elmnt =>{
        elmnt.addEventListener("click",function() {
            handleShare(elmnt.id)
        })
    })
	document.getElementById('App_Locked').addEventListener('click',() =>{
			lock.style.display = 'none'
			switchTab('login')
			})
    
    
   


    function handleShare(platform) {
        const now = Date.now();
        const SHARE_MSG = `Achieve MSCE success with smart studying!

        I've started using this app to prepare for MANEB exams. It makes studying easier, helps reduce exam stress, and guides you toward success. Let's study together!

        Powerful Features:
        - Study progress tracking
        - Offline access
        - Session logs & reminders
        - Data sync across devices
        - Built-in AI Assistant
        - Dynamic Quizzes
        - Discussion Rooms
        - Study Timetable
        - Topic Videos

        How to get started:
        1. Open this link in Chrome: ${PAGE_URL}
        2. Create an account using my LinkedID: ${userStudyData.userInfo ? userStudyData.userInfo[0].linkID : linkedID}
        3. Log in and start your journey!

		Bonus: Once you create an account, you can earn MKW 500 for every new user who signs up using your LinkedID!`;
        
        
        if (now - lastClickTime < 5000 && !App_Locked) {
            lock.style.display = 'none'
            showMessage("Please share it first.",'error')
            setTimeout(()=>{
                lock.style.display = "block";
            },2500)
            sharesCount = sharesCount - 3 > 0 ? sharesCount - 3: 0;
            localStorage.setItem('myShareCount', sharesCount);
            return;
        }
        if (now - lastClickTime > 1000*60*60){
            localStorage.clear()
            lastClickTime = now;
            sharesCount = 0
        }

        // 2. OPEN THE APP
        let url = "";
        if (platform === 'whatsapp') {
            url = `https://wa.me/?text=${encodeURIComponent(SHARE_MSG)}`;
        } else if (platform === 'facebook') {
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(PAGE_URL)}`;
        } else if (platform === 'sms') {
            // "sms:" protocol opens the default messages app
            const ua = navigator.userAgent.toLowerCase(); 
            const separator = (ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1) ? "&" : "?";
            url = `sms:${separator}body=${encodeURIComponent(SHARE_MSG)}`;
        }
        
        // Open in new tab/window
        window.open(url, '_blank');
        if(App_Locked){
            switchTab('profile')
            App_Locked.style.display = 'block'
            return
        }
        // We verify the share only after they return or after a delay
        lastClickTime = now;
        localStorage.setItem('lastClickTime',JSON.stringify(now))
        
        // Wait for the Minimum Time to pass (simulating them searching for a contact)
        setTimeout(() => {
            // We give them credit only if enough time passed
            validateShare();
        }, MIN_TIME_SECONDS * 1000); 
    }

    function validateShare() {
        
        // Randomly fail sometimes to simulate "Same Group" detection (Optional Evil Trick)
        // 30% chance to say "You shared to the same group!"
        const randomChance = Math.random();
        
        if (sharesCount > 0 && randomChance < 0.4) {
            lock.style.display = 'none'
            showMessage("❌ Don't share to the same group/person twice!",'error')
            setTimeout(()=>{
                lock.style.display = "block";
            },2500)
            sharesCount - 2;
            localStorage.setItem('myShareCount', sharesCount);
        } else {
            // Success!
            sharesCount += 4;
            localStorage.setItem('myShareCount', sharesCount);
            updateLock();
        }
    }

    function updateLock() {
        lock.style.display = 'block';
        const remaining = TARGET_SHARES - sharesCount;
        const progress = (sharesCount / TARGET_SHARES) * 100;

        document.getElementById('shares-left').innerText = remaining > 0 ? remaining : 0;
        document.getElementById('progress-bar').style.width = (progress > 100 ? 100 : progress) + "%";

        if (sharesCount >= TARGET_SHARES) {
            lock.style.display = 'none';
        }
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
topics = {
            Mathematics: [{1: "FACTORIZATION",7: "QUADRATIC EQUATIONS",10: "IRRATIONAL NUMBERS",19: "CIRCLE GEOMETRY- CHORD PROPERTIES",25: "ALGEBRAIC FRACTIONS",31: "SETS",41: "MAPPING AND FUNCTIONS",49: "CIRCLE GEOMETRY - ANGLE PROPERTIES",55: "TRANSFORMATIONS",63: "CHANGE SUBJECT OF FORMULA",71: "EXPONENTIAL AND LOGARITHMIC EQUATIONS",78: "TRIGONOMETRY I",84: "SIMILARITY",92: "COORDINATE GEOMETRY",101: "VARIATIONS",114: "GRAPHS OF QUADRATIC FUNCTIONS",125: "INEQUALITIES",134: "STATISTICS I",141: "MATRICES",151: "CIRCLE GEOMETRY III - TANGENTS TO CIRCLE",162: "CIRCLE GEOMETRY III: CONSTRUCTION",171: "STATISTICS II",174: "SIMULTANEOUS LINEAR AND QUADRATIC EQUATIONS",180: "PROGRESSIONS",189: "TRAVEL GRAPHS",201: "TRIGONOMETRY II",209: "POLYNOMIALS",217: "PROBABILITY",228: "VECTORS",238: "LINEAR PROGRAMMING",251: "MENSURATION I: SURFACE AREA AND VOLUME OF SOLIDS",258: "MENSURATION II: THREE-DIMENSIONAL GEOMETRY",267: "GRAPHS OF CUBIC FUNCTIONS"},272],
            Chemistry: [{1: "Experimental techniques",29: "Nitrogen, Sulphur and Phosphorus",66: "Chemical bonding and properties of matter",90: "Stoichiometry",146: "Chemical Reactions",166: "Alkanols",183: "Alkanals and Alkanones",197: "Alkanole Acids",211: "Alkanoates",220: "Identification of unknown organic compounds",231: "Rates of reactions",264: "Acids and Bases",296: "Reduction and Oxidation reactions",332: "Electrolysis",360: "Isomerism",378: "Polymerisation",390: "Water", 178: "Greenhouse gases and ozone layer", 194: "Waste management"},397],
            Agriculture: [{1: "Physical properties of soil",20: "Chemical properties of soil",33: "Agricultural development agencies and their services",49: "Farm records and accounts",70: "Farm budgeting",76: "Economic principles for decision making in agriculture",88: "Enterprise combinations",103: "Agricultural cooperatives",109: "Vegetative planting materials",121: "Cropping systems",140: "Mushroom production",160: "Livestock feeds and feeding",167: "Sheep production",181: "Goat production",194: "Soil degradation",201: "Agriculture and climate change: mitigation measures to climate change",212: "Land drainage",218: "Farm mechanisation",228: "Farm power",240: "Gender and agricultural technology",249: "Improved farming technology for food security",259: "Agricultural marketing and trading",277: "Price elasticity of demand and supply",287: "Crop improvement",296: "Crop processing",303: "Pasture",329: "Growing mangoes",344: "The reproductive systems of cattle and poultry and the processes of reproduction",361: "Livestock improvement",369: "Breeds and management of beef cattle",384: "Breeds and management of dairy cattle"},394],
            Physics: [{1: "Measurements II",27: "Scientific Investigations",54: "The kinetic theory of matter",64: "Thermometry",78: "Pressure",128: "Gas Laws",158: "Scalars and Vectors",173: "Linear Motion",218: "Work and Energy",240: "Machines",266: "Electric Current and Potential Difference",279: "Electrical Resistance",297: "Electric Circuit, Energy and Power",322: "Oscillations and Waves",355: "Sound",380: "Thermal expansion",394: "Newton's laws of motion",421: "Frictional force",432: "Hooke's law",440: "Uniform circular motion",471: "Moment of a force",498: "Magnetism",508: "Electromagnetism",527: "Electromagnetic induction",558: "Introduction to digital electronics",594: "Electromagnetic Spectrum",612: "Light and lenses",650: "Isotopes",655: "Radioactivity"},658],
            Biology: [{1: "Living things and their environment",49: "Plant structure and function",97: "Vertebrates and invertebrates",107: "Human digestive system",127: "Human circulatory system",147: "Human reproductive system",170: "Genetics I",201: "Plant responses",213: "Human respiratory system",236: "Human excretory system",251: "Co-ordination",274: "Immunity",286: "Genetics II",301: "Evolution",319: "Biotechnology",328: "Infectious and non-infectious diseases"},338],
            History: [{1: "The Yao and the Lomwe",14: "The Ngoni",21: "The Ndebele",30: "The Portuguese factor",40: "The missionary factor in Malawi",58: "The Development of ivory and slave trade in East and Central Africa",67: "The European occupation of Southern Rhodesia",80: "The European occupation of Northern Rhodesia", 89: "The European occupation of Nyasaland",102: "Economic developments in Central Africa from the colonial period to independence",108: "Development of the mining industry from the 1890s to the 1920s and its impact on Central Africa",115: "The Central African Federation (Federation of Rhodesia and Nyasaland, 1953–1963)",119: "The struggle for independence in Northern Rhodesia",120: "The struggle for independence in Southern Rhodesia",126: "The struggle for independence in Nyasaland",139: "Causes and Results of the First World War",165: "Developments in the Interwar Period (1919-1939)",189: "Developments in the Interwar Period (1919-1939)",207: "The Communist Revolution in Russia",235: "Development of Autocratic Government in Germany",263: "Causes and Results of the Second World War",285: "Formation of the United Nations Organisation",303: "Post War Alliances",313: "The Cold War",334: "Decolonisation in India",351: "Kenya",365: "Post-Colonial Crises and Challenges up to 2000"},385],
            LifeSkills: [{1: "Enhancing self-esteem",12: "Time management",18: "Challenges associated with adolescence",31: "Blood donation",36: "Use and abuse of prescribed drugs",39: "Non-communicable diseases",42: "Basic facts about HIV and AIDS",51: "Rights of PLWHA",54: "Social and moral responsibility in one's community",61: "Peaceful co-existence in the community",67: "Morals and values",75: "Cultural practices and HIV and AIDS",78: "Supporting the vulnerable",84: "Effects of sexual identity, sexual health and reproduction and sexualisation on behaviour",91: "Business values and ethics",102: "Managing a business venture",114: "Self esteem",121: "Career planning",131: "Growth and development",128: "Preventive medicine",142: "Basic facts about HIV and AIDS",151: "Blood donation",154: "Social and moral responsibilities in the country",161: "Peaceful co-existence in the country and the world",169: "Morals and values in the nation and the world",175: "Cultural practices, gender and HIV and AIDS",184: "Supporting the vulnerable people in the country and the world",189: "Sexual reproductive health and human behaviour",202: "Sexual harassment",209: "Risk taking and creativity in business",215: "Job seeking strategies",225: "Saving culture",228: "Basic tax calculations"},232],
            BibleKnowledge: [{1: "The Uses of the Bible",6: "Prophet Isaiah",19: "The Word of Second Isaiah",31: "Third Isaiah",37: "The Gospels",42: "The Infancy Narratives",57: "The Ministry of Jesus: Baptism of Jesus and His Temptations",64: "The Ministry of Jesus: Miracles of Jesus",70: "The Ministry of Jesus: The Parables",77: "Jesus' Teaching on Discipleship",84: "Jesus' Teaching about Prayer",90: "Jesus' other Teachings",109: "The Passion of Jesus Christ",126: "The Birth of the Church",131: "The Spread of the Church",139: "The Spread of the Early Church: Paul's Missionary Work",154: "Themes in the Book of Acts",167: "Jesus' Fulfillment of the Old Testament",173: "Worship",180: "Biblical Beliefs",186: "Biblical Practices: Biblical Symbols",191: "Biblical Practices: Marriage",195: "Christianity and Contemporary Issues: Environmental Degradation",201: "Christianity and Contemporary Issues: The Church and State",206: "Christianity and Contemporary Issues: Spread of HIV and AIDS"},213],
            Social: [{1: "Western and Eastern Cultures",29: "Rights of Special Groups",55: "Taxation",74: "Employment",102: "Development",137: "Population Change",157: "Prejudice and Discrimination",171: "Gender Issues in Malawi",195: "Government",222: "Elections",237: "Peaceful Coexistence",252: "International Conflicts",269: "Refugee Crises in Africa and the World",289: "Social and Economic Problems",309: "Interdependence in the Ecosystem",319: "People and the Environment",332: "Courtship and Marriage",351: "Security",360: "Corruption and the Law",370: "Social injustice in Africa",382: "Social Services",399: "Gender issues in Africa",419: "Climate Change",431: "Disaster Risk Management",464: "Global Issues and Challenges",485: "Multiculturalism",493: "Unions and Associations",509: "National Service",519: "International Organizations that Foster Development",537: "International Conventions on Human Rights",551: "Sustainable Development",563: "Developing Nations",577: "International Labour Laws",597: "Economic Policies",609: "Personal Finances",619: "Financial Institutions",635: "Rights and Responsibilities of Financial Service Consumers",649: "Market Forces",661: "Population Policy",691: "Population Growth",703: "Discrimination",717: "Government of Malawi",699: "Good Governance",743: "Taxation",759: "Gender and Development",779: "Population and Social Behaviour-HIV/AIDS",795: "Population and Social Behaviour-Drug Abuse",805: "Responsible Parenthood",809: "Universal Morals and Values",817: "International Peace Initiatives",833: "Social Justice",847: "Social Services",865: "World Cooperation"},875],
            English: [{1: "PAPER I",2: "PAPER II",3: "PAPER III",},4],
            Chichewa: [{1: "PAPER I",2: "PAPER II",3: "PAPER III",},4],
            Geography: [{1: "Land use",13: "Landforms",33: "Riverine features",43: "Costal features",53: "Map work",79: "Statistical methods in Geography",107: "The theory of Continental Drift",117: "The theory of plate tectonics",135: "Mountain building",161: "Volcanism",179: "Earthquakes",193: "Rocks",203: "Riverine landforms",219: "Coastal landforms",233: "Relief features of the ocean basins",251: "World pressure belts",261: "Prevailing winds",274: "Air masses",282: "Fronts",294: "Local winds",306: "Cyclones and anticyclones",320: "Clouds",332: "Precipitation",342: "Rainfall",354: "Climatic regions and world vegetation (Biomes)",376: "Environmental issues",386: "Desertification",396: "Climate change",408: "World fishing",422: "Regional and international trade blocs",437: "Wetlands in Malawi",445: "Wildlife in Malawi",455: "Waste Management",471: "Responses to Climate Change",485: "Minerals",515: "Petroleum in the World",535: "Energy",561: "World Population Distribution and Density",571: "Population Dynamics",599: "Settlements",619: "Urbanisation",635: "World Agriculture",651: "Intensive Rice Farming in Southeast Asia",663: "Intensive Animal Farming in Denmark",673: "Irrigation Farming",683: "Irrigation Farming in Israel",697: "Plantation Farming",703: "Tea Plantation in Malawi",714: "Industrialisation",725: "Industry",739: "Motor Vehicle Industry in Japan",755: "Tourism in Africa",769: "Major World Transport Routes"},785]
        };
		 	
quotesAndSayings = [
    // 1. Focused on effort, determination, knowledge acquisition, and positive study habits. (100 items)
    [
        "The best way to get started is to quit talking and begin doing.",
        "Strive for progress, not perfection.",
        "You don't have to be great to start, but you have to start to be great.",
        "The only place where success comes before work is in the dictionary.",
        "Develop a passion for learning. If you do, you will never cease to grow.",
        "Go the extra mile. It's never crowded.",
        "Reading is to the mind what exercise is to the body.",
        "Don't wish it were easier, wish you were better.",
        "Your hard work will pay off.",
        "The mind once stretched by a new idea, never returns to its original dimensions.",
        "An empty sack does not stand upright.",
        "Diligence is the mother of good luck.",
        "The journey of a thousand miles begins with a single step.",
        "Our greatest glory is not in never falling, but in rising every time we fall.",
        "Failure is simply the opportunity to begin again, this time more intelligently.",
        "If you are not willing to learn, no one can help you. If you are determined to learn, no one can stop you.",
        "The difference between the impossible and the possible lies in a person's determination.",
        "Don't let yesterday take up too much of today.",
        "A goal without a plan is just a wish.",
        "If you quit once, it becomes a habit. Never quit.", // REPLACED
        "Every master was once a disaster.",
        "Keep your eye on the ball.",
        "Success is walking from failure to failure with no loss of enthusiasm.", // REPLACED
        "I haven't failed, I've just found 10,000 ways that won't work.",
        "When the going gets tough, the tough get going.",
        "No matter how hard the past is, you can always begin again.",
        "The secret of getting ahead is getting started.",
        "The best way to appreciate your job is to imagine yourself without one.",
        "Success is not measured by what you accomplish, but by the opposition you have encountered.",
        "Where there is a will, there is a way.",
        "There are two kinds of people: those who do the work and those who take the credit.",
        "Shoot for the moon. Even if you miss, you'll land among the stars.",
        "The only limits are the ones you place on yourself.",
        "Don't stop when you're tired. Stop when you're done.",
        "Success is the sum of small efforts repeated daily.",
        "What we dwell on is who we become.",
        "You must do the things you think you cannot do.",
        "The best preparation for tomorrow is doing your best today.",
        "The beautiful thing about learning is that nobody can take it away from you.",
        "Be stubborn about your goals and flexible about your methods.",
        "The secret of getting ahead is getting started.",
        "Action is the foundational key to all success.", // REPLACED
        "Setting goals is the first step in turning the invisible into the visible.", // REPLACED
        "Determination is the key to success.",
        "If opportunity doesn't knock, build a door.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "In the middle of difficulty lies great opportunity, which we must find.",
        "Focus on being productive instead of busy.",
        "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
        "There is no elevator to success, you have to take the stairs.",
        "Be the change that you wish to see in the world.",
        "Life begins at the end of your comfort zone.",
        "Believe you can and you’re halfway there.", // REPLACED
        "Nothing is impossible, the word itself says 'I'm possible'!",
        "Learning never exhausts the mind.",
        "Study hard, study smart.",
        "Sweat the small stuff when it comes to effort.",
        "Leave no stone unturned.",
        "Consistency is more important than intensity.",
        "Put your nose to the grindstone.",
        "The future belongs to those who prepare for it today.",
        "The harder you work for something, the greater you'll feel when you achieve it.",
        "Fall seven times, stand up eight.",
        "Tomorrow belongs to the people who prepare for it today.",
        "The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.",
        "Genius is 1% inspiration and 99% perspiration.",
        "Make hay while the sun shines.",
        "Always do your best. What you plant now, you will harvest later.",
        "The only way to win is to learn faster than anyone else.",
        "Don't let the fear of striking out keep you from playing the game.",
        "Take risks. If you win, you'll be happy; if you lose, you'll be wise.",
        "Perseverance is not a long race; it is many short races one after the other.",
        "If you want something, go get it. Period.",
        "The man who moves a mountain begins by carrying away small stones.",
        "Press on. Nothing in the world can take the place of persistence.",
        "The road to success and the road to failure are almost exactly the same.",
        "Every moment is a fresh beginning.",
        "Education is the key to unlocking the world.",
        "Learn something new every day.",
        "You can't cross the sea merely by standing and staring at the water.",
        "Take one step at a time.",
        "Do it with passion or not at all.",
        "Always keep your head held high.",
        "It's not about perfect. It's about effort.",
        "Today’s actions are tomorrow’s results.",
        "Success is the progressive realization of a worthy goal.",
        "Be thirsty for knowledge.",
        "Sharpen the saw.",
        "Keep the ball rolling.",
        "The greatest discovery in life is self-discovery.",
        "The future is bright.",
        "The mind is everything. What you think you become.", // REPLACED
        "The difference between winning and losing is most often not quitting.",
        "Your ability to learn is the greatest gift.", // REPLACED
        "Make every day count.",
        "Stay positive.",
        "Attitude is everything.",
        "A winner is a dreamer who never gives up.", // REPLACED
        "Take control.",
        "Every morning, you have two choices: continue to sleep with your dreams, or wake up and chase them."
    ],
    // 2. General wisdom, life skills, and sayings related to time, habits, and self-improvement. (100 items)
    [
        "To err is human; to forgive, divine.",
        "The only true wisdom is in knowing you know nothing.", // REPLACED
        "Don't cry over spilt milk.",
        "Actions speak louder than words.",
        "Variety is the spice of life.",
        "The squeaky wheel gets the grease.",
        "You can't teach an old dog new tricks.",
        "Walk a mile in their shoes.",
        "A picture is worth a thousand words.",
        "All roads lead to Rome.",
        "Let the chips fall where they may.",
        "The early bird gets the worm.",
        "Give credit where credit is due.",
        "You miss 100% of the shots you don't take.",
        "There is no time like the present.",
        "Better safe than sorry.",
        "He who hesitates is lost.",
        "The apple doesn't fall far from the tree.",
        "Do unto others as you would have them do unto you.",
        "A stitch in time saves nine.",
        "Burn the candle at both ends.",
        "Cross that bridge when you come to it.",
        "If you want to go fast, go alone. If you want to go far, go together.",
        "Don't give up the day job.",
        "The cat is out of the bag.",
        "A friend in need is a friend indeed.",
        "The proof is in the pudding.",
        "It takes two to tango.",
        "When you judge others, you do not define them, you define yourself.", // REPLACED
        "The grass is always greener on the other side of the fence.",
        "All that glitters is not gold.",
        "Birds of a feather flock together.",
        "Honesty is the best policy.",
        "Two wrongs don't make a right.",
        "Look before you leap, for you know not where you will fall.", // REPLACED
        "An apple a day keeps the doctor away.",
        "The show must go on.",
        "There's no place like home.",
        "You can't have your cake and eat it too.",
        "If you can't beat 'em, join 'em.",
        "Absence makes the heart grow fonder.",
        "Beauty is in the eye of the beholder.",
        "Necessity is the mother of invention.",
        "People who live in glass houses shouldn't throw stones.",
        "Practice what you preach.",
        "The best things in life are free.",
        "Too many cooks spoil the broth.",
        "What goes around comes around.",
        "While the cat's away, the mice will play.",
        "A drowning man will clutch at a straw.",
        "Be kind, for everyone you meet is fighting a battle you know nothing about.", // REPLACED
        "The unexamined life is not worth living.", // REPLACED
        "Don't look a gift horse in the mouth.",
        "Good things come to those who wait.",
        "Don't judge a book by its cover, but by what's inside.",
        "Rome wasn't built in a day.",
        "The best revenge is massive success.", // REPLACED
        "Strike while the iron is hot.",
        "To each his own.",
        "Don't burn your bridges.",
        "The walls have ears.",
        "Every dark cloud has a silver lining.",
        "It's raining cats and dogs.",
        "Give someone the benefit of the doubt.",
        "The quieter you become, the more you are able to hear.",
        "In the nick of time.",
        "Put your best foot forward and never give up.",
        "Take it with a grain of salt.",
        "Once in a blue moon.",
        "You can lead a horse to water, but you can't make him drink.",
        "That's the last straw.",
        "Put your foot in your mouth.",
        "Under the weather.",
        "Speak of the devil.",
        "Money doesn't grow on trees.",
        "The elephant in the room.",
        "If you always do what you always did, you will always get what you always got.",
        "The greatest discovery in life is self-discovery.",
        "The truth is rarely pure and never simple.", // REPLACED
        "Cost an arm and a leg.",
        "A journey of a thousand miles begins with a single step.", // REPLACED
        "Back to the drawing board.",
        "Add insult to injury.",
        "The only thing necessary for the triumph of evil is for good men to do nothing.", // REPLACED
        "When pigs fly.",
        "By the skin of your teeth.",
        "Nothing comes from nothing.",
        "You must be the change you wish to see in the world.", // REPLACED
        "Go back to square one.",
        "Get a taste of your own medicine.",
        "Give him the cold shoulder.",
        "Every dog has his day.",
        "Look after the pennies, and the pounds will look after themselves.",
        "Comparing apples to oranges.",
        "If you want to live a happy life, tie it to a goal, not to people or things.", // REPLACED
        "Cry over spilled milk.",
        "Throw caution to the wind.",
        "Half a loaf is better than none",
        "Take a rain check.",
        "It's no use crying over spilt milk."
    ],
    // 3. Focused on caution, avoiding procrastination, consequences of poor choices, and attention to detail. (100 items)
    [
        "Look before you leap.",
        "Don't count your chickens before they are fully ready to hatch.", // REPLACED
        "Curiosity killed the cat.",
        "It's no use locking the stable door after the horse has bolted.",
        "You reap what you sow.",
        "The devil is in the details.",
        "Cut your coat according to your cloth.",
        "Don't put all your eggs in one basket.",
        "If you can't stand the heat, get out of the kitchen.",
        "Beware of Greeks bearing gifts.",
        "The devil is in the details, so pay close attention.", // REPLACED
        "A bird in the hand is worth two in the bush.",
        "You can lead a horse to water, but you can't make him drink.",
        "An ounce of prevention is worth a pound of cure.",
        "Never trouble trouble until trouble troubles you.",
        "Don't judge a book by its cover.",
        "Measure twice, cut once.",
        "The darkest hour is just before the dawn.",
        "Don't throw the baby out with the bathwater.",
        "Never invest in a business you cannot understand.", // REPLACED
        "Where there's a will, there's a loophole.",
        "Give him an inch and he will surely take an entire mile.", // REPLACED
        "A drowning man will clutch at a straw.", // REPLACED
        "The only thing we have to fear is fear itself.", // REPLACED
        "Be careful what you wish for.",
        "Don't miss the forest for the trees.",
        "A moment of patience in a moment of anger prevents a hundred moments of regret.", // REPLACED
        "That ship has sailed.",
        "Don't air your dirty laundry in public.",
        "You made your bed, now lie in it.",
        "Discretion is the better part of valor.",
        "Fools rush in where angels fear to tread.",
        "The road to hell is paved with good intentions.",
        "If you can't be good, be careful.",
        "Don't throw good money after bad.",
        "Better the devil you know than the devil you don't.",
        "Never look a gift horse in the mouth.",
        "Never bite the hand that feeds you.",
        "Don't cross the bridge until you come to it.",
        "If you lie down with dogs, you get up with fleas.",
        "When in doubt, do nothing.",
        "If you play with fire, you get burned.",
        "Never spend your money before you have earned it.",
        "A word to the wise is sufficient.",
        "Be careful what you wish for, you just might get it.",
        "One false move and you're out.",
        "Better safe than sorry.",
        "There are two sides to every coin.",
        "Don't change horses in midstream.",
        "If you cannot beat the system, don't try to change it.",
        "Give him enough rope and he will hang himself.",
        "You scratch my back, and I'll scratch yours.",
        "Let sleeping dogs lie.",
        "Loose lips sink ships.",
        "He who lives by the sword shall die by the sword.",
        "The best defense is a good offense.",
        "There's many a slip 'twixt the cup and the lip.",
        "A drowning man will clutch at a straw.",
        "The biggest lesson in life is to know that even fools are right sometimes.", // REPLACED
        "Don't sell the bear's skin before you have caught the bear.",
        "You can't make an omelet without breaking a few eggs.",
        "Never attribute to malice that which is adequately explained by stupidity.", // REPLACED
        "Don't let your mouth write checks your body can't cash.",
        "Hindsight is 20/20, but foresight is divine.", // REPLACED
        "Leave well enough alone.",
        "Once bitten, twice shy.",
        "Nothing good happens after midnight.",
        "Forewarned is forearmed.",
        "Keep your friends close and your enemies closer.",
        "Penny wise, pound foolish.",
        "The cure is worse than the disease.",
        "Slow and steady wins the race.",
        "Be careful what you put in writing.",
        "Don't buy a pig in a poke.",
        "Don't jump the gun.",
        "It is no use crying over spilt milk.", // REPLACED
        "You cannot get blood from a stone.", // REPLACED
        "The road to hell is paved with good intentions.", // REPLACED
        "Where there is a loophole, use it carefully.",
        "You can't get blood from a stone.",
        "A leopard cannot change its spots.",
        "If you don't succeed, try, try again.",
        "Never put off till tomorrow what you can do today.",
        "An idle mind is the devil's workshop.",
        "Where ignorance is bliss, 'tis folly to be wise.",
        "It is better to keep your mouth shut and appear stupid than to open it and remove all doubt.",
        "The best laid schemes of mice and men often go awry.",
        "The consequences of a bad decision always outweigh the speed of the decision.",
        "Every action has an equal and opposite reaction.",
        "You must think twice before speaking once.", // REPLACED
        "If you can't be a good example, then you'll just have to be a terrible warning.",
        "Don't be penny-wise and pound-foolish.",
        "The biggest risk is not taking any risk.",
        "Procrastination is the thief of time.",
        "Never take a permanent decision based on a temporary emotion.",
        "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        "The harder you work for something, the greater you’ll feel when you achieve it.",
        "Don’t watch the clock; do what it does. Keep going.",
        "It always seems impossible until it’s done.",
        "Fall seven times and stand up eight."
    ]
];



// Import the functions needed from the SDKs
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
  import { 
    getDatabase, 
    ref, 
    push, 
    onChildAdded, 
    off 
  } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

  // web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD1CmCEhsvyKoTrwnuMtJqu9JkiMvJterk",
    authDomain: "msce-g-studies-tracker-baa6f.firebaseapp.com",
    databaseURL: "https://msce-g-studies-tracker-baa6f-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "msce-g-studies-tracker-baa6f",
    storageBucket: "msce-g-studies-tracker-baa6f.firebasestorage.app",
    messagingSenderId: "1082032866052",
    appId: "1:1082032866052:web:212d976ac9663306c70651",
    measurementId: "G-0VTT4D856F"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  
  // Initialize Realtime Database and expose functions to app.js
  const database = getDatabase(app);

  // attach these to the 'window' object so  existing app.js 
  // functions can access them globally.
  window.database = database;
  window.ref = ref;
  window.push = push;
  window.onChildAdded = onChildAdded;
  window.off = off;

  console.log("Firebase initialized and ready!");
