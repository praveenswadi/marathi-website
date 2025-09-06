import React, { useState, useEffect } from 'react'
import AudioPlayer from './AudioPlayer'

const VersePage = ({ data }) => {
  const [playingVerse, setPlayingVerse] = useState(null)
  const [showTitle, setShowTitle] = useState(false)
  const [isPlayingAll, setIsPlayingAll] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(0)
  const [nextVerseToPlay, setNextVerseToPlay] = useState(0)

  const handlePlay = (verseId) => {
    // If clicking the currently playing verse, pause it
    if (playingVerse === verseId) {
      console.log(`Pausing currently playing verse: ${verseId}`)
      setPlayingVerse(null)
      if (isPlayingAll) {
        // If it was part of "Listen to All", pause the sequence
        setIsPaused(true)
        console.log('Paused "Listen to All" sequence')
      }
      return
    }

    // Stop any currently playing audio
    if (playingVerse) {
      const currentAudio = document.getElementById(`audio-${playingVerse}`)
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }
    }

    if (isPlayingAll) {
      // If playing all, pause the sequence and play the individual clip
      setIsPaused(true)
      console.log('Paused "Listen to All" sequence to play individual verse')
    }
    
    setPlayingVerse(verseId)
    
    // Find the index of the clicked verse and set it as next to play
    const verseIndex = data.verses.findIndex(verse => verse.id === verseId)
    if (verseIndex !== -1) {
      setNextVerseToPlay(verseIndex)
      console.log(`Playing individual verse: ${verseIndex} (verse ${verseId})`)
    }
  }

  const handleListenToAll = () => {
    console.log('Listen to All clicked, current state:', { isPlayingAll, isPaused, data: !!data })
    
    if (isPlayingAll && !isPaused) {
      // Pause playing all
      console.log('Pausing play all')
      setIsPaused(true)
      setPlayingVerse(null)
    } else if (isPlayingAll && isPaused) {
      // Resume playing all
      console.log('Resuming play all from index:', nextVerseToPlay)
      setIsPaused(false)
      playNextVerse(nextVerseToPlay)
    } else {
      // Start playing all
      console.log('Starting play all from index:', nextVerseToPlay)
      setIsPlayingAll(true)
      setIsPaused(false)
      setCurrentPlayingIndex(nextVerseToPlay)
    }
  }

  // Effect to start playing when isPlayingAll becomes true and not paused
  useEffect(() => {
    if (isPlayingAll && !isPaused && data) {
      console.log('isPlayingAll is true and not paused, starting to play verses from index:', nextVerseToPlay)
      playNextVerse(nextVerseToPlay)
    }
  }, [isPlayingAll, isPaused, data, nextVerseToPlay])

  const playNextVerse = (index) => {
    if (!data || index >= data.verses.length) {
      // Finished playing all verses
      if (index >= data.verses.length) {
        console.log('Finished playing all verses')
        setIsPlayingAll(false)
        setIsPaused(false)
        setPlayingVerse(null)
        setCurrentPlayingIndex(0)
        setNextVerseToPlay(0)
      }
      return
    }

    // If not playing all or paused, don't continue the sequence
    if (!isPlayingAll || isPaused) {
      console.log('Not playing all or paused, stopping sequence')
      setPlayingVerse(null)
      return
    }

    const verse = data.verses[index]
    console.log(`Playing verse ${index + 1}/${data.verses.length}: ${verse.id}`)
    setPlayingVerse(verse.id)
    setCurrentPlayingIndex(index)
    setNextVerseToPlay(index)

    // Scroll to the current verse
    scrollToVerse(verse.id)

    // Preload next verse for seamless transition
    if (index + 1 < data.verses.length) {
      const nextVerse = data.verses[index + 1]
      const nextAudioElement = document.getElementById(`audio-${nextVerse.id}`)
      if (nextAudioElement) {
        nextAudioElement.preload = 'auto'
        console.log(`Preloading next verse: ${nextVerse.id}`)
      }
    }

    // Wait a bit for the DOM to update, then look for the audio element
    setTimeout(() => {
      const audioElement = document.getElementById(`audio-${verse.id}`)
      console.log(`Looking for audio element: audio-${verse.id}`, audioElement)
      
      if (audioElement) {
        console.log(`Found audio element for verse ${verse.id}`)
        
        // Clear any existing onended handlers
        audioElement.onended = null
        
        // Set up the new handler with preloading
        audioElement.onended = () => {
          console.log(`Verse ${verse.id} ended, playing next...`)
          // Play next verse after a short delay
          setTimeout(() => {
            if (!isPaused) { // Check if not paused before playing next
              playNextVerse(index + 1)
            }
          }, 500)
        }
        
        // Try to play the audio
        console.log(`Attempting to play audio for verse ${verse.id}`)
        audioElement.play().then(() => {
          console.log(`Successfully started playing verse ${verse.id}`)
        }).catch(error => {
          console.error('Error playing audio:', error)
          // If there's an error, move to next verse
          setTimeout(() => {
            if (!isPaused) {
              playNextVerse(index + 1)
            }
          }, 1000)
        })
      } else {
        console.error(`Audio element not found: audio-${verse.id}`)
        console.log('Available audio elements:', document.querySelectorAll('audio'))
        // If audio element not found, move to next verse
        setTimeout(() => {
          if (!isPaused) {
            playNextVerse(index + 1)
          }
        }, 1000)
      }
    }, 200) // Wait 200ms for DOM to update
  }

  const scrollToVerse = (verseId) => {
    const verseElement = document.querySelector(`[data-verse-id="${verseId}"]`)
    if (verseElement) {
      const elementRect = verseElement.getBoundingClientRect()
      const absoluteElementTop = elementRect.top + window.pageYOffset
      const middle = absoluteElementTop - (window.innerHeight / 2)
      
      window.scrollTo({
        top: middle,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const pageHeader = document.querySelector('.page-header')
      if (pageHeader) {
        const headerBottom = pageHeader.offsetTop + pageHeader.offsetHeight
        setShowTitle(window.scrollY > headerBottom - 100)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">← {data.title} →</h1>
        <p className="page-subtitle">Sanskrit Verses with Marathi Translations</p>
      </div>
      
      <div className="verses-container">
        {/* Sticky Column Headers */}
        <div className="sticky-headers">
          <div className="sticky-header-left">
            <span>श्लोक</span>
            <button 
              className={`listen-all-btn ${isPlayingAll ? (isPaused ? 'paused' : 'playing') : ''}`}
              onClick={handleListenToAll}
              title={
                isPlayingAll 
                  ? (isPaused ? 'Resume playing all verses' : 'Pause playing all verses')
                  : 'Play all verses sequentially'
              }
            >
              {isPlayingAll 
                ? (isPaused ? '▶️ Resume All' : '⏸️ Pause All')
                : '▶️ Listen to All'
              }
            </button>
          </div>
          <div className={`sticky-header-center ${showTitle ? 'show' : 'hide'}`}>
            {data.title}
          </div>
          <div className="sticky-header-right">श्लोकार्थ</div>
        </div>
        
        {data.verses.map((verse) => (
          <div 
            key={verse.id} 
            className={`verse-item ${playingVerse === verse.id ? 'currently-playing' : ''}`}
            data-verse-id={verse.id}
          >
            <div className="verse-column">
              <div className="sanskrit-text-container">
                <AudioPlayer 
                  verseId={verse.id}
                  isPlaying={playingVerse === verse.id}
                  onPlay={() => handlePlay(verse.id)}
                />
                <div className={`sanskrit-text ${verse.color || 'purple'}`}>
                  {verse.sanskrit}
                </div>
              </div>
              {verse.explanation && (
                <div className="explanation-text">
                  {verse.explanation}
                </div>
              )}
            </div>
            
            <div className="verse-column">
              <div className="marathi-text">
                {verse.marathi}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VersePage

