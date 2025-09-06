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
    setPlayingVerse(playingVerse === verseId ? null : verseId)
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
            <div className="sticky-header-left">श्लोक</div>
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
            <div key={verse.id} className="verse-item">
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
