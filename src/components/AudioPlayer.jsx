import React, { useRef, useEffect, useState } from 'react'

const AudioPlayer = ({ verseId, isPlaying, onToggle }) => {
  const audioRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        setIsLoading(true)
        setHasError(false)
        console.log(`Starting to play audio for verse ${verseId}, currentTime: ${audioRef.current.currentTime}`)
        audioRef.current.play().then(() => {
          console.log(`Successfully started playing verse ${verseId}`)
          setIsLoading(false)
        }).catch(error => {
          console.error('Error playing audio:', error)
          setHasError(true)
          setIsLoading(false)
        })
      } else {
        console.log(`Pausing audio for verse ${verseId}, currentTime: ${audioRef.current.currentTime}`)
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        setIsLoading(false)
      }
    }
  }, [isPlaying, verseId])

  const handleClick = () => {
    console.log(`AudioPlayer handleClick: isPlaying=${isPlaying}, verseId=${verseId}`)
    onToggle(verseId, isPlaying)
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
    console.log(`Audio ended for verse ${verseId}`)
    // Reset the audio to the beginning for next play
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
    // Notify parent that this verse has ended (which should set playingVerse to null)
    onToggle(verseId, true) // true because it was playing when it ended
  }

  return (
    <div className="audio-controls">
      <button 
        className={`play-button ${isPlaying ? 'playing' : ''} ${hasError ? 'error' : ''}`}
        onClick={handleClick}
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

