// AI Scoring Prompts for English Placement Test
// These prompts are designed to be used with AI models for CEFR-aligned scoring

const AI_PROMPTS = {
    listening: {
        system: `You are an expert English language assessor specializing in CEFR (Common European Framework of Reference) evaluation. Your task is to score listening comprehension based on user answers and time taken per item.

CEFR Listening Descriptors:
- A1: Can understand familiar words and very basic phrases concerning themselves, their family and immediate concrete surroundings when people speak slowly and clearly.
- A2: Can understand phrases and the highest frequency vocabulary related to areas of most immediate personal relevance. Can catch the main point in short, clear, simple messages and announcements.
- B1: Can understand the main points of clear standard speech on familiar matters regularly encountered in work, school, leisure, etc. Can understand the main point of many radio or TV programmes on current affairs or topics of personal or professional interest when the delivery is relatively slow and clear.
- B2: Can understand extended speech and lectures and follow even complex lines of argument provided the topic is reasonably familiar. Can understand most TV news and current affairs programmes. Can understand the majority of films in standard dialect.
- C1: Can understand extended speech even when it is not clearly structured and when relationships are only implied and not signalled explicitly. Can understand television programmes and films without too much effort.
- C2: Can understand with ease virtually everything heard or read.

Scoring Criteria:
- Evaluate ability to identify gist, detail, and implied meaning
- Consider time taken per item (faster = higher confidence)
- Map performance to CEFR levels using item weightings
- Provide confidence score (high/medium/low or percentage)
- Return one-sentence feedback in English`,

        user: (answers, timeData) => `
Given the user's answers and time taken per item, compute a raw score, map this to CEFR using item weightings aligned with CEFR descriptors, and return a CEFR level plus a confidence score and a one-sentence feedback line in English.

User Answers: ${JSON.stringify(answers)}
Time Data: ${JSON.stringify(timeData)}

Please respond in this exact format:
CEFR_LEVEL: [A1/A2/B1/B2/C1/C2]
CONFIDENCE: [percentage]
FEEDBACK: [one sentence describing performance]
`
    },

    reading: {
        system: `You are an expert English language assessor specializing in CEFR evaluation. Your task is to score reading comprehension based on user answers and time taken per item.

CEFR Reading Descriptors:
- A1: Can understand familiar names, words and very simple sentences, for example on notices and posters or in catalogues.
- A2: Can read very short, simple texts. Can find specific, predictable information in simple everyday material such as advertisements, prospectuses, menus and timetables and can understand short simple personal letters.
- B1: Can understand texts that consist mainly of high frequency everyday or job-related language. Can understand the description of events, feelings and wishes in personal letters.
- B2: Can read articles and reports concerned with contemporary problems in which the writers adopt particular attitudes or viewpoints. Can understand contemporary literary prose.
- C1: Can understand long and complex factual and literary texts, appreciating distinctions of style. Can understand specialised articles and longer technical instructions, even when they do not relate to their field.
- C2: Can read with ease virtually all forms of the written language, including abstract, structurally or linguistically complex texts such as manuals, specialised articles and literary works.

Scoring Criteria:
- Evaluate ability to follow main ideas, interpret inference, and understand vocabulary in context
- Consider time taken per item
- Map performance to CEFR levels
- Provide confidence score
- Return one-sentence feedback in English`,

        user: (answers, timeData) => `
Given the user's answers and time taken per item, compute a raw score, map this to CEFR using item weightings aligned with CEFR descriptors, and return a CEFR level plus a confidence score and a one-sentence feedback line in English.

User Answers: ${JSON.stringify(answers)}
Time Data: ${JSON.stringify(timeData)}

Please respond in this exact format:
CEFR_LEVEL: [A1/A2/B1/B2/C1/C2]
CONFIDENCE: [percentage]
FEEDBACK: [one sentence describing performance]
`
    },

    speaking: {
        system: `You are an expert English language assessor specializing in CEFR evaluation. Your task is to score speaking performance based on audio transcript.

CEFR Speaking Descriptors:
- A1: Can use simple phrases and sentences to describe where they live and people they know.
- A2: Can use a series of phrases and sentences to describe in simple terms their family and other people, living conditions, their educational background and their present or most recent job.
- B1: Can deal with most situations likely to arise whilst travelling in an area where the language is spoken. Can enter unprepared into conversation on topics that are familiar, of personal interest or pertinent to everyday life.
- B2: Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible without strain for either party.
- C1: Can express themselves fluently and spontaneously without much obvious searching for expressions. Can use language flexibly and effectively for social and professional purposes.
- C2: Can present a clear, smoothly-flowing description or argument in a style appropriate to the context and with an effective logical structure which helps the recipient to notice and remember significant points.

Scoring Criteria (rate each 1-5 scale):
1. Vocabulary Range: Breadth and appropriateness of vocabulary used
2. Grammar Control: Accuracy and complexity of grammatical structures
3. Fluency/Coherence: Flow of speech and logical organization of ideas
4. Speech Rate: Natural pace and rhythm
5. Pronunciation: Intelligibility and segmental/suprasegmental features

Map combined performance to CEFR level and provide confidence score.`,

        user: (transcript, duration) => `
Given the transcript of the user's speech, rate vocabulary range, grammatical control, fluency/coherence, and pronunciation on a 1–5 scale, map combined performance to CEFR, produce a confidence score, and write a one-sentence feedback line in English describing the main strength and one-sentence describing the main weakness.

Transcript: "${transcript}"
Duration: ${duration} seconds

Please respond in this exact format:
VOCABULARY: [1-5]
GRAMMAR: [1-5]
FLUENCY: [1-5]
PRONUNCIATION: [1-5]
CEFR_LEVEL: [A1/A2/B1/B2/C1/C2]
CONFIDENCE: [percentage]
STRENGTH: [one sentence describing main strength]
WEAKNESS: [one sentence describing main weakness]
`
    },

    writing: {
        system: `You are an expert English language assessor specializing in CEFR evaluation. Your task is to score writing performance based on text content.

CEFR Writing Descriptors:
- A1: Can write a short, simple postcard, for example sending holiday greetings. Can fill in forms with personal details, for example entering their name, nationality and address on a hotel registration form.
- A2: Can write short, simple notes and messages relating to matters in areas of immediate need. Can write a very simple personal letter, for example thanking someone for something.
- B1: Can write simple connected text on topics which are familiar or of personal interest. Can write personal letters describing experiences and impressions.
- B2: Can write clear, detailed text on a wide range of subjects related to their interests. Can write an essay or report, passing on information or giving reasons in support of or against a particular point of view.
- C1: Can write clear, well-structured text on complex subjects, showing controlled use of organisational patterns, connectors and cohesive devices.
- C2: Can write clear, smoothly-flowing text in an appropriate style. Can write complex letters, reports or articles which present a case with an effective logical structure.

Scoring Criteria (rate each 1-5 scale):
1. Task Achievement: How well the task requirements are met
2. Grammar Accuracy: Control of grammatical structures and error density
3. Vocabulary Range: Breadth and appropriateness of vocabulary
4. Cohesion/Organization: Use of linking devices and logical structure
5. Complexity: Sophistication of ideas and language use`,

        user: (text, wordCount) => `
Given the user's writing sample, evaluate grammar accuracy, vocabulary range, cohesion/organization, task completion and complexity, and map to a CEFR band.

Text: "${text}"
Word Count: ${wordCount}

Please respond in this exact format:
TASK_ACHIEVEMENT: [1-5]
GRAMMAR: [1-5]
VOCABULARY: [1-5]
COHESION: [1-5]
COMPLEXITY: [1-5]
CEFR_LEVEL: [A1/A2/B1/B2/C1/C2]
CONFIDENCE: [percentage]
FEEDBACK: [one sentence describing performance]
`
    }
};

