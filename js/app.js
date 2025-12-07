			let db = null;
            let daysPassed;
            let hoursExpected;
            let todaySubjectReminders = [];
            const ThisWeekMonday = lastMonday();
			const todaycheck = new Date().toISOString().split('T')[0];
            const forgotForm = document.getElementById('reLoginForm');
            const loginForm = document.getElementById('loginForm');
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const errorMessage = document.getElementById('errorMessage');
            const successMessage = document.getElementById('successMessage');
            
			
			let labstudyData = {}
            // Data storage - uses browser's local storage
             
            
            

            let labChatsData = {
                chats: [],
                AIchats: []
            }

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
                            }
			let quotesAndSayings = [];
			let topics = {};
            let studyTopics = {};
            let subjectnames = {};
            let pathLink = labChatsData.chats;
            let chatPollingIntervalId = null;
            let timeStamp = Date.now();
            const CHAT_POLLING_INTERVAL = 30000;

            // dd/mm/yyyy
            const today = new Date().toISOString().split('T')[0];
            let GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzVgUYoIQCSnm__YH3gW4kvNqUV_Rs1y9qxw1BEd-wzm1p5hKEm3TmCico1ALRc_I8R/exec';
            

            

        function startChatPolling(){
            if(chatPollingIntervalId){
                clearInterval(chatPollingIntervalId);
            };
            getChats();
            chatPollingIntervalId = setInterval(getChats,CHAT_POLLING_INTERVAL)
        }

        function stopChatPolling(){
            if(chatPollingIntervalId !== null){
                clearInterval(chatPollingIntervalId);
                chatPollingIntervalId =  null;
            }
        }
        async function getChats(){
            const chats = await callGasApi('chats',{task: 'task',timeStamp: timeStamp});
                        if (chats.length >0){
							console.log(chats)
							timeStamp = chats.timeStamp;
							chatSave(chats,pathLink,'chats');
                                chatbox()
							}
        }
		async function loadStaticData() {
			try {
				// 1. Fetch the data.json file from the same directory
				const response = await fetch('data.json');
				
				// 2. Check for a successful response (e.g., file found)
				if (!response.ok) {
					//throw new Error(`HTTP error! Status: ${response.status} - Could not load data.json`);
				}
				
				// 3. Parse the JSON response body
				const data = await response.json();
				
				// 4. Assign the parsed data to your global variables
				quotesAndSayings = data.quotesAndSayings || [];
				topics = data.topics || [];
				
				//console.log('Static data loaded successfully.');

			} catch (error) {
				//console.error('Failed to load static data:', error);
				// You can use a fallback here if the fetch fails (e.g., hardcoded default)
				quotesAndSayings = ["Error: Quotes failed to load."]; 
			}
		}


	 function toggleMenu() {
        document.getElementById("menu").classList.toggle("active");
        }
       
    function startRedirect_SignIn() {
        const frame = document.getElementById("appFrame")
        document.querySelectorAll('.tab-content').forEach(tab => {
                    tab.classList.remove('active');
                 });
                 document.getElementById("appFrame").classList.add('active');
        //console.log('Starting')
        frame.src = "https://script.google.com/macros/s/AKfycbx7-kpkhNWmH3OsmIDUnynqP4Yxli-TdusS_ymzpYqB5s4AGHBpYjEmisCTKscf7wbN/exec"   
        }
        
		
         
           
            //splitTextForWaveEffect('#quoteDisplay')
            /**
			 * Splits the text content of an element into individual spans for animation.
			 * @param {string} selector - The CSS selector for the element to split (e.g., '#quoteDisplay').
			 */
			function splitTextForWaveEffect(selector) {
				
				const index = Math.random();
				const selectedQuote = quotesAndSayings[Math.floor(index*3)][Math.floor(index*100)]
				console.log(Math.floor(index*3),Math.floor(index*100),selectedQuote)
				
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

            
           async function callGasApi(action, params = {}, elementId){
                
				if(!(elementId === 'NOT')){
					const URL = await loadData("URL")
					if (URL){
						GAS_WEB_APP_URL = URL; 
						console.log('updatedUSEDFrom inside');
					} 
				}
				let payload = {
				  action: action // Required for the GAS switch statement
				};
				// 2. Append User ID and Trust (if elementId is not 'NOT')
				if(!(elementId === 'NOT')){
				  payload.user_ID = labstudyData.userInfo[0].userId;
					payload.trust = labstudyData.userInfo[0].approved.toString();
				};
				for(const key in params){
				  if(params.hasOwnProperty(key)){
					payload[key] = params[key];
				  }
				}
					try{
					  // --- CRITICAL CHANGE: Using POST method with JSON body ---
					  const response = await fetch(GAS_WEB_APP_URL,{
					    method: 'POST', 
					    headers: {
							'Content-Type': 'text/plain;charset=utf-8'
					    },
					    
					    body: JSON.stringify(payload) 
					  }); 
					

				  if(!response.ok){
					throw Error(`HTTP error! Stetus: ${response.stetus}`);
				  }
				  const pureResponse = await response.json();
				  //console.log('updated:', pureResponse);
				  // Authentication handling (logic from original code)
				  if(pureResponse[0] === false){
					labstudyData = {};
					await saveData('labstudyTrackerData',labstudyData);
					console.log('updated: change');
				  }
				  // URL Update logic (from original code)
					if ((pureResponse[1] !== GAS_WEB_APP_URL)) {
						await saveData('URL',pureResponse[1]);
						console.log('updated:from server', pureResponse[1]);
					}

					return pureResponse[0];
				}catch (error) {
					console.error("API Call Failed:", error);
					// showMessage('Could not connect to the server. Check your internet connection.', 'error');
					return { success: false, error: 'Network or server communication failure.' };
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
					console.error(chartDataUrl);
					
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
					console.log('Chart loaded successfully.');
                    i += 1
				} else {
					console.error('Failed to load chart: Unexpected response format.');
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
                document.getElementById('textprompt-ai').style = 'display: none;'
                dropdown.style = 'display: block;'
                if (action !== 'submit')
                        {dropdown.innerHTML = '';

                    labstudyData.sessions.reverse().forEach(session => {
                        const option = document.createElement('option');
                        option.value = session.id;
                        option.textContent = `${session.topic} ${session.date}`
                        const key = session.id
                        quizData.sessionTopic.push([session.id,session.topic,session.notes])
                        dropdown.appendChild(option);
                        //console.log(quizData)
                    });
                }else{
                    const topic = dropdown.value;
                    
                    for (sessionT of quizData.sessionTopic){
                        console.log(sessionT[0],topic)
                       let sTIndex = String(sessionT[0]) === String(topic);
                       if(sTIndex){
                        //console.log('sTIndex')
                        quizData.sessionTopic = sessionT;
                        const makeQuiz = await callGasApi('makeQuiz',{
                            topic: sessionT[1]+'.'+sessionT[2]
                        })
                        if(makeQuiz[0]){
                            quizData.quizQuestions = makeQuiz[1];
                            
                            quiz();
                            return;
                        }
                                }
                        }
                    }
            }

            function quiz(action) {
				//resize container so that nodthing is not shown
                document.getElementById('prompt-container-ai').stlye = `display: none`;
                const chatContainer = document.getElementById('AIchatsList');
                const quizContainer = document.createElement('form');
                const sessionTopic = document.createElement('header');
                const disableAI = document.getElementById('mode-button');
                const disableSent = document.getElementById("send-button-ai");
                sessionTopic.textContent = quizData.sessionTopic[1]
                quizContainer.appendChild(sessionTopic)
                
                quizContainer.id = 'quizForm';
                i = 1;
                quizData.quizQuestions.forEach(question =>{
                    const questionContainer = document.createElement('strong');
                    questionContainer.textContent = i+'	'+question.question;
                    quizContainer.appendChild(questionContainer);
                    if(!(action === 'answears')){
                        const selection = document.createElement('select')
                        selection.id = 'question'+i;
                        selection.required = true;
                       
                        
                        const placeholderOption = document.createElement('option');
						placeholderOption.textContent = '--- Select an Answer ---';
						placeholderOption.value = ''; // Set value to empty string for validation
						placeholderOption.disabled = true; // User cannot re-select this
						placeholderOption.selected = true; // Make this the initial default
						selection.appendChild(placeholderOption);
                        const options = ['A','B','C','D'];
                        options.forEach(option =>{
                            const questionOption = document.createElement('option');
                            questionOption.textContent = option+'. '+question[option];
                            selection.appendChild(questionOption)

                        });
                        quizContainer.appendChild(selection);
                    }else{
                       
                        const qAnswear = document.createElement('p');
                        qAnswear.style = 'color: green;';
                        qAnswear.textContent = `🎯 `+question[question.answear];
                        quizContainer.appendChild(qAnswear);
                        if(i === 5){
                            document.getElementById('prompt-container-ai').style = 'display: block;'
                        }
                    }
                    i += 1;
                    
                });
                if(!(action === 'answears')){
                    disableAI.style = 'display: none;';
                    disableSent.style = 'display: none;';
                    const submitBt = document.createElement('input');
                    submitBt.type = 'submit'
                    quizContainer.appendChild(submitBt);
                }
                else{
                    disableAI.style = 'display: block;';
                    disableSent.style = 'display: block;';
                }
                chatContainer.appendChild(quizContainer);
                document.getElementById('quizForm').addEventListener('submit', function(e) {
                e.preventDefault();
                quizAdmin();
                }
                
            )
            }

            async function quizAdmin(){
                i = 1
                let totalmarks = 0;
                quizData.quizQuestions.forEach(quizQuestion =>{
                    const studentChoise = String(document.getElementById('question'+i).value.trim('.')[0]);
                    if (studentChoise === String(quizQuestion.answear)) {
                       //console.log(studentChoise,'studentChoise',quizQuestion.answear,i);
                       totalmarks += 2;
                    }
                    else{
                    //console.log(studentChoise)
                    }
                    i +=1
                })
                document.getElementById('AIchatsList').innerHTML = ``;
                const Quizresultscont = document.getElementById('Quizresultscont');
                const adminfeedback = document.createElement('label')
                
                const overallRate = (totalmarks / 10) * 100;
                for (session of labstudyData.sessions){ 
                
                    if(String(session.id) === String(quizData.sessionTopic[0])){
						if (totalmarks > 0){
							const stars = Math.floor(totalmarks / 2); 	
							session.rate = '⭐'.repeat(stars);
							await cloudQuizSave({id: session.id,rate: session.rate});
                            await saveData('labstudyTrackerData',labstudyData);
						};
                        
                       
                    }
                };
                if (overallRate > 50) {
                    Quizresultscont.style = 'display: block;background-color: green;';
                    adminfeedback.innerHTML = `🏆NICE!!`
                }
                else{
                    Quizresultscont.style = 'display: block;background-color: red;';
                    adminfeedback.innerHTML = `🥇Review this topic before days.`
                }
                const Quizresults = document.getElementById('Quizresults');
                Quizresults.textContent = overallRate.toFixed(1) + '%';
                Quizresultscont.appendChild(adminfeedback)
                quiz('answears')
                
           
            }

            async function sessionSave (){
                const number_Of_Off_s = labstudyData.sessions.length;
                if (number_Of_Off_s > 0){
                console.log(await cloudQuizSave())  
                    const number_Of_Clo_s = await callGasApi('sessionsSave',{
                        number_Of_Off_s: number_Of_Off_s,
                        tacks: 'number_Of_Clo_s'});
                        
                    console.log(number_Of_Clo_s);
                    if(number_Of_Clo_s[1] < number_Of_Off_s && number_Of_Clo_s.length === 2){
                        let i = 1;
                        let sessionsArry = [];
                        let subject_TIDsArray = [];
                        labstudyData.subjects.forEach(subject =>{
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
                        for(const session of labstudyData.sessions){
                            if (i > number_Of_Clo_s[1]){
                                sessionsArry.push(session);
                            }
                            i += 1;
                        };
                        if (sessionsArry.length > 0){
						const sessionsToSave = JSON.stringify(sessionsArry);
                        const quizSessionUpdate = JSON.stringify(await cloudQuizSave());
						const topicsToUpdate = JSON.stringify([subject_TIDsArray,processesStudiedSessions()])
                        const is_saved = await callGasApi('sessionsSave',{
                                    tacks: sessionsToSave,
                                    tacks2: topicsToUpdate,
                                    tacks3: quizSessionUpdate
                                    });
                         //console.log(is_saved[1]);
                        if(is_saved[1] === 'Session batch saved successfully.'){
							labstudyData.studied = [];
							//console.log('Cleared')
							await saveData('labstudyTrackerData',labstudyData);
                            await saveData('QuizRates',[])
						}
                                
                                }
                    }
                    else if (number_Of_Clo_s.length > 2){
						//labstudyData.sessions.length = 0
                        number_Of_Clo_s[2].forEach(session =>{
                            labstudyData.sessions.unshift(session);
                        })
                        await saveData('labstudyTrackerData',labstudyData)
                    }
                }
            }

            function AIchatbox(){
                hour = new Date().getHours();
                day = new Date().getDay();
    
                const chatContainer = document.getElementById('AIchatsList')
                 // Study chats
            chatContainer.innerHTML = '';
            if((17<=20)){//has placeHolder for max request a day
                const recentChatsSorted = [labChatsData.AIchats].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 25);

                recentChatsSorted.forEach(chats => {
                    chats.forEach(chat =>{
                        console.log(chat)
                        const sessionDiv = document.createElement('div');
                        time = new Date(chat['chatId']).toLocaleTimeString()
                        me = (chat.senderId == labstudyData.userInfo[0].username)
                        if (!me){
                            sessionDiv.className = 'message chat-card';
                            messager = chat.senderId;
                            sessionDiv.innerHTML = `
								<h4>${messager}    ${time}</h4>`;
							
							//console.log(chat.prompt)
                            chat.prompt.forEach(line =>{
								message = document.createElement('p');
								message.textContent = line;
								sessionDiv.appendChild(message)})
						}
                        else{
                            sessionDiv.className = 'message mychat-card';
                            messager = 'You';
                            message = chat.prompt
                            sessionDiv.innerHTML = `
								<h4>${messager}    ${time}</h4>
								<p>${message}</p>
							`;
                        };
                        
                        chatContainer.appendChild(sessionDiv);
                    })
            });
            }
                else{
                    const sessionDiv = document.createElement('div');
                    document.getElementById("textprompt").style = 'display: none;'
                    time = new Date(Date.now()).toLocaleTimeString()
                    sessionDiv.className = 'message reminder';
                    sessionDiv.innerHTML = `
                    <h4>AI   ${time}</h4>
                    <p>Your friends are studying don\`t disturb them now.</p>
                `;
                chatContainer.appendChild(sessionDiv); 
            };
                if (labChatsData.AIchats.length > 10){
                    labChatsData.AIchats.pop()
                };
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
			
                //console.log(currentModeDisplay.value)
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
                    console.log(currentModeDisplay.textContent)
                    if(currentModeDisplay.textContent === 'Quiz'){
						isEmpty = false;
						console.log('Bypassed')
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
							//console.log('Mode set to:');
                        }else{
							textarea.placeholder = `Just require only thinking!! Nice quiz`;
							quizMaker();
							
						}
                        // 3. Log or trigger action based on new mode
                        console.log('Mode set to:', newMode);
                        // **TODO: Integrate state management here to save the selected mode.**
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
                    
                    if (promptText) {
                        console.log(`Sending Prompt (${currentMode}): "${promptText}"`);
                        if(currentMode === 'Quiz'){
                            loading.classList.add('rotate')
                            loading.style.display = 'block'
                            await quizMaker('submit') ;
                            loading.classList.remove('rotate');
                            loading.style.display = 'none';
                            
                        }
                        else if (currentMode === 'Question'){
                            loading.classList.add('rotate')
                            loading.style.display = 'block'
                            await chatPrompt(promptText,kind) 
                            loading.classList.remove('rotate')
                            loading.style.display = 'none';
                            
                        }
                        else if(currentMode === 'Chat'){
                            loading.classList.add('rotate');
                            loading.style.display = 'block';
                            chatPrompt(promptText,kind)
                             loading.classList.remove('rotate')
                            loading.style.display = 'none';
                            
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
            
              // Show message function
            function showMessage(message, type,time) {
                if (type === 'error') {
                    errorMessage.textContent = message;
                    errorMessage.style.display = 'block';
                    successMessage.style.display = 'none';
                } else {
                    successMessage.innerHTML = `<p id="quoteDisplay" >${message}</p>`
                    successMessage.style.display = 'block';
                    errorMessage.style.display = 'none';
                }
                
                // Auto-hide messages after 3 seconds
                if(time && time !== 'static'){
					seconds = time * 1000;
                }else{
					seconds = 3000;
				}
				
				if(time !== 'static'){
                    setTimeout(() => {
                        successMessage.style.display = 'none';
                        errorMessage.style.display = 'none';
                    }, seconds);
				}
            }
            
            async function chatPrompt(text,kind) {
                
                if (kind === "ai"){
                    pathLink = labChatsData.AIchats;
                    chatSave(text,pathLink,false);
                    try{
                        const answear = await callGasApi('askQuestion', { 
                        question: text
                        },kind);
                        
                        //answear = JSON.parse(localStorage.getItem('aiAnswer'))
                        //localStorage.setItem('aiAnswer',JSON.stringify(answear[1]))
                        //answear = [true,[1,3,'you',5]]
                        if(answear[0]){
							//console.log(answear)
                            chatSave(answear[1],pathLink,true);
                            AIchatbox()
                        }
                        
                    }
                    catch (error) {
                        // Handle network/fetch errors
						console.error("Error:", error);
                        showMessage('Could not connect to the server. Check your internet connection.', 'error',id);
                    }
                    
                }else{
                    pathLink = labChatsData.chats;
                    
                    try{
                       const chats = await callGasApi('chats', {
                       chatId: Date.now(),
                       senderId: labstudyData.userInfo[0].username,
						prompt: text
                        },kind);
                        
                        //chats = JSON.parse(localStorage.getItem('ochats'))
                        if(chats[0]){
							// chats = JSON.parse(localStorage.getItem('ochats'))
                        //localStorage.setItem('ochats',JSON.stringify(chats
                        //console.log(chats);
                            chatSave(chats,pathLink,'chats');
                            chatbox()
                        }
                    }
                    catch (error) {
                        // Handle network/fetch errors
                        console.error("Error:", error);
                        showMessage('Could not connect to the server. Check your internet connection.', 'error');
                    }
                }
                
                
            }
            
            function chatSave(prompt,type,AI){
                hour = new Date().getHours();
                day = new Date().getDay();
                if(AI !== 'chats'){
                    if (AI){
                    sender = 'GIC AI'
                    }
                    else{
                        sender = labstudyData.userInfo[0].username
                    }
                      
                        type.push(
                            {
                                chatId: Date.now(),
                                senderId: sender,
                                prompt: prompt
                            }
                        );
                }else{
					type.length = 0
                    prompt.forEach(message =>{
                    console.log(message);
                        type.push(message);
                        //console.log(message);
                    })
                }
            }           
            
            function scrollToBottom(divElement){
				divElement.scrollTop = divElement.scrollHeight;
			}

            function chatbox(){
                hour = new Date().getHours();
                day = new Date().getDay();
                const chatContainer = document.getElementById('chatsList')
                 // Study chats
                chatContainer.innerHTML = '';
                if((17<=hour && hour<20) || (day === 6 || day === 0 )){
                const recentChatsSorted = [labChatsData.chats].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 25);
				
                labChatsData.chats.forEach(chat => {
                    const sessionDiv = document.createElement('div');
                    time = new Date(parseInt(chat.chatId)).toLocaleTimeString()
                    me = chat.senderId === labstudyData.userInfo[0].username
                    if (!me){
                        sessionDiv.className = 'message chat-card';
                        messager = chat.senderId}
                    else{
                        sessionDiv.className = 'message mychat-card';
                        messager = 'You';
                    }
                    
                    sessionDiv.innerHTML = `
                        <h4>${messager}    ${time}</h4>`;
                    // Correct way:
					const msgP = document.createElement('p');
					msgP.textContent = chat.prompt;
					sessionDiv.appendChild(msgP);
                    chatContainer.appendChild(sessionDiv);
                    scrollToBottom(chatContainer)
                    console.log(chat)
                });
                }
                    else{
                        const sessionDiv = document.createElement('div');
                        document.getElementById("prompt-container-chat").style = 'display: none;'
                        time = new Date(Date.now()).toLocaleTimeString()
                        sessionDiv.className = 'message reminder';
                        sessionDiv.innerHTML = `
                        <h4>AI   ${time}</h4>
                        <p>Your friends are studying don't disturb them now.</p>
                    `;
                    chatContainer.appendChild(sessionDiv); 
                };
                if (labChatsData.chats.length > 25){
                    labChatsData.chats.pop()
                };
            }

            async function weekendAnalysis(){
				let WeekReport;
                const savedReport = await loadData('report');
                console.log(savedReport);
                    if (savedReport) {
						console.log('savedReport')
						WeekReport = savedReport; 
						thisWeekReport = WeekReport[1]
                    }
                week = 24*60*60*1000*7
                todayTime = Date.now()
                const dayIndex = new Date(new Date()).getDay();
                oneWeek = Math.abs(todayTime - week);
                const lastReportTime = thisWeekReport.date;
                console.log(lastReportTime);
                if(Math.abs(todayTime - lastReportTime) >= week && (dayIndex >=5 || dayIndex === 0) ){
                    aiRequest = ['I am '+labstudyData.userInfo[0]['username']+' ,my goal is to pass MSCE exams <20 points.This is not easy here in Malawi.Please help me to do that any way.Constract academic research report based on my this week studies below.No fake report that will just interest me. I want real one that will make me success, even one that seems to hate me.'];
                    let total_Hours = 0
                    labstudyData.sessions.forEach(session =>{
                        if(new Date(session.date).getTime() >= oneWeek){
                            
                            //console.log(total_Hours,'Lthis')
                            let studied = `subject: ${subjectnames[session.subjectId]},Date: ${session.date}, hours spent: ${session.hours}, Quiz Admin rate: ${session.rate}, Notes for you to focus: ${session.notes}.`;
                            if(session.subjectId === 1){
                                studied = `subject: ${subjectnames[session.subjectId]},Date: ${session.date}, numberOfQuestSolved: ${session.numberOfQuestSolved}, Quiz Admin rate: ${session.rate}, Notes for you to focus: ${session.notes}.`;
                            }else{
                                total_Hours += session.hours;
                            }
                            
                            aiRequest.push(studied)
                        };
                    })
                    if (Object.keys(labstudyData.missedsubjects).length > 0){
                        aiRequest.push(`Total studied hours this week: ${total_Hours} out of these missed Subjects hours + ${total_Hours}. I have missed the following sesseions:`);
                        Object.keys(labstudyData.missedsubjects).forEach(key =>{
                            missedTopics = Object.entries(labstudyData.missedsubjects[key]).join('->')
                            if(missedTopics){
                            missedsubject = subjectnames[key]+'; '+missedTopics
                            aiRequest.push(missedsubject);}
                        }) 
                    } 
                    
                    console.log(total_Hours,aiRequest)
                    if (aiRequest.length > 1){
                        try{
                           
                            WeekReport = await callGasApi('generateWeeklyReport',{
                            prompt: aiRequest,
                              
                            }); 
                            if(WeekReport[0]){
								thisWeekReport = WeekReport[1];
								console.log(thisWeekReport);
								thisWeekReport.date = Date.now();
								console.log('thisWeekReport')
								await saveData('report',WeekReport);
								
							}
                        }catch (error){
                            console.log(error)
                        }
                    }

            }
                    
                if(thisWeekReport.yTubeQuery.length > 1){       

                    const report = document.getElementById('report');
                    report.innerHTML = '';
                    report.innerHTML = `<h2 style="font-size: larger; color: red; text-align: center;font-family: 'Times New Roman', Times, serif;">Week Review & Analysis</h2>
                                        `
                    const reportCont = document.createElement('div')

                    try{
                        
                        
                        reportCont.className = 'message reminder'
                        reportCont.innerHTML = `<header>${thisWeekReport.title}</header><br>
                                        <p>${thisWeekReport.intro}</P><br>
                                        <p>${thisWeekReport.body}</P><br>
                                        <p>${thisWeekReport.conclunsion}</P><br>
                                        <div>
                        <a href="https://www.youtube.com/watch?v=${thisWeekReport.yTubeQuery[0]}" target="_blank" rel="noopener noreferrer">
                        <img src="https://img.youtube.com/vi/${thisWeekReport.yTubeQuery[0]}/hqdefault.jpg" alt="YouTube Video" width='100%'>
                        </a><p>${thisWeekReport.yTubeQuery[1]}</p></div>
                        <div >
                        <h2>Studies Breakdown</h2>
                        <img id="lineChartImage" class="chart" src="" alt="Study Breakdown Pie Chart" >
                        <!-- chart will appear here -->
                        
                            <h2>Subject Study Breakdown</h2>
                            <img id="pieChartImage" class="chart" src="" alt="Study Breakdown Pie Chart" >
                        </div>
                        <div class="divider"><span>---</span></div>
                        <div><button id="saveBtn">Save</button></div>`
                        
                    }catch {
                        reportCont.classList = 'message reminder';
                        reportCont.style = 'color: red;';
                        reportCont.innerHTML = `<strong>Something went wrong. Please Get back online</strong>`
                    }
                    report.appendChild(reportCont);
                    loadPieChart(WeekReport[2])
                }
            }

            function missedSubjects(){
                    today_long = new Date(); 
                      
                    try{
                        labstudyData.subjects.forEach(subject =>{
                            const topics = subject.tid;
                            const dates = Object.keys(topics);
                            missedTopics = {}
                            dates.forEach(date => {
                                const dt = new Date(date.slice(0,3)+ ' ' + date.slice(3,5)+' '+ date.slice(5));    
                                if (dt < today_long && !(dt.toLocaleDateString('en-GB') === today_long.toLocaleDateString('en-GB'))){
                                    missedTopics[date] = topics[date];
                                    
                                }
                            });
                            labstudyData.missedsubjects[subject.id] = missedTopics;
                        })
                    }catch (error){
                        console.warn(error)
                    }

            }

            function upDateProfile(){
                const userDataInfo = labstudyData.userInfo[0];
                const profileCont = document.getElementById('userDetails');
                profileCont.innerHTML = `<label><strong>Username:</strong> ${userDataInfo.username}</label>
										<label><strong>Your LinkedID:</strong> ${userDataInfo.linkID}</label>
                                        <label><strong>You are under:</strong> ${userDataInfo.userLinkedId}</label>
                                        <br>
                                        `;
                const networkcont = document.createElement('div');
                networkcont.className = 'remainder'
                networkcont.innerHTML = `<header>This is your Network</header>
										<canvas id="myNetworkChart" style="width: 100%; height: 400px;"></canvas>`
                profileCont.appendChild(networkcont);
                
				const chartData = {
					parent: { name: userDataInfo.linkID },
					children: userDataInfo.network
				};

				
				drawNetworkChart('myNetworkChart', chartData);
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

				// Parent Position (Centered near the top)
				const pPos = { x: canvas.width / 2, y: 50 };

				// Child Positions (Distributed horizontally near the bottom)
				const aW = canvas.width - 2 * padding;
				const startX = padding;
				const cY = canvas.height - 80;
				const cPositions = data.children.map((_, i) => ({
					x: startX + (aW / (numChildren - 1 || 1)) * i,
					y: cY
				}));

				// --- Draw Links ---
				ctx.strokeStyle = '#3b82f6';
				ctx.lineWidth = 1;
				ctx.beginPath();
				cPositions.forEach(cPos => {
					ctx.moveTo(pPos.x, pPos.y + pR);
					ctx.lineTo(cPos.x, cPos.y - cR);
				});
				ctx.stroke();

				// --- Draw Nodes and Labels ---
				const drawNode = (pos, radius, color, label, isParent) => {
					// Draw Circle
					ctx.fillStyle = color;
					ctx.beginPath();
					ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
					ctx.fill();
					ctx.stroke();

					// Draw Label
					ctx.fillStyle = '#1f2937';
					ctx.font = '12px Arial';
					ctx.textAlign = 'center';
					const labelY = isParent ? pos.y + radius + 15 : pos.y - radius - 5;
					ctx.fillText(label, pos.x, labelY);
				};

				// Draw Parent
				drawNode(pPos, pR, '#10b981', data.parent.name, true);

				// Draw Children
				data.children.forEach((child, i) => {
					const label = `${child}`;
					drawNode(cPositions[i], cR, '#f59e0b', label, false);
				});
			}

            // Switch between tabs
            async function switchTab(tabName) {
                console.log('switch')
                try{
					keyTrust();
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
						Timetable();
						const links = await callGasApi('networkLinks');
						const userDataInfo = labstudyData.userInfo[0]
						if (links.length === 2 && userDataInfo.network.length !== links[0]){
							userDataInfo.network = links[1];
							await saveData('labstudyTrackerData',labstudyData)
						}
						upDateProfile();
					}
                }catch{

                }
            }
            
         
			
			function Timetable() {

            const rowscontainer = [document.getElementById('Monday'),document.getElementById('Tuesday'),document.getElementById('Wednesday'),document.getElementById('Thursday'),document.getElementById('Friday'),document.getElementById('Saturday'),document.getElementById('Sunday')]
            rowscontainer.innerHTML = '';
            rows = ['Mon','Tue','Wed','Thu','Fri','Monday','Tuesday','Wednesday','Thursday','Friday']
            for (i=0;i<5;i++) {
                const cell = document.createElement('td');
                
                cell.innerHTML = rows[i+5];
                rowscontainer[i].appendChild(cell);
                subjectLimit = 1
            labstudyData.subjects.forEach(subject => {
                if (subject.days.includes(rows[i]) && subjectLimit <= labstudyData.userInfo[0].number_subjects_day){
                    const cell1 = document.createElement('td');
                    cell1.innerHTML = `${subject.name}`;    
                    rowscontainer[i].appendChild(cell1);
                    subjectLimit +=1
                }
            });
           }
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
				  console.log('IndexedDB ready.');
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
					labstudyData = val;           // keep same global name you used
					console.log(labstudyData)
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

			


			function keyTrust(){
                try{
                    is_Allowed = labstudyData.userInfo[0].approved === true;
                    //console.log(is_Allowed)
                }
                catch {
                    is_Allowed = false
                }
                
               if (!is_Allowed){
				 //labstudyData = {}
                 //console.log('runFalse')
                 document.querySelectorAll('.tab-content').forEach(tab => {
                    tab.classList.remove('active');
                 });
                 document.getElementById('login').classList.add('active');
                 const menuCont = document.getElementById('menu-container');
                 menuCont.style = 'display: none;'
                 return is_Allowed
               }
               //console.log('runTrue')
               return is_Allowed
            }
            

        function processesStudiedSessions(){
            try{
                const studiedDict = {}
                labstudyData.studied.forEach(Element =>{
                    if (!studiedDict[Element[0]]){
                        studiedDict[Element[0]] = [];
                        studiedDict[Element[0]].push(Element[1]);
                    }else{
                        studiedDict[Element[0]].push(Element[1]) 
                    }
                })
                //console.log('here10',studiedDict)
                return studiedDict;
                }catch (error){
                    console.warn(error);
                }
        }

        // Log a study session
       
        const subjectSelected = document.getElementById('studySubject');
        subjectSelected.addEventListener('focusout', function(e){
            
            var studyHours = document.getElementById('studyHours');
            const subjectID = subjectSelected.value
            //console.log(subjectID)
            if (subjectID === '1'){
                studyHours.min = 4;
                studyHours.max = 24;
                studyHours.placeholder = 4;
                document.getElementById('hourslabel').textContent= `Number Of Questions Solved`;
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
                    
                    note = '. I\`ve  wrapped up my study session on: '+topic+'. plus my onw topic choise: '+topicnotes+' . '+notes
                }
                else{
                    topic = topicnotes;
                    note = 'Today I\`ve studied: '+topic+' on my wish. '+notes;
                } 
                if(subjectId === '1'){
                    labstudyData.sessions.push({
                        id: Date.now(),
                        subjectId: parseInt(subjectId),
                        date: date,
                        topic: topic,
                        numberOfQuestSolved: parseFloat(hours),
                        notes: note,
                        rate: 0
                    })
                    studyHours.min = 1;
					studyHours.max = 3;
					studyHours.placeholder = 2;
					document.getElementById('hourslabel').textContent= `Hours Studied`;
					}
                else{
                    labstudyData.sessions.push({
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
                    labstudyData.subjects.some(subject =>{if(subject.id === parseInt(subjectId)){subjectTopicsdict = subject.tid}});
                    key = Object.keys(subjectTopicsdict).find(key => subjectTopicsdict[key] === topic);
                    
                    //console.log('here1',key)
                    labstudyData.studied.push([subjectId,key]) 
                    delete subjectTopicsdict[key];
                }
                //showMessage('Study session saved successfully!','sucess',2);

               
            }
            else if(missedTopic){
                topic = labstudyData.missedsubjects[subjectId][missedTopic];
                missedDate = new Date(missedTopic.slice(0,3)+' '+missedTopic.slice(3,5)+' '+missedTopic.slice(5)).toLocaleDateString('en-GB');
                if(subjectId == '1'){
                    labstudyData.sessions.push({
                        id: Date.now(),
                        subjectId: parseInt(subjectId),
                        date: date,
                        topic: topic,
                        numberOfQuestSolved: parseFloat(hours),
                        rate: 0,
                        notes: '. I\'ve covered: '+topic+' to be back on track for missing it earlier on: '+missedDate+". "+notes             
                        });  
                }else{                    
                    labstudyData.sessions.push({
                        id: Date.now(),
                        subjectId: parseInt(subjectId),
                        date: date,
                        topic: topic,
                        hours: parseFloat(hours),
                        rate: 0,
                        notes: '. I\'ve covered: '+topic+' to be back on track for missing it earlier on: '+missedDate+". "+notes             
                    });
                }
                        
                delete labstudyData.missedsubjects[subjectId][missedTopic];
                
                var subject = labstudyData.subjects.find(subject => subject.id === parseInt(subjectId))
                    
                        //console.log('here2',missedTopic)
                        //labstudyData['studied'] = []
                        labstudyData.studied.push([subjectId,missedTopic])
                        delete subject.tid[missedTopic];
                        //showMessage('compensated  successfully!','sucess',2);
                
            }
             // Update subject completed hours
                subject = labstudyData.subjects.find(s => s.id === parseInt(subjectId));
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
                await saveData('labstudyTrackerData',labstudyData);
                splitTextForWaveEffect('#quoteDisplay');
                document.getElementById('missedT').style.display = 'block'
                document.getElementById('myowntopic').style.display = 'block'
                try{
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
                missedSubjectTopicsdic = labstudyData.missedsubjects[subjectId]
                
                subjectTopicsdic = Object.entries(missedSubjectTopicsdic);
                if (subjectTopicsdic.length > 0){
                    document.getElementById('myowntopic').value = ''
                    document.getElementById('myowntopic').style.display = 'none'
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
                labstudyData.subjects.some(subject =>{if (subject.id === subjectId){subjectsel = subject.name; return true}});
                subjectTopicsdic = topics[subjectsel][0];
                subjectTopicsdic = Object.entries(subjectTopicsdic);
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

                labstudyData.subjects.forEach(subject => {
                    const option = document.createElement('option');
                    option.value = subject.id;
                    option.textContent = subject.name;
                    dropdown.appendChild(option);
                });
            }catch (error){
                console.warn(error)
            }
        }

        // Update progress display
        function updateProgress() {
            // Update stats
            const filteredSessions = labstudyData.sessions.filter(session => session.subjectId !== 1);
            const totalHours = filteredSessions.reduce((sum, session) => sum + session.hours, 0);
            document.getElementById('totalHours').textContent = totalHours.toFixed(1);
            const PaceRate = document.getElementById('CompletionRate')
            document.getElementById('subjectsCount').textContent = labstudyData.subjects.length;

           
            // Update progress bars
            const container = document.getElementById('progressList');
            container.innerHTML = '';

            labstudyData.subjects.forEach(subject => {
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
             const filteredSubjects = labstudyData.subjects.filter(subject => subject.id !== 1);
            const total_Hourscompleted = filteredSubjects.reduce((sum, subject) => sum + subject.completedHours, 0);
            const totalPlanned = filteredSubjects.reduce((sum, subject) => sum + subject.plannedHours, 0);
            const todayRate = hoursExpected > 0 ? (total_Hourscompleted/hoursExpected) * 100 : 0;
            console.log(todayRate.toFixed(1))
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
                
                const todaySessions = labstudyData.sessions.filter(session => session.date === today);
                const todaystopic = {};
                const subjectNames = {};

                // Check for subjects not studied today
                labstudyData.subjects.forEach(subject => {
                    const studiedToday = todaySessions.some(session => session.subjectId === subject.id);
                    const weekdays = {1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 6:'Sat',7:'Sun'}
                    dat = new Date();
                    day_no = dat.getDay();
                    
                    day = weekdays[day_no];
                    
                    bool = subject.days.includes(day);
                    subjectNames[subject.id] = subject.name;
                    try{
                    if(Object.entries(labstudyData.missedsubjects[subject.id]).length > 0){

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
                        console.error('An error occurred: '+error);
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
                            const reminder = document.createElement('div');
                            reminder.style.padding = '10px';
                            reminder.style.margin = '5px 0';
                            reminder.style.background = '#ffeaa7';
                            reminder.style.borderRadius = '5px';
                            if (todayTopic){
                                reminder.innerHTML = inner;
                            }
                            else{
                                if(subject.plannedHours <= subject.completedHours){
                                    reminder.innerHTML = `🌟 Woow! you've finnished planned sessions for <strong>${subject.name}</strong> .<br>🔬 It's time for your random reviews.`;
                                }
                            }
                            container.appendChild(reminder);
                            

                            
                            
                                                                
                        }}
                    
                        
                });
                
                if (container.children.length === 0 && new Date().getDay() <= 6 && new Date().getDay() >=1) {
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
                console.warn(error)
            }
        }
        function lastMonday() {
            let lastMonday;
            let todayDate = new Date()
            
            while (true){
                n = 1
                if(todayDate.getDay() === 1){
                    lastMonday = todayDate
                    console.log('loopingbackward')
                    break;
                }
                        
                todayDate.setDate(todayDate.getDate() - n)
                
            }
             return lastMonday;
        }
       
       
        // Update review section
        function updateReview() {
            // Weekly feedback
            const feedbackContainer = document.getElementById('weeklyFeedback');
            const historyContainer = document.getElementById('studyHistory');

            if (labstudyData.sessions.length === 0) {
                feedbackContainer.innerHTML = '<p>Start logging your study sessions to see feedback and improvements!</p>';
                historyContainer.innerHTML = '<p>No study sessions recorded yet.</p>';
                return;
            }

            // Calculate weekly stats
            const oneWeekAgo = ThisWeekMonday;
            const rSessions = labstudyData.sessions.filter(session => 
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
            const recentSessionsSorted = [...labstudyData.sessions].reverse();

            recentSessionsSorted.forEach(session => {
                const subject = labstudyData.subjects.find(s => s.id === session.subjectId);
                const sessionDiv = document.createElement('div');
                sessionDiv.className = 'study-card';
                //console.log(subject.name)
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
                        ${session.notes ? `<p>Notes: ${session.notes}</p>` : ''}
                    `;
                
                historyContainer.appendChild(sessionDiv);
            });
        }



        // Set today's date as default in study log
        document.getElementById('studyDate').value = today;










        

        // Initialize the app
        window.addEventListener('load', async function () {
			await initDB(); // app starts
			//switchTab('track')
			//await saveData('labstudyTrackerData',[])
			await loadData('labstudyTrackerData','onload');
			console.log(labstudyData)
            
            day = 1000*60*60*24;
            try{
				const user_plan = labstudyData.userInfo[0];
				daysPassed = Math.abs(parseInt((new Date(today).getTime()-user_plan.fMEdate[0])/day)-1);
                //console.log(daysPassed,user_plan.fMEdate[0])
                const dateDate = user_plan.fMEdate;
                now = Date.now();
                const daysToGo = Math.abs(parseInt((new Date(today).getTime()-dateDate[2])/day));
                let rem;
                if(!(dateDate[1] < now && dateDate[2] > now)){
                    console.log('inside',now);
                    showMessage('Account deactived. Pay to activate before two months','error',5)
                    rem = {id:'r'+ Date.now(),title: 'Study Tracker Reminder',body: 'Account deactived. Pay to activate before two months.'};
                    showLocalNotification(rem);
                }
                else if(daysToGo <= 5){
                    showMessage(`You've remain with ${daysToGo} days. Please get online to avoid data loss.`,'error',5);
                    rem = {id:'r'+ Date.now(),title: 'Study Tracker Reminder',body: `You've remain with ${daysToGo} days. Please get online to avoid data loss.`};
                    showLocalNotification(rem)
                }
                
				const weekPassed = parseInt(daysPassed/7)
				if(weekPassed > 0){
					daysPassed -= weekPassed*2
                
            }
            hoursExpected = user_plan.hours_session* user_plan.number_subjects_day * daysPassed
            //console.log()
            }catch (e){console.warn(e)}
            try{
            requestNotificationPermission();
            registerServiceWorker();
            syncRemindersOnLoad();
            createReminder('r'+ Date.now(),'Study Tracker Reminder','Solve Maths everyday.',new Date().toISOString(),'Dairy')
            console.log('Reminder system ready');
        }catch(e){       
            console.error('Init failed', e);
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
    const password = passwordInput.value;
    
   
   
    
    // Basic validation
    if (!username || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Check credentials call GAS
    try {
        const message = await callGasApi('login', {
            email_username: username,
            password: btoa(password)
        },'NOT');
		console.log('called')
       
        if (message && message[0] === true) { 
            showMessage('Login successful! Redirecting to your timetable...', 'success');
            
            
            setTimeout(() => {
               
                
                // 4. DATA ASSIGNMENT
                labstudyData = { 
                    userInfo: message[1],
                    subjects: message[2],
                    missedsubjects: {},
                    sessions: [],
                    studied: []
                }
                
				updateDisplay();
                showMessage(`Welcome ${labstudyData.userInfo[0].username}! You are now logged in.`, 'success',3);
                
                
                 // ... (UI state changes) ...
                document.getElementById('login').classList.remove('active');
                document.getElementById('track').classList.add('active');
                // Reset form
                loginForm.reset();
            }, 2000);
            await saveData('labstudyTrackerData',labstudyData);
            
        } else {
            console.log(labstudyData,message)
            showMessage(message[1], 'error');
            passwordInput.value = '';
            passwordInput.focus();
        }
    } catch (error) {
        // Handle network/fetch errors
        console.warn("Login API Call Error:", error);
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
                    const message = await callGasApi('forgot_password', {
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
                        console.log(message)
                        showMessage(message[1], 'error');
                    }
                } catch (error) {
                    // Handle network/fetch errors
                    console.warn("Login API Call Error:", error);
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
stBt.addEventListener('click', async () => {
	const currentmode = document.getElementById('current-mode-ai').textContent;
	if(currentmode === 'Quiz'){
        
        loading = document.getElementById('loading-ai');
        loading.classList.add('rotate')
        loading.style.display = 'block'
        console.log('locked')
		await quizMaker('submit');
        loading.classList.remove('rotate');
        loading.style.display = 'none';
	}
	})

                

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
            console.log('SW registred', reg);
            // try to register periodic sync (optional)
            if('periodicSync' in reg){
                try{
                    await reg.periodicSync.register('reminder-sync',{minInterval: 15 * 60 * 1000});
                     console.log('Periodic sync registered (may not be supported)');
                }catch(e){
                    console.warn('PeriodicSync failed', e)
                }
            }
            return reg;
        }
        else{
            console.error('Service workers not supported');
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

  
