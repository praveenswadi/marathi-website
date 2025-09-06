# Marathi Website - Sanskrit Verses

A beautiful website for displaying Sanskrit verses with Marathi translations, featuring a two-column layout with color-coded text and future audio integration capabilities.

## Features

- **Two-column layout**: Sanskrit verses on the left, Marathi translations on the right
- **Color coding**: 
  - Purple for Sanskrit text
  - Blue for Marathi translations
  - Green for explanations/word breakdowns
- **Responsive design**: Works on desktop, tablet, and mobile
- **Audio integration ready**: Prepared for future audio features with word highlighting
- **Print-friendly**: Optimized for printing
- **Devanagari font support**: Uses Noto Sans Devanagari for proper rendering

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

## Future Enhancements

- Audio playback with synchronized word highlighting
- Search functionality
- Multiple verse collections
- User progress tracking
- Interactive learning features

## Technology Stack

- React 18
- Vite (for fast development and building)
- CSS Grid and Flexbox for layout
- Noto Sans Devanagari font for proper Devanagari rendering

## Project Structure

```
src/
├── components/
│   ├── VersePage.jsx      # Main page component
│   └── AudioPlayer.jsx    # Audio player component
├── App.jsx                # Main app component
├── App.css               # Main styles
├── index.css             # Global styles
└── main.jsx              # Entry point
```

## Development

The project uses Vite for fast development and building. The development server will automatically reload when you make changes to the code.

## Building for Production

To build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Adding New Verses

To add new verses, simply add them to the `sampleData` object in `src/App.jsx`. Each verse should have:

- `id`: Unique identifier
- `sanskrit`: The Sanskrit text
- `marathi`: The Marathi translation
- `explanation`: Optional explanation or word breakdown
- `color`: Color theme (currently only "purple" is used)

