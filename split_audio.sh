#!/bin/bash

# Audio Splitter Script
# This script splits audio files into individual verse chunks

# Default values
AUDIO_FILE=""
JSON_FILE=""
OUTPUT_DIR="public/audio"
METHOD="duration"

# Function to show usage
show_usage() {
    echo "Usage: $0 <audio_file> <json_file> [options]"
    echo ""
    echo "Arguments:"
    echo "  audio_file    Path to the audio file (mp3, m4a, wav, etc.)"
    echo "  json_file     Path to the JSON file with verse data"
    echo ""
    echo "Options:"
    echo "  --method      Method: duration, silence, or timing (default: duration)"
    echo "  --output-dir  Output directory (default: public/audio)"
    echo "  --timing-file Timing file for timing method"
    echo "  --create-timing Create timing template instead of splitting"
    echo ""
    echo "Examples:"
    echo "  $0 src/data/atharvashirsha.mp3 src/data/atharvashirsha.json"
    echo "  $0 src/data/prarthana.m4a src/data/prarthana.json --method silence"
    echo "  $0 src/data/atharvashirsha.mp3 src/data/atharvashirsha.json --create-timing"
}

# Parse arguments
if [ $# -lt 2 ]; then
    show_usage
    exit 1
fi

AUDIO_FILE="$1"
JSON_FILE="$2"
shift 2

# Parse options
while [[ $# -gt 0 ]]; do
    case $1 in
        --method)
            METHOD="$2"
            shift 2
            ;;
        --output-dir)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        --timing-file)
            TIMING_FILE="$2"
            shift 2
            ;;
        --create-timing)
            CREATE_TIMING=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Check if audio file exists
if [ ! -f "$AUDIO_FILE" ]; then
    echo "Error: Audio file $AUDIO_FILE not found"
    exit 1
fi

# Check if JSON file exists
if [ ! -f "$JSON_FILE" ]; then
    echo "Error: JSON file $JSON_FILE not found"
    exit 1
fi

# Install Python dependencies if needed
if ! python3 -c "import pydub" 2>/dev/null; then
    echo "Installing Python dependencies..."
    pip3 install -r requirements.txt
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "Audio Splitter"
echo "=============="
echo "Audio file: $AUDIO_FILE"
echo "JSON file: $JSON_FILE"
echo "Output directory: $OUTPUT_DIR"
echo "Method: $METHOD"
echo ""

# Build command
CMD="python3 split_audio.py \"$AUDIO_FILE\" \"$JSON_FILE\" --method $METHOD --output-dir \"$OUTPUT_DIR\""

if [ "$CREATE_TIMING" = true ]; then
    CMD="$CMD --create-timing"
elif [ "$METHOD" = "timing" ] && [ -n "$TIMING_FILE" ]; then
    CMD="$CMD --timing-file \"$TIMING_FILE\""
fi

# Run the command
eval $CMD

echo ""
echo "Operation complete!"
if [ "$CREATE_TIMING" = true ]; then
    echo "Timing template created"
else
    echo "Audio chunks saved to: $OUTPUT_DIR"
fi
