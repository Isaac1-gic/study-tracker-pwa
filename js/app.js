        let db = null;
        let daysPassed;
        let hoursExpected;
        let todaySubjectReminders = [];
        const today = new Date().toISOString().split('T')[0];
        let requestURL = 'https://script.google.com/macros/s/AKfycbzIt9LUD3EXJbgSsPPMCVhmT-QN8DtX_HVENtE8cpxjztTHzK1fLA_LJKeC0yWENY82/exec';
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
                    // Data storage - uses browser's local storage
            

                    
                    

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
        let chatPollingIntervalId = null;
        let timeStamp = Date.now();
        const CHAT_POLLING_INTERVAL = 30000;
		let SPACE_TIME = CHAT_POLLING_INTERVAL;
                    // dd/mm/yyyy
        
        function startChatPolling(){
            const hour = new Date().getHours();
            const day = new Date().getDay();
            if ((hour >= 17 && hour < 20) || (day === 6 || day === 0)) {
            if(chatPollingIntervalId){
                clearInterval(chatPollingIntervalId);
            };
            getChats();
            chatPollingIntervalId = setInterval(getChats,CHAT_POLLING_INTERVAL)
            }     
        }

        function stopChatPolling(){
            if(chatPollingIntervalId !== null){
                clearInterval(chatPollingIntervalId);
                chatPollingIntervalId =  null;
            }
        }
        async function getChats(){
            try{
            const chats = await HTTPSrequest('chats',{task: 'task',timeStamp: timeStamp});
                        if (chats && chats.length > 0){
							
							timeStamp = chats[0].timeStamp;
							chatSave(chats,pathLink,'chats');
                                chatbox()
							}
            } catch (e){}
        }
		


	 


function toggleMenu() {
    const menu = document.getElementById("menu");
    if(menu) menu.classList.toggle("active");
}
       
        
		
function startRedirect_SignIn() {
    const frame = document.getElementById("appFrame");
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    frame.classList.add('active');
    frame.src = "https://script.google.com/macros/s/AKfycbxDwzoi81qU5OT--Ue6AqASSMo27dgh_pouiMEcerDeGhfrY7x-3D_VtMfdN2HzFKs/exec"; 
}
           
            //splitTextForWaveEffect('#quoteDisplay')
            /**
			 * Splits the text content of an element into individual spans for animation.
			 * @param {string} selector - The CSS selector for the element to split (e.g., '#quoteDisplay').
			 */
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
					// Wrap each character (except spaces) in a span
					if (char !== ' ') {
						// Apply a custom delay property (data-delay) for staggering the wave
						newHTML += `<span class="wavy-letter" style="animation-delay: ${i * 0.05}s;">${char}</span>`;
					} else {
						newHTML += ' '; // Preserve spaces outside the span
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
				  action: action // Required for the GAS switch statement
				};

				// 2. Append User ID and Trust (if elementId is not 'NOT')
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
					  // --- CRITICAL CHANGE: Using POST method with JSON body ---
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
					showMessage('Chart unavailable. ' + chartDataUrl, 'warning');
					imgElement.style.display = 'none';
					return;
				}
				
				// Check if the response is valid (should be the Base64 Data URL string)
				if (typeof chartDataUrl === 'string' && chartDataUrl.startsWith('data:image/png;base64,')) {
					// Set the Base64 Data URL as the image source
					imgElement.src = chartDataUrl;
					imgElement.style.display = 'block';
					
                    i += 1
				} else {
					
					imgElement.alt = 'Failed to load chart due to data format error.';
					imgElement.style.display = 'none';
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
    
    const header = document.createElement('header');
    header.textContent = title+" Quiz Time!";
    quizContainer.appendChild(header);

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
                            }
                                    
                                    }
                        }
                        else if (number_Of_Clo_s.length > 2){
                            //userStudyData.sessions.length = 0
                            number_Of_Clo_s[2].forEach(session =>{
                                userStudyData.sessions.unshift(session);
                            })
                            await saveData('labstudyTrackerData',userStudyData)
                        }
                    }
                }catch (e){}
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
	 scrollToBottom(chatContainer);
    if (labChatsData.AIchats.length > 20) labChatsData.AIchats.shift();
}            

            

