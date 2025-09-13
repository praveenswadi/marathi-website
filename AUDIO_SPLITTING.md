# Audio Splitting for Sanskrit Verses

This document explains how to split audio files into individual verse chunks that correspond to the verses in JSON files. The system automatically detects available collections and supports multiple audio formats.

## Quick Start

1. **Install Python dependencies:**
   ```bash
   pip3 install -r requirements.txt
   ```

2. **Split any audio file:**
   ```bash
   ./split_audio.sh src/data/atharvashirsha.mp3 src/data/atharvashirsha.json
   ```

This will create individual MP3 files for each verse in the `public/audio/` directory.

## Web-Based Timing Editor

For precise timing control, use the web-based timing editor:

1. **Access the editor**: Go to `http://localhost:3000/timing-editor`
2. **Select collection**: Choose from available JSON files and their corresponding audio files
3. **Set timings**: Click verses while playing to record precise start/end times
4. **Export**: Download the timing file and use it for precise audio splitting

## Manual Methods

### Method 1: Equal Duration Splitting (Default)
Splits the audio into equal duration chunks based on the number of verses:

```bash
python3 split_audio.py src/data/atharvashirsha.mp3 src/data/atharvashirsha.json --method duration
```

### Method 2: Silence-Based Splitting
Automatically detects silence and splits the audio:

```bash
python3 split_audio.py src/data/atharvashirsha.mp3 src/data/atharvashirsha.json --method silence
```

### Method 3: Manual Timing (Most Accurate)
Create a timing template and manually set start/end times for each verse:

1. **Create timing template:**
   ```bash
   python3 split_audio.py src/data/atharvashirsha.mp3 src/data/atharvashirsha.json --create-timing
   ```

2. **Edit the generated `timing-atharvashirsha.json` file** to set precise start and end times for each verse.

3. **Split using timing file:**
   ```bash
   python3 split_audio.py src/data/atharvashirsha.mp3 src/data/atharvashirsha.json --method timing --timing-file timing-atharvashirsha.json
   ```

## Supported Audio Formats

The system automatically detects and supports:
- **MP3** (`.mp3`)
- **M4A** (`.m4a`) 
- **WAV** (`.wav`)
- **OGG** (`.ogg`)
- **AAC** (`.aac`)

## Available Collections

The timing editor automatically detects collections by looking for:
- JSON files in `src/data/` directory
- Corresponding audio files with matching names
- Supported audio formats (MP3, M4A, WAV, OGG, AAC)

Current collections:
- `atharvashirsha` - Atharvashirsha verses
- `atharvashirsha-phalashruti` - Atharvashirsha Phalashruti
- `prarthana` - Prarthana (Sacred Prayers)

## Output

The script creates individual audio files named `verse-{id}.mp3` in the specified output directory (default: `public/audio/`).

For example:
- `verse-1.mp3` - First verse
- `verse-2.mp3` - Second verse
- etc.

## Audio Player Integration

The `AudioPlayer` component automatically looks for audio files in the `/audio/` directory and supports both MP3 and M4A formats. It includes:

- Loading states
- Error handling
- Auto-stop when audio ends
- Visual feedback for different states

## Troubleshooting

### Audio files not playing
1. Check that the audio files exist in `public/audio/`
2. Verify the file names match the pattern `verse-{id}.mp3`
3. Check browser console for error messages

### Python dependencies not found
```bash
pip3 install pydub
```

### Audio splitting fails
- Ensure the audio file is in a supported format (M4A, MP3, WAV, etc.)
- Check that the JSON file is valid and contains verse data
- Try different splitting methods (duration vs silence)

## File Structure

```
marathi-website/
├── src/data/
│   ├── atharvashirsha.m4a          # Main audio file
│   └── atharvashirsha.json         # Verse data
├── public/audio/                   # Generated audio chunks
│   ├── verse-1.mp3
│   ├── verse-2.mp3
│   └── ...
├── split_audio.py                  # Python splitting script
├── split_audio.sh                  # Shell script wrapper
├── requirements.txt                # Python dependencies
└── timing.json                     # Manual timing template (generated)
```
