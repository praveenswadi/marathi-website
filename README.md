# Marathi Website - Sanskrit Verses

A comprehensive web application for displaying Sanskrit verses with Marathi translations, featuring audio synchronization, manuscript viewing, and multiple verse collections. The application provides an immersive learning experience with synchronized audio playback, original manuscript viewing, and precise timing controls.

My mother has written down thousands of pages of such wonderful material. This should be saved, published and shared with others. If you find it useful, attribute, acknowledge  and use it.

The conversion to Devanagari script from handwritten notes is done by AI. There are definitely some mistakes and in coming days, I plan to clean it up.

## Features

### Core Display Features
- **Two-column layout**: Sanskrit verses on the left, Marathi translations on the right
- **Color coding**: 
  - Purple for Sanskrit text
  - Blue for Marathi translations
  - Green for explanations/word breakdowns
- **Responsive design**: Works on desktop, tablet, and mobile
- **Print-friendly**: Optimized for printing
- **Devanagari font support**: Uses Noto Sans Devanagari for proper rendering

### 📱 Complete Mobile Optimization Package

#### **Verse Pages - Tabbed Interface**
- **Sanskrit/Marathi tabs**: Clean tabbed interface for mobile devices
- **Flowing text layout**: Optimized for singing and recitation without card separations
- **Zero wasted space**: Removed excessive padding and margins for maximum content area
- **Orientation-independent**: Consistent mobile experience in both portrait and landscape modes
- **Touch-optimized**: Large tap targets and smooth tab switching
- **Audio integration**: Full audio functionality preserved in tabbed interface

#### **Manuscript Pages - Full-Screen Experience**
- **Immersive viewing**: Full-screen manuscript display with no UI clutter
- **Swipe navigation**: Natural left/right swipe gestures to navigate between pages
- **Double-tap zoom**: Toggle between two viewing modes:
  - 🔍 **Overview Mode**: Fit-to-screen for navigation and context
  - 📖 **Reading Mode**: Fit-to-width for detailed study with vertical scrolling
- **Auto-hiding overlay**: Minimal controls (back button, page counter) that auto-hide after 3 seconds
- **Visual feedback**: Clear indicators when switching between zoom modes
- **Touch areas**: Left/right edge taps for alternative navigation
- **Smooth transitions**: CSS-based animations for natural interactions

#### **Smart Device Detection**
- **Touch-first approach**: Uses `(hover: none) and (pointer: coarse)` to detect mobile devices
- **Orientation-independent**: Works perfectly in both portrait and landscape orientations
- **Fallback support**: Dimension-based detection for older browsers
- **Desktop preservation**: Desktop experience remains completely unchanged

#### **User Experience Enhancements**
- **Intuitive gestures**: Swipe, double-tap, scroll, and tap interactions
- **Helpful hints**: On-screen guidance for new users with auto-hide functionality
- **Performance optimized**: Image preloading for smooth navigation
- **Distraction-free**: Clean interfaces focused on content consumption
- **Accessibility**: Touch-friendly controls with proper sizing and feedback

### Audio Features
- **Synchronized audio playback**: Click-to-play individual verses with precise timing
- **Multiple audio formats**: Supports MP3, M4A, WAV, OGG, and AAC
- **Audio splitting tools**: Automated tools to split long audio files into verse chunks
- **Web-based timing editor**: Visual interface for precise audio timing control
- **Word highlighting**: Synchronized highlighting during audio playback

### Manuscript Viewing
- **Original manuscript display**: View scanned images of original Sanskrit manuscripts
- **Interactive navigation**: Keyboard and mouse navigation through manuscript pages
- **Thumbnail preview**: Quick navigation with thumbnail overview
- **Multiple collections**: Manuscripts available for different verse collections
- **Responsive image viewer**: Optimized for different screen sizes

### Data Management
- **Modular data structure**: Verse data stored in separate JSON files per collection
- **Dynamic collection loading**: Automatic detection and loading of available collections
- **Homepage with collections**: Browse and select from multiple verse collections
- **Manifest-based manuscripts**: Structured metadata for manuscript images

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Available Collections

The application includes multiple Sanskrit verse collections, each with their own data files and optional manuscripts:

### Current Collections
- **अथर्वशीर्ष (Atharvashirsha)**: Core Sanskrit verses with Marathi translations
- **अथर्वशीर्षाची फलश्रुति (Atharvashirsha Phalashruti)**: Benefits of reciting Atharvashirsha
- **रामरक्षा (Raamraksha)**: Sacred protective hymn dedicated to Lord Rama
- **प्रार्थना (Prarthana)**: Sacred prayers and devotional hymns

### Data Structure
Each collection consists of:
- **JSON data file**: Contains verse text, translations, and metadata
- **Audio file** (optional): Full-length audio recording for the collection
- **Manuscript images** (optional): Scanned images of original manuscripts
- **Manifest file**: Metadata for manuscript images and navigation

### Adding New Collections
To add a new collection:
1. Create a JSON file in `src/data/` with verse data
2. Add collection metadata to `src/data/index.js`
3. Optionally add audio file and manuscript images
4. Generate manuscript manifest using the provided script

## Future Enhancements

- Search functionality across all collections
- User progress tracking and bookmarks
- Interactive learning features and quizzes
- Export functionality for verses and audio
- Offline support with service workers
- Advanced manuscript annotations and highlighting
- Multi-language support for translations

## TODO

- **Search functionality**: Implement search across verses and collections
- **User preferences**: Save user settings like preferred zoom mode, tab selection
- **Performance monitoring**: Add analytics for mobile gesture usage and performance

## Technology Stack

