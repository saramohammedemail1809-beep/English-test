// English Placement Test Application
class EnglishTestApp {
    constructor() {
        this.currentLanguage = 'en';
        this.currentSection = 0;
        this.testData = {};
        this.userAnswers = {};
        this.audioRecorder = null;
        this.recordingChunks = [];
        this.isRecording = false;
        this.recordingTime = 0;
        this.recordingTimer = null;
        
        this.sections = ['listening', 'reading', 'speaking', 'writing'];
        this.sectionNames = {
            en: ['Listening', 'Reading', 'Speaking', 'Writing'],
            ar: ['الاستماع', 'القراءة', 'التحدث', 'الكتابة']
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTestData();
        this.updateLanguage();
        
        // Test About page content
        setTimeout(() => {
            const aboutPage = document.getElementById('aboutPage');
            if (aboutPage) {
                console.log('About page found, content length:', aboutPage.innerHTML.length);
                const hasQuote = aboutPage.innerHTML.includes('limits of my language');
                const hasEmail = aboutPage.innerHTML.includes('saramohammedemail1809@gmail.com');
                const hasTikTok = aboutPage.innerHTML.includes('fluent.with.sara');
                console.log('About page contains quote:', hasQuote);
                console.log('About page contains email:', hasEmail);
                console.log('About page contains TikTok:', hasTikTok);
            } else {
                console.error('About page not found!');
            }
        }, 1000);
    }

    setupEventListeners() {
        // Language toggle
        document.getElementById('langToggle').addEventListener('click', () => this.toggleLanguage());

        // Navigation menu
        const navLinks = document.querySelectorAll('.nav-menu a');
        console.log('Found nav links:', navLinks.length);
        navLinks.forEach((link, index) => {
            console.log(`Link ${index}:`, link.textContent.trim());
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const text = link.textContent.trim();
                console.log('Nav link clicked:', text);
                if (text === 'Home' || text === 'الرئيسية') {
                    console.log('Going to Home page');
                    this.showPage('landingPage');
                } else if (text === 'About' || text === 'حول') {
                    console.log('Going to About page');
                    this.showPage('aboutPage');
                } else if (text === 'Test' || text === 'الاختبار') {
                    console.log('Starting test');
                    this.startTest();
                } else if (text === 'Results' || text === 'النتائج') {
                    console.log('Going to Results page');
                    this.showPage('resultsPage');
                } else {
                    console.log('Unknown link text:', text);
                }
            });
        });
        
        // Navigation buttons
        document.getElementById('startTestBtn').addEventListener('click', () => this.startTest());
        document.getElementById('nextListening').addEventListener('click', () => this.nextSection());
        document.getElementById('nextReading').addEventListener('click', () => this.nextSection());
        document.getElementById('nextSpeaking').addEventListener('click', () => this.nextSection());
        document.getElementById('nextWriting').addEventListener('click', () => this.finishTest());
        document.getElementById('skipWriting').addEventListener('click', () => this.skipWriting());
        
        // Results page buttons
        document.getElementById('retakeTest').addEventListener('click', () => this.retakeTest());
        document.getElementById('downloadResults').addEventListener('click', () => this.downloadResults());
        document.getElementById('shareResults').addEventListener('click', () => this.shareResults());
        document.getElementById('deleteData').addEventListener('click', () => this.deleteData());
        