async function promptSwitch(kind = String) {
                
                const textarea = document.getElementById('textprompt-'+kind);
                
                const sendButton = document.getElementById('send-button-'+kind);
                let newMode;
                const modeButton = document.getElementById('mode-button');
                const modeDropdown = document.getElementById('mode-dropdown');
                const currentModeDisplay = document.getElementById('current-mode-'+kind);
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
                            textarea.style.height = 'auto'; // Reset height
                        }
                       
                        textarea.value = '';
                        resizeTextarea(); // Reset height and disable button
                    }
                });

                // Allow 'Shift + Enter' for new lines, but 'Enter' alone to send
                textarea.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault(); // Prevent default new line insertion
                        sendButton.click(); // Trigger the send button
                    }
                });

                // Initial resize/check on load
                resizeTextarea();
            

                
            }

function showMessage(message, type, time) {
    if (type === 'error') {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
    } else {
        // Safe Text Injection
        const quoteP = document.getElementById('quoteDisplay');
        if (quoteP) {
            quoteP.textContent = message;
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
        }
    }

    const duration = (time && time !== 'static') ? time * 1000 : 3000;
    if (time !== 'static') {
        setTimeout(() => {
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
        }, duration);
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
			
            if ((hour > !17 && hour < !20) || (day !== 6 && day !== 0)) return;
            const chats = await HTTPSrequest('chats', {
                chatId: Date.now(),
                senderId: userStudyData.userInfo[0].username,
                prompt: text,
                timeStamp: timeStamp
            }, kind);

            if (chats && chats[0]) {
                getChats(); 
            }
        } catch (error) {
            showMessage("Failed to send. Please try again.",'error');
        }
    }
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
		
        prompt.forEach(message => {
           if(!labChatsData.IDs.includes(message.chatId) ) type.push(message); labChatsData.IDs.push(message.chatId);
          
           
        });
    }
}            
            
            function scrollToBottom(divElement){
				divElement.scrollTop = divElement.scrollHeight;
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
            
            const p = document.createElement('p');
            p.textContent = chat.prompt; 
            sessionDiv.appendChild(header);
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
        sessionDiv.textContent = `AI ${time}: Your friends are studying. Don't disturb them now. Chat opens 17:00-20:00.`;
        chatContainer.appendChild(sessionDiv);
    }

    if (labChatsData.chats.length > 60) {
        labChatsData.chats.shift(); 
    }
}

            async function weekendAnalysis(){
				let WeekReport;
                const savedReport = await loadData('report');
                
                    if (savedReport) {
						
						WeekReport = savedReport; 
						thisWeekReport = WeekReport[1]
                    }
                week = 24*60*60*1000*7
                todayTime = Date.now()
                const dayIndex = new Date(new Date()).getDay();
                oneWeek = Math.abs(ThisWeekMonday.getTime()-((week/7)*2));
                const lastReportTime = thisWeekReport.date;
               
                if(Math.abs(todayTime - lastReportTime) >= week && (dayIndex >=5 || dayIndex === 0) ){
                    aiRequest = ['I am '+userStudyData.userInfo[0]['username']+' ,my goal is to pass MSCE exams <20 points.This is not easy here in Malawi.Please help me to do that any way.Constract academic research report based on my this week studies below.No fake report that will just interest me. I want real one that will make me success, even one that seems to hate me.'];
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
                           
                            WeekReport = await HTTPSrequest('generateWeeklyReport',{
                            prompt: aiRequest,
                              
                            }); 
                            if(WeekReport[0]){
								thisWeekReport = WeekReport[1];
								
								thisWeekReport.date = Date.now();
								
								await saveData('report',WeekReport);
								
							}
                        }catch (error){
                            
                        }
                    }

            }
                    
                if(thisWeekReport.yTubeQuery.length > 1){       

                    try{
                        
                        
                        
                        document.getElementById('title').textContent = thisWeekReport.title;
                        document.getElementById('intro').textContent = thisWeekReport.intro;
                        document.getElementById('body').textContent = thisWeekReport.body;
                        document.getElementById('concl').textContent = thisWeekReport.conclunsion;

                        const youtubeCont = document.getElementById('youtube');
                        youtubeCont.innerHTML = '';
                        youtubeCont.innerHTML = `<a href="https://www.youtube.com/watch?v=${thisWeekReport.yTubeQuery[0]}" target="_blank" rel="noopener noreferrer">
                                                <img src="https://img.youtube.com/vi/${thisWeekReport.yTubeQuery[0]}/hqdefault.jpg" alt="YouTube Video" width='100%'>
                                                </a><p>${thisWeekReport.yTubeQuery[1]}</p><br>`
                                                
                        
                    }catch {
                        showMessage("Failed to make report. Please try again.",'error');
                    }
                    loadPieChart(WeekReport[2])
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
                        startChatPolling();
                    }
                    else{
                        stopChatPolling();
                    };

                    if(tabName === 'progress'){
                        updateProgress();
                    }
                    else if (tabName === 'review'){               
                        updateReview();
                    }
                    else if(tabName === 'report'){
                        weekendAnalysis()
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
    
    // Clear existing cells properly
    rowscontainer.forEach(row => { if(row) row.innerHTML = ''; });

    const rows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    for (let i = 0; i < 5; i++) {
        const cell = document.createElement('td');
        cell.textContent = rows[i]; // Use textContent
        if(rowscontainer[i]) rowscontainer[i].appendChild(cell);
        
        let subjectLimit = 1;
        userStudyData.subjects.forEach(subject => {
            if (subject.name !== 'Mathematics') {
                if (subject.days.includes(rows[i]) && subjectLimit <= userStudyData.userInfo[0].number_subjects_day) {
                    const cell1 = document.createElement('td');
                    cell1.textContent = subject.name; // Use textContent
                    if(rowscontainer[i]) rowscontainer[i].appendChild(cell1);
                    subjectLimit++;
                }
            }
        });
    }
    // Handle weekend logic separately if needed
}
    

           
		

			// ========== INIT (call once on start) ==========
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

			// ========== LOAD (returns value or null) ==========
			function loadData(KEY, onloadFlag) {
			  return new Promise((resolve, reject) => {
				if (!db) return reject(new Error('DB not initialized'));
				const tx = db.transaction('Data', 'readonly');
				const store = tx.objectStore('Data');
				const req = store.get(KEY);
				req.onsuccess = e => {
				  const val = (e.target.result === undefined) ? null : e.target.result;
				  if (onloadFlag === 'onload') {
					// your old behavior: assign and update display
					userStudyData = val;           // keep same global name you used
					
					try { updateDisplay();
							switchTab('track') } catch (err) {}
				  }
				  resolve(val);
				};
				req.onerror = e => reject(e.target.error || e);
			  });
			}

			// ========== SAVE (resolves when saved) ==========
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
                    
                    note = '. I\`ve  wrapped up my study session on: '+topic+' plus: '+topicnotes+' . '+notes
                }
                else{
                    topic = topicnotes;
                    note = 'Today I\`ve studied: '+topic+'. '+notes;
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
                if (topic != topicnotes)
                {
                    let subjectTopicsdict = 0;
                    userStudyData.subjects.some(subject =>{if(subject.id === parseInt(subjectId)){subjectTopicsdict = subject.tid}});
                    key = Object.keys(subjectTopicsdict).find(key => subjectTopicsdict[key] === topic);
                    
                    
                    userStudyData.studied.push([subjectId,key]) 
                    delete subjectTopicsdict[key];
                }
                //showMessage('Study session saved successfully!','sucess',2);

               
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
                        notes: '. I\'ve covered: '+topic+' to be back on track for missing it earlier on: '+missedDate+". "+notes             
                        });  
                }else{                    
                    userStudyData.sessions.push({
                        id: Date.now(),
                        subjectId: parseInt(subjectId),
                        date: date,
                        topic: topic,
                        hours: parseFloat(hours),
                        rate: 0,
                        notes: '. I\'ve covered: '+topic+' to be back on track for missing it earlier on: '+missedDate+". "+notes             
                    });
                }
                        
                delete userStudyData.missedsubjects[subjectId][missedTopic];
                
                var subject = userStudyData.subjects.find(subject => subject.id === parseInt(subjectId))
                    
                        
                        //userStudyData['studied'] = []
                        userStudyData.studied.push([subjectId,missedTopic])
                        delete subject.tid[missedTopic];
                        //showMessage('compensated  successfully!','sucess',2);
                
            }
             // Update subject completed hours
                subject = userStudyData.subjects.find(s => s.id === parseInt(subjectId));
                if (subject) {
                    if(subjectId === '1'){
                        subject.quesNumSolved += parseFloat(hours);
                    }else{
                        if(!topicnotes){
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
            const dropdown = document.getElementById('missedT');
            const subjectId = parseInt(document.getElementById('studySubject').value);
            dropdown.innerHTML = '';
                missedSubjectTopicsdic = userStudyData.missedsubjects[subjectId]
                
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
                
        }
        function updateStudyTopicDropdown() {
            const dropdown = document.getElementById('myowntopic');
            const subjectId = parseInt(document.getElementById('studySubject').value);
            dropdown.innerHTML = '';
                subjectsel = 0
                userStudyData.subjects.some(subject =>{if (subject.id === subjectId){subjectsel = subject.name; return true}});
                subjectTopicsdic = topics[subjectsel][0];
                subjectTopicsdic = Object.entries(subjectTopicsdic);
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
                        <p>${subjectiInfoArray[0].toFixed(1)} / ${subjectiInfoArray[1]} ${subjectiInfoArray[2]} (${Math.min(progress, 100).toFixed(1)}%)</p>
                    `;
                
                container.appendChild(card);
            });

            // Update completion rate
             const filteredSubjects = userStudyData.subjects.filter(subject => subject.id !== 1);
            const total_Hourscompleted = filteredSubjects.reduce((sum, subject) => sum + subject.completedHours, 0);
            const totalPlanned = filteredSubjects.reduce((sum, subject) => sum + subject.plannedHours, 0);
            const todayRate = hoursExpected > 0 ? (total_Hourscompleted/hoursExpected) * 100 : 0;
           
            if (todayRate.toFixed(1) > 80){
                PaceRate.textContent = 'Completion Rate: Expected'
            }else{
                PaceRate.textContent = 'Completion Rate: Slow'
            }
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
                    createReminder('Study Tracker Reminders','Study these subjects today: '+todaySubjectReminders.join(', '),new Date().toISOString())
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
            const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
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
                const sessionDiv = document.createElement('div');
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
                if(!stopRequests){
                    if(Date.now() - stopRequests < 24*60*60*1000) requesting = 'STOP';
                }

                // Calculations for Pace/Progress
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
                    } else if (daysToGo <= 5) {
                        showMessage(`Only ${daysToGo} days remaining. Sync online to backup data.`, 'warning', 5);
                    }

                    const weekPassed = parseInt(daysPassed / 7);
                    if (weekPassed > 0) {
                        daysPassed -= weekPassed * 2;
                    }
                    hoursExpected = user_plan.hours_session * user_plan.number_subjects_day * daysPassed;
                }

                // Initialize Services
                await requestNotificationPermission();
                await registerServiceWorker();
                syncRemindersOnLoad();
                
                

            } catch (e) {
                
                // Fallback for static data if fetch fails
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
    
    // Check credentials call GAS
    try {
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

                

    // 1. requestNotificationPermission(): ask for permission
    async function requestNotificationPermission() {
        if (!("Notification" in window)) throw new error("Notifications not supported");
            const result = await Notification.requestPermission();
        if (!(result === 'granted')) throw new error("Notification permission denied");
            return true;
    }

    // 2. registerServiceWorker(): register SW
    async function registerServiceWorker() {
        if ('serviceWorker' in navigator){
            const reg = await navigator.serviceWorker.register('serviceworker.js', {scope: './'});
           
            // try to register periodic sync (optional)
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

    // 5. showLocalNotification(reminder): message SW to show notification
    async function showLocalNotification(reminder) {
        const sw = await navigator.serviceWorker.ready;
        sw.active.postMessage({type: 'SHOW_NOTIFICATION', payload: reminder});
    }

    async function saveReminder(reminders = []) {
        const todayReminders = [];
        if(reminders.length >= 1){
            reminders.forEach(rem =>{
                todayReminders.unshift(rem);
            })
            await saveData('reminders',todayReminders)
        }
    }

    // 4. scheduleInPage(reminder): schedule using setTimeout while page is active
    function scheduleInPage(reminder) {
        const fireAt = new Date(reminder.timeISO).getTime();
        const now = Date.now();
        const ms = fireAt - now;
        if (ms <= 0) return; // already passed or immediate handling should be done elsewhere
        // store timer id to cancel if needed
        reminder._timerId = setTimeout(() => {
            // show notification through SW
            showLocalNotification(reminder);
            if (reminder.repeat === 'daily') {
            // reschedule for next day
            const next = new Date(fireAt + 24*60*60*1000);
            reminder.timeISO = next.toISOString();
            saveReminder([reminder]);
            scheduleInPage(reminder);
            }
        }, ms);
    }

    // 6. syncRemindersOnLoad(): call on app start to schedule upcoming reminders
    async function syncRemindersOnLoad() {
        const all = await loadData('reminders');
        
        all.forEach(rem =>{
            scheduleInPage(rem);
        })
    }

    // Utility to create and register a reminder
    async function createReminder(title, body, timeISO, repeat=null) {
        const id = 'r-'+ Date.now();
        const rem = {id,title,body,timeISO,repeat};
        
        saveReminder([rem]);
        scheduleInPage(rem);
        return rem;
    }

  

