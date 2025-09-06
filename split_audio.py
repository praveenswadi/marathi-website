#!/usr/bin/env python3
"""
Audio Splitter for Atharvashirsha
Splits the main audio file into individual verse chunks based on the JSON structure.
"""

import json
import os
import sys
from pydub import AudioSegment
from pydub.silence import split_on_silence, detect_silence
import argparse

def load_verse_data(json_file):
    """Load verse data from JSON file"""
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data['verses']

def split_audio_by_duration(audio_file, verses, output_dir="audio_chunks"):
    """Split audio into equal duration chunks based on verse count"""
    print(f"Loading audio file: {audio_file}")
    audio = AudioSegment.from_file(audio_file)
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Calculate duration per chunk
    total_duration = len(audio)
    chunk_duration = total_duration // len(verses)
    
    print(f"Total duration: {total_duration / 1000:.2f} seconds")
    print(f"Number of verses: {len(verses)}")
    print(f"Chunk duration: {chunk_duration / 1000:.2f} seconds")
    
    # Split audio into chunks
    for i, verse in enumerate(verses):
        start_time = i * chunk_duration
        end_time = start_time + chunk_duration
        
        # For the last chunk, extend to the end of the audio
        if i == len(verses) - 1:
            end_time = total_duration
        
        chunk = audio[start_time:end_time]
        
        # Export chunk
        output_file = os.path.join(output_dir, f"verse-{verse['id']}.mp3")
        chunk.export(output_file, format="mp3")
        
        print(f"Exported verse {verse['id']}: {start_time/1000:.2f}s - {end_time/1000:.2f}s")
    
    print(f"\nAll chunks exported to {output_dir}/")

def split_audio_by_silence(audio_file, verses, output_dir="audio_chunks", min_silence_len=1000, silence_thresh=-40):
    """Split audio based on silence detection"""
    print(f"Loading audio file: {audio_file}")
    audio = AudioSegment.from_file(audio_file)
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    print("Detecting silence...")
    chunks = split_on_silence(
        audio,
        min_silence_len=min_silence_len,
        silence_thresh=silence_thresh,
        keep_silence=500  # Keep 500ms of silence at the beginning and end
    )
    
    print(f"Found {len(chunks)} silence-based chunks")
    
    # If we have more chunks than verses, we need to merge some
    if len(chunks) > len(verses):
        print("Merging excess chunks...")
        # Merge chunks to match verse count
        merged_chunks = []
        chunks_per_verse = len(chunks) // len(verses)
        remainder = len(chunks) % len(verses)
        
        start_idx = 0
        for i in range(len(verses)):
            end_idx = start_idx + chunks_per_verse + (1 if i < remainder else 0)
            merged_chunk = sum(chunks[start_idx:end_idx])
            merged_chunks.append(merged_chunk)
            start_idx = end_idx
        
        chunks = merged_chunks
    
    # Export chunks
    for i, (chunk, verse) in enumerate(zip(chunks, verses)):
        output_file = os.path.join(output_dir, f"verse-{verse['id']}.mp3")
        chunk.export(output_file, format="mp3")
        print(f"Exported verse {verse['id']}: {len(chunk)/1000:.2f}s")

def create_manual_timing_file(verses, json_file, output_file=None):
    """Create a template timing file for manual adjustment"""
    if output_file is None:
        # Generate filename based on JSON file
        base_name = os.path.splitext(os.path.basename(json_file))[0]
        output_file = f"timing-{base_name}.json"
    
    timing_data = {
        "verses": []
    }
    
    for verse in verses:
        timing_data["verses"].append({
            "id": verse["id"],
            "start_time": 0,  # in seconds
            "end_time": 0,    # in seconds
            "sanskrit": verse["sanskrit"][:50] + "..." if len(verse["sanskrit"]) > 50 else verse["sanskrit"]
        })
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(timing_data, f, indent=2, ensure_ascii=False)
    
    print(f"Created timing template: {output_file}")
    print("Edit this file to set precise start/end times for each verse")

def split_audio_by_timing(audio_file, timing_file, output_dir="audio_chunks"):
    """Split audio based on manual timing file"""
    with open(timing_file, 'r', encoding='utf-8') as f:
        timing_data = json.load(f)
    
    print(f"Loading audio file: {audio_file}")
    audio = AudioSegment.from_file(audio_file)
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    for verse_timing in timing_data["verses"]:
        verse_id = verse_timing["id"]
        start_time = verse_timing["start_time"] * 1000  # Convert to milliseconds
        end_time = verse_timing["end_time"] * 1000
        
        chunk = audio[start_time:end_time]
        output_file = os.path.join(output_dir, f"verse-{verse_id}.mp3")
        chunk.export(output_file, format="mp3")
        
        print(f"Exported verse {verse_id}: {start_time/1000:.2f}s - {end_time/1000:.2f}s")

def main():
    parser = argparse.ArgumentParser(description="Split audio into verse chunks")
    parser.add_argument("audio_file", help="Path to the audio file")
    parser.add_argument("json_file", help="Path to the JSON file with verse data")
    parser.add_argument("--method", choices=["duration", "silence", "timing"], default="duration",
                       help="Method to use for splitting (default: duration)")
    parser.add_argument("--output-dir", default="public/audio", help="Output directory for chunks")
    parser.add_argument("--timing-file", help="Timing file for manual timing method")
    parser.add_argument("--create-timing", action="store_true", help="Create timing template file")
    
    args = parser.parse_args()
    
    # Load verse data
    verses = load_verse_data(args.json_file)
    print(f"Loaded {len(verses)} verses from {args.json_file}")
    
    if args.create_timing:
        create_manual_timing_file(verses, args.json_file)
        return
    
    if args.method == "duration":
        split_audio_by_duration(args.audio_file, verses, args.output_dir)
    elif args.method == "silence":
        split_audio_by_silence(args.audio_file, verses, args.output_dir)
    elif args.method == "timing":
        if not args.timing_file:
            print("Error: --timing-file is required for timing method")
            sys.exit(1)
        split_audio_by_timing(args.audio_file, args.timing_file, args.output_dir)

if __name__ == "__main__":
    main()
