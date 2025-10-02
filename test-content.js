// Complete Test Content for English Placement Test
// This file contains all test questions, passages, and prompts as specified

const TEST_CONTENT = {
    listening: [
        {
            id: 'listening1',
            description: 'A conversation between two friends (Emma and David)',
            audioUrl: 'audio/trip_planning.mp3',
            duration: 40,
            transcript: "Speaker 1: Hi David! Are you free this weekend? I was thinking we could go on a little adventure. Speaker 2: Oh, that sounds exciting! What did you have in mind? Speaker 1: Well, I know this amazing hiking trail in the mountains. We could leave Saturday morning and come back Sunday evening. Speaker 2: That sounds perfect! I've been wanting to get out of the city. What time were you thinking of leaving? Speaker 1: How about we meet at the coffee shop at nine? We can grab breakfast before we go. Speaker 2: Great idea! But wait, I have a dentist appointment at eight thirty. Can we make it nine thirty instead? Speaker 1: Of course! Let's meet at the coffee shop at nine thirty then. I'll bring some snacks for the hike. Speaker 2: Perfect! I'll bring my camera. This is going to be so much fun!",
            questions: [
                {
                    id: 'l1q1',
                    type: 'multiple_choice',
                    question: 'What activity are Emma and David planning to do?',
                    options: [
                        'Go to a birthday party',
                        'Go hiking in the mountains',
                        'Visit a museum',
                        'Go to the beach'
                    ],
                    correct: 1
                },
                {
                    id: 'l1q2',
                    type: 'multiple_choice',
                    question: 'What time will they meet at the coffee shop?',
                    options: [
                        'At 8:30 AM',
                        'At 9:00 AM',
                        'At 9:30 AM',
                        'At 10:00 AM'
                    ],
                    correct: 2
                },
                {
                    id: 'l1q3',
                    type: 'gap_fill',
                    question: 'David has a dentist appointment at eight _______.',
                    correct: 'thirty'
                }
            ]
        },
        {
            id: 'listening2',
            description: 'A conversation between two radio hosts discussing a local festival',
            audioUrl: 'audio/festival_news.mp3',
            duration: 40,
            transcript: "Speaker 1: Good morning everyone! I'm here with my co-host to talk about the upcoming Spring Festival. Speaker 2: That's right! The annual Spring Festival will begin on March 20th and run for three days until March 22nd. Speaker 1: It's going to be amazing! The festival will feature live music, food vendors, and family activities throughout the weekend. Speaker 2: Absolutely! The main stage will be set up in Central Park, with performances starting at 10 AM each day. Speaker 1: Due to expected large crowds, organizers are advising visitors to arrive early and bring water bottles. Speaker 2: Good point! Parking will be available at the nearby shopping center with a free shuttle service running every 15 minutes to the festival grounds. Speaker 1: And the weather forecast looks promising with sunny skies and temperatures in the mid-70s. Speaker 2: Perfect weather for a festival! For more information, visit our website or call the festival hotline.",
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
                    question: 'What transportation option is mentioned for festival visitors?',
                    options: [
                        'Free parking at the venue',
                        'Free shuttle service from shopping center',
                        'Taxi service available',
                        'Public bus routes'
                    ],
                    correct: 1
                },
                {
                    id: 'l2q3',
                    type: 'gap_fill',
                    question: 'The organizers warned visitors to bring water _______.',
                    correct: 'bottles'
                }
            ]
        },
        {
            id: 'listening3',
            description: 'A conversation between a teacher and student explaining how a thermometer works',
            audioUrl: 'audio/thermometer.mp3',
            duration: 40,
            transcript: "Speaker 1: Today we're going to learn about thermometers. Can you tell me what a thermometer is used for? Speaker 2: A thermometer measures temperature, right? Speaker 1: Exactly! The most common type is the liquid-in-glass thermometer. It consists of a narrow glass tube with a bulb at one end. Speaker 2: And inside the tube is a liquid, usually mercury or colored alcohol? Speaker 1: That's correct! When the temperature rises, the liquid inside expands and rises up the tube. Speaker 2: So the higher the temperature, the more the liquid expands and the higher it rises? Speaker 1: Precisely! A scale marked on the tube allows us to read the temperature. Speaker 2: This works because most liquids expand when heated and contract when cooled, right? Speaker 1: Exactly! This principle is used in many everyday devices, from weather stations to medical thermometers.",
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
                    question: 'The liquid inside _______ when the temperature rises.',
                    correct: 'expands'
                }
            ]
        }
    ],
    
    reading: [
        {
            id: 'reading1',
            title: 'Language Exchange at Local Café',
            difficulty: 'Easy',
            level: 'A2',
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
            difficulty: 'Medium',
            level: 'B1',
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
        },
        {
            id: 'reading3',
            title: 'The Paradox of Choice in Modern Society',
            difficulty: 'Hard',
            level: 'B2-C1',
            content: `In contemporary Western societies, the abundance of choice has paradoxically become a source of anxiety rather than liberation. Psychologist Barry Schwartz argues that while having options is generally beneficial, an excess of choices can lead to decision paralysis, increased regret, and decreased satisfaction. This phenomenon, termed "the paradox of choice," manifests in various domains of modern life. When consumers face dozens of cereal brands in a supermarket aisle or hundreds of streaming options on Netflix, they often experience cognitive overload. The mental effort required to evaluate numerous alternatives can be exhausting, leading individuals to either avoid making decisions altogether or to experience post-decision regret when they realize they could have chosen differently. Furthermore, the expectation that we should find the "perfect" choice among numerous options creates unrealistic standards, ultimately diminishing our contentment with whatever we select. This psychological burden extends beyond consumer decisions to career choices, romantic relationships, and even trivial matters like choosing a restaurant for dinner.`,
            wordCount: 250,
            questions: [
                {
                    id: 'r3q1',
                    type: 'multiple_choice',
                    question: 'According to Schwartz, what is the main problem with having too many choices?',
                    options: [
                        'It costs too much money',
                        'It leads to decision paralysis and decreased satisfaction',
                        'It makes people too happy',
                        'It reduces the quality of products'
                    ],
                    correct: 1
                },
                {
                    id: 'r3q2',
                    type: 'multiple_choice',
                    question: 'What does "cognitive overload" mean in this context?',
                    options: [
                        'Having too much energy',
                        'Mental exhaustion from evaluating too many options',
                        'Being too smart',
                        'Lack of intelligence'
                    ],
                    correct: 1
                },
                {
                    id: 'r3q3',
                    type: 'multiple_choice',
                    question: 'What is "post-decision regret"?',
                    options: [
                        'Regret before making a decision',
                        'Feeling sorry after realizing you could have chosen differently',
                        'Being happy with your choice',
                        'Never making decisions'
                    ],
                    correct: 1
                },
                {
                    id: 'r3q4',
                    type: 'multiple_choice',
                    question: 'According to the passage, where does the "paradox of choice" NOT manifest?',
                    options: [
                        'Consumer decisions',
                        'Career choices',
                        'Romantic relationships',
                        'Basic survival needs'
                    ],
                    correct: 3
                },
                {
                    id: 'r3q5',
                    type: 'multiple_choice',
                    question: 'What unrealistic expectation does the abundance of choice create?',
                    options: [
                        'That we should be satisfied with any choice',
                        'That we should find the "perfect" choice',
                        'That choices don\'t matter',
                        'That we should avoid choosing'
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
            type: 'descriptive',
            instructions: 'Think about a trip that was special to you. Describe where you went, what you did, and explain why this trip was important or memorable for you.'
        },
        {
            id: 'speaking2',
            prompt: 'Do you agree or disagree with the statement: "Learning English is more important than learning history"? Explain your opinion. Speak for about 60 seconds.',
            duration: 60,
            type: 'argumentative',
            instructions: 'Consider both sides of this argument. Think about the practical benefits of learning English versus the value of understanding history. Give reasons to support your position.'
        }
    ],
    
    writing: {
        id: 'writing1',
        prompt: 'Describe a problem in your city and suggest a realistic solution in about 80-120 words.',
        minWords: 80,
        maxWords: 120,
        instructions: 'Think about a real problem that affects your city or community. It could be related to transportation, environment, education, safety, or any other issue. Describe the problem clearly and then propose a practical solution that could realistically be implemented.'
    }
};

// Sample Results for Demo
const SAMPLE_RESULTS = {
    overall: 'B1',
    skills: {
        listening: { 
            level: 'B2', 
            confidence: 92, 
            feedback: 'You understand most spoken language on familiar topics and can follow extended speech, though you sometimes miss implied details.',
            feedbackAr: 'تفهم معظم اللغة المنطوقة في المواضيع المألوفة ويمكنك متابعة الخطاب المطول، رغم أنك تفوت أحياناً التفاصيل الضمنية.'
        },
        reading: { 
            level: 'A2', 
            confidence: 68, 
            feedback: 'You can understand short simple texts but struggle with longer articles and complex vocabulary.',
            feedbackAr: 'يمكنك فهم النصوص البسيطة القصيرة ولكنك تواجه صعوبة مع المقالات الطويلة والمفردات المعقدة.'
        },
        speaking: { 
            level: 'B1', 
            confidence: 74, 
            feedback: 'You speak with some fluency but make frequent grammar errors and sometimes struggle with complex ideas.',
            feedbackAr: 'تتحدث بطلاقة نسبية ولكنك ترتكب أخطاء نحوية متكررة وأحياناً تواجه صعوبة مع الأفكار المعقدة.'
        },
        writing: { 
            level: 'A2', 
            confidence: 71, 
            feedback: 'You can write simple sentences but need to improve organization and vocabulary range.',
            feedbackAr: 'يمكنك كتابة جمل بسيطة ولكنك تحتاج لتحسين التنظيم ومجموعة المفردات.'
        }
    },
    strongest: 'Listening — you grasp details and implied meaning when people speak slowly.',
    strongestAr: 'الاستماع — تفهم التفاصيل والمعنى الضمني عندما يتحدث الناس ببطء.',
    weakest: 'Reading — you miss inferences and have limited reading stamina.',
    weakestAr: 'القراءة — تفوت الاستنتاجات ولديك قدرة محدودة على القراءة المطولة.',
    recommendation: 'To raise reading from A2 to B1 in four weeks, read one graded 150–200 word article daily for 15–20 minutes, learn 5 new words every day from those articles, and write a 2–3 sentence summary twice a week; retake the reading section after four weeks to check progress.',
    recommendationAr: 'لرفع مستوى القراءة من A2 إلى B1 في أربعة أسابيع، اقرأ مقالاً واحداً من 150-200 كلمة يومياً لمدة 15-20 دقيقة، تعلم 5 كلمات جديدة كل يوم من تلك المقالات، واكتب ملخصاً من 2-3 جمل مرتين في الأسبوع؛ أعد قسم القراءة بعد أربعة أسابيع للتحقق من التقدم.'
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TEST_CONTENT, SAMPLE_RESULTS };
}
