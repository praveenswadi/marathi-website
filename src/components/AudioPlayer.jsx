import React, { useRef, useEffect, useState } from 'react'

const AudioPlayer = ({ verseId, isPlaying, onPlay }) => {
  const audioRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        setIsLoading(true)
        setHasError(false)
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error)
          setHasError(true)
          setIsLoading(false)
        })
      } else {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        setIsLoading(false)
      }
    }
  }, [isPlaying])

  const handlePlay = () => {
    onPlay()
    console.log(`Playing audio for verse ${verseId}`)
  }

  const handleAudioLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleAudioError = () => {
    console.error(`Failed to load audio for verse ${verseId}`)
    setHasError(true)
    setIsLoading(false)
  }

  const handleAudioEnded = () => {
    setIsLoading(false)
    // Don't trigger onPlay here - let the parent handle sequence logic
    console.log(`Audio ended for verse ${verseId}`)
  }

  return (
    <div className="audio-controls">
      <button 
        className={`play-button ${isPlaying ? 'playing' : ''} ${hasError ? 'error' : ''}`}
        onClick={handlePlay}
        disabled={isLoading}
        title={
          hasError ? 'Audio not available' : 
          isLoading ? 'Loading...' : 
          isPlaying ? 'Pause' : 'Play'
        }
      >
        {hasError ? '❌' : isLoading ? '⏳' : isPlaying ? '⏸️' : '▶️'}
      </button>
      <audio 
        ref={audioRef}
        id={`audio-${verseId}`}
        className="audio-player"
        controls={false}
        preload="none"
        onLoadedData={handleAudioLoad}
        onError={handleAudioError}
        onEnded={handleAudioEnded}
      >
        <source src={`/audio/verse-${verseId}.mp3`} type="audio/mpeg" />
        <source src={`/audio/verse-${verseId}.m4a`} type="audio/mp4" />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}

export default AudioPlayer