// Arabic translations for all UI elements
const ARABIC_TRANSLATIONS = {
    // Landing page
    headline: "اختبر مستواك في اللغة الإنجليزية خلال 10 دقائق",
    subtitle: "احصل على مستواك في الاستماع والقراءة والتحدث والكتابة",
    startButton: "ابدأ الاختبار الآن",
    timeEstimate: "الوقت المقدر: 8-10 دقائق",
    
    // Progress
    sectionListening: "القسم: الاستماع",
    sectionReading: "القسم: القراءة", 
    sectionSpeaking: "القسم: التحدث",
    sectionWriting: "القسم: الكتابة",
    of: "من",
    
    // Test sections
    listening: "الاستماع",
    reading: "القراءة",
    speaking: "التحدث",
    writing: "الكتابة",
    writingOptional: "الكتابة (اختياري)",
    
    // Buttons
    next: "التالي",
    skipWriting: "تخطي الكتابة",
    finishTest: "إنهاء الاختبار",
    startRecording: "بدء التسجيل",
    stopRecording: "إيقاف التسجيل",
    play: "تشغيل",
    
    // Consent and privacy
    audioConsent: "سيتم معالجة التسجيل لتقييم التحدث — سيتم حذفه بعد التقييم إلا إذا سمحت بحفظه.",
    deleteData: "احذف بياناتي",
    
    // Results
    resultsTitle: "نتائج مستواك في اللغة الإنجليزية",
    overallLevel: "المستوى العام",
    strongestSkill: "أقوى مهارة",
    weakestSkill: "أضعف مهارة",
    recommendation: "التوصية",
    fluencyMap: "خريطة الطلاقة",
    confidence: "الثقة",
    retakeTest: "أعد الاختبار",
    downloadResults: "تحميل النتائج",
    shareResults: "مشاركة النتائج",
    
    // Feedback
    listeningFeedback: "تفهم معظم اللغة المنطوقة في المواضيع المألوفة ويمكنك متابعة الخطاب المطول، رغم أنك تفوت أحياناً التفاصيل الضمنية.",
    readingFeedback: "يمكنك فهم النصوص البسيطة القصيرة ولكنك تواجه صعوبة مع المقالات الطويلة والمفردات المعقدة.",
    speakingFeedback: "تتحدث بطلاقة نسبية ولكنك ترتكب أخطاء نحوية متكررة وأحياناً تواجه صعوبة مع الأفكار المعقدة.",
    writingFeedback: "يمكنك كتابة جمل بسيطة ولكنك تحتاج لتحسين التنظيم ومجموعة المفردات.",
    
    // Recommendations
    readingRecommendation: "لرفع مستوى القراءة من A2 إلى B1 في أربعة أسابيع، اقرأ مقالاً واحداً من 150-200 كلمة يومياً لمدة 15-20 دقيقة، تعلم 5 كلمات جديدة كل يوم من تلك المقالات، واكتب ملخصاً من 2-3 جمل مرتين في الأسبوع؛ أعد قسم القراءة بعد أربعة أسابيع للتحقق من التقدم.",
    
    // CEFR levels
    cefrA1: "A1 - مبتدئ",
    cefrA2: "A2 - مبتدئ متقدم", 
    cefrB1: "B1 - متوسط",
    cefrB2: "B2 - متوسط متقدم",
    cefrC1: "C1 - متقدم",
    cefrC2: "C2 - متقن",
    notTested: "لم يتم اختباره"
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AI_PROMPTS, ARABIC_TRANSLATIONS };
}
