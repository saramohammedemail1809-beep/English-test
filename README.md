# English Placement Test

A comprehensive, bilingual English placement test that measures Listening, Reading, Speaking, and optional Writing skills with CEFR-aligned scoring.

## Features

### Core Functionality
- **Fast & Accurate**: Complete test in under 10 minutes
- **CEFR-Aligned Scoring**: A1-C2 levels with confidence scores
- **Bilingual Support**: Full English/Arabic interface with RTL layout
- **Four Skills Assessment**: Listening, Reading, Speaking, Writing (optional)

### Test Sections

#### Listening (3 clips, 30-90 seconds each)
- Casual conversation about weekend trip planning
- News bulletin about local festival
- Academic explanation of how a thermometer works
- Mix of multiple-choice and gap-fill questions

#### Reading (2 passages, 100-200 words each)
- Language exchange program at local café
- Climate-friendly daily habits article
- Main idea, inference, and vocabulary-in-context questions

#### Speaking (2 timed prompts, 60 seconds each)
- Personal descriptive monologue
- Opinion/argument response
- Browser-based audio recording with transcription

#### Writing (Optional, 80-120 words)
- Problem-solution essay prompt
- Real-time word count tracking
- Can be skipped with "Not tested" result

### Results & Analytics
- **Fluency Map**: Visual radar chart of all skills
- **CEFR Levels**: Individual skill levels (A1-C2)
- **Confidence Scores**: High/Medium/Low accuracy indicators
- **Personalized Recommendations**: Specific action plans for improvement
- **Bilingual Reports**: Full Arabic translation of all feedback

### Privacy & Data Protection
- **Minimal Data Retention**: Audio deleted after scoring unless user opts in
- **Anonymized Analytics**: Only test metadata stored
- **Clear Consent**: Transparent privacy statements in both languages
- **Data Deletion**: Easy "Delete my data" option

## Technical Implementation

### Files Structure
```
├── index.html          # Main HTML structure
├── styles.css          # Complete styling with RTL support
├── script.js           # Core application logic
├── ai-prompts.js       # AI scoring prompts and translations
└── README.md           # This file
```

### Key Technologies
- **Vanilla JavaScript**: No external dependencies
- **Web Audio API**: Browser-based recording
- **CSS Grid/Flexbox**: Responsive design
- **RTL Support**: Complete Arabic layout support
- **Local Storage**: Minimal data persistence

### AI Scoring Integration
The application includes comprehensive AI prompts for CEFR-aligned scoring:

- **Listening/Reading**: Multiple-choice and gap-fill auto-scoring
- **Speaking**: Audio transcription + 5-dimension rubric evaluation
- **Writing**: Task achievement, grammar, vocabulary, cohesion assessment

### Browser Compatibility
- Modern browsers with Web Audio API support
- Mobile-responsive design
- Offline-capable (except for AI scoring)

## Usage

1. Open `index.html` in a web browser
2. Click "Start Test Now" / "ابدأ الاختبار الآن"
3. Complete each section in order
4. View detailed results with recommendations
5. Download or share your results

## Customization

### Adding New Test Content
Edit the `testData` object in `script.js` to add new questions, passages, or audio clips.

### Modifying AI Prompts
Update `ai-prompts.js` to customize scoring criteria or add new languages.

### Styling Changes
All styles are in `styles.css` with clear section organization and RTL support.

## Privacy Statement

This test processes audio data for scoring purposes only. Audio is automatically deleted after scoring unless the user explicitly chooses to save their recording. Only anonymized test metadata is stored for analytics purposes. Users can delete their data at any time using the "Delete my data" link.

## License

This project is open source and available under the MIT License.
