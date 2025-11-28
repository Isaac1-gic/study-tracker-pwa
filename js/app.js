let db;
			const DB_NAME = 'StudyTrackerDB';
			const DB_VERSION = 1;
			const STORE_NAME = 'Data';
			const DATA_KEY = 'labstudyTrackerData';
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
                                date: '2025-11-02'
                            }

            let studyTopics = {};
            let subjectnames = {};
            let pathLink = labChatsData.chats;

            // dd/mm/yyyy
            const today = new Date().toISOString().split('T')[0];
            let GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwG6GX04Mgm20Wg2kQkUS5FMFmsf04M7m1K_ZoGIyz6S_FJJ-lXJCDnSVoRO5MvPf91/exec';
            

            
            const topics = {Mathematics: [{1: "FACTORIZATION",7: "QUADRATIC EQUATIONS",10: "IRRATIONAL NUMBERS",19: "CIRCLE GEOMETRY- CHORD PROPERTIES",25: "ALGEBRAIC FRACTIONS",31: "SETS",41: "MAPPING AND FUNCTIONS",49: "CIRCLE GEOMETRY - ANGLE PROPERTIES",55: "TRANSFORMATIONS",63: "CHANGE SUBJECT OF FORMULA",71: "EXPONENTIAL AND LOGARITHMIC EQUATIONS",78: "TRIGONOMETRY I",84: "SIMILARITY",92: "COORDINATE GEOMETRY",101: "VARIATIONS",114: "GRAPHS OF QUADRATIC FUNCTIONS",125: "INEQUALITIES",134: "STATISTICS I",141: "MATRICES",151: "CIRCLE GEOMETRY III - TANGENTS TO CIRCLE",162: "CIRCLE GEOMETRY III: CONSTRUCTION",171: "STATISTICS II",174: "SIMULTANEOUS LINEAR AND QUADRATIC EQUATIONS",180: "PROGRESSIONS",189: "TRAVEL GRAPHS",201: "TRIGONOMETRY II",209: "POLYNOMIALS",217: "PROBABILITY",228: "VECTORS",238: "LINEAR PROGRAMMING",251: "MENSURATION I: SURFACE AREA AND VOLUME OF SOLIDS",258: "MENSURATION II: THREE-DIMENSIONAL GEOMETRY",267: "GRAPHS OF CUBIC FUNCTIONS"},272],
                            Chemistry: [{1: "Experimental techniques",29: "Nitrogen, Sulphur and Phosphorus",66: "Chemical bonding and properties of matter",90: "Stoichiometry",146: "Chemical Reactions",166: "Alkanols",183: "Alkanals and Alkanones",197: "Alkanole Acids",211: "Alkanoates",220: "Identification of unknown organic compounds",231: "Rates of reactions",264: "Acids and Bases",296: "Reduction and Oxidation reactions",332: "Electrolysis",360: "Isomerism",378: "Polymerisation",390: "Water", 178: "Greenhouse gases and ozone layer", 194: "Waste management"},397],
                            Agriculture: [{1: "Physical properties of soil",20: "Chemical properties of soil",33: "Agricultural development agencies and their services",49: "Farm records and accounts",70: "Farm budgeting",76: "Economic principles for decision making in agriculture",88: "Enterprise combinations",103: "Agricultural cooperatives",109: "Vegetative planting materials",121: "Cropping systems",140: "Mushroom production",160: "Livestock feeds and feeding",167: "Sheep production",181: "Goat production",194: "Soil degradation",201: "Agriculture and climate change: mitigation measures to climate change",212: "Land drainage",218: "Farm mechanisation",228: "Farm power",240: "Gender and agricultural technology",249: "Improved farming technology for food security",259: "Agricultural marketing and trading",277: "Price elasticity of demand and supply",287: "Crop improvement",296: "Crop processing",303: "Pasture",329: "Growing mangoes",344: "The reproductive systems of cattle and poultry and the processes of reproduction",361: "Livestock improvement",369: "Breeds and management of beef cattle",384: "Breeds and management of dairy cattle"},394],
                            Physics: [{1: "Measurements II",27: "Scientific Investigations",54: "The kinetic theory of matter",64: "Thermometry",78: "Pressure",128: "Gas Laws",158: "Scalars and Vectors",173: "Linear Motion",218: "Work and Energy",240: "Machines",266: "Electric Current and Potential Difference",279: "Electrical Resistance",297: "Electric Circuit, Energy and Power",322: "Oscillations and Waves",355: "Sound",380: "Thermal expansion",394: "Newton's laws of motion",421: "Frictional force",432: "Hooke's law",440: "Uniform circular motion",471: "Moment of a force",498: "Magnetism",508: "Electromagnetism",527: "Electromagnetic induction",558: "Introduction to digital electronics",594: "Electromagnetic Spectrum",612: "Light and lenses",650: "Isotopes",655: "Radioactivity"},658],
                            Biology: [{1: "Living things and their environment",49: "Plant structure and function",97: "Vertebrates and invertebrates",107: "Human digestive system",127: "Human circulatory system",147: "Human reproductive system",170: "Genetics I",201: "Plant responses",213: "Human respiratory system",236: "Human excretory system",251: "Co-ordination",274: "Immunity",286: "Genetics II",301: "Evolution",319: "Biotechnology",328: "Infectious and non-infectious diseases"},338],
                            History: [{1: "The 19th and early 20th centuries immigrants into central Africa",35: "Growth of trade in pre-colonial east and central Africa: The Portuguese factor",54: "The Missionary Factor in Malawi",71: "European occupation and administration of central Africa",107: "Economic development in central Africa from colonial rule up to independence",123: "Political developments in central Africa from colonial period to independence",139: "Causes and Results of the First World War",165: "Developments in the Interwar Period (1919-1939)",189: "Developments in the Interwar Period (1919-1939)",207: "The Communist Revolution in Russia",235: "Development of Autocratic Government in Germany",263: "Causes and Results of the Second World War",285: "Formation of the United Nations Organisation",303: "Post War Alliances",313: "The Cold War",334: "Decolonisation in India",351: "Kenya",365: "Post-Colonial Crises and Challenges up to 2000"},385],
                            LifeSkills: [{1: "Enhancing self-esteem",12: "Time management",18: "Challenges associated with adolescence",31: "Blood donation",36: "Use and abuse of prescribed drugs",39: "Non-communicable diseases",42: "Basic facts about HIV and AIDS",51: "Rights of PLWHA",54: "Social and moral responsibility in one's community",61: "Peaceful co-existence in the community",67: "Morals and values",75: "Cultural practices and HIV and AIDS",78: "Supporting the vulnerable",84: "Effects of sexual identity, sexual health and reproduction and sexualisation on behaviour",91: "Business values and ethics",102: "Managing a business venture",114: "Self esteem",121: "Career planning",131: "Growth and development",128: "Preventive medicine",142: "Basic facts about HIV and AIDS",151: "Blood donation",154: "Social and moral responsibilities in the country",161: "Peaceful co-existence in the country and the world",169: "Morals and values in the nation and the world",175: "Cultural practices, gender and HIV and AIDS",184: "Supporting the vulnerable people in the country and the world",189: "Sexual reproductive health and human behaviour",202: "Sexual harassment",209: "Risk taking and creativity in business",215: "Job seeking strategies",225: "Saving culture",228: "Basic tax calculations"},232],
                            BibleKnowledge: [{1: "The Uses of the Bible",6: "Prophet Isaiah",19: "The Word of Second Isaiah",31: "Third Isaiah",37: "The Gospels",42: "The Infancy Narratives",57: "The Ministry of Jesus: Baptism of Jesus and His Temptations",64: "The Ministry of Jesus: Miracles of Jesus",70: "The Ministry of Jesus: The Parables",77: "Jesus' Teaching on Discipleship",84: "Jesus' Teaching about Prayer",90: "Jesus' other Teachings",109: "The Passion of Jesus Christ",126: "The Birth of the Church",131: "The Spread of the Church",139: "The Spread of the Early Church: Paul's Missionary Work",154: "Themes in the Book of Acts",167: "Jesus' Fulfillment of the Old Testament",173: "Worship",180: "Biblical Beliefs",186: "Biblical Practices: Biblical Symbols",191: "Biblical Practices: Marriage",195: "Christianity and Contemporary Issues: Environmental Degradation",201: "Christianity and Contemporary Issues: The Church and State",206: "Christianity and Contemporary Issues: Spread of HIV and AIDS"},213]
                          };
			
			const quotesAndSayings = [
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

/**const sent = ['me','Trans.ID :  CI251124.1034.E48095. Money successfully sent to 980617390, 20000.00, AUSTIN FANOS. Your balance is MK 248469.51.',
            'Trans.ID :  CI251124.1050.G50374. Money successfully sent to 980617390, 400.00, FELIX SQUARE. Your balance is MK 246969.51.',
            'Trans.ID :  CI251124.1517.G78355. Money successfully sent to 980617390, 15000.00, MAHMOUDJOHN MWALE. Your balance is MK 279969.51.',
            'Trans.ID :  PP251124.1622.Y51806. Successful transfer of MK243000.00 to 994667721, MUSSA MBWANA. Bal: MK59969.51. Dial *211# select 2 then 3 for a reversal.',
            'Trans.ID :  CI251124.1741.B95912. Money successfully sent to 992345676, 1000.00, ESNART CHRISTOPHER. Your balance is MK 279869.51.','i']

sent.forEach(message =>{
    try{
        const Trans = message.match(/Trans.ID.:..[\S]+/)[0];
        const Trans_ID = Trans.slice(12,-1);
        const Number_Amount = message.match(/sent.to.[0-9]+,.[0-9]+./)[0];
        const Phone_Number = parseInt(Number_Amount.slice(8,17)) === 980617390;
        const amount = parseInt(Number_Amount.slice(19,-1)) >= 2000;
        if(!amount || !Phone_Number){
            showMessage('Please just paste Transaction message, only Trans.ID will be taken.','error',5);
            return
        }
        
    }catch {
        
        showMessage('Wrong message.For help if message pasted is correct contact: +265980617390','error',5)
        return
    }
    
})**/

    
    function startRedirect_SignIn() {
        
            const DELAY_SECONDS = 0;
            const REDIRECT_URL = "https://script.google.com/macros/s/AKfycbwrqDbRGtsaJcQg16XZ2qYUXNwC_lnysdJBi3doKUI/dev"
            let count = DELAY_SECONDS;
            let deferredPrompt;
        let redirectTimer;
        
        const countdownElement = document.getElementById('signIn');
            // Clear any previous timer to ensure we only have one running
            if (redirectTimer) clearInterval(redirectTimer);
            
            // --- CRITICAL REDIRECT: Start the 5-second countdown to redirect ---
            redirectTimer = setInterval(() => {
                count--;
                countdownElement.textContent = count;
                
                if (count <= 0) {
                    clearInterval(redirectTimer);
                    // Perform the final redirect
                    
                    window.location.replace(REDIRECT_URL); 
                    
                }
            }, 1000);
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
                
               
			    const URL = loadData("URL")
				if (URL){
					// Ensure GAS_WEB_APP_URL is globally available or defined here
					GAS_WEB_APP_URL = URL; 
					console.log('updatedUSED:', GAS_WEB_APP_URL);
				} else {
					
					//GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwG6GX04Mgm20Wg2kQkUS5FMFmsf04M7m1K_ZoGIyz6S_FJJ-lXJCDnSVoRO5MvPf91/exec";
				}
			   GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzUpmWiSdoiYXmL8JXa1sayazFwI32nB_YC2S1ztDtvy0dvJYmEgr06LMInU_MYTQYq/exec";
				console.log('updatedUSED: v117');
			   // 1. Prepare the JSON data payload for the POST request
				let payload = {
				  action: action // Required for the GAS switch statement
				};
				// 2. Append User ID and Trust (if elementId is not 'NOT')
				if(!(elementId === 'NOT')){
				  payload.user_ID = labstudyData.userInfo[0].userId;
					payload.trust = labstudyData.userInfo[0].approved.toString(); // Ensure 'true'/'false' is sent as string
				};
				for(const key in params){
				  if(params.hasOwnProperty(key)){
					payload[key] = params[key];
				  }
				}
					try{
					  // --- CRITICAL CHANGE: Using POST method with JSON body ---
					  const response = await fetch(GAS_WEB_APP_URL,{
					    method: 'POST', // REQUIRED for doPost()
					    
						// 👇 FIX: Must be 'headers' (plural)
					    headers: { 
					      // Do NOT use 'application/json'. Use 'text/plain' to prevent OPTIONS request.
							'Content-Type': 'text/plain;charset=utf-8',
					    },
					    
					    body: JSON.stringify(payload) // Data is sent as a JSON string in the body
					  }); 
					// ... (rest of the try/catch block)

				  if(!response.ok){
					throw Error(`HTTP error! Stetus: ${response.stetus}`);
				  }
				  const pureResponse = await response.json();
				  // Authentication handling (logic from original code)
				  if(pureResponse[0] === false){
					labstudyData = {};
					saveData('labstudyTrackerData',labstudyData);
				  }
				  // URL Update logic (from original code)
					if ((pureResponse[1] !== GAS_WEB_APP_URL)) {
						saveData('URL',pureResponse[1]);
						console.log('updated:', pureResponse);
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


            async function quizMaker(action) {
                const dropdown = document.getElementById('promptST');
                document.getElementById('prompt-container-ai').style = 'display: none;'
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
                document.getElementById('AItextprompt').innerHTML = ``;
                const chatContainer = document.getElementById('AIchatsList');
                const quizContainer = document.createElement('form');
                const sessionTopic = document.createElement('header')
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
                    const submitBt = document.createElement('input');
                    submitBt.type = 'submit'
                    quizContainer.appendChild(submitBt);
                }
                chatContainer.appendChild(quizContainer);
                document.getElementById('quizForm').addEventListener('submit', function(e) {
                e.preventDefault();
                quizAdmin();
                }
            )
            }

            function quizAdmin(){
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
                labstudyData.sessions.forEach(session => {
                    if(String(session.id) === String(quizData.sessionTopic[0])){
						if (totalmarks > 1){
							const stars = Math.floor(totalmarks / 2); 	
							session.rate = '⭐'.repeat(stars);
							saveData('labstudyTrackerData',labstudyData);
						}
                    }
                });
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
						const topicsToUpdate = JSON.stringify([subject_TIDsArray,processesStudiedSessions()])
                        const is_saved = await callGasApi('sessionsSave',{
                                    tacks: sessionsToSave,
                                    tacks2: topicsToUpdate
                                    });
                         //console.log(is_saved[1]);
                        if(is_saved[1] === 'Session batch saved successfully.'){
							labstudyData.studied = [];
							//console.log('Cleared')
							saveData('labstudyTrackerData',labstudyData)
						}
                                
                                }
                    }
                    else if (number_Of_Clo_s.length > 2){
						//labstudyData.sessions.length = 0
                        number_Of_Clo_s[2].forEach(session =>{
                            labstudyData.sessions.unshift(session);
                        })
                        saveData('labstudyTrackerData',labstudyData)
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
                
                const modeButton = document.getElementById('mode-button');
                const modeDropdown = document.getElementById('mode-dropdown');
                const currentModeDisplay = document.getElementById('current-mode-'+kind);
                
                
                console.log(currentModeDisplay.value)
                // --- 1. Textarea Auto-Resize and Send Button Toggle ---

                // Function to resize the textarea height dynamically
                const resizeTextarea = () => {
                    // Reset height to collapse the scrollbar before calculation
                    textarea.style.height = 'auto';
                    
                    // Set the new height, clamped to a max height (15rem)
                    const newHeight = Math.min(textarea.scrollHeight, 15 * 16); // 15rem * 16px/rem
                    textarea.style.height = `${newHeight}px`;

                    // Enable/Disable Send button based on content
                    const isEmpty = textarea.value.trim().length === 0;
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
                modeDropdown.addEventListener('click', (e) => {
                    const modeElement = e.target;
                    if (modeElement.dataset.mode) {
                        const newMode = modeElement.dataset.mode;
                        
                        // 1. Update the display label
                        currentModeDisplay.textContent = newMode;
                        
                        // 2. Hide the dropdown
                        modeDropdown.classList.add('opacity-0', 'pointer-events-none');
                        
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

                sendButton.addEventListener('click', () => {
                    const promptText = textarea.value.trim();
                    const currentMode = currentModeDisplay.textContent;
                    
                    if (promptText) {
                        console.log(`Sending Prompt (${currentMode}): "${promptText}"`);
                        if(currentMode === 'Quiz'){
                            quizMaker('submit');
                        }
                        else if (currentMode === 'Question'){
                            chatPrompt(promptText,kind);
                        }
                        else if(currentMode === 'Chat'){
                            chatPrompt(promptText,kind);
                        }
                        // **TODO: Replace this console log with your actual callGasApi() function**
                        
                        // Clear and reset the input area after sending
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
                        question: prompt
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
                        <h4>${messager}    ${time}</h4>
                        <p>${chat.prompt}</p>
                    `;
                    chatContainer.appendChild(sessionDiv);
                    scrollToBottom(chatContainer)
                    console.log(chat)
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
                if (labChatsData.chats.length > 25){
                    labChatsData.chats.pop()
                };
            }

            async function weekendAnalysis(){
				let WeekReport;
                const savedReport = loadData('report');
                    if (savedReport) {
                       WeekReport = savedReport; 
                       thisWeekReport = WeekReport[1]
                    }
                week = 24*60*60*1000*7
                todayTime = new Date(today).getTime()
                oneWeek = Math.abs(todayTime - week);
                const lastReportTime = Math.abs(new Date(thisWeekReport.date).getTime())
                if((todayTime - lastReportTime) >= week){
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
                        aiRequest.push(`Total studied hours this week: ${total_Hours}. I have missed the following sesseions:`);
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
								thisWeekReport.date = today;
								console.log('thisWeekReport')
								saveData('report',WeekReport);
								
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
                        const chats = await callGasApi('chats',{task: 'task'});
                        if (chats.length >0){
							console.log(chats)
                        chatSave(chats,pathLink,'chats');
                                chatbox()
							}
                    }
                    else if(tabName === 'progress'){
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
							saveData('labstudyTrackerData',labstudyData)
						}
						upDateProfile();
					}
                
            }
            
            function saveAsPDF(id,fileName){
			  const content = document.getElementById(id)
				const options = {
				  margin: 5,
				  filename: fileName,
				  image: {type: 'jpeg',quality: 1},
				  html2canvas: {scale: 1, scrollY: 0},
				  pagebreak: {mode: ['avoid-all','css','legacy']},
				  jsPDF: {
					orientation: 'portriat',
					format: 'a4',
					unit: 'mm'
					}
				};
				html2pdf.set(options).from(content).toPdf().get('pdf').then(function(pdf) {
				  const nPages = pdf.internal.getNumberOfPages();
				  if (nPages > 1){
					pdf.deletePage(2)
				  }
				}).save()
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
           
	// Load data from storage when page loads
            function loadData(DATA_KEY,onload) {
                try{
                    const openAppDB = indexedDB.open('StudyTrackerDB', 2);
                    // This handler runs if the database is new or the version number increases
                    openAppDB.onupgradeneeded = function(event) {
                        db = event.target.result;
                        if (!db.objectStoreNames.contains('Data')) {
                            db.createObjectStore('Data');
                            console.log("IndexedDB Object Store created: 'Data'");
                        }
                    };
                    
                    // This handler runs if the database opens successfully
                    openAppDB.onsuccess = function(event) {
                        db = event.target.result;
                        console.log("IndexedDB connection successful.");
                        // After successful connection, load data immediately on app start
                            if (!db) {
                            console.error("Database not initialized for loading.");
                            return;
                        }
                        
                        // Start a read-only transaction
                        const tx = db.transaction('Data', "readonly");
                        const store = tx.objectStore('Data');
                        const request = store.get(DATA_KEY); // Get the main data object using the constant key

                        request.onsuccess = function(event) {
                            const savedDataInDB = event.target.result;
                            
                            if (onload === 'onload') {
                                // Data found! Update your global variable
                                labstudyData = savedDataInDB;
                                console.log("Data loaded from IndexedDB.");
                                // Final steps after loading data
                                updateDisplay();
                            }
                            
                            
                            return savedDataInDB;
                        };

                        request.onerror = function(event) {
                            console.error("Error reading data from IndexedDB:", event.target.errorCode);
                        };
                    };
                    openAppDB.onerror = function(event) {
                        console.error("Fails to open IndexedDB:", event.target.errorCode);
                    };
                }catch (error){
                    console.log(error);
                    keyTrust()
                }
				
	
                
            }

            
            // Save data to storage
            function saveData(DATA_KEY,dataToSave) {
                    try{
                    if (!db) {
                        console.error("Database not initialized for saving.");
                        return;
                    }

                    // Start a read/write transaction
                    const tx = db.transaction('Data', 'readwrite');
                    const store = tx.objectStore('Data');
                    
                    // Put the entire labstudyData object under the consistent key
                    const request = store.put(dataToSave, DATA_KEY); 

                    request.onsuccess = function() {
                        console.log("Data successfully saved to IndexedDB.");
                    };

                    request.onerror = function(event) {
                        console.error("Error saving data to IndexedDB:", event.target.errorCode);
                    };
                    
                    // The transaction should also complete successfully
                    tx.oncomplete = function() {
                        console.log("Save transaction complete.");
                    };
                    updateDisplay();
                }catch (error){
                    console.log(error)
                }
                
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
				 labstudyData = {}
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
            
        function profile() {
        const storedImageData = loadData('image');
        if (storedImageData) {
        document.getElementById('profileholder').src = storedImageData;}
        else{const pic = document.getElementById('image-input').files[0];
            const fimg = new FileReader();
            fimg.onload = function() {
                const imgdata = fimg.result;
                saveData("image", imgdata);
            };
            fimg.readAsDataURL(pic);}

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

        function logStudySession() {
        
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
                    note = 'Today I\`ve studied: '+topic+' on my wish. '+notes
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
                        subject.completedHours += parseFloat(hours);
                    }
                }
                

                document.getElementById('studyHours').value = '';
                document.getElementById('studyNotes').value = '';
                document.getElementById('studySubject').value   = '';
                document.getElementById("myowntopic").value = '';
                document.getElementById("missedT").value    = '';
                saveData('labstudyTrackerData',labstudyData);
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
            const filteredSubjects = labstudyData.subjects.filter(subject => subject.id !== 1)
            const totalPlanned = filteredSubjects.reduce((sum, subject) => sum + subject.plannedHours, 0);
            console.log(totalPlanned)
            const overallRate = totalPlanned > 0 ? (totalHours / totalPlanned) * 100 : 0;
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
                                reminder.innerHTML = `🌟 Woow! you've finnished planned sessions for <strong>${subject.name}</strong> .<br>🔬 It's time for random sum up.`;
                            }
                            container.appendChild(reminder);
                            

                            
                            
                                                                
                        }}
                    
                        
                });
                
                if (container.children.length === 0) {
                    container.innerHTML = '<p>Great job! You\'re on track with all subjects today. Do the same tomorrow 🎉</p>';
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
//saveData('labstudyTrackerData',labstudyData)
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
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const rSessions = labstudyData.sessions.filter(session => 
                session.subjectId !== 1 
            );
            const recentSessions = rSessions.filter(session => 
                new Date(session.date) >= oneWeekAgo
            );

            const weeklyHours = recentSessions.reduce((sum, session) => sum + session.hours, 0);
            
            let feedback = `<h4>Last 7 Days Summary</h4>`;
            feedback += `<p>You studied <strong>${weeklyHours.toFixed(1)} hours</strong> this week.</p>`;

            if (weeklyHours < 10) {
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
	    loadData('labstudyTrackerData','onload');
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
            password: password
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
                
                showMessage(`Welcome ${labstudyData.userInfo[0].username}! You are now logged in.`, 'success',3);
                
                saveData('labstudyTrackerData',labstudyData);
                 // ... (UI state changes) ...
                document.getElementById('login').classList.remove('active');
                document.getElementById('track').classList.add('active');
                // Reset form
                loginForm.reset();
            }, 2000);
            
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
    }
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
            
            
            
            
            
            
            
        // Periodic Sync Constants
const study_Tag = 'Study-Reminder-Sync'; // Renamed tag for clarity
const min_Interval = 24 * 60 * 60 * 1000; // 1 day in milliseconds (as you set it)

if ('serviceWorker' in navigator && 'periodicSync' in navigator.serviceWorker) {
    navigator.serviceWorker.ready.then(function(swReg) {
        // 1. Check for permission
        navigator.permissions.query({ name: 'periodic-background-sync', public: true })
            .then(function(permissionStatus) {
                if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
                    registerPeriodicSync(swReg);
                } else {
                    console.warn('Periodic Sync permission denied. Background reminders disabled.');
                }
            });
    });
} else {
    console.warn('Periodic Background Sync is not supported on this browser/OS.');
}

function registerPeriodicSync(swReg) {
    swReg.periodicSync.register(study_Tag, {
        minInterval: min_Interval
    })
    .then(() => {
        // This confirms the sync task is successfully scheduled.
        console.log(`Periodic sync registered for tag: ${study_Tag}`);
    })
    .catch(error => {
        console.error('Periodic Sync registration failed:', error);
    });
}
document.getElementById('prompt-container-chat').addEventListener('change', promptSwitch('chat'));
document.getElementById('prompt-container-ai').addEventListener('change', promptSwitch('ai'));

                