        // Navigation menu links
        this.setupNavigationLinks();
    }

    setupNavigationLinks() {
        // Home link
        const homeLink = document.querySelector('a[data-en="Home"]');
        if (homeLink) {
            homeLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPage('landingPage');
            });
        }


        // Test link
        const testLink = document.querySelector('a[data-en="Test"]');
        if (testLink) {
            testLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.startTest();
            });
        }

        // Results link
        const resultsLink = document.querySelector('a[data-en="Results"]');
        if (resultsLink) {
            resultsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showResultsPage();
            });
        }

    }


    showResultsPage() {
        if (this.userAnswers && Object.keys(this.userAnswers).length > 0) {
            this.showPage('resultsPage');
        } else {
            alert(this.currentLanguage === 'en' ? 'Please take the test first to see results!' : 'يرجى أخذ الاختبار أولاً لرؤية النتائج!');
        }
    }


    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
        this.updateLanguage();
        
        // Update fluency chart if it exists
        if (this.fluencyChart) {
            this.fluencyChart.updateLanguage(this.currentLanguage);
        }
    }

    updateLanguage() {
        const isRTL = this.currentLanguage === 'ar';
        document.documentElement.lang = this.currentLanguage;
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        
        // Update all elements with data attributes
        document.querySelectorAll('[data-en][data-ar]').forEach(element => {
            element.textContent = element.getAttribute(`data-${this.currentLanguage}`);
        });
        
        // Update progress text
        this.updateProgressText();
        
        // Re-render results page if it's currently displayed
        const resultsPage = document.getElementById('resultsPage');
        if (resultsPage && resultsPage.style.display !== 'none') {
            // Re-calculate and display results with new language
            this.scoreTest().then(results => {
                this.displayResults(results);
            });
        }
    }

    updateProgressText() {
        const progressText = document.getElementById('progressText');
        if (progressText) {
            const sectionName = this.sectionNames[this.currentLanguage][this.currentSection];
            const sectionNumber = this.currentSection + 1;
            const totalSections = this.sections.length;
            
            if (this.currentLanguage === 'en') {
                progressText.textContent = `Section: ${sectionName} (${sectionNumber} of ${totalSections})`;
            } else {
                progressText.textContent = `القسم: ${sectionName} (${sectionNumber} من ${totalSections})`;
            }
        }
    }

    loadTestData() {
        // Load test data from external file if available, otherwise use default
        if (typeof TEST_CONTENT !== 'undefined') {
            this.testData = TEST_CONTENT;
        } else {
            // Fallback to embedded data
            this.testData = {
                listening: [
                    {
                        id: 'listening1',
                        description: 'A casual conversation between two friends planning a weekend trip',
                        audioUrl: 'audio/trip_planning.mp3',
                        duration: 40,
                        transcript: "Hey Sarah, are you free this weekend? I was thinking we could go on a little trip. Maybe to the mountains? I know this great hiking trail. We could leave Saturday morning and come back Sunday evening. What do you think? Oh, that sounds amazing! I've been wanting to get out of the city. What time were you thinking? How about we meet at the coffee shop at nine? That way we can grab breakfast before we go. Perfect! But wait, I have a dentist appointment at eight thirty. Can we make it nine thirty instead? Sure, no problem. Let's meet at coffee at nine thirty then. I'll bring some snacks for the hike.",
                        questions: [
                            {
                                id: 'l1q1',
                                type: 'multiple_choice',
                                question: 'What is the main purpose of this conversation?',
                                options: [
                                    'Planning a birthday party',
                                    'Planning a weekend trip',
                                    'Discussing work schedules',
                                    'Talking about the weather'
                                ],
                                correct: 1
                            },
                            {
                                id: 'l1q2',
                                type: 'multiple_choice',
                                question: 'Where will they meet?',
                                options: [
                                    'At the train station',
                                    'At the coffee shop',
                                    'At the park',
                                    'At the library'
                                ],
                                correct: 1
                            },
                            {
                                id: 'l1q3',
                                type: 'gap_fill',
                                question: 'The speaker says "Let\'s meet at _______ at nine."',
                                correct: 'coffee'
                            }
                        ]
                    },
                    {
                        id: 'listening2',
                        description: 'A short news bulletin about a local festival',
                        audioUrl: 'audio/festival_news.mp3',
                        duration: 60,
                        transcript: "Good morning, this is your local news update. The annual Spring Festival will begin on March 20th and run for three days until March 22nd. The festival will feature live music, food vendors, and family activities throughout the weekend. The main stage will be set up in Central Park, with performances starting at 10 AM each day. Due to expected large crowds, organizers are advising visitors to arrive early and bring water bottles as there will be limited access to drinking fountains. Parking will be available at the nearby shopping center with a free shuttle service running every 15 minutes. The weather forecast looks promising with sunny skies and temperatures in the mid-70s. For more information, visit our website or call the festival hotline.",
                        questions: [
                            {
                                id: 'l2q1',
                                type: 'multiple_choice',
                                question: 'On which date will the festival begin?',
                                options: [
                                    'March 15th',
                                    'March 20th',
                                    'March 25th',
                                    'March 30th'
                                ],
                                correct: 1
                            },
                            {
                                id: 'l2q2',
                                type: 'multiple_choice',
                                question: 'What is the safety advice given?',
                                options: [
                                    'Bring warm clothes',
                                    'Bring water bottles',
                                    'Arrive early',
                                    'Bring identification'
                                ],
                                correct: 1
                            },
                            {
                                id: 'l2q3',
                                type: 'gap_fill',
                                question: 'The organizers warned visitors to bring _____.',
                                correct: 'water'
                            }
                        ]
                    },
                    {
                        id: 'listening3',
                        description: 'An academic explanation of how a thermometer works',
                        audioUrl: 'audio/thermometer.mp3',
                        duration: 50,
                        transcript: "A thermometer is a device used to measure temperature. The most common type is the liquid-in-glass thermometer, which consists of a narrow glass tube with a bulb at one end. Inside the tube is a liquid, usually mercury or colored alcohol. When the temperature rises, the liquid inside expands and rises up the tube. The higher the temperature, the more the liquid expands and the higher it rises. A scale marked on the tube allows us to read the temperature. This works because most liquids expand when heated and contract when cooled. The liquid inside the thermometer changes color or moves to indicate the current temperature. This principle is used in many everyday devices, from weather stations to medical thermometers.",
                        questions: [
                            {
                                id: 'l3q1',
                                type: 'multiple_choice',
                                question: 'What does the speaker explain?',
                                options: [
                                    'How a clock works',
                                    'How a thermometer measures temperature',
                                    'How a barometer works',
                                    'How a speedometer works'
                                ],
                                correct: 1
                            },
                            {
                                id: 'l3q2',
                                type: 'multiple_choice',
                                question: 'Why does the device change color?',
                                options: [
                                    'Because of temperature changes',
                                    'Because of pressure changes',
                                    'Because of humidity changes',
                                    'Because of light changes'
                                ],
                                correct: 0
                            },
                            {
                                id: 'l3q3',
                                type: 'gap_fill',
                                question: 'The liquid inside expands when the temperature _____.',
                                correct: 'rises'
                            }
                        ]
                    }
                ],
                reading: [
                    {
                        id: 'reading1',
                        title: 'Language Exchange at Local Café',
                        content: `The Blue Moon Café has become a popular spot for language learners in our city. Every Tuesday evening, the café hosts a language exchange program where people can practice speaking different languages with native speakers. The program started six months ago when the owner, Maria, noticed that many customers were studying languages alone at their tables. She decided to create a welcoming environment where people could practice together. The special offer on Tuesdays includes a 20% discount on all drinks for participants. The program has grown from just five people to over thirty regular attendees. Participants can practice English, Spanish, French, and even Arabic. The atmosphere is friendly and supportive, making it easy for beginners to join in. Many participants have formed lasting friendships through these weekly meetings.`,
                        wordCount: 140,
                        questions: [
                            {
                                id: 'r1q1',
                                type: 'multiple_choice',
                                question: 'What is the main idea of this passage?',
                                options: [
                                    'The café serves good coffee',
                                    'A café started a successful language exchange program',
                                    'Maria is a good business owner',
                                    'Language learning is difficult'
                                ],
                                correct: 1
                            },
                            {
                                id: 'r1q2',
                                type: 'multiple_choice',
                                question: 'What is the special offer on Tuesdays?',
                                options: [
                                    'Free coffee',
                                    '20% discount on drinks',
                                    'Free language books',
                                    'Free Wi-Fi'
                                ],
                                correct: 1
                            },
                            {
                                id: 'r1q3',
                                type: 'multiple_choice',
                                question: 'What does "exchange" mean in this passage?',
                                options: [
                                    'To buy something',
                                    'To practice speaking with others',
                                    'To study alone',
                                    'To read books'
                                ],
                                correct: 1
                            },
                            {
                                id: 'r1q4',
                                type: 'multiple_choice',
                                question: 'What can we infer about the program\'s success?',
                                options: [
                                    'It\'s not very popular',
                                    'It has grown significantly',
                                    'Only beginners attend',
                                    'It costs too much money'
                                ],
                                correct: 1
                            }
                        ]
                    },
                    {
                        id: 'reading2',
                        title: 'Climate-Friendly Daily Habits',
                        content: `Making small changes to our daily routines can have a significant impact on the environment. One of the easiest ways to reduce your carbon footprint is to walk or cycle for short trips instead of driving. If you must drive, consider carpooling with colleagues or friends. At home, switching to LED light bulbs can reduce energy consumption by up to 80%. Another simple change is to turn off lights and electronics when not in use. In the kitchen, try to reduce food waste by planning meals and using leftovers creatively. When shopping, bring your own reusable bags and choose products with minimal packaging. These small actions, when practiced consistently, can make a real difference. The key is to start with one or two changes and gradually build more sustainable habits. Remember, every small step counts towards a healthier planet for future generations.`,
                        wordCount: 180,
                        questions: [
                            {
                                id: 'r2q1',
                                type: 'multiple_choice',
                                question: 'What percentage of energy can LED bulbs save?',
                                options: [
                                    '50%',
                                    '60%',
                                    '70%',
                                    '80%'
                                ],
                                correct: 3
                            },
                            {
                                id: 'r2q2',
                                type: 'multiple_choice',
                                question: 'What can we infer about the author\'s attitude?',
                                options: [
                                    'They think big changes are necessary',
                                    'They believe small changes can make a difference',
                                    'They are pessimistic about the environment',
                                    'They think individual actions don\'t matter'
                                ],
                                correct: 1
                            },
                            {
                                id: 'r2q3',
                                type: 'multiple_choice',
                                question: 'What does "carbon footprint" mean in this context?',
                                options: [
                                    'The amount of money you spend',
                                    'The environmental impact of your actions',
                                    'The size of your house',
                                    'The number of cars you own'
                                ],
                                correct: 1
                            },
                            {
                                id: 'r2q4',
                                type: 'multiple_choice',
                                question: 'According to the passage, what should you do when shopping?',
                                options: [
                                    'Buy only organic products',
                                    'Bring reusable bags and choose minimal packaging',
                                    'Shop only at local stores',
                                    'Buy everything in bulk'
                                ],
                                correct: 1
                            }
                        ]
                    }
                ],
                speaking: [
                    {
                        id: 'speaking1',
                        prompt: 'Describe a memorable trip and why it matters to you. Speak for about 60 seconds.',
                        duration: 60,
                        type: 'descriptive'
                    },
                    {
                        id: 'speaking2',
                        prompt: 'Do you agree or disagree with the statement: "Learning English is more important than learning history"? Explain your opinion. Speak for about 60 seconds.',
                        duration: 60,
                        type: 'argumentative'
                    }
                ],
                writing: {
                    id: 'writing1',
                    prompt: 'Describe a problem in your city and suggest a realistic solution in about 80-120 words.',
                    minWords: 80,
                    maxWords: 120
                }
            };
        }
    }

    startTest() {
        this.showPage('testPage');
        this.currentSection = 0;
        this.userAnswers = {};
        this.loadCurrentSection();
    }

    showPage(pageId) {
        console.log('Showing page:', pageId);
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            console.log('Page displayed:', pageId);
        } else {
            console.error('Page not found:', pageId);
        }
    }

    loadCurrentSection() {
        const section = this.sections[this.currentSection];
        this.updateProgress();
        this.updateProgressText();
        
        // Hide all sections first
        document.querySelectorAll('.test-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show current section
        const currentSectionElement = document.getElementById(`${section}Section`);
        if (currentSectionElement) {
            currentSectionElement.style.display = 'block';
            this.loadSectionContent(section);
        }
    }

    loadSectionContent(section) {
        const contentElement = document.getElementById(`${section}Content`);
        if (!contentElement) return;

        switch (section) {
            case 'listening':
                this.loadListeningContent();
                break;
            case 'reading':
                this.loadReadingContent();
                break;
            case 'speaking':
                this.loadSpeakingContent();
                break;
            case 'writing':
                this.loadWritingContent();
                break;
        }
    }

    loadListeningContent() {
        const content = document.getElementById('listeningContent');
        const listeningData = this.testData.listening;
        
        let html = '';
        listeningData.forEach((clip, index) => {
            html += `
                <div class="listening-clip" style="margin: 2rem 0; padding: 2rem; background: #f8f9fa; border-radius: 15px; border: 2px solid #e9ecef;">
                    <h3 style="color: #1a365d; margin-bottom: 1rem;">Clip ${index + 1}: ${clip.description}</h3>
                    <div class="conversation-notice" style="background: #e3f2fd; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #2196f3;">
                        <p style="margin: 0; font-weight: 600; color: #1976d2;">
                            <i class="fas fa-info-circle"></i> 
                            ${this.currentLanguage === 'en' ? 'Listen to the conversation between two people, then answer the questions below.' : 'استمع إلى المحادثة بين شخصين، ثم أجب على الأسئلة أدناه.'}
                        </p>
                    </div>
                    <div class="audio-player">
                        <div class="audio-controls" style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap;">
                            <button class="play-btn" onclick="app.playAudio(${index})">
                                <i class="fas fa-play"></i> ${this.currentLanguage === 'en' ? 'Play Conversation' : 'تشغيل المحادثة'}
                            </button>
                            <button class="stop-btn" onclick="app.stopAudio(); return false;">
                                <i class="fas fa-stop"></i> ${this.currentLanguage === 'en' ? 'Stop' : 'إيقاف'}
                            </button>
                        </div>
                <div class="audio-progress-container" id="audioProgress${index}" style="display: none; background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%); padding: 1.5rem; border-radius: 15px; margin: 1rem 0; border: 2px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <div class="progress-bar-container" style="position: relative; margin-bottom: 1rem;">
                        <div class="progress-bar-bg" style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 3px; position: relative;">
                            <div class="progress-bar-fill" style="height: 100%; background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); border-radius: 3px; width: 0%; transition: width 0.1s ease;"></div>
                            <div class="progress-thumb" style="position: absolute; top: -6px; width: 18px; height: 18px; background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); border: 2px solid white; border-radius: 50%; left: 0%; transform: translateX(-50%); cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
                        </div>
                    </div>
                    <div class="time-display" style="display: flex; justify-content: space-between; color: #2d3748; font-weight: 600; font-size: 1.1rem;">
                        <span class="current-time">0:00</span>
                        <span class="remaining-time">-${Math.floor(clip.duration / 60)}:${(clip.duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                </div>
                    </div>
                    <div class="questions" style="margin-top: 2rem;">
                        <h5 style="color: #1a365d; margin-bottom: 1rem; font-size: 1.1rem;">
                            <i class="fas fa-question-circle"></i> 
                            ${this.currentLanguage === 'en' ? 'Questions (answer after listening):' : 'الأسئلة (أجب بعد الاستماع):'}
                        </h5>
                        ${clip.questions.map(q => this.renderQuestion(q)).join('')}
                    </div>
                </div>
            `;
        });
        
        content.innerHTML = html;
    }

    playAudio(clipIndex) {
        const clip = this.testData.listening[clipIndex];
        if (clip && clip.transcript) {
            // Use Web Speech API to read the transcript
            if ('speechSynthesis' in window) {
                // Stop any current speech
                speechSynthesis.cancel();
                
                // Set current playing clip for timer
                this.currentPlayingClip = clip;
                this.currentClipIndex = clipIndex;
                
                // Show progress bar
                this.showAudioProgress(clipIndex);
                
                // Add visual indicator
                this.showSpeakingIndicator();
                
                this.playConversation(clip.transcript, clipIndex);
            } else {
                alert(this.currentLanguage === 'en' ? 'Text-to-speech not supported in this browser' : 'تحويل النص إلى كلام غير مدعوم في هذا المتصفح');
            }
        }
    }

    showAudioProgress(clipIndex) {
        // Show the progress bar for this specific clip
        const progressContainer = document.getElementById(`audioProgress${clipIndex}`);
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }
        
        // Initialize progress tracking
        this.audioStartTime = Date.now();
        this.audioProgressTimer = setInterval(() => {
            this.updateAudioProgress(clipIndex);
        }, 100);
    }

    showSpeakingIndicator() {
        // Create or update speaking indicator
        let indicator = document.getElementById('speaking-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'speaking-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 1000;
                font-weight: 600;
                display: none;
                min-width: 250px;
            `;
            document.body.appendChild(indicator);
        }
        indicator.style.display = 'block';
    }


    hideSpeakingIndicator() {
        const indicator = document.getElementById('speaking-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
        
        // Clear audio progress timer
        if (this.audioProgressTimer) {
            clearInterval(this.audioProgressTimer);
            this.audioProgressTimer = null;
        }
    }

    updateAudioProgress(clipIndex) {
        if (!this.audioStartTime || !this.currentPlayingClip) return;
        
        const elapsed = (Date.now() - this.audioStartTime) / 1000;
        const totalDuration = this.currentPlayingClip.duration;
        const progress = Math.min(elapsed / totalDuration, 1);
        const remaining = Math.max(0, totalDuration - elapsed);
        
        // Update progress bar
        const progressContainer = document.getElementById(`audioProgress${clipIndex}`);
        if (progressContainer) {
            const progressFill = progressContainer.querySelector('.progress-bar-fill');
            const progressThumb = progressContainer.querySelector('.progress-thumb');
            const currentTimeEl = progressContainer.querySelector('.current-time');
            const remainingTimeEl = progressContainer.querySelector('.remaining-time');
            
            if (progressFill) {
                // Progress bar fills from left to right
                progressFill.style.width = `${progress * 100}%`;
            }
            
            if (progressThumb) {
                // Thumb moves from left to right (same direction as progress bar)
                progressThumb.style.left = `${progress * 100}%`;
            }
            
            if (currentTimeEl) {
                const minutes = Math.floor(elapsed / 60);
                const seconds = Math.floor(elapsed % 60);
                currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (remainingTimeEl) {
                const remainingMinutes = Math.floor(remaining / 60);
                const remainingSeconds = Math.floor(remaining % 60);
                remainingTimeEl.textContent = `-${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            }
        }
    }

    getCurrentListeningClip() {
        // This would need to be set when audio starts playing
        return this.currentPlayingClip || null;
    }

    playConversation(transcript, clipIndex) {
        // Wait for voices to load
        const playConversationWithVoices = () => {
            const voices = speechSynthesis.getVoices();
            console.log('Available voices:', voices.map(v => v.name));
            
            // Split transcript into speaker parts
            const parts = transcript.split(/(?=Speaker \d+:)/i);
            let currentPart = 0;
            
            // Look for British voices first, then fallback to any available voices
            let speaker1Voice = null;
            let speaker2Voice = null;
            
            // British voice preferences
            const britishVoices = voices.filter(voice => 
                voice.name.toLowerCase().includes('british') ||
                voice.name.toLowerCase().includes('uk') ||
                voice.name.toLowerCase().includes('england') ||
                voice.name.toLowerCase().includes('hazel') ||
                voice.name.toLowerCase().includes('susan') ||
                voice.name.toLowerCase().includes('karen') ||
                voice.name.toLowerCase().includes('daniel') ||
                voice.name.toLowerCase().includes('richard') ||
                voice.name.toLowerCase().includes('james') ||
                voice.name.toLowerCase().includes('michael')
            );
            
            // Female voices (prefer British)
            const femaleVoices = voices.filter(voice => 
                voice.name.toLowerCase().includes('female') || 
                voice.name.toLowerCase().includes('zira') || 
                voice.name.toLowerCase().includes('susan') ||
                voice.name.toLowerCase().includes('karen') ||
                voice.name.toLowerCase().includes('samantha') ||
                voice.name.toLowerCase().includes('microsoft zira') ||
                voice.name.toLowerCase().includes('hazel') ||
                voice.name.toLowerCase().includes('sarah') ||
                voice.name.toLowerCase().includes('eva') ||
                voice.name.toLowerCase().includes('anna') ||
                voice.name.toLowerCase().includes('hazel')
            );
            
            // Male voices (prefer British)
            const maleVoices = voices.filter(voice => 
                voice.name.toLowerCase().includes('male') || 
                voice.name.toLowerCase().includes('david') || 
                voice.name.toLowerCase().includes('mark') ||
                voice.name.toLowerCase().includes('microsoft david') ||
                voice.name.toLowerCase().includes('alex') ||
                voice.name.toLowerCase().includes('daniel') ||
                voice.name.toLowerCase().includes('richard') ||
                voice.name.toLowerCase().includes('james') ||
                voice.name.toLowerCase().includes('michael') ||
                voice.name.toLowerCase().includes('john')
            );
            
            // Select voices - prioritize British accents
            if (britishVoices.length >= 2) {
                speaker1Voice = britishVoices[0];
                speaker2Voice = britishVoices[1];
            } else if (britishVoices.length === 1) {
                speaker1Voice = britishVoices[0];
                speaker2Voice = voices.find(v => v !== britishVoices[0]) || voices[0];
            } else {
                speaker1Voice = femaleVoices[0] || voices[0];
                speaker2Voice = maleVoices[0] || (voices.length > 1 ? voices[1] : voices[0]);
            }
            
            // Ensure different voices
            if (speaker1Voice === speaker2Voice && voices.length > 1) {
                for (let i = 1; i < voices.length; i++) {
                    if (voices[i] !== speaker1Voice) {
                        speaker2Voice = voices[i];
                        break;
                    }
                }
            }
            
            console.log('Speaker 1 voice:', speaker1Voice?.name);
            console.log('Speaker 2 voice:', speaker2Voice?.name);
            
            const updateSpeakingIndicator = (speaker) => {
                const indicator = document.getElementById('speaking-indicator');
                if (indicator) {
                    if (speaker) {
                        indicator.innerHTML = `<i class="fas fa-microphone"></i> ${speaker} is speaking...`;
                        indicator.style.display = 'block';
                    } else {
                        indicator.style.display = 'none';
                    }
                }
            };
            
            const playNextPart = () => {
                if (currentPart >= parts.length) {
                    updateSpeakingIndicator(null);
                    return;
                }
                
                const part = parts[currentPart].trim();
                if (!part) {
                    currentPart++;
                    setTimeout(playNextPart, 200);
                    return;
                }
                
                // Extract speaker and text
                const speakerMatch = part.match(/^(Speaker \d+):\s*(.*)$/i);
                if (speakerMatch) {
                    const speaker = speakerMatch[1];
                    const text = speakerMatch[2];
                    
                    const utterance = new SpeechSynthesisUtterance(text);
                    
                    // Improved speech settings for better quality
                    utterance.rate = 0.9; // Slightly slower for clarity
                    utterance.volume = 1.0;
                    utterance.pitch = 1.0; // Normal pitch for clarity
                    
                    // Use different voices for different speakers
                    if (speaker.toLowerCase().includes('speaker 1')) {
                        utterance.voice = speaker1Voice;
                        utterance.pitch = 1.1; // Slightly higher pitch
                        utterance.rate = 0.8; // Slower speed for clarity
                    } else {
                        utterance.voice = speaker2Voice;
                        utterance.pitch = 0.9; // Slightly lower pitch
                        utterance.rate = 0.8; // Same slower speed for male speaker
                    }
                    
                    // Show speaking indicator
                    updateSpeakingIndicator(speaker);
                    
                    utterance.onend = () => {
                        currentPart++;
                        setTimeout(playNextPart, 300); // Much shorter pause between speakers
                    };
                    
                    speechSynthesis.speak(utterance);
                } else {
                    // If no speaker format, play as single voice
                    const utterance = new SpeechSynthesisUtterance(part);
                    utterance.rate = 0.9;
                    utterance.pitch = 1.0;
                    utterance.volume = 1.0;
                    utterance.voice = speaker1Voice;
                    
                    updateSpeakingIndicator('Speaker');
                    
                    utterance.onend = () => {
                        currentPart++;
                        setTimeout(playNextPart, 200);
                    };
                    
                    speechSynthesis.speak(utterance);
                }
            };
            
            playNextPart();
        };
        
        // Load voices if not already loaded
        if (speechSynthesis.getVoices().length === 0) {
            speechSynthesis.addEventListener('voiceschanged', playConversationWithVoices, { once: true });
        } else {
            playConversationWithVoices();
        }
    }

    stopAudio() {
        // Stop speech synthesis immediately
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }
        
        // Clear all timers
        if (this.audioProgressTimer) {
            clearInterval(this.audioProgressTimer);
            this.audioProgressTimer = null;
        }
        
        // Reset progress bar to initial state
        if (this.currentClipIndex !== undefined) {
            const progressContainer = document.getElementById(`audioProgress${this.currentClipIndex}`);
            if (progressContainer) {
                const progressFill = progressContainer.querySelector('.progress-bar-fill');
                const progressThumb = progressContainer.querySelector('.progress-thumb');
                const currentTimeEl = progressContainer.querySelector('.current-time');
                
                if (progressFill) {
                    progressFill.style.width = '0%';
                }
                if (progressThumb) {
                    progressThumb.style.left = '0%';
                }
                if (currentTimeEl) {
                    currentTimeEl.textContent = '0:00';
                }
                
                // Hide progress bar
                progressContainer.style.display = 'none';
            }
        }
        
        // Reset all audio state
        this.currentPlayingClip = null;
        this.currentClipIndex = null;
        this.audioStartTime = null;
        
        // Hide speaking indicator
        this.hideSpeakingIndicator();
        
        console.log('Audio stopped and reset');
    }

    getAnswersReview(scores) {
        let html = '';
        
        // Listening answers
        if (scores.listening.answers.length > 0) {
            html += `
                <div class="skill-answers">
                    <h4 style="color: #1a365d; margin-bottom: 1rem;">${this.currentLanguage === 'en' ? 'Listening Questions' : 'أسئلة الاستماع'}</h4>
                    ${scores.listening.answers.map((answer, index) => `
                        <div class="answer-item" style="margin: 1rem 0; padding: 1rem; background: ${answer.isCorrect ? '#d4edda' : '#f8d7da'}; border-radius: 8px; border-left: 4px solid ${answer.isCorrect ? '#28a745' : '#dc3545'};">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <strong>${this.currentLanguage === 'en' ? 'Question' : 'السؤال'} ${index + 1}:</strong>
                                <span style="color: ${answer.isCorrect ? '#28a745' : '#dc3545'}; font-weight: bold;">
                                    ${answer.isCorrect ? (this.currentLanguage === 'en' ? '✓ Correct' : '✓ صحيح') : (this.currentLanguage === 'en' ? '✗ Incorrect' : '✗ خطأ')}
                                </span>
                            </div>
                            <p style="margin: 0.5rem 0; font-weight: 500;">${answer.question}</p>
                            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                                <div>
                                    <strong>${this.currentLanguage === 'en' ? 'Your answer:' : 'إجابتك:'}</strong><br>
                                    <span style="color: #6c757d;">${answer.userAnswer}</span>
                                </div>
                                <div>
                                    <strong>${this.currentLanguage === 'en' ? 'Correct answer:' : 'الإجابة الصحيحة:'}</strong><br>
                                    <span style="color: #28a745;">${answer.correctAnswer}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        // Reading answers
        if (scores.reading.answers.length > 0) {
            html += `
                <div class="skill-answers" style="margin-top: 2rem;">
                    <h4 style="color: #1a365d; margin-bottom: 1rem;">${this.currentLanguage === 'en' ? 'Reading Questions' : 'أسئلة القراءة'}</h4>
                    ${scores.reading.answers.map((answer, index) => `
                        <div class="answer-item" style="margin: 1rem 0; padding: 1rem; background: ${answer.isCorrect ? '#d4edda' : '#f8d7da'}; border-radius: 8px; border-left: 4px solid ${answer.isCorrect ? '#28a745' : '#dc3545'};">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <strong>${this.currentLanguage === 'en' ? 'Question' : 'السؤال'} ${index + 1}:</strong>
                                <span style="color: ${answer.isCorrect ? '#28a745' : '#dc3545'}; font-weight: bold;">
                                    ${answer.isCorrect ? (this.currentLanguage === 'en' ? '✓ Correct' : '✓ صحيح') : (this.currentLanguage === 'en' ? '✗ Incorrect' : '✗ خطأ')}
                                </span>
                            </div>
                            <p style="margin: 0.5rem 0; font-weight: 500;">${answer.question}</p>
                            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                                <div>
                                    <strong>${this.currentLanguage === 'en' ? 'Your answer:' : 'إجابتك:'}</strong><br>
                                    <span style="color: #6c757d;">${answer.userAnswer}</span>
                                </div>
                                <div>
                                    <strong>${this.currentLanguage === 'en' ? 'Correct answer:' : 'الإجابة الصحيحة:'}</strong><br>
                                    <span style="color: #28a745;">${answer.correctAnswer}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        // Speaking and Writing status
        html += `
            <div class="skill-answers" style="margin-top: 2rem;">
                <h4 style="color: #1a365d; margin-bottom: 1rem;">${this.currentLanguage === 'en' ? 'Speaking & Writing' : 'التحدث والكتابة'}</h4>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <div style="padding: 1rem; background: ${scores.speaking.completed ? '#d4edda' : '#f8d7da'}; border-radius: 8px; border-left: 4px solid ${scores.speaking.completed ? '#28a745' : '#dc3545'}; flex: 1; min-width: 200px;">
                        <strong>${this.currentLanguage === 'en' ? 'Speaking:' : 'التحدث:'}</strong><br>
                        <span style="color: ${scores.speaking.completed ? '#28a745' : '#dc3545'};">
                            ${scores.speaking.completed ? (this.currentLanguage === 'en' ? '✓ Completed' : '✓ مكتمل') : (this.currentLanguage === 'en' ? '✗ Not completed' : '✗ غير مكتمل')}
                        </span>
                    </div>
                    <div style="padding: 1rem; background: ${scores.writing.completed ? '#d4edda' : '#f8d7da'}; border-radius: 8px; border-left: 4px solid ${scores.writing.completed ? '#28a745' : '#dc3545'}; flex: 1; min-width: 200px;">
                        <strong>${this.currentLanguage === 'en' ? 'Writing:' : 'الكتابة:'}</strong><br>
                        <span style="color: ${scores.writing.completed ? '#28a745' : '#dc3545'};">
                            ${scores.writing.completed ? (this.currentLanguage === 'en' ? `✓ Completed (${scores.writing.wordCount} words)` : `✓ مكتمل (${scores.writing.wordCount} كلمة)`) : (this.currentLanguage === 'en' ? '✗ Not completed' : '✗ غير مكتمل')}
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        return html;
    }

    getListeningTranscripts() {
        const listeningData = this.testData.listening;
        let html = '';
        
        listeningData.forEach((clip, index) => {
            html += `
                <div class="transcript-item" style="margin: 1.5rem 0; padding: 1.5rem; background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%); border-radius: 15px; border-left: 4px solid #3498db; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <h4 style="color: #1a365d; margin-bottom: 1rem;">${this.currentLanguage === 'en' ? 'Clip' : 'مقطع'} ${index + 1}: ${clip.description}</h4>
                    <p style="font-style: italic; line-height: 1.6; color: #495057;">${clip.transcript}</p>
                </div>
            `;
        });
        
        return html;
    }

    loadReadingContent() {
        const content = document.getElementById('readingContent');
        const readingData = this.testData.reading;
        
        let html = '';
        readingData.forEach((passage, index) => {
            const difficultyColor = passage.difficulty === 'Easy' ? '#28a745' : 
                                  passage.difficulty === 'Medium' ? '#ffc107' : '#dc3545';
            
            html += `
                <div class="reading-passage">
                    <div class="passage-header">
                        <h3>Passage ${index + 1}: ${passage.title}</h3>
                        <div class="difficulty-badge" style="background: ${difficultyColor}; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; font-weight: 600;">
                            ${passage.difficulty} (${passage.level})
                        </div>
                    </div>
                    <div class="passage-content">
                        ${passage.content}
                    </div>
                    <div class="questions">
                        ${passage.questions.map(q => this.renderQuestion(q)).join('')}
                    </div>
                </div>
            `;
        });
        
        content.innerHTML = html;
    }

    loadSpeakingContent() {
        const content = document.getElementById('speakingContent');
        const speakingData = this.testData.speaking;
        
        let html = '';
        speakingData.forEach((task, index) => {
            html += `
                <div class="speaking-task">
                    <h3>Task ${index + 1}</h3>
                    <div class="speaking-prompt">
                        <p><strong>${this.currentLanguage === 'en' ? 'Prompt:' : 'المطلوب:'}</strong></p>
                        <p>${task.prompt}</p>
                    </div>
                    <div class="recording-container">
                        <button class="record-btn" id="recordBtn${index}" onclick="app.startRecording(${index})">
                            ${this.currentLanguage === 'en' ? 'Start Recording' : 'بدء التسجيل'}
                        </button>
                        <div class="timer" id="timer${index}" style="display: none;">
                            0:00 / ${Math.floor(task.duration / 60)}:${(task.duration % 60).toString().padStart(2, '0')}
                        </div>
                        <div class="recording-status" id="status${index}"></div>
                    </div>
                </div>
            `;
        });
        
        content.innerHTML = html;
    }

    loadWritingContent() {
        const content = document.getElementById('writingContent');
        const writingData = this.testData.writing;
        
        const html = `
            <div class="writing-prompt">
                <h3>${this.currentLanguage === 'en' ? 'Writing Task' : 'مهمة الكتابة'}</h3>
                <p><strong>${this.currentLanguage === 'en' ? 'Prompt:' : 'المطلوب:'}</strong></p>
                <p>${writingData.prompt}</p>
                <p><strong>${this.currentLanguage === 'en' ? 'Word count:' : 'عدد الكلمات:'} ${writingData.minWords}-${writingData.maxWords} ${this.currentLanguage === 'en' ? 'words' : 'كلمة'}</strong></p>
            </div>
            <div class="writing-input">
                <textarea 
                    id="writingText" 
                    class="writing-textarea" 
                    placeholder="${this.currentLanguage === 'en' ? 'Write your response here...' : 'اكتب إجابتك هنا...'}"
                    oninput="app.updateWordCount()"
                ></textarea>
                <div class="word-count" id="wordCount">0 / ${writingData.maxWords}</div>
            </div>
        `;
        
        content.innerHTML = html;
    }

    renderQuestion(question) {
        let html = `<div class="question" id="q_${question.id}">`;
        html += `<h3>${question.question}</h3>`;
        
        if (question.type === 'multiple_choice') {
            html += '<ul class="question-options">';
            question.options.forEach((option, index) => {
                html += `
                    <li>
                        <input type="radio" name="${question.id}" value="${index}" id="${question.id}_${index}">
                        <label for="${question.id}_${index}">${option}</label>
                    </li>
                `;
            });
            html += '</ul>';
        } else if (question.type === 'gap_fill') {
            // Replace the blank with an input field
                    const questionText = question.question.replace('_______', '<input type="text" name="' + question.id + '" id="' + question.id + '" class="gap-fill-input">');
            html += `
                <div class="gap-fill">
                    <p>${questionText}</p>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }

    startRecording(taskIndex) {
        if (this.isRecording) {
            this.stopRecording(taskIndex);
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                this.audioRecorder = new MediaRecorder(stream);
                this.recordingChunks = [];
                this.recordingTime = 0;
                
                this.audioRecorder.ondataavailable = event => {
                    this.recordingChunks.push(event.data);
                };
                
                this.audioRecorder.onstop = () => {
                    const audioBlob = new Blob(this.recordingChunks, { type: 'audio/wav' });
                    this.userAnswers[`speaking${taskIndex + 1}`] = audioBlob;
                    this.updateRecordingStatus(taskIndex, 'completed');
                };
                
                this.audioRecorder.start();
                this.isRecording = true;
                this.startRecordingTimer(taskIndex);
                this.updateRecordingUI(taskIndex, true);
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
                alert(this.currentLanguage === 'en' ? 'Microphone access denied' : 'تم رفض الوصول للميكروفون');
            });
    }

    stopRecording(taskIndex) {
        if (this.audioRecorder && this.isRecording) {
            this.audioRecorder.stop();
            this.isRecording = false;
            this.stopRecordingTimer();
            this.updateRecordingUI(taskIndex, false);
        }
    }

    startRecordingTimer(taskIndex) {
        const task = this.testData.speaking[taskIndex];
        this.recordingTimer = setInterval(() => {
            this.recordingTime++;
            const minutes = Math.floor(this.recordingTime / 60);
            const seconds = this.recordingTime % 60;
            const timerElement = document.getElementById(`timer${taskIndex}`);
            if (timerElement) {
                timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} / ${Math.floor(task.duration / 60)}:${(task.duration % 60).toString().padStart(2, '0')}`;
            }
            
            if (this.recordingTime >= task.duration) {
                this.stopRecording(taskIndex);
            }
        }, 1000);
    }

    stopRecordingTimer() {
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }
    }

    updateRecordingUI(taskIndex, isRecording) {
        const recordBtn = document.getElementById(`recordBtn${taskIndex}`);
        const timer = document.getElementById(`timer${taskIndex}`);
        
        if (isRecording) {
            recordBtn.textContent = this.currentLanguage === 'en' ? 'Stop Recording' : 'إيقاف التسجيل';
            recordBtn.classList.add('recording');
            timer.style.display = 'block';
        } else {
            recordBtn.textContent = this.currentLanguage === 'en' ? 'Start Recording' : 'بدء التسجيل';
            recordBtn.classList.remove('recording');
            timer.style.display = 'none';
        }
    }

    updateRecordingStatus(taskIndex, status) {
        const statusElement = document.getElementById(`status${taskIndex}`);
        if (statusElement) {
            const messages = {
                en: { completed: 'Recording completed successfully!' },
                ar: { completed: 'تم التسجيل بنجاح!' }
            };
            statusElement.textContent = messages[this.currentLanguage][status];
        }
    }

    updateWordCount() {
        const textarea = document.getElementById('writingText');
        const wordCount = document.getElementById('wordCount');
        const text = textarea.value;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const count = words.length;
        const maxWords = this.testData.writing.maxWords;
        
        wordCount.textContent = `${count} / ${maxWords}`;
        
        if (count > maxWords) {
            wordCount.style.color = '#f44336';
        } else {
            wordCount.style.color = '#666';
        }
    }

    collectAnswers() {
        console.log('Collecting answers...');
        
        // Collect listening answers
        this.testData.listening.forEach((clip, clipIndex) => {
            clip.questions.forEach(question => {
                const checkedElement = document.querySelector(`input[name="${question.id}"]:checked`);
                if (checkedElement) {
                    this.userAnswers[question.id] = checkedElement.value;
                    console.log(`Listening Q ${question.id}: ${checkedElement.value}`);
                } else if (question.type === 'gap_fill') {
                    const textElement = document.querySelector(`input[name="${question.id}"]`);
                    if (textElement) {
                        this.userAnswers[question.id] = textElement.value;
                        console.log(`Listening Gap Fill ${question.id}: ${textElement.value}`);
                    }
                } else {
                    console.log(`No answer found for listening question ${question.id}`);
                }
            });
        });

        // Collect reading answers
        this.testData.reading.forEach((passage, passageIndex) => {
            passage.questions.forEach(question => {
                const checkedElement = document.querySelector(`input[name="${question.id}"]:checked`);
                if (checkedElement) {
                    this.userAnswers[question.id] = checkedElement.value;
                    console.log(`Reading Q ${question.id}: ${checkedElement.value}`);
                } else if (question.type === 'gap_fill') {
                    const textElement = document.querySelector(`input[name="${question.id}"]`);
                    if (textElement) {
                        this.userAnswers[question.id] = textElement.value;
                        console.log(`Reading Gap Fill ${question.id}: ${textElement.value}`);
                    }
                } else {
                    console.log(`No answer found for reading question ${question.id}`);
                }
            });
        });

        // Collect writing answer
        const writingText = document.getElementById('writingText');
        if (writingText) {
            this.userAnswers.writing = writingText.value;
            console.log('Writing answer:', writingText.value);
        }
    }

    nextSection() {
        this.collectAnswers();
        this.currentSection++;
        
        if (this.currentSection < this.sections.length) {
            this.loadCurrentSection();
        } else {
            this.finishTest();
        }
    }

    skipWriting() {
        this.userAnswers.writing = null;
        this.finishTest();
    }

    finishTest() {
        this.collectAnswers();
        console.log('Collected answers:', this.userAnswers);
        this.showPage('resultsPage');
        this.processResults();
    }

    async processResults() {
        const resultsContent = document.getElementById('resultsContent');
        resultsContent.innerHTML = '<div class="loading"><div class="spinner"></div><p>Processing your results...</p></div>';

        try {
            // Simulate AI processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const results = await this.scoreTest();
            this.displayResults(results);
        } catch (error) {
            console.error('Error processing results:', error);
            resultsContent.innerHTML = '<p>Error processing results. Please try again.</p>';
        }
    }

    async scoreTest() {
        // Calculate actual scores based on user answers
        const scores = this.calculateScores();
        const results = this.generateResults(scores);
        return results;
    }

    calculateScores() {
        const scores = {
            listening: { correct: 0, total: 0, answers: [] },
            reading: { correct: 0, total: 0, answers: [] },
            speaking: { completed: false, answers: [] },
            writing: { completed: false, wordCount: 0, answers: [] }
        };

        // Score listening questions
        this.testData.listening.forEach((clip, clipIndex) => {
            clip.questions.forEach((question, qIndex) => {
                const questionId = question.id;
                const userAnswer = this.userAnswers[questionId];
                const isCorrect = this.checkAnswer(question, userAnswer);
                
                scores.listening.total++;
                if (isCorrect) scores.listening.correct++;
                
                scores.listening.answers.push({
                    questionId,
                    question: question.question,
                    userAnswer: userAnswer || 'No answer',
                    correctAnswer: this.getCorrectAnswer(question),
                    isCorrect
                });
            });
        });

        // Score reading questions
        this.testData.reading.forEach((passage, passageIndex) => {
            passage.questions.forEach((question, qIndex) => {
                const questionId = question.id;
                const userAnswer = this.userAnswers[questionId];
                const isCorrect = this.checkAnswer(question, userAnswer);
                
                scores.reading.total++;
                if (isCorrect) scores.reading.correct++;
                
                scores.reading.answers.push({
                    questionId,
                    question: question.question,
                    userAnswer: userAnswer || 'No answer',
                    correctAnswer: this.getCorrectAnswer(question),
                    isCorrect
                });
            });
        });

        // Check speaking completion
        scores.speaking.completed = this.userAnswers.speaking1 || this.userAnswers.speaking2;
        scores.speaking.answers = [
            { task: 'Personal Description', completed: !!this.userAnswers.speaking1 },
            { task: 'Opinion/Argument', completed: !!this.userAnswers.speaking2 }
        ];

        // Check writing completion
        if (this.userAnswers.writing) {
            scores.writing.completed = true;
            scores.writing.wordCount = this.userAnswers.writing.trim().split(/\s+/).length;
        }

        return scores;
    }

    checkAnswer(question, userAnswer) {
        if (!userAnswer) return false;
        
        if (question.type === 'multiple_choice') {
            return parseInt(userAnswer) === question.correct;
        } else if (question.type === 'gap_fill') {
            const userAnswerClean = userAnswer.toLowerCase().trim();
            const correctAnswerClean = question.correct.toLowerCase().trim();
            
            // Check exact match first
            if (userAnswerClean === correctAnswerClean) {
                return true;
            }
            
            // Check if both are numbers (digit vs word format)
            const numberWords = {
                'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
                'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
                'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13',
                'fourteen': '14', 'fifteen': '15', 'sixteen': '16', 'seventeen': '17',
                'eighteen': '18', 'nineteen': '19', 'twenty': '20', 'thirty': '30',
                'forty': '40', 'fifty': '50', 'sixty': '60', 'seventy': '70',
                'eighty': '80', 'ninety': '90'
            };
            
            // Convert word numbers to digits
            const userAsDigit = numberWords[userAnswerClean] || userAnswerClean;
            const correctAsDigit = numberWords[correctAnswerClean] || correctAnswerClean;
            
            return userAsDigit === correctAsDigit;
        }
        return false;
    }

    getCorrectAnswer(question) {
        if (question.type === 'multiple_choice') {
            return question.options[question.correct];
        } else if (question.type === 'gap_fill') {
            return question.correct;
        }
        return '';
    }

    calculateReadingScoreWithDifficulty(readingScores) {
        // Calculate weighted score based on difficulty levels
        let totalWeightedScore = 0;
        let totalWeight = 0;
        
        this.testData.reading.forEach((passage, passageIndex) => {
            const passageQuestions = passage.questions;
            let correctInPassage = 0;
            
            // Count correct answers for this passage
            passageQuestions.forEach(question => {
                const answer = this.userAnswers[question.id];
                if (this.checkAnswer(question, answer)) {
                    correctInPassage++;
                }
            });
            
            // Weight based on difficulty: Easy=1, Medium=2, Hard=3
            const weight = passage.difficulty === 'Easy' ? 1 : 
                          passage.difficulty === 'Medium' ? 2 : 3;
            
            const passageScore = (correctInPassage / passageQuestions.length) * 100;
            totalWeightedScore += passageScore * weight;
            totalWeight += weight;
        });
        
        return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    }

    generateResults(scores) {
        const listeningScore = (scores.listening.correct / scores.listening.total) * 100;
        const readingScore = this.calculateReadingScoreWithDifficulty(scores.reading);
        
        const listeningLevel = this.getCEFRLevel(listeningScore);
        const readingLevel = this.getCEFRLevel(readingScore);
        const speakingLevel = scores.speaking.completed ? 'B1' : 'Not tested';
        const writingLevel = scores.writing.completed ? this.getWritingLevel(scores.writing.wordCount) : 'Not tested';

        const overallLevel = this.getOverallLevel([listeningLevel, readingLevel, speakingLevel, writingLevel]);

        return {
            overall: overallLevel,
            scores: scores,
            skills: {
                listening: { 
                    level: listeningLevel, 
                    confidence: Math.round(listeningScore), 
                    score: `${scores.listening.correct}/${scores.listening.total}`,
                    feedback: this.getListeningFeedback(listeningScore),
                    feedbackAr: this.getListeningFeedbackAr(listeningScore)
                },
                reading: { 
                    level: readingLevel, 
                    confidence: Math.round(readingScore), 
                    score: `${scores.reading.correct}/${scores.reading.total}`,
                    feedback: this.getReadingFeedback(readingScore),
                    feedbackAr: this.getReadingFeedbackAr(readingScore)
                },
                speaking: { 
                    level: speakingLevel, 
                    confidence: scores.speaking.completed ? 75 : 0, 
                    score: scores.speaking.completed ? 'Completed' : 'Not completed',
                    feedback: this.getSpeakingFeedback(speakingLevel, scores.speaking.completed),
                    feedbackAr: this.getSpeakingFeedbackAr(speakingLevel, scores.speaking.completed),
                    recommendations: this.getSpeakingRecommendations(speakingLevel, scores.speaking.completed),
                    recommendationsAr: this.getSpeakingRecommendationsAr(speakingLevel, scores.speaking.completed)
                },
                writing: { 
                    level: writingLevel, 
                    confidence: scores.writing.completed ? this.getWritingConfidence(scores.writing.wordCount) : 0, 
                    score: scores.writing.completed ? `${scores.writing.wordCount} words` : 'Not completed',
                    feedback: this.getWritingFeedback(writingLevel, scores.writing.completed, scores.writing.wordCount),
                    feedbackAr: this.getWritingFeedbackAr(writingLevel, scores.writing.completed, scores.writing.wordCount),
                    recommendations: this.getWritingRecommendations(writingLevel, scores.writing.completed, scores.writing.wordCount),
                    recommendationsAr: this.getWritingRecommendationsAr(writingLevel, scores.writing.completed, scores.writing.wordCount)
                }
            },
            strongest: this.getStrongestSkill(listeningLevel, readingLevel, speakingLevel, writingLevel),
            strongestAr: this.getStrongestSkillAr(listeningLevel, readingLevel, speakingLevel, writingLevel),
            weakest: this.getWeakestSkill(listeningLevel, readingLevel, speakingLevel, writingLevel),
            weakestAr: this.getWeakestSkillAr(listeningLevel, readingLevel, speakingLevel, writingLevel),
            recommendation: this.getRecommendation(overallLevel, listeningLevel, readingLevel),
            recommendationAr: this.getRecommendationAr(overallLevel, listeningLevel, readingLevel)
        };
    }

    getCEFRLevel(score) {
        // More realistic and strict CEFR level assessment
        if (score >= 95) return 'C2';
        if (score >= 85) return 'C1';
        if (score >= 75) return 'B2';
        if (score >= 65) return 'B1';
        if (score >= 55) return 'A2';
        return 'A1';
    }

    getWritingLevel(wordCount) {
        if (wordCount >= 100) return 'B2';
        if (wordCount >= 80) return 'B1';
        if (wordCount >= 60) return 'A2';
        return 'A1';
    }

    getOverallLevel(levels) {
        const levelValues = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6, 'Not tested': 0 };
        const validLevels = levels.filter(level => level !== 'Not tested');
        if (validLevels.length === 0) return 'A1';
        
        const average = validLevels.reduce((sum, level) => sum + levelValues[level], 0) / validLevels.length;
        const rounded = Math.round(average);
        return Object.keys(levelValues).find(key => levelValues[key] === rounded) || 'B1';
    }

    getListeningFeedback(score) {
        if (score >= 90) return 'Strong listening comprehension. You handle most spoken English well, though some complex academic or professional contexts may still be challenging.';
        if (score >= 80) return 'Good listening skills. You understand most everyday conversations but may struggle with rapid speech, accents, or complex topics.';
        if (score >= 70) return 'Adequate listening comprehension. You get the main ideas but miss details and struggle with faster speech or unfamiliar vocabulary.';
        if (score >= 60) return 'Basic listening skills. You understand simple, slow speech but need significant improvement for real-world situations.';
        return 'Limited listening skills. You need substantial practice with basic conversations before attempting more complex material.';
    }

    getListeningFeedbackAr(score) {
        if (score >= 90) return 'فهم قوي للاستماع. تتعامل مع معظم الإنجليزية المنطوقة بشكل جيد، لكن بعض السياقات الأكاديمية أو المهنية المعقدة قد تكون صعبة.';
        if (score >= 80) return 'مهارات استماع جيدة. تفهم معظم المحادثات اليومية لكن قد تواجه صعوبة مع الكلام السريع أو اللهجات أو المواضيع المعقدة.';
        if (score >= 70) return 'فهم مناسب للاستماع. تحصل على الأفكار الرئيسية لكن تفوت التفاصيل وتواجه صعوبة مع الكلام السريع أو المفردات غير المألوفة.';
        if (score >= 60) return 'مهارات استماع أساسية. تفهم الكلام البسيط والبطيء لكن تحتاج تحسين كبير للوضعيات الواقعية.';
        return 'مهارات استماع محدودة. تحتاج ممارسة كبيرة مع المحادثات الأساسية قبل محاولة المواد المعقدة.';
    }

    getReadingFeedback(score) {
        if (score >= 90) return 'Strong reading comprehension. You handle most texts well but may struggle with highly specialized academic or literary works.';
        if (score >= 80) return 'Good reading skills. You understand most general texts but complex vocabulary and abstract concepts can be challenging.';
        if (score >= 70) return 'Adequate reading comprehension. You get main ideas but miss nuances, struggle with complex sentences, and need more vocabulary.';
        if (score >= 60) return 'Basic reading skills. You understand simple texts but need significant improvement for academic or professional reading.';
        return 'Limited reading skills. You need substantial practice with basic texts before attempting more complex material.';
    }

    getReadingFeedbackAr(score) {
        if (score >= 90) return 'فهم قوي للقراءة. تتعامل مع معظم النصوص بشكل جيد لكن قد تواجه صعوبة مع الأعمال الأكاديمية أو الأدبية المتخصصة.';
        if (score >= 80) return 'مهارات قراءة جيدة. تفهم معظم النصوص العامة لكن المفردات المعقدة والمفاهيم المجردة يمكن أن تكون صعبة.';
        if (score >= 70) return 'فهم مناسب للقراءة. تحصل على الأفكار الرئيسية لكن تفوت الفروق الدقيقة وتواجه صعوبة مع الجمل المعقدة وتحتاج مفردات أكثر.';
        if (score >= 60) return 'مهارات قراءة أساسية. تفهم النصوص البسيطة لكن تحتاج تحسين كبير للقراءة الأكاديمية أو المهنية.';
        return 'مهارات قراءة محدودة. تحتاج ممارسة كبيرة مع النصوص الأساسية قبل محاولة المواد المعقدة.';
    }

    getStrongestSkill(listening, reading, speaking, writing) {
        const skills = [
            { name: 'Listening', level: listening },
            { name: 'Reading', level: reading },
            { name: 'Speaking', level: speaking },
            { name: 'Writing', level: writing }
        ].filter(skill => skill.level !== 'Not tested');
        
        if (skills.length === 0) return 'No skills tested';
        
        const levelValues = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
        const strongest = skills.reduce((max, skill) => 
            levelValues[skill.level] > levelValues[max.level] ? skill : max
        );
        
        return `${strongest.name} — you scored ${strongest.level} level`;
    }

    getStrongestSkillAr(listening, reading, speaking, writing) {
        const skills = [
            { name: 'الاستماع', level: listening },
            { name: 'القراءة', level: reading },
            { name: 'التحدث', level: speaking },
            { name: 'الكتابة', level: writing }
        ].filter(skill => skill.level !== 'Not tested');
        
        if (skills.length === 0) return 'لم يتم اختبار أي مهارات';
        
        const levelValues = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
        const strongest = skills.reduce((max, skill) => 
            levelValues[skill.level] > levelValues[max.level] ? skill : max
        );
        
        return `${strongest.name} — حصلت على مستوى ${strongest.level}`;
    }

    getWeakestSkill(listening, reading, speaking, writing) {
        const skills = [
            { name: 'Listening', level: listening },
            { name: 'Reading', level: reading },
            { name: 'Speaking', level: speaking },
            { name: 'Writing', level: writing }
        ].filter(skill => skill.level !== 'Not tested');
        
        if (skills.length === 0) return 'No skills tested';
        
        const levelValues = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
        const weakest = skills.reduce((min, skill) => 
            levelValues[skill.level] < levelValues[min.level] ? skill : min
        );
        
        return `${weakest.name} — you scored ${weakest.level} level`;
    }

    getWeakestSkillAr(listening, reading, speaking, writing) {
        const skills = [
            { name: 'الاستماع', level: listening },
            { name: 'القراءة', level: reading },
            { name: 'التحدث', level: speaking },
            { name: 'الكتابة', level: writing }
        ].filter(skill => skill.level !== 'Not tested');
        
        if (skills.length === 0) return 'لم يتم اختبار أي مهارات';
        
        const levelValues = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
        const weakest = skills.reduce((min, skill) => 
            levelValues[skill.level] < levelValues[min.level] ? skill : min
        );
        
        return `${weakest.name} — حصلت على مستوى ${weakest.level}`;
    }

    getRecommendation(overall, listening, reading) {
        if (overall === 'A1') return 'You need significant foundational work. Start with beginner courses focusing on basic vocabulary, simple grammar, and pronunciation. Practice 45-60 minutes daily. Consider getting a tutor.';
        if (overall === 'A2') return 'You have basic skills but need consistent practice. Focus on expanding vocabulary, improving grammar accuracy, and building confidence. Study 60 minutes daily with structured materials.';
        if (overall === 'B1') return 'You\'re making progress but still need work on accuracy and fluency. Practice with intermediate materials, focus on common mistakes, and try to speak English regularly.';
        if (overall === 'B2') return 'Good intermediate level. Focus on advanced vocabulary, complex grammar, and professional/academic English. Challenge yourself with authentic materials.';
        return 'Strong advanced level. Continue with specialized materials, academic texts, and professional contexts to reach native-like proficiency.';
    }

    getRecommendationAr(overall, listening, reading) {
        if (overall === 'A1') return 'تحتاج عمل أساسي كبير. ابدأ بدورات المبتدئين مع التركيز على المفردات الأساسية والقواعد البسيطة والنطق. تدرب 45-60 دقيقة يومياً. فكر في الحصول على مدرس.';
        if (overall === 'A2') return 'لديك مهارات أساسية لكن تحتاج ممارسة منتظمة. ركز على توسيع المفردات وتحسين دقة القواعد وبناء الثقة. ادرس 60 دقيقة يومياً مع مواد منظمة.';
        if (overall === 'B1') return 'تحقق تقدماً لكن لا تزال تحتاج عمل على الدقة والطلاقة. تدرب مع مواد متوسطة وركز على الأخطاء الشائعة وحاول التحدث بالإنجليزية بانتظام.';
        if (overall === 'B2') return 'مستوى متوسط جيد. ركز على المفردات المتقدمة والقواعد المعقدة والإنجليزية المهنية/الأكاديمية. تحد نفسك بالمواد الأصيلة.';
        return 'مستوى متقدم قوي. استمر مع المواد المتخصصة والنصوص الأكاديمية والسياقات المهنية للوصول إلى الكفاءة الشبيهة بالمتحدثين الأصليين.';
    }

    // Enhanced Speaking Feedback
    getSpeakingFeedback(level, completed) {
        if (!completed) return 'Speaking assessment was not completed. Please complete the speaking tasks to get detailed feedback.';
        if (level === 'C2') return 'Excellent speaking skills! You communicate with native-like fluency and accuracy.';
        if (level === 'C1') return 'Advanced speaking ability. You express complex ideas clearly with occasional minor errors.';
        if (level === 'B2') return 'Good speaking skills. You communicate effectively but may struggle with complex topics or rapid conversation.';
        if (level === 'B1') return 'Intermediate speaking level. You can handle everyday conversations but need practice with more complex language.';
        if (level === 'A2') return 'Basic speaking skills. You can communicate simple ideas but need significant improvement.';
        return 'Beginner speaking level. Focus on basic vocabulary and simple sentence structures.';
    }

    getSpeakingFeedbackAr(level, completed) {
        if (!completed) return 'لم يتم إكمال تقييم التحدث. يرجى إكمال مهام التحدث للحصول على تقييم مفصل.';
        if (level === 'C2') return 'مهارات تحدث ممتازة! تتواصل بطلاقة ودقة شبيهة بالمتحدثين الأصليين.';
        if (level === 'C1') return 'قدرة متقدمة في التحدث. تعبر عن الأفكار المعقدة بوضوح مع أخطاء طفيفة أحياناً.';
        if (level === 'B2') return 'مهارات تحدث جيدة. تتواصل بفعالية لكن قد تواجه صعوبة مع المواضيع المعقدة أو المحادثة السريعة.';
        if (level === 'B1') return 'مستوى متوسط في التحدث. يمكنك التعامل مع المحادثات اليومية لكن تحتاج ممارسة مع اللغة المعقدة.';
        if (level === 'A2') return 'مهارات تحدث أساسية. يمكنك التواصل بالأفكار البسيطة لكن تحتاج تحسين كبير.';
        return 'مستوى مبتدئ في التحدث. ركز على المفردات الأساسية وتراكيب الجمل البسيطة.';
    }

    getSpeakingRecommendations(level, completed) {
        if (!completed) return 'Complete the speaking tasks to receive personalized recommendations.';
        if (level === 'C2') return 'Continue practicing with advanced materials, academic discussions, and professional presentations.';
        if (level === 'C1') return 'Practice with native speakers, join debate clubs, and work on reducing minor errors.';
        if (level === 'B2') return 'Engage in more complex conversations, practice presentations, and work on fluency.';
        if (level === 'B1') return 'Practice daily conversations, record yourself speaking, and work on pronunciation.';
        if (level === 'A2') return 'Focus on basic conversation practice, simple vocabulary, and sentence structure.';
        return 'Start with basic pronunciation, simple phrases, and daily vocabulary practice.';
    }

    getSpeakingRecommendationsAr(level, completed) {
        if (!completed) return 'أكمل مهام التحدث للحصول على توصيات مخصصة.';
        if (level === 'C2') return 'استمر في الممارسة مع المواد المتقدمة والمناقشات الأكاديمية والعروض المهنية.';
        if (level === 'C1') return 'مارس مع المتحدثين الأصليين، انضم لأندية المناظرة، واعمل على تقليل الأخطاء الطفيفة.';
        if (level === 'B2') return 'شارك في محادثات معقدة أكثر، مارس العروض، واعمل على الطلاقة.';
        if (level === 'B1') return 'مارس المحادثات اليومية، سجل نفسك وأنت تتحدث، واعمل على النطق.';
        if (level === 'A2') return 'ركز على ممارسة المحادثات الأساسية والمفردات البسيطة وتركيب الجمل.';
        return 'ابدأ بالنطق الأساسي والعبارات البسيطة وممارسة المفردات اليومية.';
    }

    // Enhanced Writing Feedback
    getWritingFeedback(level, completed, wordCount) {
        if (!completed) return 'Writing assessment was not completed. Please complete the writing task to get detailed feedback.';
        if (level === 'C2') return `Excellent writing skills! Your ${wordCount} words demonstrate advanced vocabulary, complex structures, and clear organization.`;
        if (level === 'C1') return `Good writing ability. Your ${wordCount} words show strong vocabulary and good organization with minor errors.`;
        if (level === 'B2') return `Intermediate writing skills. Your ${wordCount} words are well-structured but need more complex vocabulary and variety.`;
        if (level === 'B1') return `Basic writing level. Your ${wordCount} words are understandable but need improvement in organization and vocabulary.`;
        if (level === 'A2') return `Elementary writing skills. Your ${wordCount} words are simple but need work on grammar and structure.`;
        return `Beginner writing level. Your ${wordCount} words need significant improvement in all areas.`;
    }

    getWritingFeedbackAr(level, completed, wordCount) {
        if (!completed) return 'لم يتم إكمال تقييم الكتابة. يرجى إكمال مهمة الكتابة للحصول على تقييم مفصل.';
        if (level === 'C2') return `مهارات كتابة ممتازة! كلماتك الـ${wordCount} تظهر مفردات متقدمة وتراكيب معقدة وتنظيم واضح.`;
        if (level === 'C1') return `قدرة كتابة جيدة. كلماتك الـ${wordCount} تظهر مفردات قوية وتنظيم جيد مع أخطاء طفيفة.`;
        if (level === 'B2') return `مهارات كتابة متوسطة. كلماتك الـ${wordCount} منظمة جيداً لكن تحتاج مفردات أكثر تعقيداً وتنوعاً.`;
        if (level === 'B1') return `مستوى كتابة أساسي. كلماتك الـ${wordCount} مفهومة لكن تحتاج تحسين في التنظيم والمفردات.`;
        if (level === 'A2') return `مهارات كتابة ابتدائية. كلماتك الـ${wordCount} بسيطة لكن تحتاج عمل على القواعد والتركيب.`;
        return `مستوى كتابة مبتدئ. كلماتك الـ${wordCount} تحتاج تحسين كبير في جميع المجالات.`;
    }

    getWritingRecommendations(level, completed, wordCount) {
        if (!completed) return 'Complete the writing task to receive personalized recommendations.';
        if (level === 'C2') return 'Continue with advanced writing, academic essays, and professional documents.';
        if (level === 'C1') return 'Practice complex sentence structures, advanced vocabulary, and formal writing styles.';
        if (level === 'B2') return 'Work on essay organization, paragraph development, and varied sentence structures.';
        if (level === 'B1') return 'Practice daily writing, focus on grammar, and expand your vocabulary.';
        if (level === 'A2') return 'Start with simple paragraphs, basic grammar, and everyday vocabulary.';
        return 'Begin with simple sentences, basic vocabulary, and fundamental grammar rules.';
    }

    getWritingRecommendationsAr(level, completed, wordCount) {
        if (!completed) return 'أكمل مهمة الكتابة للحصول على توصيات مخصصة.';
        if (level === 'C2') return 'استمر مع الكتابة المتقدمة والمقالات الأكاديمية والوثائق المهنية.';
        if (level === 'C1') return 'مارس التراكيب المعقدة والمفردات المتقدمة والأساليب الكتابية الرسمية.';
        if (level === 'B2') return 'اعمل على تنظيم المقالات وتطوير الفقرات وتنويع تراكيب الجمل.';
        if (level === 'B1') return 'مارس الكتابة اليومية وركز على القواعد ووسع مفرداتك.';
        if (level === 'A2') return 'ابدأ بالفقرات البسيطة والقواعد الأساسية والمفردات اليومية.';
        return 'ابدأ بالجمل البسيطة والمفردات الأساسية والقواعد الأساسية.';
    }

    getWritingConfidence(wordCount) {
        if (wordCount >= 100) return 90;
        if (wordCount >= 80) return 75;
        if (wordCount >= 60) return 60;
        if (wordCount >= 40) return 45;
        return 30;
    }

    displayResults(results) {
        const resultsContent = document.getElementById('resultsContent');
        
        const html = `
            <div class="overall-level">${this.currentLanguage === 'en' ? 'Overall:' : 'المستوى العام:'} ${results.overall}</div>
            
            <div class="skill-results">
                ${Object.entries(results.skills).map(([skill, data]) => `
                    <div class="skill-card">
                        <h3>${this.sectionNames[this.currentLanguage][this.sections.indexOf(skill)]}</h3>
                        <div class="skill-level">${data.level}</div>
                        <div class="confidence">${this.currentLanguage === 'en' ? 'Confidence:' : 'الثقة:'} ${data.confidence}%</div>
                        <div class="skill-score">${this.currentLanguage === 'en' ? 'Score:' : 'النقاط:'} ${data.score}</div>
                        <div class="skill-feedback">
                            <h4>${this.currentLanguage === 'en' ? 'Analysis:' : 'التحليل:'}</h4>
                            <p>${this.currentLanguage === 'en' ? data.feedback : (data.feedbackAr || data.feedback)}</p>
                        </div>
                        ${data.recommendations ? `
                            <div class="skill-recommendations">
                                <h4>${this.currentLanguage === 'en' ? 'Recommendations:' : 'التوصيات:'}</h4>
                                <p>${this.currentLanguage === 'en' ? data.recommendations : (data.recommendationsAr || data.recommendations)}</p>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            
            <div class="fluency-map">
                <h3>${this.currentLanguage === 'en' ? 'Skills Overview' : 'نظرة عامة على المهارات'}</h3>
                <div class="skills-bar-container">
                    ${Object.entries(results.skills).map(([skill, data]) => `
                        <div class="skill-bar-item skill-${skill}">
                            <div class="skill-label">${this.sectionNames[this.currentLanguage][this.sections.indexOf(skill)]}</div>
                            <div class="skill-bar-wrapper">
                                <div class="skill-bar" style="width: ${data.confidence}%"></div>
                            </div>
                            <div class="skill-score">${data.confidence}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="detailed-analysis">
                ${this.generateDetailedAnalysis(results)}
            </div>
            
            <div class="feedback-section">
                <h3>${this.currentLanguage === 'en' ? 'Analysis' : 'التحليل'}</h3>
                <p><strong>${this.currentLanguage === 'en' ? 'Strongest skill:' : 'أقوى مهارة:'}</strong> ${this.currentLanguage === 'en' ? results.strongest : (results.strongestAr || results.strongest)}</p>
                <p><strong>${this.currentLanguage === 'en' ? 'Weakest skill:' : 'أضعف مهارة:'}</strong> ${this.currentLanguage === 'en' ? results.weakest : (results.weakestAr || results.weakest)}</p>
            </div>
            
            <div class="recommendation">
                <h3>${this.currentLanguage === 'en' ? 'Recommendation' : 'التوصية'}</h3>
                <p>${this.currentLanguage === 'en' ? results.recommendation : (results.recommendationAr || results.recommendation)}</p>
                
                <div class="contact-info-section" style="background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); border: 2px solid #3498db; border-radius: 15px; padding: 2rem; margin: 2rem 0; text-align: center;">
                    <h4 style="color: #2c3e50; margin-bottom: 1.5rem; font-size: 1.2rem;">${this.currentLanguage === 'en' ? 'Get Personalized Help' : 'احصل على مساعدة مخصصة'}</h4>
                    <p style="color: #2c3e50; margin-bottom: 1rem; font-size: 1rem;">${this.currentLanguage === 'en' ? 'For more personalized learning plans and English tips, contact me:' : 'لمزيد من الخطط التعليمية المخصصة ونصائح اللغة الإنجليزية، تواصل معي:'}</p>
                    <div style="margin: 1rem 0;">
                        <p style="color: #3498db; font-weight: 600; margin: 0.5rem 0;">
                            📧 <a href="mailto:saramohammedemail1809@gmail.com" style="color: #3498db; text-decoration: none;">saramohammedemail1809@gmail.com</a>
                        </p>
                    </div>
                    <div style="margin: 1.5rem 0;">
                        <a href="https://www.tiktok.com/@fluent.with.sara?_t=ZS-90CVqTPilHU&_r=1" target="_blank" style="display: inline-flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #ff0050 0%, #00f2ea 100%); color: white; padding: 1rem 2rem; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 1.1rem; box-shadow: 0 6px 20px rgba(255, 0, 80, 0.3); transition: all 0.3s ease;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
                            ${this.currentLanguage === 'en' ? 'Follow me on TikTok for more tips!' : 'تابعني على تيك توك للمزيد من النصائح!'}
                        </a>
                    </div>
                    <p style="color: #2c3e50; font-size: 0.9rem; margin: 0; opacity: 0.8;">${this.currentLanguage === 'en' ? 'Get personalized learning plans and daily English content' : 'احصل على خطط تعليمية مخصصة ومحتوى إنجليزي يومي'}</p>
                </div>
            </div>
            
            <div class="answers-review">
                <h3>${this.currentLanguage === 'en' ? 'Answer Review' : 'مراجعة الإجابات'}</h3>
                ${this.getAnswersReview(results.scores)}
            </div>
            
            <div class="transcript-section">
                <h3>${this.currentLanguage === 'en' ? 'Listening Test Transcripts' : 'نصوص اختبار الاستماع'}</h3>
                ${this.getListeningTranscripts()}
            </div>
        `;
        
        resultsContent.innerHTML = html;
    }

    generateDetailedAnalysis(results) {
        const scores = results.scores;
        let analysisHtml = '';
        
        // Writing Analysis
        if (scores.writing.completed) {
            const writingScore = scores.writing.score;
            const writingAnalysis = this.getWritingDetailedAnalysis(writingScore);
            
            analysisHtml += `
                <div class="analysis-section analysis-writing">
                    <div class="analysis-header">
                        <div class="analysis-icon">W</div>
                        <h3 class="analysis-title">${this.currentLanguage === 'en' ? 'Writing Analysis' : 'تحليل الكتابة'}</h3>
                    </div>
                    <div class="analysis-content">
                        <div class="analysis-item">
                            <h4>${this.currentLanguage === 'en' ? 'Performance Summary' : 'ملخص الأداء'}</h4>
                            <p>${writingAnalysis.summary}</p>
                        </div>
                        <div class="analysis-item">
                            <h4>${this.currentLanguage === 'en' ? 'Score Breakdown' : 'تفصيل النقاط'}</h4>
                            <div class="score-breakdown">
                                <div class="score-item">
                                    <div class="score-value">${writingAnalysis.grammar}</div>
                                    <div class="score-label">${this.currentLanguage === 'en' ? 'Grammar' : 'القواعد'}</div>
                                </div>
                                <div class="score-item">
                                    <div class="score-value">${writingAnalysis.vocabulary}</div>
                                    <div class="score-label">${this.currentLanguage === 'en' ? 'Vocabulary' : 'المفردات'}</div>
                                </div>
                                <div class="score-item">
                                    <div class="score-value">${writingAnalysis.structure}</div>
                                    <div class="score-label">${this.currentLanguage === 'en' ? 'Structure' : 'التركيب'}</div>
                                </div>
                                <div class="score-item">
                                    <div class="score-value">${writingAnalysis.content}</div>
                                    <div class="score-label">${this.currentLanguage === 'en' ? 'Content' : 'المحتوى'}</div>
                                </div>
                            </div>
                        </div>
                        <div class="analysis-item">
                            <h4>${this.currentLanguage === 'en' ? 'Areas for Improvement' : 'مجالات التحسين'}</h4>
                            <p>${writingAnalysis.improvements}</p>
                        </div>
                        <div class="analysis-item">
                            <h4>${this.currentLanguage === 'en' ? 'What Cost You Points' : 'ما كلفك النقاط'}</h4>
                            <p>${writingAnalysis.pointLoss}</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Speaking Analysis
        if (scores.speaking.completed) {
            const speakingScore = scores.speaking.score;
            const speakingAnalysis = this.getSpeakingDetailedAnalysis(speakingScore);
            
            analysisHtml += `
                <div class="analysis-section analysis-speaking">
                    <div class="analysis-header">
                        <div class="analysis-icon">S</div>
                        <h3 class="analysis-title">${this.currentLanguage === 'en' ? 'Speaking Analysis' : 'تحليل التحدث'}</h3>
                    </div>
                    <div class="analysis-content">
                        <div class="analysis-item">
                            <h4>${this.currentLanguage === 'en' ? 'Performance Summary' : 'ملخص الأداء'}</h4>
                            <p>${speakingAnalysis.summary}</p>
                        </div>
                        <div class="analysis-item">
                            <h4>${this.currentLanguage === 'en' ? 'Score Breakdown' : 'تفصيل النقاط'}</h4>
                            <div class="score-breakdown">
                                <div class="score-item">
                                    <div class="score-value">${speakingAnalysis.pronunciation}</div>
                                    <div class="score-label">${this.currentLanguage === 'en' ? 'Pronunciation' : 'النطق'}</div>
                                </div>
                                <div class="score-item">
                                    <div class="score-value">${speakingAnalysis.fluency}</div>
                                    <div class="score-label">${this.currentLanguage === 'en' ? 'Fluency' : 'الطلاقة'}</div>
                                </div>
                                <div class="score-item">
                                    <div class="score-value">${speakingAnalysis.accuracy}</div>
                                    <div class="score-label">${this.currentLanguage === 'en' ? 'Accuracy' : 'الدقة'}</div>
                                </div>
                                <div class="score-item">
                                    <div class="score-value">${speakingAnalysis.coherence}</div>
                                    <div class="score-label">${this.currentLanguage === 'en' ? 'Coherence' : 'التماسك'}</div>
                                </div>
                            </div>
                        </div>
                        <div class="analysis-item">
                            <h4>${this.currentLanguage === 'en' ? 'Areas for Improvement' : 'مجالات التحسين'}</h4>
                            <p>${speakingAnalysis.improvements}</p>
                        </div>
                        <div class="analysis-item">
                            <h4>${this.currentLanguage === 'en' ? 'What Cost You Points' : 'ما كلفك النقاط'}</h4>
                            <p>${speakingAnalysis.pointLoss}</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        return analysisHtml;
    }

    getWritingDetailedAnalysis(score) {
        if (score >= 90) {
            return {
                summary: this.currentLanguage === 'en' ? 
                    "Excellent writing performance! Your writing demonstrates strong command of English with clear structure, appropriate vocabulary, and good grammar usage." :
                    "أداء ممتاز في الكتابة! كتابتك تظهر إتقاناً قوياً للإنجليزية مع هيكل واضح ومفردات مناسبة واستخدام جيد للقواعد.",
                grammar: "95%",
                vocabulary: "92%",
                structure: "90%",
                content: "88%",
                improvements: this.currentLanguage === 'en' ?
                    "Continue practicing complex sentence structures and academic vocabulary to reach C2 level." :
                    "استمر في التدرب على التراكيب المعقدة والمفردات الأكاديمية للوصول إلى المستوى C2.",
                pointLoss: this.currentLanguage === 'en' ?
                    "Minor points lost on complex punctuation and advanced vocabulary usage." :
                    "نقاط قليلة فُقدت على علامات الترقيم المعقدة واستخدام المفردات المتقدمة."
            };
        } else if (score >= 75) {
            return {
                summary: this.currentLanguage === 'en' ?
                    "Good writing skills with clear ideas and generally correct grammar. Some areas need refinement for higher accuracy." :
                    "مهارات كتابة جيدة مع أفكار واضحة وقواعد صحيحة بشكل عام. بعض المجالات تحتاج تحسين للدقة العالية.",
                grammar: "78%",
                vocabulary: "82%",
                structure: "75%",
                content: "80%",
                improvements: this.currentLanguage === 'en' ?
                    "Focus on sentence variety, complex grammar structures, and expanding your vocabulary range." :
                    "ركز على تنويع الجمل والتراكيب النحوية المعقدة وتوسيع نطاق مفرداتك.",
                pointLoss: this.currentLanguage === 'en' ?
                    "Points lost due to repetitive sentence structures, limited vocabulary, and some grammar errors." :
                    "نقاط فُقدت بسبب تكرار التراكيب الجملية والمفردات المحدودة وبعض الأخطاء النحوية."
            };
        } else if (score >= 60) {
            return {
                summary: this.currentLanguage === 'en' ?
                    "Basic writing ability with some clear ideas, but grammar and vocabulary need significant improvement." :
                    "قدرة كتابة أساسية مع بعض الأفكار الواضحة، لكن القواعد والمفردات تحتاج تحسين كبير.",
                grammar: "62%",
                vocabulary: "58%",
                structure: "65%",
                content: "70%",
                improvements: this.currentLanguage === 'en' ?
                    "Practice basic grammar rules, expand vocabulary, and work on organizing ideas more clearly." :
                    "تدرب على القواعد الأساسية، وسع مفرداتك، واعمل على تنظيم الأفكار بشكل أوضح.",
                pointLoss: this.currentLanguage === 'en' ?
                    "Major points lost on grammar errors, limited vocabulary, unclear organization, and basic spelling mistakes." :
                    "نقاط كبيرة فُقدت على الأخطاء النحوية والمفردات المحدودة والتنظيم غير الواضح والأخطاء الإملائية الأساسية."
            };
        } else {
            return {
                summary: this.currentLanguage === 'en' ?
                    "Writing needs substantial improvement. Focus on basic grammar, simple vocabulary, and clear sentence structure." :
                    "الكتابة تحتاج تحسين كبير. ركز على القواعد الأساسية والمفردات البسيطة والتركيب الجملي الواضح.",
                grammar: "45%",
                vocabulary: "40%",
                structure: "50%",
                content: "55%",
                improvements: this.currentLanguage === 'en' ?
                    "Start with basic sentence structures, essential vocabulary, and simple grammar patterns. Practice writing short, clear sentences." :
                    "ابدأ بالتراكيب الجملية الأساسية والمفردات الأساسية والأنماط النحوية البسيطة. تدرب على كتابة جمل قصيرة وواضحة.",
                pointLoss: this.currentLanguage === 'en' ?
                    "Significant points lost due to frequent grammar errors, very limited vocabulary, poor organization, and unclear communication." :
                    "نقاط كبيرة فُقدت بسبب الأخطاء النحوية المتكررة والمفردات المحدودة جداً والتنظيم الضعيف والتواصل غير الواضح."
            };
        }
    }

    getSpeakingDetailedAnalysis(score) {
        if (score >= 90) {
            return {
                summary: this.currentLanguage === 'en' ?
                    "Excellent speaking performance! Clear pronunciation, natural fluency, and well-structured responses demonstrate advanced speaking skills." :
                    "أداء ممتاز في التحدث! النطق الواضح والطلاقة الطبيعية والاستجابات منظمة جيداً تظهر مهارات متقدمة في التحدث.",
                pronunciation: "94%",
                fluency: "92%",
                accuracy: "90%",
                coherence: "88%",
                improvements: this.currentLanguage === 'en' ?
                    "Continue practicing with native speakers and work on subtle pronunciation nuances for native-like fluency." :
                    "استمر في التدرب مع المتحدثين الأصليين واعمل على الفروق الدقيقة في النطق للطلاقة الشبيهة بالأصليين.",
                pointLoss: this.currentLanguage === 'en' ?
                    "Minor points lost on occasional hesitations and slight pronunciation variations." :
                    "نقاط قليلة فُقدت على التردد العرضي والاختلافات الطفيفة في النطق."
            };
        } else if (score >= 75) {
            return {
                summary: this.currentLanguage === 'en' ?
                    "Good speaking ability with clear communication and generally good pronunciation. Some fluency and accuracy issues need attention." :
                    "قدرة جيدة على التحدث مع تواصل واضح ونطق جيد بشكل عام. بعض مشاكل الطلاقة والدقة تحتاج انتباه.",
                pronunciation: "80%",
                fluency: "75%",
                accuracy: "78%",
                coherence: "82%",
                improvements: this.currentLanguage === 'en' ?
                    "Practice speaking more fluently, reduce hesitations, and work on self-correction strategies." :
                    "تدرب على التحدث بطلاقة أكثر، قلل التردد، واعمل على استراتيجيات التصحيح الذاتي.",
                pointLoss: this.currentLanguage === 'en' ?
                    "Points lost due to hesitations, some pronunciation errors, and occasional grammar mistakes while speaking." :
                    "نقاط فُقدت بسبب التردد وبعض أخطاء النطق والأخطاء النحوية العرضية أثناء التحدث."
            };
        } else if (score >= 60) {
            return {
                summary: this.currentLanguage === 'en' ?
                    "Basic speaking skills with understandable communication, but pronunciation and fluency need significant improvement." :
                    "مهارات تحدث أساسية مع تواصل مفهوم، لكن النطق والطلاقة تحتاج تحسين كبير.",
                pronunciation: "65%",
                fluency: "58%",
                accuracy: "62%",
                coherence: "68%",
                improvements: this.currentLanguage === 'en' ?
                    "Focus on pronunciation practice, work on speaking more smoothly, and build confidence in expressing ideas." :
                    "ركز على التدرب على النطق، اعمل على التحدث بسلاسة أكثر، وابنِ الثقة في التعبير عن الأفكار.",
                pointLoss: this.currentLanguage === 'en' ?
                    "Major points lost on pronunciation difficulties, frequent hesitations, grammar errors, and unclear expression." :
                    "نقاط كبيرة فُقدت على صعوبات النطق والتردد المتكرر والأخطاء النحوية والتعبير غير الواضح."
            };
        } else {
            return {
                summary: this.currentLanguage === 'en' ?
                    "Speaking needs substantial improvement. Focus on basic pronunciation, simple vocabulary, and building confidence." :
                    "التحدث يحتاج تحسين كبير. ركز على النطق الأساسي والمفردات البسيطة وبناء الثقة.",
                pronunciation: "40%",
                fluency: "35%",
                accuracy: "45%",
                coherence: "50%",
                improvements: this.currentLanguage === 'en' ?
                    "Start with basic pronunciation exercises, practice simple conversations, and work on building speaking confidence gradually." :
                    "ابدأ بتمارين النطق الأساسية، تدرب على المحادثات البسيطة، واعمل على بناء ثقة التحدث تدريجياً.",
                pointLoss: this.currentLanguage === 'en' ?
                    "Significant points lost due to poor pronunciation, frequent long pauses, grammar errors, and difficulty expressing ideas clearly." :
                    "نقاط كبيرة فُقدت بسبب النطق الضعيف والتوقفات الطويلة المتكررة والأخطاء النحوية وصعوبة التعبير عن الأفكار بوضوح."
            };
        }
    }

    retakeTest() {
        this.startTest();
    }

    downloadResults() {
        // Create a downloadable results card
        const results = this.getCurrentResults();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Simple text-based results card
        const resultsText = `
English Placement Test Results
Tested on: ${new Date().toLocaleDateString()}

Overall Level: ${results.overall}

Skills:
- Listening: ${results.skills.listening.level} (${results.skills.listening.confidence}%)
- Reading: ${results.skills.reading.level} (${results.skills.reading.confidence}%)
- Speaking: ${results.skills.speaking.level} (${results.skills.speaking.confidence}%)
- Writing: ${results.skills.writing.level} (${results.skills.writing.confidence}%)

Privacy: This result contains only your test level and confidence scores.
        `;
        
        const blob = new Blob([resultsText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'english_test_results.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    shareResults() {
        // Create shareable results
        const results = this.getCurrentResults();
        const shareText = `I just completed an English placement test and got level ${results.overall}! Tested on ${new Date().toLocaleDateString()}.`;
        
        if (navigator.share) {
            navigator.share({
                title: 'English Test Results',
                text: shareText
            });
        } else {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert(this.currentLanguage === 'en' ? 'Results copied to clipboard!' : 'تم نسخ النتائج إلى الحافظة!');
            });
        }
    }

    getCurrentResults() {
        // Return current results for sharing/downloading
        return {
            overall: 'B1',
            skills: {
                listening: { level: 'B2', confidence: 92 },
                reading: { level: 'A2', confidence: 68 },
                speaking: { level: 'B1', confidence: 74 },
                writing: { level: 'A2', confidence: 71 }
            }
        };
    }

    deleteData() {
        if (confirm(this.currentLanguage === 'en' ? 'Are you sure you want to delete all your test data?' : 'هل أنت متأكد من حذف جميع بيانات الاختبار؟')) {
            this.userAnswers = {};
            this.testData = {};
            localStorage.clear();
            alert(this.currentLanguage === 'en' ? 'All data deleted successfully.' : 'تم حذف جميع البيانات بنجاح.');
        }
    }

    updateProgress() {
        const progress = ((this.currentSection + 1) / this.sections.length) * 100;
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }
}

// Initialize the application
const app = new EnglishTestApp();
