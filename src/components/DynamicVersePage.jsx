import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCollectionById, getPreviousCollection, getNextCollection } from '../data/index'
import { loadCollectionData } from '../data/loader'
import AudioPlayer from './AudioPlayer'
import '../App.css'

const DynamicVersePage = () => {
  const { collectionId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [playingVerse, setPlayingVerse] = useState(null)
  const [showTitle, setShowTitle] = useState(false)
  const [isPlayingAll, setIsPlayingAll] = useState(false)
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(0)
  
  // Get navigation collections
  const previousCollection = getPreviousCollection(collectionId)
  const nextCollection = getNextCollection(collectionId)

  useEffect(() => {
    const loadData = () => {
      try {
        const collection = getCollectionById(collectionId)
        if (!collection) {
          throw new Error('Collection not found')
        }
        
        const collectionData = loadCollectionData(collectionId)
        if (!collectionData) {
          throw new Error('Collection data not found')
        }
        
        setData(collectionData)
      } catch (error) {
        console.error('Error loading data:', error)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [collectionId])

  // Handle scroll for title visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setShowTitle(scrollTop > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handlePlay = (verseId) => {
    if (isPlayingAll) {
      // If playing all, stop the sequence
      setIsPlayingAll(false)
      setPlayingVerse(null)
      setCurrentPlayingIndex(0)
    } else {
      setPlayingVerse(playingVerse === verseId ? null : verseId)
    }
  }

  const handleListenToAll = () => {
    console.log('Listen to All clicked, current state:', { isPlayingAll, data: !!data })
    
    if (isPlayingAll) {
      // Stop playing all
      console.log('Stopping play all')
      setIsPlayingAll(false)
      setPlayingVerse(null)
      setCurrentPlayingIndex(0)
    } else {
      // Start playing all
      console.log('Starting play all')
      setIsPlayingAll(true)
      setCurrentPlayingIndex(0)
    }
  }

  // Effect to start playing when isPlayingAll becomes true
  useEffect(() => {
    if (isPlayingAll && data) {
      console.log('isPlayingAll is true, starting to play verses')
      playNextVerse(0)
    }
  }, [isPlayingAll, data])

  const playNextVerse = (index) => {
    if (!data || !isPlayingAll || index >= data.verses.length) {
      // Finished playing all verses
      console.log('Finished playing all verses or stopped')
      setIsPlayingAll(false)
      setPlayingVerse(null)
      setCurrentPlayingIndex(0)
      return
    }

    const verse = data.verses[index]
    console.log(`Playing verse ${index + 1}/${data.verses.length}: ${verse.id}`)
    setPlayingVerse(verse.id)
    setCurrentPlayingIndex(index)

    // Scroll to the current verse
    scrollToVerse(verse.id)

    // Wait a bit for the DOM to update, then look for the audio element
    setTimeout(() => {
      const audioElement = document.getElementById(`audio-${verse.id}`)
      console.log(`Looking for audio element: audio-${verse.id}`, audioElement)
      
      if (audioElement) {
        console.log(`Found audio element for verse ${verse.id}`)
        
        // Clear any existing onended handlers
        audioElement.onended = null
        
        // Set up the new handler
        audioElement.onended = () => {
          console.log(`Verse ${verse.id} ended, playing next...`)
          // Play next verse after a short delay
          setTimeout(() => {
            playNextVerse(index + 1)
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
            playNextVerse(index + 1)
          }, 1000)
        })
      } else {
        console.error(`Audio element not found: audio-${verse.id}`)
        console.log('Available audio elements:', document.querySelectorAll('audio'))
        // If audio element not found, move to next verse
        setTimeout(() => {
          playNextVerse(index + 1)
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading verses...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="error-container">
        <h2>Collection not found</h2>
        <p>The requested verse collection could not be found.</p>
        <Link to="/" className="back-button">← Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="App">
      <div className="page-container">
        <div className="page-header">
          <Link to="/" className="back-link">← Back to Collections</Link>
          <h1 className="page-title">
            {previousCollection ? (
              <Link to={`/verse/${previousCollection.id}`} className="nav-link prev-link">
                ← {previousCollection.title}
              </Link>
            ) : (
              <span className="nav-link disabled">←</span>
            )}
            <span className="current-title"> {data.title} </span>
            {nextCollection ? (
              <Link to={`/verse/${nextCollection.id}`} className="nav-link next-link">
                {nextCollection.title} →
              </Link>
            ) : (
              <span className="nav-link disabled">→</span>
            )}
          </h1>
          <p className="page-subtitle">Sanskrit Verses with Marathi Translations</p>
        </div>
        
        <div className="verses-container">
          {/* Sticky Column Headers */}
          <div className="sticky-headers">
            <div className="sticky-header-left">
              <span>श्लोक</span>
              <button 
                className={`listen-all-btn ${isPlayingAll ? 'playing' : ''}`}
                onClick={handleListenToAll}
                title={isPlayingAll ? 'Stop playing all verses' : 'Play all verses sequentially'}
              >
                {isPlayingAll ? '⏹️ Stop All' : '▶️ Listen to All'}
              </button>
            </div>
            <div className={`sticky-header-center ${showTitle ? 'show' : 'hide'}`}>
              {previousCollection ? (
                <Link to={`/verse/${previousCollection.id}`} className="nav-link prev-link">
                  ← {previousCollection.title}
                </Link>
              ) : (
                <span className="nav-link disabled">←</span>
              )}
              <span className="current-title"> {data.title} </span>
              {nextCollection ? (
                <Link to={`/verse/${nextCollection.id}`} className="nav-link next-link">
                  {nextCollection.title} →
                </Link>
              ) : (
                <span className="nav-link disabled">→</span>
              )}
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
    </div>
  )
}

export default DynamicVersePage
