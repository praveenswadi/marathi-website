import React, { useRef, useEffect } from 'react'

const AudioPlayer = ({ verseId, isPlaying, onPlay }) => {
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [isPlaying])

  // Placeholder for future audio implementation
  const handlePlay = () => {
    onPlay()
    // TODO: Add actual audio file loading and word highlighting
    console.log(`Playing audio for verse ${verseId}`)
  }

  return (
    <div className="audio-controls">
      <button 
        className={`play-button ${isPlaying ? 'playing' : ''}`}
        onClick={handlePlay}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      <audio 
        ref={audioRef}
        className="audio-player"
        controls={false}
        preload="none"
      >
        {/* Audio source will be added when audio files are available */}
        <source src={`/audio/verse-${verseId}.mp3`} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}

export default AudioPlayer