- **Frontend**: React 18 with React Router for navigation
- **Build Tool**: Vite for fast development and building
- **Styling**: CSS Grid, Flexbox, and custom CSS
- **Audio**: React Audio Player with custom timing controls
- **Data**: JSON-based data management with dynamic loading
- **Python Tools**: PyDub for audio processing and splitting
- **Fonts**: Noto Sans Devanagari for proper Devanagari rendering

## Project Structure

```
src/
├── components/
│   ├── HomePage.jsx           # Collection browser homepage
│   ├── DynamicVersePage.jsx  # Dynamic verse display with audio
│   ├── VersePage.jsx         # Individual verse component
│   ├── AudioPlayer.jsx       # Audio player with timing controls
│   ├── TimingEditor.jsx      # Web-based timing editor
│   ├── ManuscriptViewer.jsx  # Manuscript image viewer
│   └── *.css                 # Component-specific styles
├── data/
│   ├── index.js              # Collection metadata and loader
│   ├── loader.js             # Dynamic data loading utilities
│   ├── *.json                # Verse data files per collection
│   └── *.mp3                 # Audio files for collections
├── utils/
│   ├── audioUtils.js         # Audio processing utilities
│   ├── manuscriptUtils.js    # Manuscript management utilities
│   └── devanagariNumbers.js  # Devanagari number conversion
├── App.jsx                   # Main app with routing
├── App.css                   # Main application styles
├── index.css                 # Global styles
└── main.jsx                  # Entry point

public/
├── audio/                    # Generated verse audio chunks
├── manuscripts/              # Manuscript images and manifests
│   ├── atharvashirsha/
│   ├── raamraksha/
│   ├── prarthana/
│   └── atharvashirsha-phalashruti/
└── timing.json              # Global timing data

scripts/
└── generate-manuscript-manifest.js  # Manuscript manifest generator

Audio Processing Tools:
├── split_audio.py            # Python audio splitting script
├── split_audio.sh            # Shell wrapper for audio splitting
├── requirements.txt          # Python dependencies
└── AUDIO_SPLITTING.md        # Comprehensive audio documentation
```

## Development

The project uses Vite for fast development and building. The development server will automatically reload when you make changes to the code.

### Development URLs
- **Main application**: `http://localhost:3000`
- **Timing editor**: `http://localhost:3000/timing-editor`
- **Collection pages**: `http://localhost:3000/verse/[collection-id]`
- **Manuscript viewer**: `http://localhost:3000/manuscripts/[collection-id]`

### Python Environment (for audio processing)
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Building for Production

To build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Production Features
- Optimized bundle with code splitting
- Compressed audio and image assets
- Service worker for offline functionality (future)
- SEO-optimized meta tags

## Audio Processing

The application includes comprehensive audio processing capabilities for synchronized verse playback.

### Quick Start
1. **Install Python dependencies:**
   ```bash
   pip3 install -r requirements.txt
   ```

2. **Split audio files:**
   ```bash
   ./split_audio.sh src/data/atharvashirsha.mp3 src/data/atharvashirsha.json
   ```

### Web-Based Timing Editor
Access the timing editor at `http://localhost:3000/timing-editor` to:
- Select collections and audio files
- Set precise start/end times for each verse
- Export timing data for accurate audio splitting
- Preview audio playback with verse synchronization

### Audio Splitting Methods
- **Duration-based**: Equal time splits based on verse count
- **Silence-based**: Automatic silence detection for natural breaks
- **Manual timing**: Precise control using the web editor

### Supported Formats
- MP3, M4A, WAV, OGG, AAC audio formats
- Automatic format detection and conversion
- Cross-platform compatibility

## Manuscript Management

### Viewing Manuscripts
- Navigate to any collection with available manuscripts
- Click "Manuscript" link to view original scanned images
- Use keyboard arrows or mouse to navigate pages
- Thumbnail overview for quick page selection

### Adding Manuscripts
1. Create collection folder in `public/manuscripts/`
2. Add image files (JPG, PNG, etc.)
3. Generate manifest: `node scripts/generate-manuscript-manifest.js`
4. Update collection metadata to enable manuscript links

## Adding New Verses

To add new verses to an existing collection:

1. **Edit the JSON file** in `src/data/` for the desired collection
2. **Add verse data** with the following structure:
   ```json
   {
     "id": "unique-verse-id",
     "sanskrit": "Sanskrit text",
     "marathi": "Marathi translation",
     "explanation": "Optional explanation",
     "color": "purple"
   }
   ```

3. **Add audio** (optional):
   - Place audio file in `src/data/` with matching name
   - Use audio splitting tools to create verse chunks
   - Update timing data if needed

4. **Add manuscripts** (optional):
   - Add images to `public/manuscripts/[collection-id]/`
   - Generate manifest file
   - Update collection metadata

## Documentation

### Comprehensive Guides
- **[AUDIO_SPLITTING.md](./AUDIO_SPLITTING.md)**: Complete guide to audio processing, splitting, and timing synchronization
- **Component Documentation**: Each React component includes detailed comments and prop descriptions
- **Data Format**: JSON structure documentation in `src/data/` files

### Key Features Documentation
- **Audio Synchronization**: How to set up precise timing for verse playback
- **Manuscript Management**: Adding and organizing manuscript images
- **Collection Management**: Creating and managing verse collections
- **Timing Editor**: Using the web-based timing control interface

### Troubleshooting
- **Audio Issues**: Check `AUDIO_SPLITTING.md` for common audio problems
- **Manuscript Loading**: Verify manifest files and image paths
- **Data Loading**: Check JSON file format and collection metadata
- **Development Setup**: Ensure all dependencies are installed correctly

